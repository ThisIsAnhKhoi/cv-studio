# TỔNG HỢP QUYẾT ĐỊNH KIẾN TRÚC & SẢN PHẨM (ARCHITECTURAL DECISION RECORDS - ADR)
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Tech Lead kiêm Product Owner / Solution Architect  
**Ngày ban hành**: 13/10/2026  
**Trạng thái**: Có hiệu lực (Approved)  

---

## ADR-001: Lựa chọn Kiến trúc Backend & Dịch vụ Nền tảng
- **Ngữ cảnh**: Đặc tả `y_tuong.txt` nêu song song hai phương án: Firebase Serverless (Auth, Firestore, Storage) và Express + Database trên Render. Hiện tại repo có thư mục `backend/src/server.ts` nhưng chỉ là file Express stub 23 dòng, không có DB, không có kết nối với frontend.
- **Phương án cân nhắc**:
  1. *Phương án A*: Giữ backend Express trên Render + cơ sở dữ liệu MongoDB/PostgreSQL tự quản trị.
  2. *Phương án B*: Sử dụng hoàn toàn Firebase Serverless (Firebase Auth, Cloud Firestore, Firebase Security Rules).
- **Quyết định**: **[QUYẾT ĐỊNH] CHỌN PHƯƠNG ÁN B (Firebase Serverless). BỎ STUB `backend/` TRONG PHẠM VI MVP.**
- **Lý do**:
  - Đội ngũ hiện tại chỉ có 1 chủ dự án + trợ lý AI. Việc duy trì thêm một server Express trên Render tạo ra chi phí vận hành kép (bảo trì server, cold start 50 giây của Render gói miễn phí, viết boilerplate auth/token/cors/migration).
  - Firebase Serverless cung cấp sẵn Auth (Google 1-click + Email/Password), Firestore (NoSQL linh hoạt đúng cấu trúc JSON của CV, realtime sync, offline-persistence), và Security Rules bảo vệ dữ liệu ở tầng DB mà không cần viết server trung gian.
  - Ngân sách miễn phí của Firebase (Spark Plan) hào phóng hơn nhiều: 50,000 lượt đọc/ngày, 20,000 lượt ghi/ngày, 1GB lưu trữ, hoàn toàn đủ cho giai đoạn MVP và tăng trưởng ban đầu.
- **Phương án bị loại**: Express trên Render bị loại vì tăng gấp đôi bề mặt lỗi, lãng phí thời gian viết CRUD thông thường thay vì tập trung vào UX và Editor.
- **Hệ quả & Kế hoạch xử lý file stub**: Thư mục `backend/` sẽ được đóng băng (không phát triển tiếp) và sẽ được dọn dẹp khỏi monorepo khi hoàn thành tích hợp Firebase SDK trực tiếp vào `frontend/src/services/firebase.ts`.

---

## ADR-002: Giải pháp Quản lý & Lưu trữ Ảnh Đại diện (Avatar)
- **Ngữ cảnh**: Đặc tả gốc đề xuất Firebase Storage, nhưng chủ dự án đang nghiêng về Cloudinary. UI hiện tại chỉ là một ô input text nhận URL, chưa có upload từ máy, chưa có crop ảnh.
- **Phương án cân nhắc**:
  1. *Phương án A*: Firebase Storage (đồng bộ hệ sinh thái Firebase).
  2. *Phương án B*: Cloudinary Media Cloud (gói miễn phí 25 Credits/tháng ~ 25GB dung lượng hoặc 25,000 lần biến đổi).
