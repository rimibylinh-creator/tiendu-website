// lib/db.js — Kết nối Supabase (service_role) + thao tác bảng posts
import { createClient } from '@supabase/supabase-js'

let _db = null
export function getDb() {
  if (_db) return _db
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url) throw new Error('Thiếu SUPABASE_URL trong .env')
  if (!key) throw new Error('Thiếu SUPABASE_SERVICE_KEY trong .env (cần service_role key để ghi bài)')
  _db = createClient(url, key, { auth: { persistSession: false } })
  return _db
}

// Map slug danh mục → id (cache)
let _catMap = null
export async function getCategoryId(slug) {
  const db = getDb()
  if (!_catMap) {
    const { data, error } = await db.from('post_categories').select('id, slug')
    if (error) throw new Error('Lỗi đọc post_categories: ' + error.message)
    _catMap = {}
    data.forEach(c => { _catMap[c.slug] = c.id })
  }
  return _catMap[slug] || null
}

// Slug đã tồn tại chưa? (slug là UNIQUE)
export async function slugExists(slug) {
  const db = getDb()
  const { data, error } = await db.from('posts').select('slug').eq('slug', slug).maybeSingle()
  if (error) throw new Error('Lỗi kiểm tra slug: ' + error.message)
  return !!data
}

// Insert bài dạng DRAFT (is_published=false)
export async function insertDraft(article) {
  const db = getDb()
  const catId = await getCategoryId(article.category_slug)
  if (!catId) throw new Error('Không tìm thấy danh mục: ' + article.category_slug)

  const row = {
    slug:             article.slug,
    title:            article.title,
    excerpt:          article.excerpt,
    content:          article.content,
    cover_image_url:  article.cover_image_url || null,
    post_category_id: catId,
    is_published:     false,          // ← DRAFT: chờ duyệt
    published_at:     new Date().toISOString(),
  }

  const { data, error } = await db.from('posts').insert(row).select('id, slug').single()
  if (error) throw new Error('Lỗi insert bài: ' + error.message)
  return data
}

// Bật xuất bản theo slug
export async function publishBySlug(slug) {
  const db = getDb()
  const { data, error } = await db
    .from('posts')
    .update({ is_published: true, published_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('slug', slug)
    .select('id, slug, title')
    .single()
  if (error) throw new Error('Lỗi xuất bản: ' + error.message)
  return data
}

// Liệt kê bài nháp (chưa publish)
export async function listDrafts() {
  const db = getDb()
  const { data, error } = await db
    .from('posts')
    .select('slug, title, created_at, post_categories(name)')
    .eq('is_published', false)
    .order('created_at', { ascending: false })
  if (error) throw new Error('Lỗi liệt kê nháp: ' + error.message)
  return data || []
}
