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

  /* ---------- Hero search — live results + navigate ---------- */

  /* Danh sách xe tương thích — key là tên chuẩn hóa (không dấu, lowercase) */
  const VEHICLES = {
    'fortuner':     'Toyota Fortuner',
    'camry':        'Toyota Camry',
    'vios':         'Toyota Vios',
    'altis':        'Toyota Corolla Altis',
    'corolla':      'Toyota Corolla',
    'innova':       'Toyota Innova',
    'innova cross': 'Toyota Innova Cross',
    'yaris':        'Toyota Yaris',
    'hilux':        'Toyota Hilux',
    'land cruiser': 'Toyota Land Cruiser',
    'prado':        'Toyota Land Cruiser Prado',
    'rush':         'Toyota Rush',
    'veloz':        'Toyota Veloz',
    'avanza':       'Toyota Avanza',
    'raize':        'Toyota Raize',
    'cross':        'Toyota Corolla Cross',
    'civic':        'Honda Civic',
    'crv':          'Honda CR-V',
    'hrv':          'Honda HR-V',
    'city':         'Honda City',
    'accord':       'Honda Accord',
    'brio':         'Honda Brio',
    'pilot':        'Honda Pilot',
    'elantra':      'Hyundai Elantra',
    'tucson':       'Hyundai Tucson',
    'santafe':      'Hyundai Santa Fe',
    'santa fe':     'Hyundai Santa Fe',
    'i10':          'Hyundai i10',
    'accent':       'Hyundai Accent',
    'mazda3':       'Mazda 3',
    'mazda6':       'Mazda 6',
    'cx5':          'Mazda CX-5',
    'cx 5':         'Mazda CX-5',
    'outlander':    'Mitsubishi Outlander',
    'xpander':      'Mitsubishi Xpander',
    'pajero':       'Mitsubishi Pajero',
    'nissan':       'Nissan',
    'navara':       'Nissan Navara',
    'x trail':      'Nissan X-Trail',
    'xtrail':       'Nissan X-Trail',
    'bmw':          'BMW',
    'mercedes':     'Mercedes-Benz',
    'lexus':        'Lexus',
    'ford':         'Ford',
    'ranger':       'Ford Ranger',
    'everest':      'Ford Everest',
    'chevrolet':    'Chevrolet',
    'colorado':     'Chevrolet Colorado',
  };

  const PRODUCTS = [
    { name: 'Bộ Lọc Không Khí Dòng Cao', brand: 'Toyota', cat: 'Động Cơ',      catKey: 'dong-co', price: '185.000 ₫', img: 'assets/products/p01-loc-khong-khi.jpg',  tags: 'loc khong khi air filter 2.0l 2.5l',       vehicles: ['fortuner','camry','innova','innova cross','land cruiser','prado'] },
    { name: 'Má Phanh Gốm Cao Cấp',       brand: 'Toyota', cat: 'Hệ Thống Phanh', catKey: 'phanh',   price: '450.000 ₫', img: 'assets/products/p02-ma-phanh.jpg',          tags: 'ma phanh brake pad gom truoc sau',          vehicles: ['fortuner','hilux','innova','land cruiser','prado','rush','corolla','altis','civic','crv','elantra','tucson','santafe','santa fe','outlander','xpander','ranger','everest','colorado'] },
    { name: 'Dầu Nhớt & Bộ Lọc Động Cơ', brand: 'Toyota', cat: 'Động Cơ',      catKey: 'dong-co', price: '320.000 ₫', img: 'assets/products/p03-dau-nhot.jpg',          tags: 'dau nhot oil filter 5w30 synthetic',        vehicles: ['fortuner','camry','vios','altis','corolla','innova','yaris','hilux','land cruiser','prado','rush','veloz','avanza','cross','civic','crv','hrv','city','accord','brio','elantra','tucson','santafe','santa fe','accent','mazda3','mazda6','cx5','cx 5','outlander','xpander','pajero','nissan','navara','x trail','xtrail','ranger','everest','colorado'] },
    { name: 'Bugi Iridium',                brand: 'Toyota', cat: 'Đánh Lửa',     catKey: 'dien',    price: '275.000 ₫', img: 'assets/products/p04-bugi.jpg',              tags: 'bugi spark plug iridium',                   vehicles: ['camry','altis','corolla','vios','yaris','cross','civic','city','accord','mazda3','mazda6','elantra','accent'] },
    { name: 'Bộ Lọc Không Khí Dòng Cao',  brand: 'Toyota', cat: 'Động Cơ',      catKey: 'dong-co', price: '185.000 ₫', img: 'assets/products/p05-loc-khong-khi-2.jpg',   tags: 'loc khong khi air filter 1.5l 2.0l',        vehicles: ['vios','yaris','innova','rush','veloz','avanza','raize','cross','hrv','city','brio','accent','i10','mazda3'] },
    { name: 'Bộ Giảm Xóc Thể Thao',        brand: 'Toyota', cat: 'Hệ Thống Treo', catKey: 'treo',    price: '1.250.000 ₫', img: 'assets/products/p06-giam-xoc.jpg',       tags: 'giam xoc shock absorber treo truoc 450kg',  vehicles: ['fortuner','hilux','innova','land cruiser','prado','rush','camry','crv','tucson','santafe','santa fe','outlander','xpander','pajero','navara','x trail','xtrail','ranger','everest','colorado'] },
    { name: 'Bộ Lọc Dầu Động Cơ',          brand: 'Toyota', cat: 'Bộ Phận Lọc',  catKey: 'loc',     price: '95.000 ₫',  img: 'assets/products/p07-loc-dau.jpg',           tags: 'loc dau oil filter 6-8bar',                 vehicles: ['fortuner','camry','vios','altis','corolla','innova','yaris','hilux','land cruiser','prado','rush','veloz','cross','civic','crv','hrv','city','accord','brio','elantra','tucson','santafe','santa fe','accent','mazda3','mazda6','cx5','outlander','xpander','pajero','navara','ranger','everest','colorado'] },
    { name: 'Dây Curoa Truyền Động',         brand: 'Toyota', cat: 'Truyền Động',  catKey: 'dong-co', price: '320.000 ₫', img: 'assets/products/p08-day-curoa.jpg',         tags: 'day curoa belt truyen dong 1680mm',          vehicles: ['camry','innova','land cruiser','prado','altis','corolla','crv','accord','tucson','santafe','santa fe','cx5','outlander','pajero','everest'] },
    { name: 'Cảm Biến Oxy Khí Thải',        brand: 'Toyota', cat: 'Hệ Thống Điện', catKey: 'dien',   price: '650.000 ₫', img: 'assets/products/p09-cam-bien-oxy.jpg',      tags: 'cam bien oxy oxygen sensor khi thai',       vehicles: ['camry','altis','corolla','innova','vios','civic','accord','crv','mazda3','mazda6','cx5','elantra','tucson','outlander'] },
    { name: 'Bộ Lọc Nhiên Liệu Cao Cấp',   brand: 'Toyota', cat: 'Nhiên Liệu',   catKey: 'loc',     price: '145.000 ₫', img: 'assets/products/p10-loc-nhien-lieu.jpg',    tags: 'loc nhien lieu fuel filter 10 micron',      vehicles: ['fortuner','camry','vios','altis','corolla','innova','yaris','hilux','land cruiser','cross','civic','crv','city','accord','elantra','tucson','mazda3','cx5','outlander','xpander','navara','ranger','everest'] },
    { name: 'Đèn Pha LED Cao Cấp',          brand: 'Toyota', cat: 'Hệ Thống Điện', catKey: 'dien',   price: '2.800.000 ₫', img: 'assets/products/p11-den-pha-led.jpg',     tags: 'den pha led headlight 6000K 30000h',        vehicles: ['fortuner','camry','land cruiser','prado','innova','civic','accord','crv','tucson','santafe','santa fe','mazda6','cx5','outlander','pajero','everest'] },
    { name: 'Bơm Nước Làm Mát',             brand: 'Toyota', cat: 'Làm Mát',      catKey: 'dong-co', price: '580.000 ₫', img: 'assets/products/p12-bom-nuoc.jpg',          tags: 'bom nuoc lam mat water pump 50L',           vehicles: ['fortuner','camry','innova','land cruiser','prado','hilux','altis','corolla','civic','accord','crv','tucson','santafe','santa fe','mazda6','cx5','outlander','pajero','everest','colorado'] },
  ];

  function normalizeVi(str) {
    if (!str) return '';
    return str.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'd');
  }

  /* Phát hiện tên xe trong query — trả về { key, label } hoặc null */
  function detectVehicle(query) {
    const q = normalizeVi(query).replace(/\s+/g, ' ').trim();
    /* Ưu tiên match dài trước (vd "innova cross" trước "innova") */
    const keys = Object.keys(VEHICLES).sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (q.includes(normalizeVi(key))) return { key, label: VEHICLES[key] };
    }
    return null;
  }

  function searchProducts(query) {
    const vehicle = detectVehicle(query);
    if (vehicle) {
      return { vehicle, results: PRODUCTS.filter(p => p.vehicles.includes(vehicle.key)) };
    }
    const q = normalizeVi(query);
    const words = q.split(/\s+/).filter(Boolean);
    return {
      vehicle: null,
      results: PRODUCTS.filter(p => {
        const hay = normalizeVi(p.name + ' ' + p.brand + ' ' + p.cat + ' ' + p.tags);
        return words.every(w => hay.includes(w));
      }),
    };
  }

  const heroInput   = document.getElementById('heroSearchInput');
  const heroBtn     = document.getElementById('heroSearchBtn');
  const heroResults = document.getElementById('heroSearchResults');

  function navigateSearch(q) {
    const vehicle = detectVehicle(q);
    const url = vehicle
      ? 'san-pham.html?vehicle=' + encodeURIComponent(vehicle.key) + '&label=' + encodeURIComponent(vehicle.label)
      : 'san-pham.html?q=' + encodeURIComponent(q);
    window.location.href = url;
  }

  function renderResults({ vehicle, results }, query) {
    if (!heroResults) return;
    heroResults.innerHTML = '';
    if (!query) { heroResults.classList.remove('is-open'); return; }

    if (vehicle) {
      const hdr = document.createElement('div');
      hdr.className = 'hero-search-result-header';
      hdr.textContent = `Phụ tùng tương thích: ${vehicle.label}`;
      heroResults.appendChild(hdr);
    }

    if (results.length === 0) {
      heroResults.innerHTML += `<div class="hero-search-result-empty">Không tìm thấy sản phẩm phù hợp</div>`;
    } else {
      results.slice(0, 5).forEach(p => {
        const a = document.createElement('a');
        a.className = 'hero-search-result-item';
        a.href = vehicle
          ? 'san-pham.html?vehicle=' + encodeURIComponent(vehicle.key) + '&label=' + encodeURIComponent(vehicle.label)
          : 'san-pham.html?q=' + encodeURIComponent(p.name);
        a.innerHTML = `
          <img class="hero-search-result-thumb" src="${p.img}" alt="${p.name}" onerror="this.style.visibility='hidden'">
          <div class="hero-search-result-info">
            <div class="hero-search-result-name">${p.name}</div>
            <div class="hero-search-result-meta">
              <span class="hero-search-result-cat">${p.cat}</span>
              <span style="color:var(--color-border)">·</span>
              <span class="hero-search-result-price">${p.price}</span>
            </div>
          </div>`;
        heroResults.appendChild(a);
      });
    }

    const allLink = document.createElement('a');
    allLink.className = 'hero-search-result-all';
    allLink.href = vehicle
      ? 'san-pham.html?vehicle=' + encodeURIComponent(vehicle.key) + '&label=' + encodeURIComponent(vehicle.label)
      : 'san-pham.html?q=' + encodeURIComponent(query);
    allLink.innerHTML = vehicle
      ? `Xem tất cả phụ tùng cho <strong>${vehicle.label}</strong> →`
      : `Xem tất cả kết quả cho "<strong>${query}</strong>" →`;
    heroResults.appendChild(allLink);
    heroResults.classList.add('is-open');
  }

  if (heroInput) {
    heroInput.addEventListener('input', () => {
      const q = heroInput.value.trim();
      if (q.length < 2) { heroResults.classList.remove('is-open'); return; }
      renderResults(searchProducts(q), q);
    });

    heroInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = heroInput.value.trim();
        if (q) navigateSearch(q);
      }
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
      if (q) navigateSearch(q);
      else if (heroInput) heroInput.focus();
    });
  }

  /* ---------- san-pham.html: filter bar logic ---------- */
  const btnApply     = document.getElementById('btnApplyFilter');
  const filterBrand  = document.getElementById('filterBrand');
  const filterCat    = document.getElementById('filterCat');
  const filterSearch = document.getElementById('filterSearch');
  const countEl      = document.getElementById('productsCount');
  const productGrid  = document.getElementById('productGrid');

  /* Lấy danh sách tên sản phẩm tương thích với xe từ PRODUCTS data */
  function getCompatibleNames(vehicleKey) {
    return PRODUCTS.filter(p => p.vehicles.includes(vehicleKey)).map(p => p.name);
  }

  function applyFilters(vehicleKey) {
    if (!productGrid) return;
    const brand    = filterBrand  ? normalizeVi(filterBrand.value)        : '';
    const cat      = filterCat    ? filterCat.value                        : '';
    const rawQ     = filterSearch ? filterSearch.value.trim()              : '';
    const detected = vehicleKey ? { key: vehicleKey } : detectVehicle(rawQ);
    const allCards = productGrid.querySelectorAll('.product-card');
    let visible = 0;

    allCards.forEach(card => {
      let show = false;

      if (detected) {
        /* Vehicle mode: khớp theo danh sách tên tương thích */
        const compatNames = getCompatibleNames(detected.key).map(normalizeVi);
        const cardName    = normalizeVi(card.querySelector('.product-name')?.textContent || '');
        show = compatNames.some(n => cardName.includes(n) || n.includes(cardName));
      } else {
        const cardText = normalizeVi(card.textContent);
        const cardCat  = card.dataset.category || '';
        const q        = normalizeVi(rawQ);
        const brandOk  = !brand || cardText.includes(brand);
        const catOk    = !cat   || cardCat === cat;
        const searchOk = !q     || q.split(/\s+/).filter(Boolean).every(w => cardText.includes(w));
        show = brandOk && catOk && searchOk;
      }

      /* Luôn áp thêm filter hãng & loại dù là vehicle mode */
      if (detected) {
        const cardText = normalizeVi(card.textContent);
        const cardCat  = card.dataset.category || '';
        if (brand && !cardText.includes(brand)) show = false;
        if (cat   && cardCat !== cat)           show = false;
      }

      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (countEl) {
      countEl.textContent = visible > 0
        ? `Hiển thị ${visible} sản phẩm`
        : 'Không tìm thấy sản phẩm phù hợp';
    }
  }

  if (btnApply) {
    btnApply.addEventListener('click', () => applyFilters());
    if (filterSearch) filterSearch.addEventListener('keydown', e => { if (e.key === 'Enter') applyFilters(); });
  }

  /* ---------- san-pham.html: read ?q= / ?vehicle= / ?category= param và auto-filter ---------- */
  if (productGrid) {
    const params      = new URLSearchParams(window.location.search);
    const preQ        = params.get('q');
    const preVehicle  = params.get('vehicle');
    const preLabel    = params.get('label');
    const preCat      = params.get('category');

    if (preCat && !preVehicle && !preQ) {
      const tabBtn = document.querySelector(`.tab-btn[data-filter="${preCat}"]`);
      if (tabBtn) tabBtn.click();
    }

    if (preVehicle) {
      /* Hiển thị banner "Đang xem phụ tùng tương thích với X" */
      const banner = document.createElement('div');
      banner.className = 'vehicle-filter-banner';
      banner.innerHTML = `<span>🔍 Phụ tùng tương thích: <strong>${preLabel || preVehicle}</strong></span>
        <button class="vehicle-filter-clear" onclick="window.location.href='san-pham.html'">✕ Xoá bộ lọc</button>`;
      productGrid.parentElement.insertBefore(banner, productGrid);
      applyFilters(preVehicle);
    } else if (preQ) {
      if (filterSearch) filterSearch.value = preQ;
      applyFilters();
    }
  }
});