- **Quyết định**: **[QUYẾT ĐỊNH] CHỌN PHƯƠNG ÁN B (Cloudinary), TRIỂN KHAI VÀO GIAI ĐOẠN 4 VỚI UNSIGNED PRESET CÓ GIỚI HẠN NGHIÊM NGẶT.**
- **Lý do**:
  - CV yêu cầu ảnh đại diện phải có tỉ lệ vuông hoặc tròn hoàn hảo (1:1), tự động căn giữa khuôn mặt (face-detection crop) và nén webp/avif để trang CV tải tức thì. Firebase Storage chỉ là kho chứa file thô, không có chức năng tự động crop khuôn mặt hay nén ảnh on-the-fly; nếu dùng Firebase thì client phải tự viết code crop bằng canvas rất cồng kềnh.
  - Cloudinary có sẵn tính năng `c_fill,g_face,w_400,h_400,f_auto,q_auto` giúp mọi ảnh upload lên lập tức trở thành avatar chuẩn chuyên nghiệp mà không cần thư viện crop phức tạp ở frontend.
- **Quy tắc an toàn bảo mật bắt buộc**:
  - Tuyệt đối KHÔNG đưa `API_SECRET` vào mã nguồn frontend.
  - Sử dụng Unsigned Upload Preset với các hạn chế cứng được cấu hình trực tiếp trên Dashboard Cloudinary:
    + Giới hạn định dạng: chỉ chấp nhận `jpg, png, webp` (chặn đứng file `.svg` để chống SVG XSS).
    + Giới hạn kích thước tối đa: tối đa 3 MB/ảnh.
    + Tự động gắn tag và folder `cv_avatars`.
- **Hệ quả**: Phụ thuộc vào tài khoản Cloudinary riêng. Nếu gói miễn phí cạn kiệt, hệ thống fallback về ảnh mặc định unplash/ui-avatars.

---

## ADR-003: Chiến lược Quản lý State: Khi nào đưa Zustand vào?
- **Ngữ cảnh**: Đặc tả yêu cầu kiến trúc 4 tầng với Zustand (`useCVStore`, `useAuthStore`, `useThemeStore`). Thực tế hiện tại toàn bộ state nằm trong `useCVEditor.ts` (React `useState`) và `App.tsx`.
- **Phương án cân nhắc**:
  1. *Phương án A*: Viết lại toàn bộ sang Zustand ngay lập tức ở phiên làm việc đầu tiên.
  2. *Phương án B*: Giữ nguyên `useCVEditor` tạm thời để vá 2 lỗi P0 (XSS và Draft), sau đó chuyển đổi sang Zustand ở Giai đoạn 2 trước khi làm Auth.
  3. *Phương án C*: Bỏ luôn Zustand, dùng Context API + `useReducer`.
- **Quyết định**: **[QUYẾT ĐỊNH] CHỌN PHƯƠNG ÁN B. ĐƯA ZUSTAND VÀO Ở GIAI ĐOẠN 2 (CHUẨN BỊ CHO AUTH).**
- **Lý do**:
  - Nguyên tắc số 1 của Tech Lead: **Không refactor cấu trúc trên một nền tảng đang có lỗi P0/Blocker**. Phải đóng dứt điểm BUG-001 (XSS) và BUG-002 (Draft storage) trên hook hiện tại trước để bảo đảm hệ thống hoạt động ổn định.
  - Tại sao vẫn cần Zustand mà không giữ `useState`? Khi đưa Auth và Dashboard vào, trang Dashboard cần đọc danh sách CV, trang Editor cần đọc thông tin user và lưu trạng thái dirty/saving toàn cục, trang View cần đồng bộ khi quay lại chỉnh sửa. `useState` cục bộ sẽ biến thành "prop drilling hell" hoặc gây re-render toàn bộ App.
  - Zustand cực nhẹ (1.1 kB), không boilerplate, hỗ trợ middleware `persist` chuẩn cho localStorage và `devtools`.
- **Hệ quả**: Hook `useCVEditor` ở Giai đoạn 2 sẽ được refactor thành Zustand store `src/stores/cvStore.ts`, giữ nguyên API tương thích để các component section không bị xáo trộn.

---

