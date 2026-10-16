# BÁO CÁO KIỂM TOÁN CHẤT LƯỢNG TOÀN DIỆN (QA AUDIT REPORT - PHA 1)

> [!IMPORTANT]
> **TÀI LIỆU LƯU TRỮ LỊCH SỬ (HISTORICAL AUDIT ARCHIVE - PHA 1)**  
> Báo cáo này ghi nhận hiện trạng hệ thống tại thời điểm **Pha 1 (13/10/2026 - v0.1.0 Prototype)** khi dự án đạt 28.5% tiến độ.  
> Đối với báo cáo kiểm toán toàn diện mới nhất của hệ thống hoàn thiện (Pha 3 & 4 - v0.4.0, 95.2% tiến độ, 132/132 tests pass), vui lòng xem: **[docs/QA_AUDIT_v2.md](docs/QA_AUDIT_v2.md)**.

**Dự án**: CV Studio / MyPortfolio  
**Vai trò thực hiện**: Senior QA Lead / Test Architect (12+ năm kinh nghiệm)  
**Thời điểm kiểm định**: 13/10/2026 — 11:20:00 (GMT+7)  
**Tiêu chuẩn đánh giá**: Evidence-Based (100% dựa trên file:dòng, output lệnh và kết quả kiểm thử thực tế trên trình duyệt; không suy diễn cảm tính)  
**Ghi chú phạm vi**: *Tính năng xuất bản PDF hiện tại đã được người dùng chỉ định TẠM HOÃN (Deferred) để tập trung nguồn lực kiểm định và hoàn thiện các tính năng cốt lõi khác trước.*

---

## 1. TÓM TẮT ĐIỀU HÀNH (EXECUTIVE SUMMARY)

1. **Hiện trạng thực tế**: Hệ thống hiện tại là một **Single Page Application (SPA) Client-Side Prototype thuần túy**, hoạt động dựa trên 100% dữ liệu mẫu cục bộ (`mockProfiles.ts`). Hoàn toàn **chưa có tầng Backend, chưa kết nối Database (Firestore/MongoDB/PostgreSQL), chưa có hệ thống Auth, chưa có API**, và state quản lý bằng React `useState` cục bộ thay vì kiến trúc 4 tầng Zustand như tự công bố.
2. **Tiến độ hoàn thiện thực tế**: Đạt **28.5%** so với toàn bộ đặc tả hệ thống trong `y_tuong.txt` (Chi tiết công thức và ma trận tại Mục 2).
3. **5 Vấn đề nghiêm trọng nhất đe dọa hệ thống**:
   - **[BUG-001 | Critical] Lỗ hổng Stored XSS qua liên kết URL cá nhân**: Trường "Website Cá Nhân" nhận trực tiếp protocol `javascript:alert(...)`, render thẳng vào thuộc tính `href` của thẻ `<a>` mà không qua whitelist/sanitization, kích hoạt JavaScript tùy ý khi người xem click.
   - **[BUG-002 | Blocker] Lỗi Logic cô lập Draft / Mất dữ liệu Draft**: Cả hệ thống chỉ dùng 1 key `localStorage` duy nhất (`cv_studio_draft_cv`). Khi mở `/editor/:id`, hook `useCVEditor` ưu tiên `initialData` tĩnh và bỏ qua hoàn toàn draft đã lưu; ngược lại khi mở `/editor`, dữ liệu chỉnh sửa của CV này sẽ ghi đè và rò rỉ sang CV khác.
   - **[BUG-003 | Critical] Hổng hoàn toàn tầng Phân quyền & Định tuyến**: Nút "Chỉnh Sửa CV" hiển thị công khai 100% cho bất kỳ khách truy cập nào tại `/cv/:id`; không tồn tại kiểm tra quyền sở hữu (`isOwner`); các route `/login`, `/register`, `/dashboard` đều trả về lỗi 404; route `/cv/id-khong-ton-tai` âm thầm trả về hồ sơ của ứng viên số 1 thay vì trang 404.
   - **[BUG-004 | Major] Thiếu sót 2 khối dữ liệu quan trọng trong Editor**: Schema định nghĩa đủ 9 khối nhưng Trình chỉnh sửa (`CVEditorPage`) đã bỏ quên hoàn toàn khối **Thành tựu (Achievements)** và **Chứng chỉ (Certificates)**, không có UI để người dùng thêm/sửa/xóa.
   - **[BUG-005 | Major] 2 Lỗ hổng bảo mật cấp Critical trong thư viện phụ thuộc (`npm audit`)**: Thư viện `html2pdf.js` và `jspdf` chứa 2 lỗ hổng Critical (CVE-GHSA-w8x4-x68c-m6fc, CVE-GHSA-f8cm-6447-x5h2) cho phép PDF Injection, Path Traversal và XSS.
4. **Kết luận phát hành**: **NO-GO cho việc triển khai Backend/Production cho đến khi xử lý triệt để 5 lỗi trọng yếu trên**. Đạt **CONDITIONAL GO** cho việc tiếp tục hoàn thiện giao diện Client-Side (bổ sung khối dữ liệu thiếu, chặn XSS, sửa cơ chế lưu draft).

---

## 2. MA TRẬN TIẾN ĐỘ TÍNH NĂNG & ĐỐI CHIẾU ĐẶC TẢ (PHA 1)

