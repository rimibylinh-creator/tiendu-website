# Hướng dẫn nối ototiendu.com với Supabase

Mục tiêu: thay nội dung hardcode trong HTML (sản phẩm, giá, tin tức) bằng dữ liệu lấy từ database Supabase, để bạn tự thêm/sửa nội dung qua giao diện quản trị mà không cần sửa code.

File đi kèm: `supabase_schema.sql` — chạy 1 lần để tạo toàn bộ database.

Tài liệu này được viết để đưa thẳng cho **Claude Code** trong repo thật của ototiendu.com — Claude Code có thể đọc và thực hiện từng bước.

---

## Bước 0 — Tạo project Supabase

1. Vào [supabase.com](https://supabase.com) → tạo project mới (chọn region Singapore cho gần Việt Nam).
2. Vào **SQL Editor** → dán toàn bộ nội dung file `supabase_schema.sql` → Run.
3. Vào **Project Settings > API** → lấy 2 giá trị:
   - `Project URL`
   - `anon public key`

Hai giá trị này dùng để website đọc dữ liệu công khai. Không bao giờ đưa `service_role key` vào code frontend.

## Bước 1 — Xác định framework thực tế

Trang ototiendu.com hiện là các trang `.html` tĩnh (san-pham.html, tin-tuc.html...) với nội dung hardcode. Trước khi tích hợp, cần xác minh trong repo thật:

- Đây có đúng là Next.js/React như đã xác nhận, hay là HTML thuần + JS?
- Các trang chi tiết sản phẩm (`/san-pham/{slug}.html`) và bài viết hiện đang generate kiểu gì (static file riêng từng trang, hay 1 template chung)?

→ Yêu cầu Claude Code: "Hãy đọc cấu trúc thư mục repo này và cho tôi biết framework, cách routing, và nơi đang chứa dữ liệu sản phẩm/bài viết (hardcode ở đâu)."

## Bước 2 — Cài Supabase client

```bash
npm install @supabase/supabase-js
```

Tạo file `lib/supabase.js` (hoặc `.ts`):

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Thêm vào `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

## Bước 3 — Thay hardcode bằng query thật

### Trang danh sách sản phẩm (san-pham.html → tương đương `app/san-pham/page.js`)

```js
const { data: products } = await supabase
  .from('products')
  .select(`
    id, slug, name, price, stock_status, short_specs, thumbnail_url, compatible_year,
    brands ( name, slug ),
    categories ( name, slug )
  `)
  .eq('is_published', true)
  .order('created_at', { ascending: false })
```

Lọc theo hãng xe hoặc loại phụ tùng (khớp với `?category=phanh` đang có trên web):

```js
.eq('categories.slug', categorySlug)
```

### Trang chi tiết sản phẩm

```js
const { data: product } = await supabase
  .from('products')
  .select('*, brands(name), categories(name), product_images(image_url, display_order)')
  .eq('slug', params.slug)
  .single()
```

### Trang Tin Tức

```js
const { data: posts } = await supabase
  .from('posts')
  .select('slug, title, excerpt, cover_image_url, published_at, post_categories(name, slug)')
  .eq('is_published', true)
  .order('published_at', { ascending: false })
```

## Bước 4 — Trang quản trị để tự cập nhật nội dung

Có 2 lựa chọn, không cần tự code phức tạp:

**Cách dễ nhất — Supabase Table Editor có sẵn:**
Vào Supabase Dashboard → Table Editor → sửa trực tiếp dòng dữ liệu (thêm sản phẩm, đổi giá, đổi tồn kho) như sửa Excel. Không cần code thêm gì. Phù hợp nếu bạn không ngại làm việc trong dashboard.

**Cách thân thiện hơn — trang admin riêng:**
Yêu cầu Claude Code dựng 1 route `/admin` (bảo vệ bằng Supabase Auth, chỉ bạn đăng nhập được) với form thêm/sửa sản phẩm và bài viết, dùng `service_role key` ở phía server (route handler / server action), không lộ ra client. Việc này tốn thêm thời gian dev nhưng giúp bạn không cần vào Supabase Dashboard.

→ Đề xuất: dùng Table Editor trước để đi vào hoạt động nhanh, sau này rảnh thì làm thêm trang admin riêng nếu thấy cần.

## Bước 5 — Ảnh sản phẩm/bài viết

Dùng **Supabase Storage** (bucket `product-images`, `post-images`) để upload ảnh thay vì để cố định trong `/assets/`. Set bucket là public để lấy URL trực tiếp nhúng vào `thumbnail_url`, `cover_image_url`.

## Checklist đưa cho Claude Code

```
1. Đọc cấu trúc repo, xác nhận framework & nơi hardcode dữ liệu sản phẩm/bài viết
2. npm install @supabase/supabase-js
3. Tạo lib/supabase.js với URL + anon key (đọc từ .env.local — tôi sẽ cung cấp 2 giá trị này)
4. Thay phần hardcode sản phẩm trong san-pham.html / trang tương đương bằng query supabase.from('products')...
5. Thay phần hardcode bài viết trong tin-tuc.html bằng query supabase.from('posts')...
6. Cập nhật trang chi tiết sản phẩm + bài viết để query theo slug từ URL
7. Kiểm tra lọc theo hãng xe (?category=...) hoạt động đúng với category_id thật
8. Build & test local trước khi deploy
```

---

## Lưu ý quan trọng

- File `supabase_schema.sql` đã chèn sẵn seed data cho brands/categories/post_categories khớp với nội dung hiện có trên web — bạn chỉ cần thêm sản phẩm và bài viết thật vào bảng `products` / `posts`.
- RLS (Row Level Security) đã được cấu hình: khách truy cập web chỉ đọc được dữ liệu `is_published = true`, không thể tự ý sửa/xóa qua API công khai.
- Chi phí: Supabase free tier đủ dùng cho quy mô vài trăm—vài nghìn sản phẩm, không tốn phí ban đầu.
