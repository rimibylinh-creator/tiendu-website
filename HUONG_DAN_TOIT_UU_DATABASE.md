# Hướng dẫn Tối ưu Database — Tiên Du (15.000 SKU)

Tech stack: HTML thuần + Vanilla JS + Supabase  
Áp dụng cho: `san-pham.html`, `admin/index.html`, `san-pham-chi-tiet.html`

---

## Nguyên lý 1 — Indexing (Đánh chỉ mục)

**Mục tiêu:** Supabase tìm trong 15.000 dòng nhanh như tìm trong 100 dòng.

### Chạy trong Supabase SQL Editor

Vào **Supabase Dashboard > SQL Editor > New query**, dán và chạy:

```sql
-- Index 1: Tìm theo tên sản phẩm (cột name)
-- Supabase sẽ dùng index này khi bạn gọi .ilike('name', '%má phanh%')
CREATE INDEX IF NOT EXISTS idx_products_name
  ON products USING gin(to_tsvector('simple', name));

-- Index 2: Tìm theo slug (mã sản phẩm / SKU trong URL)
-- Dùng khi load trang chi tiết: .eq('slug', 'ma-phanh-gom-cao-cap')
CREATE INDEX IF NOT EXISTS idx_products_slug
  ON products(slug);

-- Index 3: Tên sản phẩm đã chuẩn hóa (không dấu) — dùng cho nguyên lý 4
-- Cần tạo cột name_normalized trước (xem nguyên lý 4)
-- (Chạy sau khi đã thêm cột name_normalized)
CREATE INDEX IF NOT EXISTS idx_products_name_norm
  ON products(name_normalized);

-- Index đã có sẵn trong schema gốc (không cần tạo lại):
-- idx_products_category, idx_products_brand, idx_products_published
```

**Kết quả:** Query từ vài giây → dưới 100ms.

---

## Nguyên lý 2 — Pagination (Phân trang)

**Mục tiêu:** Mỗi lần chỉ tải 24 sản phẩm, bấm "Xem thêm" mới tải tiếp — không bao giờ load 15.000 cái một lúc.

### Thêm vào `js/main.js` (hoặc tạo `js/san-pham.js` riêng)

```javascript
// ── Cấu hình ──────────────────────────────────────────────
const SUPABASE_URL  = 'https://XXXX.supabase.co';       // Thay bằng URL của bạn
const SUPABASE_KEY  = 'eyJXXXX...';                     // Thay bằng anon key của bạn
const supabase      = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const PAGE_SIZE = 24;      // Mỗi lần load 24 sản phẩm
let   currentPage  = 0;    // Trang hiện tại (bắt đầu từ 0)
let   currentFilter = '';  // '' = tất cả, hoặc 'phanh', 'dong-co'...
let   isLoading = false;   // Tránh gọi 2 lần cùng lúc

// ── Hàm tải sản phẩm ──────────────────────────────────────
async function loadProducts(reset = false) {
  if (isLoading) return;
  isLoading = true;

  // Nếu reset (đổi filter, tìm kiếm mới) → quay về trang 0
  if (reset) {
    currentPage = 0;
    document.querySelector('.product-grid').innerHTML = '';
  }

  const from = currentPage * PAGE_SIZE;              // Vị trí bắt đầu
  const to   = from + PAGE_SIZE - 1;                // Vị trí kết thúc

  // Xây query
  let query = supabase
    .from('products')
    .select('id, slug, name, price, stock_status, short_specs, thumbnail_url, compatible_year, brands(name), categories(name, slug)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(from, to);                                // ← Đây là phân trang: lấy từ dòng `from` đến `to`

  // Lọc theo danh mục nếu có
  if (currentFilter) {
    query = query.eq('categories.slug', currentFilter);
  }

  const { data, error } = await query;

  if (error) { console.error(error); isLoading = false; return; }

  renderProducts(data);                              // Vẽ sản phẩm ra màn hình
  currentPage++;                                     // Tăng trang lên để lần sau lấy tiếp

  // Ẩn nút "Xem thêm" nếu đã hết dữ liệu
  const btnMore = document.getElementById('btn-load-more');
  if (btnMore) btnMore.style.display = data.length < PAGE_SIZE ? 'none' : '';

  isLoading = false;
}

// ── Hàm vẽ sản phẩm ra HTML ───────────────────────────────
function renderProducts(products) {
  const grid = document.querySelector('.product-grid');
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card-image">
        <img src="${p.thumbnail_url || 'assets/images/placeholder.jpg'}"
             alt="${p.name}"
             loading="lazy">
      </div>
      <div class="product-card-content">
        <p class="product-name">${p.name}</p>
        <div class="price-row">
          <span class="price">${Number(p.price).toLocaleString('vi-VN')} ₫</span>
          <span class="stock-badge">${p.stock_status === 'in_stock' ? 'Còn hàng' : 'Hết hàng'}</span>
        </div>
        <a href="san-pham-chi-tiet.html?slug=${p.slug}" class="btn btn-yellow product-cta">
          Liên hệ báo giá →
        </a>
      </div>`;
    grid.appendChild(card);
  });
}

