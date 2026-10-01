// Khối "Tổng quan sản phẩm" (gạch đầu dòng) cho trang chi tiết sản phẩm.
// san-pham-chi-tiet.html gọi buildProductOverview({...}) với dữ liệu Supabase.

;(function () {
  const PENDING = 'Đang cập nhật'

  // So khớp tên thông số không phân biệt hoa/thường, dấu
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').trim()
  const esc  = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

  // Nhóm thông số → các tên key tương ứng (đã chuẩn hoá)
  const FIELDS = {
    brand:    ['thuong hieu', 'hang san xuat', 'nha san xuat', 'hang'],
    origin:   ['xuat xu', 'noi san xuat', 'san xuat tai'],
    material: ['chat lieu', 'vat lieu'],
    oem:      ['ma phu tung oem', 'ma oem', 'ma oem tuong duong', 'ma oem tham khao', 'ma oem tham chieu', 'oem'],
    sku:      ['ma sku', 'ma san pham', 'sku'],
    position: ['vi tri lap dat', 'vi tri lap', 'vi tri'],
  }
  // Không đưa vào "Thông số chính" (đã có dòng riêng hoặc không phải thông số)
  const SKIP_IN_SPECS = ['bao hanh', 'tinh trang', 'dong xe tuong thich', 'tuong thich', 'loai phu tung']

  function pick(specs, keys) {
    const hit = specs.find(s => keys.includes(norm(s.key)))
    return hit ? hit.value : ''
  }

  function buildProductOverview({ name, specs = [], shortSpecs = [], vehicles = [], sku = '', brand = '' }) {
    specs = specs.filter(s => s && s.key && s.value)
    const used = new Set(Object.values(FIELDS).flat())

    const vBrand    = pick(specs, FIELDS.brand) || brand
    const vOrigin   = pick(specs, FIELDS.origin)
    const vMaterial = pick(specs, FIELDS.material)
    const vOem      = pick(specs, FIELDS.oem)
    const vSku      = sku || pick(specs, FIELDS.sku)
    const vPosition = pick(specs, FIELDS.position)

    let main = specs
      .filter(s => !used.has(norm(s.key)) && !SKIP_IN_SPECS.includes(norm(s.key)) && !norm(s.key).startsWith('ma oem'))
      .slice(0, 3)
      .map(s => `${esc(s.key)}: ${esc(s.value)}`)
    if (!main.length) main = shortSpecs.filter(Boolean).slice(0, 3).map(esc)

    const row = (label, value) => `<li><span class="pd-ov-label">${label}:</span> ${
      value ? `<span class="pd-ov-value">${esc(value)}</span>` : `<span class="pd-ov-pending">${PENDING}</span>`}</li>`

    const vehiclesText = vehicles.length
      ? vehicles.slice(0, 2).join('; ') + (vehicles.length > 2 ? ` (+${vehicles.length - 2} dòng khác)` : '')
      : ''

    return `
<div class="pd-overview">
  <p class="pd-overview-title">Tổng quan sản phẩm</p>
  <ul class="pd-overview-list">
    ${row('Tên sản phẩm', name)}
    ${row('Hãng', vBrand)}
    ${row('Xuất xứ', vOrigin)}
    ${row('Chất liệu', vMaterial)}
    <li><span class="pd-ov-label">Thông số chính:</span>${
      main.length ? `<ul class="pd-overview-sub">${main.map(m => `<li>${m}</li>`).join('')}</ul>`
                  : ` <span class="pd-ov-pending">${PENDING}</span>`}</li>
    ${vOem ? row('Mã OEM', vOem) : ''}
    ${vSku ? row('Mã SKU', vSku) : ''}
    ${vehiclesText ? row('Xe tương thích', vehiclesText) : ''}
    ${vPosition ? row('Vị trí lắp đặt', vPosition) : ''}
  </ul>
</div>`
  }

  window.buildProductOverview = buildProductOverview
})()
