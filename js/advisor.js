/* Recommendation engine. Pure rules over the model from DraftEngine.buildModel().
 * Browser: window.DraftAdvisor. Node: require('./advisor.js'). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./engine.js'));
  else root.DraftAdvisor = factory(root.DraftEngine);
})(typeof self !== 'undefined' ? self : this, function (E) {
'use strict';

var PUNT_LABEL = { none: 'No punt', ft: 'Punt FT%', to: 'Punt TO', ast: 'Punt AST' };
var TOP_TWO_CAP = 0.70; // never more than 70% of budget on your top two players
var MAX_BUMP = 0.06;    // fit/scarcity/punt can lift a ceiling by at most 6%

function has(p, f) { return (p.flags || []).indexOf(f) >= 0; }
function flr(x) { return Math.floor(x + 1e-9); }
function phaseOf(m) {
  var spentPct = m.spentTotal / m.pool;
  if (spentPct < 0.35) return 'early';
  if (spentPct < 0.75) return 'mid';
  return 'late';
}

/* Flag counts for a roster: how committed is this team to a category direction? */
function profile(team) {
  var c = { ft: 0, to: 0, ast: 0, blk: 0, stl: 0, injury: 0, bust: 0, names: {} };
  team.entries.forEach(function (e) {
    ['ft', 'to', 'ast', 'blk', 'stl', 'injury', 'bust'].forEach(function (f) {
      if (has(e.player, f)) { c[f]++; (c.names[f] = c.names[f] || []).push(e.player.name); }
    });
  });
  return c;
}

function suggestPunt(prof) {
  if (prof.ft >= 2) return 'ft';
  if (prof.to >= 2) return 'to';
  if (prof.ast >= 2) return 'ast';
  return null;
}

/* Who else can (and wants to) pay for this player? */
function rivalsFor(m, row) {
  return m.teams.filter(function (t) { return !t.isMe && t.open > 0 && t.maxBid >= Math.max(m.minBid, Math.round(row.market)); })
    .map(function (t) {
      return { team: t, needs: !!E.starterSlotFor(t.entries, m.slots, row.p.pos) };
    })
    .sort(function (a, b) { return (b.needs - a.needs) || (b.team.maxBid - a.team.maxBid); });
}

/* Supply of other quality options for a positional slot (excludes `exceptId`). */
function supplyFor(m, slot, exceptId, minPrice) {
  return m.available.filter(function (r) {
    return String(r.id) !== String(exceptId) && r.market >= minPrice && E.canPlay(r.p.pos, slot);
  });
}

