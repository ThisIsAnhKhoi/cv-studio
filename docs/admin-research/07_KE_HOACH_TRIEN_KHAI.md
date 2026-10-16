# LỘ TRÌNH TRIỂN KHAI THEO GIAI ĐOẠN & CÁC TASK BRIEFS CHI TIẾT
**Dự án**: CV Studio / MyPortfolio  
**Giai đoạn**: Giai đoạn 6 — Phân hệ Quản trị (Admin), Khám phá Nâng cao & Động cơ Đếm View  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày lập**: 16/10/2026  
**Trạng thái**: Chờ Chủ dự án phê duyệt (Pending Approval)

---

## 1. NGUYÊN TẮC THI CÔNG BẮT BUỘC
1. **Tuân thủ quy ước Task Briefs**: Mỗi hạng mục công việc là một đơn vị độc lập, có mã định danh `TSK-6.x`, định nghĩa rõ việc **LÀM / KHÔNG LÀM**, tiêu chí hoàn thành đo lường được và kế hoạch rollback.
2. **Nguyên tắc an toàn dữ liệu**: Luôn có bước sao lưu/snapshot trước khi chạy migration; có git tag mốc sau mỗi task thành công.
3. **Thứ tự thực thi**:
   - `TSK-6.1` (Bảo mật Rules) là điều kiện tiên quyết **BẮT BUỘC LÀM ĐẦU TIÊN**.
   - `TSK-6.2` (Schema & Migration) và `TSK-6.3` (Đếm View) tuần tự.
   - `TSK-6.4` (Khám Phá) và `TSK-6.5` (Admin CV) có thể thực hiện song song sau khi hoàn thành 6.1 - 6.3.
   - `TSK-6.6` (User & Audit Log) phụ thuộc 6.5.
   - `TSK-6.7` (Hardening & Tài liệu) là bước hoàn tất cuối cùng.

---

## 2. CHI TIẾT CÁC TASK BRIEFS (TSK-6.1 ĐẾN TSK-6.7)

### TASK BRIEF TSK-6.1: NỀN TẢNG BẢO MẬT & FIRESTORE SECURITY RULES
- **Cỡ việc**: **M (Vừa)** | **Phụ thuộc**: Không (Làm đầu tiên)
- **Mục tiêu**: Đóng dứt điểm lỗ hổng bảo mật P0, khóa toàn bộ database bằng Security Rules chuẩn RBAC và thiết lập bộ test Emulator.
- **Phạm vi LÀM**:
  - Tạo `firestore.rules` khóa chặt quyền theo vai trò (`user`, `admin`), khóa `affectedKeys()`, cấm sửa `auditLogs`.
  - Tạo `firebase.json` và `.firebaserc`.
  - Cài đặt `@firebase/rules-unit-testing`, viết bộ test Emulator (14 test cases).
  - Hướng dẫn bootstrap Admin đầu tiên qua Firebase Console GUI.
- **Phạm vi KHÔNG LÀM**: Chưa can thiệp code giao diện Admin hay trang web.
- **Tiêu chí thoát**: 100% tests Emulator pass, deploy rules lên Firebase project thành công.
- **Điểm Demo**: Chạy `npm run test:rules` pass 14/14 tests.
- **Git Tag mốc**: `stage6-brief-6.1-rules-ok`.
- **Cách Rollback**: `git checkout stage5-final` và khôi phục rules cũ trên Firebase Console.

---

### TASK BRIEF TSK-6.2: MỞ RỘNG SCHEMA, COMPOSITE INDEXES & MIGRATION BACKFILL
- **Cỡ việc**: **M (Vừa)** | **Phụ thuộc**: `TSK-6.1`
- **Mục tiêu**: Bổ sung các trường `viewCount`, `status`, `ownerDisabled`, `category` vào schema CV và chạy script backfill cho dữ liệu cũ.
- **Phạm vi LÀM**:
  - Cập nhật interface `CVData` trong `types/cv.ts`.
  - Tạo `firestore.indexes.json` khai báo 6 composite index chuẩn.
  - Viết script `scripts/migrate_v03_add_view_count.ts` với cờ `--dry-run` và batch update 500 docs/lô.
  - Chạy migration gán mặc định `viewCount: 0`, `status: 'active'`, `ownerDisabled: false`, `category: 'tech'`.
