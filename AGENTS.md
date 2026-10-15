# AGENTS.md — working on Draft Room

A static, dependency-free web app. No bundler, no framework, no npm install. Plain browser scripts with UMD wrappers so the logic also loads in Node for tests. It must keep working when `index.html` is opened directly from disk (`file://`), so **do not convert to ES modules** or add a build step.

## Layout

| Path | Role |
|---|---|
| `index.html` | Shell markup; loads the scripts in order. Bump the `?v=N` query on every asset when you change JS/CSS so browsers and GitHub Pages pick up the new files. |
| `css/app.css` | All styles (dark theme, tokens in `:root`). |
| `js/config.js` | League defaults (`DRAFT_DEFAULTS`): team names, budget, min bid, roster slots, my team. |
| `js/players.js` | Price sheet (`DRAFT_PLAYERS`). One player per line. Field docs at the top of the file. |
| `js/engine.js` | `DraftEngine`: pure state → model. Budgets, max bids, roster-slot matching, inflation/market prices, search, state migration. No DOM. |
| `js/advisor.js` | `DraftAdvisor`: pure rules engine over the model. `bidAdvice()` (per-player call), `alternatives()`, `advise()` (targets, nominations, needs, alerts, endgame). No DOM. |
| `js/app.js` | All UI: rendering, events, persistence (localStorage key `draftRoom.state.v2`), undo stack, import/export. |
| `tests/engine.test.js` | `node --test` suite for engine + advisor. Run `npm test`. |
| `legacy/` | The original single-file app and its source, kept for reference only. Not loaded. |
| `research/`, `docs/` | Price-review inputs, script and the human-readable changelog. Not loaded by the app. |

## State shape (localStorage `draftRoom.state.v2`, also the backup/export format)

```js
{
  version: 2,
  settings: { budget, minBid, slots: ['PG','SG',...,'BN'], leagueName, scoring },
  teams: [{ name }],          // index = team id
  myTeam: 0,
  picks: [{ id, team, price, ts }],   // id = player id (number for sheet players, 'cN' for custom)
  custom: [{ id:'c…', name, pos, team, tier, exp, ceil, flags, note }],
  punt: 'none' | 'ft' | 'to' | 'ast'
}
```
`DraftEngine.migrate()` accepts this and the legacy v1 export (`picks:[{p:index,t,pr}]`).

## Key rules

- **Price scaling**: the sheet assumes 14 teams × $200 × 13 spots. `buildModel` computes dollars-per-value for the configured league (`scale`) and for the live room (`marketMult`); `inflation = live / start`. Ceilings scale with league size but never inflate.
- **Roster fit**: `assignRoster` is a phased max bipartite matching (positional slots → UTIL → BN). `starterSlotFor` says whether a player would fill an empty starting slot (including via shuffles of G/F, F/C players).
- **Advisor thresholds** live as constants at the top of `advisor.js` (`TOP_TWO_CAP`, `MAX_BUMP`) and inline in `bidAdvice`. Keep advice explainable: every adjustment should push a human-readable string into `reasons` or `cautions`.
- Player ids are stable (= original rank). Don't renumber; add new players with new ids.

## Updating player data

Edit `js/players.js` in place (one JSON object per line). Keep `id` stable for players that might already be in someone's saved picks. `exp`/`ceil` are whole dollars in baseline-league terms (14 teams × $200 × 13). `call` is `bargain` | `payup` | `overpriced` | `''`; `src` holds the raw source numbers shown on the player card. Run `npm test` afterwards (it checks every player's price/ceiling/call is consistent).

A full re-price is reproducible: `research/2026-10-14/` holds the scraped source data, the pre-review sheet and `analyze.py` (method and weights are in its docstring and in `docs/price-review-2026-10-14.md`). For a new review, copy that folder to a new date, refresh the `.txt` inputs, run it, review `report.json`, then copy `players.new.js` over `js/players.js`.

## Checking changes

1. `npm test`
2. Open `index.html` (or `python3 -m http.server` in the repo root) and run a nomination: `/` → name → Enter → pick a team → price → Enter. Check the header, Teams tab and Log update; check the console is clean.
3. `window.DraftRoom.state / .model / .advice` are exposed for debugging in the console.
