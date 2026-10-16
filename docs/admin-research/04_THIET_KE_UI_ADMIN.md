# BẢN THIẾT KẾ GIAO DIỆN PHÂN HỆ QUẢN TRỊ (ADMIN UI SPECIFICATION & WIREFRAMES)
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày thực hiện**: 16/10/2026  
**Trạng thái**: Giai đoạn 0 — Thiết kế Giao diện (Design Specs Only — Chưa viết code)

---

## 1. KIẾN TRÚC ĐIỀU HƯỚNG & QUY HOẠCH ROUTE `/admin`

### 1.1. Phân mảnh Mã nguồn (Code-Splitting Isolation)
- Toàn bộ phân hệ Admin được đóng gói thành một Lazy-loaded Chunk độc lập: `AdminPage-[hash].js`.
- Tuyệt đối **không import trực tiếp** các component Admin vào `App.tsx` hoặc `Navbar.tsx` để bảo vệ ngân sách bundle (Entry chunk giữ nguyên **$\le 33.5\text{ kB}$**).
- Khách vãng lai và người dùng thông thường truy cập trang web sẽ **không tải 1 byte mã nguồn nào của Admin** về máy!

### 1.2. Cấu trúc Routing con (`/admin/*`)
- `/admin`: Tổng quan số liệu thống kê (Overview Dashboard) & Hoạt động gần đây.
- `/admin/cvs`: Quản lý danh sách CV (Kiểm duyệt, tìm kiếm, lọc, khóa/mở khóa CV).
- `/admin/users`: Quản lý người dùng (Danh sách tài khoản, đổi vai trò, khóa/mở khóa user).
- `/admin/logs`: Nhật ký kiểm toán bất biến (Audit Trail).

---

## 2. WIREFRAMES BỐ CỤC BẰNG KÝ TỰ ASCII

### Màn hình 1: Tổng Quan Hệ Thống (`/admin`)

