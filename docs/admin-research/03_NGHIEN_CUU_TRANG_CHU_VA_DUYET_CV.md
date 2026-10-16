# NGHIÊN CỨU TRANG CHỦ "TOP XEM NHIỀU" & TRANG DUYỆT CV RIÊNG (`/explore`)
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày thực hiện**: 16/10/2026  
**Trạng thái**: Giai đoạn 0 — Nghiên cứu & Thiết kế Kiến trúc (Approved for Review)

---

## 1. TÁI CẤU TRÚC TRANG CHỦ: SHOWCASE TOP 6 CV XEM NHIỀU NHẤT

### 1.1. Hiện trạng và Sự cần thiết phải thay đổi
- **Hiện trạng nguy hiểm**: Trang chủ hiện tại đang gọi `query(collection(db, 'cvs'), where('isPublic', '==', true))` không có giới hạn `limit()`. Mỗi lượt khách vào trang chủ sẽ đọc sạch sành sanh toàn bộ CV public trong database. Với 1,000 lượt truy cập/ngày và 500 CV public, hệ thống sẽ ngốn 500,000 lượt đọc (vượt gấp 10 lần hạn ngạch miễn phí 50,000 đọc/ngày của gói Spark)!
- **Giải pháp**: Trang chủ **CHỈ TẢI ĐÚNG TOP 6 CV** (hoặc Top 8) có lượt xem cao nhất, kèm nút nổi bật **"Khám Phá Toàn Bộ Danh Bạ"** dẫn sang trang `/explore`.

### 1.2. Đặc tả Truy vấn & Xử lý mọi trường hợp biên (Edge Cases)
- **Câu truy vấn Firestore**:
  ```ts
  const qTopCVs = query(
    collection(db, 'cvs'),
    where('isPublic', '==', true),
    where('status', '==', 'active'),
    where('ownerDisabled', '==', false),
    orderBy('viewCount', 'desc'),
    orderBy('updatedAt', 'desc'), // Tie-break 1
    limit(6)
  );
  ```
- **Xử lý các tình huống biên**:
  1. *Ít hơn 6 CV public*: Hiển thị toàn bộ số CV hiện có; tự động bổ sung thẻ gợi ý "Trở thành người tiếp theo tỏa sáng tại đây" dẫn vào tạo CV.
  2. *Nhiều CV có cùng lượt xem (Tie-break)*: Sắp xếp phụ theo `updatedAt DESC` (ưu tiên hồ sơ cập nhật mới hơn), nếu vẫn trùng thì sắp xếp theo `id ASC` để danh sách không bị nhảy lung tung khi render lại.
  3. *Tất cả CV đều có lượt xem = 0*: Nhờ có tie-break `updatedAt DESC`, hệ thống tự động hiển thị 6 CV mới nhất.
  4. *Chưa có bất kỳ CV public nào*: Hiển thị Empty State truyền cảm hứng với hình minh họa và nút CTA "Tạo CV Chuyên Nghiệp Đầu Tiên Của Bạn".
  5. *Đang tải*: Hiển thị 6 khung Skeleton Card có kích thước cố định để loại trừ hiện tượng giật layout (Cumulative Layout Shift - CLS = 0).
  6. *Lỗi mạng*: Hiển thị thông báo thân thiện kèm nút "Thử lại" (Retry).
  7. *Tối ưu hóa bộ nhớ đệm (Cache)*: Lưu kết quả vào `sessionStorage` (`cv_studio_top_cache`) với TTL 10 phút. Nếu người dùng quay lại trang chủ trong vòng 10 phút, không tốn thêm bất kỳ lượt đọc Firestore nào!

---

## 2. THIẾT KẾ TRANG DUYỆT CV RIÊNG BIỆT (`/explore`)

### 2.1. Phân tích thực tế về Tìm kiếm trong Firestore
> [!NOTE]
> **Giới hạn kỹ thuật của Cloud Firestore:**  
> Firestore **KHÔNG HỖ TRỢ** tìm kiếm toàn văn bản (Full-text search) và **KHÔNG CÓ** toán tử tìm kiếm chuỗi con (substring search như `LIKE '%abc%'` trong SQL).

#### So sánh các phương án tìm kiếm:
1. *Phương án A: Array Contains với trường `searchKeywords`*:
   - Tách họ tên, chức danh và kỹ năng thành mảng các từ khóa thường không dấu: `['nguyen', 'thanh', 'truc', 'react', 'frontend']`.
   - Dùng query: `where('searchKeywords', 'array-contains', searchTerm)`.
   - *Ưu điểm*: Tìm được chính xác từ khóa, chi phí rẻ.
   - *Nhược điểm*: Chỉ tìm được từng từ đơn lẻ, không tìm được cụm từ ghép phức tạp.
