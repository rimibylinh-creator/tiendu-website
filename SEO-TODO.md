# SEO TODO — Tiên Du

Các hạng mục SEO đã hoàn thành bằng code và các hạng mục còn lại cần thực hiện thủ công.

## Đã hoàn thành

- [x] `robots.txt` — cho phép tất cả crawler, trỏ đến sitemap
- [x] `sitemap.xml` — 27 URL với priority và changefreq chuẩn
- [x] Canonical `<link>` trên tất cả 12 trang gốc
- [x] Sửa H1 trùng lặp trên `tin-tuc-chi-tiet.html` và `tuyen-dung-chi-tiet.html`
- [x] 12 trang sản phẩm riêng trong `san-pham/` với Product JSON-LD schema
- [x] 7 trang bài viết riêng trong `tin-tuc/` với Article + FAQPage JSON-LD schema
- [x] LocalBusiness/AutoPartsStore schema trên `index.html` và `lien-he.html`
- [x] ItemList schema trên `san-pham.html` và `tin-tuc.html`
- [x] Cập nhật 12 link sản phẩm trong `san-pham.html` → URL cụ thể
- [x] Cập nhật 7 link bài viết trong `tin-tuc.html` → URL cụ thể
- [x] FAQ accordion CSS trong `css/styles.css`
- [x] FAQ accordion JS trong `js/main.js`

## Còn lại — Cần thực hiện thủ công

### Google Business Profile (ƯU TIÊN CAO)
Google Business Profile không thể tạo/xác nhận bằng code — phải làm thủ công:

1. Truy cập: https://business.google.com
2. Đăng nhập bằng tài khoản Google của cửa hàng
3. Tìm kiếm "Tiên Du" — nếu đã có hồ sơ thì yêu cầu quyền sở hữu
4. Nếu chưa có: chọn "Thêm doanh nghiệp của bạn vào Google"
5. Điền thông tin:
   - Tên: Tiên Du Phụ Tùng Ô Tô
   - Danh mục: Auto Parts Store (Cửa hàng phụ tùng ô tô)
   - Địa chỉ: 37 Nguyễn Văn Hưởng, KDT VCN Phước Long, phường Nam Nha Trang, TP Nha Trang
   - SĐT: 0946.915.111
   - Website: https://ototiendu.com
   - Giờ làm việc: 7:30–17:30 (Thứ 2 – Thứ 7)
6. Xác nhận địa chỉ bằng bưu thư hoặc điện thoại (thường mất 5–7 ngày)
7. Sau khi xác nhận: đăng ảnh cửa hàng, ảnh sản phẩm, phản hồi đánh giá

**Tại sao quan trọng:** Google Business Profile ảnh hưởng trực tiếp đến hiển thị trên Google Maps và kết quả tìm kiếm địa phương — đặc biệt quan trọng với "phụ tùng ô tô Nha Trang".

### Google Search Console
1. Truy cập: https://search.google.com/search-console
2. Thêm property: `https://ototiendu.com`
3. Xác minh quyền sở hữu (bằng HTML tag hoặc DNS)
4. Submit sitemap: `https://ototiendu.com/sitemap.xml`
5. Theo dõi index coverage và Core Web Vitals hàng tuần

### Backlinks & Citations
- Đăng ký Foody, Zalo Official Account
- Tạo trang trên các thư mục doanh nghiệp địa phương (KhanhHoa.gov.vn, NhaTrang.biz...)
- Chia sẻ bài viết tin-tuc/ lên Facebook fanpage và Zalo OA

### Hình ảnh
- Thêm alt text mô tả đầy đủ cho tất cả ảnh sản phẩm thực
- Nén ảnh webp để cải thiện Core Web Vitals (dùng Squoosh hoặc TinyPNG)
