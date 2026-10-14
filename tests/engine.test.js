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
  // A second pure C is bench-only once the C slot and UTILs are full.
  const s = stateWith([[1, 0, 60], [15, 0, 30], [22, 0, 20]]);
  const m2 = E.buildModel(s, PLAYERS);
  const adv = A.bidAdvice(m2, s, m2.row(35));
  assert.strictEqual(adv.slot, null);
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
