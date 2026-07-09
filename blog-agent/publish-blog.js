#!/usr/bin/env node
// publish-blog.js — Duyệt & xuất bản 1 bài nháp theo slug
//   node publish-blog.js <slug>
import 'dotenv/config'
import { publishBySlug } from './lib/db.js'

const slug = process.argv[2]
if (!slug) {
  console.log('\x1b[31m✗ Thiếu slug.\x1b[0m')
  console.log('Cách dùng: node publish-blog.js <slug>')
  console.log('Xem danh sách nháp: node list-drafts.js')
  process.exit(1)
}

try {
  const res = await publishBySlug(slug)
  console.log('\x1b[32m✓ Đã xuất bản:\x1b[0m ' + res.title)
  console.log('  Xem tại: https://ototiendu.com/tin-tuc-chi-tiet.html?slug=' + res.slug)
  console.log('  Bài giờ đã hiển thị trên trang Tin tức.')
} catch (e) {
  console.log('\x1b[31m✗ ' + e.message + '\x1b[0m')
  process.exit(1)
}
