# Checklist xây dựng llms.txt cho Tiên Du (phụ tùng ô tô)

Rút ra từ phân tích cấu trúc llms.txt của AKIA Smart Home, điều chỉnh cho quy mô và đối tượng của Tiên Du.

## 1. Thông tin nền (Tổng quan doanh nghiệp)

- [ ] Một đoạn mở đầu 2-3 câu trả lời được: là ai, bán gì, ở đâu, phục vụ ai (sỉ/lẻ), điểm khác biệt là gì
- [ ] Tên cửa hàng, tên pháp lý (nếu có đăng ký kinh doanh), mã số kinh doanh
- [ ] Năm thành lập, địa chỉ cụ thể tại Nha Trang
- [ ] Hotline, giờ làm việc, Zalo OA, Facebook, TikTok
- [ ] Thị trường phục vụ: Nha Trang nội thành, Khánh Hòa, hay giao toàn quốc?

## 2. Định vị thương hiệu

- [ ] 2-3 điểm khác biệt cốt lõi (ví dụ: giá sỉ tốt, phụ tùng chính hãng, tư vấn kỹ thuật tận tâm, giao nhanh trong ngày)
- [ ] Cam kết cụ thể: bảo hành, đổi trả, nguồn gốc phụ tùng (chính hãng/OEM/aftermarket)
- [ ] Proof points định lượng nếu có: số năm hoạt động, số lượng khách hàng/garage đối tác, số đầu phụ tùng đang bán
- [ ] Được nhắc đến ở đâu (báo chí địa phương, hội nhóm garage...) — nếu chưa có thì bỏ qua, không bịa

## 3. Khách hàng mục tiêu (Personas)

Đây là phần AKIA làm rất kỹ — Tiên Du nên có ít nhất 2-3 nhóm rõ ràng, ví dụ:

- [ ] Thợ máy / chủ garage mua sỉ — quan tâm giá, chiết khấu, tốc độ giao, tồn kho ổn định
- [ ] Chủ xe cá nhân — quan tâm phụ tùng đúng đời xe, giá rõ ràng, không bị "thổi giá"
- [ ] Khách hàng B2B (taxi, vận tải, fleet) nếu có — quan tâm hợp đồng dài hạn, xuất hóa đơn VAT
- [ ] Mỗi persona ghi rõ: độ tuổi/nghề nghiệp, nỗi lo chính (pain point), kênh tìm kiếm (TikTok, Zalo, hỏi trực tiếp tại garage), hành vi mua

## 4. Danh mục ngành hàng / sản phẩm

- [ ] Liệt kê theo nhóm phụ tùng chính (dầu nhớt, lọc gió/lọc dầu, ắc quy, phụ tùng gầm, điện, nội ngoại thất...)
- [ ] Mỗi nhóm: số lượng SKU ước tính, thương hiệu nổi bật đang phân phối, link danh mục (nếu có website/landing)
- [ ] Pain point mỗi nhóm giải quyết (ví dụ: "giúp garage không phải gọi nhiều nơi mới đủ phụ tùng cho 1 ca sửa")
- [ ] Nếu có dịch vụ thi công/lắp đặt kèm theo (thay dầu, bảo dưỡng tại chỗ) — mô tả quy trình ngắn gọn

## 5. Thương hiệu phân phối

- [ ] Bảng thương hiệu đang bán kèm số lượng SP và link (nếu có) — giúp AI trả lời đúng khi khách hỏi "có bán hãng X không"
- [ ] Phân biệt chính hãng / OEM / hàng thay thế để AI không trả lời nhập nhằng về nguồn gốc

## 6. Chính sách khách hàng

- [ ] Bảo hành: thời gian, điều kiện
- [ ] Đổi trả: điều kiện, % hoàn tiền
- [ ] Giao hàng: nội thành Nha Trang giao trong bao lâu, ngoại tỉnh thế nào
- [ ] Thanh toán: COD, chuyển khoản, công nợ cho khách sỉ

## 7. Kênh bán hàng & nội dung

- [ ] Liệt kê đầy đủ kênh: website (nếu có), Zalo OA, Facebook, TikTok, Shopee (nếu bán online)
- [ ] Link tới các bài tư vấn/blog nếu có (mẹo bảo dưỡng, hướng dẫn chọn phụ tùng theo đời xe)

