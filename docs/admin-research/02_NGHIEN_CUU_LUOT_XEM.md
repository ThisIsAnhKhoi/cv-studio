# NGHIÊN CỨU ĐỘNG CƠ ĐẾM LƯỢT XEM (VIEW COUNTER ENGINE)
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày thực hiện**: 16/10/2026  
**Trạng thái**: Giai đoạn 0 — Nghiên cứu & Thiết kế Kiến trúc (Approved for Review)

---

## 1. ĐỊNH NGHĨA "MỘT LƯỢT XEM HỢP LỆ" (VALID VIEW SPECIFICATION)

Để số liệu lượt xem phản ánh chân thực độ quan tâm của nhà tuyển dụng và cộng đồng, một lượt xem được định nghĩa như sau:

| Tiêu chí | Quy tắc áp dụng | Lý do kỹ thuật |
|:---|:---|:---|
| **Ai được tính?** | - Khách vãng lai (Guest)<br>- Người dùng khác đã đăng nhập | Người xem thực tế từ bên ngoài |
| **Ai KHÔNG được tính?** | - **Chủ sở hữu của chính CV đó** (`user?.uid === cv.userId`)<br>- Quản trị viên khi vào duyệt nội dung | Tránh tình trạng chủ CV tự F5 "cày view" cho hồ sơ của mình |
| **Khi nào được tính?** | Khi trang chi tiết CV (`/cv/:id` hoặc `/u/:id`) đã tải và hiển thị hoàn tất (`useEffect` sau mount) | **Tuyệt đối KHÔNG tính** khi lướt qua thẻ tóm tắt ở Trang chủ hay Trang tìm kiếm |
| **Trạng thái CV hợp lệ** | Bắt buộc `isPublic === true` VÀ `status === 'active'` | CV đang ẩn hoặc bị khóa vi phạm không được ghi nhận lượt xem |
| **Lọc Bot / Crawler** | Kiểm tra `navigator.webdriver` hoặc userAgent cơ bản (Googlebot, Bingbot, HeadlessChrome) | Loại bỏ lượt xem ảo từ công cụ tìm kiếm tự động |

---

## 2. CƠ CHẾ KHỬ TRÙNG LẶP & PHÒNG CHỐNG GIAN LẬN (DEDUPLICATION)

### 2.1. Cửa sổ Khử trùng lặp (Deduplication Window)
- **Phương án chọn**: Sử dụng `sessionStorage` kết hợp Timestamp:
  - Khóa lưu trữ: `cv_studio_viewed_${cvId}`.
  - Giá trị lưu: Timestamp thời điểm xem gần nhất (ví dụ `1729112400000`).
  - **Cửa sổ thời gian (Time window)**: **30 phút**.
  - *Cơ chế*: Khi người xem vào trang, nếu key đã tồn tại và `Date.now() - viewedAt < 30 * 60 * 1000` $\rightarrow$ Bỏ qua, không gửi request tăng view lên Firestore.
- **Tránh đếm 2 lần trong môi trường Dev (React 18 StrictMode)**:
  - Trong React 18, `useEffect` chạy 2 lần khi dev. Sử dụng cờ ref `hasIncrementedRef = useRef(false)` trong hook `useCVViewCount` để ngăn chặn triệt để việc bắn 2 request đồng thời.

### 2.2. Giới hạn trung thực của bộ đếm phía Client
> [!WARNING]
> **Tuyên bố trung thực về bảo mật Client-Side Counter:**  
> Bất kỳ bộ đếm nào do client kích hoạt mà không có máy chủ backend xác thực (như Cloud Functions / App Check) đều có khả năng bị một lập trình viên cố tình can thiệp bằng script gọi liên tục.
> 
> **Biện pháp giảm thiểu tối đa ở tầng Security Rules:**
> 1. Rules bắt buộc giá trị mới phải **chính xác bằng giá trị cũ + 1** (`request.resource.data.viewCount == resource.data.viewCount + 1`).
> 2. Chặn đứng kẻ xấu sửa `viewCount` thành một con số tùy ý (ví dụ nhảy từ 10 lên 1,000,000).
> 3. Rules cấm người ngoài sửa bất kỳ trường nào khác ngoài `viewCount`.

---

## 3. SO SÁNH CÁC MÔ HÌNH LƯU TRỮ BỘ ĐẾM FIRESTORE

| Phương án kỹ thuật | Cơ chế hoạt động | Chi phí Đọc/Ghi | Ưu điểm | Nhược điểm & Rủi ro |
|:---|:---|:---:|:---|:---|
| **Phương án A: Field `viewCount` trực tiếp trên document `cvs/{cvId}`** | Lưu trực tiếp `viewCount: number` trên CV doc, dùng `updateDoc(..., { viewCount: increment(1) })` | 1 write / view | **Cực kỳ đơn giản; query `orderBy('viewCount', 'desc')` trực tiếp trên collection `cvs` mà không cần join hay đọc 2 collection.** | Giới hạn ghi mềm của Firestore là ~1 write/giây/document (nếu có đột biến hàng trăm lượt xem/giây sẽ bị nghẽn). |
| **Phương án B: Collection `cvStats/{cvId}` tách riêng** | Tách hẳn dữ liệu thống kê sang document riêng | 1 write / view + 1 read / view | Tách rời hoàn toàn quyền ghi với document CV chính; không lo ảnh hưởng CV doc. | **Gây thảm họa query**: Trang chủ không thể sắp xếp Top CV nếu không đọc cả 2 collection hoặc sao chép dữ liệu. |
| **Phương án C: Sharded Counter (Bộ đếm phân mảnh)** | Chia nhỏ 10 shards per CV, ghi ngẫu nhiên 1 shard, cộng tổng khi đọc | 1 write + 10 reads khi lấy tổng | Chịu tải hàng ngàn view/giây | Quá phức tạp cho quy mô MVP; tăng gấp 10 lần chi phí đọc. |
| **Phương án D: Ghi sự kiện thô + Cloud Functions** | Ghi log `cvViews/{id}`, Function tính tổng định kỳ | Rất tốn kém lượt ghi | Chính xác 100%, chống gian lận tuyệt đối | Bắt buộc gói Blaze; chi phí cao; độ trễ cập nhật lớn. |

