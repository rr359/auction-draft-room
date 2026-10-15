# Price review — 2026-10-14

Every price in the sheet was re-checked against the sources below and re-expressed for this league (14 teams, $200, 12 drafted). Script and raw data: [`research/2026-10-14/`](../research/2026-10-14/). Re-run with `python3 research/2026-10-14/analyze.py && python3 research/2026-10-14/make_doc.py` (reads the pre-review sheet `players.before.js`, writes `players.new.js` + `report.json` beside it).

## Sources

| Source | What it gives | Weight |
|---|---|---|
| Yahoo salary-cap draft analysis | **Avg $ actually paid** in Yahoo auctions (scaled by % of leagues drafting him) and Yahoo projected $ | 45% of market, 25% of value |
| ESPN live draft results | **Avg $ actually paid** in ESPN auctions and ESPN projected $ | 25% of market, 10% of value |
| Original panel sheet | The prior expected price | 30% of market, 20% of value |
| Hashtag Basketball auction values | Value set to 14 teams / $200 / 12 roster / 9-cat (top 30 only on the free tier) | 25% of value |
| Basketball Monster | 2025-26 9-cat per-game rank (actual production) | 20% of value (7% for injury-prone players) |
| Yahoo (Dan Titus) 30-team preseason notes, ESPN injury report, Athlon auction guide, FantasyPros ADP | Role, injury and riser/faller news; applied as small multipliers with a note on the player | adjustments |

Yahoo/ESPN rooms are mostly 10-12 teams, so each source is **rank-mapped onto a 14-team price curve** (the price of the Nth player in this league), not copied dollar-for-dollar.

## How to read the calls

- **BARGAIN** — consensus value is 15%+ above what rooms pay. Buy at market; your max is his value.
- **PAY UP** — fair-or-better price plus something scarce (C eligibility, blocks/steals, or a rising role). Max is ~10% over market.
- **OVERPRICED** — rooms pay 15%+ more than his 9-cat value. Your max sits below market: push the price, then let a rival pay. These are the best **Make rivals pay** nominations.
- Blank — fairly priced.

Guardrails: a player needs at least **two independent sources** to get a call; **injury-prone** players (Embiid, Kawhi, Kyrie, AD, Zion, LeBron, Paul George, Morant, Haliburton…) are never tagged Bargain/Pay up and their max stays within ~10% of market; players **out long-term** (Butler, Mark Williams, Porziņģis, Lively) are stash-at-market only.

## Bargains (25)

| Player | Market (was → now) | Your max (was → now) | Yahoo paid | ESPN paid | Note |
|---|---|---|---|---|---|
| Lauri Markkanen | $32 → **$26** | $36 → **$32** | $22 | $14 |  |
| Trey Murphy | $34 → **$26** | $37 → **$32** | $21 | $10 |  |
| Walker Kessler | $25 → **$22** | $28 → **$28** | $17 | $10 | Finger, not concerning (Titus). BBM 9-cat #12 last season. Athlon: pay $20-25 if he starts. |
| Derrick White | $22 → **$22** | $27 → **$25** | $14 | $20 |  |
| Onyeka Okongwu | $19 → **$17** | $22 → **$20** | $8 | $7 |  |
| Nickeil Alexander-Walker | $20 → **$16** | $22 → **$21** | $4 | $12 |  |
| Michael Porter Jr. | $18 → **$16** | $22 → **$20** | $4 | $11 |  |
| OG Anunoby | $17 → **$14** | $21 → **$17** | $5 | $6 |  |
| Dyson Daniels | $12 → **$14** | $14 → **$16** | $4 | $11 |  |
| Alex Sarr | $12 → **$13** | $14 → **$15** | $5 | $5 |  |
| Mikal Bridges | $10 → **$12** | $12 → **$15** | $2 | $12 |  |
| Damian Lillard | $14 → **$12** | $15 → **$14** | $3 | $7 |  |
| Ryan Rollins | $16 → **$10** | $20 → **$14** | $2 | $3 |  |
| Kel'el Ware | $9 → **$10** | $14 → **$13** | $3 | $5 |  |
| Ty Jerome | $9 → **$9** | $9 → **$12** | $1 | $6 | Positive buzz; value vs ADP (Titus). |
| Ausar Thompson | $8 → **$9** | $11 → **$12** | $3 | $4 | Yahoo's Dan Titus: top breakout pick; ADP climbing. STL/BLK from a wing. |
| Jalen Suggs | $10 → **$8** | $12 → **$11** | $3 | $1 |  |
| Immanuel Quickley | $11 → **$8** | $14 → **$11** | $1 | $2 |  |
| Andrew Wiggins | $9 → **$8** | $9 → **$10** | $1 | $2 |  |
| Fred VanVleet | $11 → **$7** | $14 → **$10** | $1 | $3 | Back from ACL: 17/7/2 stl with five 3s in 24 min. Titus: ADP too low. |
| Reed Sheppard | $7 → **$6** | $8 → **$7** | $1 | $2 |  |
| Neemias Queta | $2 → **$4** | $4 → **$7** | $1 | $1 | Competing with Mitchell Robinson; Titus expects Queta to win the job. |
| Wendell Carter Jr. | $2 → **$4** | $3 → **$5** | $2 | — |  |
| Nikola Vučević | $2 → **$3** | $3 → **$6** | $1 | $1 |  |
| Collin Gillespie | $2 → **$3** | $2 → **$5** | $1 | $1 |  |