- **Phạm vi KHÔNG LÀM**: Không sửa đổi nội dung văn bản của CV cũ, không đổi `updatedAt`.
- **Tiêu chí thoát**: 100% CV trên Firestore có đủ 4 trường mới; build index trên Firebase Console hoàn tất (trạng thái Enabled).
- **Điểm Demo**: Chạy query `orderBy('viewCount', 'desc')` không bị lỗi thiếu index và không bị sót document cũ.
- **Git Tag mốc**: `stage6-brief-6.2-schema-ok`.

---

### TASK BRIEF TSK-6.3: ĐỘNG CƠ ĐẾM LƯỢT XEM ATOMIC (VIEW COUNTER ENGINE)
- **Cỡ việc**: **S (Nhỏ)** | **Phụ thuộc**: `TSK-6.2`
- **Mục tiêu**: Ghi nhận lượt xem hợp lệ, khử trùng lặp 30 phút, loại trừ chủ sở hữu và triệt tiêu xung đột `updatedAt`.
- **Phạm vi LÀM**:
  - Xây dựng hook `useCVViewCount(cvId, isOwner, isPublic)` trong `frontend/src/features/view-counter/`.
  - Tích hợp `sessionStorage` khử trùng lặp 30 phút.
  - Thêm hàm `incrementCVViewCount(cvId)` trong `cvStorageService.ts` chỉ update duy nhất `{ viewCount: increment(1) }`.
  - Hiển thị lượt xem trên `DashboardPage.tsx` và `CVViewPage.tsx`.
  - Viết 8 unit tests cho logic đếm view.
- **Phạm vi KHÔNG LÀM**: Không đếm lượt xem trên trang chủ hay trang tìm kiếm.
- **Tiêu chí thoát**: F5 trang CV 5 lần chỉ tăng 1 view; `updatedAt` của CV không thay đổi; 8 unit tests pass.
- **Điểm Demo**: Mở link CV ở tab ẩn danh $\rightarrow$ view tăng 1; mở bằng tài khoản chủ $\rightarrow$ view không tăng.
- **Git Tag mốc**: `stage6-brief-6.3-viewcount-ok`.

---

### TASK BRIEF TSK-6.4: TRANG CHỦ TOP 6 & TRANG DUYỆT CV RIÊNG BIỆT (`/explore`)
- **Cỡ việc**: **L (Lớn)** | **Phụ thuộc**: `TSK-6.2`, `TSK-6.3`
- **Mục tiêu**: Giảm 80% lượt đọc Firestore trên Trang chủ, tạo trang duyệt danh bạ chuyên sâu có tìm kiếm tiếng Việt và lọc ngành nghề.
- **Phạm vi LÀM**:
  - Sửa `HomePage.tsx`: Tải đúng 6 CV xem nhiều nhất, thêm cache SWR 10 phút, thêm nút dẫn sang `/explore`.
  - Tạo mới `ExplorePage.tsx` (Lazy-loaded): Lưới thẻ responsive, tìm kiếm tiếng Việt `removeVietnameseTones`, bộ lọc 7 ngành nghề, phân trang Cursor `startAfter` (24 CV/lô).
  - Đồng bộ bộ lọc lên URL query params (`?category=&sort=&q=`).
  - Viết 14 unit tests cho tìm kiếm và phân trang.
- **Phạm vi KHÔNG LÀM**: Không nhân bản component `ProfileCard` (dùng chung với HomePage).
- **Tiêu chí thoát**: Trang chủ chỉ đọc 6 docs; trang duyệt phân trang mượt mà; 14 tests pass; tsc 0 lỗi.
- **Điểm Demo**: Tìm kiếm "nguyen" hiển thị đúng các ứng viên họ Nguyễn; chọn ngành "Thiết Kế" lọc tức thì.
- **Git Tag mốc**: `stage6-brief-6.4-explore-ok`.

---

