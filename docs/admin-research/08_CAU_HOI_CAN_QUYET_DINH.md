# DANH SÁCH 8 CÂU HỎI THIẾT KẾ CẦN CHỦ DỰ ÁN QUYẾT ĐỊNH
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày lập**: 16/10/2026  
**Trạng thái**: ✅ **ĐÃ ĐƯỢC CHỦ DỰ ÁN PHÊ DUYỆT TOÀN DIỆN (16/10/2026)**  
*Chủ dự án đồng ý toàn bộ các khuyến nghị của Kiến trúc sư và chủ động phê duyệt Lựa chọn B cho Câu hỏi 8 (Xóa toàn bộ DB mẫu cũ để tạo lại từ đầu với schema sạch 100%).*

---

### CÂU HỎI 1: Số lượng N hồ sơ hiển thị trong Showcase "Top Xem Nhiều" tại Trang Chủ
- **Bối cảnh**: Trang chủ cần hiển thị các CV tiêu biểu được quan tâm nhất để tạo ấn tượng cho khách truy cập, đồng thời tiết kiệm số lượt đọc Firestore.
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **N = 6 hồ sơ** (Bố cục lưới 3 cột x 2 hàng hoàn hảo trên Desktop, 2 cột x 3 hàng trên Tablet, 1 cột x 6 hàng trên Mobile).
  - **Lựa chọn B**: **N = 8 hồ sơ** (Bố cục lưới 4 cột x 2 hàng trên màn hình cực rộng hoặc 2 cột x 4 hàng).
  - **Lựa chọn C**: **N = 10 hồ sơ**.
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (N = 6)**. Đủ để tạo độ phong phú, cân đối tuyệt đối về mặt thị giác trên mọi thiết bị, và chỉ tốn đúng 6 lượt đọc Firestore mỗi phiên truy cập.
- **✅ Quyết định chính thức**: **CHỌN PHƯƠNG ÁN A (N = 6)**.

---

### CÂU HỎI 2: Hạn mức số lượng CV tối đa cho mỗi tài khoản người dùng thông thường
- **Bối cảnh**: Cần ngăn chặn việc một người dùng tạo hàng trăm CV rác làm phình to dung lượng cơ sở dữ liệu và vượt hạn mức ghi.
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **Tối đa 5 CV / tài khoản**. Đủ cho 1 người tạo các phiên bản CV khác nhau (ví dụ: 1 bản tiếng Việt, 1 bản tiếng Anh, 1 bản cho Frontend, 1 bản cho Full-stack, 1 bản nháp).
  - **Lựa chọn B**: **Tối đa 10 CV / tài khoản**.
  - **Lựa chọn C**: **Không giới hạn** (Chỉ cảnh báo khi tạo quá nhiều).
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (Tối đa 5 CV)**. Đây là con số tiêu chuẩn của các nền tảng tạo CV quốc tế ở gói miễn phí.
- **✅ Quyết định chính thức**: **CHỌN PHƯƠNG ÁN A (Tối đa 5 CV)**.

---

### CÂU HỎI 3: Cửa sổ thời gian Khử trùng lặp lượt xem (Deduplication Window)
- **Bối cảnh**: Khi một người xem truy cập lại cùng một link CV thì sau bao lâu mới tính thêm 1 lượt xem mới?
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **30 phút** (Lưu trong `sessionStorage` kết hợp timestamp).
  - **Lựa chọn B**: **24 giờ** (Lưu trong `localStorage`).
  - **Lựa chọn C**: **Chỉ tính 1 lần duy nhất trong toàn bộ phiên trình duyệt** (Chỉ xóa khi đóng tab/trình duyệt).
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (30 phút)**. Phản ánh đúng hành vi tuyển dụng (nhà tuyển dụng đọc xong, 30 phút sau quay lại so sánh hồ sơ được tính là 1 phiên quan tâm mới).
- **✅ Quyết định chính thức**: **CHỌN PHƯƠNG ÁN A (30 phút)**.

---

### CÂU HỎI 4: Chính sách Xóa dữ liệu (Hard Delete vs Soft Delete)
- **Bối cảnh**: Khi một hồ sơ CV hoặc tài khoản người dùng bị xóa hoặc vi phạm, hệ thống nên xóa hẳn khỏi database hay chỉ đánh dấu vô hiệu hóa?
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị bắt buộc)**: **SOFT DELETE TUYỆT ĐỐI ("XÓA = TẮT")**. Đổi `status: 'disabled'`, giữ nguyên dữ liệu gốc và tự động đồng bộ cờ `ownerDisabled: true` trên tất cả CV để loại khỏi trang chủ/trang duyệt tức thì.
  - **Lựa chọn B**: **HARD DELETE (XÓA VẬT LÝ)**. Gọi `deleteDoc()` xóa hoàn toàn khỏi Firestore.
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (Soft Delete tuyệt đối)**. Bảo vệ vết kiểm toán (Audit Trail), có thể khôi phục khi khiếu nại nhầm, và bảo vệ an toàn cho hệ thống.
- **✅ Quyết định chính thức**: **CHỌN PHƯƠNG ÁN A (Soft Delete tuyệt đối)**.

---

