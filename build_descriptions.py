# -*- coding: utf-8 -*-
"""Добавляет в подкатегории блок «Стандарты и аналоги» (DIN <-> ГОСТ) в fullDescription.
Идемпотентно: помеченный блок при повторном запуске заменяется. Контент в git."""
import json, re

CATS = json.load(open('data/categories.json', encoding='utf-8'))
TREE = json.load(open('src/data/catalog-tree.json', encoding='utf-8'))

# Справочник DIN<->ГОСТ — единый источник в din_gost.json (правь его, не код)
EQUIV = {k: tuple(v) for k, v in json.load(open('din_gost.json', encoding='utf-8')).items()}
STD_RE = re.compile(r'(DIN\s*[A-ZGГ]?\s*\d+[A-Za-z]?|ГОСТ\s*\d+(?:-\d+)?)', re.I)

def norm_std(s):
    s = re.sub(r'\s+', ' ', s.strip())
    s = re.sub(r'^din\s*', 'DIN ', s, flags=re.I)
    s = re.sub(r'^гост\s*', 'ГОСТ ', s, flags=re.I)
    base = re.sub(r'-\d+$', '', s).strip()  # ГОСТ 7798-70 -> ГОСТ 7798
    return s, base

def collect_standards(slug, cat):
    found, order = {}, []
    texts = list(cat.get('standards') or [])
    node = TREE.get(slug, {})
    for t in node.get('types', []):
        texts.append(t['name'])
    texts.append(cat.get('title', ''))
    for tx in texts:
        for m in STD_RE.findall(tx):
            disp, base = norm_std(m)
            if base not in found:
                found[base] = disp
                order.append(base)
    return [(found[b], b) for b in order]

MARK_OPEN, MARK_CLOSE = '<!--std-block-->', '<!--/std-block-->'

def size_count(slug):
    node = TREE.get(slug, {})
    if node.get('sizes'):
        return len(node['sizes'])
    if node.get('types'):
        return sum(len(t.get('sizes', [])) for t in node['types'])
    return 0

def build_generic(c, slug, skip_desc=False):
    """Описание для подкатегорий без DIN/ГОСТ-стандартов.
    skip_desc=True — если выше уже есть содержательный текст, не дублируем desc."""
    desc = re.sub(r'\s+', ' ', (c.get('desc') or '').strip())
    n = size_count(slug)
    parts = []
    if desc and not skip_desc:
        parts.append('<p>%s</p>' % desc)
    if n:
        parts.append('<p>В наличии %d типоразмеров со склада в Алматы.</p>' % n)
    parts.append('<p>Оптом и в розницу, доставка по Казахстану. '
                 'Не нашли нужную позицию — пришлите спецификацию, подберём.</p>')
    return MARK_OPEN + ''.join(parts) + MARK_CLOSE

def build_block(stds):
    if not stds:
        return ''
    items = []
    for disp, base in stds:
        info = EQUIV.get(base)
        if info:
            what, equiv = info
            line = f'<li><strong>{disp}</strong> — {what}'
            if equiv:
                line += f'; аналог <strong>{equiv}</strong>'
            line += '</li>'
        else:
            line = f'<li><strong>{disp}</strong></li>'
        items.append(line)
    return (MARK_OPEN +
            '<h3>Стандарты и аналоги</h3><ul>' + ''.join(items) + '</ul>'
            '<p>Подберём аналог DIN ↔ ГОСТ без потери характеристик — пришлите спецификацию.</p>' +
            MARK_CLOSE)

changed = 0
for c in CATS:
    fd = c.get('fullDescription') or ''
    fd = re.sub(re.escape(MARK_OPEN) + r'.*?' + re.escape(MARK_CLOSE), '', fd, flags=re.S).strip()
    # старую прозу без тегов переводим в <br>, чтобы перенос строк не потерялся
    if fd and not re.search(r'<[a-z]', fd, re.I):
        fd = fd.replace('\n', '<br>')
    plain_len = len(re.sub(r'<[^>]+>', '', fd))  # длина уже имеющегося текста
    stds = collect_standards(c['slug'], c)
    block = build_block(stds) if stds else build_generic(c, c['slug'], skip_desc=(plain_len > 120))
    c['fullDescription'] = (fd + block).strip()
    changed += 1

json.dump(CATS, open('data/categories.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('updated subcats:', changed, '/', len(CATS))
# sample
s = [c for c in CATS if c['slug'] == 'krepezh-bolty'][0]
open(r'C:/Users/sales/AppData/Local/Temp/ads_report/desc_sample.txt', 'w', encoding='utf-8').write(s['fullDescription'][-900:])