// ── Gắn sự kiện ───────────────────────────────────────────
// Nút "Xem thêm" ở cuối trang
document.getElementById('btn-load-more')?.addEventListener('click', () => loadProducts());

// Tab lọc danh mục
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter === 'all' ? '' : btn.dataset.filter;
    loadProducts(true);  // reset = true → xóa grid cũ, load lại từ đầu
  });
});

// Tải lần đầu khi mở trang
loadProducts();
```

### Thêm nút "Xem thêm" vào `san-pham.html`

```html
<!-- Đặt ngay dưới .product-grid -->
<div style="text-align:center; margin-top:40px;">
  <button id="btn-load-more" class="btn btn-yellow">Xem thêm sản phẩm</button>
</div>
```

---

## Nguyên lý 3 — Caching (Bộ nhớ đệm)

**Mục tiêu:** Khách vào trang chủ xem "Sản phẩm nổi bật" → lưu vào bộ nhớ trình duyệt 5 phút. Load lại trang không gọi API nữa.

### Thêm vào `js/main.js`

```javascript
// ── Hàm cache đa năng (TTL = thời gian sống tính bằng giây) ──
const Cache = {
  set(key, data, ttlSeconds = 300) {
    // Lưu data + thời điểm hết hạn vào SessionStorage
    sessionStorage.setItem(key, JSON.stringify({
      data,
      expiresAt: Date.now() + ttlSeconds * 1000  // Hết hạn sau `ttlSeconds` giây
    }));
  },

  get(key) {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;                        // Không có cache
    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {                // Cache đã hết hạn
      sessionStorage.removeItem(key);
      return null;
    }
    return data;                                  // Trả về data từ cache
  }
};

// ── Dùng cache khi tải sản phẩm nổi bật ở trang chủ ──────
async function loadFeaturedProducts() {
  const CACHE_KEY = 'featured_products';

  // 1. Kiểm tra cache trước
  const cached = Cache.get(CACHE_KEY);
  if (cached) {
    renderFeaturedProducts(cached);   // Có cache → dùng luôn, không gọi API
    return;
  }

  // 2. Không có cache → gọi Supabase
  const { data } = await supabase
    .from('products')
    .select('id, slug, name, price, thumbnail_url, brands(name)')
    .eq('is_featured', true)
    .eq('is_published', true)
    .limit(12);

  if (data) {
    Cache.set(CACHE_KEY, data, 300);  // Lưu cache 5 phút (300 giây)
    renderFeaturedProducts(data);
  }
}

