# Tài Liệu Tra Cứu Số VIN Xe (Toàn Cầu)

> Tài liệu tham chiếu nội bộ cho Tiên Du — dùng để giải mã số VIN ra **Hãng + Dòng xe + Đời năm + Nơi sản xuất**.
> Chuẩn quốc tế: **ISO 3779** (cấu trúc VIN) & **ISO 3780** (mã nhà sản xuất WMI).
> Cập nhật: tháng 7/2026. Nguồn dữ liệu chính: Wikipedia/Wikibooks WMI registry, NHTSA vPIC.

---

## 1. VIN là gì?

**VIN** (Vehicle Identification Number — Số nhận dạng phương tiện) là dãy **17 ký tự** duy nhất mà nhà sản xuất gán cho mỗi chiếc xe, theo chuẩn **ISO 3779** (áp dụng bắt buộc từ năm 1981). VIN giống như "số căn cước" của xe: không xe nào trùng nhau.

**Quy tắc ký tự:**

- Chỉ gồm chữ in hoa `A–Z` và số `0–9`.
- **Không bao giờ chứa các chữ `I`, `O`, `Q`** — để tránh nhầm lẫn với số `1` và `0`.
- Đúng **17 ký tự** với xe sản xuất từ 1981 trở đi. Xe cũ hơn hoặc một số xe không xuất sang Mỹ có thể dùng "số khung" ngắn hơn, định dạng riêng của hãng.

**VIN nằm ở đâu trên xe:**

1. Chân cột A phía cửa lái (mở cửa lái, nhìn mép khung cửa).
2. Góc dưới bên trái kính chắn gió trước (nhìn từ ngoài vào).
3. Trên giấy đăng ký xe, giấy kiểm định, hợp đồng mua bán.
4. Khoang động cơ, hoặc dưới ghế phụ (tùy hãng).

---

## 2. Cấu trúc 17 ký tự

VIN chia làm 3 phần chính:

```
   W M I          V D S              V I S
 ┌───────┐  ┌───────────────┐  ┌───────────────────────┐
 1  2  3   4  5  6  7  8  9   10  11   12 13 14 15 16 17
 │─────│   │──────────────│   │   │    │─────────────────│
 Nhà SX    Đặc điểm xe      Chk Năm  NM   Số thứ tự sản xuất
 + Nước                     (9)  (10)(11)
```

| Vị trí | Tên | Ý nghĩa |
|--------|-----|---------|
| **1–3** | **WMI** — World Manufacturer Identifier | Nước sản xuất (ký tự 1) + Hãng xe (ký tự 2–3) |
| **4–8** | **VDS** — Vehicle Descriptor Section | Đặc điểm xe: dòng, kiểu thân, động cơ, hệ thống an toàn (mỗi hãng tự quy ước) |
| **9** | **Check digit** | Số kiểm tra — xác thực VIN có bị nhập sai không (bắt buộc ở Mỹ, Canada, Trung Quốc) |
| **10** | **Model Year** | Năm đời xe |
| **11** | **Plant code** | Nhà máy lắp ráp |
| **12–17** | **Sequential number** | Số thứ tự sản xuất (số seri riêng của xe) |

> **Lưu ý quan trọng:** Ký tự 4–8 (VDS) **không có chuẩn chung** — mỗi hãng tự mã hóa dòng xe theo cách riêng. Vì vậy để ra **chính xác dòng xe**, cần tra cơ sở dữ liệu của từng hãng (hoặc API NHTSA vPIC). WMI (ký tự 1–3) và Năm (ký tự 10) thì theo chuẩn quốc tế, giải mã được offline chính xác.

---

## 3. Ký tự 1 — Vùng / Nước sản xuất

Ký tự đầu tiên cho biết **khu vực** sản xuất; kết hợp 2 ký tự đầu cho biết **nước** cụ thể (theo ISO 3780, cập nhật 4/2019).

### Nhóm vùng theo ký tự đầu

| Ký tự đầu | Khu vực |
|-----------|---------|
| `A`–`C` | Châu Phi |
| `J`–`R` | **Châu Á** |
| `S`–`Z` | Châu Âu |
| `1`–`5`, `7` | Bắc Mỹ |
| `6` | Châu Đại Dương (Úc, New Zealand) |
| `8`–`9` | Nam Mỹ |

### Chi tiết các nước Châu Á (quan trọng cho thị trường VN)

| Mã (2 ký tự đầu) | Nước |
|------------------|------|
| `J` (mọi J**) | **Nhật Bản** |
| `KL`–`KR` | **Hàn Quốc** |
| `KF`–`KH` | Israel |
| `L` (mọi L**) | **Trung Quốc** |
| `MA`–`ME` | **Ấn Độ** |
| `MF`–`MK` | **Indonesia** |
| `ML`–`MR` | **Thái Lan** |
| `MS`–`MT` | Myanmar |
| `MX` | Kazakhstan |
| `PA`–`PE` | Philippines |
| `PL`–`PR` | Malaysia |
| `RF`–`RG` | **Đài Loan** |
| `RL`–`RN` | **Việt Nam** |
| `RA`–`RB` | UAE |