## Pay up (14)

| Player | Market (was → now) | Your max (was → now) | Yahoo paid | ESPN paid | Note |
|---|---|---|---|---|---|
| Nikola Jokić | $80 → **$80** | $82 → **$86** | $79 | $86 |  |
| Victor Wembanyama | $74 → **$74** | $82 → **$82** | $78 | $82 |  |
| Chet Holmgren | $31 → **$28** | $34 → **$32** | $27 | $13 |  |
| Jalen Duren | $22 → **$25** | $22 → **$28** | $22 | $25 |  |
| Jaren Jackson Jr. | $26 → **$21** | $29 → **$25** | $15 | $7 |  |
| Donovan Clingan | $20 → **$20** | $22 → **$22** | $16 | $8 |  |
| Zach Edey | $19 → **$15** | $22 → **$18** | $5 | $3 |  |
| Jarrett Allen | $10 → **$12** | $12 → **$14** | $3 | $8 |  |
| Jaden McDaniels | $13 → **$10** | $15 → **$12** | $2 | $3 |  |
| Brandin Podziemski | $8 → **$8** | $9 → **$10** | $1 | $3 | Preseason usage up to 28%; Titus expects a breakout. |
| Anthony Black | $6 → **$5** | $8 → **$7** | — | $0 | First guard off ORL bench, path to 25+ mpg. Titus favorite stash. |
| Peyton Watson | $4 → **$5** | $5 → **$7** | $1 | $1 | Healthy; 7/4/4/2 blk debut. Value after pick 100 (Titus). |
| Cason Wallace | $3 → **$4** | $5 → **$6** | $1 | $1 |  |
| Daniel Gafford | $3 → **$4** | $4 → **$5** | $1 | $1 | Lively, Aldama, Morez Johnson all out — role grows by default (Titus sleeper). |

## Overpriced (22)

