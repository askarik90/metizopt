# -*- coding: utf-8 -*-
"""src/data/catalog-tree.json: site-подкатегория -> типы/размеры. Источник: catalog-db.json (1С).
- krepezh-*  (широкие): { types: [ {slug,name,sizes} ] } -> страницы типов
- остальные (= один тип): { sizes: [ {label,code} ] }    -> выбор размера на самой подкатегории
"""
import json, re

DB = json.load(open('src/data/catalog-db.json', encoding='utf-8'))
CATS = {c['slug']: c for c in json.load(open('data/categories.json', encoding='utf-8'))}
GROUPS = {g['slug']: g for g in json.load(open('data/groups.json', encoding='utf-8'))}

# krepezh: site-слаг -> широкий ключ catalog-db
KREPEZH = {
    'krepezh-bolty': 'bolty', 'krepezh-gayki': 'gayki', 'krepezh-shayby': 'shayby',
    'krepezh-vintyi': 'vinty', 'krepezh-ankera': 'ankera', 'krepezh-shplinty': 'shplinty',
    'krepezh-dyubela': 'dyubelya', 'krepezh-samorezi': 'shurupy', 'krepezh-shpilki': 'shpilki',
    'krepezh-zaklepki': 'zaklepki', 'krepezh-gvozdi': 'gvozdi',
}
# группы, где подкатегории сайта = отдельные типы в этом ключе catalog-db
SINGLE = {'nerzhaveyushchiy': 'nerzhaveyushchiy', 'ventilatsiya': 'ventilatsiya',
          'perfo': 'perfo', 'takelazh': 'takelazh', 'kanaty': 'kanaty', 'elektrody': 'elektrody'}

# ручные оверрайды там, где автоматч промахнулся (site-слаг -> точное имя типа в catalog-db)
OVERRIDE = {
    'nerzhav-vintyi': 'Винт с потайной головкой и внутренним шестигранником  DIN 7991 нерж',
    'ventil-shpilka': 'шпилька сантехничекая',
    'ventil-traversa': 'Траверса',
    'svarka-rossiya': 'Россия',
    # svarka-crown — в данных нет, остаётся без размеров (только форма заявки)
}
def norm_ws(s):
    return re.sub(r'\s+', ' ', s).strip()

TR = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'j',
      'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f',
      'х':'h','ц':'c','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'}
def slugify(s):
    out = ''.join(TR.get(ch, ch) for ch in s.lower())
    return re.sub(r'-{2,}', '-', re.sub(r'[^a-z0-9]+', '-', out).strip('-'))

SIZE_RE = re.compile(r'(?:[МM]\s*)?\d+(?:[.,]\d+)?(?:\s*[*×xх]\s*\d+(?:[.,]\d+)?)+', re.I)
PACK_RE = re.compile(r'\([^)]*\)')
def extract_size(name):
    n = PACK_RE.sub(' ', name)
    c = SIZE_RE.findall(n)
    if c:
        best = max(c, key=lambda x: (re.subn(r'[*×xх]', '', x)[1], len(x)))
        best = re.sub(r'\s*', '', best).replace('*', '×').replace('x', '×').replace('х', '×').replace('M', 'М')
        if best[:1] in 'мМ':
            best = 'М' + best[1:]
        return best
    # одиночный метрический размер (гайки/шайбы/шпильки): М16, M8 — без второго измерения
    m = re.search(r'[МM]\s*\d+(?:[.,]\d+)?', n)
    if m:
        return 'М' + re.sub(r'\s+', '', m.group())[1:]
    return None

def sizes_of(type_node):
    out, seen = [], set()
    for it in type_node.get('items', []):
        sz = extract_size(it['name'])
        label = sz if sz else PACK_RE.sub('', it['name']).strip()
        if label and label not in seen:
            seen.add(label); out.append({'label': label, 'code': it['code']})
    out.sort(key=lambda s: [int(x) for x in re.findall(r'\d+', s['label'])] or [0])
    return out

