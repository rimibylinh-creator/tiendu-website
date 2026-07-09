# Tiên Du Blog Agent 🤖✍️

AI Agent viết blog **chuẩn SEO** cho website Tiên Du và tự đăng lên (qua Supabase),
với bước **duyệt trước khi xuất bản**.

Bài viết được lưu vào bảng `posts` trên Supabase — chính là nguồn dữ liệu mà
trang `tin-tuc.html` và `tin-tuc-chi-tiet.html` đang đọc. Nên **không cần commit
git hay deploy lại** — bài xuất bản là hiện ngay trên web.

---

## Cách hoạt động

```
Bạn nhập chủ đề
      │
      ▼
node write-blog.js "chủ đề"     →  Claude viết bài chuẩn SEO (HTML, title, excerpt, slug, meta)
      │
      ├─→ Lưu file xem trước:  drafts/<slug>.html  +  drafts/<slug>.json
      └─→ Lưu NHÁP vào Supabase (is_published = false)
      │
      ▼
Bạn mở file .html để đọc & duyệt
      │
      ▼
node publish-blog.js <slug>     →  Bật is_published = true  →  Bài lên web ngay
```

---

## Cài đặt (1 lần)

```bash
cd blog-agent
npm install
cp .env.example .env
```

Rồi mở `.env` và điền 2 key:

1. **`ANTHROPIC_API_KEY`** — lấy tại https://console.anthropic.com/settings/keys
2. **`SUPABASE_SERVICE_KEY`** — lấy tại Supabase Dashboard →
   Project Settings → API → **service_role** (secret).
   > ⚠️ Đây là key bí mật, cho phép ghi database. File `.env` đã được `.gitignore`,
   > **tuyệt đối không** commit lên GitHub hay chia sẻ.

`SUPABASE_URL` đã điền sẵn đúng project ototiendu.com.

---

## Sử dụng

### 1. Viết bài mới

```bash
node write-blog.js "Có nên thay lọc gió động cơ định kỳ không"
```

Gợi ý danh mục (không bắt buộc — agent tự chọn nếu bỏ trống):

```bash
node write-blog.js "Cách chọn ắc quy cho xe bán tải" --cat=phu-tung
```

Danh mục hợp lệ: `bao-duong`, `kinh-nghiem`, `phu-tung`, `tin-nganh`.

Chỉ viết thử ra file, **không** ghi Supabase:

```bash
node write-blog.js "chủ đề thử" --dry
```

### 2. Xem các bài nháp đang chờ duyệt

```bash
node list-drafts.js
```

### 3. Xuất bản một bài (sau khi đã duyệt)

```bash
node publish-blog.js ten-slug-cua-bai
```

---

## Quy tắc SEO mà agent tuân theo

- **Title** 50–60 ký tự, từ khóa chính ở đầu.
- **Excerpt / meta description** 140–160 ký tự.
- **Slug** không dấu, kebab-case, chứa từ khóa.
- Thân bài 900–1500 từ, nhiều `<h2>`/`<h3>`, có danh sách & bảng khi hợp lý.
- Từ khóa chính xuất hiện tự nhiên ở H1, mở bài, ≥2 H2, kết bài.
- Local SEO: nhắc "Nha Trang" và "Tiên Du" tự nhiên.
- Kết bài luôn có CTA gọi 0946.915.111 / Zalo.
- Nội dung xuất ra **HTML thuần** (đúng format mà `tin-tuc-chi-tiet.html` render).

Muốn chỉnh quy tắc/giọng văn → sửa `SYSTEM_PROMPT` trong `lib/writer.js`.

---

## Cấu trúc file

```
blog-agent/
├── write-blog.js      ← CLI: viết bài + lưu nháp
├── publish-blog.js    ← CLI: xuất bản theo slug
├── list-drafts.js     ← CLI: liệt kê bài nháp
├── lib/
│   ├── writer.js      ← Prompt SEO + gọi Claude API + validate
│   └── db.js          ← Kết nối Supabase, insert/publish/list
├── drafts/            ← File .html/.json xem trước (gitignored)
├── .env               ← Key bí mật (gitignored)
└── .env.example       ← Mẫu để copy
```

---

## Câu hỏi thường gặp

**Bài có tự lên web không?** Không, mặc định là nháp. Bạn phải chạy
`publish-blog.js` để duyệt — đúng như yêu cầu "duyệt trước khi đăng".

**Muốn sửa bài trước khi đăng?** Sửa trực tiếp trong Supabase (bảng `posts`,
cột `content`/`title`/`excerpt`) hoặc trong trang admin, rồi mới publish.

**Muốn agent tự chạy theo lịch (vd mỗi tuần 2 bài)?** Có thể bọc `write-blog.js`
trong cron. Nhưng vì bạn chọn "duyệt trước khi đăng", nên giữ bước publish thủ công.

**Ảnh bìa (cover_image_url)?** Hiện để trống. Bạn có thể thêm URL ảnh vào file
`.json` trước khi publish, hoặc thêm trong Supabase. (Có thể mở rộng agent để
tự sinh/chọn ảnh sau.)
