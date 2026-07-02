-- ============================================================
-- SEED DATA — ototiendu.com
-- Chạy file này SAU KHI đã chạy supabase_schema.sql
-- Toàn bộ 12 sản phẩm + 8 bài viết từ website hiện tại
-- ============================================================

-- ============================================================
-- PRODUCTS (12 sản phẩm)
-- ============================================================

insert into products (slug, name, brand_id, category_id, price, stock_status, stock_quantity, short_specs, thumbnail_url, is_featured, is_published)
values

-- 1. Bộ Lọc Không Khí Dòng Cao — Toyota — Động Cơ
(
  'loc-khong-khi-dong-cao',
  'Bộ Lọc Không Khí Dòng Cao',
  (select id from brands where slug = 'toyota'),
  (select id from categories where slug = 'dong-co'),
  185000,
  'in_stock', 50,
  array['Động cơ 2.0L – 2.5L', 'Tiêu chuẩn OEM', 'Lắp thẳng không cần chỉnh'],
  'assets/products/p01-loc-khong-khi.jpg',
  true, true
),

-- 2. Má Phanh Gốm Cao Cấp — Toyota — Phanh
(
  'ma-phanh-gom-cao-cap',
  'Má Phanh Gốm Cao Cấp',
  (select id from brands where slug = 'toyota'),
  (select id from categories where slug = 'phanh'),
  450000,
  'in_stock', 30,
  array['Phanh trước / sau', 'Độ bền cao gấp 3x', 'Không bụi, êm hơn má thường'],
  'assets/products/p02-ma-phanh.jpg',
  true, true
),

-- 3. Dầu Nhớt & Bộ Lọc Động Cơ — Honda — Động Cơ
(
  'dau-nhot-bo-loc-dong-co',
  'Dầu Nhớt & Bộ Lọc Động Cơ',
  (select id from brands where slug = 'honda'),
  (select id from categories where slug = 'dong-co'),
  320000,
  'in_stock', 40,
  array['5W-30 Full Synthetic', 'Thay sau 5.000 km', 'Combo dầu + lọc đồng bộ'],
  'assets/products/p03-dau-nhot.jpg',
  true, true
),

-- 4. Bugi Iridium — Toyota — Động Cơ
(
  'bugi-iridium',
  'Bugi Iridium',
  (select id from brands where slug = 'toyota'),
  (select id from categories where slug = 'dong-co'),
  275000,
  'in_stock', 60,
  array['Đầu điện cực Iridium', 'Tuổi thọ 100.000 km', 'Khởi động mạnh, tiết kiệm nhiên liệu'],
  'assets/products/p04-bugi.jpg',
  true, true
),

-- 5. Bộ Giảm Xóc Thể Thao — Mitsubishi — Treo
(
  'bo-giam-xoc-the-thao',
  'Bộ Giảm Xóc Thể Thao',
  (select id from brands where slug = 'mitsubishi'),
  (select id from categories where slug = 'treo'),
  1250000,
  'in_stock', 15,
  array['Hệ thống treo trước', 'Tải trọng 450 kg', 'Hấp thụ xóc tốt hơn 40%'],
  'assets/products/p06-giam-xoc.jpg',
  false, true
),

-- 6. Bộ Lọc Dầu Động Cơ — Honda — Bộ Phận Lọc
(
  'bo-loc-dau-dong-co',
  'Bộ Lọc Dầu Động Cơ',
  (select id from brands where slug = 'honda'),
  (select id from categories where slug = 'loc'),
  95000,
  'in_stock', 100,
  array['Áp suất 6-8 bar', 'Thay mỗi 5.000 km', 'Lọc cặn siêu mịn 20 micron'],
  'assets/products/p07-loc-dau.jpg',
  false, true
),

-- 7. Dây Curoa Truyền Động — Toyota — Động Cơ
(
  'day-curoa-truyen-dong',
  'Dây Curoa Truyền Động',
  (select id from brands where slug = 'toyota'),
  (select id from categories where slug = 'dong-co'),
  380000,
  'in_stock', 25,
  array['Bộ 3 dây đồng bộ', 'Chu kỳ 60.000 km', 'Cao su chịu nhiệt cao'],
  'assets/products/p08-day-curoa.jpg',
  false, true
),

