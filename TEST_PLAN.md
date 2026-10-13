# KẾ HOẠCH KIỂM THỬ TỔNG THỂ (MASTER TEST PLAN)
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Senior QA Lead / Test Architect  
**Phiên bản**: 1.0  
**Ngày phê duyệt**: 13/10/2026  
**Trạng thái**: Hiệu lực  

---

## 1. PHẠM VI KIỂM THỬ (TEST SCOPE)

### 1.1. Trong phạm vi (In-Scope)
- **Giao diện & Trải nghiệm (UI/UX)**:
  - Trang Khám phá (`/`): Tìm kiếm, lọc danh mục, hiển thị profile cards, empty states.
  - Trang Xem CV cá nhân (`/cv/:id`, `/u/:id`): Render 3 mẫu template chuẩn, đổi bảng màu, đổi font, đổi chế độ nền giấy.
  - Trang Biên tập CV (`/editor/:id`, `/editor`): Accordion form, thêm/xóa mục con, live preview đồng bộ real-time, auto-save debounce.
  - Xử lý điều hướng lỗi (`/404`, fallback cho ID không tồn tại).
- **Tính toàn vẹn dữ liệu (Data Integrity)**:
  - Xác thực schema đủ 9 khối dữ liệu chuẩn.
  - Lưu trữ và phân lập bản nháp (Draft isolation theo ID trong `localStorage`).
- **An toàn bảo mật (Security & Sanitization)**:
  - Chặn Stored XSS qua các trường URL (Website, LinkedIn, GitHub).
  - Khử mã HTML độc hại trong các trường văn bản tự do (Summary, Job Description).
- **Khả năng tiếp cận & Tương thích (A11y & Responsive)**:
  - Đáp ứng chuẩn WCAG 2.1 AA (Tỷ lệ tương phản màu, điều hướng bằng bàn phím).
  - Độ tương thích màn hình từ 320px đến 1920px.

### 1.2. Ngoài phạm vi / Tạm hoãn (Out-of-Scope / Deferred)
- **Tính năng Xuất PDF (`html2pdf.js`)**: *Tạm hoãn theo chỉ đạo trực tiếp của người dùng. Sẽ được thiết kế lại theo giải pháp `@media print` ở giai đoạn sau.*
- **Backend API & Database Persistence thật**: *Chưa có mã nguồn thực tế; kiểm thử tích hợp backend sẽ được kích hoạt khi triển khai Phase 4.*
- **Tải ảnh thật lên Cloud Storage (Firebase/Cloudinary)**: *Chưa có module storage.*

---

## 2. CHIẾN LƯỢC KIỂM THỬ (TEST STRATEGY)

Áp dụng mô hình **Kim Tự Tháp Kiểm Thử (Testing Pyramid)** chuẩn ngành:

1. **Unit Testing (Vitest)**:
   - Kiểm thử các hàm tiện ích (`utils/`): `formatSafeUrl`, `generateId`, `formatDate`, `getCVByIdOrSlug`.
   - Kiểm thử hook logic `useCVEditor`: Thêm, sửa, xóa mảng con, auto-save debounce timer, tính toán id.
2. **Component Integration Testing (React Testing Library)**:
   - Render độc lập từng Template với các bộ dữ liệu dị biệt (Dữ liệu rỗng, chuỗi ký tự siêu dài, dữ liệu có ký tự đặc biệt).
   - Kiểm thử tương tác đóng/mở Accordion, click nút Thêm/Xóa kinh nghiệm, học vấn, kỹ năng.
3. **End-to-End Testing (Playwright)**:
   - Tự động hóa các luồng người dùng chính: Tìm kiếm ứng viên trên Trang chủ $\rightarrow$ Mở CV xem công khai $\rightarrow$ Chuyển sang chỉnh sửa $\rightarrow$ Đổi thông tin $\rightarrow$ F5 kiểm tra lưu nháp.
4. **Visual Regression Testing**:
   - Chụp snapshot so sánh pixel của 3 template khi thay đổi phông chữ và bảng màu accent.
