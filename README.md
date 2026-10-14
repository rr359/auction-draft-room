# 🏀 Draft Room — Fantasy Basketball Auction Control Center

A zero-install web app for running a live fantasy basketball **auction** draft: see who's available and who's gone, what everyone has paid, how much money every team has left, and get live bid/pass advice for your roster.

**Live app:** https://rr359.github.io/auction-draft-room/ (works on laptop and phone)
Or just open `index.html` in a browser — no build step, no server, no dependencies.

## During the draft

1. **Someone nominates a player** → press `/`, type a few letters, hit `Enter`. The player goes "on the block".
2. Read the call: **BID up to $X**, **PUSH to $Y then drop** (price enforcement), or **PASS**, plus the reasons, the rivals who can afford him, and fallback options if the price runs.
3. **When he sells** → click the winning team, type the price, hit `Enter`. Budgets, max bids, inflation and the advisor update instantly. A toast offers **Undo**.

| Tab | What it's for |
|---|---|
| **Draft** | Search/block panel, full player board (filters: available/sold, position, fills-my-need, BID calls, values, punt fits, risks), advisor sidebar, room money table |
| **Teams & Money** | Every team's $ left, max bid, roster count, $/open slot, open starting slots, value vs paid. Click a team to see its roster. |
| **My Team** | Budget, roster slots, purchases, category direction (punt FT% / TO / AST), price templates |
| **Log** | Every pick in order. Edit, undo, download/copy a JSON backup, import, CSV export |
| **Settings** | Team names, which team is yours, budget, min bid, roster slots |

Keyboard: `/` search · `↑ ↓ Enter` choose · `Esc` clear · `1`–`5` switch tabs · `Ctrl/⌘+Z` undo.

**Data is saved in your browser only** (localStorage). It does not sync between devices. Use **Log → Download backup** now and then; **Log → Import** restores it (also accepts exports from the old single-file Draft Room).

## How the numbers work

- **Market** — the sheet's expected price × live inflation. Inflation = (money left in the room − $1 per open roster spot) ÷ (sheet value of the best remaining players who will fill those spots). If the room underspends early, prices rise.
- **Ceiling** — the price sheet's max for the player. It does **not** inflate.
- **Your max** — the advisor's number for *you*: the ceiling, adjusted for roster fit (bench-only buys capped at 75% of market), position scarcity, punt fit, STL/BLK value, FT% drag, and budget rules (legal max, a reserve for remaining starters, and a cap of 70% of budget on your top two players). Upward nudges are capped at +6%.
- **Max bid** — money left minus the minimum bid for every other open slot (what Yahoo will let a team bid).

## League defaults

14 teams · $200 · 12 drafted players (PG, SG, G, SF, PF, F, C, UTIL, UTIL, BN×3) · 2 IL spots (not drafted) · 9-cat H2H. Change in **Settings**; prices rescale automatically from the 14 × $200 × 13 sheet. Positions in the sheet are G / F / C / G/F / F/C, so G fills PG/SG/G and F fills SF/PF/F.

The player prices in `js/players.js` were carried over from the original sheet unchanged and have not been refreshed or fact-checked.

## For developers and agents

See [AGENTS.md](AGENTS.md). Tests: `npm test` (Node 18+, no dependencies).
