# Bản dịch tiếng Anh — `i18n/en.json`

Đây là "database" câu chữ tiếng Anh của website. Mỗi dòng có dạng:

```json
"câu tiếng Việt nguyên văn": "English"
```

## Sửa câu chữ
1. Mở `i18n/en.json` trên GitHub, bấm biểu tượng bút chì (Edit).
2. Sửa phần **bên phải** (tiếng Anh), giữ nguyên dấu `"` và dấu `,` cuối dòng.
3. Bấm *Commit changes*. Vercel tự deploy, khoảng 1 phút sau website cập nhật.

## Thêm câu mới
Thêm một dòng mới, phần bên trái phải **giống hệt** chữ tiếng Việt trên website (khoảng trắng thừa được bỏ qua, nhưng chữ hoa/thường và dấu phải đúng).

Nếu câu có phần thay đổi (số, tên), dùng `{0}`, `{1}`... theo thứ tự xuất hiện:

```json
"Hiển thị {0} / {1} sản phẩm": "Showing {0} of {1} products"
```

## Tìm câu chưa dịch
1. Mở trang bất kỳ với `?lang=en&i18n-debug=1` ở cuối địa chỉ, ví dụ `https://ototiendu.com/san-pham.html?lang=en&i18n-debug=1`.
2. Mở Console của trình duyệt (F12) và gõ `TienduI18n.missing()`.
3. Danh sách trả về là các câu tiếng Việt chưa có trong `en.json`. Thêm chúng vào file theo cách trên.

## Lưu ý
- Câu không có trong file này sẽ giữ nguyên tiếng Việt, nên thêm dần được.
- Nội dung nhập từ trang admin (tên sản phẩm, mô tả, bài viết, tin tuyển dụng) cũng dịch được theo cách trên, nhưng mỗi sản phẩm, bài viết mới sẽ hiện tiếng Việt cho tới khi bạn thêm bản dịch.
- Các khoá bắt đầu bằng `_` (như `_huong_dan`) chỉ là ghi chú, website bỏ qua.
- Khách đổi ngôn ngữ bằng nút cờ trên thanh menu. Lựa chọn được nhớ trong trình duyệt của khách.
