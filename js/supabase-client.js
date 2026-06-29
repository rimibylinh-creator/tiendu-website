// Supabase client + render helpers — ototiendu.com
const SUPABASE_URL  = 'https://kdqjhlpvxrpijeoibgki.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcWpobHB2eHJwaWplb2liZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1Mjc0NDYsImV4cCI6MjA5ODEwMzQ0Nn0.cm4yaxaZZi6zIbEij8MEZqfHj_EbVhwlOK93szN-rMQ'

const { createClient } = supabase
const db = createClient(SUPABASE_URL, SUPABASE_ANON)

// ── Fetch ──────────────────────────────────────────────────────

async function getProductBySlug(slug) {
  const { data, error } = await db
    .from('products')
    .select('*, brands(name, slug), categories(name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) { console.error('getProductBySlug:', error); return null; }
  return data
}

async function getRelatedProducts(categoryId, excludeSlug, limit = 4) {
  let q = db
    .from('products')
    .select('id, slug, name, price, stock_status, short_specs, thumbnail_url, brands(name, slug), categories(name, slug)')
    .eq('is_published', true)
    .neq('slug', excludeSlug)
    .limit(limit)
  if (categoryId) q = q.eq('category_id', categoryId)
  else q = q.eq('is_featured', true)
  const { data, error } = await q
  if (error) { console.error('getRelatedProducts:', error); return []; }
  return data || []
}

async function getProducts({ limit } = {}) {
  let q = db
    .from('products')
    .select('id, slug, name, price, stock_status, short_specs, thumbnail_url, brands(name, slug), categories(name, slug)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  if (error) console.error('getProducts:', error)
  return data || []
}

async function getFeaturedProducts() {
  const { data, error } = await db
    .from('products')
    .select('id, slug, name, price, stock_status, short_specs, thumbnail_url, brands(name, slug), categories(name, slug)')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
  if (error) console.error('getFeaturedProducts:', error)
  return data || []
}

async function getPosts({ limit } = {}) {
  let q = db
    .from('posts')
    .select('slug, title, excerpt, cover_image_url, published_at, post_categories(name, slug)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  if (error) console.error('getPosts:', error)
  return data || []
}

// ── Helpers ────────────────────────────────────────────────────

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.getDate() + ' tháng ' + (d.getMonth() + 1) + ', ' + d.getFullYear()
}

function stockLabel(status) {
  if (status === 'out_of_stock') return 'Hết hàng'
  if (status === 'preorder')     return 'Đặt trước'
  return 'Còn hàng'
}

// ── Render ─────────────────────────────────────────────────────

function renderProductCard(p, baseHref) {
  const brand    = p.brands?.name    || ''
  const catName  = p.categories?.name || ''
  const catSlug  = p.categories?.slug || ''
  const specs    = (p.short_specs || []).slice(0, 2)
  const specHTML = specs.map(s =>
    `<div class="product-desc-line"><span class="dot">·</span><span>${s}</span></div>`
  ).join('')
  const href = 'san-pham-chi-tiet.html?slug=' + p.slug
  return `
<article class="product-card" data-category="${catSlug}">
  <div class="product-card-image">
    <img src="${p.thumbnail_url}" alt="${p.name}" loading="lazy">
    <div class="product-tags">
      <div class="tag-group"><span class="chip chip-brand">${brand.toUpperCase()}</span></div>
      <span class="chip chip-category">${catName}</span>
    </div>
  </div>
  <div class="product-card-content">
    <p class="product-name">${p.name}</p>
    <div class="product-desc">${specHTML}</div>
    <div class="product-divider"></div>
    <div class="price-row">
      <span class="price">${formatPrice(p.price)}</span>
      <span class="stock-badge">${stockLabel(p.stock_status)}</span>
    </div>
    <a href="${href}" class="btn btn-yellow product-cta">Xem chi tiết →</a>
  </div>
</article>`
}

function renderBlogCard(p, baseHref) {
  const catName = p.post_categories?.name || ''
  const catSlug = p.post_categories?.slug || ''
  const href    = (baseHref || 'tin-tuc/') + p.slug + '.html'
  return `
<article class="blog-card" data-blog-cat="${catSlug}">
  <div class="blog-card-img">
    <img src="${p.cover_image_url}" alt="${p.title}" loading="lazy">
  </div>
  <div class="blog-card-body">
    <div class="blog-meta">
      <span class="blog-cat-chip">${catName}</span>
      <span class="blog-date">${formatDate(p.published_at)}</span>
    </div>
    <h3 class="blog-card-title">
      <a href="${href}">${p.title}</a>
    </h3>
    <p class="blog-card-excerpt">${p.excerpt || ''}</p>
    <a href="${href}" class="blog-read-more" style="font-size:13px">Đọc tiếp →</a>
  </div>
</article>`
}

function renderFeaturedBlog(p) {
  const catName = p.post_categories?.name || ''
  const catSlug = p.post_categories?.slug || ''
  return `
<div class="blog-featured" data-blog-cat="${catSlug}">
  <div class="blog-featured-image">
    <img src="${p.cover_image_url}" alt="${p.title}">
  </div>
  <div class="blog-featured-content">
    <div class="blog-meta">
      <span class="blog-cat-chip">${catName}</span>
      <span class="blog-date">${formatDate(p.published_at)}</span>
    </div>
    <h2 class="blog-title" style="font-size:30px">
      <a href="tin-tuc/${p.slug}.html">${p.title}</a>
    </h2>
    <p class="blog-excerpt">${p.excerpt || ''}</p>
    <a href="tin-tuc/${p.slug}.html" class="blog-read-more">Đọc tiếp →</a>
  </div>
</div>`
}

// ── Re-init tabs sau khi render động ──────────────────────────

function reinitProductTabs(gridId) {
  const grid = document.getElementById(gridId || 'productGrid')
  if (!grid) return
  const tabs = document.querySelectorAll('.tab-btn[data-filter]')

  function applyFilter(filter) {
    grid.querySelectorAll('.product-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none'
    })
  }

  tabs.forEach(tab => {
    // clone để xoá event listener cũ của main.js nếu có
    const fresh = tab.cloneNode(true)
    tab.parentNode.replaceChild(fresh, tab)
    fresh.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn[data-filter]').forEach(t => t.classList.remove('active'))
      fresh.classList.add('active')
      applyFilter(fresh.dataset.filter)
    })
  })

  // click card → link
  grid.querySelectorAll('.product-card').forEach(card => {
    const link = card.querySelector('.product-cta')
    if (!link) return
    card.addEventListener('click', e => {
      if (!e.target.closest('a, button')) window.location.href = link.href
    })
  })
}

function reinitBlogFilters() {
  const tabs      = document.querySelectorAll('.tab-btn[data-blog-filter]')
  const featWrap  = document.getElementById('blogFeatured')
  const grid      = document.getElementById('blogGrid')
  if (!tabs.length) return

  function applyFilter(filter) {
    if (featWrap) {
      const blogCat = featWrap.querySelector('[data-blog-cat]')?.dataset.blogCat
      featWrap.style.display = (filter === 'all' || blogCat === filter) ? '' : 'none'
    }
    if (grid) {
      grid.querySelectorAll('.blog-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.blogCat === filter) ? '' : 'none'
      })
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      applyFilter(tab.dataset.blogFilter)
    })
  })
}
