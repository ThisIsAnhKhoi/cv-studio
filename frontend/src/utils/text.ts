/**
 * Tiện ích xử lý chuỗi và làm sạch nội dung văn bản
 */

/**
 * Loại bỏ toàn bộ thẻ HTML và chuyển đổi các thực thể HTML thành văn bản thuần sạch.
 * Rất hữu ích cho các đoạn trích tóm tắt (snippet previews), SEO meta, tìm kiếm và thẻ hồ sơ.
 */
export function stripHtml(html?: string | null): string {
  if (!html || typeof html !== 'string') return '';

  return html
    // Thay thế các thẻ block / ngắt dòng bằng khoảng trắng để tránh dính chữ
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<br\s*[\/]?>/gi, ' ')
    // Loại bỏ tất cả thẻ HTML còn lại
    .replace(/<[^>]*>/g, '')
    // Giải mã các thực thể HTML phổ biến
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    // Thu gọn khoảng trắng thừa
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Cắt ngắn văn bản theo độ dài tối đa và thêm dấu ba chấm '...'
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Chuyển đổi chuỗi tiếng Việt có dấu thành không dấu chữ thường, phục vụ tìm kiếm thông minh.
 * Ví dụ: "Nguyễn Lê Thanh Trúc" -> "nguyen le thanh truc"
 */
export function removeVietnameseTones(str?: string | null): string {
  if (!str || typeof str !== 'string') return '';

  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}
