// ============================================================================
// parts-reference.js — Cơ sở dữ liệu tra cứu phụ tùng theo hãng xe châu Á
// ----------------------------------------------------------------------------
// Dùng cho trang tra-cuu.html / tim-vin.html của website Tiên Du.
// Cấu trúc khớp với js/vehicle-data.js (hãng → dòng xe → năm).
//
// MỖI MỤC PHỤ TÙNG gồm:
//   - group        : nhóm phụ tùng (khớp taxonomy trong CLAUDE.md)
//   - name         : tên phụ tùng
//   - interval     : chu kỳ thay thế đề xuất
//   - spec         : thông số kỹ thuật cốt lõi
//   - oem          : { hãngXe: { part: 'mã OEM', note, verified } }
//                    verified=true  → mã đã đối chiếu nguồn chính hãng
//                    verified=false → mã theo QUY LUẬT đánh số của hãng,
//                                     CẦN ĐỐI CHIẾU catalog trước khi báo giá
//   - aftermarket  : danh sách hãng phụ tùng thay thế (tier: OEM-supplier / premium / value)
//
// ⚠️  LƯU Ý QUAN TRỌNG CHO NHÂN VIÊN TIÊN DU:
//   Mã OEM có verified=false chỉ mang tính THAM KHẢO theo quy luật đánh số.
//   LUÔN đối chiếu số VIN / đời máy cụ thể với catalog chính hãng (hoặc
//   Amayama / Partsouq / 7zap) TRƯỚC KHI báo giá cho khách. Cùng một dòng xe
//   nhưng khác dung tích máy / đời facelift có thể dùng mã khác nhau.
// ============================================================================

const PARTS_LAST_UPDATED = '2026-07-02'

