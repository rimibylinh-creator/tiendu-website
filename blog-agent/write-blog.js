#!/usr/bin/env node
// write-blog.js — Sinh bài blog chuẩn SEO + lưu nháp
//
// Cách dùng:
//   node write-blog.js "chủ đề bài viết"
//   node write-blog.js "chủ đề" --cat=bao-duong        (gợi ý danh mục)
//   node write-blog.js "chủ đề" --dry                   (chỉ viết file, KHÔNG ghi Supabase)
//
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateArticle, CATEGORIES } from './lib/writer.js'
import { insertDraft, slugExists } from './lib/db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DRAFTS_DIR = path.join(__dirname, 'drafts')

function parseArgs(argv) {
  const args = { topic: '', cat: '', dry: false }
  const rest = []
  for (const a of argv.slice(2)) {
    if (a === '--dry') args.dry = true
    else if (a.startsWith('--cat=')) args.cat = a.slice(6)
    else rest.push(a)
  }
  args.topic = rest.join(' ').trim()
  return args
}

function log(...a) { console.log(...a) }
function ok(s)  { return '\x1b[32m' + s + '\x1b[0m' }
function warn(s){ return '\x1b[33m' + s + '\x1b[0m' }
function err(s) { return '\x1b[31m' + s + '\x1b[0m' }
function dim(s) { return '\x1b[2m'  + s + '\x1b[0m' }

// Ghép bài ra file HTML xem trước (giống layout trang chi tiết)
function previewHtml(a) {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${a.title}</title>
<style>
body{font-family:Inter,system-ui,sans-serif;max-width:760px;margin:40px auto;padding:0 24px;color:#252b42;line-height:1.85}
.meta{background:#fffef0;border:1px solid #f0e6b0;border-radius:8px;padding:14px 18px;font-size:13px;color:#555;margin-bottom:24px}
.meta b{color:#101010}
h1{font-size:32px;line-height:1.3;color:#101010}
.excerpt{font-size:17px;color:#555;font-style:italic;border-bottom:1px solid #e8e8e8;padding-bottom:24px;margin-bottom:24px}
h2{font-size:24px;margin:36px 0 14px;color:#101010}
h3{font-size:20px;margin:28px 0 10px;color:#101010}
blockquote{border-left:4px solid #fecd27;padding:12px 18px;background:#fffef0;border-radius:0 8px 8px 0;color:#555;font-style:italic}
table{width:100%;border-collapse:collapse;margin:20px 0}
th,td{padding:10px 14px;border:1px solid #e0e0e0;text-align:left}th{background:#f5f5f5}
a{color:#b45309}
</style></head><body>
<div class="meta">
  <b>DRAFT — Xem trước</b><br>
  Danh mục: <b>${CATEGORIES[a.category_slug] || a.category_slug}</b> ·
  Slug: <b>${a.slug}</b><br>
  Từ khóa chính: <b>${a.focus_keyword || '—'}</b><br>
  SEO: ${a.seo_notes || '—'}
</div>
<h1>${a.title}</h1>
<p class="excerpt">${a.excerpt}</p>
${a.content}
</body></html>`
}

async function main() {
  const { topic, cat, dry } = parseArgs(process.argv)

  if (!topic) {
    log(err('✗ Thiếu chủ đề.'))
    log('Cách dùng: node write-blog.js "chủ đề bài viết" [--cat=bao-duong] [--dry]')
    log('Danh mục hợp lệ: ' + Object.keys(CATEGORIES).join(', '))
    process.exit(1)
  }

  log(dim('→ Chủ đề: ') + topic)
  if (cat) log(dim('→ Gợi ý danh mục: ') + cat)
  log(dim('→ Đang gọi Claude viết bài chuẩn SEO...'))

  let article
  try {
    article = await generateArticle(topic, { categoryHint: cat })
  } catch (e) {
    log(err('✗ Lỗi khi sinh bài: ' + e.message))
    process.exit(1)
  }

  log(ok('✓ Đã viết xong bài:'))
  log('  Tiêu đề : ' + article.title)
  log('  Slug    : ' + article.slug)
  log('  Danh mục: ' + (CATEGORIES[article.category_slug] || article.category_slug))
  log('  Từ khóa : ' + (article.focus_keyword || '—'))
  log('  Độ dài  : ~' + article.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length + ' từ')

  // Lưu file preview + json local
  fs.mkdirSync(DRAFTS_DIR, { recursive: true })
  const htmlPath = path.join(DRAFTS_DIR, article.slug + '.html')
  const jsonPath = path.join(DRAFTS_DIR, article.slug + '.json')
  fs.writeFileSync(htmlPath, previewHtml(article), 'utf8')
  fs.writeFileSync(jsonPath, JSON.stringify(article, null, 2), 'utf8')
  log(ok('✓ File xem trước: ') + htmlPath)
  log(dim('  (mở file .html trên trình duyệt để đọc & duyệt)'))

  if (dry) {
    log(warn('◐ Chế độ --dry: KHÔNG ghi vào Supabase.'))
    return
  }

  // Kiểm tra trùng slug
  try {
    if (await slugExists(article.slug)) {
      article.slug = article.slug + '-' + Date.now().toString().slice(-4)
      log(warn('◐ Slug đã tồn tại → đổi thành: ' + article.slug))
    }
    const res = await insertDraft(article)
    log(ok('✓ Đã lưu NHÁP vào Supabase (is_published=false).'))
    log('  Post ID: ' + res.id)
    log('')
    log(dim('Bước tiếp theo:'))
    log('  1. Mở file .html ở trên để đọc/duyệt bài.')
    log('  2. (Tuỳ chọn) sửa nội dung trong Supabase hoặc admin.')
    log('  3. Xuất bản:  ' + ok('node publish-blog.js ' + article.slug))
  } catch (e) {
    log(err('✗ Lỗi ghi Supabase: ' + e.message))
    log(dim('  Bài vẫn được lưu ở file local. Kiểm tra SUPABASE_SERVICE_KEY trong .env.'))
    process.exit(1)
  }
}

main()