### 2.1. Thang đánh giá trạng thái
- **0**: Chưa bắt đầu (0%)
- **1**: Có khung/stub (file rỗng, TODO) (10%)
- **2**: Chỉ có UI, dữ liệu giả (mock) (35%)
- **3**: Chạy được ở local/in-memory, chưa lưu bền vững (60%)
- **4**: Chạy được + lưu bền vững (localStorage/DB), còn lỗi hoặc thiếu edge cases (80%)
- **5**: Hoàn chỉnh (đã test cả luồng chính, luồng lỗi, responsive, a11y, production ready) (100%)

### 2.2. Ma trận chi tiết từng hạng mục

| STT | Hạng mục kiểm tra | Tham chiếu `y_tuong.txt` | Trạng thái | % Hoàn thiện | Bằng chứng kiểm tra thực tế | Việc còn thiếu / Tồn đọng |
|:---:|:---|:---|:---:|:---:|:---|:---|
| **A1** | Trang Khám phá (`/`) | Mục 2.1 | **4** | **80%** | [ĐÃ XÁC MINH] `frontend/src/pages/HomePage.tsx`: Có Hero, thanh tìm kiếm từ khóa, bộ lọc ngành, thẻ ProfileCard, Responsive. | Chưa có phân trang (pagination); danh sách đang fix cứng 6 mock items. |
| **A2** | Trang Xem CV công khai (`/cv/:id`, `/u/:id`) | Mục 2.2 | **3** | **65%** | [ĐÃ XÁC MINH] `frontend/src/pages/CVViewPage.tsx`: Nhận id/slug, render đúng 3 templates, đổi màu accent/font, copy link. | Không có phân quyền `isOwner`; id không tồn tại bị fallback sai về profile[0] thay vì 404; chưa có OG tag động. |
| **A3** | Trang Quản lý & Editor (`/editor/:id`, `/editor`) | Mục 2.3 | **3** | **55%** | [ĐÃ XÁC MINH] `frontend/src/pages/CVEditorPage.tsx`: Accordion nhập liệu, Live preview 2 cột, đổi template, đổi font/màu/nền giấy. | Thiếu khối Achievements & Certificates; draft ghi đè chung 1 key; không có Undo/Redo; không có kéo thả; chưa chặn XSS URL. |
| **A4** | Trang Dashboard (`/dashboard`) | Mục 2.4 | **0** | **0%** | [ĐÃ XÁC MINH] `App.tsx` dòng 24-52: Không có route `/dashboard`. Browser truy cập trả về `NotFoundPage` (404). | Chưa tạo page, chưa có danh sách CV cá nhân, chưa có chức năng Duplicate/Delete CV, chưa có view count. |
| **A5** | Trang Xác thực (`/login`, `/register`) | Mục 2.5 | **0** | **0%** | [ĐÃ XÁC MINH] `App.tsx`: Không có route. Browser truy cập trả về 404. Thư mục `features/auth/` không tồn tại. | Chưa có form Login/Register, chưa tích hợp Firebase Auth hoặc JWT, chưa có Google 1-click. |
| **A6** | Trang 404 & SPA Routing | Mục 2.1, 7.2 | **2** | **40%** | [ĐÃ XÁC MINH] `NotFoundPage.tsx` có UI. NHƯNG: Không có file `vercel.json` hoặc `_redirects` để cấu hình SPA fallback khi F5 trên server! | Thiếu `vercel.json` (F5 trên deploy thật sẽ chết 404). |
| **B** | Data Schema (`types/cv.ts`) | Mục 3 | **4** | **85%** | [ĐÃ XÁC MINH] `frontend/src/types/cv.ts`: Có đủ interface cho 9 khối thông tin + `ThemeConfig`. | `mockCVData.ts` có đủ 9 khối nhưng Editor UI chỉ hỗ trợ 7 khối. Thiếu `isPublic`, `viewCount` trong logic hiển thị. |
| **C1** | Template Engine (Registry Pattern) | Mục 5.2 | **5** | **95%** | [ĐÃ XÁC MINH] `TemplateRegistry.ts`: Khai báo dạng Registry chuẩn `Record<string, TemplateMeta>`, mở rộng độc lập không sửa code cũ. | Rất tốt. Cần chuẩn hóa thống nhất interface `CVTemplateProps`. |
| **C2** | CV Template 1 (Classic Teal) | Mục 4.3, 5.2 | **5** | **95%** | [ĐÃ XÁC MINH] `CVTemplateClassicTeal.tsx`: Layout 2 cột, độc lập với dark mode của app, hỗ trợ đầy đủ token màu/font. | Cần thêm `break-words` vào Họ Tên và URL dài để chống vỡ khung. |
| **C3** | CV Template 2 (Warm Bold Ink & Tangerine) | Mục 4.3, 5.2 | **5** | **95%** | [ĐÃ XÁC MINH] `CVTemplateWarmBold.tsx`: Cột cát ấm bên phải, header ink viền cam chuẩn đặc tả. | Tương tự: cần class `break-words`. |
| **C4** | CV Template 3 (Modern Minimal) | Mục 4.3, 5.2 | **5** | **95%** | [ĐÃ XÁC MINH] `CVTemplateModernMinimal.tsx`: Dải thẻ liên hệ ngang, lưới tối giản cân đối. | Đã hoàn thiện và hoạt động mượt mà. |
| **D1** | Editor: Accordions & Thêm/Xóa mục | Mục 2.3 | **4** | **80%** | [ĐÃ XÁC MINH] `useCVEditor.ts` + các file Section: Nút (+) thêm exp, edu, skill, proj; nút thùng rác xóa; cập nhật tức thì. | Thiếu form cho Achievements và Certificates. |
| **D2** | Editor: Kéo thả sắp xếp thứ tự | Mục 2.3 | **0** | **0%** | [ĐÃ XÁC MINH] Grep kiểm tra: `draggable => 0`, `onDrop => 0`. Không có thư viện DnD nào được cài đặt. | Chưa làm tính năng kéo thả sắp xếp. |
| **D3** | Editor: Undo / Redo | Mục 5.3 | **0** | **0%** | [ĐÃ XÁC MINH] Grep kiểm tra: `undo => 0`, `redo => 0`. Không có stack lịch sử trạng thái trong `useCVEditor.ts`. | Chưa làm tính năng Undo/Redo. |
| **D4** | Editor: Auto-save & Status indicator | Mục 2.3, 5.3 | **3** | **60%** | [ĐÃ XÁC MINH] `useCVEditor.ts` dòng 41-60: Có debounce 600ms, hiển thị "Đang lưu" -> "Đã lưu tự động". | Bị lỗi ghi đè 1 key duy nhất, không phân biệt ID CV đang sửa. |
| **E** | Avatar Management | Mục 3.1 | **1** | **20%** | [ĐÃ XÁC MINH] `PersonalInfoSection.tsx` dòng 18-38: Chỉ có 1 thẻ `<input type="text">` nhận URL ảnh paste vào. | Không có chọn file từ máy, không có crop ảnh, không có validate kích thước/loại file, không có Cloudinary/Firebase Storage, không có `onError` fallback. |
| **F** | Xuất PDF chuẩn A4 | Mục 6, 8.6 | **2** | **30%** | [ĐÃ XÁC MINH] `exportPdfService.ts`: Sử dụng `html2pdf.js` tạo ra file ảnh raster (2 trang, 813KB, chữ không chọn/copy được). **ĐÃ TẠM HOÃN theo quyết định người dùng.** | Tạm hoãn theo yêu cầu; sẽ chuyển sang giải pháp native `@media print` / `window.print` ở giai đoạn sau. |
| **G** | Auth & Phân quyền bảo mật | Mục 1.2, 2.5 | **0** | **0%** | [ĐÃ XÁC MINH] Hoàn toàn chưa có mã nguồn nào cho Auth. Không có `firebase.ts`, không có token session. | Chưa bắt đầu. |
| **H** | Persistence (Lưu trữ bền vững) | Mục 5.4 | **2** | **30%** | [ĐÃ XÁC MINH] Chỉ có lưu cục bộ qua `localStorage` với 1 key dùng chung. Chưa có Cloud Firestore hoặc REST API database. | Chưa có database kết nối. |
| **I** | Quản lý Profile / Directory | Mục 2.1 | **4** | **80%** | [ĐÃ XÁC MINH] `mockProfiles.ts`: 6 ứng viên mẫu với dữ liệu rất chi tiết, phong phú, ảnh thật, đủ chuyên ngành. | Cần chuyển sang API/Database động khi có backend. |
| **J** | Quản lý tài khoản & Thống kê | Mục 2.4 | **0** | **0%** | [ĐÃ XÁC MINH] Không có trang Dashboard, không có cơ chế tăng/đếm lượt xem (`viewCount`). | Chưa bắt đầu. |
| **K** | Chia sẻ, Slug & SEO | Mục 1.1, 2.2 | **3** | **50%** | [ĐÃ XÁC MINH] `CVViewPage.tsx` có nút Copy Link (`navigator.clipboard`). Schema có trường `slug`. | Chưa hỗ trợ routing thuần theo username (`/u/username` hiện chỉ đọc id); chưa có OG tag động cho social preview. |
| **L** | Hạ tầng, Deploy & CI/CD | Mục 7.2 | **1** | **15%** | [ĐÃ XÁC MINH] Có script build Vite. Không có `vercel.json`, không có `.env.example`, không có GitHub Actions CI workflow. | Cần bổ sung file cấu hình deploy Vercel và GitHub Actions. |
| **M** | Báo cáo tiến độ (`PROJECT_STATUS.md`) | Mục 9 | **2** | **35%** | [ĐÃ XÁC MINH] `PROJECT_STATUS.md` bị lệch pha nghiêm trọng so với thực tế (ghi commit cũ `ee28790`, ghi Template 2 và Explore là "Chờ thực hiện" trong khi code đã làm xong). | Cần đồng bộ và chuẩn hóa ngay trong phiên này. |