## ADR-004: Định hướng Mẫu CV (Template Engine) & Bộ 3 Mẫu Hiện tại
- **Ngữ cảnh**: Đặc tả `y_tuong.txt` mô tả Dáng 3 là "Dynamic Red / Compact" (Header tối vạch đỏ). Trong mã nguồn, Mẫu 3 đã được lập trình với tên `CVTemplateModernMinimal.tsx` (Lưới cân đối, dải thẻ liên hệ). TemplateRegistry đã hỗ trợ 3 mẫu này hoàn chỉnh.
- **Quyết định**: **[QUYẾT ĐỊNH] GIỮ NGUYÊN BỘ 3 TEMPLATE HIỆN TẠI (CLASSIC TEAL, WARM BOLD, MODERN MINIMAL). SỬA ĐẶC TẢ THEO THỰC TẾ.**
- **Lý do**:
  - Mẫu 3 hiện tại (`CVTemplateModernMinimal`) có bố cục hiện đại, cân đối, đã được kiểm thử trực tiếp trên trình duyệt, mã nguồn sạch sẽ và thẩm mỹ cao.
  - Việc đập đi viết lại một mẫu đỏ compact chỉ để đúng từng chữ với văn bản ý tưởng ban đầu là lãng phí tài nguyên phát triển và tiềm ẩn nguy cơ sinh lỗi hồi quy.
  - 3 mẫu hiện tại đại diện đủ 3 phong cách:
    1. *Classic Editorial (Sidebar Trái)*: Truyền thống, học thuật.
    2. *Warm Bold (Nền Cát & Viền Cam)*: Công nghệ, Startup, EdTech.
    3. *Modern Minimal (Dải thẻ ngang & Lưới thẻ)*: Kinh doanh, Quản trị, Marketing.
- **Hệ quả**: Cập nhật lại Mục 4.3 trong `y_tuong.txt` cho khớp với thực tế mã nguồn. Đóng băng danh sách template ở con số 3 cho đến khi release MVP.

---

## ADR-005: Mở rộng Data Schema & Chiến lược Đồng bộ (Persistence Strategy)
- **Ngữ cảnh**: Schema `types/cv.ts` hiện tại thiếu các trường quản trị hệ thống (`ownerId`, `slug` duy nhất, `visibility`, `createdAt`, `updatedAt`, `viewCount`, `isPublic`). Cơ chế lưu hiện tại ghi đè 1 key localStorage duy nhất.
- **Quyết định**: **[QUYẾT ĐỊNH] MỞ RỘNG SCHEMA VÀ ÁP DỤNG CHIẾN LƯỢC DRAFT-FIRST CÓ NAMESPACE ID.**
- **Thiết kế chi tiết**:
  1. *Bổ sung trường vào `CVData`*:
     ```ts
     export interface CVData {
       id: string;              // UUID duy nhất
       ownerId: string;         // ID tài khoản sở hữu (hoặc 'anonymous')
       slug: string;            // Đường dẫn URL duy nhất (/u/:slug)
       visibility: 'public' | 'private' | 'unlisted';
       schemaVersion: number;   // Quản lý migration dữ liệu (bắt đầu = 1)
       // ... 9 khối nội dung chuẩn
       createdAt: string;       // ISO Timestamp
       updatedAt: string;       // ISO Timestamp
       viewCount: number;
     }
     ```
  2. *Chiến lược lưu trữ cục bộ (Offline/Draft)*:
     - Key lưu trữ: `cv_studio_draft_${cvId}`.
     - Key danh sách hồ sơ gần đây: `cv_studio_recent_ids`.
     - Khi mở `/editor/:id`: Kiểm tra `localStorage.getItem('cv_studio_draft_' + id)`. Nếu có và `updatedAt` của draft mới hơn bản gốc $\rightarrow$ hiển thị thông báo toast: "Đã khôi phục bản nháp chưa lưu gần nhất" kèm nút "Tải lại bản gốc".
  3. *Chiến lược đồng bộ khi có Backend*:
     - **Client-Wins cho Draft cá nhân**: Khi đăng nhập, hệ thống duyệt các draft `anonymous` trong localStorage và hỏi người dùng: "Bạn có muốn đồng bộ CV này vào tài khoản của bạn không?".

