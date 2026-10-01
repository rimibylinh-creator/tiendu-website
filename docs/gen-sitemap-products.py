# Tạo lại sitemap-products.xml từ Supabase — chỉ gồm sản phẩm đang hiển thị (is_published = true).
# Chạy từ thư mục gốc repo:  python3 docs/gen-sitemap-products.py
# Nên chạy lại sau mỗi đợt thêm / xoá / ẩn sản phẩm số lượng lớn trong admin.
import json, re, urllib.request
from xml.sax.saxutils import escape

KEY = re.search(r"SUPABASE_ANON = '([^']+)", open('js/supabase-client.js', encoding='utf-8').read()).group(1)
API = 'https://kdqjhlpvxrpijeoibgki.supabase.co/rest/v1/products'

rows, start = [], 0
while True:  # API trả tối đa 1000 dòng / lần → đọc theo trang
    req = urllib.request.Request(
        f'{API}?select=slug,updated_at&is_published=eq.true&order=created_at.desc,id',
        headers={'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Range': f'{start}-{start + 999}'})
    page = json.load(urllib.request.urlopen(req))
    rows += page
    start += 1000
    if len(page) < 1000:
        break

seen, urls = set(), []
for r in rows:
    if r['slug'] in seen:
        continue
    seen.add(r['slug'])
    urls.append(f'''  <url>
    <loc>https://ototiendu.com/san-pham-chi-tiet.html?slug={escape(r['slug'])}</loc>
    <lastmod>{r['updated_at'][:10]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>''')

with open('sitemap-products.xml', 'w', encoding='utf-8') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    f.write('\n'.join(urls))
    f.write('\n</urlset>\n')
print(f'sitemap-products.xml: {len(urls)} URL')