| Player | Market (was → now) | Your max (was → now) | Yahoo paid | ESPN paid | Note |
|---|---|---|---|---|---|
| Giannis Antetokounmpo | $45 → **$54** | $55 → **$51** | $62 | $64 | Split: Titus moving him up in 9-cat; Athlon calls him the biggest overpay risk; BBM 9-cat rank #67 (FT%, TO). |
| Jayson Tatum | $45 → **$49** | $45 → **$45** | $57 | $56 |  |
| Josh Giddey | $33 → **$36** | $36 → **$33** | $38 | $33 |  |
| Trae Young | $34 → **$35** | $37 → **$32** | $35 | $32 |  |
| Jalen Brunson | $24 → **$32** | $28 → **$31** | $32 | $39 |  |
| Devin Booker | $25 → **$31** | $28 → **$29** | $31 | $31 |  |
| Domantas Sabonis | $27 → **$30** | $29 → **$27** | $25 | $37 | Says knee is fully recovered; Titus likes the discounted bounce-back. |
| Jaylen Brown | $23 → **$25** | $26 → **$23** | $24 | $20 |  |
| Pascal Siakam | $20 → **$21** | $22 → **$19** | $9 | $24 |  |
| Paolo Banchero | $17 → **$21** | $17 → **$17** | $16 | $16 |  |
| Kon Knueppel | $17 → **$19** | $20 → **$17** | $10 | $15 | Hamstring; out for preseason, targeted ~Oct 21. |
| Julius Randle | $14 → **$16** | $15 → **$14** | $6 | $9 |  |
| Stephon Castle | $16 → **$16** | $20 → **$13** | $5 | $10 |  |
| Zion Williamson | $11 → **$13** | $14 → **$12** | $5 | $7 |  |
| Rudy Gobert | $12 → **$13** | $14 → **$12** | $5 | $6 |  |
| AJ Dybantsa | $3 → **$9** | $4 → **$8** | $3 | $6 |  |
| Ja Morant | $8 → **$9** | $11 → **$8** | $2 | $5 | Looked rusty, explosiveness not back (Titus avoiding). |
| Derik Queen | $6 → **$8** | $8 → **$7** | $3 | $2 |  |
| Darryn Peterson | $2 → **$8** | $2 → **$6** | $3 | $3 |  |
| Darius Acuff Jr. | — → **$7** | — → **$6** | $2 | $2 | Rookie PG with volume; better in points leagues (Titus). |
| Nic Claxton | $6 → **$7** | $8 → **$6** | $2 | $1 | Hamstring; re-evaluated Oct 19. Jalen Smith starting. |
| RJ Barrett | $4 → **$6** | $4 → **$5** | $1 | $2 |  |

## Biggest price moves

