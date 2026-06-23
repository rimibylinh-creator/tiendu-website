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

  /* ---------- Hero search (placeholder behaviour) ---------- */
  const heroSearchBtn = document.querySelector('.hero-search-btn');
  const heroSearchInput = document.querySelector('.hero-search input');
  if (heroSearchBtn && heroSearchInput) {
    heroSearchBtn.addEventListener('click', () => {
      const query = heroSearchInput.value.trim();
      if (query) {
        alert(`Đang tìm phụ tùng cho: "${query}"`);
      } else {
        heroSearchInput.focus();
      }
    });
  }
});