// Gọi khi load trang chủ
loadFeaturedProducts();
```

**Lưu ý:**
- `SessionStorage` tự xóa khi đóng tab — phù hợp với sản phẩm (giá hay thay đổi).
- Dùng `LocalStorage` nếu muốn cache tồn tại qua nhiều tab: thay `sessionStorage` → `localStorage`.

---

## Nguyên lý 4 — Full-text Search (Tìm kiếm toàn văn, có dấu / không dấu)

**Mục tiêu:** Khách gõ "ma phanh" (không dấu) → vẫn ra "Má Phanh Gốm Cao Cấp".

### Bước 4a — Thêm cột `name_normalized` vào Supabase

Chạy trong **SQL Editor**:

```sql
-- Thêm cột chứa tên sản phẩm đã loại bỏ dấu tiếng Việt
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_normalized text;

-- Hàm tự động chuẩn hóa tên (chuyển "Má Phanh" → "ma phanh")
CREATE OR REPLACE FUNCTION normalize_vietnamese(input text)
RETURNS text AS $$
  SELECT lower(
    translate(input,
      'àáâãäåèéêëìíîïòóôõöùúûüýÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝăắặằẳẵấầẩẫậđêếềệểễôốồổỗộơớờởỡợưứừửữựÂăĐôơưảẻỉọủẢẺỈỌỦẫẩậấầẻềệếêổỗộốồởỡợớờủứừửữự',
      'aaaaaaeeeeiiiioooooouuuuyaaaaaaeeeeiiiioooooouuuuyaaaaaaeeeeiiiioooooouuuuyaaaaaaeeeeiiiioooooouuuuy'
    )
  );
$$ LANGUAGE sql IMMUTABLE;

-- Điền dữ liệu cho tất cả sản phẩm hiện có
UPDATE products SET name_normalized = normalize_vietnamese(name);

-- Trigger: tự cập nhật name_normalized khi thêm/sửa sản phẩm
CREATE OR REPLACE FUNCTION sync_name_normalized()
RETURNS trigger AS $$
BEGIN
  NEW.name_normalized := normalize_vietnamese(NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_name_normalized
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION sync_name_normalized();

-- Tạo index cho cột mới (đã đề cập ở nguyên lý 1)
CREATE INDEX IF NOT EXISTS idx_products_name_norm ON products(name_normalized);
```

### Bước 4b — Code JavaScript tìm kiếm

```javascript
// ── Hàm chuẩn hóa phía client (JS) — giống với hàm SQL ────
function normalizeVietnamese(str) {
  return str.toLowerCase()
    .normalize('NFD')                           // Tách dấu ra khỏi chữ
    .replace(/[̀-ͯ]/g, '')            // Xóa dấu
    .replace(/đ/g, 'd').replace(/Đ/g, 'd');    // Xử lý chữ đ riêng
}

// ── Hàm tìm kiếm ──────────────────────────────────────────
async function searchProducts(keyword) {
  if (!keyword.trim()) {
    loadProducts(true);  // Ô tìm kiếm trống → tải lại tất cả
    return;
  }

  const normalized = normalizeVietnamese(keyword);  // "Má Phanh" → "ma phanh"

  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, price, stock_status, thumbnail_url, brands(name)')
    .eq('is_published', true)
    // Tìm trong cột name_normalized (không dấu, lowercase)
    .ilike('name_normalized', `%${normalized}%`)    // % ở 2 đầu = tìm ở bất kỳ vị trí
    .limit(50);

  if (error) { console.error(error); return; }
  document.querySelector('.product-grid').innerHTML = '';
  renderProducts(data);
}

// ── Gắn vào ô tìm kiếm — debounce 300ms (không gọi API liên tục khi đang gõ) ──
let searchTimer;
document.getElementById('search-input')?.addEventListener('input', (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => searchProducts(e.target.value), 300);
  //                        ↑ Chờ 300ms sau khi ngừng gõ mới gọi API
});
```

### Thêm ô tìm kiếm vào `san-pham.html`

```html
<div class="search-bar" style="margin-bottom:24px;">
  <input
    id="search-input"
    type="search"
    placeholder="Tìm phụ tùng... (vd: ma phanh, loc nhien lieu)"
    style="width:100%; padding:12px 16px; border:1.5px solid #d2d2d2; border-radius:64px; font-size:15px; outline:none;"
  >
