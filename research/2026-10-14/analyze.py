"""Triangulate the draft sheet against online sources and emit an updated players.js + a changelog.

Sources (all pulled 2026-10-14):
  Yahoo salary-cap draft analysis: Avg $ actually paid in Yahoo auctions + Yahoo Proj $
  ESPN live draft results: average auction value in ESPN drafts + ESPN projected auction value
  Hashtag Basketball auction values set to 14 teams / $200 / 12 roster / 9-cat (top 30, free tier)
  Basketball Monster 9-cat per-game ranks (2025-26 actual production)
  Yahoo (Dan Titus) 30-team preseason notes, ESPN injury report, Athlon auction guide
"""
import json, re, sys, unicodedata, os

# Usage: python3 research/2026-10-14/analyze.py   (writes players.new.js + report.json next to this file;
# review, then copy players.new.js over js/players.js). Input is the PRE-review sheet so re-runs don't compound.
R = os.path.dirname(os.path.abspath(__file__))

def norm(s):
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
    s = re.sub(r"[’'`.]", '', s)
    s = re.sub(r'\b(jr|sr|ii|iii|iv)\b', '', s)
    s = re.sub(r'[^a-z ]', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return {'herbert jones': 'herb jones', 'alexandre sarr': 'alex sarr', 'nicolas claxton': 'nic claxton',
            'cam johnson': 'cameron johnson', 'jimmy butler': 'jimmy butler', 'kelly oubre': 'kelly oubre'}.get(s, s)

def read_pipe(name):
    out = []
    for line in open(os.path.join(R, name), encoding='utf-8'):
        line = line.strip()
        if line and not line.startswith('#'):
            out.append(line.split('|'))
    return out

# ---------- load ----------
src = open(os.path.join(R, 'players.before.js'), encoding='utf-8').read()
sheet = [json.loads(l.strip().rstrip(',')) for l in src.splitlines() if l.strip().startswith('{"id"')]
byn = {norm(p['name']): p for p in sheet}

# % of Yahoo leagues drafting the player (only listed when < 100%). Avg $ is per draft, so scale by draft rate.
PCT = {'Dillon Brooks': 24, 'Mark Williams': 4, 'Darryn Peterson': 99, 'Jalen Suggs': 99, 'Wendell Carter Jr.': 23, 'DeMar DeRozan': 60,
  'Collin Murray-Boyles': 95, 'Zach LaVine': 99, 'Jalen Green': 98, 'Isaiah Hartenstein': 99, 'Darius Acuff Jr.': 85, 'Ty Jerome': 85,
  'Brandin Podziemski': 91, 'RJ Barrett': 82, 'Fred VanVleet': 29, 'Davion Mitchell': 85, 'Reed Sheppard': 28, 'Kristaps Porziņģis': 51,
  'John Collins': 95, 'Neemias Queta': 85, 'Ayo Dosunmu': 96, 'Khaman Maluach': 80, 'Myles Turner': 96, 'Rui Hachimura': 46,
  'Aaron Gordon': 77, 'Sandro Mamukelashvili': 26, 'Keegan Murray': 77, 'CJ McCollum': 99, 'Toumani Camara': 97, 'Andrew Nembhard': 93,
  'Jusuf Nurkić': 88, 'Collin Gillespie': 29, 'Jakob Poeltl': 52, 'Peyton Watson': 83, 'Kyshawn George': 69, 'Cason Wallace': 33,
  'Ajay Mitchell': 12, 'Kevin Porter Jr.': 27, 'Daniel Gafford': 19, 'Yaxel Lendeborg': 49, 'Quentin Grimes': 18, 'Jaime Jaquez Jr.': 81,
  'Jonathan Kuminga': 16, 'Jimmy Butler III': 37, 'Cameron Johnson': 2, 'Ace Bailey': 17, 'Saddiq Bey': 18, 'Draymond Green': 17,
  'Maxime Raynaud': 11, 'Devin Vassell': 22, 'Nikola Vučević': 10, 'Jared McCain': 5, 'Julian Champagnie': 5, 'Jeremiah Fears': 33,
  'Klay Thompson': 7, 'Aday Mara': 6}
PCT = {norm(k): v / 100 for k, v in PCT.items()}
yahoo = {norm(n): (float(a), float(pj)) for n, a, pj in read_pipe('yahoo.txt')}
yahoo_eff = {k: (a * PCT.get(k, 1.0), pj) for k, (a, pj) in yahoo.items()}
espn = {norm(n): (float(a), float(pj)) for n, a, pj in read_pipe('espn.txt')}
ypos = {norm(n): (t, pos) for n, t, pos in read_pipe('yahoo_pos.txt')}
other = open(os.path.join(R, 'other.txt'), encoding='utf-8').read()
ht_block = other.split('[hashtag14]')[1].split('# Basketball')[0]
ht = {norm(l.split('|')[0]): float(l.split('|')[1]) for l in ht_block.strip().splitlines() if '|' in l}
bbm_list = [l.strip() for l in other.split('[bbm]')[1].strip().splitlines() if l.strip()]
bbm = {norm(n): i + 1 for i, n in enumerate(bbm_list)}

TEAMS = {'ATL': 'Atlanta Hawks', 'BOS': 'Boston Celtics', 'BKN': 'Brooklyn Nets', 'CHA': 'Charlotte Hornets', 'CHI': 'Chicago Bulls',
  'CLE': 'Cleveland Cavaliers', 'DAL': 'Dallas Mavericks', 'DEN': 'Denver Nuggets', 'DET': 'Detroit Pistons', 'GSW': 'Golden State Warriors',
  'HOU': 'Houston Rockets', 'IND': 'Indiana Pacers', 'LAC': 'LA Clippers', 'LAL': 'Los Angeles Lakers', 'MEM': 'Memphis Grizzlies',
  'MIA': 'Miami Heat', 'MIL': 'Milwaukee Bucks', 'MIN': 'Minnesota Timberwolves', 'NOP': 'New Orleans Pelicans', 'NYK': 'New York Knicks',
  'OKC': 'Oklahoma City Thunder', 'ORL': 'Orlando Magic', 'PHI': 'Philadelphia 76ers', 'PHX': 'Phoenix Suns', 'POR': 'Portland Trail Blazers',
  'SAC': 'Sacramento Kings', 'SAS': 'San Antonio Spurs', 'TOR': 'Toronto Raptors', 'UTA': 'Utah Jazz', 'WAS': 'Washington Wizards'}

# ---------- players to add (in sources, missing from sheet) ----------
ADD = ['Darius Acuff Jr.', 'Mark Williams', 'Aday Mara', 'Jared McCain', 'Klay Thompson', 'Draymond Green', 'Oso Ighodaro',
       'Bennedict Mathurin', 'Dennis Schröder', 'Jaylon Tyson', 'Kyle Filipowski', 'Deandre Ayton', 'Alex Caruso', 'Anfernee Simons']
next_id = max(p['id'] for p in sheet) + 1
for name in ADD:
    k = norm(name)
    if k in byn: continue
    t, pos = ypos[k]
    p = {'id': next_id, 'rank': next_id, 'name': name, 'pos': pos.replace(',', '/'), 'team': TEAMS[t], 'tier': 10,
         'exp': 1, 'ceil': 1, 'flags': [], 'note': '', '_new': True}
    next_id += 1
    sheet.append(p); byn[k] = p

# ---------- quantile mapping onto the 14-team curve ----------
# Target: the panel sheet's own price curve (14 teams, $200), so every source is re-expressed as
# "what the player at that rank costs in a 14-team room".
curve = sorted([p['exp'] for p in sheet if not p.get('_new')], reverse=True)
def curve_at(rank):  # fractional rank, 1-based
    if rank <= 1: return curve[0]
    if rank >= len(curve): return 1.0
    i = int(rank) - 1; f = rank - int(rank)
    return curve[i] * (1 - f) + curve[i + 1] * f

def ranks(d, idx):
    """name -> average rank of its value within source d (ties share the mean rank)."""
    items = sorted(((v[idx] if isinstance(v, tuple) else v), k) for k, v in d.items())
    items.reverse()
    out, i = {}, 0
    while i < len(items):
        j = i
        while j + 1 < len(items) and items[j + 1][0] == items[i][0]: j += 1
        for m in range(i, j + 1): out[items[m][1]] = (i + j) / 2 + 1
        i = j + 1
    return out, {k: (v[idx] if isinstance(v, tuple) else v) for k, v in d.items()}

def mapped(d, idx, floor_val=None):
    rk, raw = ranks(d, idx)
    res = {}
    for k, r in rk.items():
        if floor_val is not None and raw[k] <= floor_val:
            continue  # "$0 / undrafted" carries little info on price; skip
        res[k] = curve_at(r)
    return res

yA = mapped(yahoo_eff, 0, floor_val=0.0)   # Yahoo avg $ paid
yP = mapped(yahoo, 1, floor_val=0.0)   # Yahoo projected $
eA = mapped(espn, 0, floor_val=0.05)   # ESPN avg auction $
eP = mapped(espn, 1, floor_val=0.0)    # ESPN projected $
bbV = {k: curve_at(r) for k, r in bbm.items()}

# ---------- news (Yahoo/Titus, ESPN injuries, Athlon) ----------
# (value multiplier, market multiplier, note, extra flags)
NEWS = {
 'kristaps porzingis': (0.35, 0.5, 'Out indefinitely (undisclosed health issue) per ESPN injury report.', ['injury', 'out']),
 'jimmy butler': (0.5, 0.7, 'Knee; out until ~Jan 2 per ESPN.', ['injury', 'out']),
 'mark williams': (0.6, 1.0, 'Torn labrum; out until at least February. Stash only.', ['injury', 'out']),
 'brandon ingram': (0.9, 1.0, 'Partial Achilles tear; ESPN lists Nov 1 return. Hachimura starts meanwhile.', ['injury']),
 'nic claxton': (0.85, 1.0, 'Hamstring; re-evaluated Oct 19. Jalen Smith starting.', ['injury']),
 'jalen smith': (1.4, 1.2, 'Starting C while Claxton (hamstring) is out: 13 pts/8 reb in 20 min (Yahoo).', []),
 'jusuf nurkic': (0.8, 1.0, 'Plantar plate tear; out ~a month (back ~Nov 4).', ['injury']),
 'isaiah stewart': (0.8, 1.0, 'Ankle; out at least 2 weeks.', ['injury']),
 'kon knueppel': (0.95, 1.0, 'Hamstring; out for preseason, targeted ~Oct 21.', ['injury']),
 'coby white': (0.95, 1.0, 'Calf; out for preseason, targeted ~Oct 21.', ['injury']),
 'maxime raynaud': (0.85, 1.0, 'Knee subluxation; out to ~Oct 25.', ['injury']),
 'ausar thompson': (1.15, 1.0, "Yahoo's Dan Titus: top breakout pick; ADP climbing. STL/BLK from a wing.", []),
 'brandin podziemski': (1.15, 1.0, 'Preseason usage up to 28%; Titus expects a breakout.', []),
 'fred vanvleet': (1.25, 1.0, 'Back from ACL: 17/7/2 stl with five 3s in 24 min. Titus: ADP too low.', []),
 'egor demin': (1.15, 1.0, 'Rising: 5 ast every preseason game, bulked up (Titus).', []),
 'peyton watson': (1.1, 1.0, 'Healthy; 7/4/4/2 blk debut. Value after pick 100 (Titus).', []),
 'anthony black': (1.1, 1.0, 'First guard off ORL bench, path to 25+ mpg. Titus favorite stash.', []),
 'collin murray boyles': (1.1, 1.0, 'Titus expects a big sophomore step.', []),
 'ty jerome': (1.1, 1.0, 'Positive buzz; value vs ADP (Titus).', []),
 'dylan harper': (1.1, 1.0, 'Playing 28-30 min, effectively a 6th starter (Titus).', []),
 'isaiah jackson': (1.2, 1.1, 'Started opener over Brook Lopez; late-round flier.', []),
 'brook lopez': (0.85, 1.0, 'Isaiah Jackson starting ahead of him in preseason.', []),
 'rui hachimura': (1.15, 1.0, 'Riser with Ingram out; ~20 ppg upside early.', []),
 'quentin grimes': (1.15, 1.0, 'Started all 3 preseason games for LAL.', []),
 'daniel gafford': (1.3, 1.1, 'Lively, Aldama, Morez Johnson all out — role grows by default (Titus sleeper).', []),
 'dereck lively': (0.6, 1.0, 'Foot; still shelved.', ['injury', 'out']),
 'khaman maluach': (1.15, 1.0, 'Out-minuting Ighodaro (21 vs 16 mpg); Mark Williams out to Feb.', []),
 'jeremiah fears': (1.15, 1.0, 'Starting for Dejounte Murray; 13.5 pts in 18 min, 50/50 shooting.', []),
 'dejounte murray': (0.9, 1.0, 'Toe; Fears started in his place.', ['injury']),
 'domantas sabonis': (1.05, 1.0, 'Says knee is fully recovered; Titus likes the discounted bounce-back.', []),
 'jalen johnson': (0.95, 1.0, "Titus: 9th per game without McCollum, 34th with him — 2nd-round value, not 1st.", []),
 'joel embiid': (0.95, 1.0, 'Rusty preseason (8 TO in a game); maintenance risk.', []),
 'demar derozan': (0.85, 1.0, 'Moved to 6th man.', []),
 'ja morant': (0.9, 1.0, 'Looked rusty, explosiveness not back (Titus avoiding).', []),
 'jonathan kuminga': (0.9, 1.0, 'Titus not high on him; Dosunmu may matter more.', []),
 'herb jones': (0.85, 1.0, 'Mathurin starting over him; injury-prone.', []),
 'bennedict mathurin': (1.1, 1.0, 'Starting over Herb Jones.', []),
 'aday mara': (1.1, 1.0, "Hasn't missed a shot; possible timeshare with Hartenstein.", []),
 'isaiah hartenstein': (0.9, 1.0, 'Aday Mara pushing for minutes.', []),
 'neemias queta': (0.95, 1.0, 'Competing with Mitchell Robinson; Titus expects Queta to win the job.', []),
 'kyrie irving': (1.05, 1.0, 'Healthy; debuting in Macau 19 months after ACL surgery.', []),
 'giannis antetokounmpo': (1.0, 1.0, 'Split: Titus moving him up in 9-cat; Athlon calls him the biggest overpay risk; BBM 9-cat rank #67 (FT%, TO).', []),
 'darius acuff': (1.0, 1.0, 'Rookie PG with volume; better in points leagues (Titus).', []),
 'walker kessler': (1.05, 1.0, 'Finger, not concerning (Titus). BBM 9-cat #12 last season. Athlon: pay $20-25 if he starts.', []),
}

# Players with a recent history of missing many games (per-game ranks overstate them).
AVAIL_RISK = {norm(n) for n in ['Joel Embiid', 'Kawhi Leonard', 'Zion Williamson', 'Anthony Davis', 'Kyrie Irving', 'LeBron James',
    'Paul George', 'Ja Morant', 'Jimmy Butler', 'Brandon Ingram', 'Kevin Porter Jr.', 'Tyrese Haliburton', 'Kristaps Porzingis',
    'Bradley Beal', 'Jamal Murray', 'Dejounte Murray', 'Robert Williams III', 'Mitchell Robinson']}

# ---------- compute ----------
def wavg(pairs):
    pairs = [(v, w) for v, w in pairs if v is not None]
    tw = sum(w for _, w in pairs)
    return sum(v * w for v, w in pairs) / tw if tw else None

rows = []
for p in sheet:
    k = norm(p['name'])
    old_exp, old_ceil = (None, None) if p.get('_new') else (p['exp'], p['ceil'])
    mY, mE = yA.get(k), eA.get(k)
    vY, vE, vH, vB = yP.get(k), eP.get(k), ht.get(k), bbV.get(k)
    market = wavg([(old_exp, 0.30), (mY, 0.45), (mE, 0.25)])
    # BBM is per-game production; for players who miss lots of games it overstates season value.
    bbm_w = 0.07 if k in AVAIL_RISK else 0.20
    value = wavg([(old_exp, 0.20), (vY, 0.25), (vE, 0.10), (vH, 0.25), (vB, bbm_w)])
    n_sources = sum(v is not None for v in (vY, vE, vH, vB))
    if market is None: market = old_exp or 1
    if value is None or n_sources < 2: value = market  # one source isn't enough to move a player off market
    if k in AVAIL_RISK: value = min(value, market * 1.1)  # don't pay a premium for games he may not play
    vm, mm, news, nflags = NEWS.get(k, (1, 1, '', []))
    value *= vm; market *= mm
    flags = set(p['flags'])
    sig = (value - market) / max(market, 4)
    if 'sleeper' in flags: sig += 0.06
    if 'bust' in flags: sig -= 0.06
    is_c = 'C' in p['pos'].split('/')
    riser = vm > 1.05
    long_out = k in ('jimmy butler', 'mark williams', 'kristaps porzingis', 'dereck lively')
    if long_out or n_sources < 2: call = ''  # never tag a player on one source's say-so
    elif k in AVAIL_RISK and sig > -0.15: call = ''  # injury-prone: fair at best, never a bargain/pay-up
    elif sig >= 0.15 and value - market >= 1.5: call = 'bargain'
    elif sig <= -0.15 and market - value >= 1.5: call = 'overpriced'
    elif sig >= -0.03 and (riser or 'blk' in flags or 'stl' in flags or (is_c and market >= 8)): call = 'payup'
    else: call = ''
    base = max(value, market)
    rule = {'bargain': value, 'payup': base * 1.10, 'overpriced': value, '': base * 1.05}[call]
    ceil = rule if old_ceil is None else 0.3 * old_ceil * (market / max(old_exp, 1)) + 0.7 * rule
    mk = max(1, round(market))
    ce = max(1, round(ceil))
    if call == 'overpriced': ce = min(ce, mk - 1) if mk > 1 else 1
    if call == 'bargain': ce = max(ce, mk + 1)
    if call == 'payup': ce = max(ce, mk + 2 if mk >= 5 else mk + 1)
    if call == '': ce = max(ce, mk)
    # Projection-only upside (e.g. last season's per-game rank) can't push a max far past what anyone pays.
    ce = min(ce, max(mk + 3, round(mk * 1.35)))
    if long_out: ce = mk  # stash at market, never chase
    if k in AVAIL_RISK: ce = min(ce, max(mk, round(mk * 1.1)))
    rows.append(dict(p=p, k=k, old_exp=old_exp, old_ceil=old_ceil, exp=mk, ceil=ce, value=value, call=call, news=news, nflags=nflags,
                     src={'yAvg': yahoo.get(k, (None,))[0], 'eAvg': espn.get(k, (None,))[0], 'yProj': yahoo.get(k, (None, None))[1],
                          'eProj': espn.get(k, (None, None))[1], 'ht14': vH, 'bbm': bbm.get(k)}))

# Re-rank and re-tier by new market price.
rows.sort(key=lambda r: (-r['exp'], -r['value']))
TIER_FLOORS = [(66, 1), (50, 2), (38, 3), (29, 4), (22, 5), (15, 6), (9, 7), (5, 8), (2.5, 9), (0, 10)]
for i, r in enumerate(rows):
    r['rank'] = i + 1
    r['tier'] = next(t for f, t in TIER_FLOORS if r['exp'] >= f)

# ---------- write players.js ----------
lines = []
for r in sorted(rows, key=lambda r: r['rank']):
    p = r['p']
    k = r['k']
    t, pos = ypos.get(k, (None, None))
    flags = [f for f in p['flags'] if f not in ('sleeper', 'bust')]
    for f in r['nflags']:
        if f not in flags: flags.append(f)
    if 'injury' in flags and not r['nflags'] and k in NEWS: pass
    note = p['note']
    note = re.sub(r'\s*Muse:.*$', '', note)  # drop stale panel-only comments that the new call replaces
    if r['news']: note = r['news'] if not note else r['news'] + ' (Sheet: ' + note.rstrip('.') + '.)'
    src_clean = {kk: (round(v, 1) if isinstance(v, float) else v) for kk, v in r['src'].items() if v is not None}
    d = {'id': p['id'], 'rank': r['rank'], 'name': p['name'], 'pos': pos.replace(',', '/') if pos else p['pos'],
         'team': TEAMS[t] if t else p['team'], 'tier': r['tier'], 'exp': r['exp'], 'ceil': r['ceil'], 'call': r['call'],
         'flags': flags, 'note': note, 'src': src_clean}
    r['out'] = d
    lines.append('  ' + json.dumps(d, ensure_ascii=False) + ',')
lines[-1] = lines[-1].rstrip(',')
header = open(os.path.join(R, '..', '..', 'js', 'players.js'), encoding='utf-8').read().split('var PLAYERS = [')[0]
footer = '];' + src.split('];', 1)[1]
open(os.path.join(R, 'players.new.js'), 'w', encoding='utf-8').write(header + 'var PLAYERS = [\n' + '\n'.join(lines) + '\n' + footer)

# ---------- report ----------
json.dump([{'name': r['p']['name'], 'old_exp': r['old_exp'], 'exp': r['exp'], 'old_ceil': r['old_ceil'], 'ceil': r['ceil'],
            'value': round(r['value'], 1), 'call': r['call'], 'news': r['news'], 'old_team': r['p']['team'], 'team': r['out']['team'],
            'old_pos': r['p']['pos'], 'pos': r['out']['pos'], 'src': r['src'], 'new': bool(r['p'].get('_new')), 'rank': r['rank']}
           for r in rows], open(os.path.join(R, 'report.json'), 'w'), ensure_ascii=False, indent=0)
print('players', len(rows), 'sum exp', sum(r['exp'] for r in rows), 'old sum', sum(p['exp'] for p in sheet if not p.get('_new')))
from collections import Counter
print(Counter(r['call'] for r in rows))
unmatched = [r['p']['name'] for r in rows if all(v is None for v in r['src'].values())]
print('no source data:', len(unmatched), unmatched)
print('\nTop 60 by new price:')
for r in sorted(rows, key=lambda r: r['rank'])[:60]:
    print(f"{r['rank']:>3} {r['p']['name']:<26} T{r['tier']} exp {r['old_exp']}->{r['exp']:<3} ceil {r['old_ceil']}->{r['ceil']:<3} val {r['value']:.0f} {r['call']}")
print('\nBiggest market moves:')
for r in sorted(rows, key=lambda r: -abs(r['exp'] - (r['old_exp'] or 0)))[:45]:
    s = r['src']
    print(f"{r['p']['name']:<26} exp {r['old_exp']}->{r['exp']:<3} ceil {r['old_ceil']}->{r['ceil']:<3} val {r['value']:.0f} {r['call']:<10} yAvg {s['yAvg']} eAvg {s['eAvg']} ht {s['ht14']} bbm {s['bbm']}")
