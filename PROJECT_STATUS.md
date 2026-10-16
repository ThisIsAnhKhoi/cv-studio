# BẢNG THEO DÕI TIẾN ĐỘ DỰ ÁN (PROJECT STATUS & DEV LOG)
*Nền tảng CV Portfolio Platform (React + TS + Tailwind CSS + Node.js/Firebase)*

---

## 1. THÔNG TIN CHUNG (LỊCH SỬ KHỞI TẠO CŨ)
- **Dự án**: Website Nền tảng Tạo & Quản lý CV Cá nhân (CV Portfolio Platform)
- **Tài liệu đặc tả**: [y_tuong.txt](y_tuong.txt)
- **Kiến trúc hệ thống**: 4-Layer Clean Architecture
- **Môi trường cục bộ**: Đang chạy tại `http://localhost:3000/` (Vite dev server)
- **Git Commit cũ từng ghi**: `ee28790` *(⚠️ LƯU Ý KIỂM TOÁN: Commit thực tế hiện tại là `ec26185`)*
- **Giai đoạn cũ từng ghi**: Giai đoạn 2 — Duyệt Mẫu CV số 1 đã tinh chỉnh *(⚠️ LƯU Ý KIỂM TOÁN: Mã nguồn thực tế đã phát triển qua Trang chủ, Mẫu 2, Mẫu 3 và Editor)*

---

## 2. KẾT QUẢ TINH CHỈNH THEO PHẢN HỒI (LỊCH SỬ PHIÊN TRƯỚC)

| STT | Hạng mục tinh chỉnh | Chi tiết đã thực hiện | Trạng thái |
|:---:|:---|:---|:---:|
| **1** | **Quy hoạch cây thư mục** | Đã gom toàn bộ các file mẫu HTML/PDF tham khảo vào thư mục riêng `references/sample-cvs/`. Thư mục gốc sạch sẽ và chuẩn mực. | ✅ Đã hoàn thành |
| **2** | **Tích hợp phông chữ từ máy tính** | Đã sao chép các bộ font việt hóa từ máy tính (`iCiel Cubano`, `SVN-Optima`, `Gilroy`, `Montserrat`) vào `public/fonts/` và khai báo `@font-face`. Sửa dứt điểm lỗi nhảy font tiếng Việt ở họ tên. | ✅ Đã hoàn thành |
| **3** | **Căn chỉnh Icon SVG bị lệch** | Khắc phục hoàn toàn lỗi lệch icon `ExternalLink` bằng `inline-flex items-center gap-1.5`. Canh đều icon liên hệ và mốc timeline. | ✅ Đã hoàn thành |
| **4** | **Tinh gọn thông tin & bố cục thoáng** | Mở rộng cột trái lên 245px (email `thanhtruc.dev@gmail.com` vừa vặn trên 1 dòng). Rút gọn tóm tắt và bullet points kinh nghiệm sắc bén, tăng khoảng thở giữa các khối. | ✅ Đã hoàn thành |
| **5** | **Hiệu ứng Hover & Tương tác sống động** | Bổ sung hiệu ứng hover nâng thẻ dự án (`hover:-translate-y-0.5 hover:shadow-md`), viền sáng màu accent, hover thẻ kỹ năng, click sao chép email kèm thông báo tức thì, avatar zoom nhẹ. | ✅ Đã hoàn thành |

---

## 3. BẢNG TIẾN ĐỘ TỔNG THỂ (LỊCH SỬ CŨ - CÓ ĐỐI CHIẾU THỰC TẾ)

