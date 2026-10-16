# DANH SÁCH 8 CÂU HỎI THIẾT KẾ CẦN CHỦ DỰ ÁN QUYẾT ĐỊNH
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày lập**: 16/10/2026  
**Trạng thái**: Trình Chủ dự án phê duyệt (Pending Decision)

---

### CÂU HỎI 1: Số lượng N hồ sơ hiển thị trong Showcase "Top Xem Nhiều" tại Trang Chủ
- **Bối cảnh**: Trang chủ cần hiển thị các CV tiêu biểu được quan tâm nhất để tạo ấn tượng cho khách truy cập, đồng thời tiết kiệm số lượt đọc Firestore.
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **N = 6 hồ sơ** (Bố cục lưới 3 cột x 2 hàng hoàn hảo trên Desktop, 2 cột x 3 hàng trên Tablet, 1 cột x 6 hàng trên Mobile).
  - **Lựa chọn B**: **N = 8 hồ sơ** (Bố cục lưới 4 cột x 2 hàng trên màn hình cực rộng hoặc 2 cột x 4 hàng).
  - **Lựa chọn C**: **N = 10 hồ sơ**.
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (N = 6)**. Đủ để tạo độ phong phú, cân đối tuyệt đối về mặt thị giác trên mọi thiết bị, và chỉ tốn đúng 6 lượt đọc Firestore mỗi phiên truy cập.

---

### CÂU HỎI 2: Hạn mức số lượng CV tối đa cho mỗi tài khoản người dùng thông thường
- **Bối cảnh**: Cần ngăn chặn việc một người dùng tạo hàng trăm CV rác làm phình to dung lượng cơ sở dữ liệu và vượt hạn mức ghi.
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **Tối đa 5 CV / tài khoản**. Đủ cho 1 người tạo các phiên bản CV khác nhau (ví dụ: 1 bản tiếng Việt, 1 bản tiếng Anh, 1 bản cho Frontend, 1 bản cho Full-stack, 1 bản nháp).
  - **Lựa chọn B**: **Tối đa 10 CV / tài khoản**.
  - **Lựa chọn C**: **Không giới hạn** (Chỉ cảnh báo khi tạo quá nhiều).
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (Tối đa 5 CV)**. Đây là con số tiêu chuẩn của các nền tảng tạo CV quốc tế ở gói miễn phí.

---

### CÂU HỎI 3: Quyết định về Ngân sách: Gói Spark (0 đồng) hay Gói Blaze (Có trả phí theo dung lượng)?
- **Bối cảnh**: Gói Spark (Free) giới hạn 50k reads/ngày, 20k writes/ngày, không hỗ trợ Cloud Functions. Gói Blaze hỗ trợ Cloud Functions nhưng yêu cầu nhập thẻ tín dụng quốc tế và có rủi ro phát sinh chi phí ngoài ý muốn nếu bị tấn công DDoS.
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **GIỮ VỮNG 100% GÓI SPARK 0 ĐỒNG**. Áp dụng toàn bộ giải pháp kiến trúc đã thiết kế trong `01_NGHIEN_CUU_ADMIN_BAO_MAT.md` (RBAC qua collection `admins`, Security Rules khóa `affectedKeys()`, đếm view client-side).
  - **Lựa chọn B**: **Nâng cấp gói Blaze** để viết Cloud Functions (tính phí khi vượt ngưỡng miễn phí).
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (Gói Spark 0 đồng)**. Phù hợp hoàn hảo với giai đoạn MVP, loại trừ 100% rủi ro mất tiền ngoài ý muốn.

---

### CÂU HỎI 4: Có cần vai trò Kiểm duyệt viên (Moderator) không?
- **Bối cảnh**: Hệ thống có cần phân cấp riêng biệt giữa người chỉ đi kiểm duyệt nội dung (Moderator) và người quản trị toàn quyền (Admin)?
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **CÓ TÍCH HỢP VAI TRÒ MODERATOR**. Moderator có quyền xem mọi CV và khóa CV vi phạm, nhưng CẤM KHÔNG ĐƯỢC khóa User và CẤM KHÔNG ĐƯỢC thăng/hạ quyền người khác.
  - **Lựa chọn B**: **CHỈ CẦN 2 VAI TRÒ (User và Admin)**. Bỏ qua vai trò Moderator để đơn giản hóa giao diện.
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A**. Mô hình 3 vai trò đã được thiết kế sẵn trong Security Rules, giúp dự án sau này có thể tuyển cộng tác viên hỗ trợ duyệt nội dung mà không sợ lộ quyền quản trị tối cao.

