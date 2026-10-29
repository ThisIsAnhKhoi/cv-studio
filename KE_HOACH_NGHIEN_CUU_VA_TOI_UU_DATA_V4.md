# KẾ HOẠCH NGHIÊN CỨU & TRIỂN KHAI TOÀN DIỆN DỮ LIỆU HỆ THỐNG (V4)

> **Mục tiêu**: Làm sạch toàn bộ dữ liệu hệ thống, xóa bỏ hoàn toàn các vết tích dữ liệu test / "thanhtruc", chuẩn hóa bản CV trắng ("chưa data") khi người dùng tạo mới, hoàn thiện bộ 8 mẫu CV chuyên nghiệp đa ngành nghề (giữ lại và chuẩn hóa Trần Anh Khôi), và tích hợp hệ thống kiểm duyệt điều kiện bắt buộc (Quality Validation Checklist) khi người dùng chia sẻ mẫu CV lên cộng đồng.

---

## 1. Phân Tích Hiện Trạng & Đánh Giá Tác Động (Độ Nắm Bắt: 98%)

Qua khảo sát toàn bộ codebase (23 test suites, 149 unit/integration tests, các module store, services, router và components), chúng tôi xác định các vấn đề hiện hữu:

| Hạng mục | Hiện trạng | Vấn đề phát sinh | Giải pháp chuẩn hóa |
| :--- | :--- | :--- | :--- |
| **Dữ liệu khởi tạo khi tạo mới CV** | `createNewCV()` copy nguyên xi dữ liệu mẫu `mockProfilesList` hoặc `mockCVData` | Người dùng tạo mới CV bị điền sẵn tên, email, số điện thoại, kinh nghiệm của người khác, gây bất tiện khi phải đi xóa từng dòng | Tách biệt hoàn toàn: Tạo mới CV sẽ trả về **"Bản chưa data" (Clean Blank CV)** với form trắng tinh, chỉ giữ khung Layout & Theme để người dùng tự nhập |
| **Dữ liệu test "thanhtruc"** | Rải rác trong `mockCVData.ts`, `mockProfiles.ts`, `Footer.tsx`, `HeroSection.tsx`, `TemplatesShowcaseSection.tsx`, test suites | Nhầm lẫn giữa CV Trần Anh Khôi và Thanh Trúc (slug `thanh-truc`, website `thanhtruc.dev`, github `github.com/thanhtruc`) | Loại bỏ 100% "thanhtruc". Giữ lại **Trần Anh Khôi** (IT & Giảng viên) làm mẫu chuẩn số 1; thay thế Profile 2 bằng **Nguyễn Minh Châu** (Lead Product Designer & UX Strategist) |
| **Thư viện mẫu CV chuyên nghiệp** | 8 hồ sơ mẫu trong `mockProfilesList` nhưng một số hồ sơ còn thông tin trùng lặp hoặc chưa phân bố đều bảng màu/ngành nghề | Thiếu tính đặc trưng thị giác và điểm nhấn nghề nghiệp riêng biệt cho từng lĩnh vực | Tối ưu hóa 8 mẫu tương ứng 8 ngành nghề tiêu biểu: khác biệt về **Màu sắc, Font chữ, Bố cục Layout (layoutConfig), Tùy biến mục, và Số liệu thành tích định lượng** |
| **Đăng mẫu CV lên cộng đồng** | `PublishTemplateModal` chỉ kiểm tra tiêu đề mẫu bằng HTML `required`, không kiểm tra nội dung CV | Người dùng có thể đăng tải CV trống rỗng, thiếu thông tin liên hệ hoặc chưa có kinh nghiệm lên cộng đồng | Bổ sung **Bộ tiêu chuẩn chất lượng (Quality Validation Rules)**: Bắt buộc điền đủ Họ tên, Chức danh, Email, SĐT, Tóm tắt (>= 30 ký tự), Kinh nghiệm/Học vấn, Kỹ năng trước khi được đăng |

---

## 2. Thiết Kế Kiến Trúc & Luồng Dữ Liệu Chi Tiết

### A. Phân tách rạch ròi: "Tạo CV Mới" (Form Trắng) vs "Dùng Thử Mẫu" (Nhân Bản Dữ Liệu Mẫu)

- **Nhấn "Tạo CV Mới" (`createNewCV`)**: Trả về bản CV trắng hoàn toàn.
  - Thông tin cá nhân: các trường họ tên, email, sđt, vị trí, mạng xã hội để trống `""`.
  - Giới thiệu bản thân: `""`.
  - Danh sách kinh nghiệm: `[]`.
  - Danh sách học vấn: `[]`.
  - Danh sách kỹ năng: `[{ id: 'skill-cat-1', categoryName: 'Kỹ Năng Chuyên Môn', skills: [] }]`.
  - Giữ lại `themeConfig` (màu sắc, phông chữ, mẫu template 1/2/3 và cấu trúc 2 cột linh hoạt).
- **Nhấn "Dùng Thử Mẫu Này" (`cloneCV`)**: Dành riêng cho người dùng muốn tham khảo mẫu hoàn chỉnh, nhân bản đầy đủ nội dung chuyên nghiệp để tham khảo cấu trúc.

---

