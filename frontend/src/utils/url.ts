/**
 * Tiện ích xử lý và chuẩn hóa liên kết URL an toàn
 * Loại bỏ 100% rủi ro Stored XSS thông qua các giao thức nguy hiểm (javascript:, data:, vbscript:)
 */

export function formatSafeUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Chuẩn hóa chuỗi để phát hiện giao thức độc hại (loại bỏ ký tự điều khiển, khoảng trắng ẩn)
  const normalized = trimmed.toLowerCase().replace(/[\x00-\x1F\s]/g, '');

  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('file:')
  ) {
    console.warn(`[Bảo Mật] Chặn liên kết không an toàn: "${trimmed}"`);
    return '#';
  }

  // Cho phép giao thức hợp lệ cho liên hệ
  if (trimmed.startsWith('tel:') || trimmed.startsWith('mailto:')) {
    return trimmed;
  }

  // Đã có giao thức chuẩn http hoặc https
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Cho phép liên kết tương đối nội bộ
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed;
  }

  // Tự động bổ sung https:// cho các domain thông thường (github.com/abc, thanhtruc.dev)
  return `https://${trimmed}`;
}

export function cleanDisplayUrl(url?: string | null): string {
  if (!url) return '';
  return url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '');
}