def toks(s):
    return set(re.findall(r'[a-zа-я0-9]+', s.lower().replace('ё', 'е')))
def best_match(title, types):
    tt = toks(title); best, score = None, 0.0
    for ty in types:
        ts = toks(ty['type'])
        j = len(tt & ts) / max(1, len(tt | ts))
        if j > score:
            score, best = j, ty
    return best, score

# --- описание для страницы типа (DIN/ГОСТ из din_gost.json) ---
EQUIV = {k: tuple(v) for k, v in json.load(open('din_gost.json', encoding='utf-8')).items()}
DESC_STD_RE = re.compile(r'(DIN\s*[A-ZGГ]?\s*\d+[A-Za-z]?|ГОСТ\s*\d+(?:-\d+)?)', re.I)
def _norm_std(s):
    s = re.sub(r'\s+', ' ', s.strip())
    s = re.sub(r'^din\s*', 'DIN ', s, flags=re.I)
    s = re.sub(r'^гост\s*', 'ГОСТ ', s, flags=re.I)
    return s, re.sub(r'-\d+$', '', s).strip()
def type_description(name, sizes):
    segs = []
    for m in DESC_STD_RE.findall(name):
        disp, base = _norm_std(m)
        eq = (EQUIV.get(base) or ('', ''))[1]
        segs.append(disp + (' (аналог %s)' % eq if eq else ''))
    std = (' Стандарт: ' + '; '.join(segs) + '.') if segs else ''
    parts = ['<p>%s — крепёж со склада в Алматы.%s</p>' % (name, std)]
    if sizes:
        head = ', '.join(s['label'] for s in sizes[:8])
        parts.append('<p>Доступно %d размеров: %s%s. Отметьте нужные выше — пришлём наличие и цену.</p>'
                     % (len(sizes), head, '…' if len(sizes) > 8 else ''))
    parts.append('<p>Оптом и в розницу, доставка по Казахстану. Не нашли размер — пришлите спецификацию, подберём.</p>')
    return ''.join(parts)

tree, report = {}, []

# --- Фаза 1: krepezh (мульти-тип) ---
for slug, key in KREPEZH.items():
    types = []
    for t in DB.get(key, []):
        name = t['type'].strip()
        szs = sizes_of(t)
        types.append({'slug': slugify(name), 'name': name,
                      'count': t.get('count', len(t.get('items', []))),
                      'sizes': szs, 'description': type_description(name, szs)})
    tree[slug] = {'types': types}

# --- Фаза 2: одиночные типы (по матчингу title -> тип) ---
for gslug, key in SINGLE.items():
    types = DB.get(key, [])
    for sub in GROUPS.get(gslug, {}).get('categories', []):
        title = (CATS.get(sub) or {}).get('title', sub)
        if sub in OVERRIDE:
            m = next((t for t in types if norm_ws(t['type']) == norm_ws(OVERRIDE[sub])), None)
            if m:
                tree[sub] = {'sizes': sizes_of(m)}
                report.append('OVR  %-32s -> %s' % (sub, m['type']))
                continue
        m, sc = best_match(title, types)
        if m and sc >= 0.34:
            tree[sub] = {'sizes': sizes_of(m)}
            report.append('OK   %-32s sc=%.2f -> %s' % (sub, sc, m['type']))
        else:
            report.append('MISS %-32s sc=%.2f title=%r' % (sub, sc, title))

json.dump(tree, open('src/data/catalog-tree.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
miss = sum(1 for r in report if r.startswith('MISS'))
report.insert(0, 'subcats в дереве=%d | одиночных OK=%d | MISS=%d' % (len(tree), len(report) - miss, miss))
open(r'C:/Users/sales/AppData/Local/Temp/ads_report/tree2_report.txt', 'w', encoding='utf-8').write('\n'.join(report))
print('WROTE catalog-tree.json: %d subcats, MISS=%d' % (len(tree), miss))
