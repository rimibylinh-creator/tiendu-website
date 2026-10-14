# Bản dịch đa ngôn ngữ — thư mục `i18n/`

Tiếng Việt là ngôn ngữ gốc (nằm sẵn trong các trang HTML). Mỗi ngôn ngữ khác có **một thư mục riêng** theo mã ngôn ngữ:

```
i18n/
├── README.md        ← file này
├── en/              ← English
│   ├── ui.json        giao diện: menu, footer, nút, trang chủ, giới thiệu, liên hệ, tra VIN…
│   ├── policies.json  7 trang chính sách
│   ├── products.json  tên + thông số + danh mục của sản phẩm
│   ├── posts.json     tiêu đề + mô tả ngắn của bài viết, danh mục tin
│   └── jobs.json      tin tuyển dụng
└── ru/              ← Русский (cùng cấu trúc như en/)
```

## Cách sửa câu chữ
Mỗi file là danh sách các dòng:

```json
"câu tiếng Việt nguyên văn": "bản dịch"
```

1. Mở file trên GitHub (ví dụ `i18n/ru/ui.json`), bấm biểu tượng bút chì (Edit).
2. Sửa phần **bên phải** (bản dịch), giữ nguyên dấu `"` và dấu `,` cuối dòng.
3. Bấm *Commit changes*. Vercel tự deploy, khoảng 1 phút sau website cập nhật.

## Thêm câu mới
Thêm một dòng vào file phù hợp (sản phẩm → `products.json`, bài viết → `posts.json`…). Phần bên trái phải **giống hệt** chữ tiếng Việt trên website: khoảng trắng thừa được bỏ qua, nhưng chữ hoa/thường và dấu phải đúng.

Câu có phần thay đổi (số, tên) dùng `{0}`, `{1}`… theo thứ tự xuất hiện:

```json
"Hiển thị {0} / {1} sản phẩm": "Showing {0} of {1} products"
```

Trong `ui.json` còn hai khoá đặc biệt cho ngày tháng: `_months` (12 tên tháng) và `_date_format` (ví dụ `"{m} {d}, {y}"`). Các khoá bắt đầu bằng `_` không phải câu dịch.

## Tìm câu chưa dịch
1. Mở trang bất kỳ với `?lang=ru&i18n-debug=1` ở cuối địa chỉ (đổi `ru` thành `en` nếu cần), ví dụ `https://ototiendu.com/san-pham.html?lang=ru&i18n-debug=1`.
2. Mở Console của trình duyệt (F12) và gõ `TienduI18n.missing()`.
3. Danh sách trả về là các câu tiếng Việt chưa có trong từ điển. Thêm vào file theo cách trên.

Câu nào không có trong từ điển sẽ giữ nguyên tiếng Việt, nên có thể thêm dần.

## Thêm một ngôn ngữ mới (ví dụ `ko`)
1. Tạo thư mục `i18n/ko/` với 5 file như `i18n/en/` (có thể để trống `{}` rồi dịch dần).
2. Trong `js/i18n.js`, thêm `'ko'` vào dòng `var LANGS = [...]`.
3. Trong menu ngôn ngữ ở thanh nav (mỗi trang HTML), thêm một mục `<li>` có `data-lang="ko"` giống mục `ru`. Nhờ Claude làm bước này cho cả 20 trang.

## Lưu ý
- Khách đổi ngôn ngữ bằng nút cờ trên thanh menu; lựa chọn được nhớ trong trình duyệt của khách.
- Nội dung nhập từ trang admin (tên sản phẩm, mô tả, bài viết, tin tuyển dụng) dịch được theo cách trên, nhưng sản phẩm hoặc bài viết mới sẽ hiện tiếng Việt cho tới khi bạn thêm bản dịch.
- Phần mô tả dài của sản phẩm và nội dung đầy đủ của bài viết hiện chưa được dịch.
