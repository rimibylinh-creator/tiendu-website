# CLAUDE.md — Tiên Du Website

Tài liệu này định nghĩa design system và quy ước code cho toàn bộ website Tiên Du.
Đọc file này trước khi chỉnh sửa bất kỳ trang nào.

---

## Tổng quan dự án

**Tiên Du** — Cửa hàng phụ tùng ô tô bán sỉ & lẻ, Nha Trang.  
Phase 1: Branding + Lead Gen + Product Catalog (không có cart/checkout).  
Ngôn ngữ: Tiếng Việt. Mobile-first (>80% traffic từ mobile).

---

## Cấu trúc file

```
site/
├── index.html           ← Trang chủ
├── san-pham.html        ← Catalog sản phẩm tổng
├── tra-cuu.html         ← Tra cứu phụ tùng theo xe
├── gia-si.html          ← Chính sách giá sỉ & đăng ký đối tác
├── tin-tuc.html         ← Blog / Tin tức & mẹo xe
├── gioi-thieu.html      ← Giới thiệu công ty
├── lien-he.html         ← Liên hệ
├── css/
│   └── styles.css       ← Toàn bộ styles (Design system + components + pages)
├── js/
│   └── main.js          ← JS cho carousel, tabs, mobile nav, vehicle lookup
└── assets/              ← Hình ảnh, icons, logos
    ├── brands/          ← Logo hãng xe (SVG)
    ├── images/          ← Ảnh danh mục
    ├── products/        ← Ảnh sản phẩm
    └── banners/         ← Ảnh banner
```

---

## Design System

### Màu sắc

```css
--color-primary:      #fecd27   /* Vàng chủ đạo — CTA, accent */
--color-primary-dark: #e1ae01   /* Vàng đậm — hover, gradient */
--color-black:        #000000   /* Background footer, btn-black */
--color-near-black:   #101010   /* Text chính, background hero nội trang */
--color-text:         #252b42   /* Text body */
--color-text-muted:   #737373   /* Text phụ, quote */
--color-text-light:   #6e6e6e   /* Mô tả nhỏ */
--color-border:       #d2d2d2   /* Viền card */
--color-bg-soft:      #f5f5f5   /* Background section sáng */
--color-bg-tab:       #e7e7e7   /* Background tab/filter bar */
--color-chip:         #eaeaea   /* Chip tag nhỏ */
--color-stock-green:  #22c55e   /* Badge "Còn hàng" */
--color-white:        #ffffff
```

### Typography

```css
--font-body: 'Inter'             /* Body, navigation, form, price */
--font-cta:  'Plus Jakarta Sans' /* Buttons CTA, headings hero */
```

- Section title: `font-size: 36px; letter-spacing: 3.6px; text-transform: uppercase; font-weight: 500`
- Hero title: `font-size: 48px; font-weight: 600`
- Price: `font-size: 18px; font-weight: 700`
- Body: `font-size: 14–16px; font-weight: 400–500`

### Spacing

```css
--container-max: 1440px
--container-pad: 56px   /* → 24px trên mobile */
```

- Section padding: `80px var(--container-pad)` (→ `56px` trên mobile `≤860px`)
- Card gap: `16px` (categories) | `24px` (products)

### Border radius

```css
--radius-pill: 64px   /* Buttons */
--radius-lg:   12px   /* Cards, category images */
--radius-md:   8px    /* Category card wrapper, brand items */
--radius-sm:   4px    /* Chips/tags */
```

---

## Components chuẩn

### Buttons

```html
<!-- Vàng (CTA chính) -->
<a href="#" class="btn btn-yellow">Mua ngay →</a>

<!-- Đen (Zalo, secondary) -->
<a href="#" class="btn btn-black">
  <img src="assets/icon-zalo.png" class="btn-icon" alt=""> Zalo tư vấn ngay
</a>
```

### Navigation (dùng trên tất cả trang)

Tất cả trang đều dùng cùng một nav. Nav có `position: absolute` nên cần đặt bên trong một container có `position: relative` và background tối để chữ trắng hiển thị được.