### B. Danh Sách 8 Mẫu CV Chuyên Nghiệp Đa Ngành Nghề

1. **Mẫu 1: Trần Anh Khôi** — *Giảng Viên Lập Trình Web & Full-stack Developer* (IT / Phần mềm)
   - Bảng màu: **Classic Teal & Emerald** (`#0E7C6B`), Font: Be Vietnam Pro + Inter.
   - Slug: `tran-anh-khoi`, ID: `cv-tran-anh-khoi`, Domain: `trankhoi.dev`.
2. **Mẫu 2: Nguyễn Minh Châu** — *Lead Product Designer & UX Strategist* (Thiết kế / Sáng tạo)
   - Bảng màu: **Warm Amber & Tangerine** (`#D97706`), Font: Gilroy + Be Vietnam Pro.
   - Bố cục: Đẩy mục **Dự Án Tiêu Biểu** lên đầu cột chính, có mục Ngoại ngữ & Design Sprint.
   - Slug: `nguyen-minh-chau`, ID: `cv-minhchau-design`.
3. **Mẫu 3: Lê Hoàng Nam** — *Senior Data Scientist & AI/ML Engineer* (Dữ liệu & AI)
   - Bảng màu: **Ruby Crimson & Dark Slate** (`#B91C1C`), Font: Montserrat.
   - Bố cục: Thêm mục tùy chỉnh "Công Trình Khoa Học & Ấn Phẩm IEEE".
   - Slug: `le-hoang-nam`, ID: `cv-hoangnam-ai`.
4. **Mẫu 4: Đỗ Minh Trang** — *Growth Marketing Lead & Brand Strategist* (Tiếp thị & Truyền thông)
   - Bảng màu: **Royal Purple & Violet** (`#7C3AED`), Font: Gilroy.
   - Bố cục: Tôn vinh Thành Tựu & Giải Thưởng lên cột nổi bật, số liệu ROAS, ngân sách 15 tỷ.
   - Slug: `do-minh-trang`, ID: `cv-minhtrang-marketing`.
5. **Mẫu 5: Phạm Quốc Bảo** — *Senior Mobile Engineer (Flutter & iOS)* (Công nghệ Di động)
   - Bảng màu: **Ocean Blue & Neon Sky** (`#2563EB`) trên nền **Dark Mode** hiện đại.
   - Slug: `pham-quoc-bao`, ID: `cv-quocbao-mobile`.
6. **Mẫu 6: Hoàng Thảo My** — *Talent Acquisition Lead & HR Business Partner* (Nhân sự & Tuyển dụng)
   - Bảng màu: **Sage Emerald & Mộc Mạc** (`#059669`), Font: Be Vietnam Pro.
   - Bố cục: Nổi bật chứng chỉ quốc tế SHRM-CP, thành tích tuyển dụng 250+ kỹ sư IT.
   - Slug: `hoang-thao-my`, ID: `cv-thaomy-hr`.
7. **Mẫu 7: Trần Văn Khang** — *Head of Business Development & B2B Sales* (Kinh doanh & B2B)
   - Bảng màu: **Golden Sun & Warm Sand** (`#C2410C`), Font: Montserrat.
   - Bố cục: Tập trung doanh số 45 tỷ, mạng lưới đối tác SEA, ARR tăng trưởng 42%.
   - Slug: `tran-van-khang`, ID: `cv-vankhang-business`.
8. **Mẫu 8: Vũ Phương Anh** — *Senior Legal Counsel & Compliance* (Pháp lý & Tuân thủ)
   - Bảng màu: **Deep Navy Slate** (`#0F766E`), Font: Gilroy.
   - Bố cục: Chuẩn mực pháp chế, Nghị định 13/GDPR, rà soát 400+ hợp đồng quốc tế.
   - Slug: `vu-phuong-anh`, ID: `cv-phuonganh-other`.

---

### C. Bộ Tiêu Chuẩn Chất Lượng Khi Đăng Mẫu Lên Cộng Đồng (Quality Validation)

Trong `PublishTemplateModal.tsx`, xây dựng cơ chế kiểm định trước khi đăng:
- **Họ và tên**: Không để trống, tối thiểu 2 từ.
- **Chức danh / Vị trí**: Không để trống, tối thiểu 3 ký tự.
- **Email**: Định dạng email hợp lệ.
- **Số điện thoại**: Tối thiểu 9 chữ số.
- **Tóm tắt năng lực**: Tối thiểu 30 ký tự để mô tả thế mạnh bản thân.
- **Kinh nghiệm hoặc Học vấn**: Có ít nhất 1 mục Kinh Nghiệm hoặc 1 mục Học Vấn.
- **Kỹ năng**: Có ít nhất 1 nhóm kỹ năng với tối thiểu 1 kỹ năng cụ thể.
- **Tên mẫu & Mô tả**: Bắt buộc nhập tên và mô tả lý do bố cục hữu ích.

Giao diện sẽ hiển thị bảng Checklist các tiêu chí với icon tick xanh/đỏ và thanh tiến độ. Nút **"Lưu & Chia Sẻ Mẫu Lên Cộng Đồng"** chỉ cho phép bấm khi đã hoàn thiện 100% các tiêu chuẩn trên.

