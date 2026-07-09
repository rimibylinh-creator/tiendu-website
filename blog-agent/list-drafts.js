#!/usr/bin/env node
// list-drafts.js — Liệt kê các bài nháp đang chờ duyệt
import 'dotenv/config'
import { listDrafts } from './lib/db.js'

try {
  const drafts = await listDrafts()
  if (!drafts.length) {
    console.log('Không có bài nháp nào đang chờ duyệt.')
    process.exit(0)
  }
  console.log('\x1b[1mBài nháp đang chờ duyệt (' + drafts.length + '):\x1b[0m\n')
  drafts.forEach((d, i) => {
    const cat = d.post_categories?.name || '—'
    const date = new Date(d.created_at).toLocaleDateString('vi-VN')
    console.log(`${i + 1}. ${d.title}`)
    console.log(`   slug: \x1b[36m${d.slug}\x1b[0m  ·  ${cat}  ·  ${date}`)
    console.log(`   xuất bản: node publish-blog.js ${d.slug}\n`)
  })
} catch (e) {
  console.log('\x1b[31m✗ ' + e.message + '\x1b[0m')
  process.exit(1)
}
