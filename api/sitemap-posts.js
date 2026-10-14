// Sitemap bài viết sinh động từ Supabase — chỉ gồm bài đang đăng (is_published = true).
// Phục vụ tại /sitemap-posts.xml (rewrite trong vercel.json), cache edge 1 giờ.
const SUPABASE_URL = 'https://kdqjhlpvxrpijeoibgki.supabase.co'
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWpobHB2eHJwaWplb2liZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1Mjc0NDYsImV4cCI6MjA5ODEwMzQ0Nn0.cm4yaxaZZi6zIbEij8MEZqfHj_EbVhwlOK93szN-rMQ'
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

module.exports = async (req, res) => {
  try {
    const r = await fetch(
      SUPABASE_URL + '/rest/v1/posts?select=slug,updated_at,published_at&is_published=eq.true&order=published_at.desc&limit=1000',
      { headers: { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + SUPABASE_ANON } }
    )
    if (!r.ok) throw new Error('Supabase ' + r.status)
    const rows = await r.json()
    const urls = rows.filter(p => p.slug).map(p => {
      const d = String(p.updated_at || p.published_at || '').slice(0, 10)
      return '  <url>\n    <loc>https://ototiendu.com/tin-tuc-chi-tiet.html?slug=' + esc(encodeURIComponent(p.slug)) + '</loc>\n' +
        (d ? '    <lastmod>' + d + '</lastmod>\n' : '') +
        '    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>'
    })
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n')
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(502).send('Sitemap tạm thời không khả dụng')
  }
}