2. *Phương án B: Lọc tiền tố (Prefix Range Query)*:
   - Dùng `where('name_lower', '>=', q).where('name_lower', '<=', q + '\uf8ff')`.
   - *Nhược điểm*: Chỉ tìm được ở đầu chuỗi (ví dụ: gõ "Trần" ra "Trần Anh Khôi", nhưng gõ "Khôi" sẽ không ra).
3. *Phương án C: Tải trang phân đoạn (Cursor Batch 24) kết hợp Tìm kiếm Client-Side (Khuyến nghị cho MVP)*:
   - Tải danh sách theo đợt 24 CV có lọc theo Danh mục (`category`) và Sắp xếp (`sort`).
   - Tìm kiếm tức thì trên tập dữ liệu đã tải bằng hàm chuẩn hóa tiếng Việt `removeVietnameseTones()` (gõ "truc" ra "Trúc", "ky su" ra "Kỹ sư").

### 2.2. Phân loại Ngành nghề (Category Filter)
Bổ sung trường `category: CVCategory` vào schema CV với 7 danh mục tuyển chọn:
- `tech`: Công Nghệ Thông Tin & Phần Mềm
- `design`: Thiết Kế Sáng Tạo, UI/UX & Đồ Họa
- `data-ai`: Dữ Liệu, AI & Khoa Học Máy Tính
- `marketing`: Tiếp Thị, Truyền Thông & Nội Dung
- `business`: Kinh Doanh, Bán Hàng & Tài Chính
- `hr`: Nhân Sự, Quản Trị & Hành Chính
- `other`: Lĩnh Vực Khác

### 2.3. Bảng Composite Indexes Bắt Buộc (Khai báo trong `firestore.indexes.json`)
Khi kết hợp nhiều điều kiện `where` và `orderBy`, Firestore **bắt buộc phải có Composite Index**. Nếu thiếu, ứng dụng sẽ quăng lỗi Runtime `FirebaseError: The query requires an index`.

| STT | Collection | Các trường cấu thành Index | Chiều sắp xếp | Mục đích sử dụng |
|:---:|:---|:---|:---:|:---|
| **1** | `cvs` | `isPublic`, `status`, `ownerDisabled`, `viewCount`, `updatedAt` | ASC, ASC, ASC, **DESC**, **DESC** | **Trang Chủ: Top xem nhiều nhất** |
| **2** | `cvs` | `isPublic`, `status`, `ownerDisabled`, `updatedAt` | ASC, ASC, ASC, **DESC** | **Trang Duyệt: Mới cập nhật nhất** |
| **3** | `cvs` | `isPublic`, `status`, `ownerDisabled`, `createdAt` | ASC, ASC, ASC, **DESC** | **Trang Duyệt: Mới tạo nhất** |
| **4** | `cvs` | `isPublic`, `status`, `ownerDisabled`, `category`, `viewCount`, `updatedAt` | ASC, ASC, ASC, ASC, **DESC**, **DESC** | **Trang Duyệt: Lọc theo ngành + Xem nhiều** |
| **5** | `cvs` | `isPublic`, `status`, `ownerDisabled`, `category`, `updatedAt` | ASC, ASC, ASC, ASC, **DESC** | **Trang Duyệt: Lọc theo ngành + Mới nhất** |
| **6** | `cvs` | `userId`, `status`, `updatedAt` | ASC, ASC, **DESC** | **Dashboard Cá Nhân: Danh sách CV của tôi** |