| Player | Market was → now | Max was → now | Call | Why |
|---|---|---|---|---|
| Giannis Antetokounmpo | $45 → **$54** | $55 → **$51** | overpriced | Yahoo rooms pay $62; ESPN $64; Hashtag $52; BBM #67; Split: Titus moving him up in 9-cat; Athlon calls him the biggest overpay risk; BBM 9-cat rank #67 (FT%, TO). |
| Jalen Johnson | $56 → **$48** | $64 → **$52** | fair | Yahoo rooms pay $50; ESPN $55; Hashtag $34; BBM #18; Titus: 9th per game without McCollum, 34th with him — 2nd-round value, not 1st. |
| Cooper Flagg | $34 → **$42** | $38 → **$45** | fair | Yahoo rooms pay $51; ESPN $52; Hashtag $34; BBM #42 |
| Tyrese Haliburton | $32 → **$40** | $36 → **$43** | fair | Yahoo rooms pay $50; ESPN $40; Hashtag $34 |
| Jalen Brunson | $24 → **$32** | $28 → **$31** | overpriced | Yahoo rooms pay $32; ESPN $39; BBM #47 |
| Trey Murphy | $34 → **$26** | $37 → **$32** | bargain | Yahoo rooms pay $21; ESPN $10; Hashtag $33; BBM #11 |
| Austin Reaves | $40 → **$33** | $46 → **$36** | fair | Yahoo rooms pay $29; ESPN $23; Hashtag $34; BBM #27 |
| LeBron James | $14 → **$21** | $19 → **$23** | fair | Yahoo rooms pay $20; ESPN $16; BBM #50 |
| Devin Booker | $25 → **$31** | $28 → **$29** | overpriced | Yahoo rooms pay $31; ESPN $31; Hashtag $26; BBM #65 |
| Lauri Markkanen | $32 → **$26** | $36 → **$32** | bargain | Yahoo rooms pay $22; ESPN $14; BBM #8 |
| Kyrie Irving | $12 → **$18** | $18 → **$20** | fair | Yahoo rooms pay $12; ESPN $12; Hashtag $28; Healthy; debuting in Macau 19 months after ACL surgery. |
| Ryan Rollins | $16 → **$10** | $20 → **$14** | bargain | Yahoo rooms pay $2; ESPN $3; BBM #52 |
| AJ Dybantsa | $3 → **$9** | $4 → **$8** | overpriced | Yahoo rooms pay $3; ESPN $6 |
| Darryn Peterson | $2 → **$8** | $2 → **$6** | overpriced | Yahoo rooms pay $3; ESPN $3 |
| Kawhi Leonard | $23 → **$28** | $28 → **$31** | fair | Yahoo rooms pay $26; ESPN $26; Hashtag $36; BBM #4 |
| Anthony Davis | $19 → **$24** | $25 → **$26** | fair | Yahoo rooms pay $18; ESPN $28; Hashtag $28; BBM #22 |
| Brandon Miller | $29 → **$24** | $29 → **$25** | fair | Yahoo rooms pay $22; ESPN $9; BBM #56 |
| Jaren Jackson Jr. | $26 → **$21** | $29 → **$25** | payup | Yahoo rooms pay $15; ESPN $7; Hashtag $27; BBM #48 |
| Matas Buzelis | $23 → **$18** | $26 → **$19** | fair | Yahoo rooms pay $6; ESPN $6; BBM #74 |
| Joel Embiid | $10 → **$15** | $15 → **$16** | fair | Yahoo rooms pay $8; ESPN $8; BBM #24; Rusty preseason (8 TO in a game); maintenance risk. |
| Shai Gilgeous-Alexander | $70 → **$66** | $82 → **$74** | fair | Yahoo rooms pay $66; ESPN $73; Hashtag $70; BBM #3 |
| Jayson Tatum | $45 → **$49** | $45 → **$45** | overpriced | Yahoo rooms pay $57; ESPN $56; Hashtag $40; BBM #26 |
| Scottie Barnes | $48 → **$44** | $49 → **$46** | fair | Yahoo rooms pay $47; ESPN $43; Hashtag $32; BBM #13 |
| Kevin Durant | $44 → **$40** | $49 → **$43** | fair | Yahoo rooms pay $46; ESPN $33; Hashtag $38; BBM #15 |
| Stephen Curry | $38 → **$34** | $44 → **$39** | fair | Yahoo rooms pay $32; ESPN $25; Hashtag $40; BBM #10 |
| Paolo Banchero | $17 → **$21** | $17 → **$17** | overpriced | Yahoo rooms pay $16; ESPN $16; BBM #129 |
| Nickeil Alexander-Walker | $20 → **$16** | $22 → **$21** | bargain | Yahoo rooms pay $4; ESPN $12; BBM #28 |
| Zach Edey | $19 → **$15** | $22 → **$18** | payup | Yahoo rooms pay $5; ESPN $3; BBM #33 |
| Payton Pritchard | $5 → **$9** | $5 → **$10** | fair | Yahoo rooms pay $4; ESPN $3; BBM #72 |
| Keegan Murray | $12 → **$8** | $14 → **$9** | fair | Yahoo rooms pay $1; ESPN $2; BBM #90 |

## Added players

Darius Acuff Jr. ($7, overpriced), Mark Williams ($3), Draymond Green ($3), Aday Mara ($2), Jared McCain ($2), Klay Thompson ($2), Bennedict Mathurin ($1), Oso Ighodaro ($1), Dennis Schröder ($1), Jaylon Tyson ($1), Kyle Filipowski ($1), Deandre Ayton ($1), Alex Caruso ($1), Anfernee Simons ($1)

## Other changes

- Positions now use **Yahoo eligibility** (PG/SG/SF/PF/C) instead of G/F/C, so roster fit and 'fills your PF slot' advice are exact.
- Players are re-ranked and re-tiered by the new market price.
- Prices are whole dollars.
- No NBA team assignments needed changing; the sheet already matched Yahoo.
- 15 deep-bench players had no source data and keep their old $1-2 prices.