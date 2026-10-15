// Run: node --test tests/*.test.js
const test = require('node:test');
const assert = require('node:assert');
const E = require('../js/engine.js');
const A = require('../js/advisor.js');
const PLAYERS = require('../js/players.js');
const DEFAULTS = require('../js/config.js');

function stateWith(picks) {
  const s = E.freshState(DEFAULTS);
  s.picks = picks.map(([id, team, price]) => ({ id, team, price, ts: 0 }));
  return s;
}

test('fresh draft: market equals the sheet and budgets are full', () => {
  const m = E.buildModel(stateWith([]), PLAYERS);
  assert.strictEqual(m.teams.length, 14);
  assert.ok(m.row(1).market > 80 && m.row(1).market < 90, 'Jokic market ' + m.row(1).market);
  assert.ok(Math.abs(m.inflation - 1) < 1e-9);
  assert.strictEqual(m.me.maxBid, 200 - 11);
  assert.strictEqual(m.rosterSize, 12);
  assert.strictEqual(m.me.name, 'Franz A Make Her Dance');
});

test('budgets, max bid and open slots update with picks', () => {
  const m = E.buildModel(stateWith([[1, 0, 85], [2, 3, 70]]), PLAYERS);
  assert.strictEqual(m.me.left, 115);
  assert.strictEqual(m.me.open, 11);
  assert.strictEqual(m.me.maxBid, 115 - 10);
  assert.strictEqual(m.teams[3].left, 130);
  assert.ok(m.row(1).taken);
});

test('roster fitting fills C, then UTIL, then bench', () => {
  const slots = DEFAULTS.slots;
  const a = E.assignRoster([{ pos: 'C', price: 50 }, { pos: 'C', price: 40 }, { pos: 'F/C', price: 30 }], slots);
  const filled = a.slots.filter(s => s.entry).map(s => s.slot);
  assert.strictEqual(filled.length, 3);
  assert.ok(filled.includes('C') && filled.includes('UTIL') && !filled.includes('BN'), filled.join());
  assert.strictEqual(E.starterSlotFor([{ pos: 'G', price: 5 }, { pos: 'G', price: 5 }, { pos: 'G', price: 5 }], slots, 'G'), 'UTIL');
});

test('G/F player shuffles so a pure F still fills a starter', () => {
  const a = E.assignRoster([{ pos: 'G/F', price: 9 }, { pos: 'G', price: 8 }, { pos: 'G', price: 7 }, { pos: 'G', price: 6 }], DEFAULTS.slots);
  assert.strictEqual(a.slots.filter(s => s.entry && s.slot !== 'BN' && s.slot !== 'UTIL').length, 4);
});

test('inflation rises when the room underspends', () => {
  const picks = [];
  for (let i = 1; i <= 20; i++) picks.push([i, i % 14, 1]);
  const m = E.buildModel(stateWith(picks), PLAYERS);
  assert.ok(m.inflation > 1.2, 'inflation ' + m.inflation);
});

test('bid advice respects legal max and roster needs', () => {
  // I spend 180 on one player: legal max is 20 - 10 = 10.
  const m = E.buildModel(stateWith([[1, 0, 180]]), PLAYERS);
  const a = A.bidAdvice(m, m.state, m.row(5));
  assert.ok(a.upTo <= 10, 'upTo ' + a.upTo);
  // A fourth pure C (Clingan) is bench-only once C and both UTILs hold Jokic, Wembanyama, Kessler.
  const s = stateWith([[1, 0, 60], [2, 0, 50], [39, 0, 20]]);
  const m2 = E.buildModel(s, PLAYERS);
  assert.strictEqual(m2.row(50).p.pos, 'C');
  const adv = A.bidAdvice(m2, s, m2.row(50));
  assert.strictEqual(adv.slot, null);
});

test('every player has a valid price, ceiling and call', () => {
  for (const p of PLAYERS) {
    assert.ok(Number.isInteger(p.exp) && p.exp >= 1, p.name + ' exp');
    assert.ok(Number.isInteger(p.ceil) && p.ceil >= 1, p.name + ' ceil');
    assert.ok(['', 'bargain', 'payup', 'overpriced'].includes(p.call), p.name + ' call');
    if (p.call === 'overpriced') assert.ok(p.ceil < p.exp || p.exp === 1, p.name + ' overpriced ceiling should sit below market');
    if (p.call === 'bargain' || p.call === 'payup') assert.ok(p.ceil > p.exp, p.name + ' ceiling should sit above market');
  }
  assert.strictEqual(new Set(PLAYERS.map(p => p.id)).size, PLAYERS.length, 'ids unique');
});

test('advise produces targets and nominations on a fresh board', () => {
  const s = stateWith([]);
  const m = E.buildModel(s, PLAYERS);
  const r = A.advise(m, s);
  assert.ok(r.targets.length > 0);
  assert.ok(r.nominations.length > 0);
  assert.ok(r.byNeed.length >= 7);
});

