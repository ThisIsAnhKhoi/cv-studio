/**
 * Danh sách 63 Tỉnh/Thành phố tại Việt Nam và tiện ích tìm kiếm vị trí địa lý.
 */

export const VIETNAM_PROVINCES: string[] = [
  // Các đô thị trực thuộc trung ương & trung tâm kinh tế lớn (ưu tiên gợi ý đầu)
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Bà Rịa - Vũng Tàu',
  'Khánh Hòa (Nha Trang)',
  'Lâm Đồng (Đà Lạt)',
  'Thừa Thiên Huế',
  'Quảng Nam',

  // Các tỉnh thành miền Bắc
  'Bắc Giang',
  'Bắc Kạn',
  'Bắc Ninh',
  'Cao Bằng',
  'Điện Biên',
  'Hà Giang',
  'Hà Nam',
  'Hải Dương',
  'Hòa Bình',
  'Hưng Yên',
  'Lai Châu',
  'Lạng Sơn',
  'Lào Cai',
  'Nam Định',
  'Ninh Bình',
  'Phú Thọ',
  'Quảng Ninh',
  'Sơn La',
  'Thái Bình',
  'Thái Nguyên',
  'Tuyên Quang',
  'Vĩnh Phúc',
  'Yên Bái',

  // Các tỉnh thành miền Trung & Tây Nguyên
  'Bình Định',
  'Bình Thuận',
  'Đắk Lắk',
  'Đắk Nông',
  'Gia Lai',
  'Hà Tĩnh',
  'Kon Tum',
  'Nghệ An',
  'Ninh Thuận',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Ngãi',
  'Quảng Trị',
  'Thanh Hóa',

  // Các tỉnh thành miền Nam & Miền Tây
  'An Giang',
  'Bến Tre',
  'Bình Phước',
  'Cà Mau',
  'Đồng Tháp',
  'Hậu Giang',
  'Kiên Giang',
  'Long An',
  'Sóc Trăng',
  'Tây Ninh',
  'Tiền Giang',
  'Trà Vinh',
  'Vĩnh Long',
];

/**
 * Tạo liên kết trực tiếp mở tìm kiếm trên Google Maps
 */
export function getGoogleMapsUrl(locationQuery?: string): string {
  if (!locationQuery || !locationQuery.trim()) {
    return 'https://www.google.com/maps';
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    locationQuery.trim()
  )}`;
}
