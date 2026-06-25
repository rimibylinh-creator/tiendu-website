/**
 * cms-loader.js — Tiên Du CMS Bridge
 * Đọc nội dung từ admin (localStorage['tiendu_cms']) và áp dụng lên trang.
 * Admin và site cùng domain ototiendu.com nên dùng chung localStorage.
 */
(function () {
  try {
    const raw = localStorage.getItem('tiendu_cms')
    if (!raw) return
    const cms = JSON.parse(raw)
    if (!cms) return

    const path = location.pathname
    const isHome = path === '/' || /\/(index\.html)?$/.test(path)
    const slug = path.replace(/^.*\//, '').replace(/\.html$/, '') || 'index'

    function setText(sel, val) {
      if (!val) return
      const el = document.querySelector(sel)
      if (el) el.textContent = val
    }
    function setHTML(sel, val) {
      if (!val) return
      const el = document.querySelector(sel)
      if (el) el.innerHTML = val.replace(/\\n/g, '<br>')
    }
    function setSrc(sel, val) {
      if (!val) return
      const el = document.querySelector(sel)
      if (el) el.src = val
    }

    // ── Trang chủ ──────────────────────────────────────────
    if (isHome && cms.homepage) {
      const h = cms.homepage

      if (h.hero) {
        setHTML('.hero-title', h.hero.title)
        if (h.hero.subtitle) {
          const el = document.querySelector('.hero-subtitle')
          if (el) el.innerHTML = h.hero.subtitle.replace(/\n/g, '<br>')
        }
        setSrc('.hero-media img', h.hero.bgImage)
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
          const p = h.promo[i]
          if (!p) return
          const img   = slide.querySelector('img')
          const title = slide.querySelector('.promo-slide-title')
          const text  = slide.querySelector('.promo-slide-text')
          const cta   = slide.querySelector('.btn')
          if (img   && p.image)   img.src = p.image
          if (title && p.title)   title.textContent = p.title
          if (text  && p.text)    text.textContent  = p.text
          if (cta) {
            if (p.ctaText) cta.textContent = p.ctaText
            if (p.ctaUrl)  cta.href        = p.ctaUrl
          }
        })
      }

      if (h.testimonials && h.testimonials.length) {
        const row = document.querySelector('.testimonial-row')
        if (row) {
          function stars(n) {
            let s = ''
            for (let i = 1; i <= 5; i++) {
              s += i <= n
                ? `<img src="assets/star-full-${Math.min(i, 4)}.svg" alt="">`
                : `<img src="assets/star-empty.svg" alt="">`
            }
            return s
          }
          row.innerHTML = h.testimonials.map(t => `
            <div class="testimonial-card">
              <div class="testimonial-stars">${stars(t.stars || 5)}</div>
              <p class="testimonial-quote">${t.quote || ''}</p>
              <div class="testimonial-author">
                <img src="${t.avatar || 'assets/avatar-regina.png'}" alt="${t.name || ''}">
                <div>
                  <p class="testimonial-author-name">${t.name || ''}</p>
                  <p class="testimonial-author-role">${t.role || ''}</p>
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

    // ── Trang con ──────────────────────────────────────────
    if (!isHome && cms.pages && cms.pages[slug]) {
      const pg = cms.pages[slug]
      setText('.page-hero-title', pg.heroTitle)
      setText('.page-hero-sub',   pg.heroSub)
      if (slug === 'gioi-thieu') {
        setText('.about-story-title', pg.storyTitle)
        if (pg.storyText) {
          const paras = document.querySelectorAll('.about-story-body p')
          if (paras.length) paras[0].textContent = pg.storyText
        }
      }
    }
  } catch (e) {
    // Không làm hỏng trang nếu CMS lỗi
  }
})()
