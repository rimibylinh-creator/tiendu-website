document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Promo carousel ---------- */
  const track = document.querySelector('.promo-track');
  const slides = document.querySelectorAll('.promo-slide');
  const dots = document.querySelectorAll('.promo-dot');
  let current = 0;
  let autoplayTimer = null;

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      restartAutoplay();
    });
  });

  function autoplay() {
    autoplayTimer = setInterval(() => goToSlide(current + 1), 5000);
  }
  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplay();
  }
  if (track && slides.length) {
    autoplay();
  }

  /* ---------- Language switcher (nav) ---------- */
  // Ngôn ngữ hiện tại do js/i18n.js quyết định (localStorage 'tiendu-lang'); đổi ngôn ngữ = tải lại trang.
  const langSwitch = document.querySelector('.lang-switch');
  if (langSwitch) {
    const langBtn  = langSwitch.querySelector('.lang-btn');
    const langMenu = langSwitch.querySelector('.lang-menu');
    const current  = (window.TienduI18n && window.TienduI18n.lang) || 'vi';
    const setLangOpen = (open) => {
      langMenu.hidden = !open;
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    const markCurrent = (lang) => {
      const b = langMenu.querySelector('button[data-lang="' + lang + '"]');
      if (!b) return;
      langMenu.querySelectorAll('li').forEach((li) => li.setAttribute('aria-selected', li.contains(b) ? 'true' : 'false'));
      langBtn.querySelector('.lang-label').textContent = lang.toUpperCase();
      langBtn.querySelector('.lang-flag').replaceWith(b.querySelector('.lang-flag').cloneNode(true));
    };
    markCurrent(current);
    langBtn.addEventListener('click', (e) => { e.stopPropagation(); setLangOpen(langMenu.hidden); });
    document.addEventListener('click', (e) => { if (!langSwitch.contains(e.target)) setLangOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !langMenu.hidden) { setLangOpen(false); langBtn.focus(); } });
    langMenu.querySelectorAll('button[data-lang]').forEach((b) => {
      b.addEventListener('click', () => {
        const lang = b.dataset.lang;
        setLangOpen(false);
        if (lang === current) return;
        try { localStorage.setItem('tiendu-lang', lang); } catch (err) {}
        // ?lang=… trong URL sẽ ghi đè lựa chọn đã lưu, nên bỏ nó đi trước khi tải lại
        const u = new URL(location.href); u.searchParams.delete('lang');
        location.replace(u.toString());
      });
    });
  }

  /* ---------- Product category tabs ---------- */
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.product-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.style.display = matches ? '' : 'none';
      });
    });
  });

  /* ---------- Product cards — click anywhere to open detail ---------- */
  cards.forEach((card) => {
    const link = card.querySelector('.product-cta');
    if (!link) return;
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a, button')) {
        window.location.href = link.href;
      }
    });
  });

  /* ---------- Mobile nav toggle ---------- */
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---------- Fixed nav — shadow on scroll ---------- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---------- Hero search — gợi ý trực tiếp từ database (sản phẩm đang hiển thị) ---------- */
  /* Tìm không dấu trên cột search_text: tên + SKU/mã phụ tùng + xe tương thích + thông số. */

  function normalizeVi(str) {
    if (!str) return '';
    return str.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'd');
  }

  const escHtml = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtPrice = p => (p ? new Intl.NumberFormat('vi-VN').format(p) + ' ₫' : 'Liên hệ');
  const searchUrl = q => 'san-pham.html?q=' + encodeURIComponent(q);

  const heroInput   = document.getElementById('heroSearchInput');
  const heroBtn     = document.getElementById('heroSearchBtn');
  const heroResults = document.getElementById('heroSearchResults');

  let heroReq = 0;
  let heroTimer = null;

  function goSearch(q) {
    if (q) window.location.href = searchUrl(q);
  }

  function renderHeroResults(items, query) {
    if (!heroResults) return;
    heroResults.innerHTML = '';

    if (items.length === 0) {
      heroResults.innerHTML = '<div class="hero-search-result-empty">Không tìm thấy sản phẩm phù hợp</div>';
    } else {
      items.forEach(p => {
        const a = document.createElement('a');
        a.className = 'hero-search-result-item';
        a.href = 'san-pham-chi-tiet.html?slug=' + encodeURIComponent(p.slug);
        a.innerHTML = `
          <img class="hero-search-result-thumb" src="${escHtml(p.thumbnail_url || 'assets/no-image.svg')}" alt="" loading="lazy" onerror="this.src='assets/no-image.svg'">
          <div class="hero-search-result-info">
            <div class="hero-search-result-name">${escHtml(p.name)}</div>
            <div class="hero-search-result-meta">
              <span class="hero-search-result-cat">${escHtml(p.categories && p.categories.name || '')}</span>
              <span style="color:var(--color-border)">·</span>
              <span class="hero-search-result-price">${fmtPrice(p.price)}</span>
            </div>
          </div>`;
        heroResults.appendChild(a);
      });
    }

    const allLink = document.createElement('a');
    allLink.className = 'hero-search-result-all';
    allLink.href = searchUrl(query);
    allLink.innerHTML = `Xem tất cả kết quả cho "<strong>${escHtml(query)}</strong>" →`;
    heroResults.appendChild(allLink);
    heroResults.classList.add('is-open');
  }

  async function heroLiveSearch(query) {
    const myReq = ++heroReq;
    if (typeof db === 'undefined') return;              // không có Supabase → chỉ cho Enter / nút Tìm
    const tokens = normalizeVi(query).split(/\s+/).filter(Boolean);
    if (!tokens.length) { heroResults.classList.remove('is-open'); return; }

    heroResults.innerHTML = '<div class="hero-search-result-empty">Đang tìm…</div>';
    heroResults.classList.add('is-open');

    let items = [];
    try {
      let q = db.from('products')
        .select('slug, name, price, thumbnail_url, categories(name)')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(5);
      tokens.forEach(t => { q = q.ilike('search_text', '%' + t + '%'); });
      const res = await q;
      items = res.data || [];
    } catch (e) { items = []; }

    if (myReq !== heroReq) return;                      // đã có lần gõ mới hơn
    renderHeroResults(items, query);
  }

  if (heroInput) {
    heroInput.addEventListener('input', () => {
      const q = heroInput.value.trim();
      clearTimeout(heroTimer);
      if (q.length < 2) { heroReq++; heroResults.classList.remove('is-open'); return; }
      heroTimer = setTimeout(() => heroLiveSearch(q), 250);
    });

    heroInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') goSearch(heroInput.value.trim());
      if (e.key === 'Escape') heroResults.classList.remove('is-open');
    });

    document.addEventListener('click', e => {
      if (!heroInput.closest('.hero-search-wrap').contains(e.target)) {
        heroResults.classList.remove('is-open');
      }
    });
  }

  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      const q = heroInput ? heroInput.value.trim() : '';
      if (q) goSearch(q);
      else if (heroInput) heroInput.focus();
    });
  }
});

/* ============================================================
   PRODUCT DETAIL PAGE — TAB SWITCHING
   ============================================================ */
(function () {
  document.querySelectorAll('.pd-tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.pd-tab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.pd-tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.getElementById('tab-' + tab);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
(function () {
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      const answer = q.nextElementSibling;
      const isOpen = q.classList.contains('open');

      // Close all others in the same section
      const section = q.closest('.faq-section');
      if (section) {
        section.querySelectorAll('.faq-question.open').forEach(function (openQ) {
          openQ.classList.remove('open');
          openQ.nextElementSibling.classList.remove('open');
        });
      }

      if (!isOpen) {
        q.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
})();