### Các nước Bắc Mỹ & Châu Âu thường gặp

| Mã | Nước |
|----|------|
| `1`, `4`, `5` | Mỹ |
| `2` | Canada |
| `3` | Mexico |
| `W` | Đức |
| `V` | Pháp / Tây Ban Nha |
| `S` | Anh |
| `Z` | Ý |
| `Y` | Thụy Điển / Phần Lan |
| `T` | Thụy Sĩ / Séc / Hungary |

> **Đây là điểm cần lưu ý:** một chiếc Toyota có thể mang WMI Nhật (`J`), Thái (`ML`–`MR`), Indonesia (`MF`–`MK`) hoặc Việt Nam (`RL`) tùy nơi lắp ráp. **Nước sản xuất = nơi lắp ráp, không phải quốc tịch thương hiệu.**

---

## 4. Ký tự 1–3 — Mã hãng WMI (các hãng phổ biến tại VN)

### Nhật Bản (ký tự đầu `J`)

| WMI | Hãng |
|-----|------|
| `JTD` `JTE` `JTF` `JTG` `JTK` `JTL` `JTM` `JTN` `JT1`–`JT5` | Toyota |
| `JTH` `JT6` `JT8` | Lexus (Toyota) |
| `JHM` `JH1` | Honda |
| `JN1` `JN6` `JN8` | Nissan / Infiniti |
| `JM1` `JM2` `JM6` `JM7` | Mazda |
| `JA3` `JA4` `JA7` `JMB` `JMY` | Mitsubishi |
| `JS1` `JS2` `JS3` `JS4` | Suzuki |
| `JF1` `JF2` `JF3` | Subaru |
| `JAA` `JAB` `JAL` | Isuzu |
| `JD1` `JD2` `JD4` `JDA` | Daihatsu |

### Hàn Quốc (ký tự đầu `K`)

| WMI | Hãng |
|-----|------|
| `KMH` `KM8` `KMC` `KMF` `KMJ` | Hyundai |
| `KMT` `KMU` | Genesis (Hyundai) |
| `KNA` `KNC` `KND` `KNE` `KNF` `KNG` | Kia |
| `KL1` `KL7` `KL8` `KLA` `KLY` | Chevrolet / GM Korea (Daewoo) |
| `KPA` `KPB` | SsangYong |
| `KNM` | Renault Samsung |

### Thái Lan (ký tự đầu `M`, mã `ML`–`MR`)

| WMI | Hãng |
|-----|------|
| `MR0` `MR1` `MR2` | Toyota Thái Lan |
| `MRH` | Honda Thái Lan |
| `MNT` | Nissan Thái Lan |
| `MMA` `MMB` `MMC` `MMD` `MMT` `ML3` | Mitsubishi Thái Lan |
| `MMS` | Suzuki Thái Lan |
| `MMR` | Subaru Thái Lan |
| `MMM` | Chevrolet Thái Lan |
| `MML` | MG Thái Lan (SAIC) |
| `MMF` | BMW Thái Lan |
| `MNA` `MNB` `MNC` `MPB` | Ford Thái Lan |
| `MPA` `MP1` `MP2` | Isuzu Thái Lan |
| `MNU` | Great Wall (GWM) Thái Lan |

### Indonesia (ký tự đầu `M`, mã `MF`–`MK`)

| WMI | Hãng |
|-----|------|
| `MHF` | Toyota Indonesia |
| `MHK` | Daihatsu / Toyota (Astra Daihatsu) |
| `MHR` | Honda Indonesia |
| `MHY` | Suzuki Indonesia |
| `MK2` | Mitsubishi Indonesia |
| `MK3` | Wuling (SGMW) Indonesia |
| `MF3` | Hyundai Indonesia |
| `MHL` | Mercedes-Benz Indonesia |

### Ấn Độ (ký tự đầu `M`, mã `MA`–`ME`)

| WMI | Hãng |
|-----|------|
| `MA3` | Maruti Suzuki |
| `MAL` | Hyundai Ấn Độ |
| `MAK` | Honda Ấn Độ |
| `MAJ` | Ford Ấn Độ |
| `MAT` | Tata Motors |
| `MBJ` | Toyota Kirloskar (Ấn Độ) |
| `MBR` | Mercedes-Benz Ấn Độ |
| `MZB` | Kia Ấn Độ |
| `MZ7` | MG Ấn Độ |

### Việt Nam (ký tự đầu `R`, mã `RL`–`RN`)

