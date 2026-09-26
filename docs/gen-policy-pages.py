# Sinh 5 trang chính sách theo chinh-sach-v2-theo-luat-moi.md
# Các chỗ 【 】 chưa có dữ liệu: để None -> dòng tương ứng bị ẩn. Điền giá trị rồi chạy lại.
import re

FILL = {
    'gcn_dkdn': None,        # 'Số ..., cấp ngày ..., nơi cấp ...'
    'dau_moi': None,         # họ tên nhân viên đầu mối khiếu nại
    'freeship': None,        # ví dụ '1.000.000 VNĐ'
    'stk': None,             # số tài khoản
    'ngan_hang': None,       # tên ngân hàng — chi nhánh
    'coc_pct': None,         # mức đặt cọc %, ví dụ '30'
    'khau_tru_pct': None,    # % khấu trừ tiền cọc khi khách hủy hàng đặt riêng
    'don_vi_vc': None,       # 'Viettel Post, J&T Express, nhà xe'
    'ton_kho': None,         # 'mỗi ngày làm việc'
    'bh_ngay': None,         # thời hạn xử lý bảo hành (số ngày làm việc)
    'hieu_luc': None,        # ngày hiệu lực, ví dụ '01/10/2026'
    # --- Chính sách bảo mật ---
    'dpo': None,             # bộ phận/người phụ trách bảo vệ DLCN: 'họ tên, chức danh'
    'log_ttl': None,         # thời hạn lưu nhật ký truy cập, ví dụ '12 tháng'
    'hosting': None,         # tên nhà cung cấp lưu trữ website, ví dụ 'Vercel Inc.'
    'server_country': None,  # quốc gia đặt máy chủ
    'dia_phuong_an': None,   # 'A' (doanh nghiệp nhỏ, miễn lập hồ sơ ĐGTĐ) hoặc 'B' (đã lập và gửi hồ sơ)
}
UPDATED = '25/09/2026'

tpl = open('gioi-thieu.html', encoding='utf-8').read()
head = tpl[:tpl.index('<!-- ============ OUR STORY')]
foot = tpl[tpl.index('<!-- ============ FOOTER'):]
head = head.replace('<a class="nav-link active" href="gioi-thieu.html">', '<a class="nav-link" href="gioi-thieu.html">')

POLICIES = [
    ('chinh-sach-gia.html', 'Chính sách giá niêm yết'),
    ('chinh-sach-khieu-nai.html', 'Chính sách khiếu nại'),
    ('chinh-sach-thanh-toan.html', 'Chính sách thanh toán'),
    ('dieu-kien-cung-cap.html', 'Phạm vi cung cấp'),
    ('quyen-va-nghia-vu.html', 'Quyền và nghĩa vụ các bên'),
    ('chinh-sach-doi-tra.html', 'Chính sách đổi trả'),
    ('chinh-sach-bao-mat.html', 'Chính sách bảo mật'),
]

STORE = '37 Nguyễn Văn Hưởng, KĐT VCN Phước Long, phường Nam Nha Trang'
HQ = '64 Hương lộ 5, Thôn Trung 2, xã Diên Điền, tỉnh Khánh Hòa'
HOURS = '7:30–17:30, Thứ 2 – Thứ 7'
TL2 = '<a href="chinh-sach-khieu-nai.html">Tài liệu 2</a>'
TL5_7 = '<a href="dieu-kien-cung-cap.html#tu-choi">Tài liệu 5 mục 7</a>'

def opt(key, html):
    return html.format(v=FILL[key]) if FILL[key] else ''

# Khối thông tin chung (đầu mỗi tài liệu)
INFO = f'''<div class="policy-info">
  <p class="policy-info-name">CÔNG TY TNHH ĐẦU TƯ TIÊN DU</p>
  <p>Mã số thuế: 4200889908</p>
  {opt('gcn_dkdn', '<p>Giấy chứng nhận ĐKDN: {v}</p>')}
  <p>Website: ototiendu.com · Điện thoại: <a href="tel:0946915111">0946.915.111</a> · Email: <a href="mailto:tienduoto@gmail.com">tienduoto@gmail.com</a></p>
</div>'''

PAGES = {}

# ---------------------------------------------------------------- TL2
PAGES['chinh-sach-khieu-nai.html'] = dict(
title='Phương Thức Tiếp Nhận Và Giải Quyết Khiếu Nại',
desc='Phương thức tiếp nhận và giải quyết phản ánh, yêu cầu, khiếu nại của Công ty TNHH Đầu tư Tiên Du: kênh tiếp nhận, quy trình, thời hạn xử lý theo từng loại vấn đề.',
sub='Phương thức tiếp nhận và giải quyết phản ánh, yêu cầu, khiếu nại của khách hàng',
body=f'''
<h2>1. Đơn vị tiếp nhận</h2>
{INFO}
{opt('dau_moi', '<p>Đầu mối phụ trách: <strong>{v}</strong> — <a href="tel:0946915111">0946.915.111</a></p>')}

<h2>2. Kênh tiếp nhận</h2>
<table class="policy-table">
  <thead><tr><th>Kênh</th><th>Thông tin</th><th>Thời gian hoạt động</th></tr></thead>
  <tbody>
    <tr><td>Điện thoại</td><td><a href="tel:0946915111">0946.915.111</a></td><td>{HOURS}</td></tr>
    <tr><td>Zalo</td><td><a href="https://zalo.me/0946915111" target="_blank" rel="noopener">tiendu.nhatrang</a></td><td>Nhận 24/7</td></tr>
    <tr><td>Email</td><td><a href="mailto:tienduoto@gmail.com">tienduoto@gmail.com</a></td><td>Nhận 24/7</td></tr>
    <tr><td>Trực tiếp</td><td>{STORE}</td><td>{HOURS}</td></tr>
  </tbody>
</table>
<p>Phản ánh gửi ngoài giờ làm việc, Chủ nhật hoặc ngày lễ được tính là tiếp nhận vào ngày làm việc kế tiếp.</p>
<p><strong>Công cụ hỗ trợ:</strong> khách có thể gửi ảnh, video qua Zalo hoặc email. Với khách ở xa, Tiên Du hỗ trợ kiểm tra sản phẩm qua video call để xác định lỗi trước khi gửi hàng về.</p>

<h2>3. Thông tin khách hàng cần cung cấp</h2>
<ul>
  <li>Mã đơn hàng (dạng TD-YYMMDD-XXXX) hoặc số hóa đơn</li>
  <li>Họ tên và số điện thoại đã dùng khi đặt hàng</li>
  <li>Mô tả nội dung phản ánh</li>
  <li>Ảnh hoặc video sản phẩm và bao bì, nếu phản ánh về chất lượng hoặc giao sai hàng</li>
</ul>
<p>Khách không còn hóa đơn vẫn được tiếp nhận, nếu chứng minh được giao dịch bằng cách khác: tin nhắn Zalo, sao kê chuyển khoản, biên lai vận chuyển, hoặc dữ liệu đơn hàng Tiên Du đang lưu.</p>

<h2>4. Quy trình và thời hạn</h2>
<p><strong>Bước 1 — Tiếp nhận.</strong> Tiên Du xác nhận đã nhận phản ánh trong vòng <strong>01 ngày làm việc</strong>, qua điện thoại hoặc Zalo.</p>
<p><strong>Bước 2 — Xác minh.</strong> Kiểm tra đơn hàng, chứng từ giao nhận và tình trạng sản phẩm.</p>
<p><strong>Bước 3 — Phản hồi kết quả.</strong> Thông báo hướng xử lý qua điện thoại, gửi văn bản qua email nếu khách yêu cầu.</p>
<p><strong>Bước 4 — Thực hiện.</strong> Đổi hàng, trả hàng hoàn tiền, bảo hành, hoặc giải thích lý do không chấp nhận.</p>

<h3>Thời hạn theo từng loại vấn đề</h3>
<table class="policy-table">
  <thead><tr><th>Loại vấn đề</th><th>Phản hồi ban đầu</th><th>Giải quyết dự kiến</th></tr></thead>
  <tbody>
    <tr><td>Giao sai mã, thiếu hàng, vỡ hỏng khi nhận</td><td>01 ngày làm việc</td><td>03 ngày làm việc</td></tr>
    <tr><td>Lỗi chất lượng, yêu cầu bảo hành</td><td>01 ngày làm việc</td><td>07 ngày làm việc</td></tr>
    <tr><td>Khiếu nại về giá, phí vận chuyển, hóa đơn</td><td>01 ngày làm việc</td><td>03 ngày làm việc</td></tr>
    <tr><td>Yêu cầu về dữ liệu cá nhân</td><td>01 ngày làm việc</td><td>72 giờ</td></tr>
    <tr><td>Hoàn tiền</td><td>—</td><td>07 ngày làm việc kể từ khi hai bên thống nhất</td></tr>
  </tbody>
</table>
<p>Với lỗi chất lượng cần nhà sản xuất kiểm định, thời gian kiểm định không tính vào thời hạn trên. Tiên Du thông báo cho khách khi phát sinh trường hợp này.</p>
<p><strong>Ưu tiên tiếp nhận và giải quyết trước:</strong> khách hàng là người cao tuổi, người khuyết tật, phụ nữ mang thai; và mọi phản ánh liên quan đến bộ phận ảnh hưởng an toàn vận hành xe (phanh, lái, treo, lốp).</p>

<h2>5. Trường hợp không đạt thỏa thuận</h2>
<p>Hai bên thương lượng trên tinh thần thiện chí. Nếu không đạt kết quả, khách hàng có quyền lựa chọn các phương thức giải quyết tranh chấp theo quy định pháp luật, bao gồm thương lượng, hòa giải, trọng tài thương mại (nếu hai bên thỏa thuận) hoặc khởi kiện tại tòa án có thẩm quyền.</p>
<p>Tiên Du cam kết hợp tác cung cấp đầy đủ chứng từ giao dịch khi được yêu cầu hợp pháp.</p>

<h2>6. Lưu trữ</h2>
<p>Hồ sơ phản ánh, khiếu nại và dữ liệu liên quan đến hợp đồng được lưu trữ <strong>tối thiểu 03 năm</strong> kể từ thời điểm giao kết hợp đồng. Dữ liệu về hàng hóa được lưu tối thiểu 01 năm.</p>
<p>Hóa đơn và chứng từ kế toán lưu theo thời hạn của pháp luật kế toán. Việc xử lý dữ liệu cá nhân trong hồ sơ khiếu nại thực hiện theo Chính sách bảo mật.</p>
''')

