# CV Studio — Nền Tảng Tạo & Quản Lý CV Cá Nhân Trực Tuyến

<p align="center">
  <strong>Tạo hồ sơ năng lực (CV/Portfolio) trực tuyến, tùy biến đa phong cách, tối ưu tiếng Việt và kiểm soát bố cục A4 chuẩn mực.</strong>
</p>

<p align="center">
  <a href="#trạng-thái-dự-án"><img src="https://img.shields.io/badge/Status-v0.4.0%20(95.2%25)-success?style=flat-square" alt="Status" /></a>
  <a href="#kiểm-thử-tự-động"><img src="https://img.shields.io/badge/Vitest-132%2F132%20Passed-brightgreen?style=flat-square" alt="Tests" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-0%20Errors-blue?style=flat-square" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" /></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=flat-square" alt="Firebase" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-61dafb?style=flat-square" alt="React" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square" alt="Tailwind CSS" /></a>
</p>

<p align="center">
  <a href="README.en.md"><strong>English Version (README.en.md)</strong></a> | <a href="#bắt-đầu-nhanh-trong-5-phút"><strong>Cài Đặt Nhanh</strong></a> | <a href="docs/ARCHITECTURE.md"><strong>Kiến Trúc</strong></a> | <a href="docs/QA_AUDIT_v2.md"><strong>Báo Cáo Kiểm Toán v2</strong></a> | <a href="CHANGELOG.md"><strong>Nhật Ký Thay Đổi</strong></a>
</p>

---

## 1. Tổng Quan Sản Phẩm

**CV Studio** là một nền tảng tạo và quản lý CV / Portfolio trực tuyến chuyên nghiệp, bảo mật và chuẩn in ấn A4 dành cho ứng viên và nhà tuyển dụng.

- **Vấn đề giải quyết**: Đa số công cụ tạo CV trực tuyến hiện nay thường gò bó trong định dạng cứng nhắc, font chữ lỗi dấu tiếng Việt, xuất file vỡ khung hình, hoặc yêu cầu trả phí để lưu trữ bản nháp.
- **Giải pháp**: Xây dựng một ứng dụng web hiện đại (Clean Architecture) với:
  - Xem trước thời gian thực (Live Preview) theo từng phím gõ.
  - Tách biệt nội dung dữ liệu (`CVData`) khỏi lớp hiển thị thông qua **Template Registry**.
  - Xác thực người dùng (Google 1-click & Email) và đồng bộ đám mây **Firebase Cloud Firestore**.
  - Phân quyền quản trị 3 cấp (RBAC), kiểm duyệt hồ sơ và nhật ký kiểm toán bất biến.
  - Bộ soạn thảo Rich Text (TipTap) chuyên sâu và trình quản lý 16 kênh mạng xã hội động.
- **Đối tượng sử dụng**: Lập trình viên, Nhà thiết kế, Chuyên viên dữ liệu, Marketer, Nhân sự và Quản trị viên hệ thống.

---

## 2. Trạng Thái Dự Án (Project Status — v0.4.0)

> [!NOTE]
> **Dự án hiện đạt 95.2% tiến độ hoàn thiện kỹ thuật (Phiên bản v0.4.0 — 16/10/2026).**  
> Hệ thống đã kết nối hoàn chỉnh Firebase Auth & Cloud Firestore, kiểm duyệt hồ sơ đa cấp RBAC, đếm lượt xem nguyên tử, dọn sạch cơ sở dữ liệu và đạt **132/132 unit tests passed (21 test suites)** cùng **0 lỗi TypeScript**.

### Ma trận tính năng thực tế