| WMI | Hãng |
|-----|------|
| `RLL` | **VinFast** (VINFAST Trading and Production JSC) |
| `RL4` | Toyota Motor Việt Nam |
| `RL0` | Ford Việt Nam |
| `RLH` | Honda Việt Nam |
| `RLE` | Isuzu Việt Nam |
| `RLM` | Mercedes-Benz Việt Nam |
| `RLA` | Mitsubishi (Vina Star Motors) |
| `RLC` | Yamaha Việt Nam (mô tô) |

### Trung Quốc (ký tự đầu `L`)

| WMI | Hãng |
|-----|------|
| `LFV` | FAW-Volkswagen |
| `LFP` `LFW` | FAW |
| `LGX` `LB2` | Geely / BYD |
| `LVS` `LVV` | Volvo (TQ) / Ford Changan |
| `LDN` | Soueast / Mitsubishi (TQ) |
| `LJ1` | JAC |
| `LUC` | Honda (TQ) |

### Châu Âu & Mỹ (thường gặp với xe nhập)

| WMI | Hãng |
|-----|------|
| `WAU` | Audi |
| `WBA` `WBS` `WBY` | BMW |
| `WDB` `WDC` `WDD` | Mercedes-Benz |
| `WVW` `WV1` `WV2` | Volkswagen |
| `WP0` `WP1` | Porsche |
| `VF1` `VF2` | Renault (Pháp) |
| `VF3` `VF7` | Peugeot / Citroën (Pháp) |
| `SAJ` | Jaguar |
| `SAL` | Land Rover |
| `1G1` | Chevrolet (Mỹ) |
| `1FA` `1FT` | Ford (Mỹ) |
| `1HG` `2HG` | Honda (Mỹ/Canada) |

---

## 5. Ký tự 10 — Đời năm (Model Year)

Mã năm lặp lại theo **chu kỳ 30 năm** (1980–2009, rồi 2010–2039...). Các ký tự **`I`, `O`, `Q`, `U`, `Z` và số `0`** không dùng cho mã năm.

| Mã | Năm | Mã | Năm | Mã | Năm |
|----|-----|----|-----|----|-----|
| `A` | 1980 / **2010** | `L` | 1990 / **2020** | `Y` | 2000 / **2030** |
| `B` | 1981 / **2011** | `M` | 1991 / **2021** | `1` | 2001 / 2031 |
| `C` | 1982 / **2012** | `N` | 1992 / **2022** | `2` | 2002 / 2032 |
| `D` | 1983 / **2013** | `P` | 1993 / **2023** | `3` | 2003 / 2033 |
| `E` | 1984 / **2014** | `R` | 1994 / **2024** | `4` | 2004 / 2034 |
| `F` | 1985 / **2015** | `S` | 1995 / **2025** | `5` | 2005 / 2035 |
| `G` | 1986 / **2016** | `T` | 1996 / **2026** | `6` | 2006 / 2036 |
| `H` | 1987 / **2017** | `V` | 1997 / **2027** | `7` | 2007 / 2037 |
| `J` | 1988 / **2018** | `W` | 1998 / **2028** | `8` | 2008 / 2038 |
| `K` | 1989 / **2019** | `X` | 1999 / **2029** | `9` | 2009 / 2039 |

### Cách phân biệt chu kỳ (1980–2009 hay 2010–2039)?

Với xe con và xe đa dụng (GVWR ≤ 4.500 kg), dùng **ký tự thứ 7** để xác định:

- Ký tự thứ 7 là **số** (`0`–`9`) → năm thuộc dải **1980–2009**.
- Ký tự thứ 7 là **chữ** (`A`–`Z`) → năm thuộc dải **2010–2039**.

Trong thực tế tại Việt Nam hiện nay (2026), gần như toàn bộ xe đang lưu hành thuộc dải **2010–2039**, nên khi thấy mã `T` thì hiểu là **2026**, không phải 1996.

> Ngoài Bắc Mỹ, ký tự thứ 10 thường là `0` (không mã hóa năm). Với xe Nhật/Hàn/Âu nhập không chính ngạch, năm có thể không đọc được từ ký tự 10 — khi đó cần tra thêm hoặc dựa vào giấy tờ xe.

---

## 6. Ký tự 9 — Check digit (số kiểm tra)

Bắt buộc với xe bán tại Mỹ, Canada, Trung Quốc (không bắt buộc ở Châu Âu). Dùng để phát hiện VIN nhập sai.

**Thuật toán tính:**

1. **Chuyển chữ thành số** (transliteration, dựa trên EBCDIC):

   | A=1 | B=2 | C=3 | D=4 | E=5 | F=6 | G=7 | H=8 |
   |-----|-----|-----|-----|-----|-----|-----|-----|
   | J=1 | K=2 | L=3 | M=4 | N=5 | P=7 | R=9 | |
   | S=2 | T=3 | U=4 | V=5 | W=6 | X=7 | Y=8 | Z=9 |

   (Số giữ nguyên giá trị. Lưu ý: `S=2` chứ không phải 1 — không tuyến tính.)

