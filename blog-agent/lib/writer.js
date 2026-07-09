// lib/writer.js — Não của agent: gọi Claude API viết bài chuẩn SEO cho Tiên Du
import Anthropic from '@anthropic-ai/sdk'

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5'

// 4 danh mục hợp lệ (khớp bảng post_categories trên Supabase)
export const CATEGORIES = {
  'bao-duong':   'Bảo dưỡng',
  'kinh-nghiem': 'Kinh nghiệm',
  'phu-tung':    'Phụ tùng',
  'tin-nganh':   'Tin ngành',
}

// ── Thông tin thương hiệu, nhúng vào mọi bài để nhất quán ──────────
const BRAND = {
  name:    'Tiên Du Phụ Tùng Ô Tô',
  city:    'Nha Trang',
  phone:   '0946.915.111',
  zalo:    'https://zalo.me/0946915111',
  address: '37 Nguyễn Văn Hưởng, KDT VCN Phước Long, phường Nam Nha Trang, TP Nha Trang',
  hours:   '7:30 – 17:30 (Thứ 2 – Thứ 7)',
}

// ── System prompt: quy tắc SEO + giọng thương hiệu ─────────────────
const SYSTEM_PROMPT = `Bạn là chuyên gia content SEO tiếng Việt cho ${BRAND.name} — cửa hàng phụ tùng ô tô bán sỉ & lẻ tại ${BRAND.city}.

ĐỘC GIẢ: Chủ xe, thợ máy, chủ garage tại Việt Nam. Họ tìm kiếm trên Google các câu hỏi thực tế về bảo dưỡng, chọn phụ tùng, dấu hiệu hỏng hóc.

MỤC TIÊU MỖI BÀI:
1. Xếp hạng cao trên Google cho từ khóa mục tiêu (SEO on-page chuẩn).
2. Xây lòng tin để độc giả gọi/Zalo Tiên Du mua phụ tùng.

QUY TẮC SEO BẮT BUỘC:
- Tiêu đề (title): 50–60 ký tự, chứa từ khóa chính ở đầu, hấp dẫn (số liệu, câu hỏi, "cách"...).
- Slug: không dấu, kebab-case, ngắn gọn, chứa từ khóa chính. VD "dau-hieu-ma-phanh-can-thay".
- Excerpt (mô tả meta): 140–160 ký tự, chứa từ khóa chính, tóm tắt lợi ích, có tính mời gọi đọc.
- Nội dung: 900–1500 từ. Cấu trúc rõ ràng với nhiều thẻ H2/H3.
- Từ khóa chính xuất hiện tự nhiên trong: H1 (chính là title), đoạn mở đầu, ít nhất 2 thẻ H2, và đoạn kết.
- Có ít nhất 1 danh sách (ul/ol) và cân nhắc 1 bảng so sánh (table) nếu phù hợp.
- Chèn từ khóa phụ / từ đồng nghĩa (semantic SEO), tránh nhồi nhét từ khóa.
- Nhắc địa danh "${BRAND.city}" và tên "${BRAND.name}" một cách tự nhiên (local SEO), KHÔNG lạm dụng.
- Đoạn kết: có lời kêu gọi hành động (CTA) nhắc gọi ${BRAND.phone} hoặc Zalo Tiên Du.

QUY TẮC NỘI DUNG:
- Chính xác về kỹ thuật ô tô. KHÔNG bịa số liệu, giá cụ thể, hay thông số nếu không chắc — nói khoảng ước lượng hoặc khuyên liên hệ để báo giá.
- Giọng văn: chuyên nghiệp nhưng gần gũi, như một người thợ lành nghề đang tư vấn. Tránh sáo rỗng, tránh giọng quảng cáo lố.
- Viết cho người Việt đọc trên điện thoại: câu ngắn, đoạn ngắn (2–4 câu), dễ quét.

ĐỊNH DẠNG NỘI DUNG (content) — CỰC KỲ QUAN TRỌNG:
- Trả về HTML thuần cho phần thân bài, dùng CÁC THẺ: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <strong>, <a>.
- KHÔNG bọc trong <html>, <head>, <body>, <article>. KHÔNG thêm thẻ <h1> (title hiển thị riêng).
- KHÔNG thêm CSS inline, class, id, hay <style>. Trang web đã có sẵn style cho các thẻ này.
- Link nội bộ khi hợp lý: sản phẩm "san-pham.html", liên hệ "lien-he.html", tra cứu "tra-cuu.html".

ĐẦU RA: Trả về DUY NHẤT một object JSON hợp lệ (không kèm markdown, không giải thích), theo schema:
{
  "title": "string — tiêu đề bài, 50-60 ký tự",
  "slug": "string — không dấu kebab-case",
  "excerpt": "string — meta description 140-160 ký tự",
  "category_slug": "một trong: bao-duong | kinh-nghiem | phu-tung | tin-nganh",
  "content": "string — HTML thân bài theo quy tắc trên",
  "focus_keyword": "string — từ khóa SEO chính đã tối ưu",
  "seo_notes": "string — 1-2 câu giải thích chiến lược SEO của bài này"
}`

/**
 * Gọi Claude API viết 1 bài blog chuẩn SEO.
 * @param {string} topic - Chủ đề / yêu cầu người dùng nhập.
 * @param {object} opts  - { categoryHint?: string }
 * @returns {Promise<object>} object bài viết đã parse
 */
export async function generateArticle(topic, opts = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Thiếu ANTHROPIC_API_KEY trong .env')

  const client = new Anthropic({ apiKey })

  let userMsg = `Viết một bài blog chuẩn SEO về chủ đề sau:\n\n"${topic}"\n`
  if (opts.categoryHint && CATEGORIES[opts.categoryHint]) {
    userMsg += `\nGợi ý danh mục: ${CATEGORIES[opts.categoryHint]} (slug: ${opts.categoryHint}). Nếu không phù hợp, hãy tự chọn danh mục đúng nhất.`
  } else {
    userMsg += `\nTự chọn danh mục phù hợp nhất trong 4 danh mục cho phép.`
  }

  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMsg }],
  })

  const raw = resp.content.map(b => (b.type === 'text' ? b.text : '')).join('').trim()
  const article = parseJson(raw)

  validate(article)
  return article
}

// ── Parse JSON, chịu được trường hợp Claude bọc trong ```json ──────
function parseJson(raw) {
  let s = raw.trim()
  // bóc code fence nếu có
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) s = fence[1].trim()
  // cắt từ dấu { đầu tiên tới } cuối cùng
  const first = s.indexOf('{')
  const last  = s.lastIndexOf('}')
  if (first !== -1 && last !== -1) s = s.slice(first, last + 1)
  try {
    return JSON.parse(s)
  } catch (e) {
    throw new Error('Không parse được JSON từ Claude. Nội dung thô:\n' + raw.slice(0, 500))
  }
}

// ── Kiểm tra bài hợp lệ trước khi ghi DB ──────────────────────────
function validate(a) {
  const need = ['title', 'slug', 'excerpt', 'category_slug', 'content']
  for (const k of need) {
    if (!a[k] || typeof a[k] !== 'string' || !a[k].trim())
      throw new Error(`Bài viết thiếu trường bắt buộc: ${k}`)
  }
  if (!CATEGORIES[a.category_slug])
    throw new Error(`category_slug không hợp lệ: ${a.category_slug} (phải là một trong: ${Object.keys(CATEGORIES).join(', ')})`)
  // Chuẩn hóa slug lần cuối cho chắc
  a.slug = slugify(a.slug)
}

// ── Slugify tiếng Việt (phòng khi Claude trả slug còn dấu) ─────────
export function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export { BRAND }