| Phân hệ / Tính năng | Trạng thái | Chi tiết kỹ thuật |
|:---|:---:|:---|
| **Trang Chủ Showcase (`/`)** | ✅ Hoàn thành | Hiển thị Top 6 hồ sơ CV xem nhiều nhất, điều hướng sang trang Khám phá. |
| **Trang Khám Phá CV (`/explore`)** | ✅ Hoàn thành | 7 ngành nghề chuẩn hóa, tìm kiếm tiếng Việt không dấu, phân trang mượt mà. |
| **Trang Xem CV Chi Tiết (`/cv/:id`)** | ✅ Hoàn thành | Khổ A4 chuẩn mực, Action Bar chuyển 3 template, đổi màu/font, sao chép link, gửi email. |
| **Bộ 3 Mẫu CV Chuẩn Tuyển Dụng** | ✅ Hoàn thành | Classic Teal (sidebar), Warm Bold (Tangerine), Modern Minimal (tối giản). |
| **Xác Thực Người Dùng (Firebase Auth)** | ✅ Hoàn thành | Đăng nhập Google 1-click & Email/Password, modal tương tác, thông báo lỗi tiếng Việt. |
| **Đồng Bộ Đám Mây (Cloud Firestore)** | ✅ Hoàn thành | Lưu trữ realtime qua `cvStorageService.ts`, offline-first fallback `localStorage`. |
| **Trang Dashboard Cá Nhân (`/dashboard`)** | ✅ Hoàn thành | Quản lý danh sách CV cá nhân, tạo mới, chỉnh sửa, nhân bản (duplicate), xóa, đổi Public/Private. |
| **Phân Quyền Quản Trị RBAC (`/admin`)** | ✅ Hoàn thành | 3 cấp (Super Admin, Admin, Moderator), bảo vệ định tuyến `<AdminAuthGuard />`, màn hình 403. |
| **Kiểm Duyệt Hồ Sơ (`/admin/cvs`)** | ✅ Hoàn thành | Soft-delete & Khôi phục CV, yêu cầu nhập lý do bắt buộc $\ge 5$ ký tự, tự động ghi Audit Log. |
| **Quản Lý Tài Khoản (`/admin/users`)** | ✅ Hoàn thành | Phân vai trò, khóa tài khoản đồng thời khóa toàn bộ CV của user bằng batch write Firestore. |
| **Nhật Ký Kiểm Toán (`/admin/logs`)** | ✅ Hoàn thành | Ghi nhận bất biến mọi thao tác nhạy cảm, bảo vệ bất khả sửa xóa ở tầng Firestore Rules. |
| **Đếm Lượt Xem Tự Động** | ✅ Hoàn thành | Firestore `increment(1)` nguyên tử, khử trùng lặp 30 phút qua session, miễn trừ chủ sở hữu CV. |
| **Bộ Soạn Thảo Rich Text (TipTap)** | ✅ Hoàn thành | Định dạng tóm tắt nghề nghiệp (Bold, Italic, Underline, Font, Size, Color, Bullets, Align). |
| **Kênh Mạng Xã Hội Động** | ✅ Hoàn thành | Hỗ trợ 16 nền tảng (GitHub, LinkedIn, Behance, YouTube...), icon vector chuẩn màu, chống vỡ dòng. |
| **Chọn Tỉnh/Thành & Google Maps** | ✅ Hoàn thành | Dropdown 63 tỉnh/thành Việt Nam kèm nút mở vị trí trên Google Maps trong tab mới. |
| **Chọn Ngày Sinh Native** | ✅ Hoàn thành | Date picker chuẩn ISO, tự động format hiển thị `DD/MM/YYYY`. |
| **Dark Mode Toàn Diện (Zero-FOUC)** | ✅ Hoàn thành | Loại bỏ triệt để hiện tượng nháy trắng khi reload trang bằng blocking script tại `<head>`. |
| **Phòng Chống Lỗ Hổng XSS** | ✅ Hoàn thành | Hàm `formatSafeUrl()` kết hợp `DOMPurify` lọc sạch mã độc và scheme nguy hiểm. |
| **Xuất File PDF In Ấn (Native Print)** | 🚧 Tạm hoãn | Chờ chuẩn hóa CSS `@media print` A4 native; tạm khóa nút tải để phát triển chuyên sâu. |

---

## 3. Giao Diện Sản Phẩm (Screenshots)

### 3.1. Trang Chủ Khám Phá Hồ Sơ
<p align="center">
  <img src="docs/images/01-homepage-showcase.png" alt="Trang Chủ Khám Phá Hồ Sơ" width="90%" />
  <br />
  <em>Giao diện khám phá hồ sơ ứng viên tiêu biểu kèm bộ lọc ngành nghề trực quan</em>
</p>

### 3.2. Trình Biên Tập CV Trực Quan (Split-Screen Editor)
<p align="center">
  <img src="docs/images/03-cv-editor-split-view.png" alt="Trình Biên Tập CV Trực Quan" width="90%" />
  <br />
  <em>Trình biên tập 2 cột: Khối form 9 mục bên trái và Bản xem trước A4 Live Preview bên phải</em>
</p>

### 3.3. Trang Xem Chi Tiết Hồ Sơ CV
<p align="center">
  <img src="docs/images/02-cv-public-view.png" alt="Trang Xem Chi Tiết CV" width="90%" />
  <br />
  <em>Bản CV toàn màn hình sắc nét, hỗ trợ thanh công cụ chia sẻ và chuyển đổi nhanh</em>
</p>

---