```html
<nav class="site-nav">
  <div class="container">
    <a href="tel:0946915111" class="btn btn-yellow nav-call-btn" style="visibility:hidden">
      <img src="assets/icon-phone.svg" class="btn-icon" alt=""> Gọi 0946.915.111
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a class="nav-link" href="san-pham.html">SẢN PHẨM</a></li>
      <li><a class="nav-link" href="tra-cuu.html">TRA CỨU XE</a></li>
      <li class="nav-logo"><a href="index.html"><img src="assets/nav-logo.png" alt="Tiên Du"></a></li>
      <li><a class="nav-link" href="tin-tuc.html">TIN TỨC</a></li>
      <li><a class="nav-link" href="gioi-thieu.html">GIỚI THIỆU</a></li>
    </ul>
    <a href="tel:0946915111" class="btn btn-yellow nav-call-btn">
      <img src="assets/icon-phone.svg" class="btn-icon" alt=""> Gọi 0946.915.111
    </a>
    <button class="nav-burger" aria-label="Mở menu" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  </div>
</nav>
```

### Page Header (inner pages — thay thế .hero của homepage)

```html
<header class="page-header">
  <nav class="site-nav"><!-- ... --></nav>
  <div class="page-hero-content">
    <h1 class="page-hero-title">TIÊU ĐỀ TRANG</h1>
    <p class="page-hero-sub">Mô tả ngắn</p>
  </div>
</header>
```

### CTA Banner (dùng ở cuối mỗi trang)

```html
<section class="cta-banner-wrap">
  <div class="cta-banner">
    <h2 class="cta-banner-title">Cần tư vấn phụ tùng?<br>Liên hệ ngay với Tiên Du!</h2>
    <a href="#" class="btn btn-black">
      <img src="assets/cta-banner-zalo.png" alt=""> Zalo tư vấn ngay
    </a>
  </div>
</section>
```

### Footer (dùng trên tất cả trang)

Copy nguyên footer từ index.html. Cập nhật `href` trong `.footer-col` để trỏ đúng trang.

### Product Card

```html
<article class="product-card" data-category="dong-co">
  <div class="product-card-image">
    <img src="assets/products/p01.jpg" alt="Tên sản phẩm">
    <div class="product-tags">
      <div class="tag-group">
        <span class="chip chip-brand">TOYOTA</span>
        <span class="chip">2024</span>
      </div>
      <span class="chip chip-category">Động Cơ</span>
    </div>
  </div>
  <div class="product-card-content">
    <p class="product-name">Tên Sản Phẩm</p>
    <div class="product-desc">
      <div class="product-desc-line"><span class="dot">·</span><span>Thông số 1</span></div>
      <div class="product-desc-line"><span class="dot">·</span><span>Thông số 2</span></div>
    </div>
    <div class="product-divider"></div>
    <div class="price-row">
      <span class="price">185.000 ₫</span>
      <span class="stock-badge">Còn hàng</span>
    </div>
    <button class="btn btn-yellow product-cta">Liên hệ báo giá →</button>
  </div>
</article>
```

---

## Quy ước

- Tất cả trang dùng `lang="vi"`, UTF-8, viewport mobile-first
- Dùng `<section class="section">` + `<div class="section-inner">` cho mọi section nội dung chính
- CTA sticky: Nút Zalo nổi (`.floating-zalo`) luôn hiển thị trên mobile — thêm vào cuối body nếu cần
- Tên file: tiếng Việt không dấu, kebab-case (san-pham.html, gioi-thieu.html...)
- Ảnh hero nội trang: có thể dùng CSS gradient tối thay cho ảnh thật khi chưa có asset
- Không dùng JS framework — vanilla JS thuần

---

## Thông tin liên hệ (dùng nhất quán trên toàn site)

- **Địa chỉ:** 37 Nguyễn Văn Hưởng, KDT VCN Phước Long, phường Phước Long, TP Nha Trang
- **Điện thoại:** 0946.915.111
- **Email:** tienduoto@gmail.com
- **Zalo:** tiendu.nhatrang
- **Giờ làm việc:** 7:30 – 17:30 (Thứ 2 – Thứ 7)

---

## Taxonomy danh mục sản phẩm

| Danh mục | `data-category` | Slug URL |
|----------|----------------|----------|
| Phụ tùng động cơ | `dong-co` | `/san-pham/dong-co` |
| Hệ thống phanh | `phanh` | `/san-pham/phanh` |
| Hệ thống treo & lái | `treo` | `/san-pham/treo` |
| Điện - điện tử | `dien` | `/san-pham/dien` |
| Bộ phận lọc | `loc` | `/san-pham/loc` |
| Thân vỏ & nội thất | `noi-that` | `/san-pham/noi-that` |
| Lốp & La-zăng | `lop` | `/san-pham/lop` |