5. **Accessibility Testing (axe-core & Lighthouse)**:
   - Tự động quét kiểm tra nhãn ARIA, tỷ lệ tương phản màu, cấu trúc tiêu đề (`h1` $\rightarrow$ `h2` $\rightarrow$ `h3`).
6. **Security Scanning**:
   - Thử nghiệm payload XSS tự động (`javascript:`, `<script>`, `onerror=`).

---

## 3. MA TRẬN MÔI TRƯỜNG KIỂM THỬ (ENVIRONMENT MATRIX)

| Nền tảng | Trình duyệt | Độ phân giải kiểm tra | Mục tiêu kiểm tra |
|:---|:---|:---|:---|
| **Desktop Windows** | Google Chrome (Latest) | 1920x1080, 1536x864, 1366x768 | Môi trường chính của người dùng |
| **Desktop Windows** | Microsoft Edge (Chromium) | 1920x1080 | Tính tương thích Chromium enterprise |
| **Desktop Windows** | Mozilla Firefox (Latest) | 1920x1080 | Kiểm tra khả năng render font OTF/WOFF2 |
| **macOS / iOS** | Apple Safari (WebKit) | 1440x900, 390x844 (iPhone 14) | Kiểm tra thuộc tính in ấn `-webkit-print-color-adjust` |
| **Mobile Android** | Chrome Mobile | 375x812, 360x800, 320x568 | Kiểm tra bố cục màn hình hẹp, thanh tab chuyển đổi Editor / Preview |

---

## 4. PHÂN TÍCH RỦI RO (RISK ANALYSIS)

| Tính năng / Khu vực | Xác suất lỗi | Mức ảnh hưởng | Điểm rủi ro | Mức ưu tiên | Biện pháp giảm thiểu |
|:---|:---:|:---:|:---:|:---:|:---|
| **Nhập liên kết ngoài (XSS)** | Cao | Nghiêm trọng | **R-01 (P0)** | Khẩn cấp | Validate và sanitize protocol URL tại tầng input và render |
| **Lưu trữ Draft cục bộ** | Cao | Cao | **R-02 (P0)** | Khẩn cấp | Phân vùng key `localStorage` theo ID hồ sơ |
| **Dữ liệu biên text quá dài** | Trung bình | Trung bình | **R-03 (P1)** | Cao | Áp dụng class CSS `break-words` trên tất cả tiêu đề và link |
| **Truy cập sai ID hồ sơ (404)** | Cao | Trung bình | **R-04 (P1)** | Cao | Chặn fallback ngầm, render component NotFoundPage |
| **Thiếu khối dữ liệu trong Editor** | Chắc chắn | Cao | **R-05 (P1)** | Cao | Bổ sung component cho Thành tựu và Chứng chỉ |
| **Tràn layout trên mobile hẹp (320px)**| Trung bình | Trung bình | **R-06 (P2)** | Trung bình | Tinh chỉnh padding và cơ chế zoom responsive |

---

## 5. BẢNG TEST CASES CHI TIẾT (40 TEST CASES ƯU TIÊN CAO)

### Nhóm 1: Trang Khám Phá & Danh Mục Hồ Sơ (`/`)
- **TC-EXP-01** | Tìm kiếm theo họ tên chính xác | Đang ở `/` | Nhập "Trần Anh Khôi" vào ô tìm kiếm | Chỉ 1 thẻ hồ sơ Trần Anh Khôi hiển thị | P1 | Tự động
- **TC-EXP-02** | Tìm kiếm không phân biệt hoa thường | Đang ở `/` | Nhập "trần anh khôi" | Hiển thị kết quả tương đương chữ hoa | P1 | Tự động
- **TC-EXP-03** | Tìm kiếm theo kỹ năng | Đang ở `/` | Nhập "React" | Hiển thị các hồ sơ có tag kỹ năng chứa React | P1 | Tự động
- **TC-EXP-04** | Lọc theo danh mục Lập trình (Tech) | Đang ở `/` | Click nút "Công nghệ & Lập trình" | Chỉ hiển thị các hồ sơ thuộc ngành IT | P1 | Tự động
- **TC-EXP-05** | Lọc theo danh mục Thiết kế (Design) | Đang ở `/` | Click nút "Thiết kế & Sáng tạo" | Chỉ hiển thị các hồ sơ Design | P1 | Tự động
- **TC-EXP-06** | Tìm kiếm không có kết quả | Đang ở `/` | Nhập từ khóa vô nghĩa "xyz12345" | Hiển thị Empty State kèm nút "Đặt lại bộ lọc" | P1 | Thủ công
- **TC-EXP-07** | Đặt lại bộ lọc từ Empty State | Đang ở trạng thái Empty State | Click nút "Đặt lại bộ lọc" | Reset input tìm kiếm, hiển thị lại 6 hồ sơ ban đầu | P2 | Thủ công
- **TC-EXP-08** | Chuyển trang từ thẻ Profile sang CV | Đang ở `/` | Click nút "Xem CV" trên thẻ số 1 | Điều hướng thành công đến `/cv/cv-thanhtruc-01` | P1 | Tự động