### 2.4. Phân trang bằng Cursor (`startAfter`)
- **Nguyên tắc**: **TUYỆT ĐỐI CẤM DÙNG OFFSET**. Offset trong Firestore vẫn tính phí đọc toàn bộ các document bị bỏ qua!
- **Cơ chế Cursor chuẩn**:
  - Tải lô đầu tiên: `limit(24)`. Lưu lại snapshot document cuối cùng `lastDocSnapshot`.
  - Khi bấm "Tải thêm" (Load More): `startAfter(lastDocSnapshot).limit(24)`.
  - Khi người dùng đổi bộ lọc ngành hoặc tiêu chí sắp xếp: Tự động xóa danh sách cũ, reset `lastDocSnapshot = null`, tải lại từ trang 1 và cuộn mượt lên đầu trang (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
  - Hết dữ liệu: Khi đợt tải trả về `< 24` kết quả $\rightarrow$ Đặt `hasMore = false`, hiển thị thông báo "Bạn đã xem hết hồ sơ trong danh mục này".
- **Đồng bộ URL Query String**:
  - Mọi trạng thái lọc và sắp xếp tự động phản chiếu lên URL: `/explore?category=tech&sort=views&q=react`.
  - Giúp người dùng có thể sao chép đường link gửi cho bạn bè hoặc nhấn nút Back/Forward của trình duyệt mà không bị mất bộ lọc.

---

## 3. QUY TẮC HIỂN THỊ CỐT TỬ: ĐỒNG BỘ CỜ KHÓA TÀI KHOẢN (NO-JOIN FILTERING)

*Vấn đề kỹ thuật: Firestore là cơ sở dữ liệu NoSQL, không hỗ trợ lệnh `JOIN` giữa collection `cvs` và `users`.*

### Giải pháp kỹ thuật:
- Nếu chỉ kiểm tra `cv.status == 'active'`, khi một User lừa đảo bị Admin khóa tài khoản (`user.status = 'disabled'`), các CV của họ vẫn có thể hiện diện trên trang chủ nếu không có cơ chế liên kết!
- **Thiết kế denormalization trường `ownerDisabled: boolean` trên từng CV**:
  - Khi Admin bấm **"Khóa Người Dùng"**, hệ thống thực hiện một `writeBatch`:
    1. Đổi `users/{uid}` $\rightarrow$ `status: 'disabled'`.
    2. Quét toàn bộ CV của user đó, gán `ownerDisabled: true`.
    3. Ghi một bản ghi vào `auditLogs`.
    4. `commit()` toàn bộ trong 1 transaction nguyên tử.
- **Kết quả**: Tất cả các câu truy vấn Trang Chủ và Trang Duyệt chỉ cần thêm điều kiện `where('ownerDisabled', '==', false)` là ngay lập tức loại bỏ 100% hồ sơ của tài khoản bị khóa mà không cần tốn thêm bất kỳ lượt đọc join nào!

---

## 4. BẢNG ƯỚC TÍNH CHI PHÍ ĐỌC FIRESTORE (QUOTA PLANNING)

*Hạn ngạch gói Spark miễn phí: 50,000 lượt đọc / ngày (50k reads/day)*

| Kịch bản quy mô hệ thống | Cơ chế cũ (Đọc toàn bộ không limit) | Cơ chế mới (Top 6 + Phân trang 24 + SWR Cache) | Mức độ an toàn hạn ngạch |
|:---|:---:|:---:|:---:|
| **100 CV public**<br>*(1,000 lượt vào trang chủ/ngày)* | 100,000 reads/ngày $\rightarrow$ **VƯỢT QUOTA 200% (Sập web)** | ~1,200 reads/ngày | ✅ Cực kỳ an toàn (Chỉ dùng 2.4% quota) |
| **1,000 CV public**<br>*(3,000 lượt vào trang chủ/ngày)* | 3,000,000 reads/ngày $\rightarrow$ **VƯỢT QUOTA 6000%** | ~3,600 reads/ngày | ✅ Rất an toàn (Chỉ dùng 7.2% quota) |
| **10,000 CV public**<br>*(5,000 lượt trang chủ + 500 lượt duyệt)* | 50,000,000 reads/ngày $\rightarrow$ **Chi phí khổng lồ** | ~18,000 reads/ngày | ✅ Vẫn nằm trọn vẹn trong gói miễn phí 0 đồng! |

---

## 5. DANH SÁCH TÁC ĐỘNG TỚI MÃ NGUỒN HIỆN CÓ (REGRESSION PREVENTION)

| Tệp mã nguồn | Trạng thái | Nội dung thay đổi dự kiến | Rủi ro & Cách phòng ngừa |
|:---|:---:|:---|:---|
| `frontend/src/pages/HomePage.tsx` | SỬA | Thu gọn phần showcase chỉ lấy 6 CV xem nhiều nhất, thêm nút "Xem thêm", đổi CTA sang route `/explore`. | Dùng chung `ProfileCard`, không viết lại component thẻ. |
| `frontend/src/pages/ExplorePage.tsx` | TẠO MỚI | Trang duyệt danh bạ độc lập, thanh tìm kiếm debounce 300ms, bộ lọc ngành sticky, phân trang Cursor `startAfter`. | Tách chunk riêng bằng `React.lazy()`, không phình bundle chính. |
| `frontend/src/services/cvStorageService.ts` | SỬA | Bổ sung hàm `getTopViewedCVs(limitCount = 6)` và `getExploreCVs(filter, cursor)`. | Giữ nguyên các hàm cũ để không ảnh hưởng trang xem chi tiết và dashboard. |
| `frontend/src/types/cv.ts` | SỬA | Mở rộng kiểu dữ liệu `CVData` thêm `viewCount`, `status`, `ownerDisabled`, `category`. | Đặt giá trị mặc định tùy chọn `?` để tương thích ngược 100% với dữ liệu cũ. |
| `firestore.indexes.json` | TẠO MỚI | Khai báo 6 composite index chuẩn. | Deploy indexes lên Firebase trước khi chạy code query mới. |