## 8. Chính sách sử dụng nội dung cho AI (quan trọng, dễ bị bỏ quên)

- [ ] Cho phép AI dùng nội dung để tóm tắt/tư vấn nhưng yêu cầu trích dẫn nguồn
- [ ] Không cho dùng dữ liệu giá để train model (giá thay đổi liên tục, AI dùng để train sẽ lỗi thời)
- [ ] Không cho crawl thông tin cá nhân khách hàng
- [ ] Ghi rõ "giá thay đổi theo thời gian thực — liên hệ hotline để có giá chính xác"

## 9. Kỹ thuật & vận hành

- [ ] Đặt file tại `tienduautoparts.com/llms.txt` (hoặc domain thực tế) — gốc domain, không nằm trong thư mục con
- [ ] Dùng Markdown thuần, không HTML phức tạp, để AI parse dễ
- [ ] Có dòng "Cập nhật lần cuối: [ngày]" ở đầu hoặc cuối file
- [ ] Review định kỳ (gợi ý: mỗi quý) để cập nhật số SKU, thương hiệu mới, chính sách thay đổi
- [ ] Đối chiếu lại với nội dung thật trên các kênh (Zalo OA, Facebook) để không có thông tin sai/lỗi thời — vì đây là tự khai, không có bên thứ ba kiểm chứng

## 10. Cấu hình robots.txt song song với llms.txt

`llms.txt` chỉ là một file thông tin — nó không có quyền kiểm soát crawler. Quyền chặn/cho phép bot thực sự nằm ở `robots.txt`. AKIA cấu hình hai file này khớp với nhau (đã kiểm tra thực tế trên akia.vn): `llms.txt` nói "không dùng giá để train", còn `robots.txt` chặn thẳng các bot training tương ứng. Tiên Du nên làm tương tự:

- [ ] Khai báo `Content-Signal` ở đầu `robots.txt` (chuẩn mới, được Cloudflare và nhiều site lớn dùng):
      `Content-Signal: search=yes, ai-train=no` — cho phép search index nhưng cấm dùng nội dung để train model
- [ ] Chặn riêng từng bot training AI: `GPTBot`, `Google-Extended`, `CCBot`, `Bytespider`, `ClaudeBot`, `Applebot-Extended`, `meta-externalagent`, `anthropic-ai` — set `Disallow: /` cho nhóm này nếu không muốn nội dung bị dùng để train
- [ ] Mở riêng (Allow) cho bot trả lời/tra cứu theo thời gian thực: `ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot` — đây là các bot phục vụ người dùng hỏi trực tiếp (ví dụ khách hỏi ChatGPT "mua lọc dầu xe X ở Nha Trang chỗ nào"), khác với bot crawl để train model
- [ ] Đảm bảo logic nhất quán: nếu `llms.txt` ghi "AI được dùng nội dung để tư vấn nhưng phải trích dẫn nguồn", thì `robots.txt` phải mở cho đúng các bot dùng để "trả lời" (ai-input) và chặn đúng các bot "huấn luyện" (ai-train) — tránh tình trạng nói một đằng, chặn một nẻo
- [ ] Khai báo `Sitemap:` trong `robots.txt` như bình thường (không liên quan tới `llms.txt`, nhưng nên có để AI/search engine tìm trang dễ hơn)
- [ ] Lưu ý: vì Tiên Du quy mô nhỏ, ưu tiên cho phép các bot trả lời (Perplexity, ChatGPT-User, OAI-SearchBot) vì đây là cách khách hàng mới có thể tìm thấy cửa hàng qua AI search — chỉ cân nhắc chặn `ai-train` nếu lo ngại nội dung/giá bị dùng huấn luyện model mà không được trích dẫn

## Khác biệt cần lưu ý so với AKIA (để không copy máy móc)

- AKIA là chain lớn với showroom + thi công trọn gói; Tiên Du nên nhấn vào lợi thế địa phương (quen mặt khách, phản hồi nhanh, hiểu rõ dòng xe phổ biến ở Nha Trang) thay vì cố gắng liệt kê quy mô lớn không có thật
- Không cần 6 persona như AKIA nếu thực tế chỉ có 2-3 nhóm khách rõ ràng — thà ít mà chính xác còn hơn nhiều mà gượng
- Phần "proof points" chỉ nên ghi số liệu có thật, kiểm chứng được — AI và người đọc đều dễ phát hiện số liệu phóng đại