### Nhóm 2: Trang Xem CV Công Khai (`/cv/:id`)
- **TC-VIEW-01** | Render đúng hồ sơ theo ID hợp lệ | Đang ở `/cv/cv-thanhtruc-01` | Quan sát nội dung trang | Hiển thị đúng họ tên Trần Anh Khôi | P1 | Tự động
- **TC-VIEW-02** | Truy cập ID không tồn tại | Nhập `/cv/khong-ton-tai-999` | Kiểm tra giao diện hiển thị | Hiển thị trang 404 (Không được fallback về người khác) | P0 | Tự động
- **TC-VIEW-03** | Đổi mẫu CV trực tiếp trên thanh công cụ | Đang ở `/cv/cv-thanhtruc-01` | Click tab "Mẫu 2: Warm Bold" | Layout CV lập tức chuyển sang giao diện Warm Bold | P1 | Tự động
- **TC-VIEW-04** | Đổi màu chủ đạo Accent | Đang ở `/cv/cv-thanhtruc-01` | Click nút màu Cam Tangerine | Toàn bộ các điểm nhấn màu đổi sang Cam | P1 | Thủ công
- **TC-VIEW-05** | Đổi phông chữ tiêu đề | Đang ở `/cv/cv-thanhtruc-01` | Chọn phông "SVN-Optima" từ dropdown | Tiêu đề và họ tên đổi sang phông có chân Optima | P2 | Thủ công
- **TC-VIEW-06** | Nút Sao chép liên kết chia sẻ | Đang ở `/cv/cv-thanhtruc-01` | Click nút "Chia sẻ" | URL được copy vào clipboard, hiện thông báo "Đã sao chép link!" | P1 | Thủ công
- **TC-VIEW-07** | Phóng to / Thu nhỏ bản xem CV | Đang ở `/cv/cv-thanhtruc-01` | Click nút (+) và (-) zoom | Khổ giấy A4 co giãn tương ứng tỷ lệ % | P2 | Thủ công
- **TC-VIEW-08** | Chuyển tiếp sang trang Chỉnh sửa | Đang ở `/cv/cv-thanhtruc-01` | Click nút "Chỉnh Sửa CV" | Chuyển sang `/editor/cv-thanhtruc-01` | P1 | Tự động

