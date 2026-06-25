/**
 * cms-loader.js — Tiên Du CMS Bridge
 * Nguồn ưu tiên: /cms-data.json (cross-domain, sau khi admin publish lên GitHub)
 * Fallback: localStorage['tiendu_cms'] (same-domain, lưu cục bộ từ admin)
 */
(function () {
  async function init() {
    let cms = null

    // 1. Thử fetch /cms-data.json (cross-domain, được publish từ admin riêng)
    try {
      const res = await fetch('/cms-data.json?t=' + Date.now(), { cache: 'no-cache' })
      if (res.ok) {
        const data = await res.json()
        // Chỉ dùng nếu có nội dung thực sự (không phải {} rỗng)
        if (data && (data.homepage || data.pages)) cms = data
      }
    } catch (_) {}

    // 2. Fallback: localStorage (same-domain dev / admin ở cùng domain)
    if (!cms) {
      try {
        const raw = localStorage.getItem('tiendu_cms')
        if (raw) cms = JSON.parse(raw)
      } catch (_) {}
    }

    if (!cms) return
    apply(cms)
  }

  function apply(cms) {
    const path   = location.pathname
    const isHome = path === '/' || /\/(index\.html)?$/.test(path)
    const slug   = path.replace(/^.*\//, '').replace(/\.html$/, '') || 'index'

    function setText(sel, val) {
      if (!val) return; const el = document.querySelector(sel); if (el) el.textContent = val
    }
    function setHTML(sel, val) {
      if (!val) return; const el = document.querySelector(sel); if (el) el.innerHTML = val.replace(/\n/g, '<br>')
    }

    // ── Trang chủ ─────────────────────────────────────────
    if (isHome && cms.homepage) {
      const h = cms.homepage

      if (h.hero) {
        setHTML('.hero-title', h.hero.title)
        if (h.hero.subtitle) {
          const el = document.querySelector('.hero-subtitle')
          if (el) el.innerHTML = h.hero.subtitle.replace(/\n/g, '<br>')
        }

        // Media: hình ảnh hoặc video
        const mediaWrap = document.querySelector('.hero-media')
        if (mediaWrap) {
          if (h.hero.bgType === 'video' && h.hero.bgVideo) {
            mediaWrap.innerHTML = `<video src="${h.hero.bgVideo}" autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video>`
          } else if (h.hero.bgImage) {
            const img = mediaWrap.querySelector('img')
            if (img) img.src = h.hero.bgImage
          }
        }

        if (h.hero.zaloUrl) {
          document.querySelectorAll('.hero-ctas a.btn-black').forEach(a => a.href = h.hero.zaloUrl)
        }
      }

      if (h.features) {
        document.querySelectorAll('.feature-card h3').forEach((el, i) => {
          if (h.features[i]?.text) el.textContent = h.features[i].text
        })
      }

      if (h.promo && h.promo.length) {
        document.querySelectorAll('.promo-slide').forEach((slide, i) => {
          const p = h.promo[i]; if (!p) return
          const img   = slide.querySelector('img')
          const title = slide.querySelector('.promo-slide-title')
          const text  = slide.querySelector('.promo-slide-text')
          const cta   = slide.querySelector('.btn')
          if (img   && p.image)   img.src = p.image
          if (title && p.title)   title.textContent = p.title
          if (text  && p.text)    text.textContent  = p.text
          if (cta) { if (p.ctaText) cta.textContent = p.ctaText; if (p.ctaUrl) cta.href = p.ctaUrl }
        })
      }

      if (h.testimonials && h.testimonials.length) {
        const row = document.querySelector('.testimonial-row')
        if (row) {
          function stars(n) {
            let s = ''
            for (let i = 1; i <= 5; i++)
              s += i <= n ? `<img src="assets/star-full-${Math.min(i,4)}.svg" alt="">` : `<img src="assets/star-empty.svg" alt="">`
            return s
          }
          row.innerHTML = h.testimonials.map(t => `
            <div class="testimonial-card">
              <div class="testimonial-stars">${stars(t.stars||5)}</div>
              <p class="testimonial-quote">${t.quote||''}</p>
              <div class="testimonial-author">
                <img src="${t.avatar||'assets/avatar-regina.png'}" alt="${t.name||''}">
                <div>
                  <p class="testimonial-author-name">${t.name||''}</p>
                  <p class="testimonial-author-role">${t.role||''}</p>
                </div>
              </div>
            </div>`).join('')
        }
      }

      if (h.ctaBanner) {
        setHTML('.cta-banner-title', h.ctaBanner.title)
        if (h.ctaBanner.zaloUrl) {
          const btn = document.querySelector('.cta-banner a.btn-black')
          if (btn) btn.href = h.ctaBanner.zaloUrl
        }
      }
    }

    // ── Trang con ─────────────────────────────────────────
    if (!isHome && cms.pages && cms.pages[slug]) {
      const pg = cms.pages[slug]
      setText('.page-hero-title', pg.heroTitle)
      setText('.page-hero-sub',   pg.heroSub)

      if (slug === 'gioi-thieu') {
        setText('.about-story-title', pg.storyTitle)
        if (pg.storyText) {
          const p = document.querySelector('.about-story-body p')
          if (p) p.textContent = pg.storyText
        }
      }

      // Giá sỉ: render bảng giá từ sheet upload
      if (slug === 'gia-si' && pg.priceTable) {
        const { headers, rows } = pg.priceTable
        const section = document.getElementById('cms-tier-table')
        if (section && headers && rows) {
          const headerHtml = headers.map(h => `<th>${h}</th>`).join('')
          const rowsHtml   = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')
          section.innerHTML = `<table class="tier-table">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>`
          section.style.display = 'block'
          // Ẩn bảng mặc định nếu đã có bảng CMS
          const defaultTable = document.getElementById('default-tier-table')
          if (defaultTable) defaultTable.style.display = 'none'
        }
      }
    }
  }

  // Chạy sau khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