## 4. Công Nghệ Sử Dụng (Tech Stack)

### Đang vận hành trong mã nguồn (Production Ready)
- **Cốt lõi**: React 18.3, TypeScript 5.6 (Strict Mode, 0 Lỗi), Vite 5.4.
- **Tạo kiểu (Styling)**: Tailwind CSS 3.4, PostCSS, Autoprefixer, Custom Print CSS `@media print`.
- **Điều hướng (Routing)**: React Router DOM v7 (Client-side routing, Lazy-loaded Admin & Explore routes).
- **Backend as a Service (BaaS)**: Firebase Authentication (Google 1-click & Email/Password) & Cloud Firestore (NoSQL, Atomic increments, Security Rules).
- **Quản lý trạng thái (State)**: Zustand v5 (Auth Store, CV Store, Theme Store).
- **Bộ soạn thảo Rich Text**: TipTap Suite (@tiptap/react, starter-kit, color, font-family, text-style, underline) kết hợp DOMPurify chống XSS.
- **Biểu tượng (Icons)**: Lucide React (hơn 50 icons vector chuyên nghiệp).
- **Kiểm thử (Testing)**: Vitest 2.1, @testing-library/react, @testing-library/dom, JSDOM (132 tests, 21 test suites).
- **Typography**: Google Fonts (`Outfit`, `Be Vietnam Pro`) kết hợp bộ font tự lưu trữ WOFF2 (`iCiel Cubano`, `SVN-Optima`, `Gilroy`, `Montserrat`).

---

## 5. Bắt Đầu Nhanh Trong 5 Phút (Quick Start)

### Yêu cầu tiên quyết
- **Node.js**: Phiên bản `18.x` hoặc `20.x` trở lên (Khuyến nghị: Node 20 LTS).
- **Trình quản lý gói**: `npm` phiên bản `9.x` hoặc `10.x`.

### 1. Clone repository
```bash
git clone https://github.com/JunWinpro/cv-studio.git
cd cv-studio
```

### 2. Cài đặt dependencies
Dự án được cấu hình dạng monorepo với frontend nằm trong thư mục `frontend/`:
```bash
# Cài đặt toàn bộ dependencies cho frontend
cd frontend
npm install
```

### 3. Khởi chạy máy chủ phát triển
```bash
npm run dev
```
Truy cập trình duyệt tại địa chỉ: `http://localhost:3000/`.

### 4. Build bản đóng gói production
```bash
npm run build
```
Bản build tĩnh tối ưu hóa sẽ được xuất ra tại thư mục `frontend/dist/`.

---

## 6. Kiểm Thử Tự Động (Testing)

Dự án tích hợp bộ kiểm thử tự động toàn diện với Vitest:

```bash
cd frontend
npm run test
```

### Kết quả kiểm thử hiện tại
```text
 ✓ src/utils/__tests__/url.test.ts (6 tests)
 ✓ src/data/__tests__/mockProfiles.test.ts (4 tests)
 ✓ src/features/cv-editor/hooks/__tests__/useCVEditor.test.ts (5 tests)
 ✓ src/features/admin/__tests__/AdminAuthGuard.test.tsx (6 tests)
 ✓ src/features/admin/__tests__/adminModeration.test.ts (8 tests)
 ✓ src/features/view-counter/__tests__/useCVViewCount.test.ts (7 tests)
 ✓ src/features/explore/__tests__/exploreFilter.test.ts (9 tests)
 ... và 14 test suites khác

 Test Files  21 passed (21)
      Tests  132 passed (132)
   Duration  43.46s
```
- **Kiểm tra an toàn URL & HTML**: 100% các chuỗi `javascript:alert(1)`, `data:text/html` đều bị lọc và vô hiệu hóa thành `#`; mã HTML trong Rich Text được làm sạch qua DOMPurify.
- **Kiểm tra phân quyền RBAC**: Xác minh 100% chặn trái phép route `/admin`, cho phép Super Admin / Moderator đúng vai trò, và whitelist fail-safe.
- **Kiểm tra đếm lượt xem**: Xác minh tăng lượt xem nguyên tử, chống đếm lặp 30 phút, miễn trừ chủ hồ sơ.
- **Kiểm tra lưu nháp & đồng bộ**: Xác minh cơ chế cô lập draft theo `id`, đồng bộ Firestore hai chiều và khôi phục toàn vẹn dữ liệu.

---

## 7. Cấu Trúc Thư Mục (Folder Structure)

