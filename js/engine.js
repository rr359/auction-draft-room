/* Draft engine: pure functions over (state, players). No DOM access.
 * Loads in the browser as window.DraftEngine and in Node via require('./engine.js'). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DraftEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

// The league the price sheet was built for. Prices rescale relative to this.
var BASE = { teams: 14, budget: 200, rosterSize: 13, minBid: 1 };

/* ---------------- state ---------------- */

function freshState(defaults) {
  return {
    version: 2,
    settings: { budget: defaults.budget, minBid: defaults.minBid, slots: defaults.slots.slice(), leagueName: defaults.leagueName, scoring: defaults.scoring },
    teams: defaults.teams.map(function (n) { return { name: n }; }),
    myTeam: defaults.myTeam || 0,
    picks: [],      // {id, team, price, ts}
    custom: [],     // unlisted players: {id:'c1', name, pos, team, tier, exp, ceil, flags, note}
    punt: 'none'    // none | ft | to | ast
  };
}

/* Accepts a v2 state, or the v1 export from the original single-file app
 * ({teams, myTeam, picks:[{p:index,t,pr}], punt, custom}). Returns a v2 state or null. */
function migrate(raw, defaults, basePlayers) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.teams) || !Array.isArray(raw.picks)) return null;
  if (raw.version === 2) {
    var s = freshState(defaults);
    s.settings = Object.assign(s.settings, raw.settings || {});
    s.teams = raw.teams.map(function (t) { return { name: String(t.name || 'Team') }; });
    s.myTeam = Math.min(Math.max(0, raw.myTeam | 0), s.teams.length - 1);
    s.picks = raw.picks.filter(function (p) { return p && p.id != null; }).map(function (p) {
      return { id: p.id, team: p.team | 0, price: Number(p.price) || 0, ts: p.ts || Date.now() };
    });
    s.custom = Array.isArray(raw.custom) ? raw.custom : [];
    s.punt = raw.punt || 'none';
    return s;
  }
  // v1: picks reference an index into PLAYERS.concat(custom)
  var v2 = freshState(defaults);
  v2.teams = raw.teams.map(function (t) { return { name: String(t.name || 'Team') }; });
  v2.myTeam = raw.myTeam | 0;
  v2.punt = raw.punt === 'blk' ? 'none' : (raw.punt || 'none');
  v2.custom = (raw.custom || []).map(function (c, i) { return Object.assign({}, c, { id: 'c' + (i + 1) }); });
  var n = basePlayers.length;
  v2.picks = raw.picks.map(function (pk) {
    var id = pk.p < n ? basePlayers[pk.p].id : (v2.custom[pk.p - n] || {}).id;
    return { id: id, team: pk.t | 0, price: Number(pk.pr) || 0, ts: pk.ts || Date.now() };
  }).filter(function (p) { return p.id != null; });
  return v2;
}

/* ---------------- positions & roster fitting ---------------- */

var SLOT_ACCEPTS = { PG: ['PG', 'G'], SG: ['SG', 'G'], G: ['G', 'PG', 'SG'], SF: ['SF', 'F'], PF: ['PF', 'F'], F: ['F', 'SF', 'PF'], C: ['C'] };

function slotKind(slot) {
  var s = String(slot).toUpperCase();
  if (s === 'BN' || s === 'BENCH') return 'bench';
  if (s === 'UTIL' || s === 'UTL' || s === 'FLEX') return 'flex';
  return 'pos';
}
function posParts(pos) { return String(pos || '').toUpperCase().split('/').map(function (x) { return x.trim(); }); }
function canPlay(pos, slot) {
  var kind = slotKind(slot);
  if (kind !== 'pos') return true;
  var parts = posParts(pos);
  return String(slot).toUpperCase().split('/').some(function (s) {
    var acc = SLOT_ACCEPTS[s] || [s];
    return parts.some(function (p) { return acc.indexOf(p) >= 0; });
  });
}

/* Max bipartite matching, in phases: positional slots, then UTIL, then bench.
 * entries: [{pos, price, ...}] -> {slots:[{slot, entry|null}], overflow:[entry]} */