# ---------------------------------------------------------------- TL3
PAGES['chinh-sach-gia.html'] = dict(
title='Chính Sách Giá',
desc='Chính sách giá của Công ty TNHH Đầu tư Tiên Du: giá niêm yết bằng VNĐ đã gồm VAT, phí vận chuyển, giá sỉ, thời điểm chốt giá, khuyến mãi, sai sót về giá và hóa đơn.',
sub='Nguyên tắc niêm yết giá, phí vận chuyển, giá sỉ và thời điểm chốt giá',
body=f'''
{INFO}

<h2>1. Nguyên tắc niêm yết</h2>
<p>Giá hiển thị trên ototiendu.com là giá bán lẻ bằng Đồng Việt Nam (VNĐ), <strong>đã bao gồm thuế giá trị gia tăng theo thuế suất hiện hành</strong>.</p>
<p>Giá niêm yết chỉ bao gồm các thành phần được liệt kê trong mô tả sản phẩm. Chưa bao gồm:</p>
<ul>
  <li>Phí vận chuyển</li>
  <li>Chi phí lắp đặt, thay thế tại garage</li>
  <li>Phụ kiện, vật tư đi kèm không nêu trong mô tả</li>
</ul>

<h2>2. Phí vận chuyển</h2>
<p>Phí vận chuyển dự kiến theo khu vực và nhóm hàng được công bố tại <strong>Bảng phí vận chuyển</strong> và <strong>hiển thị tại bước gửi đơn hàng</strong>, trước khi khách bấm gửi.</p>
<p>Nếu phí chính thức khác phí dự kiến, Tiên Du thông báo khi xác nhận đơn và gửi bằng tin nhắn Zalo, SMS hoặc email, kèm tổng số tiền phải thanh toán. Khách có quyền hủy đơn, không mất phí, không phải nêu lý do.</p>
{opt('freeship', '<p>Miễn phí giao hàng khu vực Nha Trang cũ (các phường Bắc Nha Trang, Nha Trang, Tây Nha Trang, Nam Nha Trang) cho đơn từ {v} trở lên.</p>')}

<h2>3. Giá bán sỉ</h2>
<p>Garage, đại lý và khách mua số lượng lớn được áp dụng bảng giá sỉ riêng, chiết khấu <strong>8–25%</strong> tùy nhóm hàng và bậc doanh số lũy kế.</p>
<p>Nguyên tắc chiết khấu và điều kiện áp dụng được công bố tại <a href="gia-si.html"><strong>Chính sách giá sỉ</strong></a>. Giá sỉ cụ thể cho từng mã hàng được báo trực tiếp qua <a href="tel:0946915111">0946.915.111</a>.</p>
<p>Chiết khấu thương mại được thể hiện đúng trên hóa đơn theo quy định pháp luật về hóa đơn.</p>

<h2>4. Thay đổi giá và thời điểm chốt giá</h2>
<p>Giá niêm yết trên website được cập nhật ngay khi có thay đổi.</p>
<p><strong>Hợp đồng được giao kết khi Tiên Du xác nhận đơn</strong> và gửi thông báo xác nhận ghi rõ giá hàng, phí vận chuyển và tổng số tiền.</p>
<p>Giá áp dụng cho đơn hàng là giá đang niêm yết trên ototiendu.com tại thời điểm xác nhận, và <strong>không cao hơn giá niêm yết tại thời điểm đó</strong>.</p>
<p>Nếu giá này cao hơn giá khách đã thấy khi gửi đơn, Tiên Du thông báo rõ mức chênh lệch. Khách có quyền hủy đơn không mất phí và được hoàn 100% số tiền đã thanh toán, bao gồm cả tiền đặt cọc.</p>
<p><strong>Sau khi đơn đã được xác nhận, Tiên Du không thay đổi giá hoặc phí của đơn hàng đó.</strong></p>

<h2>5. Khuyến mãi</h2>
<p>Chương trình khuyến mãi ghi rõ hình thức áp dụng, thời hạn bắt đầu và kết thúc. Thông tin này được hiển thị trước khi khách đặt hàng.</p>
<p>Mỗi đơn hàng áp dụng một chương trình, trừ khi có thông báo khác.</p>

<h2>6. Sai sót về giá</h2>
<p>Trường hợp giá hiển thị <strong>thấp hơn giá bán thông thường từ 30% trở lên</strong> do lỗi kỹ thuật hoặc lỗi nhập liệu, Tiên Du liên hệ khách thông báo giá đúng. Khách có quyền hủy đơn không mất phí.</p>
<p>Quy định này <strong>chỉ áp dụng trước khi đơn được xác nhận</strong>.</p>

<h2>7. Hóa đơn</h2>
<p>Tiên Du lập <strong>hóa đơn điện tử giá trị gia tăng</strong> cho mỗi lần bán hàng, kể cả khi khách không yêu cầu.</p>
<p>Khách cần hóa đơn ghi tên đơn vị vui lòng cung cấp tên, mã số thuế và địa chỉ khi xác nhận đơn. Hóa đơn được gửi qua email hoặc Zalo, dùng làm căn cứ đổi trả và bảo hành.</p>
''')

# ---------------------------------------------------------------- TL4
bank_rows = opt('stk', '<tr><td>Số tài khoản</td><td><strong>{v}</strong></td></tr>') + opt('ngan_hang', '<tr><td>Ngân hàng</td><td>{v}</td></tr>')
khau_tru = (f'khấu trừ {FILL["khau_tru_pct"]}% tiền cọc, phần còn lại hoàn trả'
            if FILL['khau_tru_pct'] else 'khấu trừ một phần tiền cọc theo mức đã thỏa thuận khi đặt cọc, phần còn lại hoàn trả')