/* The core call: what should I do when this player is nominated? */
function bidAdvice(m, state, row) {
  var me = m.me, p = row.p, mkt = Math.max(m.minBid, Math.round(row.market));
  var out = { row: row, market: mkt, ceil: row.ceil, reasons: [], cautions: [], verdict: 'PASS', upTo: 0, enforceTo: 0, slot: null };
  if (row.taken) { out.verdict = 'TAKEN'; return out; }
  if (me.open <= 0) { out.verdict = 'FULL'; out.reasons.push('Your roster is full.'); return out; }

  var openAfter = me.open - 1;
  var legalMax = me.maxBid;
  out.legalMax = legalMax;
  if (legalMax < m.minBid) { out.verdict = 'CANT'; out.reasons.push('No dollars above your $' + m.minBid + '-per-slot reserve.'); return out; }

  var slot = E.starterSlotFor(me.entries, m.slots, p.pos);
  out.slot = slot;
  var startersOpen = me.openStarters.length;
  var adj = row.ceil, pct = 0;

  // Fit: starters matter; bench-only buys only at a discount (unless only bench is left).
  if (slot) {
    out.reasons.push('Fills your open ' + slot + ' slot.');
    if (E.slotKind(slot) === 'pos') {
      var floor = Math.max(5, mkt * 0.3);
      var supply = supplyFor(m, slot, row.id, floor).length;
      var needers = m.teams.filter(function (t) { return !t.isMe && t.openStarters.some(function (s) { return E.slotKind(s) === 'pos' && E.canPlay(p.pos, s); }); }).length;
      out.supply = supply;
      if (supply <= 3) { pct += 0.10; out.reasons.push('Scarce: only ' + supply + ' other ' + slot + '-eligible options at $' + Math.round(floor) + '+ (' + needers + ' rivals still need one).'); }
    }
  } else if (startersOpen > 0) {
    adj = Math.min(adj, row.market * 0.75);
    out.cautions.push('Would only sit on your bench (open starters: ' + me.openStarters.join(', ') + '). Buy only at a discount.');
  }

  // Category direction.
  var punt = state.punt;
  if (punt !== 'none' && has(p, punt)) { pct += 0.08; out.reasons.push('Fits your ' + PUNT_LABEL[punt] + ' build — worth more to you than the room.'); }
  if (has(p, 'ft') && punt !== 'ft') {
    pct -= punt === 'none' ? 0.04 : 0.10;
    out.cautions.push('FT% drag' + (punt === 'none' ? ' — buying him leans you toward punting FT.' : ' — fights your ' + PUNT_LABEL[punt] + ' build.'));
  }
  if (has(p, 'to') && punt !== 'to' && punt !== 'none') { pct -= 0.04; out.cautions.push('High turnovers.'); }
  if (has(p, 'blk') || has(p, 'stl')) { pct += 0.04; out.reasons.push('Scarce ' + (has(p, 'blk') && has(p, 'stl') ? 'STL+BLK' : has(p, 'blk') ? 'BLK' : 'STL') + ' source.'); }
  if (has(p, 'sleeper')) out.reasons.push('Panel value pick.');
  if (has(p, 'bust')) out.cautions.push('Panel says overpriced — hold your ceiling.');
  if (has(p, 'injury')) out.cautions.push('Injury/availability risk (already priced into ceiling).');

  // Ceilings are your number: upward nudges are capped at +6%, cuts are not.
  adj = adj * (1 + Math.min(pct, MAX_BUMP));

  // Budget discipline.
  var startersAfter = Math.max(0, startersOpen - (slot ? 1 : 0));
  var softMax = legalMax - 2 * Math.max(0, startersAfter - 1);
  var topPrice = me.entries.reduce(function (a, e) { return Math.max(a, e.price); }, 0);
  var topTwoCap = me.count >= 1 ? flr(TOP_TWO_CAP * m.settings.budget - topPrice) : Infinity;
  if (topTwoCap < adj && topTwoCap < softMax) out.cautions.push('Top-two cap: keeps your two biggest buys under $' + flr(TOP_TWO_CAP * m.settings.budget) + '.');
  var upTo = flr(Math.min(adj, legalMax, softMax, me.count === 1 ? topTwoCap : Infinity));
  upTo = Math.max(0, upTo);
  out.upTo = upTo;

  var leftAfter = me.left - upTo;
  out.leftAfter = leftAfter;
  out.perSlotAfter = openAfter > 0 ? leftAfter / openAfter : 0;
  if (openAfter > 0 && startersAfter > 2 && out.perSlotAfter < 3) out.cautions.push('Winning at $' + upTo + ' leaves $' + leftAfter + ' for ' + openAfter + ' slots (' + startersAfter + ' starters).');

  var rivals = rivalsFor(m, row);
  out.rivals = rivals;
  var needRivals = rivals.filter(function (r) { return r.needs; }).length;

  if (upTo < m.minBid) { out.verdict = 'CANT'; out.upTo = 0; return out; }
  var tight = Math.max(1, Math.round(mkt * 0.08));
  if (upTo >= mkt) out.verdict = 'BID';
  else if (slot && upTo >= mkt - tight) out.verdict = 'BID';
  else if (mkt >= 6 && needRivals >= 2) {
    out.verdict = 'ENFORCE';
    out.enforceTo = Math.min(upTo, flr(mkt * 0.85));
    if (out.enforceTo < m.minBid + 1) out.verdict = 'PASS';
  } else out.verdict = 'PASS';

  if (out.verdict === 'PASS' && row.ceil < mkt) out.cautions.push('Market $' + mkt + ' is above his ceiling ($' + flr(row.ceil) + ').');
  return out;
}

/* Cheaper players at the same spot, for when the bidding runs past your number. */
function alternatives(m, state, row, n) {
  var slot = E.starterSlotFor(m.me.entries, m.slots, row.p.pos);
  return m.available.filter(function (r) {
    return r.id !== row.id && (slot ? E.canPlay(r.p.pos, slot) : r.p.pos === row.p.pos) && r.market <= row.market * 1.1 && r.market >= Math.min(row.market * 0.4, row.market - 3);
  }).map(function (r) { return { r: r, a: bidAdvice(m, state, r) }; })
    .filter(function (x) { return x.a.verdict === 'BID'; })
    .sort(function (x, y) { return (y.a.upTo - y.a.market) - (x.a.upTo - x.a.market) || y.r.market - x.r.market; })
    .slice(0, n || 3);
}

