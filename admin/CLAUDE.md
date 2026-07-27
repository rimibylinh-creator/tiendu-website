# CLAUDE.md — Admin Dashboard

Tài liệu này mô tả kiến trúc, design system và quy ước code cho admin dashboard Tiên Du.
Đọc file này trước khi chỉnh sửa `admin/index.html`.

---

## Tổng quan

**File duy nhất:** `admin/index.html` (~4100 dòng) — toàn bộ admin là một SPA single-file.

**Stack:**
- Vanilla JS (không có framework)
- Supabase JS v2 (`cdn.jsdelivr.net/npm/@supabase/supabase-js@2`) — backend duy nhất
- Lucide Icons UMD — icon system
- Quill.js — rich text editor (bài viết + mô tả sản phẩm)
- SheetJS — import/export CSV/Excel
- Claude API (direct browser call) + Gemini API — AI features

**Deploy:** GitHub push → Vercel auto-deploy (xem `feedback_deploy.md`)

---

## Supabase

```js
const SB_URL = 'https://kdqjhlpvxrpijeoibgki.supabase.co'
const db = createClient(SB_URL, SB_KEY)  // anon key, RLS "allow all"
```

**Các bảng chính:**

| Bảng | Mô tả |
|------|-------|
| `products` | Sản phẩm, join với `brands` + `categories` |
| `brands` | Hãng xe (id, name) |
| `categories` | Danh mục (id, name, slug) |
| `posts` | Bài viết/blog |
| `post_categories` | Danh mục bài viết |
| `shopee_products` | Kho hàng Shopee (id, category, dong_xe, ten_san_pham, gia_nhap_1_ben, created_at) |

**RLS:** tất cả bảng dùng policy `allow all` — `USING (true) WITH CHECK (true)`.

**Auth:** Supabase Auth email/password. Login → `startAdmin(user)` → load brands/cats → show dashboard.

---

## Layout

```
.layout { grid-template-columns: 220px 1fr; grid-template-rows: 56px 1fr }
```

- `.topbar` (56px) — brand + user email + logout
- `.sidebar` (220px) — nav items grouped by section
- `.main` — nội dung tab hiện tại (`padding: 28px 32px`)

**Responsive (≤820px):** sidebar chuyển thành tab bar ngang, `.nav-sec` và `.nav-div` bị ẩn.

---

## Tabs

5 tab, chuyển bằng `showTab(name)`:

| ID | Nav button | Lazy load |
|----|-----------|-----------|
| `tab-dashboard` | `nav-dashboard` | `loadDashboard()` — gọi khi init |
| `tab-products` | `nav-products` | `loadProducts()` — lần đầu click |
| `tab-posts` | `nav-posts` | `loadPosts()` — lần đầu click |
| `tab-agent` | `nav-agent` | `initAgentTab()` — mỗi lần click |
| `tab-shopee` | `nav-shopee` | `loadShopee()` — lần đầu click |

```js
function showTab(name) {
  ;['dashboard','products','posts','agent','shopee'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === name ? '' : 'none'
    const nav = document.getElementById('nav-' + t)
    if (nav) nav.classList.toggle('active', t === name)
  })
  // lazy load guards...
}
```

---

## Design System

### Colors

```css
#101010   /* topbar background, heading text */
#fecd27   /* primary yellow — active nav, focus border, CTA, accent */
#252b42   /* body text */
#737373   /* muted text */
#f7f7f7   /* main background */
#ebebeb   /* card/table border */
#d2d2d2   /* input border */
#fafafa   /* section alt background */
```

### Buttons

```css
.btn-primary   /* background: #fecd27; font-weight: 700 */
.btn-outline   /* border: 1.5px solid #d2d2d2 */
.btn-danger    /* red — destructive actions */
.btn-ghost     /* background: none; color: #737373 */
.btn-sheet     /* background: #eff6ff; border: #bfdbfe; color: #1e40af */
.btn-logout    /* topbar logout */
```

### Dropdown button

```html
<div class="btn-drop" id="myDropWrap">
  <button onclick="toggleDrop('myDropWrap')">Label <i data-lucide="chevron-down"></i></button>
  <div class="btn-drop-menu" id="myDropMenu">
    <button class="btn-drop-item" onclick="closeDrop('myDropWrap');doAction()">Item</button>
  </div>
</div>
```

```js
function toggleDrop(wrapId) { /* toggle .open + click-outside listener */ }
function closeDrop(wrapId)  { /* remove .open */ }
```

### Category tab bar

Dùng ở tab Sản phẩm và tab Kho Shopee:

```html
<div class="cat-tab-bar" id="catTabBar">
  <button class="cat-tab active" data-slug="" onclick="setPTab('')">Tất cả</button>
  <!-- thêm động bằng loadCats() -->
</div>
```

```css
.cat-tab-bar { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none }
.cat-tab     { border:1.5px solid #d2d2d2; border-radius:64px; padding:6px 16px; font-size:12px; font-weight:600 }
.cat-tab.active { background:#fecd27; border-color:#fecd27; color:#101010 }
```

