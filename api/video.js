// Trang video riêng render phía máy chủ — phục vụ tại /tin-van/:slug (rewrite trong vercel.json).
// Điền sẵn title / description / canonical / Open Graph (og:video) / JSON-LD VideoObject + BreadcrumbList
// và đặt sẵn thẻ <video>/<iframe> trong HTML gốc để Google lập chỉ mục video (Video tab, carousel
// video ngắn, Key moments) và để AI search (AI Overviews, ChatGPT, Perplexity...) đọc được mô tả + transcript.
// Trả 404 thật khi video không tồn tại hoặc chưa đăng.
const fs = require('fs')
const path = require('path')

const SITE = 'https://ototiendu.com'
const SUPABASE_URL = 'https://kdqjhlpvxrpijeoibgki.supabase.co'
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWpobHB2eHJwaWplb2liZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1Mjc0NDYsImV4cCI6MjA5ODEwMzQ0Nn0.cm4yaxaZZi6zIbEij8MEZqfHj_EbVhwlOK93szN-rMQ'
const TEMPLATE = fs.readFileSync(path.join(__dirname, '_tpl', 'video-detail.html'), 'utf8')
const COLS = 'id,slug,title,description,transcript,source,video_url,thumbnail_url,duration_seconds,published_at,updated_at'

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const jsonForScript = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
const clip = (s, max) => {
  s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  const i = cut.lastIndexOf(' ')
  return (i > max * 0.6 ? cut.slice(0, i) : cut).replace(/[\s,;:\/\-–—(]+$/, '') + '…'
}

// ── Nguồn video ──────────────────────────────────────────────
const ytId = u => { const m = /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|live\/|watch\?(?:.*&)?v=))([\w-]{11})/.exec(u || ''); return m ? m[1] : '' }
const tiktokId = u => { const m = /tiktok\.com\/.*?\/video\/(\d+)/.exec(u || ''); return m ? m[1] : '' }
function embedUrl(v) {
  if (v.source === 'youtube') { const id = ytId(v.video_url); return id ? 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&playsinline=1&modestbranding=1' : '' }
  if (v.source === 'tiktok') { const id = tiktokId(v.video_url); return id ? 'https://www.tiktok.com/embed/v2/' + id : '' }
  if (v.source === 'facebook') return 'https://www.facebook.com/plugins/video.php?show_text=false&width=380&href=' + encodeURIComponent(v.video_url)
  return ''
}
function thumbOf(v) {
  if (v.thumbnail_url) return v.thumbnail_url
  if (v.source === 'youtube' && ytId(v.video_url)) return 'https://i.ytimg.com/vi/' + ytId(v.video_url) + '/hqdefault.jpg'
  return ''
}
function isoDur(s) {
  s = Math.round(+s || 0); if (!s) return ''
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60
  return 'PT' + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (x || (!h && !m) ? x + 'S' : '')
}
const fmtDur = s => { s = Math.round(+s || 0); return s ? Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2) : '' }
const fmtDate = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() }
const pageUrl = v => '/tin-van/' + encodeURIComponent(v.slug)

function playerHtml(v) {
  const poster = thumbOf(v)
  if (v.source === 'file') {
    return '<video controls playsinline preload="metadata"' + (poster ? ' poster="' + esc(poster) + '"' : '') +
      ' src="' + esc(v.video_url) + '" title="' + esc(v.title) + '"></video>'
  }
  const src = embedUrl(v)
  return src
    ? '<iframe src="' + esc(src) + '" title="' + esc(v.title) + '" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen frameborder="0"></iframe>'
    : '<p style="color:#fff;padding:24px">Không phát được video này.</p>'
}

function videoObject(v, desc) {
  const thumb = thumbOf(v)
  const o = {
    '@type': 'VideoObject',
    '@id': SITE + pageUrl(v) + '#video',
    name: v.title,
    description: desc,
    thumbnailUrl: thumb ? [thumb] : [SITE + '/assets/gioi-thieu.jpg'],
    uploadDate: v.published_at,
    url: SITE + pageUrl(v),
    inLanguage: 'vi',
    isFamilyFriendly: true,
    publisher: { '@type': 'Organization', name: 'Tiên Du Phụ Tùng Ô Tô', url: SITE, logo: { '@type': 'ImageObject', url: SITE + '/assets/nav-logo.png' } }
  }
  const dur = isoDur(v.duration_seconds)
  if (dur) o.duration = dur
  if (v.transcript) o.transcript = v.transcript
  if (v.source === 'file') o.contentUrl = v.video_url
  else if (embedUrl(v)) o.embedUrl = embedUrl(v)
  return o
}

