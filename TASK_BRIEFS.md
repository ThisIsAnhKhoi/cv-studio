# HƯỚNG DẪN CÔNG VIỆC CHO TRỢ LÝ LẬP TRÌNH (TASK BRIEFS 1 - 5)
**Dự án**: CV Studio / MyPortfolio  
**Ban hành bởi**: Tech Lead / Solution Architect  
**Quy tắc chung**: Mỗi phiên làm việc phải tuân thủ nghiêm ngặt phạm vi được giao, chạy test kiểm chứng trước khi commit và cập nhật dev-log theo `.agents/rules/session-protocol.md`.

---

## TASK BRIEF 1: VÁ LỖ HỔNG XSS VÀ TÁI CẤU TRÚC LƯU TRỮ DRAFT
- **Mục tiêu**: Loại bỏ triệt để nguy cơ Stored XSS khi nhập liên kết cá nhân (BUG-001) và sửa lỗi kiến trúc ghi đè/mất dữ liệu nháp khi F5 trong trình biên tập (BUG-002).
- **Độ ưu tiên**: **P0 (Khẩn cấp - Làm ngay trong phiên tới)** | **Cỡ việc**: **M**
- **Các tệp liên quan**:
  - `frontend/src/utils/url.ts` *(Tạo mới hàm sanitize URL)*
  - `frontend/src/features/cv-templates/template-1/CVTemplateClassicTeal.tsx`
  - `frontend/src/features/cv-templates/template-2/CVTemplateWarmBold.tsx`
  - `frontend/src/features/cv-templates/template-3/CVTemplateModernMinimal.tsx`
  - `frontend/src/features/cv-editor/hooks/useCVEditor.ts`
- **Tiêu chí chấp nhận (Acceptance Criteria)**:
  1. Tạo hàm tiện ích `formatSafeUrl(url?: string): string`:
     - Nếu chuỗi rỗng hoặc `undefined` $\rightarrow$ trả về `''`.
     - Chặn đứng các chuỗi bắt đầu bằng `javascript:`, `data:`, `vbscript:` $\rightarrow$ trả về `'#'` hoặc vô hiệu hóa liên kết.
     - Nếu URL không có giao thức (ví dụ: `thanhtruc.dev`) $\rightarrow$ tự động thêm tiền tố `https://`.
  2. Toàn bộ các thẻ `<a>` trong cả 3 mẫu CV phải bọc qua hàm `formatSafeUrl` trước khi render vào `href`.
  3. Bổ sung class CSS `break-words` vào thẻ `h1` hiển thị Họ Tên trong 3 template để chống vỡ khung khi tên dài.
  4. Trong `useCVEditor.ts`:
     - Sửa key lưu trữ thành `cv_studio_draft_${cvData.id}` thay vì 1 key cố định.
     - Sửa logic khởi tạo state: Nếu tồn tại bản draft trong `localStorage` cho đúng ID này và có thời gian chỉnh sửa mới hơn `initialData` $\rightarrow$ nạp bản draft thay vì ghi đè bằng mock data.
     - Khi người dùng F5 tại `/editor/:id`, nội dung vừa gõ phải giữ nguyên 100%.
- **Test phải có (Kiểm tra thủ công & Browser)**:
  - Tham chiếu: `TC-SEC-01`, `TC-SEC-03`, `TC-PER-01`, `TC-PER-02` trong `TEST_PLAN.md`.
  - Nhập `javascript:alert(1)` vào ô Website $\rightarrow$ Click vào link không được kích hoạt alert.
  - Sửa tên thành "Nguyễn Văn Đang Soạn", chờ 1 giây rồi F5 $\rightarrow$ Tên vẫn là "Nguyễn Văn Đang Soạn".
- **Điều KHÔNG được làm**:
  - Không thay đổi cấu trúc props của các Template.
  - Không cài đặt thêm thư viện sanitize nặng bên ngoài (viết hàm regex/url chuẩn bằng TypeScript thuần).
- **Cách báo cáo kết quả**: Cập nhật mục "Nhật ký sửa lỗi" trong `PROJECT_STATUS.md`, đóng BUG-001, BUG-002, BUG-006.

---

