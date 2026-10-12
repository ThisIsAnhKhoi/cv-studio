# BẢNG THEO DÕI TIẾN ĐỘ DỰ ÁN (PROJECT STATUS & DEV LOG)
*Nền tảng CV Portfolio Platform (React + TS + Tailwind CSS + Node.js/Firebase)*

---

## 1. THÔNG TIN CHUNG
- **Dự án**: Website Nền tảng Tạo & Quản lý CV Cá nhân (CV Portfolio Platform)
- **Tài liệu đặc tả**: [y_tuong.txt](file:///c:/Users/junde/OneDrive/Desktop/TranKhoi/Website/y_tuong.txt)
- **Kiến trúc hệ thống**: 4-Layer Clean Architecture
- **Môi trường cục bộ**: Đang chạy tại `http://localhost:3000/` (Vite dev server)
- **Giai đoạn hiện tại**: Kế hoạch Tinh chỉnh Mẫu CV số 1 & Chuẩn hóa Hệ thống (Refinement & Enhancement Plan)

---

## 2. KẾ HOẠCH NÂNG CẤP & SỬA LỖI THEO PHẢN HỒI (REFINEMENT ACTION PLAN)

| STT | Vấn đề / Yêu cầu | Nguyên nhân & Nghiên cứu | Giải pháp & Kế hoạch thực hiện | Trạng thái |
|:---:|:---|:---|:---|:---:|
| **R.1** | **Cây thư mục lộn xộn** | Các file mẫu HTML/PDF nằm tràn lan tại thư mục gốc gây rối mắt. | Đã gom toàn bộ các file mẫu vào `references/sample-cvs/`. Quy hoạch thư mục gọn gàng, chuẩn cấu trúc sản phẩm. |  Đã dọn dẹp |
| **R.2** | **Lỗi font tiếng Việt** | Font `Outfit` từ Google Fonts thiếu ký tự hoa tiếng Việt (`Ễ`, `Ê` trong `NGUYỄN LÊ THANH TRÚC`), dẫn đến vỡ font chữ to nhỏ không đều. | Đã trích xuất các bộ font việt hóa từ máy tính của người dùng (`iCielBCCubano`, `SVN-Optima`, `Gilroy`, `Montserrat`) vào `public/fonts/`. Khai báo `@font-face` chuẩn. |  Đang tiến hành |
| **R.3** | **Icon SVG bị lệch** | Nút link bên cạnh tiêu đề dự án bị lệch dòng do thuộc tính flex/inline và line-height không đồng bộ. | Đồng bộ hóa `inline-flex items-center`, canh giữa tuyệt đối, bổ sung kích thước cố định `w-3.5 h-3.5 shrink-0`. |  Đang tiến hành |
| **R.4** | **Thông tin quá nhiều làm CV bị rối** | Cột trái quá hẹp (210px) làm email bị gãy 2 dòng; nội dung chữ quá dày đặc thiếu khoảng thở. | Tăng chiều rộng cột trái lên 245px; tinh gọn bullet points kinh nghiệm (2 điểm nổi bật nhất); tối ưu khoảng trắng (`leading-relaxed`, padding thoáng đãng). |  Đang tiến hành |
| **R.5** | **Thiếu hiệu ứng hover & sinh động** | Giao diện còn tĩnh như trang giấy in, chưa mang lại trải nghiệm web portfolio hiện đại. | Bổ sung micro-interactions: hover card nổi nhẹ (`hover:-translate-y-0.5`), glow viền theo màu chủ đạo, tag kỹ năng phóng nhẹ (`hover:scale-105`), click chép email với tooltip tức thì. |  Đang tiến hành |

---

## 3. BẢNG TIẾN ĐỘ TỔNG THỂ (OVERALL ROADMAP)

| STT | Giai đoạn / Tính năng | Trạng thái | Ghi chú |
|:---:|:---|:---|:---|
| 1 | Khảo sát ý tưởng & Chuẩn hóa tài liệu (`y_tuong.txt`) |  Hoàn thành | 9 phần đặc tả hoàn chỉnh |
| 2 | Hệ thống Dev-Log & Handover cho Antigravity |  Hoàn thành | `PROJECT_STATUS.md` và `.agents/rules/session-protocol.md` |
| 3 | Thực hiện Bước 1: Git setup + Frontend phân tầng + Mẫu CV số 1 |  Hoàn thành | Đã khởi chạy tại localhost:3000 |
| 4 | Kế hoạch Tinh chỉnh Mẫu số 1 (Font máy tính, Hover, Layout thoáng, Icon chuẩn) | ⏳ Đang triển khai | Theo checklist chi tiết ở Mục 2 |
| 5 | Xây dựng Mẫu CV số 2 (Warm Bold Ink & Tangerine) |  Chờ thực hiện | Mở rộng theo thiết kế CV v2 đã khảo sát |
| 6 | Xây dựng Trang chủ (Menu & Danh sách Profile) |  Chờ thực hiện | Grid card profile, thanh tìm kiếm, filter theo ngành |
| 7 | Xây dựng Trang CV cá nhân chi tiết (Public View) |  Chờ thực hiện | Chế độ chỉ xem, export PDF, liên hệ nhanh, share link |
| 8 | Xây dựng Trình chỉnh sửa CV (CV Editor Dashboard) |  Chờ thực hiện | Nút (+) thêm mục động, live preview, đổi theme & font |
| 9 | Tích hợp Xác thực (Auth) & Phân quyền bảo mật |  Chờ thực hiện | Firebase Auth / Node.js; chỉ chủ tài khoản mới được sửa CV |
| 10 | Triển khai CI/CD lên Vercel & Render |  Chờ thực hiện | Tự động deploy khi push lên nhánh main |

---

## 4. BƯỚC TIẾP THEO NGAY LẬP TỨC (NEXT IMMEDIATE STEPS)
1. Cấu hình `@font-face` trong `src/styles/index.css` cho các font máy tính: `iCiel Cubano`, `SVN-Optima`, `Gilroy`, `Montserrat`.
2. Cập nhật `tailwind.config.js` với các font families mới.
3. Tinh chỉnh `src/features/cv-templates/template-1/CVTemplateClassicTeal.tsx` (sửa icon lệch, mở rộng sidebar 245px, bổ sung hover effects).
4. Tinh chỉnh dữ liệu mẫu `src/data/mockCVData.ts` thoáng đãng, sang trọng, không bị rối.
5. Kiểm tra trực tiếp trên trình duyệt `http://localhost:3000/`.