// ── DANH SÁCH HÃNG PHỤ TÙNG THAY THẾ THEO NHÓM ──────────────────────────────
// tier: 'oe'      = hãng cung cấp cho chính hãng (OEM supplier) — chất lượng cao nhất
//       'premium' = thương hiệu quốc tế uy tín
//       'value'   = thương hiệu phổ thông, giá tốt (phổ biến tại VN)
const AFTERMARKET_BRANDS = {
  'loc-dau': [ // Lọc dầu
    { brand: 'Denso',       country: 'Nhật',  tier: 'oe',      note: 'OE supplier cho Toyota, Honda, Mazda' },
    { brand: 'Toyota/Honda/Mobis (chính hãng)', country: '—', tier: 'oe', note: 'Phụ tùng zin theo xe' },
    { brand: 'Bosch',       country: 'Đức',   tier: 'premium', note: 'Phổ biến, dễ tìm tại VN' },
    { brand: 'Mann-Filter', country: 'Đức',   tier: 'premium', note: 'Lọc cao cấp' },
    { brand: 'Mahle / Knecht', country: 'Đức', tier: 'premium', note: 'OE cho nhiều hãng châu Âu & Nhật' },
    { brand: 'Sakura',      country: 'Indonesia', tier: 'value', note: 'Rất phổ biến ĐNÁ, giá tốt' },
    { brand: 'Asakashi / Vic', country: 'Nhật/Thái', tier: 'value', note: 'Giá rẻ, hàng phổ thông' },
  ],
  'loc-gio': [ // Lọc gió động cơ
    { brand: 'Denso',   country: 'Nhật', tier: 'oe',      note: 'OE cho xe Nhật' },
    { brand: 'Sakura',  country: 'Indonesia', tier: 'value', note: 'Bán chạy nhất phân khúc phổ thông' },
    { brand: 'Mann-Filter', country: 'Đức', tier: 'premium', note: '' },
    { brand: 'Bosch',   country: 'Đức',  tier: 'premium', note: '' },
    { brand: 'K&N',     country: 'Mỹ',   tier: 'premium', note: 'Lọc gió tăng lưu lượng, tái sử dụng' },
    { brand: 'Vic / Asuki', country: 'Nhật/Thái', tier: 'value', note: '' },
  ],
  'loc-cabin': [ // Lọc gió điều hòa (cabin)
    { brand: 'Denso',   country: 'Nhật', tier: 'oe',      note: '' },
    { brand: 'Mann-Filter', country: 'Đức', tier: 'premium', note: 'Có loại than hoạt tính khử mùi' },
    { brand: 'Bosch',   country: 'Đức',  tier: 'premium', note: '' },
    { brand: 'Sakura',  country: 'Indonesia', tier: 'value', note: '' },
  ],
  'loc-nhien-lieu': [ // Lọc nhiên liệu (xăng / dầu)
    { brand: 'Denso',   country: 'Nhật', tier: 'oe',      note: '' },
    { brand: 'Bosch',   country: 'Đức',  tier: 'premium', note: 'Mạnh về lọc dầu diesel' },
    { brand: 'Sakura',  country: 'Indonesia', tier: 'value', note: 'Phổ biến cho xe bán tải diesel' },
    { brand: 'Mann-Filter', country: 'Đức', tier: 'premium', note: '' },
  ],
  'dau-nhot': [ // Dầu nhớt động cơ
    { brand: 'Toyota / Honda / Hyundai (chính hãng)', country: '—', tier: 'oe', note: 'Dầu theo khuyến nghị hãng' },
    { brand: 'Castrol', country: 'Anh',  tier: 'premium', note: 'GTX, Magnatec, Edge — phổ biến nhất VN' },
    { brand: 'Shell',   country: 'Hà Lan', tier: 'premium', note: 'Helix HX7 / Ultra' },
    { brand: 'Mobil',   country: 'Mỹ',   tier: 'premium', note: 'Mobil 1 Super / full synthetic' },
    { brand: 'Motul',   country: 'Pháp', tier: 'premium', note: 'Cao cấp, xe hiệu suất cao' },
    { brand: 'Total',   country: 'Pháp', tier: 'premium', note: 'Quartz' },
    { brand: 'Liqui Moly', country: 'Đức', tier: 'premium', note: '' },
  ],
  'bugi': [ // Bugi đánh lửa
    { brand: 'Denso',   country: 'Nhật', tier: 'oe',      note: 'OE cho phần lớn xe Nhật (Iridium TT / Power)' },
    { brand: 'NGK',     country: 'Nhật', tier: 'oe',      note: 'OE cho nhiều hãng (Laser Iridium / G-Power)' },
    { brand: 'Bosch',   country: 'Đức',  tier: 'premium', note: '' },
    { brand: 'Champion', country: 'Mỹ',  tier: 'value',   note: '' },
  ],
  'day-curoa': [ // Dây curoa (cam / tổng / lốc máy)
    { brand: 'Gates',   country: 'Mỹ',   tier: 'oe',      note: 'OE supplier hàng đầu, phổ biến VN' },
    { brand: 'Bando',   country: 'Nhật', tier: 'oe',      note: 'OE cho nhiều xe Nhật/Hàn' },
    { brand: 'Mitsuboshi', country: 'Nhật', tier: 'oe',   note: 'OE, chất lượng cao' },
    { brand: 'Dayco',   country: 'Ý',    tier: 'premium', note: '' },
    { brand: 'Contitech', country: 'Đức', tier: 'premium', note: '' },
  ],
  'ma-phanh': [ // Má phanh
    { brand: 'Akebono', country: 'Nhật', tier: 'oe',      note: 'OE cho Toyota/Lexus, êm & bền nhất' },
    { brand: 'Advics',  country: 'Nhật', tier: 'oe',      note: 'Thuộc Aisin/Toyota, OE nhiều xe Nhật' },
    { brand: 'Nisshinbo', country: 'Nhật', tier: 'oe',    note: 'OE phổ biến, giá hợp lý' },
    { brand: 'Bendix',  country: 'Úc/Mỹ', tier: 'premium', note: 'Rất phổ biến tại VN, nhiều dòng' },
    { brand: 'TRW',     country: 'Đức',  tier: 'premium', note: '' },
    { brand: 'Brembo',  country: 'Ý',    tier: 'premium', note: 'Cao cấp, hiệu suất' },
    { brand: 'Compact / Asuki', country: 'Nhật/Thái', tier: 'value', note: 'Giá phổ thông' },
  ],
  'dia-phanh': [ // Đĩa phanh (rotor)
    { brand: 'Advics',  country: 'Nhật', tier: 'oe',      note: 'OE cho xe Nhật' },
    { brand: 'Brembo',  country: 'Ý',    tier: 'premium', note: '' },
    { brand: 'TRW',     country: 'Đức',  tier: 'premium', note: '' },
    { brand: 'ATE',     country: 'Đức',  tier: 'premium', note: '' },
    { brand: 'DBA',     country: 'Úc',   tier: 'premium', note: 'Đĩa xẻ rãnh, hiệu suất' },
  ],
  'giam-xoc': [ // Giảm xóc / phuộc
    { brand: 'KYB (Kayaba)', country: 'Nhật', tier: 'oe',  note: 'OE & aftermarket phổ biến nhất VN' },
    { brand: 'Tokico',  country: 'Nhật', tier: 'oe',      note: 'OE cho nhiều xe Nhật' },
    { brand: 'Sachs',   country: 'Đức',  tier: 'premium', note: '' },
    { brand: 'Bilstein', country: 'Đức', tier: 'premium', note: 'Cao cấp, monotube' },
    { brand: 'Monroe',  country: 'Bỉ/Mỹ', tier: 'premium', note: '' },
  ],
  'rotuyn-cao-su': [ // Rotuyn lái/trụ, cao su càng A, bạc đạn bánh
    { brand: '555 (Sankei)', country: 'Nhật', tier: 'oe', note: 'Rotuyn OE chất lượng cao, chuẩn Nhật' },
    { brand: 'CTR',     country: 'Hàn',  tier: 'premium', note: 'Rất phổ biến VN, giá tốt cho xe Hàn/Nhật' },
    { brand: 'GMB',     country: 'Nhật', tier: 'premium', note: 'Rotuyn, bạc đạn, bơm nước' },
    { brand: 'Moog',    country: 'Mỹ',   tier: 'premium', note: 'Cao cấp treo/lái' },
    { brand: 'Febest',  country: 'Nhật', tier: 'value',   note: 'Cao su, bạc, giá phổ thông' },
  ],
  'bom-nuoc-ket-nuoc': [ // Bơm nước, két nước làm mát
    { brand: 'Aisin',   country: 'Nhật', tier: 'oe',      note: 'OE bơm nước cho Toyota/Nhật' },
    { brand: 'GMB',     country: 'Nhật', tier: 'oe',      note: 'Bơm nước phổ biến' },
    { brand: 'Denso',   country: 'Nhật', tier: 'oe',      note: 'Két nước, quạt làm mát' },
    { brand: 'Koyorad', country: 'Nhật', tier: 'premium', note: 'Két nước OE chất lượng cao' },
    { brand: 'Nissens', country: 'Đan Mạch', tier: 'premium', note: 'Két nước/giàn lạnh' },
  ],
  'bobine-cam-bien': [ // Bobine đánh lửa (ignition coil), cảm biến
    { brand: 'Denso',   country: 'Nhật', tier: 'oe',      note: 'OE bobine/cảm biến xe Nhật' },
    { brand: 'NGK / NTK', country: 'Nhật', tier: 'oe',    note: 'OE bobine & cảm biến oxy' },
    { brand: 'Bosch',   country: 'Đức',  tier: 'premium', note: '' },
    { brand: 'Delphi',  country: 'Mỹ',   tier: 'premium', note: '' },
  ],
}