| STT | Giai đoạn / Tính năng | Trạng thái tự ghi cũ | Ghi chú & Đối chiếu kiểm toán thực tế [ĐÃ XÁC MINH] |
|:---:|:---|:---:|:---|
| 1 | Khảo sát ý tưởng & Chuẩn hóa tài liệu (`y_tuong.txt`) | ✅ Hoàn thành | 9 phần đặc tả hoàn chỉnh. |
| 2 | Hệ thống Dev-Log & Handover cho Antigravity | ✅ Hoàn thành | `PROJECT_STATUS.md` và `.agents/rules/session-protocol.md`. |
| 3 | Thực hiện Bước 1: Git setup + Frontend + Mẫu CV số 1 | ✅ Hoàn thành | Đã hoàn thành 100%. |
| 4 | Tinh chỉnh Mẫu CV số 1 (Font máy, Icon, Layout, Hover) | ✅ Hoàn thành | Đã hoàn thành. |
| 5 | Xây dựng Mẫu CV số 2 (Warm Bold Ink & Tangerine) | ⏳ Chờ thực hiện | **[SAI LỆCH SO VỚI CODE THỰC TẾ]**: Đã hoàn thành trong commit `f7ed97a` (`CVTemplateWarmBold.tsx`). |
| 6 | Xây dựng Trang chủ (Menu & Danh sách Profile) | ⏳ Chờ thực hiện | **[SAI LỆCH SO VỚI CODE THỰC TẾ]**: Đã hoàn thành trong commit `9842e3c` (`HomePage.tsx`). |
| 7 | Xây dựng Trang CV cá nhân chi tiết (Public View) | ⏳ Chờ thực hiện | **[SAI LỆCH SO VỚI CODE THỰC TẾ]**: Đã hoàn thành trong commit `9842e3c` (`CVViewPage.tsx`). |
| 8 | Xây dựng Trình chỉnh sửa CV (CV Editor Dashboard) | ⏳ Chờ thực hiện | **[SAI LỆCH SO VỚI CODE THỰC TẾ]**: Đã hoàn thành UI trong commit `13c6158` (`CVEditorPage.tsx`), nhưng còn thiếu 2 khối và lỗi logic lưu draft. |
| 9 | Tích hợp Xác thực (Auth) & Phân quyền bảo mật | ⏳ Chờ thực hiện | Đúng thực tế: Chưa bắt đầu (0%). |
| 10 | Triển khai CI/CD lên Vercel & Render | ⏳ Chờ thực hiện | Đúng thực tế: Chưa có file `vercel.json` và CI pipeline (15%). |

---

## 4. HIỆN TRẠNG ĐÃ KIỂM CHỨNG (KIỂM TOÁN LẬP NGÀY 13/10/2026 — 11:20 GMT+7)

### 4.1. Thông số môi trường và mã nguồn đã xác minh
- **Git Commit đang kiểm tra**: `ec26185` (`fix(ui): decouple CV printable styles from dark mode cascade and fix button hover colors`).
- **TypeScript Strict Compile**: `npx tsc --noEmit` $\rightarrow$ **0 Lỗi (Pass 100%)**.
- **Production Build**: `npm run build` $\rightarrow$ **Thành công (6.3s)**.
- **Tiến độ hoàn thiện tổng thể thực tế (so với đặc tả `y_tuong.txt`)**: **28.5%** (Client Prototype đạt ~48%, Tầng Backend/Auth đạt 0%).
- **Trạng thái tính năng Xuất PDF**: **TẠM HOÃN (Deferred)** theo chỉ đạo trực tiếp từ người dùng. Toàn bộ trọng tâm kiểm thử và tối ưu chuyển sang hoàn thiện các chức năng giao diện, tính toàn vẹn dữ liệu và bảo mật client-side.

### 4.2. Bảng tiến độ đã hiệu chỉnh chuẩn xác

