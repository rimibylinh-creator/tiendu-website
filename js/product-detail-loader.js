// Cập nhật giá + trạng thái kho từ Supabase cho trang chi tiết sản phẩm
// Chạy sau khi trang HTML tĩnh đã render → Google vẫn đọc được nội dung tĩnh

;(async function () {
  const slug = document.body.dataset.productSlug
  if (!slug) return

  const SUPABASE_URL  = 'https://kdqjhlpvxrpijeoibgki.supabase.co'
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWpobHB2eHJwaWplb2liZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1Mjc0NDYsImV4cCI6MjA5ODEwMzQ0Nn0.cm4yaxaZZi6zIbEij8MEZqfHj_EbVhwlOK93szN-rMQ'

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?slug=eq.${slug}&select=price,stock_status&limit=1`,
    { headers: { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + SUPABASE_ANON } }
  )
  if (!res.ok) return
  const [product] = await res.json()
  if (!product) return

  // ── Cập nhật giá ────────────────────────────────────────────
  const priceEl = document.getElementById('productPrice')
  if (priceEl) {
    priceEl.textContent = new Intl.NumberFormat('vi-VN').format(product.price) + ' ₫'
  }

  // ── Cập nhật trạng thái kho ─────────────────────────────────
  const stockEl = document.getElementById('productStock')
  if (stockEl) {
    const labels = { in_stock: 'Còn hàng', out_of_stock: 'Hết hàng', preorder: 'Đặt trước' }
    stockEl.textContent = labels[product.stock_status] || 'Còn hàng'

    // Đổi màu badge
    stockEl.style.background = product.stock_status === 'out_of_stock' ? '#fee2e2'
                              : product.stock_status === 'preorder'     ? '#fef9c3'
                              : ''
    stockEl.style.color = product.stock_status === 'out_of_stock' ? '#dc2626'
                        : product.stock_status === 'preorder'     ? '#ca8a04'
                        : ''
  }

  // ── Cập nhật JSON-LD schema (Google re-render) ───────────────
  const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]')
  schemaScripts.forEach(s => {
    try {
      const json = JSON.parse(s.textContent)
      if (json['@type'] === 'Product' && json.offers) {
        json.offers.price = String(product.price)
        json.offers.availability = product.stock_status === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : product.stock_status === 'preorder'
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/InStock'
        s.textContent = JSON.stringify(json)
      }
    } catch (_) {}
  })
})()