---

## ADR-006: Chính sách Quyền riêng tư & Bảo vệ Dữ liệu Cá nhân
- **Ngữ cảnh**: CV trực tuyến công khai có thể phơi bày email, số điện thoại, địa chỉ thật. Trang Khám phá (`/`) hiện tại hiển thị đầy đủ thông tin này của tất cả ứng viên.
- **Quyết định**: **[QUYẾT ĐỊNH] TRIỂN KHAI CỜ ẨN THÔNG TIN LIÊN HỆ VÀ CHẾ ĐỘ VISIBILITY Ở GIAI ĐOẠN 3.**
- **Quy tắc**:
  - Bổ sung cấu hình riêng tư vào `PersonalInfo`:
    `hidePhone?: boolean;`
    `hideEmail?: boolean;`
  - Trên Trang Khám phá (`/`): Mặc định chỉ hiển thị Vị trí (Location), Thành phố và liên kết LinkedIn/GitHub; số điện thoại và email cá nhân được ẩn dạng `0912 *** ***` hoặc nút "Liên hệ qua Email" mở form an toàn.
  - Chế độ `private`: CV chỉ chủ sở hữu xem được (khách truy cập thấy 404).
  - Chế độ `unlisted`: Không xuất hiện trên trang Khám phá, nhưng ai có link bí mật đều xem được.

---

## ADR-007: Chiến lược SEO & Chia sẻ Mạng Xã Hội (Social Preview / OG Tag)
- **Ngữ cảnh**: Ứng dụng là React SPA client-side thuần túy. Khi chia sẻ đường dẫn `/cv/:id` lên Facebook, Zalo, LinkedIn, bot tìm kiếm chỉ thấy file `index.html` tĩnh với tiêu đề chung của CV Studio, không có ảnh avatar và chức danh của ứng viên.
- **Phương án cân nhắc**:
  1. *Phương án A*: Viết lại toàn bộ dự án sang Next.js (SSR).
  2. *Phương án B*: Sử dụng giải pháp Pre-render / Vercel Serverless Function sinh thẻ meta động.
  3. *Phương án C*: Ở phạm vi MVP, dùng `react-helmet-async` cập nhật `document.title` và client-side meta; ghi nhận hạn chế OG tag cho giai đoạn sau MVP.
- **Quyết định**: **[QUYẾT ĐỊNH] CHỌN PHƯƠNG ÁN C CHO MVP. KHÔNG VIẾT LẠI NEXT.JS.**
- **Lý do**:
  - Viết lại sang Next.js ở thời điểm này sẽ phá vỡ toàn bộ tiến độ, mất thêm ít nhất 3-4 tuần để cấu hình lại routing, CSS build và monorepo.
  - Mục tiêu MVP là công cụ tạo và xem CV hoạt động trơn tru. Với Vercel, sau này có thể bổ sung 1 edge function nhẹ hoặc prerender proxy cho bot mạng xã hội mà không cần đổi framework frontend.

---

## ADR-008: Lộ trình Tính năng Xuất PDF & Dọn dẹp Dependency Độc hại
- **Ngữ cảnh**: Người dùng đã quyết định tạm hoãn tính năng xuất PDF. Báo cáo QA chỉ ra thư viện `html2pdf.js` và `jspdf` đang có 2 lỗ hổng bảo mật cấp Critical và sinh ra file PDF ảnh raster chất lượng thấp.
- **Quyết định**: **[QUYẾT ĐỊNH]**
  1. **Tạm ẩn nút "Tải PDF"** trên giao diện Editor và View (hoặc gắn badge "Đang nâng cấp"), chuyển hướng người dùng dùng nút "In A4" (`window.print()`).
  2. **Gỡ bỏ hoàn toàn `html2pdf.js` và `jspdf`** khỏi `package.json` trong Giai đoạn 5 để triệt tiêu 2 lỗ hổng Critical.
  3. **Giải pháp PDF tương lai**: Tận dụng triệt để stylesheet `@media print` sẵn có trong `index.css`. Khi người dùng nhấn "In / Xuất PDF", trình duyệt gọi `window.print()` với hộp thoại Save as PDF chuẩn của Chrome/Edge $\rightarrow$ Tạo file PDF vector sắc nét 100%, chọn và bôi đen copy chữ được, dung lượng dưới 100kB, không phụ thuộc vào bất kỳ thư viện bên ngoài nào.