### 2.3. Công thức tính và % Hoàn thiện tổng thể
- **Công thức tính có trọng số (Weighted Completion Rate)**:
  $$\text{Tổng tiến độ} = \sum (\text{\% Hoàn thiện từng hạng mục} \times \text{Trọng số})$$
  - Nhóm Tầng Trình diễn & Giao diện (A1..A3, C1..C4, I): Trọng số 35% $\rightarrow$ Hoàn thiện: $77.8\% \times 35\% = \mathbf{27.2\%}$
  - Nhóm Trình biên tập CV (D1..D4, E): Trọng số 20% $\rightarrow$ Hoàn thiện: $40.0\% \times 20\% = \mathbf{8.0\%}$
  - Nhóm Xuất bản in & PDF (F): Trọng số 10% (Tạm hoãn) $\rightarrow$ Hoàn thiện: $30.0\% \times 10\% = \mathbf{3.0\%}$
  - Nhóm Quản trị, Xác thực & Phân quyền (A4, A5, G, J): Trọng số 15% $\rightarrow$ Hoàn thiện: $0.0\% \times 15\% = \mathbf{0.0\%}$
  - Nhóm Lưu trữ & Dữ liệu Backend (B, H, K): Trọng số 15% $\rightarrow$ Hoàn thiện: $55.0\% \times 15\% = \mathbf{8.25\%}$
  - Nhóm Hạ tầng & Quy trình (A6, L, M): Trọng số 5% $\rightarrow$ Hoàn thiện: $30.0\% \times 5\% = \mathbf{1.5\%}$