function relatedHtml(list) {
  if (!list.length) return ''
  const cards = list.map(v => {
    const t = thumbOf(v)
    const d = fmtDur(v.duration_seconds)
    return '<a class="vn-card" role="listitem" href="' + pageUrl(v) + '" aria-label="Xem video: ' + esc(v.title) + '">' +
      (t ? '<img src="' + esc(t) + '" alt="' + esc(v.title) + '" loading="lazy" decoding="async">' : '<span class="vn-noimg"></span>') +
      '<span class="vn-shade"></span>' +
      '<span class="vn-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>' +
      (d ? '<span class="vn-dur">' + d + '</span>' : '') +
      '<span class="vn-title">' + esc(v.title) + '</span></a>'
  }).join('')
  return '<section class="vp-more"><div class="vp-more-inner"><h2>Tin vắn khác từ Tiên Du</h2><div class="vn-track" role="list">' + cards + '</div></div></section>'
}

function render(v, related) {
  const url = SITE + pageUrl(v)
  const title = clip(v.title, 60) + ' — Tin vắn Tiên Du Nha Trang'
  const descFull = (v.description || '').trim() || v.title
  const desc = clip(descFull, 155)
  const image = thumbOf(v) || SITE + '/assets/gioi-thieu.jpg'
  const meta = [fmtDate(v.published_at), fmtDur(v.duration_seconds) && 'Thời lượng ' + fmtDur(v.duration_seconds), 'Tiên Du Phụ Tùng Ô Tô Nha Trang'].filter(Boolean).join(' · ')

  const ogVideo = v.source === 'file'
    ? '<meta property="og:video" content="' + esc(v.video_url) + '">\n<meta property="og:video:type" content="video/mp4">\n<meta property="og:video:width" content="720">\n<meta property="og:video:height" content="1280">'
    : (embedUrl(v) ? '<meta property="og:video" content="' + esc(embedUrl(v)) + '">' : '')

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      videoObject(v, descFull),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE + '/' },
          { '@type': 'ListItem', position: 2, name: 'Tin vắn từ Tiên Du', item: SITE + '/#videoNews' },
          { '@type': 'ListItem', position: 3, name: v.title, item: url }
        ]
      }
    ]
  }
  const transcript = v.transcript && v.transcript.trim()
    ? '<section class="vp-transcript"><h2>Nội dung chính</h2><p>' + esc(v.transcript.trim()) + '</p></section>'
    : ''

  const map = {
    TITLE: esc(title), TITLE_SHORT: esc(clip(v.title, 40)), DESC: esc(desc), URL: esc(url), IMAGE: esc(image),
    OG_VIDEO: ogVideo, SCHEMA: '<script type="application/ld+json">' + jsonForScript(graph) + '</script>',
    PLAYER: playerHtml(v), H1: esc(v.title), META: esc(meta), DESC_FULL: esc(descFull),
    TRANSCRIPT: transcript, RELATED: relatedHtml(related)
  }
  return TEMPLATE.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, k) => (k in map ? map[k] : ''))
}

const H = { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + SUPABASE_ANON }
async function fetchVideo(slug) {
  const r = await fetch(SUPABASE_URL + '/rest/v1/videos?select=' + COLS + '&is_published=eq.true&limit=1&slug=eq.' + encodeURIComponent(slug), { headers: H })
  if (!r.ok) throw new Error('Supabase ' + r.status)
  return (await r.json())[0] || null
}
async function fetchRelated(id) {
  const r = await fetch(SUPABASE_URL + '/rest/v1/videos?select=' + COLS + '&is_published=eq.true&order=sort_order.asc,published_at.desc&limit=12', { headers: H })
  if (!r.ok) return []
  return (await r.json()).filter(v => v.id !== id).slice(0, 10)
}

async function notFound(res) {
  let body = '<!doctype html><meta charset="utf-8"><title>404 — Không tìm thấy trang</title><p>Không tìm thấy video.</p>'
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
  if (!slug) { res.setHeader('Location', '/#videoNews'); return res.status(302).end() }
  try {
    const video = await fetchVideo(slug)
    if (!video) return notFound(res)
    const related = await fetchRelated(video.id)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(200).send(render(video, related))
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(502).send('Trang video tạm thời không khả dụng')
  }
}