PAGES['chinh-sach-thanh-toan.html'] = dict(
title='Chính Sách Thanh Toán',
desc='Chính sách thanh toán của Công ty TNHH Đầu tư Tiên Du: COD dưới 5 triệu, chuyển khoản vào tài khoản công ty, thanh toán tại cửa hàng, đặt cọc và hoàn tiền.',
sub='Thanh toán khi nhận hàng, chuyển khoản ngân hàng hoặc tại cửa hàng',
body=f'''
{INFO}

<h2>1. Các phương thức được chấp nhận</h2>

<h3>1.1 Thanh toán khi nhận hàng (COD)</h3>
<p>Khách trả tiền mặt cho nhân viên giao hàng hoặc đơn vị vận chuyển khi nhận kiện hàng.</p>
<ul>
  <li>Áp dụng cho đơn hàng <strong>dưới 5.000.000 VNĐ</strong></li>
  <li>Áp dụng tại các khu vực đơn vị vận chuyển có hỗ trợ thu hộ</li>
  <li>Số tiền phải trả bằng giá trị đơn hàng cộng phí vận chuyển đã được thông báo và khách đã đồng ý trước đó</li>
</ul>
<p>Đơn từ 5.000.000 VNĐ trở lên, hoặc hàng đặt riêng theo yêu cầu, áp dụng đặt cọc hoặc chuyển khoản trước.</p>

<h3>1.2 Chuyển khoản ngân hàng</h3>
<table class="policy-table">
  <tbody>
    <tr><td>Chủ tài khoản</td><td><strong>CÔNG TY TNHH ĐẦU TƯ TIÊN DU</strong></td></tr>
    {bank_rows}
    <tr><td>Nội dung chuyển khoản</td><td>Mã đơn hàng + số điện thoại đặt hàng</td></tr>
  </tbody>
</table>
<p>Quy trình:</p>
<ol>
  <li>Khách đặt hàng trên website, nhận mã đơn dạng TD-YYMMDD-XXXX</li>
  <li>Tiên Du xác nhận đơn, chốt giá và phí vận chuyển, gửi thông báo xác nhận</li>
  <li>Khách chuyển khoản đúng số tiền đã chốt, ghi mã đơn trong nội dung</li>
  <li>Tiên Du xác nhận đã nhận tiền và gửi hàng</li>
</ol>
<p>Thời điểm ghi nhận thanh toán là thời điểm tiền vào tài khoản của công ty. Chuyển khoản trước 14:00 ngày làm việc, hàng được gửi đi trong ngày.</p>
<p><strong>Chuyển thừa:</strong> Tiên Du hoàn lại phần chênh lệch trong 03 ngày làm việc. <strong>Chuyển thiếu:</strong> Tiên Du thông báo để khách bổ sung; đơn được giữ 03 ngày làm việc chờ bổ sung.</p>
<div class="article-tip">
  <div class="article-tip-title">Cảnh báo</div>
  Tiên Du chỉ nhận chuyển khoản vào tài khoản mang tên công ty ghi trên. Công ty không bao giờ yêu cầu khách chuyển vào tài khoản cá nhân. Nếu nhận được yêu cầu như vậy, khách vui lòng gọi <a href="tel:0946915111">0946.915.111</a> để xác minh trước khi chuyển tiền.
</div>

<h3>1.3 Thanh toán tại cửa hàng</h3>
<p>Khách đến nhận hàng và thanh toán tại {STORE}, trong giờ 7:30–17:30 Thứ 2 đến Thứ 7. Nhận tiền mặt hoặc chuyển khoản tại chỗ.</p>
<p>Tiên Du thông báo qua điện thoại hoặc Zalo khi hàng sẵn sàng. Hàng được giữ <strong>03 ngày làm việc</strong> kể từ thông báo; quá thời hạn mà khách không liên hệ, đơn tự động hủy.</p>
<p>Nếu khách đã thanh toán hoặc đặt cọc, việc hủy đơn kèm hoàn tiền theo <a href="#hoan-tien">mục 4</a>.</p>

<h2>2. Đặt cọc</h2>
<p>Áp dụng cho đơn từ 5.000.000 VNĐ và hàng đặt riêng theo yêu cầu.</p>
{opt('coc_pct', '<p>Mức đặt cọc: <strong>{v}%</strong> giá trị đơn hàng.</p>')}
<ul>
  <li>Nếu <strong>Tiên Du không thực hiện được đơn</strong> (hết hàng, giá tăng mà khách không đồng ý, bất khả kháng): hoàn trả toàn bộ tiền cọc.</li>
  <li>Nếu <strong>Tiên Du đơn phương hủy đơn</strong> không vì các lý do trên: hoàn trả tiền cọc và một khoản tiền tương đương, theo Điều 328 Bộ luật Dân sự.</li>
  <li>Nếu <strong>khách hủy đơn hàng đặt riêng</strong> sau khi Tiên Du đã đặt hàng với nhà cung cấp: {khau_tru}. Mức khấu trừ không vượt quá số tiền cọc.</li>
</ul>

<h2>3. Đồng tiền và cổng thanh toán</h2>
<p>Mọi giao dịch thực hiện bằng Đồng Việt Nam (VNĐ).</p>
<p>Website ototiendu.com <strong>không tích hợp cổng thanh toán trực tuyến</strong>, không thu thập và không lưu trữ thông tin thẻ ngân hàng, tài khoản ngân hàng hay ví điện tử của khách hàng. Toàn bộ việc thanh toán diễn ra ngoài website.</p>

<h2 id="hoan-tien">4. Hoàn tiền</h2>
<p>Áp dụng khi hàng được trả lại hợp lệ theo Chính sách đổi trả, hoặc khi đơn hàng bị hủy sau khi khách đã thanh toán hoặc đặt cọc.</p>
<ul>
  <li>Hoàn về tài khoản ngân hàng khách đã dùng để chuyển khoản, hoặc tài khoản do khách chỉ định</li>
  <li>Trường hợp đã thanh toán COD: hoàn bằng chuyển khoản theo tài khoản khách cung cấp</li>
  <li>Thời hạn: <strong>07 ngày làm việc</strong> kể từ ngày hai bên thống nhất việc hoàn tiền</li>
  <li><strong>Tiên Du chịu toàn bộ phí chuyển khoản hoàn tiền trong mọi trường hợp</strong>, trừ khi khách yêu cầu hoàn về tài khoản ở nước ngoài hoặc theo phương thức phát sinh phí đặc biệt do khách lựa chọn</li>
</ul>

<h2>5. Hóa đơn</h2>
<p>Tiên Du lập hóa đơn điện tử giá trị gia tăng cho mỗi lần bán hàng, gửi qua email hoặc Zalo. Khách giữ hóa đơn làm căn cứ đổi trả và bảo hành.</p>
''')

