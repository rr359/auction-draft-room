/* Draft Room UI. Plain browser script; depends on DRAFT_DEFAULTS, DRAFT_PLAYERS, DraftEngine, DraftAdvisor. */
(function () {
'use strict';
var E = window.DraftEngine, A = window.DraftAdvisor, PLAYERS = window.DRAFT_PLAYERS, DEFAULTS = window.DRAFT_DEFAULTS;
var LSKEY = 'draftRoom.state.v2';

/* ================= state & persistence ================= */
var state = load();
var history = [];          // in-memory undo stack (JSON snapshots)
var model, advice;         // recomputed on every change

function load() {
  try {
    var raw = JSON.parse(localStorage.getItem(LSKEY));
    var s = E.migrate(raw, DEFAULTS, PLAYERS);
    if (s) return s;
  } catch (e) { /* fall through */ }
  return E.freshState(DEFAULTS);
}
function persist() { try { localStorage.setItem(LSKEY, JSON.stringify(state)); } catch (e) { toast('Could not save to this browser — export a backup from the Log tab.'); } }
function commit(mutator, msg, undoable) {
  history.push(JSON.stringify(state));
  if (history.length > 200) history.shift();
  mutator(state);
  persist();
  render();
  if (msg) toast(msg, undoable !== false);
}
function undo() {
  if (!history.length) return;
  state = JSON.parse(history.pop());
  persist(); render(); toast('Undone.', false);
}
window.addEventListener('storage', function (e) { if (e.key === LSKEY) { state = load(); render(); } });

/* ================= ui state ================= */
var ui = {
  tab: 'draft', blockId: null, saleTeam: null, salePrice: '', suggIdx: 0,
  bq: '', bStatus: 'avail', bPos: 'all', bFlag: 'all', sortKey: 'market', sortDir: -1,
  teamSort: 'maxBid', teamOpen: {}, overrideOk: false
};

/* ================= helpers ================= */
function $(s, el) { return (el || document).querySelector(s); }
function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function $n(v) { var r = Math.round(v * 10) / 10, a = Math.abs(r); return (r < 0 ? '-$' : '$') + (Number.isInteger(a) ? a : a.toFixed(1)); }
function $i(v) { var r = Math.round(v); return (r < 0 ? '-$' : '$') + Math.abs(r); }
function $f(v) { return '$' + Math.floor(v + 1e-9); }
function teamName(i) { return state.teams[i] ? state.teams[i].name : '?'; }
function has(p, f) { return (p.flags || []).indexOf(f) >= 0; }

function badges(p) {
  var b = '';
  if (has(p, 'sleeper')) b += '<span class="badge b-val" title="Panel value pick">VAL</span>';
  if (has(p, 'bust')) b += '<span class="badge b-risk" title="Panel says overpriced">RISK</span>';
  if (has(p, 'injury')) b += '<span class="badge b-inj" title="Injury / availability">INJ</span>';
  if (state.punt !== 'none' && has(p, state.punt)) b += '<span class="badge b-punt" title="Fits your punt">' + state.punt.toUpperCase() + '</span>';
  if (has(p, 'stl')) b += '<span class="badge b-cat" title="Steals asset">STL</span>';
  if (has(p, 'blk')) b += '<span class="badge b-cat" title="Blocks asset">BLK</span>';
  if (has(p, 'ft') && state.punt !== 'ft') b += '<span class="badge b-inj" title="FT% drag">FT-</span>';
  return b;
}
function verdictText(a) {
  switch (a.verdict) {
    case 'BID': return 'BID up to ' + $i(a.upTo);
    case 'ENFORCE': return 'PUSH to ' + $i(a.enforceTo) + ', then drop';
    case 'PASS': return 'PASS' + (a.upTo >= 1 ? ' (your number ' + $i(a.upTo) + ')' : '');
    case 'CANT': return "CAN'T AFFORD";
    case 'FULL': return 'ROSTER FULL';
    case 'TAKEN': return 'SOLD';
  }
  return a.verdict;
}

/* ================= render root ================= */
var TABS = [['draft', 'Draft', '1'], ['teams', 'Teams & Money', '2'], ['mine', 'My Team', '3'], ['log', 'Log', '4'], ['settings', 'Settings', '5']];

function render() {
  model = E.buildModel(state, PLAYERS);
  advice = A.advise(model, state);
  renderHeader();
  $('#tabs').innerHTML = TABS.map(function (t) { return '<button data-tab="' + t[0] + '" class="' + (ui.tab === t[0] ? 'on' : '') + '">' + t[1] + '<span class="kbd">' + t[2] + '</span></button>'; }).join('');
  $$('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'v-' + ui.tab); });
  if (ui.tab === 'draft') { renderBlock(); renderAdvisor(); renderBoardTools(); renderBoard(); renderSugg(); }
  if (ui.tab === 'teams') renderTeams();
  if (ui.tab === 'mine') renderMine();
  if (ui.tab === 'log') renderLog();
  if (ui.tab === 'settings') renderSettings();
  document.documentElement.style.setProperty('--hdr-h', $('#top').offsetHeight + 'px');
}

function renderHeader() {
  var me = model.me;
  $('#leagueName').textContent = (state.settings.leagueName || '') + ' · ' + me.name;
  var roomPer = model.openSpots ? model.moneyLeft / model.openSpots : 0;
  var stat = function (v, l, cls, title) { return '<div class="stat ' + (cls || '') + '"' + (title ? ' title="' + esc(title) + '"' : '') + '><div class="v">' + v + '</div><div class="l">' + l + '</div></div>'; };
  $('#stats').innerHTML =
    stat($n(me.left), 'My $ left', 'me') +
    stat($n(me.maxBid), 'My max bid', 'hi', 'Money left minus $' + model.minBid + ' for every other open slot') +
    stat(me.count + '/' + model.rosterSize, 'Roster') +
    stat('$' + (me.open ? (me.left / me.open).toFixed(1) : '0') + ' <span class="dim" style="font-size:12px">/ $' + roomPer.toFixed(1) + '</span>', 'Me / room per slot') +
    stat(model.inflation.toFixed(2) + 'x', 'Inflation', model.inflation > 1.05 ? 'hi' : '', 'Money left in the room vs. sheet value left. >1 = prices will run hot.') +
    stat(model.picksMade + '/' + model.totalSpots, 'Picks');
}

/* ================= block (player being auctioned) ================= */
function putOnBlock(id) {
  var row = model.row(id);
  if (!row) return;
  ui.blockId = id; ui.overrideOk = false;
  if (row.taken) { ui.saleTeam = row.pick.team; ui.salePrice = String(row.pick.price); }
  else { ui.saleTeam = null; ui.salePrice = String(Math.max(model.minBid, Math.round(row.market))); }
  $('#q').value = ''; ui.suggIdx = 0;
  if (ui.tab !== 'draft') ui.tab = 'draft';
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  var pi = $('#salePrice'); if (pi && window.innerWidth > 720) pi.focus(), pi.select();
}
function clearBlock() { ui.blockId = null; ui.saleTeam = null; render(); $('#q').focus(); }

function renderBlock() {
  var el = $('#block');
  if (ui.blockId == null || !model.row(ui.blockId)) {
    var t = advice.targets[0];
    el.innerHTML = '<div class="block-empty">When a player is nominated, type his name above to see your bid call and log the sale.' +
      (t ? '<br><span class="small">Advisor\'s top target right now: <b>' + esc(t.r.p.name) + '</b> — market ' + $i(t.a.market) + ', go to ' + $i(t.a.upTo) + '.</span>' : '') + '</div>';
    return;
  }
  var row = model.row(ui.blockId), p = row.p;
  var a = row.taken ? { verdict: 'TAKEN', reasons: [], cautions: [], rivals: [] } : (advice.byId[String(row.id)] || A.bidAdvice(model, state, row));
  var me = model.me;
  var h = '<div class="blockcard"><div class="head"><div><h3>' + esc(p.name) + badges(p) + '</h3>' +
    '<div class="meta">#' + p.rank + ' · ' + esc(p.pos) + ' · ' + esc(p.team) + ' · Tier ' + p.tier + (row.taken ? ' · <b class="gold">sold to ' + esc(teamName(row.pick.team)) + ' for ' + $n(row.pick.price) + '</b>' : '') + '</div></div>' +
    '<button class="x" id="blockClose" title="Clear (Esc)">×</button></div>' +
    (p.note ? '<div class="note">' + esc(p.note) + '</div>' : '');

  if (!row.taken) {
    h += '<div class="nums">' +
      '<div class="cell"><div class="v">' + $i(a.market) + '</div><div class="k">Market now</div></div>' +
      '<div class="cell"><div class="v">' + $f(row.ceil) + '</div><div class="k">Sheet ceiling</div></div>' +
      '<div class="cell key"><div class="v">' + (a.upTo ? $i(a.upTo) : '—') + '</div><div class="k">Your max</div></div>' +
      '<div class="cell"><div class="v">' + $i(me.maxBid) + '</div><div class="k">Legal max</div></div></div>';
    h += '<div class="verdict v-' + a.verdict + '">' + verdictText(a) +
      (a.verdict === 'BID' && a.leftAfter != null ? '<span class="sub">→ leaves ' + $i(a.leftAfter) + ' for ' + (me.open - 1) + ' slots (~$' + a.perSlotAfter.toFixed(1) + '/slot)</span>' : '') + '</div>';
    if (a.reasons.length || a.cautions.length) h += '<ul class="why">' + a.reasons.map(function (r) { return '<li class="pro">' + esc(r) + '</li>'; }).join('') + a.cautions.map(function (r) { return '<li class="con">' + esc(r) + '</li>'; }).join('') + '</ul>';
    if (a.rivals) {
      var need = a.rivals.filter(function (r) { return r.needs; });
      h += '<div class="rivals"><b>' + a.rivals.length + '</b> rival' + (a.rivals.length === 1 ? '' : 's') + ' can pay ' + $i(a.market) + (need.length ? ', <b>' + need.length + '</b> need the position: ' + need.slice(0, 5).map(function (r) { return esc(r.team.name) + ' (' + $i(r.team.maxBid) + ')'; }).join(', ') + (need.length > 5 ? '…' : '') : '') + '.</div>';
    }
    var alts = A.alternatives(model, state, row, 3);
    if (alts.length) h += '<div class="alts"><div class="small" style="margin-top:8px">If the price runs, fallbacks:</div><div class="alist">' + alts.map(function (x) {
      return '<div class="row" data-block="' + x.r.id + '"><div class="nm">' + esc(x.r.p.name) + badges(x.r.p) + '<span class="s">' + esc(x.r.p.pos) + ' · T' + x.r.p.tier + '</span></div><div class="pr">' + $i(x.a.market) + '<span class="s">go to ' + $i(x.a.upTo) + '</span></div></div>';
    }).join('') + '</div></div>';
  }

  // Sale form
  h += '<div class="sale"><div class="small">' + (row.taken ? 'Edit this sale:' : 'Sold to:') + '</div><div class="teamchips">' +
    model.teams.map(function (t) {
      var dis = !row.taken && t.open <= 0;
      return '<button data-team="' + t.idx + '" class="' + (ui.saleTeam === t.idx ? 'sel ' : '') + (t.isMe ? 'mine' : '') + '"' + (dis ? ' disabled title="Roster full"' : '') + '><span class="tn">' + (t.isMe ? '★ ' : '') + esc(t.name) + '</span><span class="tm">' + $i(t.left) + ' left · max ' + $i(t.maxBid) + '</span></button>';
    }).join('') + '</div>' +
    '<div class="pricerow"><button class="btn" data-adj="-1">−1</button><input id="salePrice" type="number" inputmode="numeric" min="1" value="' + esc(ui.salePrice) + '"><button class="btn" data-adj="1">+1</button><button class="btn" data-adj="5">+5</button>' +
    (row.taken ? '' : '<button class="btn sm" data-set="' + Math.round(a.market) + '">mkt ' + $i(a.market) + '</button>' + (a.upTo ? '<button class="btn sm" data-set="' + a.upTo + '">my max ' + $i(a.upTo) + '</button>' : '')) +
    '<button class="btn primary go" id="logSale">' + (row.taken ? 'Update sale' : 'Log sale ⏎') + '</button>' +
    (row.taken ? '<button class="btn danger" id="delSale">Remove</button>' : '') + '</div><div class="salewarn" id="saleWarn"></div></div></div>';
  el.innerHTML = h;
  validateSale();
}

function validateSale() {
  var btn = $('#logSale'), warn = $('#saleWarn');
  if (!btn) return true;
  var row = model.row(ui.blockId), price = Math.round(Number(ui.salePrice));
  var msg = '', block = false;
  if (ui.saleTeam == null) { msg = 'Pick the team that won him.'; block = true; }
  else if (!(price >= model.minBid)) { msg = 'Enter a price of at least $' + model.minBid + '.'; block = true; }
  else {
    var t = model.teams[ui.saleTeam];
    var max = t.maxBid + (row.taken && row.pick.team === ui.saleTeam ? row.pick.price : 0);
    if (row.taken && row.pick.team !== ui.saleTeam && t.open <= 0) { msg = t.name + '\'s roster is full.'; block = true; }
    else if (price > max) { msg = 'That is over ' + t.name + '\'s max bid (' + $i(max) + '). Check Yahoo, then click again to log anyway.'; block = !ui.overrideOk; }
    else if (t.isMe && !row.taken) {
      var a = advice.byId[String(row.id)];
      if (a && price > a.upTo) msg = 'Above your number (' + $i(a.upTo) + ').';
    }
  }
  warn.textContent = msg;
  btn.classList.toggle('over', !!msg && ui.saleTeam != null);
  return !block;
}

function logSale() {
  var row = model.row(ui.blockId);
  if (!row) return;
  if (!validateSale()) {
    if (ui.saleTeam != null && Number(ui.salePrice) >= model.minBid) { ui.overrideOk = true; validateSale(); }
    return;
  }
  var price = Math.round(Number(ui.salePrice)), team = ui.saleTeam, name = row.p.name;
  if (row.taken) {
    commit(function (s) { var pk = s.picks.filter(function (x) { return String(x.id) === String(row.id); })[0]; pk.team = team; pk.price = price; }, 'Updated: ' + name + ' → ' + teamName(team) + ' for $' + price);
  } else {
    commit(function (s) { s.picks.push({ id: row.id, team: team, price: price, ts: Date.now() }); }, 'Sold: ' + name + ' → ' + teamName(team) + ' for $' + price);
  }
  ui.blockId = null; ui.saleTeam = null;
  render();
  $('#q').focus();
}
function removeSale(id) {
  var row = model.row(id);
  commit(function (s) { s.picks = s.picks.filter(function (x) { return String(x.id) !== String(id); }); }, 'Removed ' + row.p.name + '.');
}

/* ================= typeahead ================= */
function suggestions() {
  var q = $('#q').value;
  if (!q.trim()) return [];
  return E.searchPlayers(model.players, q, 8);
}
function renderSugg() {
  var q = $('#q').value.trim(), list = suggestions(), el = $('#sugg');
  if (!q) { el.innerHTML = ''; return; }
  ui.suggIdx = Math.min(ui.suggIdx, Math.max(0, list.length));
  var h = list.map(function (r, i) {
    var a = advice.byId[String(r.id)];
    return '<div class="it' + (i === ui.suggIdx ? ' sel' : '') + (r.taken ? ' taken' : '') + '" data-sugg="' + r.id + '"><div class="nm"><b>' + esc(r.p.name) + '</b>' + badges(r.p) +
      '<div class="small">' + esc(r.p.pos) + ' · ' + esc(r.p.team) + ' · T' + r.p.tier + (r.taken ? ' · sold ' + $n(r.pick.price) + ' to ' + esc(teamName(r.pick.team)) : '') + '</div></div>' +
      (r.taken ? '' : '<div class="r num">' + $i(r.market) + ' <span class="small">/ ' + $f(r.ceil) + '</span></div>' + (a ? '<span class="verdict-tag vt-' + a.verdict + '">' + a.verdict + '</span>' : '')) + '</div>';
  }).join('');
  if (q.length >= 3) h += '<div class="it' + (ui.suggIdx === list.length ? ' sel' : '') + '" data-addcustom="1"><div class="nm">+ Add “' + esc(q) + '” as an unlisted player</div></div>';
  el.innerHTML = h;
}
function pickSuggestion() {
  var list = suggestions();
  if (ui.suggIdx < list.length) putOnBlock(list[ui.suggIdx].id);
  else if ($('#q').value.trim().length >= 3) addCustomModal($('#q').value.trim());
}

/* ================= advisor panel ================= */
function renderAdvisor() {
  var me = model.me, adv = advice;
  var slotsAll = me.roster.slots.filter(function (s) { return E.slotKind(s.slot) !== 'bench'; });
  var h = '<div class="card adv"><h2>Advisor · ' + adv.phase + ' draft' + (state.punt !== 'none' ? ' · ' + A.PUNT_LABEL[state.punt] : '') + '</h2><div class="headline">' + esc(adv.headline) + '</div>' +
    '<div class="needchips">' + slotsAll.map(function (s) { return '<span class="needchip' + (s.entry ? ' done' : '') + '" title="' + (s.entry ? esc(s.entry.player.name) : 'open') + '">' + s.slot + '</span>'; }).join('') + '</div>' +
    (adv.alerts.length ? '<div style="margin-top:10px">' + adv.alerts.map(function (al) { return '<div class="alert ' + al.lvl + '">' + esc(al.msg) + '</div>'; }).join('') + '</div>' : '') + '</div>';

  if (me.open > 0) {
    h += '<div class="card"><h2>Best targets for you</h2><div class="alist">' + (adv.targets.slice(0, 8).map(function (t) {
      return '<div class="row" data-block="' + t.r.id + '"><div class="nm">' + esc(t.r.p.name) + badges(t.r.p) + '<span class="s">' + esc(t.r.p.pos) + ' · T' + t.r.p.tier + (t.a.slot ? ' · fills ' + t.a.slot : ' · bench') + '</span></div><div class="pr">' + $i(t.a.market) + '<span class="s">go to ' + $i(t.a.upTo) + '</span></div></div>';
    }).join('') || '<div class="small">Nothing on the board beats market for you right now.</div>') + '</div></div>';

    h += '<div class="card"><h2>Nominate next</h2><div class="alist">' + (adv.nominations.map(function (n) {
      return '<div class="row" data-block="' + n.r.id + '"><div class="nm">' + esc(n.r.p.name) + ' <span class="badge ' + (n.kind === 'snipe' ? 'b-val">SNIPE' : 'b-risk">DRAIN') + '</span><span class="s">' + esc(n.why) + '</span></div><div class="pr">' + $i(n.a.market) + '</div></div>';
    }).join('') || '<div class="small">No strong nomination plays — toss out a $1 player you like.</div>') + '</div></div>';

    if (adv.byNeed.length) {
      h += '<details class="card"' + (adv.phase !== 'early' ? ' open' : '') + '><summary><h2>Options by open slot</h2></summary>' + adv.byNeed.map(function (n) {
        return '<div style="margin-top:8px"><b>' + n.slot + '</b><div class="alist">' + n.options.slice(0, 3).map(function (x) {
          return '<div class="row" data-block="' + x.r.id + '"><div class="nm">' + esc(x.r.p.name) + '<span class="s">T' + x.r.p.tier + ' · ' + esc(x.r.p.pos) + '</span></div><div class="pr">' + $i(x.a.market) + '<span class="s"><span class="verdict-tag vt-' + x.a.verdict + '">' + x.a.verdict + '</span> ' + (x.a.upTo ? $i(x.a.upTo) : '') + '</span></div></div>';
        }).join('') + '</div></div>';
      }).join('') + '</details>';
    }
    if (adv.phase === 'late' || me.open <= 5) {
      h += '<div class="card"><h2>Endgame $1–3 values</h2><div class="alist">' + (adv.endgame.map(function (x) {
        return '<div class="row" data-block="' + x.r.id + '"><div class="nm">' + esc(x.r.p.name) + badges(x.r.p) + '<span class="s">' + esc(x.r.p.pos) + ' · T' + x.r.p.tier + (x.a.slot ? ' · fills ' + x.a.slot : '') + '</span></div><div class="pr">' + $i(x.a.market) + '<span class="s">go to ' + $i(x.a.upTo) + '</span></div></div>';
      }).join('') || '<div class="small">None left.</div>') + '</div></div>';
    }
  }

  // Room money: who can outbid whom.
  var teams = model.teams.slice().sort(function (a, b) { return b.maxBid - a.maxBid || b.left - a.left; });
  h += '<div class="card money"><h2>Room money</h2><div class="row hd"><span class="t">Team</span><span>Left</span><span>Max</span><span>Open</span></div>' +
    teams.map(function (t) { return '<div class="row' + (t.isMe ? ' me' : '') + (t.open === 0 ? ' done' : '') + '"><span class="t" title="' + esc(t.name) + '">' + (t.isMe ? '★ ' : '') + esc(t.name) + '</span><span>' + $i(t.left) + '</span><span>' + $i(t.maxBid) + '</span><span>' + t.open + '</span></div>'; }).join('') + '</div>';

  var recent = state.picks.slice(-6).reverse();
  if (recent.length) {
    h += '<div class="card"><h2>Recent sales</h2><div class="alist">' + recent.map(function (pk) {
      var r = model.row(pk.id); if (!r) return '';
      var d = pk.price - r.value;
      return '<div class="row" data-block="' + r.id + '"><div class="nm">' + esc(r.p.name) + '<span class="s">' + esc(teamName(pk.team)) + '</span></div><div class="pr">' + $n(pk.price) + '<span class="s ' + (d > 3 ? 'bad' : d < -3 ? 'good' : '') + '">' + (d >= 0 ? '+' : '') + $n(d).replace('$-', '-$') + ' vs sheet</span></div></div>';
    }).join('') + '</div></div>';
  }
  $('#advisor').innerHTML = h;
}

/* ================= board ================= */
var COLS = [
  ['rank', '#', 'r'], ['name', 'Player', ''], ['pos', 'Pos', 'c'], ['tier', 'Tier', 'c hide-sm'],
  ['market', 'Market', 'r'], ['ceil', 'Ceiling', 'r hide-sm'], ['upTo', 'Your max', 'r'], ['edge', 'Edge', 'r hide-sm'], ['status', 'Call / Sold', '']
];
function renderBoardTools() {
  var el = $('#boardTools');
  if (el.dataset.built) {
    $$('.seg button', el).forEach(function (b) { b.classList.toggle('on', ui[b.dataset.k] === b.dataset.v); });
    return;
  }
  var seg = function (k, opts) { return '<div class="seg">' + opts.map(function (o) { return '<button data-k="' + k + '" data-v="' + o[0] + '" class="' + (ui[k] === o[0] ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>'; };
  el.innerHTML = '<input id="bq" type="search" placeholder="Filter board…" aria-label="Filter board">' +
    seg('bStatus', [['avail', 'Available'], ['all', 'All'], ['taken', 'Sold']]) +
    seg('bPos', [['all', 'All'], ['G', 'G'], ['F', 'F'], ['C', 'C']]) +
    seg('bFlag', [['all', 'Any'], ['need', 'Fills need'], ['bid', 'BID calls'], ['sleeper', 'Values'], ['punt', 'Punt fit'], ['risk', 'Risk/INJ']]);
  el.dataset.built = '1';
}
function boardRows() {
  var q = E.normalize(ui.bq);
  var rows = model.players.filter(function (r) {
    if (ui.bStatus === 'avail' && r.taken) return false;
    if (ui.bStatus === 'taken' && !r.taken) return false;
    if (ui.bPos !== 'all' && r.p.pos.split('/').indexOf(ui.bPos) < 0) return false;
    var a = advice.byId[String(r.id)];
    if (ui.bFlag === 'need' && !(a && a.slot)) return false;
    if (ui.bFlag === 'bid' && !(a && a.verdict === 'BID')) return false;
    if (ui.bFlag === 'sleeper' && !has(r.p, 'sleeper')) return false;
    if (ui.bFlag === 'punt' && !(state.punt !== 'none' && has(r.p, state.punt))) return false;
    if (ui.bFlag === 'risk' && !(has(r.p, 'bust') || has(r.p, 'injury'))) return false;
    if (q && E.normalize(r.p.name + ' ' + r.p.team).indexOf(q) < 0) return false;
    return true;
  });
  var key = function (r) {
    var a = advice.byId[String(r.id)];
    switch (ui.sortKey) {
      case 'rank': return r.p.rank; case 'name': return r.p.name; case 'pos': return r.p.pos; case 'tier': return r.p.tier;
      case 'market': return r.taken ? r.pick.price : r.market; case 'ceil': return r.ceil;
      case 'upTo': return a ? a.upTo : -1; case 'edge': return a ? a.upTo - a.market : -99;
      case 'status': return r.taken ? r.pickNo : 9999;
    }
  };
  rows.sort(function (x, y) {
    var a = key(x), b = key(y);
    var c = typeof a === 'string' ? a.localeCompare(b) : a - b;
    return c * ui.sortDir || x.p.rank - y.p.rank;
  });
  return rows;
}
function renderBoard() {
  var rows = boardRows();
  var h = '<table class="tbl"><thead><tr>' + COLS.map(function (c) {
    return '<th class="sortable ' + c[2] + (ui.sortKey === c[0] ? ' sorted' : '') + '" data-sort="' + c[0] + '">' + c[1] + (ui.sortKey === c[0] ? (ui.sortDir > 0 ? ' ▲' : ' ▼') : '') + '</th>';
  }).join('') + '</tr></thead><tbody>';
  h += rows.map(function (r) {
    var p = r.p, a = advice.byId[String(r.id)];
    var mine = r.taken && r.pick.team === state.myTeam;
    var status = r.taken
      ? '<b>' + $n(r.pick.price) + '</b> <span class="ps">' + esc(teamName(r.pick.team)) + '</span>'
      : (a ? '<span class="verdict-tag vt-' + a.verdict + '">' + a.verdict + '</span>' + (a.slot ? ' <span class="ps">' + a.slot + '</span>' : '') : '');
    var edge = a && !r.taken ? a.upTo - a.market : null;
    return '<tr data-block="' + r.id + '" class="' + (r.taken ? 'taken' : '') + (mine ? ' mine' : '') + (String(ui.blockId) === String(r.id) ? ' onblock' : '') + '">' +
      '<td class="r dim num">' + p.rank + '</td>' +
      '<td><div class="pn">' + esc(p.name) + badges(p) + '</div><div class="ps">' + esc(p.team) + (p.note ? ' · ' + esc(p.note) : '') + '</div></td>' +
      '<td class="c">' + esc(p.pos) + '</td><td class="c hide-sm">' + p.tier + '</td>' +
      '<td class="r num">' + $i(r.market) + '</td><td class="r num hide-sm">' + $f(r.ceil) + '</td>' +
      '<td class="r num"><b>' + (a && !r.taken && a.upTo ? $i(a.upTo) : '—') + '</b></td>' +
      '<td class="r num hide-sm ' + (edge > 0 ? 'edge-pos' : 'edge-neg') + '">' + (edge == null ? '' : (edge > 0 ? '+' : '') + edge) + '</td>' +
      '<td>' + status + '</td></tr>';
  }).join('');
  h += '</tbody></table>' + (rows.length ? '' : '<div class="small" style="padding:16px">No players match.</div>');
  $('#board').innerHTML = h;
}

/* ================= teams ================= */
function renderTeams() {
  var el = $('#v-teams');
  var cols = [['name', 'Team'], ['left', '$ Left'], ['maxBid', 'Max bid'], ['count', 'Roster'], ['perSlot', '$/open slot'], ['openStarters', 'Open starters'], ['valueIn', 'Sheet value'], ['surplus', '+/- vs paid']];
  var teams = model.teams.slice().sort(function (a, b) {
    var k = ui.teamSort, x = k === 'openStarters' ? a.openStarters.length : a[k], y = k === 'openStarters' ? b.openStarters.length : b[k];
    return typeof x === 'string' ? x.localeCompare(y) : y - x;
  });
  var h = '<div class="card"><h2>Room</h2><div class="kv"><span>Money left in room</span><b>' + $n(model.moneyLeft) + ' of ' + $n(model.pool) + '</b></div>' +
    '<div class="kv"><span>Open roster spots</span><b>' + model.openSpots + '</b></div>' +
    '<div class="kv"><span>Average $ per open spot</span><b>' + $n(advice.roomPerSlot) + '</b></div>' +
    '<div class="kv"><span>Inflation</span><b>' + model.inflation.toFixed(3) + 'x</b></div></div>';
  h += '<div class="card" style="overflow-x:auto"><table class="tbl teamtbl"><thead><tr>' + cols.map(function (c) { return '<th class="sortable' + (ui.teamSort === c[0] ? ' sorted' : '') + (c[0] === 'name' || c[0] === 'openStarters' ? '' : ' r') + '" data-tsort="' + c[0] + '">' + c[1] + '</th>'; }).join('') + '</tr></thead><tbody>' +
    teams.map(function (t) {
      var row = '<tr data-topen="' + t.idx + '" class="' + (t.isMe ? 'me' : '') + '">' +
        '<td><b>' + (t.isMe ? '★ ' : '') + esc(t.name) + '</b></td>' +
        '<td class="r num"><b>' + $n(t.left) + '</b></td><td class="r num gold">' + $n(t.maxBid) + '</td>' +
        '<td class="r num">' + t.count + '/' + model.rosterSize + '</td><td class="r num">' + (t.open ? $n(t.perSlot) : '—') + '</td>' +
        '<td><div class="needchips">' + t.openStarters.map(function (s) { return '<span class="needchip">' + s + '</span>'; }).join('') + '</div></td>' +
        '<td class="r num">' + $n(t.valueIn) + '</td><td class="r num ' + (t.surplus > 0 ? 'good' : t.surplus < 0 ? 'bad' : '') + '">' + (t.surplus > 0 ? '+' : '') + Math.round(t.surplus) + '</td></tr>';
      if (ui.teamOpen[t.idx]) row += '<tr class="noclick"><td colspan="8" class="rosterx">' + slotGrid(t) + '</td></tr>';
      return row;
    }).join('') + '</tbody></table><div class="small" style="margin-top:6px">Click a team to see its roster. Max bid = money left minus $' + model.minBid + ' per other open slot. Sheet value = what its players were projected to cost.</div></div>';
  el.innerHTML = h;
}
function slotGrid(t) {
  return '<div class="slotgrid">' + t.roster.slots.map(function (s) {
    var e = s.entry;
    return '<div class="slot' + (e ? '' : ' empty') + (E.slotKind(s.slot) === 'bench' ? ' bench' : '') + '"><div class="sl">' + s.slot + '</div><div class="sp">' +
      (e ? '<span data-block="' + e.player.id + '" style="cursor:pointer">' + esc(e.player.name) + '</span> <span class="dim num">' + $n(e.price) + '</span>' : '—') + '</div></div>';
  }).join('') + (t.roster.overflow.length ? '<div class="slot"><div class="sl">+</div><div class="sp">' + t.roster.overflow.map(function (e) { return esc(e.player.name); }).join(', ') + '</div></div>' : '') + '</div>';
}

/* ================= my team ================= */
var TEMPL = { A: [70, 36, 22, 18, 14, 11, 9, 7, 5, 3, 2, 2, 1], B: [68, 34, 22, 20, 14, 11, 9, 7, 5, 4, 3, 2, 1], C: [75, 28, 24, 20, 12, 10, 9, 7, 5, 4, 3, 2, 1], D: [32, 32, 30, 30, 28, 14, 10, 8, 5, 4, 3, 2, 2] };
function renderMine() {
  var me = model.me, prof = advice.profile;
  var paid = me.entries.map(function (e) { return e.price; }).sort(function (a, b) { return b - a; });
  var h = '<div class="grid2"><div>';
  h += '<div class="card"><h2>Budget</h2><div class="kv"><span>Spent</span><b>' + $n(me.spent) + ' / ' + $n(state.settings.budget) + '</b></div>' +
    '<div class="bar"><i style="width:' + Math.min(100, me.spent / state.settings.budget * 100) + '%"></i></div>' +
    '<div class="kv"><span>Remaining</span><b class="good">' + $n(me.left) + '</b></div>' +
    '<div class="kv"><span>Open slots</span><b>' + me.open + ' (' + me.openStarters.length + ' starters)</b></div>' +
    '<div class="kv"><span>Max bid</span><b class="gold">' + $n(me.maxBid) + '</b></div>' +
    '<div class="kv"><span>$ per open slot (room avg)</span><b>' + (me.open ? $n(me.perSlot) : '—') + ' (' + $n(advice.roomPerSlot) + ')</b></div>' +
    '<div class="kv"><span>Sheet value acquired</span><b>' + $n(me.valueIn) + ' <span class="' + (me.surplus >= 0 ? 'good' : 'bad') + '">(' + (me.surplus >= 0 ? '+' : '') + Math.round(me.surplus) + ')</span></b></div></div>';
  h += '<div class="card"><h2>Roster</h2>' + slotGrid(me) + '</div>';
  h += '<div class="card"><h2>Purchases</h2><div class="alist">' + (me.entries.map(function (e) {
    var d = e.price - e.player.exp * model.scale;
    return '<div class="row" data-block="' + e.player.id + '"><div class="nm">' + esc(e.player.name) + badges(e.player) + '<span class="s">' + esc(e.player.pos) + ' · T' + e.player.tier + ' · pick ' + e.pickNo + '</span></div><div class="pr">' + $n(e.price) + '<span class="s">sheet ' + $n(model.value(e.player)) + '</span></div></div>';
  }).join('') || '<div class="small">Nothing yet.</div>') + '</div></div>';
  h += '</div><div>';
  h += '<div class="card"><h2>Category direction</h2><div class="puntbtns">' + [['none', 'No punt'], ['ft', 'Punt FT%'], ['to', 'Punt TO'], ['ast', 'Punt AST']].map(function (p) {
    return '<button data-punt="' + p[0] + '" class="' + (state.punt === p[0] ? 'sel' : '') + '">' + p[1] + (advice.puntSuggestion === p[0] && state.punt === 'none' ? ' ★' : '') + '</button>';
  }).join('') + '</div><div class="small" style="margin-top:8px">Decide after your first two significant buys. Punting raises your number on players who fit (e.g. FT% drags for punt FT). Never punt PTS/REB/3PM or both percentages.</div>' +
    '<div style="margin-top:10px">' + [['ft', 'FT% drags'], ['to', 'High turnovers'], ['ast', 'Low-assist bigs'], ['blk', 'Blocks assets'], ['stl', 'Steals assets'], ['injury', 'Injury risks'], ['bust', 'Panel "overpriced"']].map(function (f) {
      return '<div class="kv"><span>' + f[1] + '</span><b>' + prof[f[0]] + (prof.names[f[0]] ? ' <span class="dim" style="font-weight:400">' + esc(prof.names[f[0]].join(', ')) + '</span>' : '') + '</b></div>';
    }).join('') + '</div></div>';
  h += '<div class="card"><h2>Price templates (prices paid, sorted)</h2><div class="small">You: <span class="num">' + (paid.map(function (p) { return '$' + p; }).join(' / ') || 'none yet') + '</span></div>' +
    Object.keys(TEMPL).map(function (k) { return '<div class="kv"><span>Template ' + k + '</span><span class="dim num" style="font-size:11.5px">' + TEMPL[k].join('/') + '</span></div>'; }).join('') +
    '<div class="small" style="margin-top:6px">A: anchor landed $66-76. C: anchor $75-80. D: stars inflated past $70 — go balanced. Never more than $' + Math.floor(0.7 * state.settings.budget) + ' on your top two.</div></div>';
  h += '</div></div>';
  $('#v-mine').innerHTML = h;
}

/* ================= log ================= */
function renderLog() {
  var h = '<div class="toolbar"><button class="btn" id="undoPick">Undo last pick</button><button class="btn" id="expFile">Download backup</button><button class="btn" id="expCopy">Copy backup</button>' +
    '<button class="btn" id="impOpen">Import</button><button class="btn" id="expCsv">Export CSV</button><button class="btn danger" id="resetPicks">Reset all picks</button></div>' +
    '<div class="small" style="margin-bottom:10px">' + state.picks.length + ' picks logged. Cross-check $ left against Yahoo every ~20 picks; if they differ, trust Yahoo and fix the entry here. Saved automatically in this browser.</div><div id="ioBox"></div>';
  h += '<table class="tbl"><thead><tr><th class="r">#</th><th>Player</th><th>Team</th><th class="r">Price</th><th class="r hide-sm">vs sheet</th><th></th></tr></thead><tbody>' +
    state.picks.map(function (pk, i) {
      var r = model.row(pk.id); if (!r) return '';
      var d = pk.price - r.value;
      return '<tr data-block="' + r.id + '" class="' + (pk.team === state.myTeam ? 'mine' : '') + '"><td class="r dim num">' + (i + 1) + '</td><td><span class="pn">' + esc(r.p.name) + '</span> <span class="ps">' + esc(r.p.pos) + '</span></td><td>' + (pk.team === state.myTeam ? '★ ' : '') + esc(teamName(pk.team)) + '</td><td class="r num"><b>' + $n(pk.price) + '</b></td><td class="r num hide-sm ' + (d > 3 ? 'bad' : d < -3 ? 'good' : 'dim') + '">' + (d >= 0 ? '+' : '−') + $n(Math.abs(d)) + '</td><td class="r"><button class="btn sm" data-edit="' + r.id + '">edit</button></td></tr>';
    }).reverse().join('') + '</tbody></table>' + (state.picks.length ? '' : '<div class="small" style="padding:16px">No picks yet. Draft tab → type a name → pick the team → Log sale.</div>');
  $('#v-log').innerHTML = h;
}
function download(name, text, type) {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: type }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
}
function stamp() { return new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-'); }
function csv() {
  var lines = [['pick', 'player', 'pos', 'nba_team', 'fantasy_team', 'price', 'sheet_value'].join(',')];
  state.picks.forEach(function (pk, i) {
    var r = model.row(pk.id); if (!r) return;
    lines.push([i + 1, r.p.name, r.p.pos, r.p.team, teamName(pk.team), pk.price, Math.round(r.value * 10) / 10].map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','));
  });
  return lines.join('\n');
}
function importText(text) {
  try {
    var s = E.migrate(JSON.parse(text), DEFAULTS, PLAYERS);
    if (!s) throw new Error('Not a draft backup.');
    commit(function () { state = s; }, 'Imported ' + s.picks.length + ' picks.');
    closeModal();
  } catch (e) { alert('Import failed: ' + e.message); }
}

/* ================= settings ================= */
function renderSettings() {
  var st = state.settings;
  var h = '<div class="grid2"><div class="card"><h2>League</h2><div class="form">' +
    '<label>League name<input type="text" id="sName" value="' + esc(st.leagueName || '') + '"></label>' +
    '<label>Budget per team ($)<input type="number" id="sBudget" min="1" value="' + st.budget + '"></label>' +
    '<label>Minimum bid ($)<input type="number" id="sMin" min="0" value="' + st.minBid + '"></label>' +
    '<label>Roster slots (comma-separated: PG SG G SF PF F C UTIL BN, or combos like F/C)<input type="text" id="sSlots" value="' + esc(st.slots.join(', ')) + '"></label>' +
    '<label>Scoring (note only)<input type="text" id="sScoring" value="' + esc(st.scoring || '') + '"></label>' +
    '<div><button class="btn primary" id="sSave">Save league settings</button></div>' +
    '<div class="small">Prices rescale automatically from the 14-team / $200 / 13-man sheet to these settings.</div></div></div>';
  h += '<div class="card"><h2>Teams</h2><div class="small" style="margin-bottom:8px">Order doesn\'t matter. ★ marks your team.</div>' +
    state.teams.map(function (t, i) {
      return '<div class="teamedit"><span class="dim num">' + (i + 1) + '</span><input type="text" data-tname="' + i + '" value="' + esc(t.name) + '"><label class="rad"><input type="radio" name="me" data-me="' + i + '"' + (i === state.myTeam ? ' checked' : '') + '>me</label></div>';
    }).join('') +
    '<div class="toolbar" style="margin-top:10px"><button class="btn" id="tAdd">+ Add team</button><button class="btn" id="tRemove">− Remove last team</button></div></div>';
  h += '<div class="card"><h2>Danger zone</h2><div class="toolbar"><button class="btn danger" id="sDefaults">Restore league defaults (keeps picks)</button><button class="btn danger" id="sWipe">Wipe everything</button></div>' +
    '<div class="small">Keyboard: <b>/</b> search · <b>↑↓ Enter</b> choose · <b>Esc</b> clear block · <b>1-5</b> tabs · <b>Ctrl/⌘+Z</b> undo (outside inputs).</div></div></div>';
  $('#v-settings').innerHTML = h;
}

/* ================= modals & toast ================= */
function openModal(html) { var m = $('#modal'); m.innerHTML = '<div class="box">' + html + '</div>'; m.hidden = false; var f = $('input,select', m); if (f) f.focus(); }
function closeModal() { $('#modal').hidden = true; $('#modal').innerHTML = ''; }
var toastTimer;
function toast(msg, withUndo) {
  var t = $('#toast');
  t.innerHTML = '<span>' + esc(msg) + '</span>' + (withUndo ? '<button id="toastUndo">Undo</button>' : '');
  t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 5000);
}
function addCustomModal(name) {
  openModal('<h3>Add unlisted player</h3><div class="form" style="margin-top:12px"><label>Name<input type="text" id="cName" value="' + esc(name || '') + '"></label>' +
    '<label>Position<select id="cPos"><option>G</option><option>F</option><option>C</option><option>G/F</option><option>F/C</option></select></label>' +
    '<label>NBA team<input type="text" id="cTeam" value=""></label><label>Expected price ($)<input type="number" id="cExp" value="1" min="1"></label></div>' +
    '<div class="actions"><button class="btn" data-close="1">Cancel</button><button class="btn primary" id="cAdd">Add &amp; put on block</button></div>');
}

/* ================= events ================= */
document.addEventListener('click', function (e) {
  var t = e.target, el;
  if ((el = t.closest('#tabs button'))) { ui.tab = el.dataset.tab; render(); return; }
  if (t.closest('#toastUndo')) { undo(); $('#toast').hidden = true; return; }
  if (t.id === 'modal' || t.closest('[data-close]')) { closeModal(); return; }
  if ((el = t.closest('[data-sugg]'))) { putOnBlock(el.dataset.sugg); return; }
  if (t.closest('[data-addcustom]')) { addCustomModal($('#q').value.trim()); return; }
  if (t.closest('#blockClose')) { clearBlock(); return; }
  if ((el = t.closest('#block [data-team]'))) { ui.saleTeam = +el.dataset.team; ui.overrideOk = false; $$('#block [data-team]').forEach(function (b) { b.classList.toggle('sel', b === el); }); validateSale(); var pi = $('#salePrice'); if (pi && window.innerWidth > 720) pi.focus(); return; }
  if ((el = t.closest('[data-adj]'))) { ui.salePrice = String(Math.max(model.minBid, (Math.round(+ui.salePrice) || 0) + (+el.dataset.adj))); $('#salePrice').value = ui.salePrice; ui.overrideOk = false; validateSale(); return; }
  if ((el = t.closest('[data-set]'))) { ui.salePrice = el.dataset.set; $('#salePrice').value = ui.salePrice; ui.overrideOk = false; validateSale(); return; }
  if (t.closest('#logSale')) { logSale(); return; }
  if (t.closest('#delSale')) { removeSale(ui.blockId); ui.blockId = null; render(); return; }
  if ((el = t.closest('[data-edit]'))) { putOnBlock(el.dataset.edit); return; }
  if ((el = t.closest('#boardTools .seg button'))) { ui[el.dataset.k] = el.dataset.v; renderBoardTools(); renderBoard(); return; }
  if ((el = t.closest('[data-sort]'))) { var k = el.dataset.sort; if (ui.sortKey === k) ui.sortDir *= -1; else { ui.sortKey = k; ui.sortDir = (k === 'name' || k === 'pos' || k === 'rank' || k === 'tier' || k === 'status') ? 1 : -1; } renderBoard(); return; }
  if ((el = t.closest('[data-tsort]'))) { ui.teamSort = el.dataset.tsort; renderTeams(); return; }
  if ((el = t.closest('[data-block]'))) { putOnBlock(el.dataset.block); return; }
  if ((el = t.closest('[data-topen]'))) { var ti = +el.dataset.topen; ui.teamOpen[ti] = !ui.teamOpen[ti]; renderTeams(); return; }
  if ((el = t.closest('[data-punt]'))) { var pv = el.dataset.punt; commit(function (s) { s.punt = pv; }, pv === 'none' ? 'No punt.' : A.PUNT_LABEL[pv] + ' on.'); return; }
  // log tab
  if (t.closest('#undoPick')) { if (state.picks.length) { var last = model.row(state.picks[state.picks.length - 1].id); commit(function (s) { s.picks.pop(); }, 'Removed ' + last.p.name + '.'); } return; }
  if (t.closest('#expFile')) { download('draft-backup-' + stamp() + '.json', JSON.stringify(state, null, 1), 'application/json'); return; }
  if (t.closest('#expCopy')) { var txt = JSON.stringify(state); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { toast('Backup copied to clipboard.', false); }, function () { $('#ioBox').innerHTML = '<div class="card"><textarea class="io" readonly>' + esc(txt) + '</textarea></div>'; }); return; }
  if (t.closest('#expCsv')) { download('draft-picks-' + stamp() + '.csv', csv(), 'text/csv'); return; }
  if (t.closest('#impOpen')) { openModal('<h3>Import backup</h3><div class="small" style="margin:6px 0 10px">Paste a backup (this app or the old Draft Room export), or choose a file. This replaces the current draft — you can Undo.</div><input type="file" id="impFile" accept=".json,application/json"><textarea class="io" id="impText" style="margin-top:8px" placeholder="…or paste JSON here"></textarea><div class="actions"><button class="btn" data-close="1">Cancel</button><button class="btn primary" id="impGo">Import</button></div>'); return; }
  if (t.closest('#impGo')) { importText($('#impText').value); return; }
  if (t.closest('#resetPicks')) { if (confirm('Clear every pick? (You can Undo right after.)')) commit(function (s) { s.picks = []; }, 'All picks cleared.'); return; }
  // settings
  if (t.closest('#sSave')) {
    var slots = $('#sSlots').value.split(/[,\s]+/).map(function (x) { return x.trim().toUpperCase(); }).filter(Boolean);
    var budget = Math.max(1, Math.round(+$('#sBudget').value) || 200), minBid = Math.max(0, Math.round(+$('#sMin').value));
    if (!slots.length) { alert('Need at least one roster slot.'); return; }
    commit(function (s) { s.settings.slots = slots; s.settings.budget = budget; s.settings.minBid = minBid; s.settings.leagueName = $('#sName').value.trim(); s.settings.scoring = $('#sScoring').value.trim(); }, 'League settings saved.');
    return;
  }
  if (t.closest('#tAdd')) { commit(function (s) { s.teams.push({ name: 'Team ' + (s.teams.length + 1) }); }, 'Team added.'); return; }
  if (t.closest('#tRemove')) {
    var li = state.teams.length - 1;
    if (state.picks.some(function (p) { return p.team === li; })) { alert('That team has picks logged. Remove or reassign them first.'); return; }
    if (li === state.myTeam) { alert('That is your team. Mark another team as yours first.'); return; }
    commit(function (s) { s.teams.pop(); }, 'Team removed.'); return;
  }
  if (t.closest('#sDefaults')) { if (confirm('Restore default league settings and team names? Picks are kept.')) commit(function (s) { var f = E.freshState(DEFAULTS); s.settings = f.settings; s.teams = f.teams; s.myTeam = f.myTeam; }, 'Defaults restored.'); return; }
  if (t.closest('#sWipe')) { if (confirm('Wipe all picks, custom players and settings? Download a backup first if unsure.')) commit(function () { state = E.freshState(DEFAULTS); }, 'Everything wiped.'); return; }
  if (t.closest('#cAdd')) {
    var nm = $('#cName').value.trim(); if (!nm) return;
    var exp = Math.max(1, +$('#cExp').value || 1);
    var id = 'c' + (Date.now() % 1e9);
    commit(function (s) { s.custom.push({ id: id, rank: 900 + s.custom.length, name: nm, pos: $('#cPos').value, team: $('#cTeam').value.trim() || '—', tier: 10, exp: exp, ceil: exp + 1, flags: [], note: 'Added during draft.' }); }, 'Added ' + nm + '.');
    closeModal(); putOnBlock(id); return;
  }
});

document.addEventListener('input', function (e) {
  var t = e.target;
  if (t.id === 'q') { ui.suggIdx = 0; renderSugg(); return; }
  if (t.id === 'salePrice') { ui.salePrice = t.value; ui.overrideOk = false; validateSale(); return; }
  if (t.id === 'bq') { ui.bq = t.value; renderBoard(); return; }
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.dataset.tname != null) { var i = +t.dataset.tname, v = t.value.trim(); if (v) commit(function (s) { s.teams[i].name = v.slice(0, 40); }, null); return; }
  if (t.dataset.me != null) { var mi = +t.dataset.me; commit(function (s) { s.myTeam = mi; }, 'Your team: ' + teamName(mi)); return; }
  if (t.id === 'impFile' && t.files[0]) { var rd = new FileReader(); rd.onload = function () { $('#impText').value = rd.result; }; rd.readAsText(t.files[0]); }
});
document.addEventListener('keydown', function (e) {
  var t = e.target, inField = /INPUT|TEXTAREA|SELECT/.test(t.tagName);
  if (t.id === 'q') {
    var n = suggestions().length + ($('#q').value.trim().length >= 3 ? 1 : 0);
    if (e.key === 'ArrowDown') { ui.suggIdx = Math.min(n - 1, ui.suggIdx + 1); renderSugg(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { ui.suggIdx = Math.max(0, ui.suggIdx - 1); renderSugg(); e.preventDefault(); }
    else if (e.key === 'Enter') { pickSuggestion(); e.preventDefault(); }
    else if (e.key === 'Escape') { if (t.value) { t.value = ''; renderSugg(); } else clearBlock(); }
    return;
  }
  if (t.id === 'salePrice' && e.key === 'Enter') { logSale(); e.preventDefault(); return; }
  if (e.key === 'Escape') { if (!$('#modal').hidden) closeModal(); else if (ui.blockId != null) clearBlock(); return; }
  if (inField) return;
  if (e.key === '/') { ui.tab = 'draft'; render(); $('#q').focus(); e.preventDefault(); return; }
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') { undo(); e.preventDefault(); return; }
  var ti = '12345'.indexOf(e.key);
  if (ti >= 0 && !e.metaKey && !e.ctrlKey && !e.altKey) { ui.tab = TABS[ti][0]; render(); }
});
document.addEventListener('focusout', function (e) { if (e.target.id === 'q') setTimeout(function () { if (document.activeElement !== $('#q')) $('#sugg').innerHTML = ''; }, 150); });
document.addEventListener('focusin', function (e) { if (e.target.id === 'q') renderSugg(); });
document.addEventListener('pointerdown', function () { try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(function () {}); } catch (e) {} }, { once: true });
window.addEventListener('resize', function () { document.documentElement.style.setProperty('--hdr-h', $('#top').offsetHeight + 'px'); });

render();
// Debug/agent hook: inspect live state from the console.
window.DraftRoom = { get state() { return state; }, get model() { return model; }, get advice() { return advice; }, render: render };
})();
