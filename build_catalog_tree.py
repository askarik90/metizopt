# -*- coding: utf-8 -*-
"""Собирает src/data/catalog-tree.json: site-подкатегория -> типы -> размеры.
Источник: src/data/catalog-db.json (экспорт из 1С). Пока scope = krepezh."""
import json, re

DB = json.load(open('src/data/catalog-db.json', encoding='utf-8'))

# site-слаг подкатегории -> ключ в catalog-db (krepezh: широкие категории с типами внутри)
MAP = {
    'krepezh-bolty': 'bolty', 'krepezh-gayki': 'gayki', 'krepezh-shayby': 'shayby',
    'krepezh-vintyi': 'vinty', 'krepezh-ankera': 'ankera', 'krepezh-shplinty': 'shplinty',
    'krepezh-dyubela': 'dyubelya', 'krepezh-samorezi': 'shurupy', 'krepezh-shpilki': 'shpilki',
    'krepezh-zaklepki': 'zaklepki', 'krepezh-gvozdi': 'gvozdi',
}

TR = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i',
      'й':'j','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
      'у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'',
      'э':'e','ю':'yu','я':'ya'}
def slugify(s):
    s = s.lower()
    out = ''.join(TR.get(ch, ch) for ch in s)
    out = re.sub(r'[^a-z0-9]+', '-', out).strip('-')
    return re.sub(r'-{2,}', '-', out)

# размер: М?10*30, 6*8*60, 8*40, 10×100 (один и более «*/×/x/х» разделителей)
SIZE_RE = re.compile(r'(?:[МM]\s*)?\d+(?:[.,]\d+)?(?:\s*[*×xх]\s*\d+(?:[.,]\d+)?)+', re.IGNORECASE)
PACK_RE = re.compile(r'\([^)]*\)')

def extract_size(name):
    n = PACK_RE.sub(' ', name)
    cands = SIZE_RE.findall(n)
    if not cands:
        return None
    best = max(cands, key=lambda x: (x.count('*') + x.count('×') + x.count('x') + x.count('х'), len(x)))
    best = re.sub(r'\s*', '', best).replace('*', '×').replace('x', '×').replace('х', '×')
    best = best.replace('M', 'М')  # латинская M -> кириллическая М (метрика)
    if best[:1] in 'мМ':           # нормализуем регистр ведущей М
        best = 'М' + best[1:]
    return best

def natkey(label):
    nums = re.findall(r'\d+', label)
    return [int(x) for x in nums] or [0]

tree = {}
for slug, key in MAP.items():
    types = []
    for t in DB.get(key, []):
        tname = t['type'].strip()
        sizes, seen = [], set()
        for it in t.get('items', []):
            sz = extract_size(it['name'])
            label = sz if sz else PACK_RE.sub('', it['name']).strip()
            if label and label not in seen:
                seen.add(label)
                sizes.append({'label': label, 'code': it['code']})
        sizes.sort(key=lambda s: natkey(s['label']))
        types.append({'slug': slugify(tname), 'name': tname,
                      'count': t.get('count', len(t.get('items', []))), 'sizes': sizes})
    tree[slug] = {'types': types}

json.dump(tree, open('src/data/catalog-tree.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=2)

# отчёт
rep = []
for slug, v in tree.items():
    rep.append('%-18s типов=%-3d размеров=%d' % (slug, len(v['types']), sum(len(t['sizes']) for t in v['types'])))
rep.append('')
ank = tree['krepezh-ankera']['types']
rep.append('Пример krepezh-ankera:')
for t in ank[:4]:
    rep.append('  %s [%s]: %s' % (t['name'], t['slug'], ', '.join(s['label'] for s in t['sizes'][:8])))
open(r'C:/Users/sales/AppData/Local/Temp/ads_report/tree_report.txt', 'w', encoding='utf-8').write('\n'.join(rep))
print('WROTE catalog-tree.json,', len(tree), 'subcats')