### TASK BRIEF TSK-6.5: GIAO DIỆN QUẢN TRỊ ADMIN VÀ QUẢN LÝ CV (SOFT DELETE)
- **Cỡ việc**: **L (Lớn)** | **Phụ thuộc**: `TSK-6.1`, `TSK-6.2`
- **Mục tiêu**: Xây dựng phân hệ Admin được bảo vệ, hiển thị tổng quan số liệu và quản lý kiểm duyệt CV.
- **Phạm vi LÀM**:
  - Tạo `<AdminAuthGuard />`: Chặn người dùng không có quyền (hiển thị 403 Forbidden).
  - Cấu hình route code-splitting `/admin/*` trong `App.tsx`.
  - Tạo màn hình Tổng quan (`/admin`) với 4 thẻ thống kê dùng `count()`.
  - Tạo màn hình Quản lý CV (`/admin/cvs`): Xem danh sách, tìm kiếm, lọc, modal xác nhận khóa CV bắt buộc nhập lý do $\ge 5$ ký tự, khôi phục CV.
  - Viết 11 unit tests cho Guard và CV Table.
- **Phạm vi KHÔNG LÀM**: Không kéo phình bundle chính (Entry chunk giữ $\le 33.5\text{ kB}$).
- **Tiêu chí thoát**: User thường vào `/admin` bị chặn 403; Admin khóa CV thành công $\rightarrow$ CV biến mất khỏi trang chủ ngay lập tức; 11 tests pass.
- **Điểm Demo**: Đăng nhập bằng tài khoản Admin $\rightarrow$ vào `/admin/cvs` $\rightarrow$ bấm khóa 1 CV $\rightarrow$ mở tab ẩn danh kiểm tra CV đó đã bị ẩn.
- **Git Tag mốc**: `stage6-brief-6.5-admin-cv-ok`.

---

### TASK BRIEF TSK-6.6: QUẢN LÝ NGƯỜI DÙNG & NHẬT KÝ KIỂM TOÁN BẤT BIẾN
- **Cỡ việc**: **M (Vừa)** | **Phụ thuộc**: `TSK-6.5`
- **Mục tiêu**: Hoàn thiện màn hình quản lý tài khoản User theo nguyên tắc "Xóa = Tắt" và hệ thống ghi log kiểm toán nguyên tử.
- **Phạm vi LÀM**:
  - Tạo màn hình Quản lý User (`/admin/users`): Danh sách tài khoản, đổi vai trò (`user` $\leftrightarrow$ `moderator`), khóa/mở khóa user.
  - Triển khai Batched Write: Khi khóa User, tự động cập nhật `ownerDisabled: true` trên tất cả CV của họ và ghi log vào `auditLogs`.
  - Chống Admin tự khóa chính mình và chống hạ quyền Admin cuối cùng.
  - Tạo màn hình Nhật ký kiểm toán (`/admin/logs`): Danh sách log chỉ đọc.
  - Viết 12 unit tests.
- **Phạm vi KHÔNG LÀM**: Không hỗ trợ xóa vật lý document User (tuân thủ Soft Delete).
- **Tiêu chí thoát**: Khóa user $\rightarrow$ toàn bộ CV của họ bị ẩn; không thể xóa/sửa audit log; 12 tests pass.
- **Điểm Demo**: Khóa 1 user thử nghiệm $\rightarrow$ toàn bộ CV của user đó biến mất khỏi trang chủ $\rightarrow$ mở `/admin/logs` thấy bản ghi log chi tiết.
- **Git Tag mốc**: `stage6-brief-6.6-admin-users-ok`.

---

### TASK BRIEF TSK-6.7: BẢO MẬT TỔNG THỂ, HARDENING & BÀN GIAO TÀI LIỆU
- **Cỡ việc**: **S (Nhỏ)** | **Phụ thuộc**: `TSK-6.1` đến `TSK-6.6`
- **Mục tiêu**: Gia cố an ninh, làm sạch XSS rich text, cấu hình security headers Vercel và hoàn thiện hồ sơ dự án.
- **Phạm vi LÀM**:
  - Tích hợp `DOMPurify` làm sạch HTML của trường `summary`.
  - Cập nhật security headers trong `vercel.json` (`X-Frame-Options`, `X-Content-Type-Options`).
  - Chạy toàn bộ test suite ($\ge 147$ tests pass 100%), chạy build production.
  - Cập nhật `CHANGELOG.md` (phiên bản v0.4.0) và `PROJECT_STATUS.md`.
- **Phạm vi KHÔNG LÀM**: Không thêm tính năng mới ngoài phạm vi.
- **Tiêu chí thoát**: 147/147 tests pass; build thành công; audit an ninh đạt yêu cầu.
- **Điểm Demo**: Báo cáo tổng kết toàn bộ phân hệ và nghiệm thu sản phẩm.
- **Git Tag mốc**: `stage6-release-v0.4.0`.