# ---------------------------------------------------------------- TL5
PAGES['dieu-kien-cung-cap.html'] = dict(
title='Điều Kiện Và Hạn Chế Cung Cấp Hàng Hóa',
desc='Điều kiện và hạn chế trong việc cung cấp hàng hóa của Công ty TNHH Đầu tư Tiên Du: phạm vi hàng hóa, giao hàng, kiểm hàng, tồn kho, quyền từ chối đơn và bảo hành.',
sub='Điều kiện và hạn chế trong việc cung cấp hàng hóa',
body=f'''
{INFO}

<h2>1. Phạm vi hàng hóa</h2>
<p>Tiên Du kinh doanh phụ tùng, linh kiện và vật tư bảo dưỡng ô tô: hệ thống phanh, hệ thống treo và lái, phụ tùng động cơ, hệ thống điện và điện tử, bộ phận lọc, lốp và la-zăng, thân vỏ và nội thất.</p>
<p>Tiên Du không kinh doanh hàng hóa thuộc danh mục cấm kinh doanh và không kinh doanh ngành, nghề đầu tư kinh doanh có điều kiện.</p>
<p>Hàng hóa thuộc diện phải chứng nhận, công bố hợp quy — như <strong>lốp hơi ô tô theo QCVN 34:2024/BGTVT</strong> — chỉ được bán khi có chứng nhận chất lượng hoặc tem, nhãn hợp quy hợp lệ. Thông tin chất lượng và nhãn hàng hóa được công khai trên từng trang sản phẩm.</p>

<h2>2. Điều kiện với người đặt hàng</h2>
<p>Người đặt hàng phải <strong>từ đủ 18 tuổi</strong> và có đầy đủ năng lực hành vi dân sự.</p>
<p>Người từ đủ 15 tuổi đến dưới 18 tuổi được đặt hàng khi có sự đồng ý của cha, mẹ hoặc người giám hộ. Tiên Du có thể đề nghị xác nhận điều này trong cuộc gọi xác nhận đơn.</p>

<h2>3. Giao hàng</h2>
<h3>3.1 Phạm vi và đơn vị vận chuyển</h3>
<p>Giao hàng trên toàn lãnh thổ Việt Nam. <strong>Không giao hàng ra nước ngoài.</strong></p>
<p>{opt('don_vi_vc', 'Đơn vị vận chuyển: {v}. ')}Với khu vực nội thành, Tiên Du có thể tự giao.</p>

<h3>3.2 Thời gian dự kiến</h3>
<table class="policy-table">
  <thead><tr><th>Khu vực</th><th>Thời gian</th></tr></thead>
  <tbody>
    <tr><td>Nội thành Nha Trang</td><td>Trong ngày, nếu đơn được xác nhận trước 14:00</td></tr>
    <tr><td>Các tỉnh lân cận</td><td>1–2 ngày làm việc</td></tr>
    <tr><td>Toàn quốc</td><td>2–4 ngày làm việc</td></tr>
  </tbody>
</table>
<p>Tính từ khi đơn được xác nhận, không tính ngày nghỉ và ngày lễ. Đây là thời gian dự kiến, phụ thuộc lịch trình của đơn vị vận chuyển.</p>
<p>Một số khu vực hải đảo, vùng sâu vùng xa có thể phát sinh thêm thời gian và phí. Tiên Du thông báo cụ thể khi xác nhận đơn.</p>

<h3>3.3 Thông tin hành trình đơn hàng</h3>
<p>Tiên Du cung cấp mã vận đơn cho khách qua Zalo, SMS hoặc email ngay khi hàng được gửi đi, để khách tự tra cứu hành trình trên hệ thống của đơn vị vận chuyển. Khách cũng có thể gọi <a href="tel:0946915111">0946.915.111</a> để được hỗ trợ tra cứu.</p>

<h3>3.4 Chính sách kiểm hàng</h3>
<p>Khi nhận hàng, khách được kiểm tra tình trạng bên ngoài kiện hàng và đối chiếu mã vận đơn, số kiện trước khi thanh toán. Với hàng giao trực tiếp bởi nhân viên Tiên Du, khách được mở kiện kiểm tra mã hàng và số lượng dưới sự chứng kiến của nhân viên.</p>
<p><strong>Việc kiểm tra này không làm mất quyền của khách</strong> được khiếu nại, đổi trả khi phát hiện hàng giao sai, thiếu, hư hỏng, không đúng mô tả hoặc có khuyết tật, theo Chính sách đổi trả và quy định pháp luật.</p>

<h3>3.5 Rủi ro trong vận chuyển</h3>
<p>Rủi ro về hư hỏng, mất mát hàng hóa trong quá trình vận chuyển thuộc về Tiên Du cho đến khi khách nhận hàng. Khách phát hiện kiện hàng bị móp, rách, ướt khi nhận, vui lòng chụp ảnh và báo Tiên Du trong 24 giờ.</p>

<h2>4. Hạn chế theo loại hàng</h2>
<ul>
  <li><strong>Hàng cồng kềnh</strong> (lốp, la-zăng, thân vỏ): phí vận chuyển tính theo kích thước thực tế, có thể không giao được tới một số khu vực.</li>
  <li><strong>Hàng dễ vỡ, dễ biến dạng</strong> (đèn, kính, chi tiết nhựa): Tiên Du khuyến nghị khách quay video khi mở kiện hàng. Đây là khuyến nghị nhằm xử lý nhanh hơn, <strong>không phải điều kiện bắt buộc</strong> để được khiếu nại.</li>
  <li><strong>Hàng đặt riêng theo yêu cầu</strong>, không có sẵn trong kho: yêu cầu đặt cọc, thời gian chờ 7–20 ngày tùy nguồn hàng. Hàng đặt riêng không áp dụng đổi trả vì lý do thay đổi nhu cầu. Vẫn được đổi trả trong các trường hợp: hàng có khuyết tật hoặc lỗi nhà sản xuất; giao sai mã; hàng không đúng mô tả hoặc cam kết; hư hỏng do vận chuyển.</li>
</ul>

<h2>5. Trách nhiệm chọn đúng phụ tùng</h2>
<p>Một mã phụ tùng có thể phù hợp nhiều dòng xe, hoặc chỉ phù hợp một số đời xe trong cùng dòng.</p>
<p>Khách hàng có trách nhiệm cung cấp đúng thông tin xe: hãng, dòng, năm sản xuất, và số VIN nếu có. Tiên Du hỗ trợ tra cứu miễn phí qua điện thoại hoặc Zalo trước khi khách đặt hàng.</p>
<p>Nếu khách tự chọn mã hàng mà không có sự tư vấn kỹ thuật của Tiên Du, và sản phẩm không tương thích với xe, khách được đổi trả theo chính sách thông thường với điều kiện sản phẩm chưa lắp đặt, còn nguyên tem và bao bì. Trong trường hợp này, sản phẩm đã lắp đặt không được đổi trả vì lý do không tương thích.</p>
<p><strong>Quy định trên không áp dụng khi:</strong></p>
<ul>
  <li>Sản phẩm có khuyết tật hoặc lỗi của nhà sản xuất</li>
  <li>Thông tin tương thích công bố trên website sai</li>
  <li>Tiên Du đã tư vấn mã hàng dựa trên thông tin xe do khách cung cấp đúng</li>
  <li>Hàng giao không đúng mã đã xác nhận</li>
</ul>
<p>Trong các trường hợp này, khách được đổi trả hoặc hoàn tiền kể cả khi sản phẩm đã lắp đặt.</p>

<h2>6. Tồn kho</h2>
<p>Trạng thái "Còn hàng" trên website được cập nhật {FILL['ton_kho'] or 'định kỳ'} và có thể không phản ánh đúng tồn kho tại mọi thời điểm.</p>
<p>Nếu sản phẩm đã hết khi Tiên Du xử lý đơn, nhân viên thông báo trong cuộc gọi xác nhận và đề xuất: chờ hàng về, đổi sang mã tương đương, hoặc hủy đơn. Khách đã thanh toán được hoàn tiền đầy đủ theo <a href="chinh-sach-thanh-toan.html">Chính sách thanh toán</a>.</p>

<h2 id="tu-choi">7. Quyền từ chối, hủy đơn hàng</h2>
<p>Tiên Du có quyền từ chối hoặc hủy đơn trong các trường hợp:</p>
<ul>
  <li>Không liên lạc được với khách sau 03 lần gọi trong 02 ngày làm việc</li>
  <li>Sản phẩm hết hàng</li>
  <li>Có căn cứ xác định đơn hàng giả mạo hoặc sử dụng thông tin của người khác</li>
  <li>Khách đã từ chối nhận hàng COD từ 02 lần trở lên trong 06 tháng mà không có lý do chính đáng — với khách này, Tiên Du có thể chỉ nhận đơn thanh toán trước</li>
  <li>Sự kiện bất khả kháng: thiên tai, dịch bệnh, gián đoạn vận chuyển</li>
</ul>
<p>Tiên Du thông báo lý do từ chối hoặc hủy đơn cho khách qua điện thoại hoặc tin nhắn. Trường hợp khách đã thanh toán, Tiên Du hoàn tiền đầy đủ trong 07 ngày làm việc.</p>
<p>Việc lưu lịch sử giao dịch phục vụ mục đích này được nêu tại Chính sách bảo mật.</p>

<h2 id="bao-hanh">8. Bảo hành</h2>
<p>Thời hạn và điều kiện bảo hành theo nhà sản xuất được ghi trên trang sản phẩm, hóa đơn hoặc phiếu bảo hành.</p>
<p><strong>Tiên Du là đầu mối tiếp nhận yêu cầu bảo hành</strong> tại cửa hàng và qua các kênh nêu tại {TL2}, đồng thời chịu trách nhiệm liên hệ nhà sản xuất hoặc nhà phân phối.</p>
{opt('bh_ngay', '<p>Thời hạn xử lý dự kiến: {v} ngày làm việc.</p>')}
<p>Nếu sản phẩm không sửa chữa được hoặc sửa chữa không đạt, Tiên Du đổi sản phẩm tương đương hoặc hoàn tiền theo quy định pháp luật.</p>
<p>Nhóm hàng không có bảo hành của nhà sản xuất được ghi rõ "không bảo hành" trên trang sản phẩm.</p>
<p><strong>Không áp dụng bảo hành</strong> với hư hỏng do lắp đặt sai kỹ thuật, tác động ngoại lực, tự ý can thiệp sửa chữa, hoặc hao mòn tự nhiên trong quá trình sử dụng.</p>

<h2>9. Các nội dung không áp dụng</h2>
<ul>
  <li><strong>Chính sách ưu tiên hiển thị:</strong> ototiendu.com không sắp xếp, gợi ý sản phẩm theo tiêu chí trả phí hoặc ưu tiên thương mại. Sản phẩm hiển thị theo danh mục và bộ lọc do khách tự chọn.</li>
  <li><strong>Livestream bán hàng:</strong> Tiên Du không tổ chức bán hàng qua livestream trên nền tảng này.</li>
</ul>
''')

