// Dữ liệu hãng xe / dòng xe / năm sản xuất — dùng cho bộ lọc "Dòng xe", "Năm xe"
// trên trang Sản phẩm. Ưu tiên các dòng xe châu Á phổ biến tại Việt Nam.
// Năm sản xuất tính từ 1990 trở đi (hoặc năm dòng xe ra mắt nếu sau 1990).

const VEHICLE_CURRENT_YEAR = new Date().getFullYear()

function vyrs(start, end) {
  end = end || VEHICLE_CURRENT_YEAR
  const out = []
  for (let y = end; y >= start; y--) out.push(y)
  return out
}

// Danh sách năm đầy đủ 1990 → hiện tại, dùng khi chưa chọn dòng xe cụ thể
const VEHICLE_YEARS_ALL = vyrs(1990)

const VEHICLE_MODELS = {
  // ── Nhật Bản ──────────────────────────────────────────────
  'Toyota': {
    'Vios': vyrs(2003), 'Corolla Altis': vyrs(1990), 'Corolla Cross': vyrs(2020),
    'Camry': vyrs(1990), 'Innova': vyrs(2006), 'Fortuner': vyrs(2005), 'Hilux': vyrs(1990),
    'Yaris': vyrs(2007), 'Wigo': vyrs(2018), 'Avanza': vyrs(2004), 'Rush': vyrs(2018),
    'Land Cruiser': vyrs(1990), 'Land Cruiser Prado': vyrs(1996), 'Hiace': vyrs(1990),
    'Zace': vyrs(1999, 2006), 'Crown': vyrs(1990), 'RAV4': vyrs(1994),
    'Veloz': vyrs(2022), 'Raize': vyrs(2021), 'Previa': vyrs(1990, 2006),
  },
  'Honda': {
    'City': vyrs(1996), 'Civic': vyrs(1990), 'Accord': vyrs(1990), 'CR-V': vyrs(1997),
    'HR-V': vyrs(2018), 'Jazz': vyrs(2003), 'Brio': vyrs(2018), 'Odyssey': vyrs(1994),
  },
  'Mazda': {
    'Mazda2': vyrs(2007), 'Mazda3': vyrs(2004), 'Mazda6': vyrs(2003), 'CX-3': vyrs(2017),
    'CX-5': vyrs(2013), 'CX-8': vyrs(2019), 'BT-50': vyrs(2007), 'Premacy': vyrs(1999),
  },
  'Mitsubishi': {
    'Xpander': vyrs(2018), 'Attrage': vyrs(2014), 'Outlander': vyrs(2007), 'Pajero': vyrs(1990),
    'Pajero Sport': vyrs(2009), 'Triton': vyrs(2006), 'Zinger': vyrs(2008, 2011), 'Grandis': vyrs(2004, 2011),
  },
  'Nissan': {
    'Almera': vyrs(2000), 'Navara': vyrs(2005), 'X-Trail': vyrs(2001), 'Terra': vyrs(2018),
    'Sunny': vyrs(1990), 'Kicks': vyrs(2021), 'Teana': vyrs(2004),
  },
  'Suzuki': {
    'Swift': vyrs(2005), 'Ertiga': vyrs(2015), 'XL7': vyrs(2020), 'Celerio': vyrs(2015),
    'Vitara': vyrs(1990), 'APV': vyrs(2005, 2018),
  },
  'Isuzu': {
    'D-Max': vyrs(2003), 'MU-X': vyrs(2014), 'Hi-Lander': vyrs(1998, 2007), 'Trooper': vyrs(1990, 2002),
  },
  'Daihatsu': { 'Terios': vyrs(2000), 'Xenia': vyrs(2004) },
  'Subaru': { 'Forester': vyrs(1997), 'XV': vyrs(2012), 'Outback': vyrs(1996), 'Impreza': vyrs(1993) },

  // ── Hàn Quốc ──────────────────────────────────────────────
  'Hyundai': {
    'i10': vyrs(2008), 'Grand i10': vyrs(2013), 'Accent': vyrs(1994), 'Elantra': vyrs(1990),
    'Tucson': vyrs(2004), 'Santa Fe': vyrs(2000), 'Kona': vyrs(2017), 'Creta': vyrs(2021),
    'Getz': vyrs(2002, 2011), 'Sonata': vyrs(1990), 'Starex': vyrs(1997), 'County': vyrs(1997),
  },
  'Kia': {
    'Morning': vyrs(2004), 'Cerato': vyrs(2004), 'K3': vyrs(2012, 2018), 'Seltos': vyrs(2020),
    'Sorento': vyrs(2002), 'Sportage': vyrs(1993), 'Soluto': vyrs(2019), 'Rio': vyrs(2000),
    'Carnival': vyrs(1998),
  },

  // ── Việt Nam ──────────────────────────────────────────────
  'VinFast': {
    'Fadil': vyrs(2018), 'Lux A2.0': vyrs(2019), 'Lux SA2.0': vyrs(2019),
    'VF e34': vyrs(2021), 'VF 5': vyrs(2023), 'VF 8': vyrs(2022), 'VF 9': vyrs(2022),
  },

  // ── Mỹ / Châu Âu ──────────────────────────────────────────
  'Daewoo': {
    'Matiz': vyrs(1998, 2010), 'Lanos': vyrs(1997, 2008), 'Nubira': vyrs(1997, 2011),
    'Gentra': vyrs(2005, 2011), 'Magnus': vyrs(2000, 2006),
  },
  'Chevrolet': {
    'Cruze': vyrs(2009, 2016), 'Lacetti': vyrs(2003, 2013), 'Aveo': vyrs(2002), 'Colorado': vyrs(2012),
    'Trailblazer': vyrs(2012), 'Spark': vyrs(1998), 'Captiva': vyrs(2006), 'Vivant': vyrs(2008, 2011),
  },
  'Ford': {
    'Ranger': vyrs(1998), 'Everest': vyrs(2003), 'Explorer': vyrs(1990), 'EcoSport': vyrs(2014),
    'Focus': vyrs(2000), 'Fiesta': vyrs(1990), 'Transit': vyrs(1990), 'Laser': vyrs(1990, 2002),
  },
  'BMW': { '3 Series': vyrs(1990), '5 Series': vyrs(1990), 'X5': vyrs(1999), 'X3': vyrs(2003), 'X1': vyrs(2009) },
  'Mercedes-Benz': { 'C-Class': vyrs(1993), 'E-Class': vyrs(1990), 'GLC': vyrs(2015), 'S-Class': vyrs(1990), 'GLE': vyrs(2015) },
  'Lexus': { 'RX': vyrs(1998), 'LX': vyrs(1996), 'ES': vyrs(1990), 'NX': vyrs(2014) },
  'Audi': { 'A4': vyrs(1994), 'A6': vyrs(1994), 'Q5': vyrs(2008), 'Q7': vyrs(2005) },
  'Land Rover': { 'Range Rover': vyrs(1990), 'Discovery': vyrs(1990), 'Defender': vyrs(1990) },
  'Mini': { 'Cooper': vyrs(2001), 'Countryman': vyrs(2010) },
  'Peugeot': { '3008': vyrs(2016), '5008': vyrs(2018), '2008': vyrs(2019), '408': vyrs(2023) },
  'Volkswagen': { 'Tiguan': vyrs(2016), 'Passat': vyrs(1990), 'Polo': vyrs(2010) },
}
