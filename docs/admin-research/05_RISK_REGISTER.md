# BẢNG QUẢN TRỊ RỦI RO TOÀN DIỆN (RISK REGISTER)
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày lập**: 16/10/2026  
**Quy mô**: 30 rủi ro được nhận diện và kiểm soát

---

## BẢNG ĐỐI SOÁT 30 RỦI RO KỸ THUẬT

| Mã Rủi Ro | Mô Tả Rủi Ro Chi Tiết | Phân Loại | Khả Năng | Mức Ảnh Hưởng | Biện Pháp Phòng Ngừa Kỹ Thuật | Phương Pháp Kiểm Thử Phát Hiện |
|:---:|:---|:---:|:---:|:---:|:---|:---|
| **RSK-01** | Người xem bấm F5 liên tục làm tăng vọt lượt xem ảo | Logic | Cao | Cao | Khử trùng lặp bằng `sessionStorage` 30 phút; Security Rules chỉ cho phép `+1`. | Viết unit test giả lập click 5 lần liên tiếp. |
| **RSK-02** | React 18 StrictMode kích hoạt `useEffect` 2 lần làm đếm x2 lượt xem | Logic | Rất Cao | Trung bình | Dùng `hasIncrementedRef = useRef(false)` trong hook. | Kiểm tra Network tab trong môi trường `npm run dev`. |
| **RSK-03** | Chủ CV tự xem hồ sơ của mình làm tăng lượt xem | Logic | Cao | Trung bình | So sánh `user?.uid === cv.userId`, bỏ qua nếu trùng. | Test đăng nhập và truy cập CV của chính mình. |
| **RSK-04** | Tăng `viewCount` làm cập nhật `updatedAt`, gây đè bản nháp local | Logic / Dữ liệu | Cao | **Nghiêm trọng (P0)** | Chỉ update duy nhất trường `viewCount: increment(1)`, không gửi `updatedAt`. | So sánh `updatedAt` trước và sau khi xem CV. |
| **RSK-05** | Document CV cũ thiếu trường `viewCount` bị query `orderBy` bỏ rơi | Dữ liệu | Chắc chắn | **Nghiêm trọng (P0)** | Chạy script migration gán `viewCount: 0` cho toàn bộ document cũ. | Truy vấn CV cũ trước và sau khi chạy script migration. |
| **RSK-06** | Thiếu Composite Index gây lỗi sập trang (Runtime Error) | Triển khai | Cao | **Nghiêm trọng (P0)** | Khai báo 6 composite index trong `firestore.indexes.json` và deploy trước. | Kiểm tra log console trình duyệt khi lọc và sắp xếp. |
| **RSK-07** | Phân trang Cursor bị lệch khi có document mới được chèn giữa chừng | Logic | Trung bình | Thấp | Dùng tie-break `updatedAt DESC` và snapshot con trỏ `startAfter(docSnapshot)`. | Thêm document mới khi đang duyệt danh sách. |
| **RSK-08** | Khóa User nhưng CV của họ vẫn xuất hiện trên trang chủ | Dữ liệu / Logic | Cao | Cao | Dùng Batched Write cập nhật `ownerDisabled: true` trên toàn bộ CV của họ. | Khóa tài khoản test và kiểm tra ngay trang chủ. |
| **RSK-09** | Kẻ xấu mở DevTools tự gửi request nâng role admin | Bảo mật | Cao | **Nghiêm trọng (P0)** | Security Rules khóa `affectedKeys().hasAny(['role', 'status', 'isAdmin'])`. | Test Unit Emulator với request giả mạo từ user thường. |
| **RSK-10** | Kẻ xấu sửa trường `viewCount` thành 1,000,000 | Bảo mật | Trung bình | Cao | Rules bắt buộc: `request.resource.data.viewCount == resource.data.viewCount + 1`. | Thử gửi request `viewCount: 9999` trên Postman/SDK. |
| **RSK-11** | User vãng lai đọc trộm CV riêng tư (`isPublic: false`) | Bảo mật | Cao | **Nghiêm trọng (P0)** | Rules: `allow read: if resource.data.isPublic == true || isOwner() || isAdmin()`. | Thử truy cập ID CV private bằng tài khoản nặc danh. |
| **RSK-12** | Kẻ xấu tự ý chèn hoặc sửa nhật ký kiểm toán `auditLogs` | Bảo mật | Trung bình | Cao | Rules: `allow update, delete: if false;`, `allow create: if isAdmin()`. | Dùng client SDK thử gọi `deleteDoc(doc(db, 'auditLogs', id))`. |
| **RSK-13** | Admin vô tình tự khóa tài khoản của chính mình | Logic / Vận hành | Thấp | Cao | Kiểm tra ở UI và Rules: Cấm disable nếu `userId == request.auth.uid`. | Thử bấm nút khóa trên chính dòng tài khoản đang đăng nhập. |
| **RSK-14** | Hạ quyền Admin cuối cùng làm hệ thống mồ côi không ai quản trị | Logic / Vận hành | Thấp | **Nghiêm trọng (P0)** | Kiểm tra số lượng admin $\ge 2$ mới cho phép hạ quyền. | Thử xóa admin duy nhất còn lại trên hệ thống. |
| **RSK-15** | Token JWT của user bị khóa vẫn còn sống tối đa 1 giờ | Bảo mật | Chắc chắn | Trung bình | Security Rules kiểm tra trạng thái document `users/{uid}` ở mỗi request ghi. | Thử ghi dữ liệu ngay sau khi bị khóa trong Firestore. |
| **RSK-16** | Ghi log thất bại nhưng hành động khóa user vẫn thành công | Dữ liệu | Trung bình | Trung bình | Đóng gói cả 2 thao tác vào một `writeBatch` nguyên tử (Atomic Commit). | Giả lập lỗi ghi log để kiểm tra tính toàn vẹn rollback. |
| **RSK-17** | Tìm kiếm tiếng Việt có dấu/không dấu không ra kết quả | Logic | Cao | Trung bình | Dùng tiện ích `removeVietnameseTones()` chuẩn hóa từ khóa và dữ liệu. | Tìm kiếm "nguyen" với kết quả "Nguyễn Văn A". |
| **RSK-18** | Tên ứng viên hoặc chức danh quá dài làm vỡ lưới thẻ | UI / Layout | Cao | Trung bình | Áp dụng `truncate`, `line-clamp-2` và `break-words` trên component thẻ. | Nhập tên 150 ký tự không khoảng trắng để kiểm tra hiển thị. |
| **RSK-19** | Ảnh đại diện bị hỏng (Broken Image) để lại khoảng trắng | UI / Layout | Trung bình | Thấp | Gán thuộc tính `onError` tự động fallback về ảnh mặc định SVG. | Nhập đường link ảnh 404 để kiểm tra fallback. |
| **RSK-20** | Bảng quản trị tràn ngang trên màn hình điện thoại di động | UI / Layout | Cao | Trung bình | Tự động chuyển bảng sang dạng thẻ xếp chồng (Stacked Cards) trên mobile. | Thu nhỏ màn hình trình duyệt xuống 360px và 375px. |
| **RSK-21** | Modal xác nhận bị che khuất bởi navbar hoặc menu khác | UI / Layout | Trung bình | Trung bình | Gán `z-50`, backdrop mờ `bg-slate-900/60` và render tại Root Portal. | Mở modal trên nhiều trang và kiểm tra độ phủ. |
| **RSK-22** | Thanh bộ lọc dính (Sticky Filter Bar) đè lên nội dung bên dưới | UI / Layout | Trung bình | Thấp | Bổ sung `top-16`, `backdrop-blur-md` và khoảng đệm `pt-4`. | Cuộn trang nhanh trên mobile và desktop. |
| **RSK-23** | Nhảy bố cục (CLS) khi tải trang do thẻ CV không cố định chiều cao | Hiệu năng / UX | Cao | Trung bình | Định hình khung Skeleton Card có kích thước chuẩn bằng với thẻ thật. | Đo chỉ số CLS trên công cụ Lighthouse ($\le 0.1$). |
| **RSK-24** | Dark mode bị tương phản kém (chữ xám trên nền tối) | UI / WCAG | Trung bình | Trung bình | Kiểm tra bảng màu bằng thuật toán WCAG 2.1 (đạt tỷ lệ $\ge 4.5:1$). | Chạy extension axe DevTools kiểm tra a11y. |
| **RSK-25** | Nhấp chuột đúp (Double-click) gửi 2 request khóa liên tiếp | UI / Logic | Cao | Trung bình | Vô hiệu hóa nút và hiện spinner `Loader2` ngay khi click lần đầu. | Bấm chuột liên tục với tốc độ cao vào nút xác nhận. |
| **RSK-26** | Vòng lặp đọc vô hạn Firestore do lắng nghe listener `onSnapshot` sai | Chi phí | Thấp | **Nghiêm trọng (P0)** | Chỉ dùng `getDocs()` một lần, hủy toàn bộ listener trong cleanup `useEffect`. | Theo dõi Network tab không có polling liên tục. |
| **RSK-27** | Bundle Admin phình to làm chậm trang chủ của khách | Hiệu năng | Trung bình | Cao | Tách chunk bằng `React.lazy()` và cấu hình `manualChunks` trong Vite. | Chạy `npm run build` kiểm tra kích thước entry JS $\le 35\text{ kB}$. |
| **RSK-28** | Rò rỉ mã tag HTML độc hại trong đoạn văn bản tóm tắt (XSS) | Bảo mật | Cao | **Nghiêm trọng (P0)** | Sử dụng `DOMPurify` làm sạch trước khi inject vào DOM. | Thử chèn chuỗi `<img src=x onerror=alert(1)>`. |
| **RSK-29** | Thay đổi Rules làm hỏng chức năng đang chạy của ứng viên | Triển khai | Trung bình | **Nghiêm trọng (P0)** | Chạy bộ test Emulator trước khi deploy rules lên Firebase thật. | Chạy toàn bộ 102 unit test hiện tại sau khi đổi rules. |
| **RSK-30** | Script migration dữ liệu bị lỗi giữa chừng gây hỏng database | Dữ liệu | Thấp | **Nghiêm trọng (P0)** | Script có chế độ Dry-Run, chạy theo lô batch 500 docs, có sao lưu trước. | Chạy thử nghiệm trên Firebase Emulator trước khi chạy production. |
