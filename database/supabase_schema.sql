-- ============================================================
-- SUPABASE SCHEMA — ototiendu.com
-- Database cho catalog phụ tùng ô tô + tin tức
-- Chạy toàn bộ file này trong Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ============================================================

-- Bật extension cần thiết
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. BRANDS (hãng xe: Toyota, Honda, BMW...)
-- ------------------------------------------------------------
create table brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,           -- "Toyota"
  slug text not null unique,           -- "toyota"
  logo_url text,                       -- link ảnh logo trong /assets/brands/
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 2. CATEGORIES (loại phụ tùng: động cơ, phanh, treo...)
-- ------------------------------------------------------------
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,           -- "Hệ Thống Phanh"
  slug text not null unique,           -- "phanh"  (khớp ?category=phanh hiện tại)
  display_order int default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 3. PRODUCTS (sản phẩm / phụ tùng)
-- ------------------------------------------------------------
create table products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,                     -- "ma-phanh-gom-cao-cap" (khớp URL /san-pham/...)
  name text not null,                            -- "Má Phanh Gốm Cao Cấp"
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  compatible_year int,                           -- năm xe tương thích, ví dụ 2024
  price numeric(12,0) not null,                  -- giá VND, ví dụ 450000
  stock_status text not null default 'in_stock'  -- 'in_stock' | 'out_of_stock' | 'preorder'
    check (stock_status in ('in_stock','out_of_stock','preorder')),
  stock_quantity int default 0,
  short_specs text[],                            -- mảng bullet: ["Phanh trước / sau", "Độ bền cao gấp 3x"]
  description text,                              -- mô tả dài cho trang chi tiết
  thumbnail_url text,                            -- ảnh đại diện
  is_featured boolean default false,             -- hiển thị ở "Sản phẩm bán chạy"
  is_published boolean default true,             -- ẩn/hiện sản phẩm
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_products_category on products(category_id);
create index idx_products_brand on products(brand_id);
create index idx_products_published on products(is_published);

-- ảnh phụ (gallery) cho trang chi tiết sản phẩm
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  image_url text not null,
  display_order int default 0
);

-- ------------------------------------------------------------
-- 4. POST_CATEGORIES (chuyên mục bài viết: Bảo dưỡng, Phụ tùng, Kinh nghiệm, Tin ngành)
-- ------------------------------------------------------------
create table post_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 5. POSTS (Tin Tức & Mẹo Xe)
-- ------------------------------------------------------------
create table posts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,             -- "5-dau-hieu-thay-ma-phanh"
  title text not null,
  excerpt text,                          -- đoạn mô tả ngắn hiển thị ở danh sách
  content text,                          -- nội dung đầy đủ (có thể lưu markdown hoặc HTML)
  cover_image_url text,
  post_category_id uuid references post_categories(id) on delete set null,
  is_published boolean default true,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_posts_published on posts(is_published, published_at desc);

-- ------------------------------------------------------------
-- 6. updated_at tự động cập nhật
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

create trigger trg_posts_updated_at before update on posts
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Public (khách xem web) chỉ được ĐỌC sản phẩm/bài viết đã published.
-- Việc THÊM/SỬA/XÓA chỉ thực hiện qua Supabase Dashboard (Table Editor)
-- hoặc qua trang admin dùng service_role key — không lộ ra public.
-- ============================================================

alter table brands enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table post_categories enable row level security;
alter table posts enable row level security;

-- Cho phép đọc công khai (anon key) — dùng cho website hiển thị
create policy "public read brands" on brands for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read product_images" on product_images for select using (true);
create policy "public read post_categories" on post_categories for select using (true);

create policy "public read published products" on products
  for select using (is_published = true);

create policy "public read published posts" on posts
  for select using (is_published = true);

-- Không tạo policy INSERT/UPDATE/DELETE cho anon —
-- nghĩa là chỉ admin (Supabase Dashboard hoặc service_role key) mới sửa được dữ liệu.

-- ============================================================
-- SEED DATA — dữ liệu mẫu khớp với nội dung đang có trên ototiendu.com
-- ============================================================

insert into brands (name, slug) values
  ('Toyota','toyota'), ('Honda','honda'), ('BMW','bmw'),
  ('Hyundai','hyundai'), ('Mitsubishi','mitsubishi'), ('Nissan','nissan'),
  ('Lexus','lexus'), ('Mazda','mazda'), ('Mercedes-Benz','mercedes-benz'),
  ('Ford','ford'), ('Chevrolet','chevrolet');

insert into categories (name, slug, display_order) values
  ('Phụ Tùng Động Cơ','dong-co',1),
  ('Hệ Thống Phanh','phanh',2),
  ('Hệ Thống Treo & Lái','treo',3),
  ('Điện & Điện Tử','dien',4),
  ('Bộ Phận Lọc','loc',5),
  ('Lốp & La-zăng','lop',6),
  ('Thân Vỏ & Nội Thất','noi-that',7);

insert into post_categories (name, slug) values
  ('Bảo dưỡng','bao-duong'),
  ('Phụ tùng','phu-tung'),
  ('Kinh nghiệm','kinh-nghiem'),
  ('Tin ngành','tin-nganh');