// ── CATALOGUE TRA CỨU CHÍNH THỨC CỦA CÁC HÃNG PHỤ TÙNG THAY THẾ ──────────────
// Link tra cứu / cross-reference chính thức để tra mã thay thế theo xe (make/
// model/year) hoặc theo mã đối thủ. Nhân viên Tiên Du dùng để tra nhanh mã
// tương đương khi khách đưa mã OEM hoặc thông tin xe.
//   finder = tra theo xe (make/model/year hoặc VIN)
//   cross  = tra chéo từ mã hãng khác sang mã hãng này
// Tên brand ở đây khớp với trường "brand" trong AFTERMARKET_BRANDS (đã chuẩn hóa).
const BRAND_CATALOGUES = {
  // ── Lọc ──
  'Denso':        { site: 'https://www.densoautoparts.com', finder: 'https://www.densoautoparts.com/catalogs/', cross: 'https://www.denso-am.eu/catalog', note: 'Find My Part theo xe · e-catalogue EU' },
  'Bosch':        { site: 'https://www.boschautoparts.com', finder: 'https://www.boschautoparts.com/g/filters', cross: '', note: 'Tra phụ tùng Bosch theo xe' },
  'Mann-Filter':  { site: 'https://www.mann-filter.com', finder: 'https://www.mann-filter.com/en/catalog.html', cross: 'https://www.mann-filter.com/en/catalog.html', note: '6.800 lọc · 300.000 ứng dụng' },
  'Mahle / Knecht': { site: 'https://www.mahle-aftermarket.com', finder: 'https://www.mahle-aftermarket.com/en/products-and-services/catalog/', cross: '', note: 'Catalog MAHLE/Knecht theo xe' },
  'Sakura':       { site: 'https://www.sakurafilter.com', finder: 'https://www.sakurafilter.com/products', cross: 'https://webcatalogs.info/en/sakura.html', note: 'Quick Search theo xe/mã · 7.000+ mã' },
  // ── Dầu nhớt ──
  'Castrol':      { site: 'https://www.castrol.com', finder: 'https://www.castrol.com/en_us/united-states/home/oil-selector.html', cross: '', note: 'Oil Selector theo xe' },
  'Shell':        { site: 'https://www.shell.com', finder: 'https://www.shell.com/motorist/oils-lubricants/lubematch.html', cross: '', note: 'LubeMatch theo xe' },
  'Mobil':        { site: 'https://www.mobil.com', finder: 'https://www.mobil.com/en/lubricants/for-personal-vehicles/car-engine-oil/product-selector', cross: '', note: 'Product Selector theo xe' },
  'Motul':        { site: 'https://www.motul.com', finder: 'https://www.motul.com/en/lubricants-advisor', cross: '', note: 'Lubricants Advisor theo xe' },
  'Total':        { site: 'https://lubricants.totalenergies.com', finder: 'https://lubricants.totalenergies.com/lubadvisor', cross: '', note: 'LubAdvisor theo xe' },
  'Liqui Moly':   { site: 'https://www.liqui-moly.com', finder: 'https://www.liqui-moly.com/en/oil-guide.html', cross: '', note: 'Oil Guide theo xe' },
  // ── Bugi / Bobine / Cảm biến ──
  'NGK':          { site: 'https://ngksparkplugs.com', finder: 'https://ngksparkplugs.com/en/part-finder', cross: 'https://www.ngk.com/using-the-ngk-cross-reference', note: 'Part Finder theo xe · Cross-reference mã' },
  'NGK / NTK':    { site: 'https://www.ngkntk.com', finder: 'https://www.ngkntk.com/part-finder/', cross: 'https://www.ngk.com/using-the-ngk-cross-reference', note: 'Niterra Part Finder (bugi + cảm biến)' },
  'Champion':     { site: 'https://www.championautoparts.com', finder: 'https://www.championautoparts.com/find-my-part.html', cross: '', note: 'Find My Part theo xe' },
  'Delphi':       { site: 'https://www.delphiautoparts.com', finder: 'https://www.delphiautoparts.com/us/en/find-a-part', cross: '', note: 'Tra phụ tùng điện/nhiên liệu theo xe' },
  // ── Dây curoa ──
  'Gates':        { site: 'https://www.gates.com', finder: 'https://navigates.gates.com', cross: 'https://navigates.gates.com', note: 'NaviGates: tra theo xe & mã đối thủ, có sơ đồ' },
  'Bando':        { site: 'https://www.bandousa.com', finder: 'https://www.bandousa.com/aftermarket/', cross: '', note: 'Catalogue dây curoa theo xe' },
  'Mitsuboshi':   { site: 'https://www.mitsuboshi.com', finder: 'https://catalog.mitsuboshi.com', cross: '', note: 'e-catalog dây curoa' },
  'Dayco':        { site: 'https://www.dayco.com', finder: 'https://aftermarket.dayco.com/catalogue/', cross: '', note: 'Catalogue theo xe' },
  'Contitech':    { site: 'https://www.continental-aftermarket.com', finder: 'https://www.continental-aftermarket.com/en-gl/catalog/', cross: '', note: 'Catalogue ContiTech theo xe' },
  // ── Má phanh / Đĩa phanh ──
  'Akebono':      { site: 'https://www.akebonobrakes.com', finder: 'https://akebonobrakes.mypartfinder.com/', cross: 'https://www.partcat.com/akebono', note: 'Web catalog tra theo xe' },
  'Advics':       { site: 'https://www.advicsaftermarket.com', finder: 'https://www.advicsaftermarket.com/catalog/', cross: '', note: 'Catalog phanh Advics theo xe' },
  'Nisshinbo':    { site: 'https://www.nisshinbo-brake.com', finder: 'https://www.nisshinbo-brake.com/en/products/', cross: '', note: 'Danh mục má phanh' },
  'Bendix':       { site: 'https://www.bendix.com.au', finder: 'https://www.bendix.com.au/find-part', cross: '', note: 'Find A Part theo xe (thị trường Úc/ĐNÁ)' },
  'TRW':          { site: 'https://www.trwaftermarket.com', finder: 'https://www.trwaftermarket.com/en/catalogue/', cross: '', note: 'Catalogue TRW theo xe' },
  'Brembo':       { site: 'https://www.brembo.com', finder: 'https://aftermarket.brembo.com/en/catalogue', cross: '', note: 'Catalogue Brembo theo xe' },
  'ATE':          { site: 'https://www.ate-brakes.com', finder: 'https://www.ate.de/en/products/', cross: '', note: 'Catalogue ATE (Continental)' },
  'DBA':          { site: 'https://www.dba.com.au', finder: 'https://www.dba.com.au/car-search/', cross: '', note: 'Car Search theo xe' },
  // ── Giảm xóc ──
  'KYB (Kayaba)': { site: 'https://www.kyb.com', finder: 'https://www.kyb.com/catalog/', cross: 'https://showmetheparts.com/kybmobile/', note: 'Tra theo xe/VIN/biển số & mã' },
  'Tokico':       { site: 'https://www.tokico.jp', finder: 'https://www.hitachiastemo.com/en/products/', cross: '', note: 'Danh mục giảm xóc' },
  'Sachs':        { site: 'https://www.zf.com', finder: 'https://aftermarket.zf.com/go/en/sachs/catalog/', cross: '', note: 'Catalogue SACHS (ZF) theo xe' },
  'Bilstein':     { site: 'https://www.bilstein.com', finder: 'https://www.bilstein.com/en/product-finder/', cross: '', note: 'Product Finder theo xe' },
  'Monroe':       { site: 'https://www.monroe.com', finder: 'https://www.monroe.com/en-us/find-my-part/', cross: '', note: 'Find My Part theo xe' },
  // ── Rotuyn / Cao su / Bạc đạn ──
  '555 (Sankei)': { site: 'http://www.sankei-555.com', finder: 'http://www.sankei-555.co.jp/products', cross: '', note: 'Catalogue lái & treo theo xe (made in Japan)' },
  'CTR':          { site: 'https://www.ctr.co.kr', finder: 'https://www.ctr.co.kr/eng/product/', cross: '', note: 'Catalogue treo/lái theo xe (Hàn)' },
  'GMB':          { site: 'https://www.gmb.net', finder: 'https://www.gmb.net/catalog/', cross: '', note: 'Catalogue rotuyn/bạc đạn/bơm nước' },
  'Moog':         { site: 'https://www.moogparts.com', finder: 'https://www.moogparts.com/find-a-part.html', cross: '', note: 'Find A Part theo xe' },
  'Febest':       { site: 'https://www.febest.com', finder: 'https://www.febest.com/en/catalog/', cross: '', note: 'Catalogue cao su/bạc theo xe' },
  // ── Bơm nước / Két nước ──
  'Aisin':        { site: 'https://aisinaftermarket.com', finder: 'https://www.aisinaftermarket.com/online', cross: '', note: 'e-catalog Aisin theo xe' },
  'Koyorad':      { site: 'https://www.koyorad.com', finder: 'https://www.koyorad.com/catalog/', cross: '', note: 'Catalogue két nước theo xe' },
  'Nissens':      { site: 'https://www.nissens.com', finder: 'https://www.nissens.com/en/catalogue', cross: '', note: 'Catalogue làm mát/điều hòa theo xe' },
  'K&N':          { site: 'https://www.knfilters.com', finder: 'https://www.knfilters.com/search/finder.aspx', cross: '', note: 'Tra lọc gió theo xe' },
}

