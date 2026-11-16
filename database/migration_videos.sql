-- Migration: Kho video "Tin vắn từ Tiên Du"
-- Chạy trong Supabase Dashboard → SQL Editor (chạy 1 lần, an toàn nếu chạy lại)
-- Không phụ thuộc extension/hàm có sẵn (dùng gen_random_uuid + hàm trigger riêng).

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                 -- "thay-ma-phanh-fortuner" → /tin-van/thay-ma-phanh-fortuner
  title text not null,
  description text,                          -- mô tả ngắn (trang video + schema VideoObject.description)
  transcript text,                           -- lời thoại / ý chính (AEO/GEO: AI trích dẫn được nội dung video)
  source text not null default 'file'        -- file | youtube | tiktok | facebook
    check (source in ('file','youtube','tiktok','facebook')),
  video_url text not null,                   -- file .mp4 (Supabase Storage) hoặc link YouTube/TikTok/Facebook
  thumbnail_url text,                        -- ảnh bìa dọc 9:16 (cần cho Google Video rich result)
  duration_seconds integer,                  -- độ dài (giây) → VideoObject.duration
  sort_order integer not null default 0,     -- số nhỏ hiện trước; bằng nhau thì video mới hơn lên trước
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_videos_published
  on public.videos(is_published, sort_order, published_at desc);

create or replace function public.videos_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_videos_updated_at on public.videos;
create trigger trg_videos_updated_at before update on public.videos
  for each row execute function public.videos_set_updated_at();

-- RLS: giống các bảng khác của admin (allow all — admin dùng anon key)
alter table public.videos enable row level security;
drop policy if exists "allow all videos" on public.videos;
create policy "allow all videos" on public.videos for all using (true) with check (true);

-- Storage bucket công khai chứa file video + ảnh bìa (admin upload trực tiếp)
-- Giới hạn 50MB/file (gói Free của Supabase). Nên nén mp4 H.264, dọc 9:16, ≤ 60 giây.
insert into storage.buckets (id, name, public, file_size_limit)
values ('videos', 'videos', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;

drop policy if exists "videos public read" on storage.objects;
create policy "videos public read" on storage.objects
  for select using (bucket_id = 'videos');

drop policy if exists "videos allow write" on storage.objects;
create policy "videos allow write" on storage.objects
  for all using (bucket_id = 'videos') with check (bucket_id = 'videos');

-- Làm mới cache schema của API (PostgREST) để bảng mới dùng được ngay
notify pgrst, 'reload schema';
