-- Migration: Bảng tra cứu phụ tùng (cẩm nang phụ tùng)
-- Chạy trong Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS part_types (
  key text primary key,
  group_key text not null,
  group_label text not null,
  name text not null,
  replacement_interval text,
  spec text,
  sort_order int default 0
);

CREATE TABLE IF NOT EXISTS part_aftermarket_brands (
  id uuid default gen_random_uuid() primary key,
  part_type_key text references part_types(key) on delete cascade,
  brand text not null,
  country text,
  tier text check (tier in ('oe', 'premium', 'value')),
  note text,
  sort_order int default 0
);

CREATE TABLE IF NOT EXISTS oem_refs (
  id uuid default gen_random_uuid() primary key,
  car_brand text not null,
  part_type_key text references part_types(key) on delete cascade,
  part_number text not null,
  fitment text,
  verified boolean default false,
  sort_order int default 0
);

CREATE TABLE IF NOT EXISTS car_brand_notes (
  car_brand text primary key,
  note text
);

ALTER TABLE part_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE part_aftermarket_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE oem_refs ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_brand_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read part_types" ON part_types FOR SELECT USING (true);
CREATE POLICY "public read part_aftermarket_brands" ON part_aftermarket_brands FOR SELECT USING (true);
CREATE POLICY "public read oem_refs" ON oem_refs FOR SELECT USING (true);
CREATE POLICY "public read car_brand_notes" ON car_brand_notes FOR SELECT USING (true);
