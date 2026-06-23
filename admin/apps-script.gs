// ============================================================
// TIÊN DU — Google Apps Script Web App
// Dán toàn bộ code này vào Extensions → Apps Script
// Deploy → Web App → Execute as: Me → Who has access: Anyone
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()

    if (data.action === 'updateProducts') {
      updateSheet(ss, 'SanPham', data.data, [
        'id','ten','danh_muc','hang','ma_oem','ma_hang',
        'gia','gia_si','ton_kho','anh','mo_ta','aftermarket','nam'
      ], p => [
        p.id, p.name, p.category, p.brand, p.oem, p.code,
        p.price, p.wholesale, p.stock, p.image, p.description, p.aftermarket, p.year
      ])
    }

    if (data.action === 'updateBanners') {
      updateSheet(ss, 'Banner', data.data, ['id','tieu_de','phu_de','cta','url','anh','hien_thi'],
        b => [b.id, b.title, b.subtitle, b.cta, b.url, b.image, b.active ? 'TRUE' : 'FALSE'])
    }

    if (data.action === 'updateBlog') {
      updateSheet(ss, 'Blog', data.data, ['id','tieu_de','danh_muc','ngay','tac_gia','tom_tat','anh','da_xuat_ban'],
        b => [b.id, b.title, b.category, b.date, b.author, b.excerpt, b.image, b.published ? 'TRUE' : 'FALSE'])
    }

    return json({ success: true, message: 'OK' })
  } catch(err) {
    return json({ success: false, error: err.message })
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Tiên Du API OK').setMimeType(ContentService.MimeType.TEXT)
}

function updateSheet(ss, sheetName, rows, headers, mapper) {
  let sheet = ss.getSheetByName(sheetName)
  if (!sheet) sheet = ss.insertSheet(sheetName)
  sheet.clearContents()
  sheet.appendRow(headers)
  rows.forEach(row => sheet.appendRow(mapper(row)))
  SpreadsheetApp.flush()
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