/* Full board read for the advisor panel. */
function advise(m, state) {
  var me = m.me, phase = phaseOf(m), prof = profile(me);
  var all = m.available.map(function (r) { return { r: r, a: bidAdvice(m, state, r) }; });
  var mine = all.filter(function (x) { return x.a.verdict === 'BID'; });

  // Targets: biggest edge (your number minus market), weighted toward players who matter.
  var targets = mine.map(function (x) {
    var edge = x.a.upTo - x.a.market;
    return { r: x.r, a: x.a, edge: edge, score: edge + (x.a.slot ? 2 : 0) + Math.sqrt(x.a.market) * 0.6 };
  }).sort(function (a, b) { return b.score - a.score; }).slice(0, 10);

  // Best options per open starting slot.
  var seen = {};
  var byNeed = me.openStarters.filter(function (s) { if (seen[s]) return false; seen[s] = 1; return true; }).map(function (slot) {
    var opts = all.filter(function (x) { return E.canPlay(x.r.p.pos, slot) && x.a.verdict !== 'CANT' && x.a.market <= me.maxBid; })
      .sort(function (a, b) { return b.r.market - a.r.market; });
    var tiers = {};
    opts.forEach(function (x) { (tiers[x.r.p.tier] = tiers[x.r.p.tier] || []).push(x); });
    return { slot: slot, options: opts.slice(0, 4), topTier: opts.length ? opts[0].r.p.tier : null, topTierLeft: opts.length ? tiers[opts[0].r.p.tier].length : 0 };
  });

  // Nominations.
  var rivalsAfford = function (price) { return m.teams.filter(function (t) { return !t.isMe && t.open > 0 && t.maxBid >= price; }).length; };
  var noms = [];
  {
    var topIds = targets.slice(0, 5).map(function (t) { return t.r.id; });
    all.filter(function (x) {
      if (x.a.market < 12 * m.scale || topIds.indexOf(x.r.id) >= 0) return false;
      if (phase === 'late') return x.a.market > me.maxBid; // late: only players you couldn't buy anyway
      return x.a.verdict !== 'BID' || x.a.upTo - x.a.market <= 1 || has(x.r.p, 'bust');
    })
      .map(function (x) {
        var why = x.a.market > me.maxBid ? 'You can\'t afford him — make rivals spend before your targets come up.'
          : has(x.r.p, 'bust') ? 'Panel says overpriced — let a rival overpay.'
          : has(x.r.p, 'injury') ? 'Injury risk — someone will still pay up.'
          : !x.a.slot && me.openStarters.length ? 'You don\'t need the position — drains rival cash.'
          : 'Not worth market to you — drains $' + x.a.market + ' from the room.';
        return { r: x.r, a: x.a, why: why, kind: 'drain', score: x.a.market * (1 + rivalsAfford(x.a.market) / 13) };
      }).sort(function (a, b) { return b.score - a.score; }).slice(0, 4).forEach(function (n) { noms.push(n); });
  }
  // Snipes: players you want that few rivals can outbid.
  mine.filter(function (x) { return x.a.market >= 2; }).map(function (x) {
    var n = rivalsAfford(x.a.upTo + 1);
    return { r: x.r, a: x.a, n: n };
  }).filter(function (x) { return x.n <= (phase === 'late' ? 2 : 0); })
    .sort(function (a, b) { return (b.a.upTo - b.a.market) - (a.a.upTo - a.a.market) || b.a.market - a.a.market; })
    .slice(0, 3).forEach(function (x) {
      noms.push({ r: x.r, a: x.a, kind: 'snipe', why: x.n === 0 ? 'Nobody can outbid your $' + x.a.upTo + '.' : 'Only ' + x.n + ' team' + (x.n === 1 ? '' : 's') + ' can top your $' + x.a.upTo + '.' });
    });

  // Endgame: cheap starters/values.
  var endgame = all.filter(function (x) { return x.a.market <= 3 && x.a.verdict === 'BID'; })
    .sort(function (a, b) { return (b.a.upTo - b.a.market) - (a.a.upTo - a.a.market) || b.r.value - a.r.value; }).slice(0, 8);

  // Alerts, most important first.
  var alerts = [];
  var rivals = m.teams.filter(function (t) { return !t.isMe && t.open > 0; }).sort(function (a, b) { return b.maxBid - a.maxBid; });
  var topRival = rivals[0];
  if (me.open > 0 && topRival) {
    if (me.maxBid > topRival.maxBid && m.picksMade > 0) alerts.push({ lvl: 'good', msg: 'You have the biggest max bid in the room ($' + me.maxBid + ' vs ' + topRival.name + ' $' + topRival.maxBid + '). You control any player you nominate.' });
    else if (phase !== 'early' && topRival.maxBid > me.maxBid * 1.5 && topRival.maxBid - me.maxBid >= 10) alerts.push({ lvl: 'warn', msg: topRival.name + ' can bid $' + topRival.maxBid + ' (you: $' + me.maxBid + '). Avoid nominating players you want unless they are cheap.' });
  }
  var cliffSeen = {};
  byNeed.forEach(function (n) {
    if (E.slotKind(n.slot) !== 'pos' || !n.options.length || m.picksMade < 8) return;
    var top = n.options.filter(function (x) { return x.r.p.tier === n.topTier; });
    var next = n.options.filter(function (x) { return x.r.p.tier > n.topTier; })[0];
    if (top.length > 2 || (next && next.r.market > top[0].r.market * 0.7)) return;
    var names = top.map(function (x) { return x.r.p.name; }).join(', ');
    if (cliffSeen[names]) { cliffSeen[names].slots.push(n.slot); return; }
    cliffSeen[names] = { slots: [n.slot], n: top.length, tier: n.topTier, names: names, next: next };
  });
  Object.keys(cliffSeen).forEach(function (k) {
    var c = cliffSeen[k];
    alerts.push({ lvl: 'warn', msg: 'Tier cliff at ' + c.slots.join('/') + ': only ' + c.n + ' tier-' + c.tier + ' left (' + c.names + '). Next best: ' + (c.next ? c.next.r.p.name + ' ~$' + c.next.a.market : 'nobody') + '.' });
  });
  if (m.picksMade >= 5) {
    if (m.inflation > 1.06) alerts.push({ lvl: 'info', msg: 'Room is underspending: ' + Math.round((m.inflation - 1) * 100) + '% more money than value left. Prices will run hot later — buy value now.' });
    else if (m.inflation < 0.94) alerts.push({ lvl: 'info', msg: 'Room is overspending: late-draft prices will be soft. Stay patient.' });
  }
  var roomPerSlot = m.openSpots > 0 ? m.moneyLeft / m.openSpots : 0;
  if (me.open > 0 && m.picksMade >= 10) {
    if (me.perSlot < roomPerSlot * 0.7) alerts.push({ lvl: 'warn', msg: 'You are cash-light: $' + me.perSlot.toFixed(1) + '/slot vs room $' + roomPerSlot.toFixed(1) + '. Target value, skip bidding wars.' });
    else if (me.perSlot > roomPerSlot * 1.4) alerts.push({ lvl: 'info', msg: 'You are cash-rich: $' + me.perSlot.toFixed(1) + '/slot vs room $' + roomPerSlot.toFixed(1) + '. Spend it — unspent money is wasted.' });
  }
  var sug = suggestPunt(prof);
  if (state.punt === 'none' && sug) alerts.push({ lvl: 'info', msg: 'You own ' + prof[sug] + ' ' + { ft: 'FT% drags', to: 'high-TO players', ast: 'low-assist bigs' }[sug] + ' (' + prof.names[sug].join(', ') + '). Consider committing to ' + PUNT_LABEL[sug] + ' (My Team tab).' });
  if (me.open > 0 && me.left - me.open * m.minBid <= 3 && me.openStarters.length > 0) alerts.push({ lvl: 'warn', msg: 'Endgame for you: ~$' + me.left + ' for ' + me.open + ' slots. Hunt $1-2 players at ' + me.openStarters.join(', ') + '.' });

  var headline;
  if (me.open === 0) headline = 'Roster full. Enjoy the rest of the draft.';
  else if (targets.length) headline = 'Top target: ' + targets[0].r.p.name + ' (market $' + targets[0].a.market + ', go to $' + targets[0].a.upTo + ').';
  else headline = 'No clear values on the board — wait for nominations to come to you.';

  var byId = {};
  all.forEach(function (x) { byId[String(x.r.id)] = x.a; });
  return { byId: byId, phase: phase, profile: prof, puntSuggestion: sug, targets: targets, byNeed: byNeed, nominations: noms, endgame: endgame, alerts: alerts, headline: headline, roomPerSlot: roomPerSlot };
}

return { bidAdvice: bidAdvice, alternatives: alternatives, advise: advise, profile: profile, rivalsFor: rivalsFor, phaseOf: phaseOf, PUNT_LABEL: PUNT_LABEL };
});
