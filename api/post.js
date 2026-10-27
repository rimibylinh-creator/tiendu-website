// Trang chi tiết bài viết render phía máy chủ — phục vụ tại /tin-tuc-chi-tiet.html?slug=…
// (rewrite trong vercel.json). Điền sẵn title / description / canonical / Open Graph /
// JSON-LD Article vào HTML gốc để Google không gộp các bài thành trang trùng lặp,
// và trả mã 404 thật khi bài không tồn tại hoặc chưa đăng. Phần nội dung hiển thị do trang mẫu dựng ở trình duyệt.
const fs = require('fs')
const path = require('path')

const SITE = 'https://ototiendu.com'
const SUPABASE_URL = 'https://kdqjhlpvxrpijeoibgki.supabase.co'
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWpobHB2eHJwaWplb2liZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1Mjc0NDYsImV4cCI6MjA5ODEwMzQ0Nn0.cm4yaxaZZi6zIbEij8MEZqfHj_EbVhwlOK93szN-rMQ'
const TEMPLATE = fs.readFileSync(path.join(__dirname, '_tpl', 'post-detail.html'), 'utf8')

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const jsonForScript = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
const stripTags = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
// Rút gọn cho thẻ title/description (Google chỉ hiển thị ~60 / ~155 ký tự)
const clip = (s, max) => {
  s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  const i = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf('/'))
  return (i > max * 0.6 ? cut.slice(0, i) : cut).replace(/[\s,;:\/\-–—(]+$/, '') + '…'
}

// FAQ trong bài: h2 "Câu hỏi thường gặp" + các h3 (câu hỏi) kèm đoạn trả lời → FAQPage JSON-LD
const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
function faqSchema(content) {
  const m = /<h2[^>]*>[^<]*(?:câu hỏi thường gặp|faq)[^<]*<\/h2>([\s\S]*?)(?=<h2[\s>]|$)/i.exec(content || '')
  if (!m) return null
  const items = m[1].split(/<h3[^>]*>/i).slice(1).map(seg => {
    const [q, ...rest] = seg.split(/<\/h3>/i)
    return {
      q: decode(stripTags(q)).replace(/^\s*(?:\d+[.)]|Q:?)\s*/i, ''),
      a: decode(stripTags(rest.join(' ')))
    }
  }).filter(x => x.q && x.a)
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } }))
  }
}

function render(p, slug) {
  const url = SITE + '/tin-tuc-chi-tiet.html?slug=' + encodeURIComponent(slug)
  const title = clip(p.title, 60) + ' — Tiên Du Nha Trang'
  const desc = clip(stripTags(p.excerpt) || p.title, 155)
  const img = p.cover_image_url || SITE + '/assets/hero-bg.jpg'

  let html = TEMPLATE
  const setContent = (id, v) => {
    html = html.replace(new RegExp('(<meta id="' + id + '"[^>]*?content=")[^"]*(")'), (_, a, b) => a + esc(v) + b)
  }
  html = html.replace(/<title id="pageTitle">[^<]*<\/title>/, () => '<title id="pageTitle">' + esc(title) + '</title>')
  setContent('metaDesc', desc)
  setContent('ogUrl', url)
  setContent('ogTitle', title)
  setContent('ogDesc', desc)
  setContent('ogImage', img)
  setContent('twTitle', title)
  setContent('twDesc', desc)
  setContent('twImage', img)
  html = html.replace(/(<link id="canonical" rel="canonical" href=")[^"]*(")/, (_, a, b) => a + esc(url) + b)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: desc,
    image: img,
    datePublished: p.published_at,
    dateModified: p.updated_at || p.published_at,
    author: { '@type': 'Organization', name: 'Tiên Du Phụ Tùng Ô Tô' },
    publisher: {
      '@type': 'Organization',
      name: 'Tiên Du Phụ Tùng Ô Tô',
      logo: { '@type': 'ImageObject', url: SITE + '/assets/nav-logo.png' }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  }
  html = html.replace(/<script id="articleSchema" type="application\/ld\+json">\{\}<\/script>/, () =>
    '<script id="articleSchema" type="application/ld+json">' + jsonForScript(schema) + '</script>')
  const faq = faqSchema(p.content)
  if (faq) html = html.replace('</head>', () => '<script type="application/ld+json">' + jsonForScript(faq) + '</script>\n</head>')

  // Nội dung tối thiểu cho người/bot không chạy JS
  html = html.replace('<body>', () => '<body>\n<noscript><h1>' + esc(p.title) + '</h1><p>' + esc(desc) + '</p></noscript>')
  return html
}

async function fetchPost(slug) {
  const q = '/rest/v1/posts?select=*,post_categories(name,slug)&is_published=eq.true&limit=1&slug=eq.' + encodeURIComponent(slug)
  const r = await fetch(SUPABASE_URL + q, { headers: { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + SUPABASE_ANON } })
  if (!r.ok) throw new Error('Supabase ' + r.status)
  const rows = await r.json()
  return rows[0] || null
}

async function notFound(res) {
  let body = '<!doctype html><meta charset="utf-8"><title>404 — Không tìm thấy trang</title><p>Không tìm thấy trang.</p>'
  try {
    const r = await fetch(SITE + '/404')
    if (r.status === 404) body = await r.text()
  } catch (e) {}
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  res.status(404).send(body)
}

module.exports = async (req, res) => {
  const slug = String(req.query.slug || '').trim()
  if (!slug) { res.setHeader('Location', '/tin-tuc.html'); return res.status(302).end() }
  try {
    const post = await fetchPost(slug)
    if (!post) return notFound(res)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(200).send(render(post, slug))
  } catch (e) {
    // Lỗi tạm thời: phục vụ trang mẫu (trình duyệt tự tải dữ liệu) và không cache
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(TEMPLATE)
  }
}
