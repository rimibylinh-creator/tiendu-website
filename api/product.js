// Trang chi tiết sản phẩm render phía máy chủ — phục vụ tại /san-pham-chi-tiet.html?slug=…
// (rewrite trong vercel.json). Điền sẵn title / description / canonical / Open Graph /
// JSON-LD Product vào HTML gốc để Google không gộp các sản phẩm thành trang trùng lặp,
// và trả mã 404 thật khi sản phẩm không tồn tại hoặc đã bị ẩn trong admin.
// Phần nội dung hiển thị vẫn do js/supabase-client.js + trang mẫu dựng ở trình duyệt.
const fs = require('fs')
const path = require('path')

const SITE = 'https://ototiendu.com'
const SUPABASE_URL = 'https://kdqjhlpvxrpijeoibgki.supabase.co'
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWpobHB2eHJwaWplb2liZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1Mjc0NDYsImV4cCI6MjA5ODEwMzQ0Nn0.cm4yaxaZZi6zIbEij8MEZqfHj_EbVhwlOK93szN-rMQ'
const TEMPLATE = fs.readFileSync(path.join(__dirname, '_tpl', 'product-detail.html'), 'utf8')

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const jsonForScript = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
const formatPrice = p => new Intl.NumberFormat('vi-VN').format(p) + ' ₫'
const stripTags = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

// SKU phải là 1 mã sạch: lấy mã đầu tiên (tách theo "/"), bỏ chữ có dấu/ghi chú
const cleanSku = sku => String(sku || '').split('/')[0]
  .replace(/[^\x20-\x7E]\S*/g, ' ').trim().replace(/[\s-]+/g, '-').replace(/^-|-$/g, '')

function buildSchema(p, url) {
  const hasRealImage = p.thumbnail_url && !p.thumbnail_url.includes('nav-logo.png')
  if (!hasRealImage) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    url,
    image: p.thumbnail_url,
    description: stripTags(p.description) || ('Mua ' + p.name + ' tại Tiên Du Nha Trang.'),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: p.price,
      availability: p.stock_status === 'out_of_stock' ? 'https://schema.org/OutOfStock'
        : p.stock_status === 'preorder' ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'VN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 5,
        returnMethod: ['https://schema.org/ReturnInStore', 'https://schema.org/ReturnByMail'],
        returnFees: 'https://schema.org/ReturnShippingFees'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'VN' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 4, unitCode: 'DAY' }
        }
      },
      seller: {
        '@type': 'LocalBusiness',
        name: 'Tiên Du Phụ Tùng Ô Tô',
        telephone: '+84946915111',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '37 Nguyễn Văn Hưởng, KDT VCN Phước Long',
          addressLocality: 'Nha Trang',
          addressCountry: 'VN'
        }
      }
    }
  }
  const brand = p.brands?.name
  if (brand) schema.brand = { '@type': 'Brand', name: brand }
  const sku = cleanSku(p.sku)
  if (sku) schema.sku = sku
  return schema
}

function render(p, slug) {
  const url = SITE + '/san-pham-chi-tiet.html?slug=' + encodeURIComponent(slug)
  const title = p.name + ' — Tiên Du Phụ Tùng Ô Tô Nha Trang'
  const desc = 'Mua ' + p.name + ' tại Tiên Du Nha Trang. Giá ' + formatPrice(p.price) + '. Giao toàn quốc.'
  const img = p.thumbnail_url || SITE + '/assets/hero-bg.jpg'

  let html = TEMPLATE
  const setContent = (id, v) => {
    html = html.replace(new RegExp('(<meta id="' + id + '"[^>]*?content=")[^"]*(")'), (_, a, b) => a + esc(v) + b)
  }
  html = html.replace(/<title id="pageTitle">[^<]*<\/title>/, () => '<title id="pageTitle">' + esc(title) + '</title>')
  setContent('metaDesc', desc)
  setContent('ogUrl', url)
  setContent('ogTitle', title)
  setContent('ogDesc', desc)
  setContent('ogImage', img)
  setContent('twTitle', title)
  setContent('twDesc', desc)
  setContent('twImage', img)
  html = html.replace(/(<link id="canonical" rel="canonical" href=")[^"]*(")/, (_, a, b) => a + esc(url) + b)

  const schema = buildSchema(p, url)
  html = html.replace(/<script id="productSchema" type="application\/ld\+json">\{\}<\/script>/, () =>
    schema ? '<script id="productSchema" type="application/ld+json">' + jsonForScript(schema) + '</script>'
           : '<script id="productSchema" type="application/ld+json">{}</script>')

  // Nội dung tối thiểu cho người/bot không chạy JS
  const brandName = p.brands?.name ? ' · ' + esc(p.brands.name) : ''
  html = html.replace('<body>', () => '<body>\n<noscript><h1>' + esc(p.name) + '</h1><p>' + esc(formatPrice(p.price)) + brandName + '</p><p>' + esc(stripTags(p.description).slice(0, 300)) + '</p></noscript>')
  return html
}

async function fetchProduct(slug) {
  const q = '/rest/v1/products?select=*,brands(name,slug),categories(name,slug)&is_published=eq.true&limit=1&slug=eq.' + encodeURIComponent(slug)
  const r = await fetch(SUPABASE_URL + q, { headers: { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + SUPABASE_ANON } })
  if (!r.ok) throw new Error('Supabase ' + r.status)
  const rows = await r.json()
  return rows[0] || null
}

async function notFound(res) {
  let body = '<!doctype html><meta charset="utf-8"><title>404 — Không tìm thấy trang</title><p>Không tìm thấy trang.</p>'
  try {
    const r = await fetch(SITE + '/404')
    if (r.status === 404) body = await r.text()
  } catch (e) {}
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  res.status(404).send(body)
}

module.exports = async (req, res) => {
  const slug = String(req.query.slug || '').trim()
  if (!slug) { res.setHeader('Location', '/san-pham.html'); return res.status(302).end() }
  try {
    const product = await fetchProduct(slug)
    if (!product) return notFound(res)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(200).send(render(product, slug))
  } catch (e) {
    // Lỗi tạm thời: phục vụ trang mẫu (trình duyệt tự tải dữ liệu) và không cache
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(TEMPLATE)
  }
}
