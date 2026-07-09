import { slugify, CATEGORIES } from './lib/writer.js'
const cases = [
  ['Dấu Hiệu Má Phanh Cần Thay', 'dau-hieu-ma-phanh-can-thay'],
  ['Đèn Pha LED có tốt không?', 'den-pha-led-co-tot-khong'],
  ['Bảo dưỡng   Toyota  Fortuner', 'bao-duong-toyota-fortuner'],
]
let pass = 0
for (const [inp, exp] of cases) {
  const got = slugify(inp); const ok = got === exp; if (ok) pass++
  console.log((ok?'✓':'✗')+' "'+inp+'" -> "'+got+'"'+(ok?'':' (exp "'+exp+'")'))
}
console.log('\nCategories:', Object.keys(CATEGORIES).join(', '))
await import('./lib/writer.js'); console.log('✓ writer.js import OK')
await import('./lib/db.js');     console.log('✓ db.js import OK')
console.log('\n'+pass+'/'+cases.length+' slugify PASS')