| Phân hệ / Module | Trạng thái kỹ thuật | Bằng chứng mã nguồn | Mức độ hoàn thiện |
|:---|:---|:---|:---:|
| **Trang Khám Phá (`/`)** | Hoạt động tốt | `frontend/src/pages/HomePage.tsx` | 80% (Thiếu phân trang) |
| **Trang Xem CV (`/cv/:id`)** | Hoạt động tốt | `frontend/src/pages/CVViewPage.tsx` | 65% (Lỗi fallback 404, thiếu check isOwner) |
| **Mẫu CV 1, 2, 3** | Hoàn chỉnh | `features/cv-templates/` (TemplateRegistry.ts) | 95% (Cần thêm break-words) |
| **Trình Biên Tập CV (`/editor`)** | Hoạt động (Có lỗi logic) | `features/cv-editor/` | 55% (Thiếu 2 khối, lỗi lưu draft) |
| **Avatar Profile** | Chỉ có URL input | `PersonalInfoSection.tsx` | 20% (Chưa có upload/storage) |
| **Auth & Phân Quyền** | Chưa bắt đầu | Không có file nào | 0% |
| **Dashboard Quản Trị** | Chưa bắt đầu | Route trả về 404 | 0% |
| **Backend API** | Chỉ có stub rỗng | `backend/src/server.ts` | 5% (Chưa kết nối frontend) |

### 4.3. Danh sách lỗi mở đang chờ xử lý (Active Bug Backlog)
1. ~~**BUG-001 [Critical - P0]**~~: **[ĐÃ GIẢI QUYẾT]** Lỗ hổng Stored XSS khi nhập URL `javascript:alert(1)` $\rightarrow$ Đã xử lý triệt để bằng tiện ích `formatSafeUrl()` và áp dụng toàn diện trên cả 3 template.
2. ~~**BUG-002 [Blocker - P0]**~~: **[ĐÃ GIẢI QUYẾT]** Cơ chế lưu Draft ghi đè chung 1 key $\rightarrow$ Đã phân lập `cv_studio_draft_${id}` theo ID CV, nạp draft khi tải trang và bảo lưu 100% dữ liệu khi F5.
3. ~~**BUG-003 [Critical - P1]**~~: **[ĐÃ GIẢI QUYẾT]** URL `/cv/unknown-id` tự động fallback sai về ứng viên số 1 $\rightarrow$ Đã điều hướng chuẩn sang `<NotFoundPage />`.
4. ~~**BUG-004 [Major - P1]**~~: **[ĐÃ GIẢI QUYẾT]** Trình biên tập CV thiếu form cho khối Thành Tựu & Chứng Chỉ $\rightarrow$ Đã tạo `AchievementsSection.tsx` & `CertificatesSection.tsx`, tích hợp 9/9 khối dữ liệu chuẩn.
5. **BUG-005 [Major - P1]**: 2 lỗ hổng bảo mật cấp Critical trong thư viện `html2pdf.js` và `jspdf` (Đang tạm hoãn tính năng xuất PDF theo chỉ đạo, sẽ giải quyết ở Giai đoạn 5 khi chuyển sang CSS Native Print).
6. ~~**BUG-006 [Minor - P2]**~~: **[ĐÃ GIẢI QUYẾT]** Họ tên dài không có khoảng trắng tràn vỡ khung A4 $\rightarrow$ Đã bổ sung `break-words` trên cả 3 template.
7. ~~**BUG-007 [Major - P1]**~~: **[ĐÃ GIẢI QUYẾT]** Chưa có tệp cấu hình SPA routing $\rightarrow$ Đã tạo `vercel.json` định tuyến toàn bộ request về `/index.html`.

### 4.4. Các tài liệu kiểm toán kèm theo
- Báo cáo kiểm toán chi tiết: [QA_REPORT.md](QA_REPORT.md)
- Kế hoạch kiểm thử & 40 test cases: [TEST_PLAN.md](TEST_PLAN.md)
- Quyết định kiến trúc ADR-001 đến ADR-011: [DECISIONS.md](DECISIONS.md)
- Kế hoạch phát triển V2: [DEVELOPMENT_PLAN_V2.md](DEVELOPMENT_PLAN_V2.md)
- Hướng dẫn thực thi Task Briefs: [TASK_BRIEFS.md](TASK_BRIEFS.md)