### 👉 KHUYẾN NGHỊ: CHỌN PHƯƠNG ÁN A CHO QUY MÔ HIỆN TẠI
- **Lý do**:
  - Với một nền tảng portfolio cá nhân, một CV nhận 1 lượt xem/giây đã là con số rất lớn (tương đương 86,400 lượt xem/ngày). Giới hạn 1 ghi/giây của 1 document Firestore hoàn toàn đáp ứng xuất sắc.
  - Giữ trường `viewCount` trực tiếp trên `cvs/{cvId}` cho phép tạo Composite Index `(isPublic ASC, status ASC, viewCount DESC, updatedAt DESC)` để truy vấn Top CV xem nhiều nhất một cách tức thì và tiết kiệm nhất.
- **Ngưỡng nâng cấp (Upgrade Threshold)**: Chỉ khi nào một CV có lưu lượng truy cập thực tế vượt quá 50 lượt xem/phút liên tục, hệ thống mới cần chuyển đổi sang Sharded Counter.

---

## 4. QUY TẮC CỐT TỬ: TĂNG `viewCount` TUYỆT ĐỐI KHÔNG SỬA `updatedAt`

*Phân tích Rủi ro Kỹ thuật #6: Xung đột giữa Auto-Save và Timestamp LocalStorage*

> [!IMPORTANT]
> **NGUY CƠ XUNG ĐỘT DỮ LIỆU NGHIÊM TRỌNG:**  
> Trong `useCVStore.ts`, cơ chế đồng bộ dựa vào so sánh timestamp `updatedAt`. Nếu mỗi lần có người xem CV mà hệ thống cập nhật cả `updatedAt`:
> 1. Bản nháp cục bộ (Local draft) của ứng viên trên máy họ sẽ bị coi là "cũ hơn" dữ liệu trên Cloud.
> 2. Khi ứng viên mở trình soạn thảo, nội dung mới họ đang viết dở ở local có nguy cơ bị ghi đè bởi bản tải từ Cloud!
> 3. Lịch sử chỉnh sửa hồ sơ bị sai lệch (CV không sửa gì nội dung nhưng ngày sửa đổi cứ nhảy liên tục).

### Giải pháp kỹ thuật bắt buộc:
1. **Lệnh ghi ở Client**:
   Sử dụng hàm `updateDoc` với duy nhất trường `viewCount`:
   ```ts
   await updateDoc(doc(db, 'cvs', cvId), {
     viewCount: increment(1)
   });
   // TUYỆT ĐỐI KHÔNG GỬI: updatedAt: new Date().toISOString()
   ```
2. **Khóa chặt ở Firestore Security Rules**:
   Rules bắt buộc người xem vãng lai CHỈ ĐƯỢC PHÉP thay đổi trường `viewCount`:
   ```javascript
   // Kiểm tra chỉ duy nhất trường viewCount bị tác động
   allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['viewCount'])
     && request.resource.data.viewCount == resource.data.viewCount + 1
     && resource.data.isPublic == true
     && resource.data.status == 'active';
   ```

---

## 5. THỐNG KÊ LƯỢT XEM HIỂN THỊ

1. **Trên Dashboard Cá Nhân (`DashboardPage.tsx`)**:
   - Hiển thị tổng số lượt xem của từng CV bên cạnh huy hiệu "Công Khai" / "Cá Nhân".
   - Tính tổng lượt xem của tất cả CV thuộc quyền sở hữu của người dùng trên thẻ thống kê tổng quan (Total Views Card).
2. **Phạm vi MVP**:
   - Chỉ hiển thị **Tổng số lượt xem lũy kế (Lifetime Total Views)**.
   - Không chia nhỏ theo ngày/tuần trong giai đoạn này để tránh tạo thêm collection phụ gây tốn kém quota Firestore.

---

## 6. KẾ HOẠCH MIGRATION & BACKFILL DỮ LIỆU CŨ

- **Vấn đề**: Toàn bộ CV đang có trên Firestore hiện tại chưa có trường `viewCount`.
  - Trong Firestore, câu truy vấn `orderBy('viewCount', 'desc')` sẽ **tự động loại bỏ toàn bộ các document không chứa trường `viewCount`**!
  - Do đó, nếu không backfill, toàn bộ CV cũ sẽ biến mất khỏi bảng xếp hạng!
- **Kế hoạch thực thi**:
  - Viết script migration an toàn `scripts/migrate_v03_add_view_count.ts`.
  - Quét qua toàn bộ document trong collection `cvs`.
  - Gán giá trị mặc định `viewCount: 0`, `status: 'active'`, `category: 'tech'` cho những document chưa có các trường này.
  - **Giữ nguyên 100% nội dung và giữ nguyên timestamp `updatedAt` cũ**.