-- 8. Cảm Biến Oxy Khí Thải — Mazda — Điện & Điện Tử
(
  'cam-bien-oxy-khi-thai',
  'Cảm Biến Oxy Khí Thải',
  (select id from brands where slug = 'mazda'),
  (select id from categories where slug = 'dien'),
  520000,
  'in_stock', 20,
  array['Tín hiệu 0–1V', 'Tiêu chuẩn Euro 4', 'Giảm tiêu hao nhiên liệu'],
  'assets/products/p09-cam-bien-oxy.jpg',
  false, true
),

-- 9. Bộ Lọc Nhiên Liệu Cao Cấp — Toyota — Bộ Phận Lọc
(
  'bo-loc-nhien-lieu-cao-cap',
  'Bộ Lọc Nhiên Liệu Cao Cấp',
  (select id from brands where slug = 'toyota'),
  (select id from categories where slug = 'loc'),
  145000,
  'in_stock', 45,
  array['Lọc cặn 10 micron', 'Thay 40.000 km', 'Bảo vệ kim phun nhiên liệu'],
  'assets/products/p10-loc-nhien-lieu.jpg',
  false, true
),

-- 10. Đèn Pha LED Cao Cấp — Ford — Điện & Điện Tử
(
  'den-pha-led-cao-cap',
  'Đèn Pha LED Cao Cấp',
  (select id from brands where slug = 'ford'),
  (select id from categories where slug = 'dien'),
  890000,
  'in_stock', 12,
  array['6000K Daylight', 'Tuổi thọ 50.000h', 'Tiêu thụ 30W thay 55W halogen'],
  'assets/products/p11-den-pha-led.jpg',
  false, true
),

-- 11. Bơm Nước Làm Mát — Mitsubishi — Động Cơ
(
  'bom-nuoc-lam-mat',
  'Bơm Nước Làm Mát',
  (select id from brands where slug = 'mitsubishi'),
  (select id from categories where slug = 'dong-co'),
  650000,
  'in_stock', 8,
  array['Lưu lượng 65 L/phút', 'Vật liệu hợp kim nhôm', 'Thay thế OEM chính xác'],
  'assets/products/p12-bom-nuoc.jpg',
  false, true
),

-- 12. Đĩa Phanh Thông Gió — Toyota — Phanh
(
  'dia-phanh-thong-gio',
  'Đĩa Phanh Thông Gió',
  (select id from brands where slug = 'toyota'),
  (select id from categories where slug = 'phanh'),
  780000,
  'in_stock', 18,
  array['Đường kính 300mm', 'Thông gió 2 chiều', 'Thép đúc chống gỉ'],
  'assets/products/p02-ma-phanh.jpg',
  false, true
);

-- ============================================================
-- POSTS (8 bài viết)
-- ============================================================

insert into posts (slug, title, excerpt, cover_image_url, post_category_id, is_published, published_at)
values

-- 1. Má phanh
(
  'dau-hieu-ma-phanh-can-thay',
  '5 Dấu Hiệu Nhận Biết Má Phanh Cần Thay — Đừng Chờ Đến Khi Nghe Tiếng Két',
  'Má phanh mòn gây tai nạn. Học cách nhận biết 5 dấu hiệu cần thay má phanh sớm để bảo vệ an toàn cho bạn và gia đình.',
  'assets/banners/banner1.jpg',
  (select id from post_categories where slug = 'phu-tung'),
  true,
  '2026-06-15 08:00:00+07'
),

-- 2. Dầu nhớt
(
  'chon-dau-nhot-5w30-hay-10w40',
  'Nên Chọn Dầu Nhớt 5W-30 Hay 10W-40 Cho Xe Ở Vùng Khí Hậu Nha Trang?',
  'Khí hậu nhiệt đới ảnh hưởng đến độ nhớt dầu động cơ. Hướng dẫn chọn đúng loại dầu nhớt 5W-30 hay 10W-40 cho từng dòng xe phổ biến tại Nha Trang.',
  'assets/banners/banner2.jpg',
  (select id from post_categories where slug = 'bao-duong'),
  true,
  '2026-06-10 08:00:00+07'
),