### CÂU HỎI 5: Cơ chế Phục hồi Khẩn cấp cho Quyền Quản trị viên Tối cao (Super Admin)
- **Bối cảnh**: Nếu lỡ tay xóa nhầm tài khoản trong collection `admins` trên Firestore, làm sao để người sáng lập lấy lại quyền mà không cần truy cập sâu vào hạ tầng cloud?
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị bắt buộc)**: **FAIL-SAFE EMAIL WHITELIST CỨNG TRONG SECURITY RULES**. Ghi nhận email chính chủ `thanhanhkhoi.work@gmail.com` kèm xác thực `email_verified == true`.
  - **Lựa chọn B**: **Chỉ dựa hoàn toàn vào collection `admins`** (Rủi ro nếu bị xóa nhầm là mất quyền hoàn toàn).
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (Fail-safe Email Whitelist)**. Đây là phao cứu sinh bất khả xâm phạm của người sáng lập hệ thống.
- **✅ Quyết định chính thức**: **CHỌN PHƯƠNG ÁN A (Fail-safe Email Whitelist)**.

---

### CÂU HỎI 6: Bảo vệ Quyền riêng tư của Ứng viên trên CV Công khai
- **Bối cảnh**: Khi người dùng bật Public CV thì Số điện thoại và Email cá nhân có nên hiển thị trần trụi hay cần che bớt (masking) để chống bot cào dữ liệu?
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị cho MVP)**: **GIỮ HIỂN THỊ ĐẦY ĐỦ NHƯ HIỆN TẠI KÈM NHÃN NHẮC NHỞ TRONG EDITOR**. Nếu người dùng chủ động điền thì hiển thị, nếu để trống thì tự động ẩn. Thêm cảnh báo nhẹ: "Thông tin này sẽ công khai khi bạn chia sẻ link".
  - **Lựa chọn B**: **BẮT BUỘC CHE MỘT PHẦN** (Ví dụ: `0912 *** 678`, `th***@gmail.com`), muốn xem đầy đủ phải bấm "Hiện thông tin" kèm captcha.
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A cho MVP**. Đơn giản, thực tế, giữ trọn vẹn thẩm mỹ của bản in CV A4.
- **✅ Quyết định chính thức**: **CHỌN PHƯƠNG ÁN A (Giữ hiển thị đầy đủ + nhãn nhắc nhở)**.

---

### CÂU HỎI 7: Tên đường dẫn URL cho Trang Duyệt CV Riêng Biệt
- **Bối cảnh**: Tách danh bạ khám phá CV ra khỏi Trang chủ thì nên đặt tên route là gì để chuẩn SEO và chuyên nghiệp?
- **Các lựa chọn**:
  - **Lựa chọn A (Khuyến nghị)**: **`/explore`** (Khám phá hồ sơ chuyên nghiệp — Khớp với nút "Khám Phá Hồ Sơ" hiện có trên Navbar).
  - **Lựa chọn B**: **`/cvs`** (Danh sách CV).
  - **Lựa chọn C**: **`/directory`** (Danh bạ ứng viên).
- **👉 Khuyến nghị của Kiến trúc sư**: **CHỌN PHƯƠNG ÁN A (`/explore`)**.
- **✅ Quyết định chính thức**: **CHỌN PHƯƠNG ÁN A (`/explore`)**.

---

### CÂU HỎI 8: Phương án Xử lý Cơ sở Dữ liệu cho Schema Mới
- **Bối cảnh**: Toàn bộ CV hiện tại trên Firestore chưa có trường `viewCount`, `status`, `ownerDisabled`, `category`. Nếu không có các trường này, câu truy vấn sắp xếp `orderBy('viewCount')` và bộ lọc ngành nghề sẽ không hoạt động đồng nhất.
- **Các lựa chọn**:
  - **Lựa chọn A**: **CHẠY SCRIPT MIGRATION TỰ ĐỘNG BẢO TOÀN DỮ LIỆU CŨ**. Script quét qua các document, chỉ gán giá trị mặc định cho các trường đang bị thiếu.
  - **Lựa chọn B (Chủ dự án phê duyệt)**: **RESET VÀ KHỞI TẠO LẠI TOÀN BỘ CƠ SỞ DỮ LIỆU TỪ ĐẦU (CLEAN DB RESET & SEED)**.
    *Căn cứ quyết định*: Dữ liệu hiện tại trên Firestore hoàn toàn là dữ liệu mẫu thử nghiệm (mock/sample data). Việc dọn sạch dữ liệu cũ và khởi tạo từ đầu bằng script chuẩn hóa giúp:
    1. Cơ sở dữ liệu sạch 100%, không tồn dư tài liệu rác hay xung đột schema.
    2. Nạp sẵn bộ hồ sơ mẫu tiêu biểu đa dạng ngành nghề (`tech`, `design`, `data-ai`, `marketing`, `business`, `hr`, `other`) đã có sẵn số lượt xem ban đầu phong phú, thẩm mỹ cao.
    3. Tránh việc phải duy trì logic backward-compatibility rườm rà cho dữ liệu thử nghiệm.
- **✅ Quyết định chính thức**: **CHỌN PHƯƠNG ÁN B (Reset & Recreate Clean Database từ đầu)** theo đúng chỉ đạo phê duyệt của Chủ dự án.
