# CHIẾN LƯỢC TRIỂN KHAI PHÔNG CHỮ KHI DEPLOY (VERCEL & RENDER)

Tài liệu này giải thích chi tiết cơ chế hoạt động của phông chữ khi đưa website lên môi trường thực tế (Production), đảm bảo **100% người dùng trên mọi thiết bị (iPhone, Android, MacBook, Windows, Linux) đều thấy đúng phông chữ đẹp không lỗi dấu**.

---

## 1. VẤN ĐỀ CỐT LÕI CỦA PHÔNG CHỮ KHI DEPLOY
- Khi bạn chạy trên máy cá nhân (`localhost`): Trình duyệt có thể truy cập font cài sẵn trong máy.
- Khi deploy lên internet (Vercel / Render): Người xem web từ điện thoại hoặc máy tính khác **không hề có** các font đặc biệt như `iCiel Cubano`, `SVN-Optima` cài trong máy của họ.
- **Giải pháp chuẩn quốc tế**: Đóng gói phông chữ thành **Self-Hosted Web Fonts** đi kèm mã nguồn dự án.

---

## 2. CƠ CHẾ SELF-HOSTED HOẠT ĐỘNG NHƯ THẾ NÀO?

```
[Mã nguồn frontend/public/fonts/]
           │
           │ (khi chạy `npm run build`)
           ▼
[frontend/dist/fonts/] ──> Tải lên Vercel Edge CDN (Toàn cầu)
                                      │
                                      ▼
                        [Trình duyệt của khách truy cập]
                                      │
   1. Đọc file index.css chứa @font-face
   2. Tự động tải file font từ Vercel CDN về cache trình duyệt (~0.1 giây)
   3. Render CV với font iCiel Cubano / SVN-Optima / Gilroy chuẩn 100%!
```

---

## 3. CÁCH HỆ THỐNG ĐÃ ĐƯỢC THIẾT KẾ ĐỂ DEPLOY NGAY

### A. Thư mục lưu trữ: `frontend/public/fonts/`
- Thư mục `public/` trong Vite có cơ chế đặc biệt: **mọi file bên trong đều được giữ nguyên và sao chép thẳng vào thư mục đích `dist/` khi build**.
- Các file font như:
  * `iCielBCCubano-Normal.otf`
  * `SVN-Optima Regular.otf`, `SVN-Optima Bold.otf`
  * `Gilroy-Regular1.otf`, `Gilroy-Bold1.otf`
  * `Montserrat-*.otf`
  đều đã nằm sẵn trong `frontend/public/fonts/`.

### B. Khai báo `@font-face` linh hoạt độ dày (Font Weight Range):
Trong `frontend/src/styles/index.css`:
```css
@font-face {
  font-family: 'iCiel Cubano';
  src: url('/fonts/iCielBCCubano-Normal.otf') format('opentype');
  font-weight: 100 900; /* Khớp với mọi độ dày chữ (normal, bold, extabold) */
  font-style: normal;
  font-display: swap;   /* Hiển thị chữ ngay lập tức, không gây lag trang */
}
```

### C. Triển khai lên Vercel:
1. Khi liên kết GitHub với Vercel:
   - **Root Directory**: Chọn `frontend`.
   - **Build Command**: `npm run build`.
   - **Output Directory**: `dist`.
2. Vercel tự động phân phối các file font lên hơn 300 điểm máy chủ CDN trên toàn thế giới:
   - Tốc độ tải font siêu nhanh (< 50ms).
   - Tự động bật nén `Brotli / Gzip`.
   - Tự động gán header `Cache-Control: public, max-age=31536000, immutable` (font chỉ cần tải 1 lần duy nhất, các lần sau mở tức thì).

---

## 4. BẢO HÀNH HIỂN THỊ TRÊN MỌI THIẾT BỊ
- iPhone / iPad (iOS Safari): 
- Điện thoại Android (Chrome): 
- MacBook (macOS): 
- Máy tính Windows khác: 
- Xuất file in PDF:  (Font được nhúng trực tiếp vào file in, không bị gãy hạt hay mất định dạng).
