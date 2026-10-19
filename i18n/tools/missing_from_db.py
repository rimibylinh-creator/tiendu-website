#!/usr/bin/env python3
"""Liệt kê các câu tiếng Việt từ database (sản phẩm, bài viết, tin tuyển dụng) CHƯA có bản dịch.

Dùng:  python3 i18n/tools/missing_from_db.py [mã ngôn ngữ, mặc định en] [--json file.json]
Kết quả là danh sách câu cần thêm vào i18n/<ngôn ngữ>/products.json, posts.json hoặc jobs.json.
Chạy từ thư mục gốc của repo.
"""
import json, re, sys, glob, urllib.request

lang = next((a for a in sys.argv[1:] if not a.startswith('--')), 'en')
out_json = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else None

src = open('js/supabase-client.js', encoding='utf-8').read()
KEY = re.search(r"SUPABASE_ANON\s*=\s*'([^']+)'", src).group(1)
URL = re.search(r"SUPABASE_URL\s*=\s*'([^']+)'", src).group(1) + '/rest/v1/'

def get(q):
    r = urllib.request.Request(URL + q, headers={'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Range': '0-999'})
    return json.load(urllib.request.urlopen(r))

norm = lambda s: re.sub(r'\s+', ' ', str(s)).strip()
have = set()
for f in glob.glob(f'i18n/{lang}/*.json'):
    have |= {norm(k) for k in json.load(open(f, encoding='utf-8'))}

miss = []
def add(s):
    s = norm(s)
    if s and s not in have and s not in miss:
        miss.append(s)

for p in get('products?select=name,short_specs,categories(name)&is_published=eq.true&order=created_at.desc'):
    add(p['name']); [add(s) for s in (p['short_specs'] or [])]
    if p.get('categories'): add(p['categories']['name'])
for p in get('posts?select=title,excerpt,post_categories(name)&is_published=eq.true'):
    add(p['title']); add(p['excerpt'] or '')
    if p.get('post_categories'): add(p['post_categories']['name'])
for j in get('job_postings?select=*'):
    for k in ('title', 'department', 'location', 'salary_range'): add(j.get(k) or '')
    for k in ('description', 'requirements', 'benefits'):
        for line in (j.get(k) or '').split('\n'):
            add(re.sub(r'^[•\-]\s*', '', line.strip()))

print(f'{len(miss)} câu chưa có trong i18n/{lang}/')
for i, s in enumerate(miss): print(i, '|', s)
if out_json: json.dump(miss, open(out_json, 'w', encoding='utf-8'), ensure_ascii=False)