---

### CÂU HỎI 5: Cửa sổ thời gian khử trùng lặp cho bộ đếm lượt xem (Deduplication Window)
- **Bối cảnh**: Cần chống việc 1 người xem F5 liên tục làm nhảy view ảo, nhưng vẫn ghi nhận khi họ quay lại vào thời điểm khác.
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **30 phút** (Tính theo một phiên làm việc thông thường của nhà tuyển dụng).
  - **Lựa chọn B**: **24 giờ** (Một ngày chỉ tính 1 view từ 1 trình duyệt).
  - **Lựa chọn C**: **Theo phiên trình duyệt (Session)** (Đóng tab mở lại thì tính tiếp).
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (30 phút qua `sessionStorage`)**. Cân bằng tuyệt vời giữa độ chính xác và tính tự nhiên của lưu lượng truy cập.

---

### CÂU HỎI 6: Chính sách xử lý dữ liệu cá nhân (PII: Email, SĐT, Ngày sinh) trên CV Công Khai
- **Bối cảnh**: Khi CV để chế độ Public, các thông tin nhạy cảm có thể bị bot quét.
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị cho MVP)**: **GIỮ HIỂN THỊ ĐẦY ĐỦ NHƯ HIỆN TẠI KÈM NHÃN NHẮC NHỞ TRONG EDITOR**. Nếu người dùng chủ động điền thì hiển thị, nếu để trống thì tự động ẩn. Thêm cảnh báo nhẹ: "Thông tin này sẽ công khai khi bạn chia sẻ link".
  - **Lựa chọn B**: **BẮT BUỘC CHE MỘT PHẦN** (Ví dụ: `0912 *** 678`, `th***@gmail.com`), muốn xem đầy đủ phải bấm "Hiện thông tin" kèm captcha.
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A cho MVP**. Đơn giản, thực tế, giữ trọn vẹn thẩm mỹ của bản in CV A4.

---

### CÂU HỎI 7: Tên đường dẫn URL cho Trang Duyệt CV Riêng Biệt
- **Bối cảnh**: Tách danh bạ khám phá CV ra khỏi Trang chủ thì nên đặt tên route là gì để chuẩn SEO và chuyên nghiệp?
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **`/explore`** (Khám phá hồ sơ chuyên nghiệp — Khớp với nút "Khám Phá Hồ Sơ" hiện có trên Navbar).
  - **Lựa chọn B**: **`/cvs`** (Danh sách CV).
  - **Lựa chọn C**: **`/directory`** (Danh bạ ứng viên).
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (`/explore`)**.

---

### CÂU HỎI 8: Phương án Migration / Backfill cho dữ liệu CV cũ
- **Bối cảnh**: Toàn bộ CV hiện tại trên Firestore chưa có trường `viewCount`, `status`, `category`. Nếu không cập nhật, câu truy vấn sắp xếp `orderBy('viewCount')` sẽ tự động loại bỏ các CV này khỏi danh sách.
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị bắt buộc)**: **CHẠY SCRIPT MIGRATION TỰ ĐỘNG BẢO TOÀN DỮ LIỆU**.  
    *Lý do*: Script quét qua các document, chỉ gán giá trị mặc định (`viewCount: 0`, `status: 'active'`, `category: 'tech'`) cho các trường đang bị thiếu; giữ nguyên 100% nội dung và giữ nguyên `updatedAt`.
  - **Lựa chọn B**: **Xóa toàn bộ DB cũ để tạo lại từ đầu**. Chỉ áp dụng nếu dữ liệu hiện tại là 100% dữ liệu thử nghiệm rác. (Không khuyến nghị vì làm mất dữ liệu của người dùng thật nếu có).
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (Chạy script migration bảo toàn dữ liệu)**.
