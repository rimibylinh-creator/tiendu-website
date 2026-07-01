-- Migration: Thêm các cột cho 3 tab trang chi tiết sản phẩm
-- Chạy trong Supabase Dashboard → SQL Editor

-- Tổng quan: đoạn mô tả ngắn hiện ở đầu trang chi tiết (trên tab)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS overview text;

-- Thông số kỹ thuật dạng bảng (tab "Thông số kỹ thuật")
-- Format: [{"key": "Vật liệu", "value": "Gốm ceramic"}, ...]
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS detailed_specs jsonb DEFAULT '[]'::jsonb;

-- Xe tương thích dạng mảng text (tab "Xe tương thích")
-- Format: ["Toyota Camry (2012–2026)", "Toyota Vios (2014–2026)"]
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS compatible_vehicles text[];

-- Mã sản phẩm / SKU nội bộ (không hiển thị trên website, chỉ dùng trong admin)
-- Ví dụ: "OEM-BP001", "TD-MG-002" — lấy từ cột "Mã" trong file-kho-admin
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sku text;
