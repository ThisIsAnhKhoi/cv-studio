# BẢNG THEO DÕI TIẾN ĐỘ DỰ ÁN (PROJECT STATUS & DEV LOG)
*Nền tảng CV Portfolio Platform (React + TS + Tailwind CSS + Node.js/Firebase)*

---

## 1. THÔNG TIN CHUNG
- **Dự án**: Website Nền tảng Tạo & Quản lý CV Cá nhân (CV Portfolio Platform)
- **Tài liệu đặc tả**: [y_tuong.txt](file:///c:/Users/junde/OneDrive/Desktop/TranKhoi/Website/y_tuong.txt)
- **Kiến trúc hệ thống**: 4-Layer Clean Architecture (Presentation -> Template Engine -> State/Logic -> Persistence)
- **Quản lý phiên bản**: Git & GitHub (Conventional Commits, Branching: `main` & `develop`)
- **Triển khai dự kiến**: Vercel (Frontend), Render / Firebase (Backend & Database)
- **Giai đoạn hiện tại**: Giai đoạn 1 — Chuẩn bị kiến trúc, Phân tầng thư mục & Xây dựng Mẫu CV số 1 (Default Template)

---

## 2. KẾ HOẠCH CHI TIẾT THỰC HIỆN BƯỚC 1 (PHASE 1 IMPLEMENTATION PLAN)

| Mã tác vụ | Tên nhiệm vụ | Mô tả & Tiêu chí nghiệm thu | Trạng thái |
|:---:|:---|:---|:---:|
| **1.1** | **Git & Repository Setup** | Khởi tạo `git init`, cấu hình `.gitignore` chuẩn Node/Vite, tạo `README.md` mô tả dự án và cấu trúc nhánh. | ⏳ Đang chuẩn bị |
| **1.2** | **Khởi tạo Frontend & Cấu trúc phân tầng** | Thiết lập React 18+ với TypeScript + Vite + Tailwind CSS theo đúng cây thư mục 4 tầng đã định nghĩa trong `y_tuong.txt`. Tích hợp Google Fonts (`Outfit` + `Be Vietnam Pro`). | ⏳ Đang chuẩn bị |
| **1.3** | **Data Schema & Mock Data** | Định nghĩa TypeScript types (`types/cv.ts`) cho toàn bộ các phần CV. Tạo bộ dữ liệu mẫu phong phú, chân thực (`data/mockCVData.ts`). | ⏳ Đang chuẩn bị |
| **1.4** | **Xây dựng Mẫu CV số 1 theo Registry Pattern** | Hiện thực hóa Template số 1 chuẩn khổ A4 (210mm x 297mm), bố cục 2 cột khoa học, header nổi bật, icon Lucide sắc nét, hỗ trợ Dark/Light mode và chuẩn in `@media print`. | ⏳ Đang chuẩn bị |
| **1.5** | **Khởi chạy & Kiểm thử** | Chạy dev server, kiểm tra độ mượt, giao diện Dark/Light mode, độ tương thích tiếng Việt và chức năng xuất PDF. | ⏳ Đang chuẩn bị |

---

## 3. BẢNG TIẾN ĐỘ TỔNG THỂ (OVERALL ROADMAP)

| STT | Giai đoạn / Tính năng | Trạng thái | Ghi chú |
|:---:|:---|:---:|:---|
| 1 | Khảo sát ý tưởng & Chuẩn hóa tài liệu (`y_tuong.txt`) |  Hoàn thành | Đã hoàn thiện 9 phần: Sitemap, Data Schema, Phân tích CV mẫu, Kiến trúc 4 tầng, Cây thư mục, Git & Deploy |
| 2 | Hệ thống Dev-Log & Handover cho Antigravity |  Hoàn thành | `PROJECT_STATUS.md` và `.agents/rules/session-protocol.md` |
| 3 | Thực hiện Bước 1: Git setup + Frontend phân tầng + Mẫu CV số 1 | ⏳ Đang tiến hành | Theo kế hoạch chi tiết ở Mục 2 |
| 4 | Trình người dùng duyệt Mẫu CV số 1 & tinh chỉnh |  Chờ thực hiện | Lấy ý kiến phản hồi về dáng, font và màu sắc |
| 5 | Xây dựng Trang chủ (Menu & Danh sách Profile) |  Chờ thực hiện | Grid card profile, thanh tìm kiếm, filter theo ngành |
| 6 | Xây dựng Trang CV cá nhân chi tiết (Public View) |  Chờ thực hiện | Chế độ chỉ xem, export PDF, liên hệ nhanh, share link |
| 7 | Xây dựng Trình chỉnh sửa CV (CV Editor Dashboard) |  Chờ thực hiện | Nút (+) thêm mục động, live preview, đổi theme & font |
| 8 | Tích hợp Xác thực (Auth) & Phân quyền bảo mật |  Chờ thực hiện | Firebase Auth / Node.js; chỉ chủ tài khoản mới được sửa CV |
| 9 | Triển khai CI/CD lên Vercel & Render |  Chờ thực hiện | Tự động deploy khi push lên nhánh main |

---

## 4. NHẬT KÝ SỬA LỖI & KINH NGHIỆM ĐÃ THỬ (BUG LOG & TRIED SOLUTIONS)

| Ngày | Vấn đề / Lỗi | Cách đã thử (Failed) | Giải pháp hiệu quả (Resolved) |
|:---:|:---|:---|:---|
| 12/10/2026 | Khởi tạo dự án & Bổ sung CV mẫu | Chưa có lỗi | Hoàn thiện kiến trúc 4 lớp Clean Architecture & Registry Pattern cho Template Engine |

---

## 5. BƯỚC TIẾP THEO NGAY LẬP TỨC (NEXT IMMEDIATE STEPS)
1. Thống nhất với người dùng về mô hình phân tầng kiến trúc và cây thư mục dự án.
2. Tiến hành Tác vụ 1.1: Khởi tạo Git repository và file `.gitignore`.
3. Tiến hành Tác vụ 1.2 & 1.3: Khởi tạo cấu trúc thư mục Frontend và Data Schema.