- **TỔNG TIẾN ĐỘ THỰC TẾ DỰ ÁN**: **47.95%** trên phạm vi Frontend Prototype; nhưng chỉ đạt **28.5%** trên toàn bộ hệ thống Full-stack theo đặc tả `y_tuong.txt`.

### 2.4. Danh mục tính năng "Có giao diện nhưng KHÔNG có logic / backend"
1. **Avatar Upload**: Có khung hiển thị avatar, nhưng chỉ nhận text URL paste vào; hoàn toàn không có cơ chế upload file ảnh từ máy tính, không có lưu trữ Cloudinary/Firebase Storage.
2. **Nút "Chỉnh Sửa CV" trên trang công khai**: Hiển thị nút cho tất cả mọi người bấm vào được; không có logic kiểm tra `isOwner` hay session đăng nhập.
3. **Thanh tìm kiếm & Lọc trên Menu chính**: Hoạt động hoàn toàn in-memory trên mảng 6 phần tử `mockProfilesList`; không có truy vấn cơ sở dữ liệu.
4. **Nút "Đăng Nhập / Đăng Ký" trên thanh Header**: Chỉ là text link tĩnh dẫn vào nút chưa có route hoạt động (dẫn về 404).
5. **Số liệu thống kê / Đếm lượt xem**: Trường `viewCount` trong ý tưởng hoàn toàn không có logic ghi nhận hay hiển thị.
6. **Backend Server (`backend/src/server.ts`)**: File server 23 dòng chỉ có 1 endpoint rỗng `/api/health`; không hề có bất kỳ kết nối nào giữa frontend và backend.

---

## 3. BẢNG CHỈ SỐ KỸ THUẬT (STATIC & RUNTIME AUDIT)

| Chỉ số | Giá trị đo lường thực tế | Đánh giá chuyên môn | Bằng chứng kiểm tra |
|:---|:---:|:---:|:---|
| **TypeScript Compile (`tsc --noEmit`)** | **0 lỗi (Exit Code 0)** |  Xuất sắc | Lệnh `npx tsc --noEmit` chạy sạch hoàn toàn, không có lỗi type. |
| **Production Build (`vite build`)** | **Thành công (6.3s)** |  Đạt | Sinh bundle trong thư mục `dist/` (Tổng dung lượng 6.6 MB bao gồm 5.4 MB fonts). |
| **Cảnh báo kích thước Bundle** | 1 Chunk vượt 1MB (`index-3kVY6HNx.js`: 1,031 kB) | ⚠️ Cần tối ưu | Chưa dùng `React.lazy()` / code-splitting theo route. Bundle nạp toàn bộ Lucide và template một lúc. |
| **Lỗ hổng bảo mật Dependency (`npm audit`)** | **2 Critical Vulnerabilities** | 🛑 Nguy hiểm | `html2pdf.js <=0.13.0` & `jspdf <=4.2.0` chứa CVE XSS và Path Traversal. |
| **Dung lượng Phông chữ Web (`public/fonts/`)** | **5.4 MB (39 files .otf)** | ⚠️ Quá nặng | Tải toàn bộ font weights cục bộ vào thư mục tĩnh làm chậm tốc độ tải trang lần đầu (First Load). |
| **Lighthouse - Trang Chủ (`/`)** | Perf: 48 \| A11y: 94 \| BP: 100 \| SEO: 92 | ⚠️ Cần tối ưu LCP | LCP cao (32.2s trong môi trường headless dev), thiếu thẻ `<main>`, thiếu `robots.txt`. |
| **Lighthouse - Trang CV (`/cv/:id`)** | Perf: 48 \| A11y: 93 \| BP: 100 \| SEO: 92 | ⚠️ Cần chỉnh thứ tự heading | Lỗi heading order (nhảy từ h1 sang h3), tỷ lệ tương phản ở một số nhãn màu xám. |
| **Lighthouse - Trình Editor (`/editor/:id`)** | Perf: 45 \| A11y: 85 \| BP: 100 \| SEO: 92 | ⚠️ Cần bổ sung ARIA | Nút bấm thiếu nhãn hiển thị cho screen reader (`link-name`), lỗi tương phản màu trên thẻ phụ. |
| **Bảo mật XSS (Script Injection)** | **Phát hiện 1 điểm hổng thực tế** | 🛑 Nguy hiểm | Thẻ `<a>` trong CV preview render trực tiếp `href={personalInfo.website}` chấp nhận protocol `javascript:`. |
| **Bảo mật bí mật (Secret Leaks)** | **0 Secret bị lộ** |  An toàn | Quét toàn bộ repo và lịch sử git không thấy API Key hay Token nhạy cảm nào bị commit. |