## TASK BRIEF 2: SỬA LỖI ĐIỀU HƯỚNG 404 VÀ BỔ SUNG 2 KHỐI DỮ LIỆU CÒN THIẾU
- **Mục tiêu**: Xử lý triệt để lỗi fallback sai khi truy cập ID CV không tồn tại (BUG-003) và bổ sung 2 nhóm form Thành Tựu & Chứng Chỉ vào Editor (BUG-004) để hoàn thiện đủ 9 khối dữ liệu chuẩn.
- **Độ ưu tiên**: **P1** | **Cỡ việc**: **M**
- **Các tệp liên quan**:
  - `frontend/src/pages/CVViewPage.tsx`
  - `frontend/src/pages/CVEditorPage.tsx`
  - `frontend/src/features/cv-editor/components/sections/AchievementsSection.tsx` *(Tạo mới)*
  - `frontend/src/features/cv-editor/components/sections/CertificatesSection.tsx` *(Tạo mới)*
  - `frontend/src/features/cv-editor/hooks/useCVEditor.ts`
- **Tiêu chí chấp nhận (Acceptance Criteria)**:
  1. Trong `CVViewPage.tsx`: Nếu `id` được truyền trên URL nhưng `getCVByIdOrSlug(id)` trả về `undefined` $\rightarrow$ Render `<NotFoundPage />` thay vì âm thầm hiển thị hồ sơ số 1.
  2. Trong `CVEditorPage.tsx`: Bổ sung 2 Accordion mới:
     - "Thành Tựu & Giải Thưởng" (`achievements`).
     - "Chứng Chỉ Chuyên Ngành" (`certificates`).
  3. Tạo 2 component section tương ứng:
     - `AchievementsSection.tsx`: Cho phép sửa `title`, `issuer`, `year`, `description`; có nút Thêm/Xóa mục.
     - `CertificatesSection.tsx`: Cho phép sửa `name`, `issuer`, `issueDate`, `credentialUrl`; có nút Thêm/Xóa mục.
  4. Bổ sung các updater tương ứng vào `useCVEditor.ts`: `addAchievement`, `updateAchievement`, `removeAchievement`, `addCertificate`, `updateCertificate`, `removeCertificate`.
  5. Đảm bảo dữ liệu từ 2 khối này cập nhật mượt mà sang bản xem trước Live Preview của cả 3 template.
- **Test phải có**:
  - Tham chiếu: `TC-VIEW-02`, `TC-EDT-01` đến `TC-EDT-12` trong `TEST_PLAN.md`.
  - Mở `/cv/id-ao-12345` $\rightarrow$ Thấy giao diện 404 báo không tìm thấy hồ sơ.
  - Mở Editor, click thêm Thành Tựu mới $\rightarrow$ Bản xem trước hiển thị mục thành tựu vừa nhập.
- **Điều KHÔNG được làm**:
  - Không phá vỡ cấu trúc của các accordion hiện có.
- **Cách báo cáo kết quả**: Cập nhật `PROJECT_STATUS.md`, đóng BUG-003 và BUG-004.

---

## TASK BRIEF 3: THIẾT LẬP CẤU HÌNH DEPLOY VERCEL VÀ KHUNG TEST TỰ ĐỘNG VITEST
- **Mục tiêu**: Chuẩn bị tệp cấu hình triển khai SPA trên Vercel (BUG-007) và thiết lập môi trường Unit Test với Vitest để tự động hóa 10 test case cốt lõi.
- **Độ ưu tiên**: **P1** | **Cỡ việc**: **M**
- **Các tệp liên quan**:
  - `vercel.json` *(Tạo mới tại thư mục gốc)*
  - `frontend/package.json` *(Cài đặt vitest, @testing-library/react)*
  - `frontend/vite.config.ts`
  - `frontend/src/utils/__tests__/url.test.ts` *(Tạo mới)*
  - `frontend/src/features/cv-editor/hooks/__tests__/useCVEditor.test.ts` *(Tạo mới)*
- **Tiêu chí chấp nhận (Acceptance Criteria)**:
  1. Tạo `vercel.json` ở thư mục gốc với nội dung rewrite toàn bộ request về `/index.html`:
     ```json
     {
       "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
     }
     ```
  2. Cài đặt các devDependency: `vitest`, `@testing-library/react`, `jsdom`.
  3. Cấu hình script `"test": "vitest run"` trong `frontend/package.json`.
  4. Viết đủ 10 unit test tự động (theo Mục 7 của `TEST_PLAN.md`):
     - Test sanitize URLs (loại bỏ `javascript:`, `data:`).
     - Test cơ chế cô lập draft theo `id` của `useCVEditor`.
     - Test thêm/xóa mục kinh nghiệm và kỹ năng trong hook.
     - Test hàm tìm kiếm profile theo từ khóa.
  5. Chạy `npm run test` vượt qua 100% không có lỗi.