### Modal system

**Luôn dùng pattern này** — không tạo class modal mới:

```html
<div class="modal-overlay" id="myModal" style="display:none" onclick="bkClose(event,'myModal')">
  <div class="modal-box">          <!-- thêm .sm | .lg | .xl để đổi max-width -->
    <div class="modal-head">
      <span class="modal-title">Tiêu đề</span>
      <button class="modal-close" onclick="closeModal('myModal')">✕</button>
    </div>
    <div class="modal-body">
      <!-- nội dung -->
    </div>
    <div class="modal-foot">
      <button class="btn-ghost" onclick="closeModal('myModal')">Huỷ</button>
      <button class="btn-primary" onclick="saveAction()">Lưu</button>
    </div>
  </div>
</div>
```

**Kích thước modal:**
- `.modal-box` — max-width: 700px (mặc định)
- `.modal-box.sm` — max-width: 440px
- `.modal-box.lg` — max-width: 860px
- `.modal-box.xl` — max-width: 1000px, max-height: 95vh

**Utilities:**
```js
function closeModal(id) { document.getElementById(id).style.display = 'none' }
function bkClose(e, id) { if (e.target.id === id) closeModal(id) }
```

Mở modal: `document.getElementById('myModal').style.display = 'flex'`

### Form system

```html
<div class="fgrid">                    <!-- 2-column grid, gap 14px -->
  <div class="fg">                     <!-- 1 column -->
    <label class="flabel">TÊN TRƯỜNG</label>
    <input class="finput" type="text">
  </div>
  <div class="fg s2">                  <!-- full width (span 2 cols) -->
    <label class="flabel">MÔ TẢ</label>
    <textarea class="ftextarea"></textarea>
  </div>
  <div class="fg">
    <label class="flabel">DANH MỤC</label>
    <select class="fsel">...</select>
  </div>
</div>
```

```css
.fgrid  { display:grid; grid-template-columns:1fr 1fr; gap:14px }
.fg     { display:flex; flex-direction:column; gap:5px }
.fg.s2  { grid-column:1/-1 }
.flabel { font-size:11px; font-weight:700; color:#a0a0a0; text-transform:uppercase }
.finput, .fsel, .ftextarea { border:1.5px solid #d2d2d2; border-radius:8px; padding:9px 12px; font-size:13px }
/* focus: border-color: #fecd27 */
```

### Table

```html
<div class="tcard">
  <table class="tbl">
    <thead>
      <tr><th>Cột</th>...</tr>
    </thead>
    <tbody id="pBody">
      <tr><td>...</td></tr>
    </tbody>
  </table>
</div>
```

### Badges / Chips

```html
<span class="badge green">Còn hàng</span>
<span class="badge red">Hết hàng</span>
<span class="badge amber">Sắp hết</span>
<span class="chip">Tag nhỏ</span>
```

### Toast notification

```js
function toast(msg, type = 'ok') {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.className = 'on ' + type  // 'ok' (đen) | 'err' (đỏ)
  clearTimeout(toast._t)
  toast._t = setTimeout(() => t.className = '', 2500)
}
```

### Icons

Dùng Lucide UMD. Sau khi thêm icon mới vào DOM phải gọi lại `lucide.createIcons()`.

```html
<i data-lucide="package" class="licon"></i>
<!-- .licon: 14×14px; .licon-md: 16×16; .licon-lg: 20×20; .licon-xl: 28×28 -->
```

---

## Tab Sản phẩm

### State

```js
let allP = []         // cache tất cả sản phẩm (load 1 lần)
const pStore = {}     // { id: product } — lookup nhanh
let brands = []       // cache brands
let cats   = []       // cache categories
const pF = { q: '', cat: '', stock: '', brand: '', priceMin: '', priceMax: '' }
```

### Filters

- **Search:** `pFilter(val, 'q')` — ilike theo name
- **Category tab:** `setPTab(slug)` — đồng bộ với `catSel` (hidden)
- **Brand:** `pFilter(val, 'brand')` — eq brand_id
- **Stock:** `pFilter(val, 'stock')` — eq stock_status
- **Giá từ/đến:** `pFilter(val, 'priceMin')` / `pFilter(val, 'priceMax')` — gte/lte price
- **Xoá lọc:** `clearPFilters()` — reset tất cả về rỗng, re-render `allP`

`catSel` dropdown có `display:none` — giữ trong DOM vì JS dùng `#catSel` để sync state.

### Dropdown "Kho giá nhập"

```html
<div class="btn-drop" id="khoDropWrap">
  <button class="btn-sheet" onclick="toggleDrop('khoDropWrap')">
    Kho giá nhập <i data-lucide="chevron-down">
  </button>
  <div class="btn-drop-menu">
    <button onclick="syncFromSheet()">Lấy lại kho gốc</button>
    <a href="[SHEET_URL]" target="_blank">Mở Sheet</a>
  </div>
</div>
```

### Product card (right drawer)