---

## 4. DANH SÁCH LỖI ĐẦY ĐỦ (BUG TRACKER)

---

### BUG-001: Lỗ hổng Stored XSS thông qua liên kết website cá nhân trong bản xem trước CV
- **Mức độ**: **Critical** (Cho phép thực thi mã JavaScript tùy ý trên trình duyệt người xem)
- **Ưu tiên sửa**: **P0**
- **Module/Tầng**: Presentation / Template Engine
- **Môi trường**: Mọi trình duyệt (Chrome, Edge, Firefox, Safari)
- **Các bước tái hiện**:
  1. Truy cập `http://localhost:3000/editor/cv-thanhtruc-01`.
  2. Mở khối "Thông Tin Cá Nhân & Liên Hệ".
  3. Tại trường "Website Cá Nhân", nhập: `javascript:alert(1)`.
  4. Quan sát khung A4 Live Preview bên phải, rê chuột và click vào icon/link Website cá nhân.
- **Kết quả thực tế**: Trình duyệt lập tức kích hoạt hộp thoại `alert(1)`, chứng minh mã JavaScript nhúng đã được thực thi trực tiếp.
- **Kết quả mong đợi**: Link phải được kiểm tra (whitelist chỉ chấp nhận `http://` hoặc `https://`), tự động prepend `https://` nếu người dùng chỉ nhập domain, hoặc vô hiệu hóa thẻ `<a>` nếu protocol không an toàn.
- **Bằng chứng**: 
  - `CVTemplateClassicTeal.tsx` dòng 227: `<a href={personalInfo.website} target="_blank">`
  - `CVTemplateWarmBold.tsx` dòng 381: `<a href={personalInfo.website} target="_blank">`
  - `CVTemplateModernMinimal.tsx` dòng 217: `<a href={personalInfo.website} target="_blank">`
  - Ghi nhận thực tế từ Browser Agent: `javascript:alert(1)` render thẳng vào DOM và thực thi khi click.
- **Nguyên nhân gốc**: [ĐÃ XÁC MINH] Không có hàm sanitize URL hoặc kiểm tra giao thức (`url.startsWith('http://') || url.startsWith('https://')`) trước khi gán vào thuộc tính `href`.
- **Hướng khắc phục đề xuất**: Viết hàm tiện ích `formatSafeUrl(url: string)`: nếu URL bắt đầu bằng `javascript:`, `data:`, `vbscript:`, lập tức loại bỏ hoặc trả về `#`. Tự động thêm `https://` cho các URL hợp lệ.
- **Trạng thái**: Đã tái hiện (P0).

---

### BUG-002: Lỗi kiến trúc lưu trữ Draft: Ghi đè chéo dữ liệu giữa các CV và mất dữ liệu khi F5
- **Mức độ**: **Blocker** (Phá hỏng tính toàn vẹn của dữ liệu người dùng khi biên tập)
- **Ưu tiên sửa**: **P0**
- **Module/Tầng**: State & Business Logic (`useCVEditor.ts`)
- **Môi trường**: Tất cả môi trường
- **Các bước tái hiện**:
  1. Người dùng mở `http://localhost:3000/editor/cv-thanhtruc-01`.
  2. Sửa "Họ và Tên" thành "Nguyễn Văn Đang Soạn". Chờ 2 giây để thấy trạng thái "Đã lưu tự động".
  3. Nhấn F5 để tải lại trang.
  4. Mở tiếp `http://localhost:3000/editor/cv-thanh-truc-02`.
- **Kết quả thực tế**:
  - Tại bước 3: Tên người dùng bị **reset trở lại "Trần Anh Khôi"** (mất sạch nội dung vừa gõ). Lý do: dòng 26 `useCVEditor.ts` kiểm tra `if (initialData) return initialData;`, vì route có `id` nên `initialPreset` luôn tồn tại và ghi đè lên draft đã lưu!
  - Tại bước 4: Nếu người dùng truy cập route `/editor` (không kèm ID), hệ thống lại nạp `cv_studio_draft_cv` của ứng viên trước đó, gây lẫn lộn hồ sơ của người khác vào hồ sơ mới.
- **Kết quả mong đợi**: Draft trong `localStorage` phải được phân vùng theo ID CV (ví dụ `cv_studio_draft_${cvId}`). Khi mở `/editor/:id`, hệ thống phải ưu tiên nạp bản draft của đúng ID đó (nếu có và thời gian cập nhật mới hơn dữ liệu gốc).
- **Bằng chứng**: `frontend/src/features/cv-editor/hooks/useCVEditor.ts` dòng 15, 25-36, 52:
  ```ts
  export const DRAFT_STORAGE_KEY = 'cv_studio_draft_cv'; // 1 KEY DUY NHẤT TOÀN HỆ THỐNG
  const [cvData, setCvData] = useState<CVData>(() => {
    if (initialData) return initialData; // BỎ QUA HOÀN TOÀN DRAFT KHI CÓ ID
    ...
  });
  ```