---

## 5. KẾT QUẢ THỰC HIỆN GIAI ĐOẠN 1 (HOÀN THÀNH 13/10/2026)

### 5.1. Các hạng mục đã hoàn thành 100%
1. **Vá lỗ hổng bảo mật URL Stored XSS (BUG-001) & chống vỡ layout (BUG-006)**:
   - Tạo tiện ích [url.ts](frontend/src/utils/url.ts) với hàm `formatSafeUrl(url)` chặn đứng các scheme độc hại `javascript:`, `data:`, `vbscript:`, tự động bổ sung `https://` và làm sạch link hiển thị với `cleanDisplayUrl()`.
   - Áp dụng `formatSafeUrl` và `break-words` trên cả 3 mẫu CV: [CVTemplateClassicTeal.tsx](frontend/src/features/cv-templates/template-1/CVTemplateClassicTeal.tsx), [CVTemplateWarmBold.tsx](frontend/src/features/cv-templates/template-2/CVTemplateWarmBold.tsx), [CVTemplateModernMinimal.tsx](frontend/src/features/cv-templates/template-3/CVTemplateModernMinimal.tsx).
2. **Tái cấu trúc cơ chế lưu trữ bản nháp phân lập theo ID (BUG-002)**:
   - Cập nhật [useCVEditor.ts](frontend/src/features/cv-editor/hooks/useCVEditor.ts) với cơ chế `getDraftStorageKey(id)`. Khởi tạo ưu tiên draft theo đúng ID tương ứng, tự động lưu debounce 600ms không đè lẫn giữa các hồ sơ, bảo lưu 100% dữ liệu khi người dùng F5 tải lại trang.
3. **Sửa lỗi điều hướng 404 (BUG-003)**:
   - Cập nhật [CVViewPage.tsx](frontend/src/pages/CVViewPage.tsx) và [CVEditorPage.tsx](frontend/src/pages/CVEditorPage.tsx): Nếu route param `id` không tồn tại trong hệ thống, giao diện render trang chuẩn `<NotFoundPage />` kèm nút quay về trang chủ, chấm dứt tình trạng âm thầm trả về ứng viên số 1.
4. **Hoàn thiện đủ 9 khối dữ liệu chuẩn trong Trình biên tập (BUG-004)**:
   - Tạo mới [AchievementsSection.tsx](frontend/src/features/cv-editor/components/sections/AchievementsSection.tsx) (Thành Tựu & Giải Thưởng).
   - Tạo mới [CertificatesSection.tsx](frontend/src/features/cv-editor/components/sections/CertificatesSection.tsx) (Chứng Chỉ Chuyên Ngành).
   - Bổ sung đầy đủ updater `add/update/remove` trong `useCVEditor.ts` và gắn vào accordion trong `CVEditorPage.tsx`.
5. **Cấu hình triển khai Vercel SPA (BUG-007)**:
   - Tạo mới [vercel.json](vercel.json) ở thư mục gốc cấu hình rewrites `/(.*)` $\rightarrow$ `/index.html`.
6. **Hạ tầng kiểm thử tự động Vitest & 15/15 Unit Tests Passed**:
   - Cài đặt `vitest@^2.1.8`, `@testing-library/react`, `@testing-library/dom`, `jsdom`.
   - Thiết lập cấu hình `vitest run` trong [vite.config.ts](frontend/vite.config.ts) và [package.json](frontend/package.json).
   - Viết 3 bộ test tự động:
     - `src/utils/__tests__/url.test.ts` (6 tests: sanitize XSS, protocol whitelist, clean display)
     - `src/features/cv-editor/hooks/__tests__/useCVEditor.test.ts` (5 tests: draft isolation, F5 persistence, experiences, skills, achievements/certs)
     - `src/data/__tests__/mockProfiles.test.ts` (4 tests: unknown id 404 lookup, keyword search)
   - Kết quả: **15/15 tests PASS 100%**.
