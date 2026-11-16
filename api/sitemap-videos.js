// Video sitemap (chuẩn Google) sinh động từ Supabase — chỉ gồm video đang đăng (is_published = true).
// Phục vụ tại /sitemap-videos.xml (rewrite trong vercel.json), cache edge 1 giờ.
// Video chỉ phát trên trang chủ (không có trang chi tiết) → 1 <url> là trang chủ, kèm nhiều <video:video>
// (thumbnail, title, description, content_loc / player_loc, duration).
const SITE = 'https://ototiendu.com'
const SUPABASE_URL = 'https://kdqjhlpvxrpijeoibgki.supabase.co'
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWpobHB2eHJwaWplb2liZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1Mjc0NDYsImV4cCI6MjA5ODEwMzQ0Nn0.cm4yaxaZZi6zIbEij8MEZqfHj_EbVhwlOK93szN-rMQ'
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s }

const ytId = u => { const m = /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|live\/|watch\?(?:.*&)?v=))([\w-]{11})/.exec(u || ''); return m ? m[1] : '' }
const tiktokId = u => { const m = /tiktok\.com\/.*?\/video\/(\d+)/.exec(u || ''); return m ? m[1] : '' }
function playerLoc(v) {
  if (v.source === 'youtube') { const id = ytId(v.video_url); return id ? 'https://www.youtube-nocookie.com/embed/' + id : '' }
  if (v.source === 'tiktok') { const id = tiktokId(v.video_url); return id ? 'https://www.tiktok.com/embed/v2/' + id : '' }
  if (v.source === 'facebook') return 'https://www.facebook.com/plugins/video.php?show_text=false&href=' + encodeURIComponent(v.video_url)
  return ''
}
function thumbOf(v) {
  if (v.thumbnail_url) return v.thumbnail_url
  if (v.source === 'youtube' && ytId(v.video_url)) return 'https://i.ytimg.com/vi/' + ytId(v.video_url) + '/hqdefault.jpg'
  return ''
}

module.exports = async (req, res) => {
  try {
    const r = await fetch(
      SUPABASE_URL + '/rest/v1/videos?select=slug,title,description,source,video_url,thumbnail_url,duration_seconds,published_at,updated_at&is_published=eq.true&order=sort_order.asc,published_at.desc&limit=1000',
      { headers: { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + SUPABASE_ANON } }
    )
    if (!r.ok) throw new Error('Supabase ' + r.status)
    const rows = await r.json()
    const items = rows.filter(v => v.slug && thumbOf(v) && (v.source === 'file' || playerLoc(v))).map(v => {
      const loc = v.source === 'file'
        ? '      <video:content_loc>' + esc(v.video_url) + '</video:content_loc>\n'
        : '      <video:player_loc>' + esc(playerLoc(v)) + '</video:player_loc>\n'
      return '    <video:video>\n' +
        '      <video:thumbnail_loc>' + esc(thumbOf(v)) + '</video:thumbnail_loc>\n' +
        '      <video:title>' + esc(clip(v.title, 100)) + '</video:title>\n' +
        '      <video:description>' + esc(clip(v.description || v.title, 2000)) + '</video:description>\n' +
        loc +
        (v.duration_seconds ? '      <video:duration>' + Math.round(v.duration_seconds) + '</video:duration>\n' : '') +
        (v.published_at ? '      <video:publication_date>' + new Date(v.published_at).toISOString() + '</video:publication_date>\n' : '') +
        '      <video:family_friendly>yes</video:family_friendly>\n' +
        '    </video:video>'
    })
    const urls = items.length ? ['  <url>\n    <loc>' + SITE + '/</loc>\n' + items.join('\n') + '\n  </url>'] : []
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n' + urls.join('\n') + '\n</urlset>\n')
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(502).send('Sitemap tạm thời không khả dụng')
  }
}