</div>
```

---

## Nguyên lý 5 — Lazy-load Image (Tải ảnh theo cuộn)

**Mục tiêu:** 24 thẻ sản phẩm trên màn hình → chỉ ảnh nào đang thấy mới được tải. Ảnh phía dưới chờ khi cuộn đến.

### Cách 1 — Đơn giản nhất: thuộc tính HTML `loading="lazy"`

```html
<!-- Chỉ thêm loading="lazy" vào thẻ <img> là xong, trình duyệt tự xử lý -->
<img
  src="assets/products/ma-phanh.jpg"
  alt="Má Phanh Gốm Cao Cấp"
  loading="lazy"
  width="400"
  height="300"
>
```

Đã áp dụng trong hàm `renderProducts()` ở nguyên lý 2 (`loading="lazy"` trong `img` tag).  
**Hỗ trợ 95%+ trình duyệt hiện đại. Dùng cách này trước.**

### Cách 2 — Nâng cao: Intersection Observer (kiểm soát hoàn toàn)

Dùng khi cần hiệu ứng fade-in khi ảnh xuất hiện, hoặc muốn tự quyết định khoảng cách prefetch:

```javascript
// Tạo 1 observer dùng chung cho toàn bộ trang
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {               // Ảnh vừa vào vùng nhìn thấy
      const img = entry.target;
      img.src = img.dataset.src;              // Gán src thật (lấy từ data-src)
      img.classList.add('loaded');            // Thêm class để chạy animation
      imageObserver.unobserve(img);           // Ngừng theo dõi ảnh này
    }
  });
}, {
  rootMargin: '200px'  // Bắt đầu tải trước 200px so với màn hình (prefetch)
});

// Trong hàm renderProducts(), dùng data-src thay vì src:
function renderProducts(products) {
  const grid = document.querySelector('.product-grid');
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card-image">
        <img data-src="${p.thumbnail_url || 'assets/images/placeholder.jpg'}"
             src="assets/images/placeholder-tiny.jpg"
             alt="${p.name}"
             class="lazy-img">
      </div>
      ...`;

    // Đăng ký ảnh với observer ngay sau khi tạo card
    const img = card.querySelector('.lazy-img');
    imageObserver.observe(img);

    grid.appendChild(card);
  });
}
```

### CSS cho hiệu ứng fade-in

Thêm vào `css/styles.css`:

```css
/* Ảnh lúc đầu trong suốt */
.lazy-img {
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Khi đã load xong → hiện dần */
.lazy-img.loaded {
  opacity: 1;
}
```

---

## Tóm tắt — Thứ tự triển khai

| Bước | Làm gì | Thời gian ước tính |
|------|--------|-------------------|
| 1 | Chạy SQL tạo Index (nguyên lý 1) | 5 phút |
| 2 | Chạy SQL thêm cột `name_normalized` + trigger (nguyên lý 4a) | 10 phút |
| 3 | Thêm `loading="lazy"` vào tất cả `<img>` trong render function (nguyên lý 5) | 5 phút |
| 4 | Tích hợp Pagination vào `san-pham.html` (nguyên lý 2) | 30 phút |
| 5 | Thêm ô tìm kiếm + search function (nguyên lý 4b) | 20 phút |
| 6 | Thêm Cache cho trang chủ (nguyên lý 3) | 15 phút |

**Ưu tiên:** Bước 1 + 2 (SQL) → làm ngay, không ảnh hưởng frontend, chỉ cần copy-paste vào Supabase SQL Editor.