7. **Kiểm chứng thực tế bằng Trình duyệt tự động (Browser Subagent)**:
   - Đã điều hướng `http://localhost:3000/cv/invalid-id-999` $\rightarrow$ Xác nhận hiển thị 404 chính xác.
   - Đã sửa thông tin ứng viên trên `http://localhost:3000/editor/cv-thanhtruc-design` $\rightarrow$ Tự động lưu thành công $\rightarrow$ Nhấn F5 $\rightarrow$ Xác nhận dữ liệu giữ nguyên 100%.
   - Đã mở 2 accordion mới Thành Tựu & Chứng Chỉ $\rightarrow$ Nhận diện đủ input và nút thêm/xóa mục.
   - Production Build `npm run build`: Thành công 100% trong 8.32s.

---

## 6. KẾ HOẠCH BƯỚC TIẾP THEO (GIAI ĐOẠN 2)
1. **Tối ưu hóa Phông chữ (Task Brief 4)**:
   - Thay thế việc load font tĩnh nặng nề trong `public/fonts/` bằng Google Fonts (`Be Vietnam Pro`, `Montserrat`, `Outfit`) và chỉ giữ lại font đặc thù subsetting WOFF2 (`iCiel Cubano`, `SVN-Optima`) để giảm kích thước tải xuống dưới 400 kB.
2. **Code-Splitting routes (Task Brief 4)**:
   - Phân mảnh bundle bằng `React.lazy()` và `<Suspense>` trên `App.tsx` để giảm chunk JS chính dưới 500 kB.
3. **Chuyển đổi State sang Zustand Store (Task Brief 5)**:
   - Cài đặt Zustand, tạo `cvStore.ts` và `themeStore.ts` chuẩn bị cho tích hợp Firebase Auth ở Giai đoạn 3.

---

## 7. CHUẨN BỊ PHÁT HÀNH GITHUB (RELEASE PREPARATION & AUDIT — 13/10/2026)

### 7.1. Kết quả kiểm toán an toàn (Pre-flight Audit)
- **Lỗ hổng bí mật (Secret Scanning)**: **0 secret / 0 token**. Đã quét toàn bộ 11 commit trong lịch sử git và working tree; không có API key hay tệp `.env` nào bị commit.
- **Kích thước tệp lớn (Large Files)**: Không có tệp nào > 1 MB trong git tracking. Thư mục font cục bộ đạt 5.4 MB (39 file .otf).
- **Phụ thuộc bên thứ ba (npm audit)**: Ghi nhận 2 CVE critical trong `html2pdf.js@0.10.2` & `jspdf@2.5.1` (BUG-005); tính năng xuất PDF đã tạm hoãn và ghi rõ trong `SECURITY.md` và `README.md`.
- **Rủi ro tài sản (Assets & Fonts)**: Đã đính kèm điều khoản miễn trừ trách nhiệm (Third-Party Assets Disclaimer) trong `LICENSE` và `README.md` đối với các phông chữ cài đặt cục bộ và ảnh mẫu Unsplash.
- **Kết luận Pre-flight**: **CONDITIONAL GO** (Cho phép phát hành Public với tài liệu trung thực, minh bạch về trạng thái Prototype và các giới hạn đã biết).