-- 3. Bugi
(
  'bugi-iridium-co-tot-hon-bugi-thuong',
  'Bugi Iridium Có Thực Sự Tốt Hơn Bugi Thường? So Sánh Thực Tế Từ Thợ Lành Nghề',
  'So sánh thực tế bugi Iridium và bugi thường từ thợ lành nghề. Liệu bugi đắt gấp 3–5 lần có thực sự đáng tiền?',
  'assets/banners/banner3.jpg',
  (select id from post_categories where slug = 'phu-tung'),
  true,
  '2026-06-05 08:00:00+07'
),

-- 4. Bảo dưỡng Fortuner
(
  'bao-duong-toyota-fortuner',
  'Chu Kỳ Bảo Dưỡng Định Kỳ Chuẩn Cho Toyota Fortuner — Bảng Kiểm Tra Đầy Đủ',
  'Bảng kiểm tra bảo dưỡng Toyota Fortuner từ 5.000 đến 100.000 km. Hướng dẫn chi tiết từng hạng mục để xe luôn trong trạng thái tốt nhất.',
  'assets/banners/banner4.jpg',
  (select id from post_categories where slug = 'bao-duong'),
  true,
  '2026-05-28 08:00:00+07'
),

-- 5. Giảm xóc
(
  'giam-xoc-hu-co-nguy-hiem-khong',
  'Giảm Xóc Mòn Ảnh Hưởng Thế Nào Đến An Toàn Và Hao Mòn Lốp Xe?',
  'Giảm xóc hỏng ảnh hưởng đến an toàn lái xe như thế nào? Hướng dẫn nhận biết dấu hiệu giảm xóc cần thay và cách kiểm tra đơn giản tại nhà.',
  'assets/banners/banner2.jpg',
  (select id from post_categories where slug = 'kinh-nghiem'),
  true,
  '2026-05-20 08:00:00+07'
),

-- 6. Phụ tùng chính hãng
(
  'phu-tung-chinh-hang-va-phu-tung-gia',
  'Phụ Tùng Chính Hãng vs Hàng Nhái: 7 Cách Phân Biệt Không Phải Ai Cũng Biết',
  'Phụ tùng giả tràn lan trên thị trường Việt Nam. Hướng dẫn 6 cách phân biệt phụ tùng chính hãng và phụ tùng nhái để bảo vệ xe và gia đình bạn.',
  'assets/banners/banner3.jpg',
  (select id from post_categories where slug = 'kinh-nghiem'),
  true,
  '2026-05-10 08:00:00+07'
),

-- 7. Đèn LED
(
  'den-pha-led-co-nen-do-den-halogen',
  'Đèn Pha LED Có Nên Đổi Từ Đèn Halogen? Phân Tích Ưu Nhược Điểm',
  'So sánh đèn pha LED và halogen về độ sáng, tuổi thọ và chi phí. Có nên nâng cấp đèn LED cho xe đang dùng đèn halogen?',
  'assets/banners/banner4.jpg',
  (select id from post_categories where slug = 'phu-tung'),
  true,
  '2026-04-25 08:00:00+07'
),

-- 8. Lọc không khí
(
  'loc-khong-khi-bau-nhieu-km-thi-thay',
  'Lọc Không Khí Ô Tô Bao Nhiêu Km Thì Thay? Dấu Hiệu Nhận Biết Khi Nào Cần Đổi',
  'Chu kỳ thay lọc không khí là bao lâu? Lọc gió bẩn ảnh hưởng gì đến động cơ và tiêu hao nhiên liệu? Hướng dẫn kiểm tra và thay lọc đúng thời điểm.',
  'assets/banners/banner1.jpg',
  (select id from post_categories where slug = 'bao-duong'),
  true,
  '2026-04-15 08:00:00+07'
);
