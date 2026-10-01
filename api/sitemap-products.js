// Sitemap sản phẩm sinh động từ Supabase — chỉ gồm SP đang hiển thị (is_published = true).
// Phục vụ tại /sitemap-products.xml (rewrite trong vercel.json), cache edge 1 giờ.
const SUPABASE_URL = 'https://kdqjhlpvxrpijeoibgki.supabase.co'
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWpobHB2eHJwaWplb2liZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1Mjc0NDYsImV4cCI6MjA5ODEwMzQ0Nn0.cm4yaxaZZi6zIbEij8MEZqfHj_EbVhwlOK93szN-rMQ'
const PAGE = 1000 // API trả tối đa 1000 dòng / lần

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

module.exports = async (req, res) => {
  try {
    const rows = []
    for (let start = 0; ; start += PAGE) {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=slug,updated_at&is_published=eq.true&order=created_at.desc,id`,
        { headers: { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + SUPABASE_ANON, Range: `${start}-${start + PAGE - 1}` } }
      )
      if (!r.ok) throw new Error('Supabase ' + r.status)
      const page = await r.json()
      rows.push(...page)
      if (page.length < PAGE) break
    }

    const seen = new Set()
    const urls = []
    for (const p of rows) {
      if (!p.slug || seen.has(p.slug)) continue
      seen.add(p.slug)
      urls.push(`  <url>
    <loc>https://ototiendu.com/san-pham-chi-tiet.html?slug=${esc(p.slug)}</loc>
    <lastmod>${String(p.updated_at).slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).send(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.join('\n') + '\n</urlset>\n'
    )
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(502).send('Sitemap tạm thời không khả dụng')
  }
}