---

## ADR-009: Quản lý Bản quyền Phông chữ & Tối ưu Dung lượng Web Font
- **Ngữ cảnh**: Thư mục `public/fonts/` đang chứa 39 tệp font `.otf` nặng 5.4 MB (iCiel Cubano, SVN-Optima, Gilroy, Montserrat). Đây là nguyên nhân trực tiếp kéo tụt hiệu năng First Load của website. Ngoài ra, các font này được sao chép từ máy cá nhân, chưa rõ bản quyền thương mại cho sản phẩm web công khai.
- **Quyết định**: **[QUYẾT ĐỊNH]**
  1. **Khuyến cáo pháp lý**: Ghi rõ vào tài liệu rủi ro pháp lý nếu thương mại hóa các font không rõ bản quyền.
  2. **Phương án kỹ thuật Giai đoạn 2**:
     - Ưu tiên sử dụng Google Fonts mở 100% bản quyền miễn phí: `Outfit` (Heading), `Montserrat` (Heading hiện đại), `Be Vietnam Pro` (Body tối ưu tiếng Việt), `Playfair Display` (Heading có chân sang trọng).
     - Với các font cá nhân (Cubano, Optima, Gilroy): Chỉ giữ lại tối đa 2 weight cần thiết (`Regular` và `Bold`), chuyển đổi từ `.otf` sang định dạng `.woff2` nén và thực hiện **subsetting ký tự tiếng Việt** (giảm dung lượng từ 5.4 MB xuống dưới 400 kB).

---

## ADR-010: Chiến lược Kiểm thử Tự động & Tiêu chuẩn Chặn Merge (CI Quality Gate)
- **Quyết định**: **[QUYẾT ĐỊNH] THIẾT LẬP QUALITY GATE 3 TẦNG BẮT BUỘC TRƯỚC KHI TÍCH HỢP TÍNH NĂNG MỚI.**
  1. **Tầng 1 (Local Pre-commit / Pre-push)**:
     - `npx tsc --noEmit` phải exit code 0.
     - `npm run test` (Vitest) cho các hàm utils và sanitization phải pass 100%.
  2. **Tầng 2 (GitHub Actions CI)**:
     - Tạo workflow `.github/workflows/ci.yml` tự động chạy mỗi khi có Pull Request:
       + Kiểm tra Type-check (`tsc`).
       + Kiểm tra Build production (`npm run build`).
       + Chạy bộ Unit Tests.
  3. **Tầng 3 (Manual QA Gate)**:
     - Không chuyển giao đoạn roadmap nếu còn bất kỳ lỗi P0 hoặc P1 nào chưa đóng.

---

## ADR-011: Định nghĩa Phạm vi Sản phẩm Khả dụng Tối thiểu (MVP Scope Definition)