function assignRoster(entries, slots) {
  var order = entries.slice().sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
  var owner = slots.map(function () { return -1; });
  var placed = order.map(function () { return false; });
  ['pos', 'flex', 'bench'].forEach(function (kind) {
    var idx = [];
    slots.forEach(function (s, i) { if (slotKind(s) === kind) idx.push(i); });
    if (!idx.length) return;
    function augment(e, seen) {
      for (var k = 0; k < idx.length; k++) {
        var i = idx[k];
        if (seen[i] || !canPlay(order[e].pos, slots[i])) continue;
        seen[i] = true;
        if (owner[i] === -1 || augment(owner[i], seen)) { owner[i] = e; return true; }
      }
      return false;
    }
    for (var e = 0; e < order.length; e++) if (!placed[e] && augment(e, {})) placed[e] = true;
  });
  return {
    slots: slots.map(function (s, i) { return { slot: s, entry: owner[i] === -1 ? null : order[owner[i]] }; }),
    overflow: order.filter(function (_, e) { return !placed[e]; })
  };
}

function startersFilled(assign) {
  return assign.slots.filter(function (s) { return s.entry && slotKind(s.slot) !== 'bench'; }).length;
}

/* Would adding a player of `pos` fill an empty starting slot? Returns the newly filled slot name or null. */
function starterSlotFor(entries, slots, pos) {
  var before = assignRoster(entries, slots);
  var after = assignRoster(entries.concat([{ pos: pos, price: 0 }]), slots);
  if (startersFilled(after) <= startersFilled(before)) return null;
  // Name the slot that went from empty to filled (other players may have shuffled to make room).
  for (var i = 0; i < slots.length; i++) {
    if (!before.slots[i].entry && after.slots[i].entry && slotKind(slots[i]) !== 'bench') return slots[i];
  }
  return null;
}

/* ---------------- money ---------------- */

function sum(a, f) { var t = 0; for (var i = 0; i < a.length; i++) t += f(a[i]); return t; }
function surplusValue(exp, minBid) { return Math.max(0, exp - minBid); }

/* Dollars above min bid, per unit of sheet value, for the top `depth` players of `pool`. */
function dollarsPerValue(disc, pool, depth, minBid) {
  var top = pool.slice().sort(function (a, b) { return b.exp - a.exp; }).slice(0, Math.max(0, depth));
  var curve = sum(top, function (p) { return surplusValue(p.exp, BASE.minBid); });
  return curve > 0 ? disc / curve : 1;
}

/* ---------------- the model ---------------- */