# ---------------------------------------------------------------- TL6
PAGES['quyen-va-nghia-vu.html'] = dict(
title='Quyền Và Nghĩa Vụ Của Các Bên',
desc='Quyền và nghĩa vụ của khách hàng và Công ty TNHH Đầu tư Tiên Du khi giao dịch trên ototiendu.com, và nguyên tắc sửa đổi chính sách.',
sub='Quyền và nghĩa vụ của khách hàng và Tiên Du khi giao dịch trên ototiendu.com',
body=f'''
{INFO}

<h2>1. Quyền của khách hàng</h2>
<ul>
  <li>Được cung cấp đầy đủ, chính xác thông tin về hàng hóa: tên, mã, xuất xứ, thông số, tình trạng, thông tin chất lượng và nhãn hàng hóa</li>
  <li>Được biết tổng số tiền phải thanh toán, bao gồm giá hàng, thuế và phí vận chuyển, <strong>trước khi gửi đơn hàng</strong></li>
  <li>Được rà soát và sửa nội dung đơn hàng trước khi gửi</li>
  <li>Được nhận thông báo xác nhận đơn hàng và truy cập lại nội dung đơn sau khi đặt</li>
  <li>Được hủy đơn không mất phí trong các trường hợp nêu tại <a href="chinh-sach-gia.html">Chính sách giá</a> và <a href="chinh-sach-thanh-toan.html">Chính sách thanh toán</a></li>
  <li>Được kiểm tra hàng khi nhận, và vẫn giữ quyền khiếu nại sau khi đã kiểm tra</li>
  <li>Được đổi trả, bảo hành, hoàn tiền theo các chính sách đã công bố</li>
  <li>Được bảo vệ dữ liệu cá nhân; được xem, sửa, xóa dữ liệu và rút lại sự đồng ý</li>
  <li>Được phản ánh, khiếu nại và nhận phản hồi theo thời hạn đã công bố</li>
  <li>Được lựa chọn phương thức giải quyết tranh chấp theo quy định pháp luật</li>
</ul>

<h2>2. Nghĩa vụ của khách hàng</h2>
<ul>
  <li>Cung cấp thông tin chính xác về họ tên, số điện thoại, địa chỉ nhận hàng</li>
  <li>Cung cấp đúng thông tin xe khi cần tra cứu mã phụ tùng</li>
  <li>Thanh toán đầy đủ, đúng hạn theo phương thức đã chọn</li>
  <li>Nhận hàng đúng hẹn; nếu không nhận được, thông báo trước cho Tiên Du</li>
  <li>Giữ hóa đơn và phiếu bảo hành làm căn cứ đổi trả, bảo hành</li>
  <li>Không sử dụng nền tảng để thực hiện hành vi gian lận hoặc vi phạm pháp luật</li>
</ul>

<h2>3. Quyền của Tiên Du</h2>
<ul>
  <li>Từ chối hoặc hủy đơn hàng trong các trường hợp đã công bố tại {TL5_7}</li>
  <li>Yêu cầu đặt cọc với đơn hàng giá trị lớn và hàng đặt riêng</li>
  <li>Điều chỉnh giá niêm yết; việc điều chỉnh không áp dụng cho đơn đã xác nhận</li>
  <li>Yêu cầu khách cung cấp thông tin, tài liệu cần thiết để xử lý khiếu nại, bảo hành</li>
  <li>Lưu trữ dữ liệu giao dịch theo quy định pháp luật</li>
</ul>

<h2>4. Nghĩa vụ của Tiên Du</h2>
<ul>
  <li>Công khai đầy đủ, chính xác thông tin về chủ quản nền tảng, hàng hóa, giá và các điều kiện giao dịch</li>
  <li>Hiển thị tổng số tiền phải thanh toán trước khi khách gửi đơn, và cho khách rà soát, sửa đơn</li>
  <li>Gửi thông báo xác nhận đơn hàng, bảo đảm khách truy cập lại được nội dung đơn</li>
  <li>Giao hàng đúng mã, đúng số lượng, đúng mô tả đã công bố</li>
  <li>Lập hóa đơn cho mỗi lần bán hàng</li>
  <li>Tiếp nhận lại hàng hóa không đúng nội dung đã công bố</li>
  <li>Thực hiện bảo hành, đổi trả, hoàn tiền theo chính sách đã công bố</li>
  <li>Bảo vệ dữ liệu cá nhân của khách hàng theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15</li>
  <li>Lưu trữ dữ liệu hàng hóa tối thiểu 01 năm, dữ liệu hợp đồng tối thiểu 03 năm, và bảo đảm khả năng truy cập</li>
  <li>Tiếp nhận, giải quyết phản ánh và khiếu nại theo thời hạn đã công bố</li>
</ul>

<h2>5. Sửa đổi chính sách</h2>
<p>Tiên Du có quyền sửa đổi các chính sách này. Nội dung sửa đổi được đăng trên website kèm ngày hiệu lực, và được thông báo bổ sung tới cơ quan nhà nước có thẩm quyền theo quy định.</p>
<p><strong>Chính sách áp dụng cho một đơn hàng là chính sách đang có hiệu lực tại thời điểm Tiên Du xác nhận đơn hàng đó.</strong> Việc sửa đổi không làm ảnh hưởng đến quyền lợi của các đơn hàng đã xác nhận trước đó.</p>
''')


# ---------------------------------------------------------------- Đổi trả
PAGES['chinh-sach-doi-tra.html'] = dict(
title='Chính Sách Đổi Trả',
desc='Chính sách đổi trả và hoàn tiền của Công ty TNHH Đầu tư Tiên Du: thời hạn 5 ngày, điều kiện đổi trả, các trường hợp được đổi trả kể cả đã lắp đặt, chi phí và quy trình.',
sub='Điều kiện, thời hạn và quy trình đổi trả, hoàn tiền phụ tùng',
body=f'''
{INFO}

<h2>1. Thời hạn đổi trả</h2>
<p>Khách hàng được đổi trả sản phẩm <strong>trong vòng 05 ngày</strong> kể từ ngày nhận hàng.</p>
<p>Với sản phẩm có khuyết tật hoặc lỗi của nhà sản xuất phát hiện sau thời hạn này, Tiên Du tiếp nhận và xử lý theo chính sách bảo hành tại <a href="dieu-kien-cung-cap.html#bao-hanh">Điều kiện cung cấp hàng hóa, mục 8</a>.</p>

<h2>2. Điều kiện đổi trả thông thường</h2>
<p>Áp dụng khi khách thay đổi nhu cầu, hoặc khách tự chọn mã hàng mà không có sự tư vấn kỹ thuật của Tiên Du và sản phẩm không tương thích với xe:</p>
<ul>
  <li>Sản phẩm <strong>chưa lắp đặt</strong>, còn nguyên tem và bao bì</li>
  <li>Có hóa đơn mua hàng, hoặc chứng minh được giao dịch bằng cách khác: tin nhắn Zalo, sao kê chuyển khoản, biên lai vận chuyển, hoặc dữ liệu đơn hàng Tiên Du đang lưu</li>
</ul>

<h2>3. Trường hợp được đổi trả hoặc hoàn tiền kể cả khi đã lắp đặt</h2>
<ul>
  <li>Sản phẩm có khuyết tật hoặc lỗi của nhà sản xuất</li>
  <li>Thông tin tương thích công bố trên website sai</li>
  <li>Tiên Du đã tư vấn mã hàng dựa trên thông tin xe do khách cung cấp đúng</li>
  <li>Hàng giao không đúng mã đã xác nhận</li>
</ul>
<p>Hàng giao thiếu, hư hỏng do vận chuyển hoặc không đúng mô tả, cam kết cũng được đổi trả hoặc hoàn tiền. Với kiện hàng bị móp, rách, ướt khi nhận, khách vui lòng chụp ảnh và báo Tiên Du trong 24 giờ.</p>
<p>Việc khách đã kiểm tra hàng khi nhận <strong>không làm mất quyền</strong> được khiếu nại, đổi trả trong các trường hợp trên. Quay video khi mở kiện hàng là khuyến nghị để xử lý nhanh hơn, không phải điều kiện bắt buộc.</p>

<h2>4. Trường hợp không áp dụng đổi trả</h2>
<ul>
  <li>Sản phẩm đã lắp đặt, khi lý do đổi trả là thay đổi nhu cầu hoặc khách tự chọn mã không tương thích (trừ các trường hợp tại mục 3)</li>
  <li>Hàng đặt riêng theo yêu cầu, khi lý do đổi trả là thay đổi nhu cầu</li>
  <li>Hư hỏng do lắp đặt sai kỹ thuật, tác động ngoại lực, tự ý can thiệp sửa chữa, hoặc hao mòn tự nhiên trong quá trình sử dụng</li>
</ul>

<h2>5. Chi phí đổi trả</h2>
<table class="policy-table">
  <thead><tr><th>Trường hợp</th><th>Phí vận chuyển đổi trả</th></tr></thead>
  <tbody>
    <tr><td>Lỗi thuộc về Tiên Du, nhà sản xuất hoặc đơn vị vận chuyển (mục 3)</td><td><strong>Tiên Du chịu toàn bộ</strong></td></tr>
    <tr><td>Đổi trả vì lý do của khách (mục 2)</td><td>Khách chịu phí gửi trả hàng về Tiên Du</td></tr>
  </tbody>
</table>
<p>Tiên Du chịu toàn bộ phí chuyển khoản hoàn tiền theo <a href="chinh-sach-thanh-toan.html#hoan-tien">Chính sách thanh toán, mục 4</a>.</p>

<h2>6. Quy trình đổi trả</h2>
<ol>
  <li><strong>Liên hệ:</strong> báo yêu cầu đổi trả qua các kênh tại <a href="chinh-sach-khieu-nai.html">Phương thức tiếp nhận khiếu nại</a>, kèm mã đơn hàng hoặc hóa đơn và ảnh, video sản phẩm (nếu có).</li>
  <li><strong>Xác nhận:</strong> Tiên Du kiểm tra điều kiện đổi trả và thông báo hướng xử lý theo thời hạn đã công bố.</li>
  <li><strong>Gửi hàng:</strong> khách mang sản phẩm đến cửa hàng tại {STORE}, hoặc gửi qua đơn vị vận chuyển theo hướng dẫn.</li>
  <li><strong>Hoàn tất:</strong> Tiên Du đổi sản phẩm tương đương, hoặc hoàn tiền trong <strong>07 ngày làm việc</strong> kể từ ngày hai bên thống nhất việc hoàn tiền.</li>
</ol>
''')