Khi click sản phẩm → `loadProductToDrawer(p)` mở `.rdrawer` bên phải.
Drawer có 3 tab: **Quick Edit** (`.rdtab`), **AI Phân tích**, **Nâng cao**.

---

## Tab Bài viết

State: `let allPo = []`, `const poStore = {}`  
Quill editor instance: `quillEditor` (khởi tạo trong `initQuill()`)  
AI writer: `callAI()` với Claude/Gemini để generate bài viết

---

## Tab AI Agent

Bulk AI processing sản phẩm. Config gồm:
- Provider: Claude / Gemini
- Scope: chọn sản phẩm
- Tác vụ: điền mô tả, phân loại xe, etc.

Progress bar + log realtime. `initAgentTab()` gọi mỗi lần switch sang tab.

---

## Tab Kho Shopee

### State

```js
let allShopee = []
let shopeeEditId = null   // null = thêm mới, string = edit
let shopeeCurCat = ''     // filter category hiện tại
let shopeeQ = ''          // filter search text
```

### Categories

```js
const SHOPEE_CAT_LABELS = {
  'phuoc-giam-xoc': 'Phuộc / Giảm xóc',
  'dia-phanh':      'Đĩa phanh',
  'he-thong-treo':  'Hệ thống treo',
  'day-chang':      'Dây chằng',
  'loc-gio':        'Lọc gió',
  'nhien-lieu':     'Nhiên liệu',
  'khac':           'Khác',
}
```

### Công thức tính giá Shopee

Tham số cấu hình (`getSRates()`):
- `sr_laiRong` — Lãi ròng/SP (%)
- `sr_markup` — Markup Shopee (%)
- `sr_phiCD` — Phí cố định (%)
- `sr_phiHT` — Phí hạ tầng (₫ cố định)
- `sr_phiTT` — Phí thanh toán (%)
- `sr_piShip` — Pi ship (₫ cố định)
- `sr_freeship` — Freeship (%)
- `sr_freeshCap` — Freeship cap (₫)

```js
function calcSP(gia1Ben) {
  const cap      = gia1Ben * 2                         // cặp (2 bên)
  const laiRong  = cap * r.laiRong                     // lãi ròng mong muốn
  const niemYet  = cap + laiRong                       // giá niêm yết gốc
  const shopee   = niemYet * (1 + r.markup)            // giá đăng Shopee
  // Fees: phiCD + phiHT + phiTT + piship + freeship (capped)
  const tongPhi  = phiCD + phiHT + phiTT + piship + freeship
  const sauPhi   = shopee - tongPhi
  const loiNhuan = sauPhi - cap
  return { cap, laiRong, niemYet, shopee, ..., loiNhuan,
           pctLN: shopee > 0 ? loiNhuan / shopee : 0 }
}
```

### CRUD

```js
loadShopee()         // fetch từ shopee_products, render table
openShopeeModal(id)  // null = add new, id = edit
saveShopeeItem()     // insert hoặc update
deleteShopeeItem(id) // confirm + delete
```

### Modals

- `shopeeModalOverlay` — Add/Edit sản phẩm (`.modal-box.sm`)
- `shopeeDetailOverlay` — Chi tiết tính giá (`.modal-box.lg`)
- Dùng `closeModal(id)` và `bkClose(event, id)` — không có custom close function

---

## AI Integration

```js
async function callAI(systemPrompt, userMsg, key, provider, maxTokens = 4096) {
  // provider: 'claude' → gọi Anthropic API trực tiếp từ browser
  // provider: 'gemini' → gọi Gemini API
  // key: API key do user nhập, lưu trong localStorage
}
```

API key lưu localStorage, không hard-code trong source.

---

## Quy ước quan trọng

1. **Không dùng class modal cũ** (`.modal`, `.modal-header`, `.modal-footer`) — dùng `.modal-box`, `.modal-head`, `.modal-foot`
2. **Không tạo custom closeModal function** — luôn dùng `closeModal(id)` + `bkClose(event, id)`
3. **Sau khi thêm Lucide icon vào DOM** — gọi `lucide.createIcons()`
4. **Lazy load tab data** — chỉ fetch khi lần đầu switch tab, dùng guard `if (!allP.length)`
5. **Toast feedback** — mọi action thành công/thất bại đều gọi `toast(msg, type)`
6. **Supabase queries** — dùng `.select('*,brands(id,name),categories(id,name,slug)')` cho products
7. **Commit + push ngay** sau mỗi thay đổi — Vercel auto-deploy

---

## Các modal trong file

| ID | Mục đích | Size |
|----|---------|------|
| `productModal` | Thêm/sửa sản phẩm | `.xl` |
| `postModal` | Thêm/sửa bài viết | `.xl` |
| `importModal` | Import CSV/Excel | `.lg` |
| `confirmModal` | Xác nhận xoá | `.sm` |
| `shopeeModalOverlay` | Thêm/sửa Shopee | `.sm` |
| `shopeeDetailOverlay` | Chi tiết giá Shopee | `.lg` |