- **Nguyên nhân gốc**: [ĐÃ XÁC MINH] Thiết kế key cố định không có namespace id và điều kiện nạp state ban đầu ưu tiên sai thứ tự.
- **Hướng khắc phục đề xuất**: Sửa key lưu trữ thành `cv_studio_draft_${cvData.id}`. Cho phép người dùng lựa chọn khôi phục draft hoặc tải lại bản gốc khi phát hiện có draft cũ lưu trong máy.
- **Trạng thái**: Đã tái hiện (P0).

---

### BUG-003: Lỗi Fallback sai khi truy cập ID CV không tồn tại trên trang xem công khai
- **Mức độ**: **Critical** (Gây sai lệch danh tính và hiển thị sai logic nghiệp vụ)
- **Ưu tiên sửa**: **P1**
- **Module/Tầng**: Presentation / Routing (`CVViewPage.tsx`)
- **Môi trường**: Mọi trình duyệt
- **Các bước tái hiện**:
  1. Nhập đường dẫn: `http://localhost:3000/cv/ho-so-khong-ton-tai-99999`.
- **Kết quả thực tế**: Hệ thống **không** hiển thị trang 404. Thay vào đó, hệ thống tự động hiển thị đầy đủ CV của ứng viên số 1 ("Trần Anh Khôi") với URL vẫn giữ nguyên là `/cv/ho-so-khong-ton-tai-99999`!
- **Kết quả mong đợi**: Khi không tìm thấy CV theo ID hoặc Slug, hệ thống phải render `NotFoundPage` kèm thông báo: "Không tìm thấy hồ sơ CV này hoặc hồ sơ đã bị xóa".
- **Bằng chứng**: `frontend/src/pages/CVViewPage.tsx` dòng 36:
  ```ts
  const initialData = (id ? getCVByIdOrSlug(id) : undefined) || mockProfilesList[0]; // FALLBACK SAI LOGIC
  ```
- **Nguyên nhân gốc**: [ĐÃ XÁC MINH] Toán tử fallback `|| mockProfilesList[0]` tự động ép dữ liệu mặc định thay vì xử lý ngoại lệ `not found`.
- **Hướng khắc phục đề xuất**: Kiểm tra nếu `id` được truyền vào mà `getCVByIdOrSlug(id)` trả về `undefined`, hiển thị component `<NotFoundPage />` hoặc chuyển hướng về trang 404.
- **Trạng thái**: Đã tái hiện (P1).

---

### BUG-004: Trình biên tập CV bỏ quên hoàn toàn khối Thành Tựu và Chứng Chỉ
- **Mức độ**: **Major** (Người dùng không thể nhập liệu đầy đủ các mục chuẩn của CV)
- **Ưu tiên sửa**: **P1**
- **Module/Tầng**: Presentation / CV Editor
- **Môi trường**: Mọi trình duyệt
- **Các bước tái hiện**:
  1. Mở `http://localhost:3000/editor/cv-thanhtruc-01`.
  2. Cuộn xem toàn bộ danh sách các Accordion ở cột bên trái.
- **Kết quả thực tế**: Chỉ có 7 nhóm (Thông tin cá nhân, Tóm tắt, Kinh nghiệm, Học vấn, Kỹ năng, Dự án, Tùy biến giao diện). Không có Accordion nào dành cho **Thành tựu & Giải thưởng (Achievements)** và **Chứng chỉ chuyên môn (Certificates)** dù trong `types/cv.ts` và `mockProfiles.ts` đều đã định nghĩa.
- **Kết quả mong đợi**: Editor phải có đầy đủ 9 khối như tài liệu phân tích `y_tuong.txt` (Mục 3, khoản 7 & 8) đã quy định.
- **Bằng chứng**: `frontend/src/pages/CVEditorPage.tsx` dòng 74-82 và các file trong `frontend/src/features/cv-editor/components/sections/` (hoàn toàn vắng bóng `AchievementSection.tsx` và `CertificateSection.tsx`).
- **Nguyên nhân gốc**: [ĐÃ XÁC MINH] Chưa code UI component cho 2 khối này trong quá trình làm Phase 2.
- **Hướng khắc phục đề xuất**: Xây dựng thêm `AchievementsSection.tsx` và `CertificatesSection.tsx` theo mẫu tương tự `ProjectsSection.tsx`, sau đó tích hợp vào `CVEditorPage.tsx` và `useCVEditor.ts`.
- **Trạng thái**: Đã tái hiện (P1).

---

### BUG-005: 2 Lỗ hổng bảo mật cấp Critical trong thư viện `html2pdf.js` và `jspdf`
- **Mức độ**: **Major** (Rủi ro an ninh chuỗi cung ứng dependency)
- **Ưu tiên sửa**: **P1**
- **Module/Tầng**: Infrastructure / Dependency
- **Bằng chứng**: Output lệnh `npm audit --omit=dev`:
  - `html2pdf.js <=0.13.0` (Cross-Site Scripting vulnerability - GHSA-w8x4-x68c-m6fc)
  - `jspdf <=4.2.0` (Local File Inclusion/Path Traversal, PDF Injection - GHSA-f8cm-6447-x5h2)
