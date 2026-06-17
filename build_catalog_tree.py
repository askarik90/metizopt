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
          'perfo': 'perfo', 'takelazh': 'takelazh', 'kanaty': 'kanaty', 'elektrody': 'elektrody',
          'shlangi': 'shlangi'}

# ручные оверрайды там, где автоматч промахнулся (site-слаг -> точное имя типа в catalog-db)
OVERRIDE = {
    'nerzhav-vintyi': 'Винт с потайной головкой и внутренним шестигранником  DIN 7991 нерж',
    'ventil-shpilka': 'шпилька сантехничекая',
    'ventil-traversa': 'Траверса',
    'svarka-rossiya': 'Россия',
    'svarka-monolith': 'Монолит (Украина)',
    'svarka-prinadlezhnosti': 'Для Сварки',
    'shlangi-armirovannyi': 'Армированный',
    'shlangi-mbs': 'МБС',
    'shlangi-polivochnyi': 'поливка',
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
    # 1) многомерный размер: М6×20, 6×8×60, 06Х022 (разделители * × x х Х)
    c = re.findall(r'(?:[МM]\s*)?\d+(?:[.,]\d+)?(?:\s*[*×xхХ]\s*\d+(?:[.,]\d+)?)+', n)
    if c:
        best = max(c, key=lambda x: (len(re.findall(r'[*×xхХ]', x)), len(x)))
        best = re.sub(r'\s+', '', best)
        best = re.sub(r'[*xхХ]', '×', best).replace('M', 'М')
        if best[:1] in 'мМ':
            best = 'М' + best[1:]
        return best
    # 2) метрическая резьба: М16, M8 (М вплотную к числу)
    m = re.search(r'[МM]\s*(\d+(?:[.,]\d+)?)(?![\w])', n)
    if m:
        return 'М' + m.group(1)
    # 3) диаметр: d3.0мм, Ø8, 7мм, «Д 3 ММ» (регистронезависимо)
    m = re.search(r'(?:[dDØдД]\s*\.?\s*)?(\d+(?:[.,]\d+)?)\s*мм', n, re.I)
    if not m:
        m = re.search(r'[dDØдД]\s*\.?\s*(\d+(?:[.,]\d+)?)', n, re.I)
    if m:
        return m.group(1).replace('.', ',') + ' мм'
    # 4) диаметр каната по ГОСТ: «Канат 5,6 ГОСТ …»
    m = re.search(r'[Кк]анат\s+(\d+(?:[.,]\d+)?)\s+ГОСТ', n)
    if m:
        return m.group(1).replace('.', ',') + ' мм'
    # 5) грузоподъёмность крюков: «0,5 т», «5,0 т.»
    m = re.search(r'(\d+(?:[.,]\d+)?)\s*т\.?(?=\s|$)', n)
    if m:
        return m.group(1).replace('.', ',') + ' т'
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
APPLICATIONS = json.load(open('applications.json', encoding='utf-8'))
DESC_STD_RE = re.compile(r'(DIN\s*[A-ZGГ]?\s*\d+[A-Za-z]?|ГОСТ\s*\d+(?:-\d+)?)', re.I)
def _norm_std(s):
    s = re.sub(r'\s+', ' ', s.strip())
    s = re.sub(r'^din\s*', 'DIN ', s, flags=re.I)
    s = re.sub(r'^гост\s*', 'ГОСТ ', s, flags=re.I)
    return s, re.sub(r'-\d+$', '', s).strip()
def _fmt(x):
    return str(int(x)) if float(x).is_integer() else ('%g' % x).replace('.', ',')

M2_RE = re.compile(r'^(М?)\s*(\d+(?:[.,]\d+)?)\s*×\s*(\d+(?:[.,]\d+)?)$')
def size_summary(sizes):
    """Диапазон размеров «от и до» вместо перечисления.
    Двухмерный крепёж М×L -> «диаметры X–Y, длины A–B мм»; иначе «размеры от … до …»."""
    labels = [s['label'] for s in sizes]
    if not labels:
        return ''
    if len(labels) == 1:
        return 'В наличии размер ' + labels[0]
    m2 = [M2_RE.match(l) for l in labels]
    if all(m2):
        pref = 'М' if any(m.group(1) for m in m2) else ''
        ds = sorted(float(m.group(2).replace(',', '.')) for m in m2)
        ls = sorted(float(m.group(3).replace(',', '.')) for m in m2)
        if ds[0] == ds[-1]:
            return 'В наличии диаметр %s%s, длины %s–%s мм' % (pref, _fmt(ds[0]), _fmt(ls[0]), _fmt(ls[-1]))
        return 'В наличии диаметры %s%s–%s%s, длины %s–%s мм' % (
            pref, _fmt(ds[0]), pref, _fmt(ds[-1]), _fmt(ls[0]), _fmt(ls[-1]))
    return 'В наличии размеры от %s до %s' % (labels[0], labels[-1])

def type_description(name, sizes, app=''):
    segs = []
    for m in DESC_STD_RE.findall(name):
        disp, base = _norm_std(m)
        eq = (EQUIV.get(base) or ('', ''))[1]
        segs.append(disp + (' (аналог %s)' % eq if eq else ''))
    std = (' Стандарт: ' + '; '.join(segs) + '.') if segs else ''
    parts = ['<p>%s — крепёж со склада в Алматы.%s</p>' % (name, std)]
    if app:
        parts.append('<p><strong>Применение:</strong> %s</p>' % app)
    if sizes:
        parts.append('<p>%s. Отметьте нужные выше или пришлите спецификацию.</p>' % size_summary(sizes))
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
                      'sizes': szs,
                      'summary': size_summary(szs),
                      'description': type_description(name, szs, APPLICATIONS.get(key, ''))})
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