### Nhóm 3: Trình Biên Tập CV (`/editor/:id`)
- **TC-EDT-01** | Cập nhật Họ và Tên | Đang ở Editor | Nhập tên mới vào ô Họ và Tên | Tiêu đề trên bản xem trước bên phải cập nhật tức thì | P0 | Tự động
- **TC-EDT-02** | Cập nhật Chức danh nghề nghiệp | Đang ở Editor | Nhập chức danh mới | Bản xem trước cập nhật đúng vị trí dưới họ tên | P1 | Tự động
- **TC-EDT-03** | Thêm mới một mục Kinh nghiệm | Mở Accordion Kinh nghiệm | Click nút "Thêm kinh nghiệm" | Một thẻ kinh nghiệm mới xuất hiện trên form và trên preview | P0 | Tự động
- **TC-EDT-04** | Xóa một mục Kinh nghiệm | Có ít nhất 1 mục kinh nghiệm | Click biểu tượng thùng rác | Mục đó biến mất khỏi form và preview | P0 | Tự động
- **TC-EDT-05** | Thêm gạch đầu dòng mô tả công việc | Trong thẻ kinh nghiệm | Click "Thêm mô tả" | Thêm 1 ô input mô tả mới | P1 | Thủ công
- **TC-EDT-06** | Thêm mới mục Học vấn | Mở Accordion Học vấn | Click "Thêm học vấn" | Thẻ học vấn mới được bổ sung | P1 | Tự động
- **TC-EDT-07** | Xóa mục Học vấn | Có mục học vấn | Click biểu tượng thùng rác | Mục học vấn bị xóa | P1 | Tự động
- **TC-EDT-08** | Thêm nhóm Kỹ năng mới | Mở Accordion Kỹ năng | Click "Thêm nhóm kỹ năng" | Nhóm kỹ năng mới được thêm | P1 | Tự động
- **TC-EDT-09** | Thêm kỹ năng đơn lẻ vào nhóm | Có 1 nhóm kỹ năng | Nhập tên kỹ năng và nhấn Thêm | Kỹ năng xuất hiện dưới dạng tag | P1 | Tự động
- **TC-EDT-10** | Xóa kỹ năng đơn lẻ | Có kỹ năng trong nhóm | Click dấu (x) trên tag kỹ năng | Kỹ năng bị xóa khỏi nhóm | P1 | Tự động
- **TC-EDT-11** | Thêm Dự án tiêu biểu | Mở Accordion Dự án | Click "Thêm dự án" | Thẻ dự án mới được tạo | P1 | Tự động
- **TC-EDT-12** | Cập nhật Link demo dự án | Trong thẻ dự án | Nhập link GitHub | Link gắn đúng vào icon ExternalLink trên preview | P1 | Thủ công
- **TC-EDT-13** | Đổi chế độ Nền giấy (Trắng / Tối) | Mở Accordion Tùy biến | Chọn "Nền Tối (Dark Paper)" | Tờ giấy CV chuyển sang nền dark slate với chữ trắng/bạc | P0 | Tự động
- **TC-EDT-14** | Tự động lưu sau 600ms (Debounce) | Gõ liên tục vào ô Tóm tắt | Quan sát trạng thái lưu trên thanh header | Trạng thái chuyển: "Đang lưu..." $\rightarrow$ "Đã lưu tự động" | P0 | Tự động
- **TC-EDT-15** | Khôi phục bản mẫu gốc | Đã sửa đổi nhiều trường | Click nút "Khôi phục" (Reset) | Hộp thoại xác nhận hiện ra; nhấn OK reset về dữ liệu ban đầu | P1 | Thủ công

### Nhóm 4: Bảo Mật, Dữ Liệu Biên & An Toàn Hệ Thống
- **TC-SEC-01** | Chặn mã độc JavaScript trong URL Website | Nhập `javascript:alert(1)` vào ô Website | Click link trên bản xem trước | Không được bật alert; href phải là `#` hoặc bị vô hiệu | P0 | Tự động
- **TC-SEC-02** | Chặn mã độc XSS trong ô Tóm tắt | Nhập `<img src=x onerror=alert(2)>` vào Tóm tắt | Quan sát render trên preview | Chữ được escape hiển thị dạng văn bản thô, không kích hoạt alert | P0 | Tự động
- **TC-SEC-03** | Nhập Họ Tên 100 ký tự không khoảng trắng | Nhập 100 chữ "W" liên tục | Quan sát khung A4 preview | Văn bản tự ngắt dòng mềm bằng `break-words`, không vỡ layout | P1 | Thủ công
- **TC-SEC-04** | Nhập tiếng Việt đầy đủ dấu thanh tổ hợp | Nhập "Trần Thị Thuỳ Trúc, Trường Đại Học Khoa Học Tự Nhiên" | Kiểm tra phông hiển thị | Không bị nhảy phông (font glitch), dấu tiếng Việt cân đối | P1 | Thủ công
- **TC-SEC-05** | Nhập ngày bắt đầu sau ngày kết thúc | Nhập startDate "2024", endDate "2020" | Kiểm tra hiển thị | Hiển thị cảnh báo hoặc tự động sắp xếp hợp lý | P2 | Thủ công
- **TC-SEC-06** | Nhập URL ảnh avatar hỏng (404) | Nhập URL không tồn tại | Quan sát ảnh đại diện | Hiển thị ảnh placeholder mặc định thay vì icon vỡ hình | P2 | Thủ công