test('league rescaling: base 13-man sheet reproduces exactly; $100 budget halves prices roughly', () => {
  const s = stateWith([]);
  s.settings.slots = DEFAULTS.slots.concat(['BN']);
  assert.ok(Math.abs(E.buildModel(s, PLAYERS).row(1).market - 80) < 0.01);
  s.settings.budget = 100;
  const m = E.buildModel(s, PLAYERS);
  assert.ok(m.row(1).market > 35 && m.row(1).market < 42, 'market ' + m.row(1).market);
});

test('v1 export migrates', () => {
  const v1 = { teams: [{ name: 'A' }, { name: 'B' }], myTeam: 1, picks: [{ p: 0, t: 1, pr: 77 }], punt: 'blk', custom: [] };
  const s = E.migrate(v1, DEFAULTS, PLAYERS);
  assert.strictEqual(s.picks[0].id, 1);
  assert.strictEqual(s.picks[0].price, 77);
  assert.strictEqual(s.punt, 'none');
});

test('search handles accents and last names', () => {
  const m = E.buildModel(stateWith([]), PLAYERS);
  assert.strictEqual(E.searchPlayers(m.players, 'jokic')[0].p.name, 'Nikola Jokić');
  assert.strictEqual(E.searchPlayers(m.players, 'sengun')[0].p.name, 'Alperen Şengün');
  assert.strictEqual(E.searchPlayers(m.players, 'wemb')[0].id, 2);
});

test('top-two cap holds with several players rostered', () => {
  // Own $75 and $40 players: a new star can be bid to at most 140 - 75 = 65.
  const s = stateWith([[1, 0, 75], [60, 0, 40]]);
  const m = E.buildModel(s, PLAYERS);
  const a = A.bidAdvice(m, s, m.row(2)); // Wembanyama
  assert.ok(a.upTo <= 65, 'upTo ' + a.upTo);
  // ...but a cheap player below your #2 price is unaffected by the cap.
  const cheap = A.bidAdvice(m, s, m.row(40));
  assert.ok(!cheap.cautions.some(c => /Top-two/.test(c)), cheap.cautions.join());
});

test('PAY UP players do not get a second blocks/steals premium', () => {
  const s = stateWith([]);
  const m = E.buildModel(s, PLAYERS);
  const wemby = m.row(2);
  assert.strictEqual(wemby.p.call, 'payup');
  const a = A.bidAdvice(m, s, wemby);
  assert.ok(!a.reasons.some(r => /Scarce (BLK|STL)/.test(r)), a.reasons.join());
});

test('search ignores apostrophes and accents', () => {
  const m = E.buildModel(stateWith([]), PLAYERS);
  assert.strictEqual(E.searchPlayers(m.players, 'deaaron')[0].p.name, "De'Aaron Fox");
  assert.strictEqual(E.searchPlayers(m.players, "de'aaron")[0].p.name, "De'Aaron Fox");
  assert.strictEqual(E.searchPlayers(m.players, 'porzingis')[0].p.name.slice(0, 8), 'Kristaps');
});

test('a full simulated draft following the advisor stays legal and fills the roster', () => {
  let seed = 42; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const s = stateWith([]);
  for (let guard = 0, nom = 0; guard < 400; guard++, nom++) {
    const m = E.buildModel(s, PLAYERS);
    if (m.teams.every(t => t.open === 0)) break;
    const adv = A.advise(m, s);
    m.teams.forEach(t => assert.ok(t.left >= t.open * m.minBid, t.name + ' overspent'));
    const nomTeam = m.teams[nom % 14];
    if (nomTeam.open === 0) continue;
    const row = nomTeam.isMe && adv.nominations.length ? adv.nominations[0].r : m.available.slice().sort((a, b) => b.market - a.market)[Math.floor(rnd() * 3)];
    const bids = m.teams.filter(t => t.open > 0).map(t => {
      let v;
      if (t.isMe) { const a = adv.byId[String(row.id)]; v = !a ? 0 : a.verdict === 'BID' ? a.upTo : a.verdict === 'ENFORCE' ? a.enforceTo : 0; assert.ok(v <= t.maxBid, 'advice over legal max'); }
      else v = Math.round(row.market * (0.8 + rnd() * 0.45));
      return { t, v: Math.min(Math.max(v, 0), t.maxBid) };
    }).sort((a, b) => b.v - a.v);
    const win = bids[0], price = Math.max(1, Math.min(win.v, (bids[1] || { v: 0 }).v + 1));
    s.picks.push({ id: row.id, team: win.v >= 1 ? win.t.idx : nomTeam.idx, price: win.v >= 1 ? price : 1, ts: 0 });
  }
  const me = E.buildModel(s, PLAYERS).me;
  assert.strictEqual(me.open, 0, 'roster not filled');
  assert.strictEqual(me.openStarters.length, 0);
  assert.ok(me.left <= 3, 'left money on the table: $' + me.left);
});

test('players out long-term are never recommended as starters', () => {
  const s = stateWith([]);
  const m = E.buildModel(s, PLAYERS);
  const outs = PLAYERS.filter(p => p.flags.includes('out'));
  assert.ok(outs.length >= 3);
  outs.forEach(p => assert.strictEqual(A.bidAdvice(m, s, m.row(p.id)).verdict, 'PASS', p.name));
});