2. **Nhân với trọng số theo vị trí:**

   | Vị trí | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |
   |--------|---|---|---|---|---|---|---|---|---|----|----|----|----|----|----|----|----|
   | Trọng số | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 10 | 0 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 |

3. **Cộng tất cả tích số**, chia lấy dư cho **11**.

4. **Kết quả 0–9** → check digit phải khớp số đó. **Kết quả 10** → check digit phải là `X`.

Nếu không khớp → VIN nhập sai (hoặc VIN không chuẩn Bắc Mỹ).

> **Áp dụng thực tế:** Xe Châu Âu/Nhật/VN nhiều khi **không** dùng check digit đúng chuẩn Bắc Mỹ, nên nếu check digit "sai" thì **không** nên loại VIN ngay — vẫn thử giải mã WMI + Năm để hỗ trợ khách.

---

## 7. Quy trình giải mã (áp dụng cho trang tim-vin.html)

```
Người dùng nhập VIN
        │
        ├─ Chuẩn hóa: viết hoa, bỏ khoảng trắng/gạch, bỏ I,O,Q
        │
        ├─ Đủ 17 ký tự?
        │     │
        │     ├─ CÓ ─► [1] Thử NHTSA vPIC API (chính xác nhất về dòng xe)
        │     │           │
        │     │           ├─ Có Make + Model ─► Hiển thị đầy đủ (Hãng, Dòng, Năm, Nơi SX, động cơ...)
        │     │           │
        │     │           └─ Không có ─► [2] Fallback bảng offline:
        │     │                          • WMI (1–3) → Hãng + Nước
        │     │                          • Ký tự 10 → Năm (dùng ký tự 7 xác định chu kỳ)
        │     │                          • VDS (4–8) → gợi ý Dòng xe (bảng VN)
        │     │
        │     └─ KHÔNG (số khung ngắn) ─► Tra WMI offline, không suy ra năm/nước từ vị trí chuẩn
        │
        └─ Hiển thị kết quả + gợi ý gọi Tiên Du xác nhận phụ tùng theo mã OEM
```

**Nguyên tắc:** WMI + Năm + Nước = giải mã offline chính xác 100%. **Dòng xe** = ưu tiên NHTSA API; nếu thiếu thì dùng bảng VDS gợi ý (không đảm bảo tuyệt đối, luôn khuyên khách gọi xác nhận).

---

## 8. Ví dụ minh họa

**VIN mẫu: `MNCBJ3GJ0H5014215`** (Ford Ranger, xe phổ biến tại VN)

| Vị trí | Ký tự | Giải mã |
|--------|-------|---------|
| 1–3 | `MNC` | Ford — lắp ráp tại Thái Lan (AutoAlliance) |
| 4–8 | `BJ3GJ` | VDS: dòng Ranger, cấu hình động cơ (theo mã Ford) |
| 9 | `0` | Check digit |
| 10 | `H` | Năm **2017** (ký tự 7 là số `G`→ thực ra chữ, thuộc dải 2010–2039) |
| 11 | `5` | Nhà máy |
| 12–17 | `014215` | Số thứ tự |

**VIN mẫu VinFast: `RLL...`** → ký tự đầu `R` + `RL` = Việt Nam; `RLL` = VinFast.

---

## 9. Nguồn dữ liệu & lưu ý pháp lý

- **NHTSA vPIC** (`vpic.nhtsa.dot.gov`) — cơ sở dữ liệu miễn phí của Bộ Giao thông Mỹ, hỗ trợ hầu hết xe sản xuất từ 1981. Chính xác nhất cho dòng xe, động cơ, nhà máy. Xe chỉ bán ở Châu Á đôi khi thiếu dữ liệu dòng xe.
- **ISO 3779 / ISO 3780** — chuẩn quốc tế về cấu trúc VIN và mã WMI.
- **Wikibooks WMI registry** — danh sách mã WMI chi tiết theo hãng.

**Lưu ý khi dùng kết quả tra VIN để bán phụ tùng:**

1. Luôn **kiểm tra chéo VIN với giấy tờ xe** (đăng ký, đăng kiểm).
2. Cùng một dòng xe nhưng **khác phiên bản/đời** có thể dùng phụ tùng khác nhau → phải tra đúng **mã OEM**.
3. Kết quả tự động chỉ mang tính **tham khảo** — với đơn hàng phụ tùng, đội kỹ thuật Tiên Du nên xác nhận lại theo VIN đầy đủ.

---

*Tài liệu nội bộ Tiên Du — Phụ tùng ô tô Nha Trang · 0946.915.111*