```
+-----------------------------------------------------------------------------------------+
| [Logo CV Studio PRO]  Bảng Quản Trị Hệ Thống          [Dark/Light] [Admin: Anh Khoi v]  |
+-----------------------------------------------------------------------------------------+
| [Menu] Tổng quan | Quản lý CV (1,240) | Quản lý Người dùng (850) | Nhật ký Kiểm toán     |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [THỐNG KÊ NHANH]                                                                       |
|  +------------------+  +------------------+  +------------------+  +------------------+ |
|  | Tổng Người Dùng  |  | Tổng Số CV       |  | CV Công Khai     |  | CV Đã Bị Khóa    | |
|  |     852          |  |    1,245         |  |     920 (74%)    |  |      12 (0.9%)   | |
|  | +18 tuần này     |  | +42 tuần này     |  | +35 tuần này     |  | 0 vi phạm mới    | |
|  +------------------+  +------------------+  +------------------+  +------------------+ |
|                                                                                         |
|  [HOẠT ĐỘNG KIỂM DUYỆT GẦN ĐÂY]                                  [Xem toàn bộ nhật ký >]|
|  +------------------------------------------------------------------------------------+ |
|  | Thời gian        | Quản trị viên      | Hành động         | Đối tượng     | Lý do  | |
|  |------------------+--------------------+-------------------+---------------+--------| |
|  | 16/10 14:20      | khoi@admin.com     | KHÓA CV           | CV #cv-8912   | Spam   | |
|  | 16/10 11:05      | truc@mod.com       | MỞ KHÓA USER      | user #u-4421  | Đã sửa | |
|  | 15/10 19:30      | khoi@admin.com     | THĂNG CẤP MOD     | user #u-3309  | Uy tín | |
|  +------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

---

### Màn hình 2: Quản Lý CV (`/admin/cvs`)

```
+-----------------------------------------------------------------------------------------+
| QUẢN LÝ DANH SÁCH CV                                                                    |
| [ Tìm kiếm theo tên ứng viên, chức danh, ID...     ] [Tất cả ngành v] [Trạng thái v]    |
+-----------------------------------------------------------------------------------------+
| Danh sách: 1,245 hồ sơ                                                   [Làm mới dữ liệu]|
| +-------------------------------------------------------------------------------------+ |
| | ID / Ứng Viên        | Ngành / Mẫu   | Lượt Xem | Quyền Riêng Tư | Trạng Thái| Thao Tác | |
| |----------------------+---------------+----------+----------------+-----------+----------| |
| | Trần Anh Khôi        | Công nghệ     | 1,250    | [Công Khai]    | [Hoạt động| [Xem CV] | |
| | cv-17921498-lbkr     | Mẫu 1 (Teal)  |          |                |           | [Khóa]   | |
| |----------------------+---------------+----------+----------------+-----------+----------| |
| | Nguyễn Lê Thanh Trúc | Thiết kế      | 3,420    | [Công Khai]    | [Hoạt động| [Xem CV] | |
| | cv-thanhtruc-01      | Mẫu 2 (Warm)  |          |                |           | [Khóa]   | |
| |----------------------+---------------+----------+----------------+-----------+----------| |
| | Phạm Văn Spam        | Khác          | 12       | [Cá Nhân]      | [ĐÃ KHÓA] | [Xem CV] | |
| | cv-spam-9999         | Mẫu 3 (Min)   |          |                | vi phạm   | [Mở lại] | |
| +-------------------------------------------------------------------------------------+ |
| Hiển thị 1 - 24 trên 1,245 hồ sơ                                  [< Trang trước] [Trang sau >] |
+-----------------------------------------------------------------------------------------+
```

---

### Màn hình 3: Hộp Thoại Xác Nhận Khóa (Confirmation Modal)

```
       +------------------------------------------------------------------+
       |  [!] XÁC NHẬN KHÓA HỒ SƠ CV CỦA NGƯỜI DÙNG                       |
       +------------------------------------------------------------------+
       | Bạn đang chuẩn bị vô hiệu hóa hồ sơ:                             |
       | • Tên CV: "Lập trình viên Senior Java" (ID: cv-spam-9999)        |
       | • Chủ sở hữu: Pham Van Spam (spam@gmail.com)                     |
       |                                                                  |
       | Khi bị khóa, CV này sẽ lập tức biến mất khỏi Trang chủ, Trang    |
       | Duyệt và không ai có thể truy cập qua link trực tiếp.            |
       |                                                                  |
       | Nhập lý do khóa (Bắt buộc, tối thiểu 5 ký tự) *:                 |
       | +--------------------------------------------------------------+ |
       | | Chứa nội dung quảng cáo cờ bạc trái phép                     | |
       | +--------------------------------------------------------------+ |
       |                                                                  |
       | [ Hủy bỏ (Esc) ]                  [ Đồng Ý Khóa CV (Ghi Log) ]  |
       +------------------------------------------------------------------+
```

---

## 3. TIÊU CHUẨN TRẢI NGHIỆM NGƯỜI DÙNG & TƯƠNG THÍCH ĐA THIẾT BỊ

### 3.1. Thiết kế Chống Thao Tác Trùng (Anti-Double-Click)
- Mọi nút bấm thực thi hành động nhạy cảm (Khóa/Mở/Đổi role):
  - Tự động chuyển sang trạng thái `disabled` kèm biểu tượng `Loader2` quay tròn khi đang gửi request.
  - Vô hiệu hóa phím Enter và click chuột trong suốt thời gian kết nối mạng để tránh gửi 2 bản ghi log trùng lặp.

### 3.2. Responsive Trên Màn Hình Nhỏ (Mobile / Tablet)
- **Trên Desktop ($\ge 1024\text{px}$)**: Hiển thị bảng dạng Data Table đầy đủ cột với đường kẻ tinh gọn, hover highlight dòng.
- **Trên Mobile ($< 768\text{px}$)**:
  - Bảng tự động chuyển đổi sang dạng **Thẻ xếp chồng (Stacked Cards)**.
  - Mỗi thẻ hiển thị: Tên ứng viên, badge trạng thái, số view và thanh công cụ thao tác nhanh ở đáy thẻ.
  - Thanh bộ lọc co gọn thành một nút bấm **"Mở Bộ Lọc"** kích hoạt Bottom Drawer trượt từ dưới lên.

### 3.3. Hỗ trợ Toàn diện Dark Mode & Chuẩn Tương Phản WCAG 2.1
- Chế độ Sáng: Nền `bg-slate-50`, thẻ `bg-white`, viền `border-slate-200`, chữ `text-slate-900`.
- Chế độ Tối: Nền `bg-slate-950`, thẻ `bg-slate-900`, viền `border-slate-800`, chữ `text-slate-100`.
- Màu trạng thái tuân thủ độ tương phản tối thiểu 4.5:1:
  - Hoạt động: `emerald-600` (Light) / `emerald-400` (Dark).
  - Đã khóa: `rose-600` (Light) / `rose-400` (Dark).
  - Quản trị viên: `indigo-600` (Light) / `indigo-400` (Dark).

### 3.4. Khả năng Tiếp cận (Accessibility - a11y)
- Mọi Modal đều có cơ chế **Focus Trap** (con trỏ chuột và phím Tab không bị lọt ra ngoài trang nền).
- Nhấn phím `Escape` tự động đóng hộp thoại xác nhận.
- Đầy đủ thuộc tính `aria-label`, `aria-expanded`, `role="dialog"`, `aria-modal="true"`.