/* Build everything the UI and advisor need from the raw state. Cheap enough to call on every render. */
function buildModel(state, basePlayers) {
  var st = state.settings, minBid = st.minBid, slots = st.slots;
  var nTeams = state.teams.length, rosterSize = slots.length;
  var all = basePlayers.concat(state.custom || []);
  var byId = {};
  all.forEach(function (p) { byId[String(p.id)] = p; });

  var pickIndex = {};
  state.picks.forEach(function (pk, i) { pickIndex[String(pk.id)] = i; });

  // --- price scaling ---
  var kBase = dollarsPerValue(BASE.teams * (BASE.budget - BASE.rosterSize * BASE.minBid), basePlayers, BASE.teams * BASE.rosterSize, BASE.minBid);
  var k0 = dollarsPerValue(nTeams * (st.budget - rosterSize * minBid), basePlayers, nTeams * rosterSize, minBid);
  var spentTotal = sum(state.picks, function (p) { return p.price; });
  var pool = nTeams * st.budget;
  var openSpots = Math.max(0, nTeams * rosterSize - state.picks.length);
  var moneyLeft = pool - spentTotal;
  var avail = all.filter(function (p) { return pickIndex[String(p.id)] === undefined; });
  var kNow = openSpots > 0 ? dollarsPerValue(Math.max(0, moneyLeft - openSpots * minBid), avail, openSpots, minBid) : k0;
  var scale = k0 / kBase;          // league-size scaling, fixed for the draft
  var marketMult = kNow / kBase;   // live market (includes inflation)
  var inflation = kNow / k0;       // >1 room has more $ than value left

  function market(p) { return minBid + surplusValue(p.exp, BASE.minBid) * marketMult; }
  function ceil(p) { return minBid + surplusValue(p.ceil, BASE.minBid) * scale; }
  function value(p) { return minBid + surplusValue(p.exp, BASE.minBid) * scale; }

  // --- teams ---
  var teams = state.teams.map(function (t, i) {
    return { idx: i, name: t.name, isMe: i === state.myTeam, spent: 0, entries: [] };
  });
  state.picks.forEach(function (pk, i) {
    var t = teams[pk.team], p = byId[String(pk.id)];
    if (!t || !p) return;
    t.spent += pk.price;
    t.entries.push({ pos: p.pos, price: pk.price, player: p, pick: pk, pickNo: i + 1 });
  });
  teams.forEach(function (t) {
    t.count = t.entries.length;
    t.left = st.budget - t.spent;
    t.open = Math.max(0, rosterSize - t.count);
    t.maxBid = t.open > 0 ? Math.max(0, t.left - (t.open - 1) * minBid) : 0;
    t.perSlot = t.open > 0 ? t.left / t.open : 0;
    t.roster = assignRoster(t.entries, slots);
    t.openStarters = t.roster.slots.filter(function (s) { return !s.entry && slotKind(s.slot) !== 'bench'; }).map(function (s) { return s.slot; });
    t.valueIn = sum(t.entries, function (e) { return value(e.player); });
    t.surplus = t.valueIn - t.spent;
  });

  var players = all.map(function (p) {
    var pi = pickIndex[String(p.id)];
    var pk = pi === undefined ? null : state.picks[pi];
    return {
      p: p, id: p.id, taken: !!pk, pick: pk, pickNo: pk ? pi + 1 : null,
      market: market(p), ceil: ceil(p), value: value(p)
    };
  });

  return {
    state: state, settings: st, minBid: minBid, slots: slots, rosterSize: rosterSize,
    teams: teams, me: teams[state.myTeam], players: players,
    byId: function (id) { return byId[String(id)]; },
    row: function (id) { return players.filter(function (r) { return String(r.id) === String(id); })[0]; },
    available: players.filter(function (r) { return !r.taken; }),
    market: market, ceil: ceil, value: value,
    pool: pool, spentTotal: spentTotal, moneyLeft: moneyLeft, openSpots: openSpots,
    inflation: inflation, scale: scale, picksMade: state.picks.length,
    totalSpots: nTeams * rosterSize
  };
}

/* ---------------- helpers ---------------- */

function normalize(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’‘`']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
/* Rank players for a typeahead query: prefix of full name or last name beats substring. */
function searchPlayers(rows, q, limit) {
  var n = normalize(q);
  if (!n) return [];
  var out = [];
  rows.forEach(function (r) {
    var name = normalize(r.p.name), team = normalize(r.p.team), score = -1;
    var words = name.split(' ');
    if (name === n) score = 100;
    else if (name.indexOf(n) === 0) score = 80;
    else if (words.some(function (w) { return w.indexOf(n) === 0; })) score = 60;
    else if (name.indexOf(n) >= 0) score = 40;
    else if (n.split(' ').every(function (t) { return name.indexOf(t) >= 0; })) score = 30;
    else if (team.indexOf(n) >= 0) score = 10;
    if (score >= 0) out.push({ r: r, score: score - (r.taken ? 50 : 0) - r.p.rank / 1000 });
  });
  out.sort(function (a, b) { return b.score - a.score; });
  return out.slice(0, limit || 8).map(function (x) { return x.r; });
}

return {
  BASE: BASE, freshState: freshState, migrate: migrate,
  slotKind: slotKind, canPlay: canPlay, assignRoster: assignRoster, starterSlotFor: starterSlotFor,
  buildModel: buildModel, normalize: normalize, searchPlayers: searchPlayers
};
});
