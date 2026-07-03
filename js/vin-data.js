/* ============================================================
   VIN-DATA.JS — Bảng dữ liệu giải mã số VIN (chuẩn ISO 3779/3780)
   Dùng cho tim-vin.html. Giải mã offline: Hãng + Dòng + Năm + Nơi SX.
   Nguồn: Wikibooks WMI registry, Wikipedia VIN, NHTSA vPIC (7/2026).
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------------------------------------------------------
     1) MÃ HÃNG THEO WMI (ký tự 1–3) — KHÔNG trùng key
        Giá trị: { make: 'Tên hãng', country: 'Nước lắp ráp' }
     --------------------------------------------------------- */
  const WMI = {
    // ── NHẬT BẢN (J*) ─────────────────────────────────────
    JTB:{make:'Toyota',country:'Nhật Bản'}, JTD:{make:'Toyota',country:'Nhật Bản'},
    JTE:{make:'Toyota',country:'Nhật Bản'}, JTF:{make:'Toyota',country:'Nhật Bản'},
    JTG:{make:'Toyota',country:'Nhật Bản'}, JTK:{make:'Toyota',country:'Nhật Bản'},
    JTL:{make:'Toyota',country:'Nhật Bản'}, JTM:{make:'Toyota',country:'Nhật Bản'},
    JTN:{make:'Toyota',country:'Nhật Bản'}, JTP:{make:'Toyota',country:'Nhật Bản'},
    JT1:{make:'Toyota',country:'Nhật Bản'}, JT2:{make:'Toyota',country:'Nhật Bản'},
    JT3:{make:'Toyota',country:'Nhật Bản'}, JT4:{make:'Toyota',country:'Nhật Bản'},
    JT5:{make:'Toyota',country:'Nhật Bản'},
    JTH:{make:'Lexus',country:'Nhật Bản'}, JT6:{make:'Lexus',country:'Nhật Bản'},
    JT8:{make:'Lexus',country:'Nhật Bản'},
    JHM:{make:'Honda',country:'Nhật Bản'}, JH1:{make:'Honda',country:'Nhật Bản'},
    JH2:{make:'Honda',country:'Nhật Bản'}, JH4:{make:'Acura (Honda)',country:'Nhật Bản'},
    JN1:{make:'Nissan',country:'Nhật Bản'}, JN6:{make:'Nissan',country:'Nhật Bản'},
    JN8:{make:'Nissan',country:'Nhật Bản'}, JNK:{make:'Infiniti (Nissan)',country:'Nhật Bản'},
    JM1:{make:'Mazda',country:'Nhật Bản'}, JM2:{make:'Mazda',country:'Nhật Bản'},
    JM6:{make:'Mazda',country:'Nhật Bản'}, JM7:{make:'Mazda',country:'Nhật Bản'},
    JM0:{make:'Mazda',country:'Nhật Bản'}, JMZ:{make:'Mazda',country:'Nhật Bản'},
    JA3:{make:'Mitsubishi',country:'Nhật Bản'}, JA4:{make:'Mitsubishi',country:'Nhật Bản'},
    JA7:{make:'Mitsubishi',country:'Nhật Bản'}, JMB:{make:'Mitsubishi',country:'Nhật Bản'},
    JMY:{make:'Mitsubishi',country:'Nhật Bản'}, JE4:{make:'Mitsubishi',country:'Nhật Bản'},
    JS1:{make:'Suzuki',country:'Nhật Bản'}, JS2:{make:'Suzuki',country:'Nhật Bản'},
    JS3:{make:'Suzuki',country:'Nhật Bản'}, JS4:{make:'Suzuki',country:'Nhật Bản'},
    JF1:{make:'Subaru',country:'Nhật Bản'}, JF2:{make:'Subaru',country:'Nhật Bản'},
    JF3:{make:'Subaru',country:'Nhật Bản'},
    JAA:{make:'Isuzu',country:'Nhật Bản'}, JAB:{make:'Isuzu',country:'Nhật Bản'},
    JAL:{make:'Isuzu',country:'Nhật Bản'}, JAM:{make:'Isuzu',country:'Nhật Bản'},
    JD1:{make:'Daihatsu',country:'Nhật Bản'}, JD2:{make:'Daihatsu',country:'Nhật Bản'},
    JD4:{make:'Daihatsu',country:'Nhật Bản'}, JDA:{make:'Daihatsu',country:'Nhật Bản'},
    JYA:{make:'Yamaha',country:'Nhật Bản'},

    // ── HÀN QUỐC (K*) ─────────────────────────────────────
    KMH:{make:'Hyundai',country:'Hàn Quốc'}, KM8:{make:'Hyundai',country:'Hàn Quốc'},
    KMC:{make:'Hyundai',country:'Hàn Quốc'}, KMF:{make:'Hyundai',country:'Hàn Quốc'},
    KMJ:{make:'Hyundai',country:'Hàn Quốc'}, KME:{make:'Hyundai',country:'Hàn Quốc'},
    KMT:{make:'Genesis (Hyundai)',country:'Hàn Quốc'}, KMU:{make:'Genesis (Hyundai)',country:'Hàn Quốc'},
    KNA:{make:'Kia',country:'Hàn Quốc'}, KNC:{make:'Kia',country:'Hàn Quốc'},
    KND:{make:'Kia',country:'Hàn Quốc'}, KNE:{make:'Kia',country:'Hàn Quốc'},
    KNF:{make:'Kia',country:'Hàn Quốc'}, KNG:{make:'Kia',country:'Hàn Quốc'},
    KL1:{make:'Chevrolet (GM Korea)',country:'Hàn Quốc'}, KL3:{make:'Chevrolet (GM Korea)',country:'Hàn Quốc'},
    KL7:{make:'Chevrolet (GM Korea)',country:'Hàn Quốc'}, KL8:{make:'Chevrolet (GM Korea)',country:'Hàn Quốc'},
    KLA:{make:'Chevrolet (GM Korea)',country:'Hàn Quốc'}, KLY:{make:'Chevrolet (GM Korea)',country:'Hàn Quốc'},
    KPA:{make:'SsangYong',country:'Hàn Quốc'}, KPB:{make:'SsangYong',country:'Hàn Quốc'},
    KNM:{make:'Renault Samsung',country:'Hàn Quốc'},

    // ── THÁI LAN (ML–MR) ──────────────────────────────────
    MR0:{make:'Toyota',country:'Thái Lan'}, MR1:{make:'Toyota',country:'Thái Lan'},
    MR2:{make:'Toyota',country:'Thái Lan'}, MRH:{make:'Honda',country:'Thái Lan'},
    MNT:{make:'Nissan',country:'Thái Lan'},
    MMA:{make:'Mitsubishi',country:'Thái Lan'}, MMB:{make:'Mitsubishi',country:'Thái Lan'},
    MMC:{make:'Mitsubishi',country:'Thái Lan'}, MMD:{make:'Mitsubishi',country:'Thái Lan'},
    MMT:{make:'Mitsubishi',country:'Thái Lan'}, ML3:{make:'Mitsubishi',country:'Thái Lan'},
    MMS:{make:'Suzuki',country:'Thái Lan'}, MMR:{make:'Subaru',country:'Thái Lan'},
    MMM:{make:'Chevrolet',country:'Thái Lan'}, MML:{make:'MG (SAIC)',country:'Thái Lan'},
    MMF:{make:'BMW',country:'Thái Lan'}, MMU:{make:'Holden',country:'Thái Lan'},
    MNA:{make:'Ford',country:'Thái Lan'}, MNB:{make:'Ford',country:'Thái Lan'},
    MNC:{make:'Ford',country:'Thái Lan'}, MPB:{make:'Ford',country:'Thái Lan'},
    MPA:{make:'Isuzu',country:'Thái Lan'}, MP1:{make:'Isuzu',country:'Thái Lan'},
    MP2:{make:'Mazda (Isuzu SX)',country:'Thái Lan'}, MNU:{make:'Great Wall (GWM)',country:'Thái Lan'},
    MNK:{make:'Hino',country:'Thái Lan'},

    // ── INDONESIA (MF–MK) ─────────────────────────────────
    MHF:{make:'Toyota',country:'Indonesia'}, MHK:{make:'Daihatsu / Toyota',country:'Indonesia'},
    MHR:{make:'Honda',country:'Indonesia'}, MHY:{make:'Suzuki',country:'Indonesia'},
    MHL:{make:'Mercedes-Benz',country:'Indonesia'}, MK2:{make:'Mitsubishi',country:'Indonesia'},
    MK3:{make:'Wuling (SGMW)',country:'Indonesia'}, MF3:{make:'Hyundai',country:'Indonesia'},
    MJB:{make:'GM (Chevrolet)',country:'Indonesia'},

    // ── ẤN ĐỘ (MA–ME) ────────────────────────────────────
    MA3:{make:'Maruti Suzuki',country:'Ấn Độ'}, MAL:{make:'Hyundai',country:'Ấn Độ'},
    MAK:{make:'Honda',country:'Ấn Độ'}, MAJ:{make:'Ford',country:'Ấn Độ'},
    MAT:{make:'Tata Motors',country:'Ấn Độ'}, MBJ:{make:'Toyota (Kirloskar)',country:'Ấn Độ'},
    MBR:{make:'Mercedes-Benz',country:'Ấn Độ'}, MZB:{make:'Kia',country:'Ấn Độ'},
    MZ7:{make:'MG',country:'Ấn Độ'}, MEX:{make:'Škoda / VW',country:'Ấn Độ'},

    // ── VIỆT NAM (RL–RN) ──────────────────────────────────
    RLL:{make:'VinFast',country:'Việt Nam'},
    RL4:{make:'Toyota',country:'Việt Nam'},
    RL0:{make:'Ford',country:'Việt Nam'},
    RLH:{make:'Honda',country:'Việt Nam'},
    RLE:{make:'Isuzu',country:'Việt Nam'},
    RLM:{make:'Mercedes-Benz',country:'Việt Nam'},
    RLA:{make:'Mitsubishi (Vina Star)',country:'Việt Nam'},
    RLC:{make:'Yamaha',country:'Việt Nam'},

    // ── TRUNG QUỐC (L*) ───────────────────────────────────
    LFV:{make:'FAW-Volkswagen',country:'Trung Quốc'}, LFP:{make:'FAW',country:'Trung Quốc'},
    LFW:{make:'FAW JieFang',country:'Trung Quốc'}, LGX:{make:'BYD',country:'Trung Quốc'},
    LGB:{make:'Geely',country:'Trung Quốc'}, LDN:{make:'Soueast / Mitsubishi',country:'Trung Quốc'},
    LJ1:{make:'JAC',country:'Trung Quốc'}, LUC:{make:'Honda',country:'Trung Quốc'},
    LVS:{make:'Ford (Changan)',country:'Trung Quốc'}, LVV:{make:'Chery',country:'Trung Quốc'},
    LZW:{make:'Wuling (SAIC)',country:'Trung Quốc'}, LSG:{make:'Buick (SAIC-GM)',country:'Trung Quốc'},

    // ── CHÂU ÂU ────────────────────────────────────────────
    WAU:{make:'Audi',country:'Đức'}, WA1:{make:'Audi',country:'Đức'},
    WBA:{make:'BMW',country:'Đức'}, WBS:{make:'BMW M',country:'Đức'}, WBY:{make:'BMW i',country:'Đức'},
    WDB:{make:'Mercedes-Benz',country:'Đức'}, WDC:{make:'Mercedes-Benz',country:'Đức'},
    WDD:{make:'Mercedes-Benz',country:'Đức'}, W1K:{make:'Mercedes-Benz',country:'Đức'},
    WVW:{make:'Volkswagen',country:'Đức'}, WV1:{make:'Volkswagen',country:'Đức'},
    WV2:{make:'Volkswagen',country:'Đức'}, WP0:{make:'Porsche',country:'Đức'},
    WP1:{make:'Porsche',country:'Đức'},
    VF1:{make:'Renault',country:'Pháp'}, VF2:{make:'Renault',country:'Pháp'},
    VF3:{make:'Peugeot',country:'Pháp'}, VF7:{make:'Citroën',country:'Pháp'},
    SAJ:{make:'Jaguar',country:'Anh'}, SAL:{make:'Land Rover',country:'Anh'},
    TMB:{make:'Škoda',country:'Séc'}, ZFA:{make:'Fiat',country:'Ý'},
    ZAR:{make:'Alfa Romeo',country:'Ý'}, ZFF:{make:'Ferrari',country:'Ý'},

    // ── MỸ / BẮC MỸ ───────────────────────────────────────
    '1G1':{make:'Chevrolet',country:'Mỹ'}, '1GC':{make:'Chevrolet (Truck)',country:'Mỹ'},
    '1G6':{make:'Cadillac',country:'Mỹ'}, '1FA':{make:'Ford',country:'Mỹ'},
    '1FT':{make:'Ford (Truck)',country:'Mỹ'}, '1FM':{make:'Ford (SUV)',country:'Mỹ'},
    '1HG':{make:'Honda',country:'Mỹ'}, '2HG':{make:'Honda',country:'Canada'},
    '1N4':{make:'Nissan',country:'Mỹ'}, '5YJ':{make:'Tesla',country:'Mỹ'},
    '2T1':{make:'Toyota',country:'Canada'}, '3VW':{make:'Volkswagen',country:'Mexico'},
    '4T1':{make:'Toyota',country:'Mỹ'}, '5TD':{make:'Toyota',country:'Mỹ'},
  };

  /* ---------------------------------------------------------
     2) MÃ NƯỚC theo ký tự đầu (fallback khi WMI 3 ký tự chưa có)
        Tra theo 2 ký tự đầu trước, rồi 1 ký tự.
     --------------------------------------------------------- */
  // Dải 2 ký tự (ưu tiên) — theo ISO 3780
  const COUNTRY_2CHAR = [
    // Châu Á
    ['KL','KR','Hàn Quốc'], ['KF','KH','Israel'],
    ['MA','ME','Ấn Độ'], ['MF','MK','Indonesia'], ['ML','MR','Thái Lan'],
    ['MS','MT','Myanmar'], ['PA','PE','Philippines'], ['PL','PR','Malaysia'],
    ['RF','RG','Đài Loan'], ['RL','RN','Việt Nam'], ['RA','RB','UAE'],
    // Bắc Mỹ
    ['3A','3W','Mexico'],
    // Nam Mỹ
    ['8A','8E','Argentina'], ['8F','8G','Chile'], ['9A','9E','Brazil'],
    // Châu Âu
    ['SA','SM','Anh'], ['SN','ST','Đức'], ['SU','SZ','Ba Lan'],
    ['VF','VR','Pháp'], ['VS','VW','Tây Ban Nha'], ['ZA','ZR','Ý'],
    ['6A','6W','Úc'], ['6Y','61','New Zealand'],
  ];
  // 1 ký tự (fallback cuối)
  const COUNTRY_1CHAR = {
    '1':'Mỹ','4':'Mỹ','5':'Mỹ','2':'Canada','3':'Mexico',
    '6':'Úc / New Zealand','8':'Nam Mỹ','9':'Brazil',
    'J':'Nhật Bản','K':'Hàn Quốc','L':'Trung Quốc',
    'M':'Ấn Độ / Đông Nam Á','P':'Đông Nam Á','R':'Châu Á',
    'S':'Anh','T':'Trung Âu','V':'Pháp / Tây Ban Nha','W':'Đức',
    'X':'Nga','Y':'Bắc Âu','Z':'Ý',
    'A':'Nam Phi','B':'Châu Phi','C':'Châu Phi',
  };

  /* ---------------------------------------------------------
     3) BẢNG NĂM (ký tự 10) — có xử lý chu kỳ 30 năm
     --------------------------------------------------------- */
  // Base cho chu kỳ 2010–2039
  const YEAR_NEW = {
    A:2010,B:2011,C:2012,D:2013,E:2014,F:2015,G:2016,H:2017,J:2018,K:2019,
    L:2020,M:2021,N:2022,P:2023,R:2024,S:2025,T:2026,V:2027,W:2028,X:2029,
    Y:2030,'1':2031,'2':2032,'3':2033,'4':2034,'5':2035,'6':2036,'7':2037,'8':2038,'9':2039,
  };
  // Base cho chu kỳ 1980–2009
  const YEAR_OLD = {
    A:1980,B:1981,C:1982,D:1983,E:1984,F:1985,G:1986,H:1987,J:1988,K:1989,
    L:1990,M:1991,N:1992,P:1993,R:1994,S:1995,T:1996,V:1997,W:1998,X:1999,
    Y:2000,'1':2001,'2':2002,'3':2003,'4':2004,'5':2005,'6':2006,'7':2007,'8':2008,'9':2009,
  };

  /* ---------------------------------------------------------
     4) BẢNG DÒNG XE (VDS gợi ý) — chỉ áp dụng khi NHTSA thiếu dữ liệu
        Cấu trúc: { WMI_prefix: { 'khóa con trong ký tự 4-8': 'Tên dòng' } }
        Đây là GỢI Ý (không tuyệt đối) cho các dòng phổ biến tại VN.
        Khóa con so khớp bằng "bắt đầu bằng" trên đoạn ký tự 4-8.
     --------------------------------------------------------- */
  const VDS_HINTS = {
    // Toyota Thái Lan (bán tải/SUV phổ biến VN) — ký tự 4-8
    MR0:{ 'B':'Hilux / Fortuner (nhóm IMV)', 'E':'Yaris / Vios', 'H':'Corolla' },
    MR1:{ 'B':'Hilux / Fortuner', 'K':'Fortuner' },
    RL4:{ 'B':'Vios / Corolla (lắp ráp VN)', 'V':'Veloz / Avanza' },
    // Ford Thái Lan
    MNB:{ 'U':'Ranger', 'B':'Ranger', 'E':'Everest' },
    MNC:{ 'U':'Ranger', 'B':'Ranger', 'E':'Everest' },
    MNA:{ 'U':'Ranger', 'E':'Everest' },
    RL0:{ 'U':'Ranger (lắp ráp VN)' },
    // Mitsubishi
    MMT:{ 'K':'Triton / Pajero Sport' }, MMA:{ 'K':'Triton' },
    MK2:{ 'X':'Xpander' }, // Indonesia
    // Honda
    MRH:{ 'G':'Civic / City', 'R':'CR-V' }, RLH:{ 'G':'City / Civic (VN)' },
    // Hyundai / Kia
    KMH:{ 'C':'Accent / Elantra', 'J':'Tucson / Santa Fe' },
    KNA:{ 'B':'Morning / Soluto', 'J':'Seltos / Sportage' },
    // VinFast
    RLL:{ 'V':'VF e34 / VF 5 / VF 6 / VF 7 / VF 8 / VF 9' },
  };

  /* ---------------------------------------------------------
     5) HÀM GIẢI MÃ
     --------------------------------------------------------- */

  // Chuẩn hóa VIN: hoa, bỏ khoảng trắng & gạch nối
  function normalizeVIN(raw) {
    return (raw || '').toUpperCase().replace(/[\s-]/g, '');
  }

  // Lấy hãng + nước từ WMI (ký tự 1–3), fallback dải 2 ký tự rồi 1 ký tự
  function decodeWMI(vin) {
    const v = normalizeVIN(vin);
    const wmi3 = v.substring(0, 3);
    const wmi2 = v.substring(0, 2);
    const c1 = v.charAt(0);

    // Ưu tiên tra 3 ký tự (có cả hãng)
    if (WMI[wmi3]) {
      return { wmi: wmi3, make: WMI[wmi3].make, country: WMI[wmi3].country, matched: 'wmi3' };
    }
    // Tra nước theo dải 2 ký tự
    const country = countryFrom2Char(wmi2) || COUNTRY_1CHAR[c1] || null;
    return { wmi: wmi3, make: null, country, matched: country ? 'country' : 'none' };
  }

  // So khớp dải 2 ký tự: giả định chữ đứng trước số, 0 là số cuối
  function countryFrom2Char(two) {
    if (!two || two.length < 2) return null;
    for (const [lo, hi, name] of COUNTRY_2CHAR) {
      if (inRange(two, lo, hi)) return name;
    }
    return null;
  }

  // Kiểm tra two nằm trong [lo, hi] theo thứ tự VIN (A..Z rồi 1..9 rồi 0)
  function ord(ch) {
    if (ch >= 'A' && ch <= 'Z') return ch.charCodeAt(0) - 65;       // 0..25
    if (ch >= '1' && ch <= '9') return 26 + (ch.charCodeAt(0) - 49); // 26..34
    if (ch === '0') return 35;                                       // 0 cuối cùng
    return -1;
  }
  function inRange(two, lo, hi) {
    // so khớp trên ký tự thứ 2 (ký tự 1 phải bằng nhau)
    if (two[0] !== lo[0] || lo[0] !== hi[0]) return false;
    const t = ord(two[1]), l = ord(lo[1]), h = ord(hi[1]);
    return t >= l && t <= h;
  }

  // Giải mã năm từ ký tự 10, dùng ký tự 7 để chọn chu kỳ
  function decodeYear(vin) {
    const v = normalizeVIN(vin);
    if (v.length < 10) return null;
    const y = v.charAt(9);          // ký tự thứ 10 (index 9)
    const pos7 = v.charAt(6);       // ký tự thứ 7 (index 6)
    if (v.length < 17) return null; // năm chỉ có nghĩa với VIN 17 ký tự chuẩn
    // Chuẩn NHTSA: ký tự 7 là SỐ → dải 1980–2009; là CHỮ → dải 2010–2039.
    // Với thị trường VN 2026, ưu tiên dải mới nếu nhập nhằng.
    const isOldCycle = /[0-9]/.test(pos7);
    const table = isOldCycle ? YEAR_OLD : YEAR_NEW;
    return table[y] || null;
  }

  // Gợi ý dòng xe từ VDS (ký tự 4–8)
  function decodeModelHint(vin) {
    const v = normalizeVIN(vin);
    const wmi3 = v.substring(0, 3);
    const vds = v.substring(3, 8); // ký tự 4–8
    const table = VDS_HINTS[wmi3];
    if (!table) return null;
    for (const key of Object.keys(table)) {
      if (vds.startsWith(key)) return table[key];
    }
    return null;
  }

  // Xác thực check digit (chuẩn Bắc Mỹ). Trả về true/false/null(không áp dụng)
  const TRANSLIT = { A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,J:1,K:2,L:3,M:4,N:5,P:7,R:9,S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9 };
  const WEIGHTS = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  function validateCheckDigit(vin) {
    const v = normalizeVIN(vin);
    if (v.length !== 17) return null;
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const ch = v[i];
      const val = /[0-9]/.test(ch) ? parseInt(ch, 10) : (TRANSLIT[ch] ?? null);
      if (val === null) return null;
      sum += val * WEIGHTS[i];
    }
    const rem = sum % 11;
    const expected = rem === 10 ? 'X' : String(rem);
    return v[8] === expected;
  }

  // Giải mã tổng hợp (offline) — trả về object đầy đủ
  function decode(vin) {
    const v = normalizeVIN(vin);
    const wmiInfo = decodeWMI(v);
    return {
      vin: v,
      wmi: wmiInfo.wmi,
      make: wmiInfo.make,
      country: wmiInfo.country,
      year: decodeYear(v),
      modelHint: decodeModelHint(v),
      checkDigitValid: validateCheckDigit(v),
      matched: wmiInfo.matched,
    };
  }

  /* ---------------------------------------------------------
     6) EXPORT
     --------------------------------------------------------- */
  global.VINDATA = {
    WMI, COUNTRY_2CHAR, COUNTRY_1CHAR, YEAR_NEW, YEAR_OLD, VDS_HINTS,
    normalizeVIN, decodeWMI, decodeYear, decodeModelHint, validateCheckDigit, decode,
  };

})(typeof window !== 'undefined' ? window : globalThis);