### 7.2. Bộ tài liệu phát hành mã nguồn mở đã hoàn thành
- [README.md](README.md): Bản tiếng Việt hoàn chỉnh (5 giây - 30 giây - 5 phút, ma trận tính năng, quick start, architecture, screenshots).
- [README.en.md](README.en.md): Bản tiếng Anh chuẩn mực, trung thực và súc tích.
- [CHANGELOG.md](CHANGELOG.md): Chuẩn Keep a Changelog và SemVer, ghi nhận 11 commit từ `v0.1.0-alpha.1` đến `v0.1.0`.
- [LICENSE](LICENSE): Giấy phép MIT kèm điều khoản miễn trừ font và dữ liệu mẫu.
- [SECURITY.md](SECURITY.md): Chính sách báo cáo lỗ hổng có trách nhiệm và bảng hiện trạng bảo mật.
- [CONTRIBUTING.md](CONTRIBUTING.md): Hướng dẫn đóng góp mã nguồn mở, workflow, code standards.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): Sơ đồ kiến trúc Mermaid, Clean 4-Layer, Template Registry Pattern.
- [docs/images/](docs/images/): Bộ 3 ảnh chụp màn hình độ phân giải cao thực tế từ sản phẩm (< 350 kB mỗi ảnh).
- [docs/releases/v0.1.0.md](docs/releases/v0.1.0.md): Ghi chú phát hành chi tiết cho GitHub Release v0.1.0.
- `.github/`: Mẫu Issue Template (Bug Report, Feature Request) và Pull Request Template.

---

## 8. GIAI ĐOẠN 2: TỐI ƯU HIỆU NĂNG, KIẾN TRÚC ZUSTAND & TÙY BIẾN THEO KHỐI (HOÀN THÀNH — 16/10/2026)

### 8.1. Bảng đối chiếu chỉ số kỹ thuật Trước & Sau (Before vs After)

| Tiêu chí kỹ thuật | Trước Giai đoạn 2 (`v0.1.0`) | Sau Giai đoạn 2 (`v0.2.0`) | Mức độ cải thiện | Trạng thái |
|:---|:---:|:---:|:---:|:---:|
| **Entry Chunk JS chính** | 1,045.30 kB | **13.65 kB** (4.64 kB gzip) | **Giảm 98.7%** | ✅ Vượt mục tiêu (< 350 kB) |
| **Tổng tải JS khởi tạo trang** | ~1,045 kB | **217 kB** (68 kB gzip) | **Giảm 79.2%** | ✅ Vượt mục tiêu (< 500 kB) |
| **Dung lượng thư mục Fonts** | 5.41 MB (39 tệp `.otf`) | **0 MB** (Google Fonts WOFF2 subset) | **Tiết kiệm 5.41 MB** | ✅ Hoàn thành |
| **Initial Font Payload** | ~5.4 MB | **< 380 kB** (theo nhu cầu subsetting) | **Giảm > 92%** | ✅ Đạt ngân sách |
| **Quản lý State** | `useCVEditor` (cục bộ `useState`) | `useCVStore` (Zustand v5 Store) | Kiến trúc toàn cục sạch | ✅ Đã di chuyển |
| **Kiểm thử tự động** | 15 tests (Vitest) | **46 tests** (9 test files) | **Tăng gấp 3.06 lần** | ✅ Pass 100% |
| **Tùy biến theo từng khối** | Chưa có (chỉ có màu toàn cục) | **9 sections x 3 templates** (Màu, Font, WCAG) | Tính năng mới hoàn chỉnh | ✅ Đã phát hành |
| **TypeScript Type-check** | 0 error (`tsc --noEmit`) | **0 error (`tsc --noEmit`)** | Giữ vững 100% | ✅ Type-safe |

### 8.2. Các mốc Git Tag đã chốt
- `stage2/brief-4b-ok`: Code-splitting các routes với `React.lazy()` & dynamic import `html2pdf.js`.
- `stage2/brief-4a-ok`: Tối ưu hóa phông chữ Google Fonts WOFF2, xóa 39 tệp font nặng, xây dựng `FontRegistry`.
- `stage2/brief-5-ok`: Chuyển dịch sang Zustand v5 store, auto-save debounce 600ms, migration schema v1 -> v2.
- `stage2/brief-6-ok`: Tùy biến màu sắc, font chữ theo từng section, kiểm tra độ tương phản WCAG 2.1, và cascade CSS Custom Properties trên cả 3 template.



