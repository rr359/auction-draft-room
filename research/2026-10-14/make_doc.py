"""Build docs/price-review-2026-10-14.md from report.json (run analyze.py first)."""
import json, os
R = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'report.json')))
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
def fm(v): return '—' if v is None else f"${round(v)}"
L = []
A = L.append
A("# Price review — 2026-10-14\n")
A("Every price in the sheet was re-checked against the sources below and re-expressed for this league (14 teams, $200, 12 drafted). "
  "Script and raw data: [`research/2026-10-14/`](../research/2026-10-14/). Re-run with `python3 research/2026-10-14/analyze.py && python3 research/2026-10-14/make_doc.py` "
  "(reads the pre-review sheet `players.before.js`, writes `players.new.js` + `report.json` beside it).\n")
A("## Sources\n")
A("| Source | What it gives | Weight |\n|---|---|---|")
A("| Yahoo salary-cap draft analysis | **Avg $ actually paid** in Yahoo auctions (scaled by % of leagues drafting him) and Yahoo projected $ | 45% of market, 25% of value |")
A("| ESPN live draft results | **Avg $ actually paid** in ESPN auctions and ESPN projected $ | 25% of market, 10% of value |")
A("| Original panel sheet | The prior expected price | 30% of market, 20% of value |")
A("| Hashtag Basketball auction values | Value set to 14 teams / $200 / 12 roster / 9-cat (top 30 only on the free tier) | 25% of value |")
A("| Basketball Monster | 2025-26 9-cat per-game rank (actual production) | 20% of value (7% for injury-prone players) |")
A("| Yahoo (Dan Titus) 30-team preseason notes, ESPN injury report, Athlon auction guide, FantasyPros ADP | Role, injury and riser/faller news; applied as small multipliers with a note on the player | adjustments |\n")
A("Yahoo/ESPN rooms are mostly 10-12 teams, so each source is **rank-mapped onto a 14-team price curve** (the price of the Nth player in this league), not copied dollar-for-dollar.\n")
A("## How to read the calls\n")
A("- **BARGAIN** — consensus value is 15%+ above what rooms pay. Buy at market; your max is his value.")
A("- **PAY UP** — fair-or-better price plus something scarce (C eligibility, blocks/steals, or a rising role). Max is ~10% over market.")
A("- **OVERPRICED** — rooms pay 15%+ more than his 9-cat value. Your max sits below market: push the price, then let a rival pay. These are the best **Make rivals pay** nominations.")
A("- Blank — fairly priced.\n")
A("Guardrails: a player needs at least **two independent sources** to get a call; **injury-prone** players (Embiid, Kawhi, Kyrie, AD, Zion, LeBron, Paul George, Morant, Haliburton…) are never tagged Bargain/Pay up and their max stays within ~10% of market; players **out long-term** (Butler, Mark Williams, Porziņģis, Lively) are stash-at-market only.\n")
for call, title in [('bargain', 'Bargains'), ('payup', 'Pay up'), ('overpriced', 'Overpriced')]:
    xs = sorted([r for r in R if r['call'] == call], key=lambda r: -r['exp'])
    A(f"## {title} ({len(xs)})\n")
    A("| Player | Market (was → now) | Your max (was → now) | Yahoo paid | ESPN paid | Note |\n|---|---|---|---|---|---|")
    for r in xs:
        A(f"| {r['name']} | {fm(r['old_exp'])} → **${r['exp']}** | {fm(r['old_ceil'])} → **${r['ceil']}** | {fm(r['src']['yAvg'])} | {fm(r['src']['eAvg'])} | {r['news']} |")
    A("")
A("## Biggest price moves\n")
A("| Player | Market was → now | Max was → now | Call | Why |\n|---|---|---|---|---|")
for r in sorted([r for r in R if r['old_exp'] is not None], key=lambda r: -abs(r['exp'] - r['old_exp']))[:30]:
    s = r['src']; why = []
    if s['yAvg'] is not None: why.append(f"Yahoo rooms pay ${round(s['yAvg'])}")
    if s['eAvg'] is not None: why.append(f"ESPN ${round(s['eAvg'])}")
    if s['ht14'] is not None: why.append(f"Hashtag ${round(s['ht14'])}")
    if s['bbm'] is not None: why.append(f"BBM #{s['bbm']}")
    if r['news']: why.append(r['news'])
    A(f"| {r['name']} | ${round(r['old_exp'])} → **${r['exp']}** | ${round(r['old_ceil'])} → **${r['ceil']}** | {r['call'] or 'fair'} | {'; '.join(why)} |")
A("\n## Added players\n")
A(", ".join(f"{r['name']} (${r['exp']}{', ' + r['call'] if r['call'] else ''})" for r in R if r['new']) + "\n")
A("## Other changes\n")
A("- Positions now use **Yahoo eligibility** (PG/SG/SF/PF/C) instead of G/F/C, so roster fit and 'fills your PF slot' advice are exact.")
A("- Players are re-ranked and re-tiered by the new market price.")
A("- Prices are whole dollars.")
A("- No NBA team assignments needed changing; the sheet already matched Yahoo.")
A("- 15 deep-bench players had no source data and keep their old $1-2 prices.")
open(os.path.join(ROOT, 'docs', 'price-review-2026-10-14.md'), 'w').write('\n'.join(L))