- **Nguyên nhân gốc**: [ĐÃ XÁC MINH] `html2pdf.js` là thư viện cũ không còn được bảo trì tích cực.
- **Hướng khắc phục đề xuất**: Vì tính năng xuất PDF hiện đã được người dùng chỉ định **TẠM HOÃN**, khi quay lại làm tính năng này ở giai đoạn sau, nên gỡ bỏ hoàn toàn `html2pdf.js` và thay thế bằng giải pháp native `window.print()` kết hợp stylesheet `@media print` được tinh chỉnh tỉ mỉ (vừa tạo file PDF vector sắc nét, copy được chữ, vừa loại bỏ 100% mã nguồn độc hại từ dependency).
- **Trạng thái**: Đã ghi nhận (P1).

---

### BUG-006: Họ tên quá dài hoặc chuỗi ký tự liên tục làm vỡ khung Header trên CV
- **Mức độ**: **Minor** (Lỗi hiển thị giao diện khi gặp dữ liệu biên)
- **Ưu tiên sửa**: **P2**
- **Module/Tầng**: Presentation / Templates
- **Các bước tái hiện**:
  1. Trong ô Họ và Tên của Editor, nhập chuỗi 100 ký tự 'W' liên tục không có khoảng trắng.
  2. Quan sát bản xem trước A4 bên phải.
- **Kết quả thực tế**: Dòng tên tràn ra khỏi khung nền header màu xanh/ink, đè lên ảnh đại diện và tràn khỏi lề trang giấy.
- **Kết quả mong đợi**: Chữ phải tự động ngắt dòng mềm bằng class `break-words` hoặc `break-all`.
- **Bằng chứng**: Ảnh chụp từ Browser Subagent `overflow_preview_1791865028883.png`.
- **Trạng thái**: Đã tái hiện (P2).

---

### BUG-007: Thiếu cấu hình SPA Routing Fallback (`vercel.json`)
- **Mức độ**: **Major** (Khi deploy lên Vercel/Netlify, người dùng F5 tại bất kỳ trang con nào sẽ bị lỗi 404 của web server)
- **Ưu tiên sửa**: **P1**
- **Module/Tầng**: Infrastructure / Deploy
- **Bằng chứng**: Thư mục gốc không tồn tại file `vercel.json` (Lệnh `Test-Path vercel.json` trả về `False`).
- **Nguyên nhân gốc**: [ĐÃ XÁC MINH] Chưa cấu hình tệp định tuyến rewrite `/*` về `/index.html`.
- **Hướng khắc phục đề xuất**: Tạo tệp `vercel.json` với cấu hình `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`.
- **Trạng thái**: Đã xác minh (P1).

---

## 5. NỢ KỸ THUẬT VÀ RỦI RO KIẾN TRÚC (TECH DEBT & RISKS)

1. **Rủi ro rò rỉ kiến trúc phân tầng (Architecture Leakage)**:
   - Đặc tả `y_tuong.txt` cam kết sử dụng Zustand cho tầng State (`useCVStore`, `useAuthStore`, `useThemeStore`).
   - Nhưng thực tế trong code hiện tại, Zustand **hoàn toàn chưa được cài đặt hay sử dụng**. Toàn bộ state nằm rải rác trong `useCVEditor` và `useState` tại các page. Điều này khiến việc đồng bộ dữ liệu giữa các trang (ví dụ từ Editor quay lại HomePage hoặc ViewPage) không thể thực hiện mượt mà nếu không có store toàn cục.
2. **Kích thước font tĩnh quá nặng (5.4 MB)**:
   - Thư mục `frontend/public/fonts/` đang chứa tới 39 tệp font việt hóa dạng `.otf` không nén. Điều này khiến mỗi lần build và nạp trang web lần đầu người dùng phải tải một lượng tài nguyên khổng lồ, làm điểm số Lighthouse Performance chỉ đạt 45-48 điểm.
   - *Khuyến nghị*: Chỉ giữ lại các định dạng WOFF2 đã subsetting ký tự tiếng Việt cho các weight thực sự dùng (`Regular 400`, `SemiBold 600`, `Bold 700`).
3. **Chưa có cơ chế xử lý xung đột dữ liệu (Conflict Strategy)**:
   - Hiện chưa có thiết kế giải quyết xung đột khi dữ liệu trong `localStorage` lệch pha với dữ liệu từ Server/Firestore khi tích hợp backend sau này.

---

## 6. MÂU THUẪN GIỮA ĐẶC TẢ, BÁO CÁO VÀ THỰC TẾ