- **Test phải có**: `npm run test` pass 10/10 tests; `npm run build` thành công.
- **Điều KHÔNG được làm**:
  - Không cài đặt các thư viện test quá nặng làm chậm quá trình build.
- **Cách báo cáo kết quả**: Cập nhật `PROJECT_STATUS.md`, đóng BUG-007.

---

## TASK BRIEF 4: TỐI ƯU HÓA PHÔNG CHỮ VÀ PHÂN MẢNH BUNDLE CODE-SPLITTING
- **Mục tiêu**: Giảm dung lượng tải font tĩnh từ 5.4 MB xuống dưới 400 kB và phân mảnh bundle chính bằng `React.lazy()` để tăng tốc độ tải trang.
- **Độ ưu tiên**: **P2** | **Cỡ việc**: **M**
- **Các tệp liên quan**:
  - `frontend/public/fonts/`
  - `frontend/src/styles/index.css`
  - `frontend/src/App.tsx`
- **Tiêu chí chấp nhận (Acceptance Criteria)**:
  1. Tối ưu phông chữ:
     - Thay thế nạp font cục bộ nặng nề bằng Google Fonts chính thống cho các phông chữ chuẩn: `Outfit`, `Montserrat`, `Be Vietnam Pro`.
     - Với các phông chữ đặc thù (`iCiel Cubano`, `SVN-Optima`): Chuyển đổi sang định dạng nén `.woff2` và chỉ giữ lại các ký tự tiếng Việt cần thiết (subsetting).
     - Xóa các file `.otf` thừa không dùng trong `public/fonts/`.
  2. Code-Splitting trong `App.tsx`:
     - Sử dụng `React.lazy()` và `<Suspense fallback={<LoadingSpinner />}>` cho các trang: `HomePage`, `CVViewPage`, `CVEditorPage`, `NotFoundPage`.
  3. Chạy `npm run build`:
     - Thư mục dist font giảm mạnh.
     - Chunk JS chính không còn bị cảnh báo vượt 500 kB.
- **Test phải có**:
  - Kiểm tra giao diện tiếng Việt trên cả 3 template không bị nhảy phông (font glitch).
  - Tải lại trang mượt mà trên môi trường `npm run preview`.
- **Cách báo cáo kết quả**: Cập nhật chỉ số dung lượng bundle vào `PROJECT_STATUS.md`.

---

## TASK BRIEF 5: THIẾT KẾ VÀ TÍCH HỢP ZUSTAND STORE TOÀN CỤC
- **Mục tiêu**: Thay thế `useState` trong `useCVEditor` bằng Zustand Store (`useCVStore`) để quản lý state toàn cục chuẩn bị cho việc tích hợp Auth và Dashboard.
- **Độ ưu tiên**: **P2** | **Cỡ việc**: **L**
- **Các tệp liên quan**:
  - `frontend/package.json` *(Cài đặt zustand)*
  - `frontend/src/stores/cvStore.ts` *(Tạo mới)*
  - `frontend/src/stores/themeStore.ts` *(Tạo mới)*
  - `frontend/src/features/cv-editor/hooks/useCVEditor.ts` *(Refactor trỏ vào store)*
- **Tiêu chí chấp nhận (Acceptance Criteria)**:
  1. Cài đặt `zustand`.
  2. Tạo `cvStore.ts` triển khai đầy đủ các action thêm/sửa/xóa của 9 khối dữ liệu, tích hợp middleware `persist` cho localStorage có namespace `id`.
  3. Tạo `themeStore.ts` quản lý trạng thái Dark/Light mode toàn app và màu sắc CV.
  4. Đảm bảo toàn bộ các component con trong `CVEditorPage` tiếp tục hoạt động trơn tru mà không cần sửa giao diện.
  5. Chạy lại bộ unit test Vitest đã tạo ở Task Brief 3 để đảm bảo không phát sinh lỗi hồi quy.
- **Test phải có**: `npm run test` pass 100%; thao tác chỉnh sửa CV trên trình duyệt hoạt động mượt mà.
- **Cách báo cáo kết quả**: Cập nhật kiến trúc hoàn thành Tầng 3 vào `PROJECT_STATUS.md`.
