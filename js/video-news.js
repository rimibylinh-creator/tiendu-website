// Section "Tin vắn từ Tiên Du" (trang chủ): hàng video dọc + lightbox xem full trên nền tối 80%.
// Mỗi thẻ là <a href="/tin-van/slug"> thật (Google đi theo được); click thường → mở lightbox,
// Ctrl/⌘-click hoặc bot → vào trang video riêng (api/video.js, có VideoObject schema).
// Phụ thuộc: js/supabase-client.js (getVideos).
(function () {
  var SITE = 'https://ototiendu.com'
  var root = document.getElementById('videoNews')
  if (!root || typeof getVideos !== 'function') return

  var track = root.querySelector('.vn-track')
  var videos = []
  var cur = -1
  var lb = null

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  // ── Nhận diện nguồn video ───────────────────────────────────
  function ytId(u) {
    var m = /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|live\/|watch\?(?:.*&)?v=))([\w-]{11})/.exec(u || '')
    return m ? m[1] : ''
  }
  function tiktokId(u) {
    var m = /tiktok\.com\/.*?\/video\/(\d+)/.exec(u || '')
    return m ? m[1] : ''
  }
  function embedUrl(v, autoplay) {
    if (v.source === 'youtube') {
      var id = ytId(v.video_url); if (!id) return ''
      return 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&playsinline=1&modestbranding=1' + (autoplay ? '&autoplay=1' : '')
    }
    if (v.source === 'tiktok') {
      var t = tiktokId(v.video_url); return t ? 'https://www.tiktok.com/embed/v2/' + t : ''
    }
    if (v.source === 'facebook') {
      return 'https://www.facebook.com/plugins/video.php?show_text=false&width=380&href=' + encodeURIComponent(v.video_url) + (autoplay ? '&autoplay=true' : '')
    }
    return ''
  }
  function thumbOf(v) {
    if (v.thumbnail_url) return v.thumbnail_url
    if (v.source === 'youtube' && ytId(v.video_url)) return 'https://i.ytimg.com/vi/' + ytId(v.video_url) + '/hqdefault.jpg'
    return ''
  }
  function fmtDur(s) {
    s = Math.round(+s || 0); if (!s) return ''
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2)
  }
  function isoDur(s) {
    s = Math.round(+s || 0); if (!s) return ''
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60
    return 'PT' + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (x || (!h && !m) ? x + 'S' : '')
  }
  function pageUrl(v) { return '/tin-van/' + encodeURIComponent(v.slug) }

  // ── Thẻ video ───────────────────────────────────────────────
  function cardHtml(v, i) {
    var thumb = thumbOf(v)
    var media = thumb
      ? '<img src="' + esc(thumb) + '" alt="' + esc(v.title) + '" loading="lazy" decoding="async">'
      : (v.source === 'file'
          ? '<video src="' + esc(v.video_url) + '#t=0.5" preload="metadata" muted playsinline></video>'
          : '<span class="vn-noimg"></span>')
    var d = fmtDur(v.duration_seconds)
    return '<a class="vn-card" role="listitem" href="' + pageUrl(v) + '" data-i="' + i + '" aria-label="Xem video: ' + esc(v.title) + '">' +
      media +
      '<span class="vn-shade"></span>' +
      '<span class="vn-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>' +
      (d ? '<span class="vn-dur">' + d + '</span>' : '') +
      '<span class="vn-title">' + esc(v.title) + '</span>' +
      '</a>'
  }

  // ── Lightbox ────────────────────────────────────────────────
  function buildLightbox() {
    lb = document.createElement('div')
    lb.className = 'vn-lightbox'
    lb.setAttribute('role', 'dialog')
    lb.setAttribute('aria-modal', 'true')
    lb.setAttribute('aria-label', 'Xem video')
    lb.hidden = true
    lb.innerHTML =
      '<button type="button" class="vn-lb-close" aria-label="Đóng video">✕</button>' +
      '<button type="button" class="vn-lb-nav vn-lb-prev" aria-label="Video trước">‹</button>' +
      '<div class="vn-lb-stage"><div class="vn-lb-player"></div>' +
      '<div class="vn-lb-caption"><p class="vn-lb-title"></p><a class="vn-lb-more" href="#">Xem chi tiết →</a></div></div>' +
      '<button type="button" class="vn-lb-nav vn-lb-next" aria-label="Video sau">›</button>'
    document.body.appendChild(lb)

    // Bấm nền tối (ngoài khung video) → đóng
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('vn-lb-stage')) close()
    })
    lb.querySelector('.vn-lb-close').addEventListener('click', close)
    lb.querySelector('.vn-lb-prev').addEventListener('click', function () { open(cur - 1) })
    lb.querySelector('.vn-lb-next').addEventListener('click', function () { open(cur + 1) })
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') open(cur - 1)
      else if (e.key === 'ArrowRight') open(cur + 1)
    })
    // Vuốt ngang để chuyển video (mobile)
    var x0 = null
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX }, { passive: true })
    lb.addEventListener('touchend', function (e) {
      if (x0 == null) return
      var dx = e.changedTouches[0].clientX - x0; x0 = null
      if (Math.abs(dx) > 70) open(cur + (dx < 0 ? 1 : -1))
    }, { passive: true })
  }

  function open(i) {
    if (!videos.length) return
    if (!lb) buildLightbox()
    cur = (i + videos.length) % videos.length
    var v = videos[cur]
    var player = lb.querySelector('.vn-lb-player')
    player.innerHTML = ''
    var el
    if (v.source === 'file') {
      el = document.createElement('video')
      el.src = v.video_url
      el.controls = true; el.autoplay = true; el.playsInline = true
      el.setAttribute('playsinline', ''); el.setAttribute('controlsList', 'nodownload')
      if (thumbOf(v)) el.poster = thumbOf(v)
    } else {
      el = document.createElement('iframe')
      el.src = embedUrl(v, true)
      el.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'
      el.allowFullscreen = true
      el.title = v.title
      el.setAttribute('frameborder', '0')
    }
    player.appendChild(el)
    lb.querySelector('.vn-lb-title').textContent = v.title
    lb.querySelector('.vn-lb-more').href = pageUrl(v)
    var multi = videos.length > 1
    lb.querySelector('.vn-lb-prev').style.display = multi ? '' : 'none'
    lb.querySelector('.vn-lb-next').style.display = multi ? '' : 'none'
    if (lb.hidden) {
      lb.hidden = false
      document.documentElement.classList.add('vn-lock')
    }
    lb.querySelector('.vn-lb-close').focus({ preventScroll: true })
    if (window.gtag) gtag('event', 'video_open', { video_title: v.title, video_slug: v.slug })
  }

  function close() {
    if (!lb || lb.hidden) return
    lb.querySelector('.vn-lb-player').innerHTML = '' // dừng phát
    lb.hidden = true
    document.documentElement.classList.remove('vn-lock')
    var card = track.querySelector('[data-i="' + cur + '"]')
    if (card) card.focus({ preventScroll: true })
  }

  // ── Structured data: video hiện chung với kết quả AI & carousel video ngắn ──
  function videoObject(v) {
    var thumb = thumbOf(v)
    var o = {
      '@type': 'VideoObject',
      '@id': SITE + pageUrl(v) + '#video',
      name: v.title,
      description: v.description || v.title,
      thumbnailUrl: thumb ? [thumb] : undefined,
      uploadDate: v.published_at,
      duration: isoDur(v.duration_seconds) || undefined,
      url: SITE + pageUrl(v),
      inLanguage: 'vi',
      isFamilyFriendly: true,
      transcript: v.transcript || undefined,
      publisher: { '@type': 'Organization', name: 'Tiên Du Phụ Tùng Ô Tô', logo: { '@type': 'ImageObject', url: SITE + '/assets/nav-logo.png' } }
    }
    if (v.source === 'file') o.contentUrl = v.video_url
    else if (embedUrl(v)) o.embedUrl = embedUrl(v)
    return o
  }
  function injectSchema() {
    var items = videos.map(function (v, i) {
      return { '@type': 'ListItem', position: i + 1, url: SITE + pageUrl(v), item: videoObject(v) }
    })
    var s = document.createElement('script')
    s.type = 'application/ld+json'
    s.id = 'videoNewsSchema'
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Tin vắn từ Tiên Du',
      itemListElement: items
    }).replace(/</g, '\\u003c')
    document.head.appendChild(s)
  }

  // ── Cuộn ngang bằng nút (desktop) ───────────────────────────
  function bindScroll() {
    var prev = root.querySelector('.vn-scroll-prev'), next = root.querySelector('.vn-scroll-next')
    function step(dir) { track.scrollBy({ left: dir * Math.max(track.clientWidth * 0.8, 240), behavior: 'smooth' }) }
    function sync() {
      var max = track.scrollWidth - track.clientWidth
      prev.disabled = track.scrollLeft <= 4
      next.disabled = track.scrollLeft >= max - 4
      root.classList.toggle('vn-no-scroll', max <= 4)
    }
    prev.addEventListener('click', function () { step(-1) })
    next.addEventListener('click', function () { step(1) })
    track.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    sync()
  }

  getVideos().then(function (list) {
    videos = (list || []).filter(function (v) { return v && v.slug && v.video_url && (v.source === 'file' || embedUrl(v)) })
    if (!videos.length) return // chưa có video → section giữ ẩn
    track.innerHTML = videos.map(cardHtml).join('')
    track.addEventListener('click', function (e) {
      var a = e.target.closest('.vn-card')
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
      e.preventDefault()
      open(+a.dataset.i)
    })
    root.hidden = false
    bindScroll()
    injectSchema()
  })
})()