# ---------------------------------------------------------------- Bảo vệ dữ liệu cá nhân
PAGES['chinh-sach-bao-mat.html'] = dict(
title='Chính Sách Bảo Mật',
desc='Chính sách bảo mật của Công ty TNHH Đầu tư Tiên Du: dữ liệu cá nhân được thu thập, mục đích xử lý, chia sẻ, chuyển ra nước ngoài, lưu trữ và quyền của Quý khách theo Luật Bảo vệ dữ liệu cá nhân.',
sub='Cách Tiên Du thu thập, sử dụng và bảo vệ dữ liệu cá nhân của Quý khách',
updated='26/09/2026',
body=f'''
{INFO.replace('</div>', opt('dpo', '  <p>Bộ phận phụ trách bảo vệ dữ liệu cá nhân: {v} — <a href="tel:0946915111">0946.915.111</a></p>' + chr(10)) + '</div>')}

<p>Website thương mại điện tử ototiendu.com do Công ty TNHH Đầu tư Tiên Du (sau đây gọi là “Tiên Du” hoặc “chúng tôi”) thiết lập, vận hành để trực tiếp bán phụ tùng, linh kiện và vật tư bảo dưỡng ô tô. Đối tượng phục vụ là chủ xe, garage và đại lý trên toàn quốc có nhu cầu tra cứu, đặt mua phụ tùng mà không có điều kiện đến trực tiếp cửa hàng.</p>
<p>Chính sách này giải thích cách chúng tôi tiếp nhận, sử dụng, chia sẻ, lưu trữ và bảo vệ dữ liệu cá nhân của Quý khách, theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và các văn bản hướng dẫn thi hành.</p>
<p>Bảo vệ dữ liệu cá nhân và gây dựng niềm tin nơi Quý khách là vấn đề rất quan trọng với chúng tôi. Vì vậy, chúng tôi chỉ thu thập những thông tin thực sự cần thiết cho việc tư vấn, bán hàng và chăm sóc sau bán hàng, và sử dụng các thông tin đó đúng theo nội dung Chính sách này.</p>
<p>Quý khách có thể truy cập website, xem sản phẩm và tham khảo giá mà không cần cung cấp bất kỳ thông tin cá nhân nào. Chúng tôi chỉ bắt đầu thu thập dữ liệu khi Quý khách chủ động liên hệ, gửi yêu cầu tư vấn hoặc đặt hàng.</p>

<h2 id="thu-thap">1. Dữ liệu cá nhân được thu thập</h2>
<p>Tùy vào cách Quý khách làm việc với Tiên Du, chúng tôi thu thập, lưu trữ và xử lý những nhóm thông tin sau:</p>
<ul>
  <li><strong>Thông tin liên hệ và giao hàng:</strong> họ tên, số điện thoại, địa chỉ nhận hàng, địa chỉ email nếu Quý khách cung cấp.</li>
  <li><strong>Thông tin về xe:</strong> hãng xe, dòng xe, năm sản xuất, số VIN, và ảnh chụp giấy đăng ký xe trong trường hợp Quý khách gửi để chúng tôi tra cứu đúng mã phụ tùng.</li>
  <li><strong>Thông tin giao dịch:</strong> nội dung đơn hàng, hóa đơn, lịch sử mua hàng và lịch sử nhận hàng.</li>
  <li><strong>Thông tin xuất hóa đơn cho doanh nghiệp:</strong> tên đơn vị, mã số thuế và địa chỉ, trong trường hợp Quý khách cần hóa đơn ghi tên công ty.</li>
  <li><strong>Thông tin hoàn tiền:</strong> số tài khoản ngân hàng do Quý khách cung cấp khi phát sinh việc hoàn tiền.</li>
  <li><strong>Nội dung phản ánh, khiếu nại:</strong> tin nhắn, hình ảnh, video Quý khách gửi cho chúng tôi để mô tả sự việc.</li>
</ul>
<p>Tiên Du không chủ động thu thập dữ liệu cá nhân nhạy cảm. Khi gửi ảnh giấy tờ để tra cứu phụ tùng, chúng tôi khuyến nghị Quý khách che những thông tin không cần thiết cho việc tra cứu. Nếu Quý khách gửi nhầm giấy tờ hoặc thông tin ngoài phạm vi nêu trên, chúng tôi sẽ xóa ngay sau khi phát hiện và thông báo lại để Quý khách biết.</p>
<p>Website ototiendu.com không tích hợp cổng thanh toán trực tuyến. Chúng tôi không thu thập và không lưu trữ thông tin thẻ ngân hàng, thông tin đăng nhập tài khoản ngân hàng hay ví điện tử của Quý khách trong bất kỳ trường hợp nào.</p>

<h2 id="cach-thu-thap">2. Cách thức thu thập</h2>
<ul>
  <li>Chúng tôi tiếp nhận thông tin do chính Quý khách cung cấp khi đặt hàng, yêu cầu tư vấn hoặc gửi phản ánh, thông qua điện thoại, Zalo, email, biểu mẫu trên website hoặc khi đến trực tiếp cửa hàng.</li>
  <li>Một phần thông tin phát sinh trong quá trình giao dịch, bao gồm nội dung đơn hàng, hóa đơn và mã vận đơn do đơn vị vận chuyển cấp.</li>
  <li>Máy chủ lưu trữ website ghi nhận nhật ký truy cập kỹ thuật, gồm địa chỉ IP, loại trình duyệt và thời điểm truy cập, nhằm phục vụ vận hành và bảo đảm an toàn hệ thống.{opt('log_ttl', ' Nhật ký này được lưu trong {v}, sau đó tự động xóa.')}</li>
  <li>Website ototiendu.com không sử dụng cookie quảng cáo và không cài đặt công cụ theo dõi hành vi người dùng cho mục đích tiếp thị.</li>
</ul>
<p>Tiên Du không mua, không thu thập dữ liệu cá nhân của Quý khách từ bất kỳ nguồn nào khác ngoài các cách thức nêu trên.</p>

<h2 id="muc-dich">3. Mục đích xử lý</h2>
<p>Chúng tôi phân biệt rõ hai nhóm mục đích, tương ứng với hai cơ sở pháp lý khác nhau, để Quý khách nắm được quyền của mình trong từng trường hợp.</p>
<h3>3.1. Xử lý nhằm thực hiện hợp đồng và nghĩa vụ luật định</h3>
<p>Những hoạt động sau đây cần thiết để chúng tôi bán hàng cho Quý khách và tuân thủ quy định pháp luật, nên được thực hiện mà không cần sự đồng ý riêng, và Quý khách không thể yêu cầu ngừng xử lý nếu vẫn đang trong quá trình giao dịch hoặc trong thời hạn lưu trữ bắt buộc:</p>
<ul>
  <li>Tiếp nhận, xác nhận và thực hiện đơn hàng; tổ chức giao hàng đến địa chỉ Quý khách cung cấp.</li>
  <li>Tra cứu và tư vấn đúng mã phụ tùng phù hợp với xe của Quý khách.</li>
  <li>Lập hóa đơn và thực hiện nghĩa vụ kế toán, thuế theo quy định.</li>
  <li>Thực hiện bảo hành, đổi trả, hoàn tiền và giải quyết phản ánh, khiếu nại.</li>
  <li>Quản lý rủi ro đơn hàng theo <a href="dieu-kien-cung-cap.html#tu-choi">Điều kiện cung cấp hàng hóa, mục 7</a>, bao gồm việc ghi nhận các trường hợp từ chối nhận hàng không có lý do chính đáng.</li>
  <li>Lưu trữ dữ liệu giao dịch theo thời hạn pháp luật quy định.</li>
</ul>
<h3>3.2. Xử lý trên cơ sở sự đồng ý của Quý khách</h3>
<ul>
  <li>Gửi thông tin về sản phẩm mới, chương trình khuyến mãi và bảng giá sỉ. Chúng tôi chỉ gửi khi Quý khách đã đồng ý, và Quý khách có thể từ chối nhận bất cứ lúc nào mà không ảnh hưởng đến việc mua hàng.</li>
  <li>Sử dụng công cụ <a href="tim-vin.html">Tìm số VIN</a> trên website, có liên quan đến việc chuyển dữ liệu xuyên biên giới nêu tại <a href="#nuoc-ngoai">mục 5</a>.</li>
</ul>
<p>Sự im lặng hoặc việc không phản hồi của Quý khách không được chúng tôi xem là sự đồng ý.</p>

<h2 id="chia-se">4. Chia sẻ dữ liệu</h2>
<p>Tiên Du không bán, không cho thuê và không trao đổi dữ liệu cá nhân của Quý khách với bất kỳ bên nào vì mục đích thương mại. Dữ liệu chỉ được chia sẻ ở mức tối thiểu cần thiết, cho những bên sau:</p>
<ul>
  <li><strong>Đơn vị vận chuyển</strong>{opt('don_vi_vc', ' ({v})')}: họ tên, số điện thoại, địa chỉ nhận hàng, và số tiền thu hộ đối với đơn thanh toán khi nhận hàng. Các đơn vị này chỉ được sử dụng thông tin cho việc giao nhận hàng hóa.</li>
  <li><strong>Nhà cung cấp dịch vụ lưu trữ website</strong>{opt('hosting', ' ({v})')}: tiếp cận dữ liệu ở mức kỹ thuật trong quá trình vận hành hệ thống.</li>
  <li><strong>Ngân hàng:</strong> thông tin cần thiết để thực hiện việc hoàn tiền theo yêu cầu của Quý khách.</li>
  <li><strong>Nhà sản xuất hoặc nhà phân phối:</strong> thông tin về sản phẩm và giao dịch cần thiết để xử lý yêu cầu bảo hành.</li>
  <li><strong>Cơ quan nhà nước có thẩm quyền:</strong> khi có yêu cầu hợp pháp theo quy định của pháp luật.</li>
</ul>
<p>Trong mọi trường hợp, chúng tôi yêu cầu các bên nêu trên áp dụng biện pháp bảo vệ dữ liệu tương ứng và chỉ sử dụng thông tin đúng phạm vi đã thỏa thuận.</p>

<h2 id="nuoc-ngoai">5. Chuyển dữ liệu ra nước ngoài</h2>
<p>Chúng tôi công khai minh bạch những trường hợp dữ liệu có thể được chuyển ra khỏi lãnh thổ Việt Nam:</p>
<ul>
  <li><strong>Công cụ Tìm số VIN.</strong> Khi Quý khách sử dụng công cụ này, website gửi số VIN Quý khách nhập tới dịch vụ giải mã VIN của Cơ quan Quản lý An toàn Giao thông Đường cao tốc Hoa Kỳ (NHTSA) để nhận về thông tin kỹ thuật của xe. Công cụ chỉ gửi số VIN, không gửi kèm họ tên, số điện thoại hay bất kỳ thông tin cá nhân nào khác của Quý khách.</li>
  <li><strong>Hạ tầng lưu trữ website.</strong> {('Website ototiendu.com được lưu trữ trên hạ tầng của ' + FILL['hosting'] + ', với máy chủ đặt tại ' + FILL['server_country'] + '.') if FILL['hosting'] and FILL['server_country'] else 'Website ototiendu.com được lưu trữ trên hạ tầng của nhà cung cấp dịch vụ đám mây có máy chủ đặt ở nước ngoài.'}</li>
  <li><strong>Bản đồ nhúng.</strong> Trang Liên hệ có nhúng bản đồ Google Maps. Khi bản đồ hiển thị, trình duyệt của Quý khách kết nối tới máy chủ của Google và có thể gửi địa chỉ IP tới bên cung cấp dịch vụ này. Việc xử lý dữ liệu tại Google tuân theo chính sách quyền riêng tư của Google.</li>
</ul>
{dict(A='<p>Tiên Du là doanh nghiệp nhỏ theo quy định pháp luật và áp dụng quyền lựa chọn không thực hiện việc lập hồ sơ đánh giá tác động xử lý dữ liệu cá nhân và hồ sơ đánh giá tác động chuyển dữ liệu cá nhân xuyên biên giới, theo Điều 38 Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Điều 41 Nghị định 356/2025/NĐ-CP. Việc áp dụng quyền này không làm thay đổi các cam kết bảo vệ dữ liệu nêu trong Chính sách này.</p>', B='<p>Tiên Du đã lập và gửi hồ sơ đánh giá tác động xử lý dữ liệu cá nhân và hồ sơ đánh giá tác động chuyển dữ liệu cá nhân xuyên biên giới tới cơ quan chuyên trách bảo vệ dữ liệu cá nhân theo quy định pháp luật.</p>').get(FILL['dia_phuong_an'] or '', '')}

<h2 id="luu-tru">6. Thời gian lưu trữ</h2>
<p>Chúng tôi giữ thông tin của Quý khách trong thời hạn cần thiết cho mục đích đã nêu, hoặc trong thời hạn pháp luật quy định, tùy theo thời hạn nào dài hơn:</p>
<ul>
  <li>Dữ liệu liên quan đến hợp đồng, phản ánh và khiếu nại: tối thiểu 03 năm kể từ thời điểm giao kết hợp đồng.</li>
  <li>Dữ liệu về hàng hóa: tối thiểu 01 năm.</li>
  <li>Hóa đơn và chứng từ kế toán: theo thời hạn của pháp luật kế toán.</li>
  {opt('log_ttl', '<li>Nhật ký truy cập kỹ thuật: {v}.</li>')}
  <li>Thông tin phục vụ mục đích gửi khuyến mãi: cho đến khi Quý khách rút lại sự đồng ý.</li>
</ul>
<p>Hết thời hạn lưu trữ, dữ liệu được xóa hoặc hủy, trừ trường hợp pháp luật có quy định khác.</p>

<h2 id="quyen">7. Quyền của khách hàng</h2>
<p>Theo quy định pháp luật về bảo vệ dữ liệu cá nhân, Quý khách có các quyền sau đây và chúng tôi không thu bất kỳ khoản phí nào khi Quý khách thực hiện các quyền này:</p>
<ul>
  <li>Được biết về việc xử lý dữ liệu cá nhân của mình.</li>
  <li>Đồng ý hoặc không đồng ý cho việc xử lý dữ liệu, và rút lại sự đồng ý đã cho bất cứ lúc nào.</li>
  <li>Truy cập, xem và yêu cầu chỉnh sửa dữ liệu cá nhân của mình.</li>
  <li>Yêu cầu xóa dữ liệu, hạn chế xử lý dữ liệu hoặc phản đối việc xử lý dữ liệu.</li>
  <li>Yêu cầu cung cấp dữ liệu cá nhân của mình.</li>
  <li>Khiếu nại, tố cáo, khởi kiện và yêu cầu bồi thường thiệt hại theo quy định pháp luật.</li>
</ul>
<p>Việc rút lại sự đồng ý hoặc yêu cầu xóa dữ liệu không làm ảnh hưởng đến tính hợp pháp của việc xử lý đã thực hiện trước đó. Quyền này cũng không áp dụng đối với dữ liệu mà Tiên Du có nghĩa vụ lưu trữ theo quy định pháp luật, bao gồm hóa đơn, chứng từ kế toán và dữ liệu liên quan đến hợp đồng đã giao kết.</p>

<h2 id="thuc-hien-quyen">8. Cách thực hiện quyền</h2>
<p>Quý khách gửi yêu cầu qua các kênh nêu tại <a href="chinh-sach-khieu-nai.html">Phương thức tiếp nhận và giải quyết khiếu nại</a>: hotline <a href="tel:0946915111">0946.915.111</a>, Zalo tiendu.nhatrang, email <a href="mailto:tienduoto@gmail.com">tienduoto@gmail.com</a>, hoặc trực tiếp tại cửa hàng.</p>
<p>Chúng tôi thực hiện yêu cầu của Quý khách trong thời hạn 72 giờ kể từ khi nhận được yêu cầu. Trường hợp yêu cầu phức tạp hoặc cần xác minh thêm, chúng tôi sẽ thông báo lý do và thời hạn dự kiến cho Quý khách trong 01 ngày làm việc.</p>
<p>Nhằm bảo đảm dữ liệu không bị cung cấp hoặc chỉnh sửa bởi người khác, chúng tôi có thể đề nghị Quý khách xác minh danh tính trước khi thực hiện yêu cầu, chẳng hạn gọi từ số điện thoại đã dùng khi đặt hàng hoặc cung cấp mã đơn hàng.</p>

<h2 id="bao-ve">9. Biện pháp bảo vệ dữ liệu</h2>
<ul>
  <li>Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp nhằm ngăn chặn việc truy cập trái phép, làm lộ, mất mát hoặc hủy hoại dữ liệu cá nhân của Quý khách.</li>
  <li>Chỉ những nhân viên có nhiệm vụ liên quan mới được tiếp cận dữ liệu khách hàng, trong phạm vi công việc được giao.</li>
  <li>Chúng tôi không công khai thông tin của Quý khách trên website hoặc mạng xã hội khi chưa có sự đồng ý. Các đánh giá, hình ảnh có liên quan đến khách hàng chỉ được đăng khi Quý khách cho phép.</li>
  <li>Tiên Du không bao giờ yêu cầu Quý khách cung cấp mật khẩu, mã OTP hay thông tin đăng nhập ngân hàng. Chúng tôi cũng không yêu cầu chuyển khoản vào tài khoản cá nhân. Nếu nhận được đề nghị như vậy, Quý khách vui lòng gọi <a href="tel:0946915111">0946.915.111</a> để xác minh trước khi thực hiện.</li>
  <li>Chúng tôi khuyến nghị Quý khách không gửi thông tin tài khoản ngân hàng, ảnh giấy tờ tùy thân qua các kênh không chính thức, và chỉ liên hệ với Tiên Du qua số điện thoại, Zalo và email công bố tại website này.</li>
</ul>
<p>Khi xảy ra sự cố làm lộ, mất dữ liệu cá nhân, chúng tôi thông báo cho cơ quan có thẩm quyền và cho Quý khách bị ảnh hưởng theo quy định pháp luật, đồng thời áp dụng ngay các biện pháp khắc phục.</p>

<h2 id="tre-em">10. Dữ liệu của người chưa thành niên</h2>
<p>Nền tảng ototiendu.com phục vụ người từ đủ 18 tuổi trở lên. Chúng tôi không chủ động thu thập dữ liệu cá nhân của người dưới 18 tuổi và không thiết kế nội dung hướng tới nhóm đối tượng này, phù hợp với <a href="dieu-kien-cung-cap.html">Điều kiện cung cấp hàng hóa, mục 2</a>.</p>
<p>Nếu phát hiện đã thu thập dữ liệu của người dưới 18 tuổi mà không có sự đồng ý hợp lệ của cha, mẹ hoặc người giám hộ, chúng tôi sẽ ngừng xử lý và xóa dữ liệu đó. Quý khách là cha, mẹ hoặc người giám hộ, nếu cho rằng con em mình đã cung cấp dữ liệu cho Tiên Du, vui lòng liên hệ theo <a href="#thuc-hien-quyen">mục 8</a> để chúng tôi xử lý.</p>

<h2 id="sua-doi">11. Sửa đổi chính sách</h2>
<p>Tiên Du có thể sửa đổi Chính sách này để phù hợp với thay đổi của pháp luật hoặc của hoạt động kinh doanh. Nội dung sửa đổi được đăng tại chính trang này kèm ngày hiệu lực, theo nguyên tắc nêu tại <a href="quyen-va-nghia-vu.html">Quyền và nghĩa vụ của các bên, mục 5</a>.</p>
<p>Trường hợp sửa đổi làm thay đổi phạm vi hoặc mục đích xử lý dữ liệu theo hướng bất lợi cho Quý khách, chúng tôi sẽ thông báo và xin lại sự đồng ý trước khi áp dụng.</p>
<p>Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi pháp luật Việt Nam.</p>
''')