### Danh mục BẮT BUỘC có trong MVP (Must-Have):
1. **Core Templates**: 3 mẫu CV hoàn chỉnh (Classic Teal, Warm Bold, Modern Minimal), responsive tốt trên mobile và desktop, không vỡ layout khi tên/nội dung dài.
2. **Editor hoàn chỉnh**: Đủ 9 khối dữ liệu (Personal, Summary, Exp, Edu, Skills, Projects, Achievements, Certificates, Theme).
3. **Draft Persistence**: Lưu và khôi phục nháp chuẩn xác theo từng ID CV trong localStorage; không mất dữ liệu khi F5.
4. **An toàn bảo mật**: Triệt tiêu 100% nguy cơ XSS qua URL; làm sạch input văn bản.
5. **Xem công khai & Chia sẻ**: Xem CV theo link `/cv/:id`, đổi theme động, copy link chia sẻ, xử lý trang 404 chuẩn mực.
6. **In ấn chuẩn A4**: Gọi `window.print()` với `@media print` xuất sắc, 1 trang A4 chuẩn.
7. **Auth cơ bản**: Đăng nhập/Đăng ký Google 1-click + Email/Password qua Firebase; phân quyền chỉ chủ CV mới được sửa.
8. **Dashboard tối giản**: Xem danh sách CV của tôi, nút tạo mới, nút xóa.
9. **Deploy Production**: Chạy ổn định trên Vercel với `vercel.json` hỗ trợ SPA routing.

### Danh mục CẮT GIẢM / ĐÓNG BĂNG cho giai đoạn sau MVP (Out-of-Scope for MVP):
- ❌ Kéo thả sắp xếp mục (Drag-and-Drop): Thay bằng nút mũi tên Lên/Xuống đơn giản nếu cần; không dùng thư viện kéo thả nặng nề.
- ❌ Undo / Redo: Đóng băng; người dùng tự sửa hoặc bấm nút "Khôi phục dữ liệu ban đầu".
- ❌ Xuất PDF qua canvas `html2pdf.js`: Cắt bỏ hoàn toàn, dùng native print.
- ❌ Tích hợp Backend server Express trên Render: Cắt bỏ, dùng Firebase serverless.
- ❌ Chức năng đa ngôn ngữ (i18n): Đóng băng, chỉ hỗ trợ tiếng Việt.
- ❌ Nhập CV tự động từ LinkedIn / PDF parse: Đóng băng.

---

## ADR-012: Kiến trúc Quản lý State Toàn cục bằng Zustand v5 & Migration Middleware
- **Ngữ cảnh**: Stage 1 dùng hook `useCVEditor` với React `useState` cục bộ và `localStorage` trực tiếp. Cần chuyển sang store toàn cục để chuẩn bị cho Auth và Dashboard mà không gây hồi quy dữ liệu hoặc vòng lặp render vô tận.
- **Quyết định**: **[QUYẾT ĐỊNH] CHUYỂN SANG ZUSTAND V5 VỚI PERSIST MIDDLEWARE, CƠ CHẾ USE-SHALLOW VÀ STRANGLER PATTERN.**
- **Nguyên tắc kỹ thuật**:
  1. Store `src/stores/useCVStore.ts` quản lý `cvData`, `saveStatus`, `activeSection`.
  2. Bắt buộc dùng `useShallow` khi lấy object/array slice để chặn triệt để vòng lặp re-render vô tận của Zustand v5.
  3. Middleware `persist` cấu hình `version: 2`, có hàm `migrate` tự động nâng cấp dữ liệu draft cũ (v1) từ `legacyDraftFixture.json` sang v2.
  4. Timer debounce auto-save (600ms) chuyển vào subscription của store, miễn nhiễm với React 18 StrictMode.
  5. Giữ `useCVEditor` làm wrapper facade tạm thời để bảo toàn 100% component và test suite hiện có.

---