### Nhóm 5: Tính Toàn Vẹn Lưu Trữ (Draft Persistence)
- **TC-PER-01** | Cô lập Draft giữa các hồ sơ khác nhau | Sửa tên ở `/editor/cv-01` $\rightarrow$ Mở `/editor/cv-02` | Kiểm tra nội dung ở cv-02 | Dữ liệu soạn dở của cv-01 không được rò rỉ sang cv-02 | P0 | Tự động
- **TC-PER-02** | Khôi phục Draft sau khi tải lại trang (F5) | Sửa tên ở `/editor/cv-01`, chờ lưu $\rightarrow$ Nhấn F5 | Kiểm tra ô Họ và Tên | Giữ nguyên dữ liệu vừa soạn dở | P0 | Tự động

### Nhóm 6: Responsive & Thiết Bị Di Động
- **TC-RSP-01** | Chuyển tab Editor / Live Preview trên mobile | Thu nhỏ màn hình < 768px tại Editor | Click tab "Bản Xem Trước" | Khung xem trước A4 trượt ra toàn màn hình mượt mà | P1 | Thủ công

---

## 6. TIÊU CHÍ VÀO / RA & ĐỊNH NGHĨA HOÀN THÀNH (DEFINITION OF DONE)

### 6.1. Tiêu chí hoàn thành cho một tính năng (DoD - Definition of Done)
1. **Mã nguồn sạch**: 100% Type-Safe (`tsc --noEmit` không có lỗi, không sử dụng `any` tùy tiện).
2. **Không có lỗi hồi quy**: Các tính năng đã hoạt động trước đó tiếp tục chạy đúng.
3. **Bảo mật cơ bản**: Toàn bộ input từ người dùng được làm sạch (Sanitized), không có nguy cơ XSS.
4. **Responsive chuẩn**: Kiểm tra giao diện hiển thị không vỡ trên cả 3 mốc: Mobile (375px), Tablet (768px), Desktop (1440px).
5. **Accessibility**: Các phần tử tương tác có trạng thái focus rõ ràng, nút bấm có nhãn nhận diện.
6. **Bằng chứng kiểm thử**: Đã được chạy và xác nhận trực tiếp qua Browser Subagent.

---

## 7. TOP 10 TEST CASES TỰ ĐỘNG CẦN VIẾT ĐẦU TIÊN (AUTOMATION SUITE)

1. **`test_sanitize_urls`**: Kiểm tra các hàm format URL loại bỏ hoàn toàn protocol `javascript:` và `data:`.
2. **`test_draft_isolation_per_cv_id`**: Kiểm tra cơ chế ghi và đọc draft trong `localStorage` phân lập theo từng `id`.
3. **`test_not_found_routing_unknown_id`**: Đảm bảo truy cập `/cv/unknown` render đúng trang 404 thay vì hồ sơ số 1.
4. **`test_template_render_all_three`**: Render độc lập Template 1, 2, 3 với dữ liệu chuẩn, đảm bảo không quăng runtime exception.
5. **`test_editor_add_remove_experience`**: Kiểm tra logic thêm và xóa mục kinh nghiệm trong hook `useCVEditor`.
6. **`test_editor_add_remove_skills`**: Kiểm tra thêm và xóa kỹ năng con trong từng nhóm kỹ năng.
7. **`test_auto_save_debounce_timing`**: Kiểm tra trạng thái chuyển đổi giữa `unsaved` $\rightarrow$ `saving` $\rightarrow$ `saved` sau đúng chu kỳ debounce.
8. **`test_search_filter_logic_homepage`**: Kiểm tra logic lọc theo từ khóa và theo từng danh mục ngành nghề.
9. **`test_heading_font_and_color_tokens`**: Kiểm tra việc áp dụng token màu và phông chữ vào DOM cây template.
10. **`test_long_text_no_whitespace_wrap`**: Đảm bảo chuỗi văn bản dài không gây vỡ cấu trúc khối A4.