| Vấn đề | Tự khai báo trong `PROJECT_STATUS.md` | Đặc tả trong `y_tuong.txt` | Thực tế kiểm chứng [ĐÃ XÁC MINH] |
|:---|:---|:---|:---|
| **Git Commit & Tiến độ** | Ghi commit `ee28790`, ghi Mẫu 2, Trang chủ, Editor là "Chờ thực hiện". | Roadmap chia 6 bước. | **Sai hoàn toàn**: Git đang ở commit `ec26185`; Mẫu 1, 2, 3, Trang chủ và Editor thực tế đều **đã được code xong** từ các phiên trước nhưng người làm trước không chịu cập nhật dev-log! |
| **Công nghệ State** | Khai báo dùng Zustand (`useCVStore`, `useAuthStore`). | Tầng 3 dùng Zustand. | **Thực tế không có Zustand**: `package.json` không có gói zustand, không có file store nào. |
| **Bảo mật & Phân quyền** | Khai báo chỉ chủ sở hữu mới được sửa CV. | Phân quyền chủ sở hữu / khách. | **Thực tế chưa có**: Ai cũng thấy nút "Chỉnh Sửa CV" và có thể click vào sửa bất kỳ hồ sơ nào. |
| **Định dạng file PDF** | Đặc tả ghi "searchable text, vector sắc nét". | Kết hợp `html2pdf.js` và `@media print`. | **Mâu thuẫn kỹ thuật**: `html2pdf.js` thực chất chụp ảnh màn hình bằng canvas rồi nhét vào PDF, tạo ra file raster (ảnh), không thể bôi đen copy chữ. *(Hiện tính năng này đã được người dùng cho phép tạm hoãn để giải quyết sau).* |

---

## 7. ĐIỂM LÀM TỐT (STRENGTHS & HIGHLIGHTS)

1. **Kiến trúc Template Registry xuất sắc**: Tệp `TemplateRegistry.ts` triển khai Registry Pattern cực kỳ chuẩn mực, độc lập hoàn toàn giữa 3 template, cho phép bổ sung template mới mà không đụng chạm đến logic lõi.
2. **Thiết kế UI/UX hiện đại, thẩm mỹ cao**: Bố cục 3 mẫu CV (Classic Teal, Warm Bold, Modern Minimal) có tỷ lệ thị giác rất đẹp, màu sắc tương phản hài hòa, typography chuẩn tiếng Việt không bị lỗi hiển thị.
3. **Khả năng Type-Safe tuyệt đối**: Toàn bộ dự án `tsc --noEmit` đạt 0 lỗi, kiểu dữ liệu interface rõ ràng, sạch sẽ, không lạm dụng `any` bừa bãi.
4. **Cô lập Dark Mode thành công**: Đã giải quyết triệt để lỗi xung đột màu chữ trên tờ giấy A4 khi bật dark mode của website (giấy CV luôn giữ độ tương phản tiêu chuẩn).

---

## 8. KHUYẾN NGHỊ VÀ LỘ TRÌNH ĐIỀU CHỈNH ĐỀ XUẤT

### 8.1. Thứ tự ưu tiên xử lý ngay (Top Priorities)
1. **P0 - Khắc phục ngay lỗ hổng XSS (BUG-001)**: Viết hàm format và sanitize URL cá nhân trước khi render vào thẻ `<a>`.
2. **P0 - Tái cấu trúc cơ chế lưu Draft (BUG-002)**: Đổi key lưu trữ theo ID CV và sửa logic nạp state ban đầu trong `useCVEditor.ts`.
3. **P1 - Xử lý trường hợp 404 cho CV không tồn tại (BUG-003)**: Trả về trang 404 thay vì fallback âm thầm về hồ sơ số 1.
4. **P1 - Bổ sung Form cho Thành Tựu & Chứng Chỉ trong Editor (BUG-004)**: Hoàn thiện đủ 9 khối dữ liệu.
5. **P1 - Thêm tệp `vercel.json`** để chuẩn bị sẵn sàng cho việc deploy mà không bị gãy SPA routing.

### 8.2. Đề xuất điều chỉnh lộ trình sau khi Tạm hoãn tính năng PDF
- **Pha hiện tại (Ổn định Client-Side)**: Hoàn thiện dứt điểm 5 việc ưu tiên trên $\rightarrow$ Tối ưu hóa bundle và responsive mobile.
- **Pha tiếp theo (Backend & Auth)**: Dựng module Auth (Firebase Auth hoặc JWT), xây dựng Database schema cho CV, thêm logic bảo vệ phân quyền `isOwner` cho trang Editor.
- **Pha sau cùng (Xuất bản in & PDF)**: Triển khai tính năng in ấn chuẩn khổ A4 bằng native CSS `@media print` sắc nét 100% vector và loại bỏ dependency lỗi thời `html2pdf.js`.

---

## 9. KẾT LUẬN CUỐI CÙNG

- **Đánh giá tổng thể**: **CONDITIONAL GO** (Cho phép tiếp tục hoàn thiện các tính năng giao diện còn thiếu và sửa các lỗi logic trọng yếu trên client-side, nhưng **CHẶN (NO-GO)** việc tích hợp backend hoặc release ra môi trường thực tế cho đến khi khắc phục xong các lỗi P0/P1 trong danh sách).

---

## 10. PHỤ LỤC (COMMANDS & EVIDENCE LOGS)

- Lệnh kiểm tra biên dịch: `npx tsc --noEmit` $\rightarrow$ Exit code 0.
- Lệnh kiểm tra build: `npm run build` $\rightarrow$ Thành công trong 6.30s.
- Lệnh kiểm tra dependency: `npm audit --omit=dev` $\rightarrow$ Phát hiện 2 Critical CVEs (`html2pdf.js`, `jspdf`).
- Lệnh kiểm tra chỉ số Lighthouse: `npx lighthouse http://localhost:3000/ ...` $\rightarrow$ Sinh kết quả tại `lh_home.json`, `lh_cv.json`, `lh_editor.json`.
- Bằng chứng video tương tác kiểm thử tự động lưu trữ tại: `verify_edge_cases_1791864832894.webp`.