## ADR-013: Tùy biến Chi tiết Màu sắc & Phông chữ theo từng phần qua CSS Custom Properties
- **Ngữ cảnh**: Người dùng cần tùy biến màu và font cho từng phần (Họ tên, Liên hệ, Tóm tắt, Kinh nghiệm, Học vấn, Kỹ năng, Dự án, Thành tựu, Chứng chỉ) mà không làm vỡ giao diện của 3 mẫu CV hiện tại.
- **Quyết định**: **[QUYẾT ĐỊNH] LƯU CẤU HÌNH THEO SECTION ID VÀ TRUYỀN QUA CSS CUSTOM PROPERTIES INLINE.**
- **Nguyên tắc kỹ thuật**:
  1. `ThemeConfig.sectionStyles: Record<SectionId, SectionStyleConfig>` độc lập với `templateId`, đảm bảo đổi mẫu CV không mất tùy biến.
  2. Cấm class Tailwind động (`text-[${color}]`); chỉ dùng biến CSS `--sec-heading-color`, `--sec-text-color`, `--sec-accent-color`, `--sec-heading-font`, `--sec-body-font` đặt trên thẻ wrapper của từng phần.
  3. Tích hợp thuật toán tính tỷ lệ tương phản WCAG 2.1 (ngưỡng 4.5:1 cho text thường, 3.0:1 cho heading) và hiển thị cảnh báo mềm trực quan.
  4. Xác thực đầu vào khắt khe: chỉ nhận hex chuẩn `#RRGGBB`, khử độc mã CSS injection (`url(`, `;`, `expression`), font chỉ chọn từ `fontRegistry`.
  5. Kéo chọn màu chỉ cập nhật state cục bộ; ghi store qua `startTransition` hoặc khi thả chuột để tránh re-render 60fps.

---

## ADR-014: Chiến lược Phông chữ Subsetting WOFF2 & Controlled Font Registry
- **Ngữ cảnh**: 39 file font `.otf` tĩnh (5.4 MB) làm chậm thời gian tải trang ban đầu và tiềm ẩn rủi ro bản quyền thương mại.
- **Quyết định**: **[QUYẾT ĐỊNH] CHUYỂN ĐỔI SANG GOOGLE FONTS WOFF2 SUBSETTING VỚI FONT REGISTRY TUYỂN CHỌN.**
- **Nguyên tắc kỹ thuật**:
  1. Khởi tạo `src/features/cv-editor/utils/fontRegistry.ts` gồm 7 font tiêu chuẩn đã kiểm chứng 100% glyph tiếng Việt: Montserrat, Be Vietnam Pro, Outfit, Inter, Playfair Display, Merriweather, Pacifico.
  2. Áp dụng dải `unicode-range` tiếng Việt và Latin, nén WOFF2.
  3. Chỉ tải font mặc định của template khi mở trang (Initial payload < 400 kB); các font khác trong registry được nạp động theo nhu cầu (on-demand) khi người dùng click chọn.
  4. Sử dụng `font-display: swap` và font fallback tương đồng kích thước để triệt tiêu hiện tượng FOUT/CLS.

---

## ADR-015: Code-Splitting Route & Cách ly Thư viện Nặng
- **Ngữ cảnh**: Entry chunk JS đang ở mức 1,045 kB do tải tĩnh toàn bộ 4 route, 3 template và `html2pdf.js`/`jspdf`.
- **Quyết định**: **[QUYẾT ĐỊNH] ÁP DỤNG REACT.LAZY THEO ROUTE VÀ DYNAMIC IMPORT CHO PDF SERVICE.**
- **Nguyên tắc kỹ thuật**:
  1. Phân tách tất cả các trang (`HomePage`, `CVViewPage`, `CVEditorPage`, `NotFoundPage`) bằng `React.lazy()` và bọc `<Suspense fallback={<PageSkeleton />}>`.
  2. Chuyển đổi `exportPdfService.ts` sang `await import('html2pdf.js')` khi người dùng bấm nút xuất PDF, tách toàn bộ ~600 kB ra khỏi chunk ban đầu.
  3. Cấu hình Rollup `manualChunks` cho `react-vendor` và `lucide-icons` để tối ưu bộ nhớ đệm trình duyệt (browser caching).
  4. Mục tiêu bắt buộc: Entry chunk JS ban đầu giảm xuống dưới 500 kB (kỳ vọng thực tế < 350 kB thô / < 100 kB gzip).