```text
cv-studio/
├── docs/                        # Tài liệu kiến trúc, ảnh chụp và release notes
│   ├── ARCHITECTURE.md          # Đặc tả kiến trúc chi tiết và sơ đồ Mermaid
│   ├── images/                  # Thư viện ảnh chụp sản phẩm thực tế
│   └── releases/                # Ghi chú phát hành cho từng phiên bản
│
├── frontend/                    # Ứng dụng chính (Vite + React + TypeScript)
│   ├── public/fonts/            # Bộ font chữ Việt hóa tự lưu trữ
│   ├── src/
│   │   ├── components/          # Layout (Navbar, Footer) & UI components
│   │   ├── features/
│   │   │   ├── cv-editor/       # Trình biên tập 9 khối form & useCVEditor hook
│   │   │   ├── cv-templates/    # Registry & 3 mẫu thiết kế CV
│   │   │   └── explore/         # Danh mục khám phá & thanh lọc hồ sơ
│   │   ├── data/                # Mock profiles & mock CV data
│   │   ├── pages/               # HomePage, CVViewPage, CVEditorPage, NotFoundPage
│   │   ├── styles/              # CSS tokens, Tailwind base, Print styling
│   │   ├── types/               # TypeScript interfaces (CVData, ThemeConfig)
│   │   └── utils/               # Tiện ích sanitize URL, date formatting
│   ├── index.html               # Entry HTML với blocking script khử FOUC
│   ├── package.json             # Cấu hình scripts & dependencies
│   └── vite.config.ts           # Cấu hình Vite & Vitest environment
│
├── backend/                     # Khung stub backend cũ (sẽ thay thế bằng Firebase)
├── vercel.json                  # Cấu hình rewrite định tuyến SPA cho Vercel
├── LICENSE                      # Giấy phép MIT kèm lưu ý bản quyền font
├── SECURITY.md                  # Chính sách bảo mật & báo cáo lỗ hổng
├── CONTRIBUTING.md              # Quy chuẩn đóng góp mã nguồn
└── CHANGELOG.md                 # Nhật ký phiên bản chuẩn Keep a Changelog
```

---

## 8. Hướng Dẫn Thêm Mẫu CV Mới (Dành Cho Nhà Phát Triển)

Hệ thống sử dụng **Template Registry Pattern** giúp việc thêm mẫu CV mới cực kỳ đơn giản:

1. Tạo thư mục mới tại `frontend/src/features/cv-templates/template-x/`.
2. Tạo component mẫu kế thừa kiểu `TemplateProps`:
   ```typescript
   import { CVData, ThemeConfig } from '../../../types/cv';

   interface TemplateProps {
     data: CVData;
     theme: ThemeConfig;
   }

   export const CVTemplateCreative: React.FC<TemplateProps> = ({ data, theme }) => {
     return <div className="page-a4">...</div>;
   };
   ```
3. Đăng ký mẫu mới vào [`TemplateRegistry.ts`](frontend/src/features/cv-templates/TemplateRegistry.ts):
   ```typescript
   export const TEMPLATES_REGISTRY: Record<string, TemplateRegistration> = {
     // ... các mẫu hiện tại
     'template-creative': {
       id: 'template-creative',
       name: 'Creative Canvas',
       description: 'Mẫu thiết kế phá cách cho Designer & Creator',
       component: CVTemplateCreative,
     },
   };
   ```
Mẫu mới sẽ tự động xuất hiện trong menu lựa chọn của cả Trình biên tập lẫn Trang xem chi tiết!

---

## 9. Vấn Đề Đã Biết & Lưu Ý Bảo Mật (Known Issues)

1. **Thư viện PDF cũ (`html2pdf.js`)**: Bản build hiện tại ghi nhận cảnh báo lỗ hổng bảo mật trong `html2pdf.js@0.10.2` và `jspdf@2.5.1`. Tính năng xuất PDF tạm thời bị ẩn trên giao diện; toàn bộ in ấn khuyến nghị sử dụng chức năng in chuẩn trình duyệt (Ctrl + P / In A4).
2. **Font chữ cá nhân hóa**: Một số font chữ được cung cấp sẵn nhằm mục đích trình diễn học tập. Nếu đưa vào ứng dụng thương mại, vui lòng mua bản quyền từ tác giả hoặc sử dụng các phông chữ mở từ Google Fonts.
3. Để báo cáo lỗi bảo mật, vui lòng đọc [SECURITY.md](SECURITY.md).

---

## 10. Giấy Phép & Tác Quyền (License)

Dự án được phân phối dưới giấy phép [MIT License](LICENSE).  
Bản quyền © 2026 **Trần Anh Khôi** và các Cộng tác viên.