// Chuẩn hóa tên brand để tra BRAND_CATALOGUES (bỏ phần trong ngoặc, gốc chính hãng...).
function catalogueFor(brandName) {
  if (BRAND_CATALOGUES[brandName]) return BRAND_CATALOGUES[brandName]
  // thử khớp phần đầu trước dấu '/' hoặc '('
  const base = brandName.split(/[\/(]/)[0].trim()
  for (const k in BRAND_CATALOGUES) {
    if (k.split(/[\/(]/)[0].trim() === base) return BRAND_CATALOGUES[k]
  }
  return null
}

// ── DANH MỤC PHỤ TÙNG THEO NHÓM + CHU KỲ THAY + THÔNG SỐ CHUNG ──────────────
// Áp dụng chung cho xe du lịch động cơ xăng phổ thông. Xe diesel / bán tải có
// thể khác (ghi chú riêng ở 'note').
const PART_CATALOG = {
  'loc': { // Bộ phận lọc
    label: 'Bộ phận lọc',
    items: [
      {
        key: 'loc-dau', name: 'Lọc dầu động cơ', group: 'loc',
        interval: 'Mỗi 5.000 km (cùng lúc thay dầu nhớt)',
        spec: 'Lọc giấy, van bypass mở ở chênh áp ~0.7–1.0 bar, giữ hạt bẩn tới ~25 micron. Loại lọc rời (cartridge) hoặc lọc lon (spin-on) tùy đời máy.',
      },
      {
        key: 'loc-gio', name: 'Lọc gió động cơ', group: 'loc',
        interval: 'Vệ sinh mỗi 5.000 km · Thay mỗi 20.000 km (sớm hơn ở vùng bụi)',
        spec: 'Lõi giấy xếp nếp, lọc hạt bụi tới ~5 micron. Bẩn nặng làm hao xăng & yếu máy.',
      },
      {
        key: 'loc-cabin', name: 'Lọc gió điều hòa (cabin)', group: 'loc',
        interval: 'Thay mỗi 15.000–20.000 km hoặc 1 năm',
        spec: 'Loại giấy hoặc than hoạt tính (khử mùi, khử bụi mịn PM2.5). Nằm sau hộc đựng đồ táp-lô.',
      },
      {
        key: 'loc-nhien-lieu', name: 'Lọc nhiên liệu', group: 'loc',
        interval: 'Xăng: mỗi 40.000 km · Diesel: mỗi 10.000–20.000 km',
        spec: 'Xăng: độ lọc ~10 micron, bảo vệ kim phun. Diesel: có cốc lắng nước, độ lọc 2–5 micron. Xe đời mới lọc xăng thường nằm trong bình.',
      },
    ],
  },
  'dong-co': { // Phụ tùng động cơ + bảo dưỡng
    label: 'Phụ tùng động cơ',
    items: [
      {
        key: 'dau-nhot', name: 'Dầu nhớt động cơ', group: 'dong-co',
        interval: 'Nhớt khoáng: 5.000 km · Bán tổng hợp: 7.500 km · Tổng hợp: 10.000 km',
        spec: 'Độ nhớt phổ biến xe châu Á: 0W-20 / 5W-30 (xe đời mới, tiết kiệm xăng) hoặc 5W-40 / 10W-40 (xe đời cũ, máy dầu). Xem nắp dầu / sách xe.',
      },
      {
        key: 'bugi', name: 'Bugi đánh lửa', group: 'dong-co',
        interval: 'Bugi thường (Nickel): 20.000 km · Iridium/Platinum: 80.000–100.000 km',
        spec: 'Khe hở đánh lửa (gap) phổ biến 0.8–1.1 mm. Số lượng = số xy-lanh (4 hoặc 6). Iridium bền gấp 4–5 lần bugi thường.',
      },
      {
        key: 'day-curoa', name: 'Dây curoa (cam / tổng)', group: 'dong-co',
        interval: 'Dây cam (timing belt): 80.000–100.000 km · Dây tổng (lốc máy): 60.000–90.000 km',
        spec: 'Xe đời mới nhiều dòng dùng XÍCH CAM (timing chain — không cần thay định kỳ). Kiểm tra loại dây/xích theo đời máy trước khi tư vấn.',
      },
      {
        key: 'bom-nuoc-ket-nuoc', name: 'Bơm nước & Két nước làm mát', group: 'dong-co',
        interval: 'Bơm nước: 90.000–100.000 km (thường thay cùng dây cam) · Nước làm mát: 40.000 km / 2 năm',
        spec: 'Bơm nước dẫn động bằng dây cam hoặc dây tổng. Két nước nhôm/nhựa. Dùng nước làm mát (coolant) đúng màu hãng, không pha lẫn.',
      },
    ],
  },
  'phanh': { // Hệ thống phanh
    label: 'Hệ thống phanh',
    items: [
      {
        key: 'ma-phanh', name: 'Má phanh (trước & sau)', group: 'phanh',
        interval: 'Kiểm tra mỗi 10.000 km · Thay khi má mòn còn < 3mm (thường 30.000–50.000 km)',
        spec: 'Trước: đĩa (disc). Sau: đĩa hoặc tang trống (drum) tùy dòng. Chất liệu: ceramic (êm, ít bụi) / semi-metallic (bám tốt, giá rẻ).',
      },
      {
        key: 'dia-phanh', name: 'Đĩa phanh (rotor)', group: 'phanh',
        interval: 'Láng/thay khi đảo, mòn dưới độ dày tối thiểu (thường sau 2–3 lần thay má)',
        spec: 'Đĩa đặc hoặc đĩa thông gió (ventilated). Đường kính & độ dày tối thiểu dập trên thân đĩa. Đảo đĩa gây rung vô-lăng khi phanh.',
      },
    ],
  },
  'treo': { // Hệ thống treo & lái
    label: 'Hệ thống treo & lái',
    items: [
      {
        key: 'giam-xoc', name: 'Giảm xóc / Phuộc', group: 'treo',
        interval: 'Kiểm tra mỗi 40.000 km · Thay khi rò dầu, xe nhún dềnh, phanh gằn',
        spec: 'Loại thủy lực hai ống (twin-tube) hoặc một ống (monotube — tản nhiệt tốt hơn). Nên thay theo cặp (cùng trục).',
      },
      {
        key: 'rotuyn-cao-su', name: 'Rotuyn, cao su càng A, bạc đạn bánh', group: 'treo',
        interval: 'Kiểm tra mỗi 20.000 km · Thay khi có tiếng lọc cọc, rơ vô-lăng, lốp mòn lệch',
        spec: 'Gồm rotuyn lái (tie rod end), rotuyn trụ (ball joint), cao su càng A (control arm bushing), bạc đạn bánh (wheel bearing). Ảnh hưởng trực tiếp độ chụm & an toàn lái.',
      },
    ],
  },
  'dien': { // Điện - điện tử
    label: 'Điện - điện tử',
    items: [
      {
        key: 'bobine-cam-bien', name: 'Bobine đánh lửa & Cảm biến', group: 'dien',
        interval: 'Thay khi hỏng (không định kỳ). Bobine thường theo cụm mỗi xy-lanh.',
        spec: 'Bobine (ignition coil) đánh lửa trực tiếp lên bugi. Cảm biến phổ biến: oxy (lambda), trục cam/khuỷu, MAF/MAP, kích nổ. Mã theo đời máy & ECU.',
      },
    ],
  },
}

// ── MÃ OEM THAM CHIẾU THEO HÃNG (mẫu đã đối chiếu nguồn) ─────────────────────
// Chỉ liệt kê các mã tiêu biểu đã kiểm chứng hoặc theo quy luật đánh số của hãng.
// verified=true: đã đối chiếu nguồn chính hãng/đại lý. false: theo quy luật, cần check.
const OEM_REFERENCE = {
  'Toyota': {
    'loc-dau': [
      { part: '90915-YZZE1', fit: 'Lọc lon — Vios, Yaris, Corolla, Innova, Camry 2.0 (máy 1NZ/1ZZ/2AZ...)', verified: true },
      { part: '90915-YZZN1 / 90915-YZZJ1', fit: 'Một số đời máy khác — đối chiếu VIN', verified: true },
      { part: '04152-YZZA1 / 04152-37010', fit: 'Lọc rời (cartridge) — máy 2GR, 8AR, hybrid', verified: false },
    ],
    'loc-gio': [{ part: '17801-0M020 / 17801-21050 / 17801-0D060', fit: 'Tùy dòng (Vios/Yaris/Corolla) — đối chiếu đời', verified: false }],
    'bugi':    [{ part: 'Denso SC20HR11 / SK20R11 · NGK tương đương', fit: 'Iridium, khe hở ~1.1mm — đối chiếu đời máy', verified: false }],
    'note': 'Toyota mã lọc dầu bắt đầu 90915 (lọc lon) hoặc 04152 (lọc rời). Lọc gió 17801-xxxxx.',
  },
  'Honda': {
    'loc-dau': [
      { part: '15400-RTA-003', fit: 'Lọc lon — City, Civic, CR-V, HR-V, Jazz, Accord (thay cho 15400-PLM-A02)', verified: true },
      { part: '15400-PLM-A01 / A02', fit: 'Đời cũ, tương đương RTA-003', verified: true },
    ],
    'loc-gio': [{ part: '17220-xxxxx', fit: 'Theo dòng — VD City/Jazz 17220-5R0-008', verified: false }],
    'bugi':    [{ part: 'NGK/Denso Iridium theo máy L15/R18/K24', fit: 'Đối chiếu đời máy', verified: false }],
    'note': 'Honda mã lọc dầu 15400-xxx-xxx. Lọc gió 17220-xxx-xxx.',
  },
  'Mazda': {
    'loc-dau': [
      { part: 'PE01-14-302', fit: 'Máy SkyActiv-G 2.0/2.5 — Mazda3, Mazda6, CX-5, CX-8', verified: true },
      { part: '1WPE-14-302', fit: 'Mã tương đương (in trên hộp)', verified: true },
    ],
    'bugi': [{ part: 'PE5R-18-110A (NGK ILKAR7L11)', fit: 'SkyActiv-G, iridium, gap 1.1mm', verified: true }],
    'note': 'Mazda dùng mã dạng Xxxx-14-302 cho lọc dầu (số 14 = nhóm bôi trơn).',
  },
  'Mitsubishi': {
    'loc-dau': [{ part: 'MZ690116 / 1230A182 / MD360935', fit: 'Xpander/Attrage/Outlander tùy máy — đối chiếu VIN', verified: false }],
    'note': 'Mitsubishi mã có tiền tố MZ / MD / MR / 1230A. Nhiều mã dùng chung Ralliart.',
  },
  'Nissan': {
    'loc-dau': [{ part: '15208-65F0E / 15208-9F60A', fit: 'Almera/Sunny/X-Trail/Navara tùy máy', verified: false }],
    'note': 'Nissan mã lọc dầu 15208-xxxxx. Nhiều mã dùng chung với Renault (liên minh).',
  },
  'Suzuki': {
    'loc-dau': [{ part: '16510-61A31 / 16510-84A00', fit: 'Swift/Ertiga/XL7/Celerio tùy máy', verified: false }],
    'note': 'Suzuki mã lọc dầu 16510-xxxxx.',
  },
  'Isuzu': {
    'loc-dau': [{ part: '8-98018858-0 / 5-87610-071', fit: 'D-Max/MU-X máy diesel — đối chiếu đời', verified: false }],
    'loc-nhien-lieu': [{ part: '8-98159693-0', fit: 'Lọc dầu (diesel) D-Max/MU-X có cốc lắng nước', verified: false }],
    'note': 'Isuzu (diesel) mã dạng 8-xxxxxxxx-x. Chú ý lọc nhiên liệu diesel thay thường xuyên hơn.',
  },
  'Hyundai': {
    'loc-dau': [
      { part: '26300-35505', fit: 'Lọc lon — Accent, Elantra, Getz, i10... (thay cho -35504)', verified: true },
      { part: '26300-35503 / 26320-3C250', fit: 'Đời/máy khác — đối chiếu VIN', verified: false },
    ],
    'loc-gio': [{ part: '28113-xxxxx', fit: 'Theo dòng — đối chiếu đời', verified: false }],
    'note': 'Hyundai/Kia dùng chung nhiều mã (Mobis). Lọc dầu 26300-xxxxx. Lọc gió 28113-xxxxx.',
  },
  'Kia': {
    'loc-dau': [
      { part: '26300-35505', fit: 'Lọc lon — Morning, Rio, Cerato... (dùng chung Hyundai)', verified: true },
      { part: '26300-35540 / 26320-2M000', fit: 'Máy khác (Sorento/Carnival diesel) — đối chiếu VIN', verified: false },
    ],
    'note': 'Kia dùng chung mã Mobis với Hyundai. Luôn đối chiếu dung tích & đời máy.',
  },
  'Daewoo': {
    'loc-dau': [{ part: '25181616 / 96565412', fit: 'Matiz/Gentra/Lacetti — GM Daewoo', verified: false }],
    'note': 'Daewoo/GM mã dạng số thuần. Nhiều mã dùng chung Chevrolet.',
  },
}

// ── HÀM TRA CỨU TIỆN ÍCH ────────────────────────────────────────────────────
// Trả về toàn bộ phụ tùng đề xuất + hãng thay thế cho 1 hãng xe.
function getPartsForBrand(brand) {
  const oem = OEM_REFERENCE[brand] || {}
  const result = []
  for (const groupKey in PART_CATALOG) {
    const group = PART_CATALOG[groupKey]
    group.items.forEach(item => {
      result.push({
        group: group.label,
        name: item.name,
        interval: item.interval,
        spec: item.spec,
        oem: oem[item.key] || null,
        // Gắn kèm link catalogue tra cứu chính thức cho từng hãng thay thế
        aftermarket: (AFTERMARKET_BRANDS[item.key] || []).map(b => ({
          ...b, catalogue: catalogueFor(b.brand) || null,
        })),
      })
    })
  }
  return { brand, note: oem.note || '', parts: result }
}

// Trả về toàn bộ catalogue hãng aftermarket (để render trang "Tra mã chính hãng").
function getAllCatalogues() {
  return Object.keys(BRAND_CATALOGUES).map(brand => ({ brand, ...BRAND_CATALOGUES[brand] }))
}

// Export cho trình duyệt & Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PART_CATALOG, AFTERMARKET_BRANDS, OEM_REFERENCE, BRAND_CATALOGUES,
    getPartsForBrand, getAllCatalogues, catalogueFor, PARTS_LAST_UPDATED,
  }
}