def dates_for(p):
    return (f'Ngày hiệu lực: {FILL["hieu_luc"]} · ' if FILL['hieu_luc'] else '') + f'Cập nhật lần cuối: {p.get("updated", UPDATED)}'

for fname, label in POLICIES:
    p = PAGES[fname]
    full = f"{p['title']} — Tiên Du Phụ Tùng Ô Tô Nha Trang"
    h = re.sub(r'<title>.*?</title>', f'<title>{full}</title>', head)
    h = re.sub(r'(<meta (?:name|property)="(?:og:|twitter:)?title" content=")[^"]*', lambda m: m.group(1) + full, h)
    h = re.sub(r'(<meta (?:name|property)="(?:og:|twitter:)?description" content=")[^"]*', lambda m: m.group(1) + p['desc'], h)
    h = h.replace('https://ototiendu.com/gioi-thieu.html', 'https://ototiendu.com/' + fname)
    h = re.sub(r'<div class="page-hero-content">.*?</div>\n</header>', f'''<div class="page-hero-content">
    <div class="breadcrumb">
      <a href="index.html">Trang chủ</a>
      <span class="breadcrumb-sep">/</span>
      <span>{label}</span>
    </div>
    <h1 class="page-hero-title">{p['title']}</h1>
    <p class="page-hero-sub">{p['sub']}</p>
  </div>
</header>''', h, flags=re.S)
    nav = '\n'.join(f'      <a href="{f}" class="policy-nav-link{" active" if f == fname else ""}">{l}</a>' for f, l in POLICIES)
    body = re.sub(r'\n{3,}', '\n\n', p['body'].strip())
    body = re.sub(r'^\s*\n', '', body, flags=re.M)  # bỏ dòng trống do opt() rỗng
    for phrase, target in [('Chính sách đổi trả', 'chinh-sach-doi-tra.html'), ('Chính sách bảo mật', 'chinh-sach-bao-mat.html')]:
        if fname != target:
            body = re.sub(r'(?<![>\w])' + phrase + r'(?![^<]*</a>)', f'<a href="{target}">{phrase}</a>', body)
    page = f'''<!-- ============ POLICY CONTENT ============ -->
<section class="section" style="background:var(--color-white)">
  <div class="section-inner policy-layout">
    <aside class="policy-nav" aria-label="Chính sách">
      <p class="policy-nav-title">Chính sách</p>
{nav}
    </aside>
    <article class="article-body policy-body">
{body}
      <p class="policy-updated">{dates_for(p)}</p>
    </article>
  </div>
</section>

<!-- ============ CTA ============ -->
<section class="cta-banner-wrap">
  <div class="cta-banner">
    <h2 class="cta-banner-title">Cần tư vấn phụ tùng?<br>Liên hệ ngay với Tiên Du!</h2>
    <a href="https://zalo.me/0946915111" target="_blank" rel="noopener" class="btn btn-black">
      <img src="assets/cta-banner-zalo.png" alt=""> Zalo tư vấn ngay
    </a>
  </div>
</section>

'''
    open(fname, 'w', encoding='utf-8').write(h + page + foot)
    print('wrote', fname)
