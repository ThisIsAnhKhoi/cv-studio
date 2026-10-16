# Nhật Ký Thay Đổi (Changelog)

Toàn bộ các thay đổi đáng chú ý của dự án **CV Studio / MyPortfolio** được ghi lại tại tài liệu này.  
Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/) và tuân thủ [Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-10-16

### Performance
- **Route-level Code-Splitting (`b43e9f9`)**: Phân mảnh bundle bằng `React.lazy()` và `<Suspense>` kèm `<PageSkeleton />` cho toàn bộ các route (`HomePage`, `CVViewPage`, `CVEditorPage`, `NotFoundPage`).
- **Cô lập thư viện nặng `html2pdf.js` (`b43e9f9`)**: Tách hoàn toàn `html2pdf.js` (669 kB) ra khỏi bundle chính bằng dynamic `import()`.
- **Cắt giảm 98.7% kích thước entry JS chính**: Entry chunk giảm từ **1,045.30 kB** xuống **13.65 kB (4.64 kB gzip)**. Tổng tải khởi tạo trang ban đầu chỉ còn **217 kB raw (68 kB gzip)**.
- **Tối ưu hóa Phông chữ WOFF2 & subsetting Tiếng Việt (`42299a5`)**: Loại bỏ 39 tệp `.otf` nặng nề (5.41 MB) trong `frontend/public/fonts/`. Tích hợp Google Fonts WOFF2 (`vietnamese,latin`) với preconnect và subsetting tải theo nhu cầu (< 400 kB initial font payload).
- **FontRegistry có kiểm soát**: Xây dựng `fontRegistry.ts` quản lý 7 phông tuyển chọn (`Montserrat`, `Be Vietnam Pro`, `Outfit`, `Inter`, `Playfair Display`, `Merriweather`, `Pacifico`) cùng bảng ánh xạ tương thích ngược (`Gilroy`, `iCiel Cubano`, `SVN-Optima`).

### Architecture & State Management
- **Chuyển dịch sang Zustand v5 Global Store (`d421bba`)**: Thiết lập `useCVStore.ts` thay thế state cục bộ, hỗ trợ lưu trữ phân lập theo ID hồ sơ, debounced auto-save (600ms), và migration dữ liệu tự động từ schema v1 lên v2.
- **Mẫu thiết kế Strangler Fig (`d421bba`)**: Giữ nguyên API của hook `useCVEditor` bọc quanh `useCVStore`, đảm bảo tương thích ngược 100% với toàn bộ components hiện hữu.

### Added
- **Tùy biến chi tiết theo từng khối (Section Customizer) (`966b427`)**: Cho phép người dùng tùy biến màu tiêu đề, màu chữ, màu nhấn và phông chữ riêng biệt cho từng phần trong 9 khối (Họ Tên, Liên Hệ, Tóm Tắt, Kinh Nghiệm, Học Vấn, Kỹ Năng, Dự Án, Thành Tựu, Chứng Chỉ).
- **Hệ thống CSS Custom Properties 100% Type-Safe**: Truyền các biến `--sec-heading-color`, `--sec-text-color`, `--sec-accent-color`, `--sec-heading-font`, `--sec-body-font` thông qua `styleHelpers.ts`, cascade mượt mà trên cả 3 template CV mà không phụ thuộc vào Tailwind class động.
- **Bộ kiểm tra tương phản màu WCAG 2.1 trực quan**: Tích hợp thuật toán tính toán độ chói tương đối và tỷ lệ tương phản WCAG 2.1 trong `color.ts` với huy hiệu cảnh báo (AA / AAA / Cần tăng tương phản).
- **Tính năng Đặt lại (Reset) & Áp dụng cho tất cả khối (Apply to All)**.
- **Bộ kiểm thử tự động mở rộng**: Tăng từ 15 tests lên **46 automated tests** (Pass 100%) bao phủ Store migration, Color validation, CSS style helpers, Font registry, và UI Panel interactions.

---

## [0.1.0] - 2026-10-13

### Security
- **Vá lỗ hổng Stored XSS (`f337732`)**: Tạo tiện ích `formatSafeUrl()` lọc và vô hiệu hóa các liên kết chứa scheme độc hại `javascript:`, `data:`, `vbscript:`. Bọc toàn bộ thẻ `<a>` trên cả 3 template CV.
- **Bảo mật bản nháp (`f337732`)**: Phân lập key lưu trữ `localStorage` theo từng ID hồ sơ (`cv_studio_draft_${id}`), loại bỏ nguy cơ ghi đè chéo dữ liệu giữa các hồ sơ khác nhau.

### Fixed
- **Khử hiện tượng Flash trắng khi reload trang (`20c45e5`)**: Nhúng script đồng bộ và Critical CSS tại `<head>` của `index.html` để gán màu nền `#020617` và class `.dark` trước khi vẽ DOM, loại bỏ triệt để FOUC.
- **Sửa lỗi điều hướng fallback 404 (`f337732`)**: Cập nhật `CVViewPage` và `CVEditorPage` hiển thị trang chuẩn `NotFoundPage` khi route ID không tồn tại trên hệ thống.
- **Chống tràn vỡ khung A4 (`f337732`)**: Bổ sung class `break-words` vào thẻ `h1` hiển thị Họ Tên trên cả 3 template CV.
- **Khắc phục xung đột CSS Dark Mode khi in ấn (`ec26185`)**: Tách biệt hoàn toàn khối in ấn A4 khỏi cascade dark mode toàn trang; sửa lỗi tương phản màu chữ và hover nút bấm.

### Added
- **Đủ 9 khối dữ liệu chuẩn trong Editor (`f337732`)**: Tạo mới component `AchievementsSection` (Thành Tựu & Giải Thưởng) và `CertificatesSection` (Chứng Chỉ Chuyên Ngành) kèm đầy đủ updaters.
- **Cấu hình Vercel SPA (`f337732`)**: Tạo `vercel.json` định tuyến toàn bộ request về `/index.html`.
- **Hạ tầng kiểm thử tự động Vitest (`f337732`)**: Tích hợp Vitest + Testing Library + JSDOM với bộ 15 unit tests tự động bao phủ URL sanitizer, draft isolation, updaters và search logic.

### Known Issues
- Hai lỗ hổng bảo mật mức Critical trong thư viện `html2pdf.js@0.10.2` và `jspdf@2.5.1` (BUG-005). Tính năng xuất PDF đang được tạm hoãn và sẽ chuyển sang Native CSS `@media print` ở Giai đoạn 5.

---

## [0.1.0-beta.2] - 2026-10-12

### Added
- **Trình biên tập CV trực quan (`13c6158`)**: Thiết kế giao diện chia 2 cột với panel Accordion điền form bên trái và khung Live Preview A4 bên phải.
- **Tự động lưu bản nháp (`13c6158`)**: Cơ chế auto-save debounce 600ms vào `localStorage` kèm thông báo trạng thái "Đang lưu..." / "Đã lưu tự động".
- **Bộ tùy biến phong cách (`13c6158`)**: Cho phép đổi trực tiếp mẫu CV, bảng màu accent (6 presets), phông chữ tiêu đề (5 fonts) và thu phóng khổ giấy (Zoom 50% - 120%).

---

## [0.1.0-beta.1] - 2026-10-12

### Added
- **Trang chủ Khám phá hồ sơ (`9842e3c`)**: Hero section, thanh tìm kiếm thời gian thực theo từ khóa họ tên/kỹ năng, và bộ lọc danh mục ngành nghề (Tech, Design, Data & AI, Marketing, HR).
- **Trang xem CV công khai (`9842e3c`)**: Hỗ trợ route `/cv/:id` và `/u/:id` hiển thị bản CV khổ A4 sắc nét, thanh công cụ chia sẻ liên kết và nút in ấn nhanh.

---

## [0.1.0-alpha.2] - 2026-10-12

### Added
- **Mẫu CV 2 - Warm Bold (`f7ed97a`)**: Bố cục khối hiện đại, tone màu cam Tangerine ấm áp, phù hợp cho Senior & Tech Lead.
- **Mẫu CV 3 - Modern Minimal (`f7ed97a`)**: Phong cách tối giản sang trọng, đường nét tinh tế, tập trung vào nội dung và độ thoáng mắt.
- **Template Registry (`f7ed97a`)**: Đăng ký và quản lý tập trung các mẫu CV, hỗ trợ chuyển đổi mẫu động mà không suy hao dữ liệu.

---

## [0.1.0-alpha.1] - 2026-10-12

### Added
- **Khởi tạo dự án (`c747093`)**: Thiết lập monorepo với Vite, React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Mẫu CV 1 - Classic Teal (`c747093`)**: Bố cục 2 cột sidebar xanh biển thanh lịch, hỗ trợ typography tiếng Việt.
- **Tích hợp phông chữ máy tính (`ee28790`, `44b5fd3`)**: Hỗ trợ font Việt hóa (`iCiel Cubano`, `SVN-Optima`, `Gilroy`, `Montserrat`) trong `public/fonts/`.
- **Tái cấu trúc thư mục (`2d922c9`)**: Phân tách rõ ràng `frontend/`, `backend/`, `docs/`, `references/`.
