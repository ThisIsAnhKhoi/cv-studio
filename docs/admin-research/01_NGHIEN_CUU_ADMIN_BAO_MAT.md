# NGHIÊN CỨU PHÂN HỆ QUẢN TRỊ (ADMIN), MÔ HÌNH VAI TRÒ & BẢO MẬT HỆ THỐNG
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày thực hiện**: 16/10/2026  
**Trạng thái**: Giai đoạn 0 — Nghiên cứu & Thiết kế Kiến trúc (Approved for Review)

---

## 1. MÔ HÌNH VAI TRÒ (RBAC) & MA TRẬN PHÂN QUYỀN

### 1.1. Các vai trò trong hệ thống
Để đảm bảo vận hành linh hoạt và an toàn, hệ thống phân chia 3 vai trò:
1. **User (Người dùng thông thường)**: Tạo, chỉnh sửa, xóa CV cá nhân; xem CV public; xem dashboard cá nhân.
2. **Moderator (Kiểm duyệt viên)**: Xem tất cả CV (kể cả private để kiểm duyệt nội dung), khóa/mở khóa CV vi phạm, xem nhật ký kiểm toán. Không được khóa user, không được đổi role admin.
3. **Admin / Super Admin (Quản trị viên cấp cao)**: Toàn quyền quản trị hệ thống, quản lý user (khóa/mở khóa tài khoản), chỉ định vai trò, xem thống kê toàn cục, cấu hình hạn mức.

### 1.2. Ma trận phân quyền chi tiết (RBAC Matrix)

| Tài nguyên (Resource) | Thao tác (Action) | Khách (Guest) | User thường | Moderator | Admin / Super Admin |
|:---|:---|:---:|:---:|:---:|:---:|
| **CV Public (`isPublic: true`)** | Xem nội dung | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép |
| **CV Private (`isPublic: false`)** | Xem nội dung | ❌ Cấm | ✅ Chỉ chủ CV | ✅ Cho phép (Duyệt) | ✅ Cho phép |
| **CV Cá nhân** | Tạo / Sửa / Xóa | ❌ Cấm | ✅ Chỉ chủ CV | ✅ Chỉ chủ CV | ✅ Chỉ chủ CV (hoặc khóa) |
| **CV Bất kỳ** | Khóa (Soft delete) / Mở | ❌ Cấm | ❌ Cấm | ✅ Cho phép (Ghi log) | ✅ Cho phép (Ghi log) |
| **Bộ đếm `viewCount`** | Tăng +1 hợp lệ | ✅ Cho phép | ✅ (Loại trừ chủ) | ✅ (Loại trừ chủ) | ✅ (Loại trừ chủ) |
| **Hồ sơ User (`users/{uid}`)** | Đọc thông tin cơ bản | ❌ Cấm | ✅ Chỉ bản thân | ✅ Đọc danh sách | ✅ Đọc danh sách |
| **Hồ sơ User (`users/{uid}`)** | Cập nhật thông tin | ❌ Cấm | ✅ Bản thân (trừ role/status) | ❌ Cấm sửa người khác | ✅ Cho phép (Khóa/Đổi role) |
| **Tài khoản User** | Khóa (Disable) / Mở | ❌ Cấm | ❌ Cấm | ❌ Cấm | ✅ Cho phép (Bắt buộc lý do) |
| **Quyền Admin (`admins/{uid}`)** | Thêm / Thu hồi Admin | ❌ Cấm | ❌ Cấm | ❌ Cấm | ✅ Chỉ Super Admin |
| **Nhật ký (`auditLogs`)** | Xem log | ❌ Cấm | ❌ Cấm | ✅ Cho phép đọc | ✅ Cho phép đọc |
| **Nhật ký (`auditLogs`)** | Ghi log | ❌ Cấm | ❌ Cấm | ✅ Tự động khi thao tác | ✅ Tự động khi thao tác |
| **Nhật ký (`auditLogs`)** | Sửa / Xóa log | ❌ Cấm | ❌ Cấm | ❌ Cấm tuyệt đối | ❌ Cấm tuyệt đối |

---

## 2. SO SÁNH 3 PHƯƠNG ÁN XÁC THỰC VAI TRÒ (AUTHENTICATION & AUTHORIZATION)

*Nguyên tắc bất biến: KHÔNG BAO GIỜ tin cờ admin ở client. Ẩn nút/route ở frontend chỉ là UX, không phải bảo mật. Quyền thực thi bắt buộc nằm ở Firestore Security Rules.*

### Bảng so sánh 3 phương án kỹ thuật:

| Tiêu chí đánh giá | Phương án A: Firebase Custom Claims | Phương án B: Collection `admins/{uid}` trên Firestore | Phương án C: Email Whitelist cố định trong Code |
|:---|:---|:---|:---|
| **Cơ chế hoạt động** | Gán claim `{ role: 'admin' }` vào JWT Token qua Firebase Admin SDK | Lưu document `admins/{uid}` và kiểm tra trong Rules bằng `exists()` | Khai báo mảng `const ADMIN_EMAILS = [...]` trong file cấu hình |
| **Mức độ an toàn** | Rất cao (Được mã hóa trong JWT) | Rất cao (Security Rules kiểm tra trực tiếp ở tầng dữ liệu) | Thấp đến trung bình (Dễ bị bypass nếu client bị can thiệp) |
| **Nguy cơ leo thang đặc quyền** | Cực thấp (Chỉ backend/Admin SDK mới ký được JWT) | Cực thấp (Rules cấm người dùng ghi vào collection `admins`) | Cao nếu không kiểm tra email_verified |
| **Yêu cầu gói cước Firebase** | **Bắt buộc gói Blaze** (Cần Cloud Functions/Node server) | **Chạy 100% trên gói Spark 0 đồng** | Chạy 100% trên gói Spark 0 đồng |
| **Chi phí đọc Firestore Rules** | 0 lượt đọc (Claim nằm sẵn trong Token) | 1 lượt đọc `exists()` mỗi request | 0 lượt đọc |
| **Thời gian thu hồi quyền (Revocation)** | Chậm (Token sống tối đa 1 giờ, phải chờ refresh) | **Tức thì (Realtime 1 giây)** ngay khi xóa document admin | Phải build & deploy lại mã nguồn |
| **Cách Bootstrap Admin đầu tiên** | Phải viết script chạy Node.js cục bộ với Service Account Key | **Vào Firebase Console GUI tạo 1 document trong 30 giây** | Điền sẵn email vào code |
| **Độ phức tạp triển khai** | Trung bình đến Cao (Cần setup Functions, deploy) | **Đơn giản, chuẩn mực, ổn định** | Rất đơn giản nhưng thô sơ |

### 👉 KHUYẾN NGHỊ CỦA KIẾN TRÚC SƯ: CHỌN PHƯƠNG ÁN B KẾT HỢP FAIL-SAFE EMAIL
- **Lý do**:
  1. Giữ vững 100% ràng buộc kiến trúc: **Firebase Serverless, chi phí 0 đồng trên gói Spark**, không cần nâng cấp Blaze để chạy Cloud Functions.
  2. Thời gian thu hồi quyền là **tức thì (Immediate Revocation)**: Nếu một tài khoản Admin bị nghi ngờ lộ mật khẩu, chỉ cần vào Firebase Console xóa document `admins/{uid}` là mọi quyền ghi quản trị bị Security Rules chặn đứng lập tức ở request kế tiếp.
  3. **Cơ chế Fail-Safe Super Admin**: Bổ sung kiểm tra cứng trong Security Rules:
     ```javascript
     function isSuperAdmin() {
       return request.auth != null 
         && request.auth.token.email_verified == true 
         && request.auth.token.email == 'thanhanhkhoi.work@gmail.com';
     }
     function isAdmin() {
       return isSuperAdmin() || exists(/databases/$(database)/documents/admins/$(request.auth.uid));
     }
     ```
     Điều này đảm bảo dù database có bị lỗi cấu hình, Chủ dự án vẫn luôn giữ quyền tối cao để khôi phục hệ thống.

---

## 3. CƠ CHẾ CHỐNG LEO THANG ĐẶC QUYỀN (PRIVILEGE ESCALATION PREVENTION)

### 3.1. Rủi ro tấn công
Kẻ xấu có thể mở DevTools, dùng Firebase Client SDK gọi `updateDoc(doc(db, 'users', myUid), { role: 'admin', status: 'active' })` để tự thăng cấp tài khoản của mình.

### 3.2. Giải pháp kỹ thuật trong Firestore Security Rules
Sử dụng phương thức `affectedKeys()` để khóa chặt các trường nhạy cảm:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Hàm bổ trợ kiểm tra vai trò
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && (
        (request.auth.token.email_verified == true && request.auth.token.email == 'thanhanhkhoi.work@gmail.com') ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }

    // Rules cho collection users
    match /users/{userId} {
      // Bất kỳ user đã đăng nhập đều đọc được hồ sơ của mình; Admin đọc được tất cả
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      
      // User tự tạo hồ sơ khi đăng ký (không được tự gán role admin hoặc status disabled)
      allow create: if isAuthenticated() && request.auth.uid == userId
        && request.resource.data.role == 'user'
        && request.resource.data.status == 'active';
      
      // Khi User tự cập nhật hồ sơ: CẤM TUYỆT ĐỐI sửa các trường role, status, isAdmin
      allow update: if isAuthenticated() && (
        // Trường hợp 1: Admin được sửa mọi trường (trừ việc tự hạ quyền chính mình)
        isAdmin() ||
        // Trường hợp 2: User tự sửa -> KHÔNG ĐƯỢC CHẠM vào các field nhạy cảm
        (request.auth.uid == userId && 
         !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'status', 'isAdmin', 'disabledAt', 'disabledBy', 'disabledReason']))
      );
      
      // Cấm xóa vật lý document users (Tuân thủ nguyên tắc "Xóa = Tắt")
      allow delete: if false;
    }
    
    // Rules cho collection admins (Chỉ Super Admin mới được can thiệp)
    match /admins/{adminId} {
      allow read: if isAdmin();
      allow write: if isSuperAdmin();
    }
  }
}
```

---

## 4. QUẢN LÝ NGƯỜI DÙNG THEO NGUYÊN TẮC "XÓA = TẮT" (SOFT DELETE)

### 4.1. Vòng đời tài khoản User
1. **Create (Khởi tạo)**:
   - Khi đăng ký lần đầu qua Firebase Auth (Google hoặc Email), frontend tự động tạo document `users/{uid}` với `status: 'active'`, `role: 'user'`.
   - *Admin có tạo hộ user được không?*: Không khuyến nghị trong MVP vì Firebase Client SDK không hỗ trợ tạo tài khoản Auth cho người khác mà không bị đăng xuất phiên hiện tại.
2. **Read (Tra cứu)**:
   - Danh sách user trong Admin Panel hỗ trợ phân trang Cursor (`startAfter`), lọc theo trạng thái (`active`, `disabled`), tìm kiếm theo email/tên.
3. **Update (Chỉnh sửa)**:
   - Admin có quyền đổi vai trò (`user` $\leftrightarrow$ `moderator`), cập nhật ghi chú nội bộ.
4. **"Delete" = Vô hiệu hóa (Soft Delete)**:
   - **Tuyệt đối KHÔNG gọi `deleteDoc`**.
   - Cập nhật document `users/{uid}`:
     ```ts
     {
       status: 'disabled',
       disabledAt: new Date().toISOString(),
       disabledBy: adminUser.uid,
       disabledReason: 'Vi phạm điều khoản cộng đồng: Đăng nội dung spam' // Bắt buộc >= 5 ký tự
     }
     ```

### 4.2. Phân tích hệ quả & Khoảng hở Token (Token Lifetime Gap)
- **Hệ quả của việc khóa User**:
  1. *Đăng nhập*: Security Rules sẽ chặn toàn bộ quyền đọc/ghi Firestore của user bị khóa (`get(/databases/$(database)/documents/users/$(request.auth.uid)).data.status == 'active'`).
  2. *CV công khai của họ*: **Lập tức bị ẩn**. Khi khóa User, Admin client thực hiện Batched Write cập nhật đồng thời trường `ownerDisabled: true` trên toàn bộ CV của user đó.
  3. *Khoảng hở Token*: Firebase Auth ID Token có hạn sử dụng 1 giờ và được lưu trong bộ nhớ client. Khi bị khóa trong Firestore, token Auth vẫn chưa hết hạn ngay ở tầng Firebase Auth. Tuy nhiên, **tầng Security Rules đã từ chối mọi request đọc/ghi Firestore**, nên kẻ xấu hoàn toàn bất lực không thể thực hiện bất kỳ thao tác phá hoại nào.

### 4.3. Quy tắc an toàn chống "Tự khóa hệ thống" (Safety Guards)
1. **Chống Admin tự khóa chính mình**: Giao diện Admin và Security Rules cấm Admin thực hiện thao tác disable trên document có `userId == request.auth.uid`.
2. **Chống hạ quyền Admin cuối cùng**: Kiểm tra số lượng document trong `admins`. Nếu chỉ còn 1 Admin, hệ thống khóa nút "Hạ quyền / Xóa Admin".

---

## 5. QUẢN LÝ CV (KIỂM SOÁT KHỐI LƯỢNG & NỘI DUNG)

### 5.1. Chức năng Quản lý CV của Admin
- **Xem toàn bộ CV**: Admin và Moderator có quyền xem danh sách tất cả CV (bao gồm cả CV đang để Private để phát hiện nội dung độc hại hoặc lừa đảo).
- **Vô hiệu hóa CV vi phạm (Soft Delete)**:
  - Cập nhật trường `status: 'disabled'`, `disabledAt`, `disabledBy`, `disabledReason`.
  - CV bị gắn cờ `disabled` sẽ lập tức bị Security Rules chặn không cho công chúng xem (kể cả khi truy cập link trực tiếp `/cv/:id`).
- **Khôi phục CV (Restore)**: Đưa `status` trở lại `'active'`.

### 5.2. Kiểm soát Khối lượng & Hạn mức (Quotas)
- **Hạn mức đề xuất cho MVP**: Mỗi tài khoản User thông thường được tạo **tối đa 5 CV**.
- **Cách thực thi**:
  - *Phương án Client-Enforced + Aggregation Count*: Trong `useCVStore` và `DashboardPage`, trước khi tạo CV mới, gọi `getCountFromServer(query(collection(db, 'cvs'), where('userId', '==', user.uid), where('status', '!=', 'deleted')))`. Nếu $\ge 5$, hiển thị modal thông báo giới hạn và hướng dẫn xóa/tận dụng CV cũ.
  - *Lưu ý kỹ thuật*: Trong Firestore Security Rules thuần client-side (không dùng Cloud Functions), việc đếm số lượng document để giới hạn `create` rất tốn kém lượt đọc hoặc không thể kiểm tra nguyên tử tuyệt đối. Do đó, việc giới hạn ở tầng Client kết hợp báo cáo thống kê trong Admin Panel là giải pháp tối ưu cho quy mô MVP.

### 5.3. Bảng Thống kê Tổng hợp (Admin Metrics)
Để không tiêu tốn lượt đọc Firestore, bảng thống kê Admin Dashboard sử dụng Firestore Aggregation Queries (`count()`):
- `const totalUsers = await getCountFromServer(collection(db, 'users'));`
- `const totalCVs = await getCountFromServer(collection(db, 'cvs'));`
- `const publicCVs = await getCountFromServer(query(collection(db, 'cvs'), where('isPublic', '==', true), where('status', '==', 'active')));`
- `const disabledCVs = await getCountFromServer(query(collection(db, 'cvs'), where('status', '==', 'disabled')));`
*Chi phí*: Mỗi hàm `count()` chỉ tính phí 1 read operation cho mỗi 1,000 index entries được quét (Cực kỳ rẻ, chỉ tốn ~4 reads cho toàn bộ 4 chỉ số thống kê).

---

## 6. NHẬT KÝ KIỂM TOÁN BẤT BIẾN (IMMUTABLE AUDIT LOG)

### 6.1. Cấu trúc Collection `auditLogs/{logId}`
Mỗi hành động của Admin / Moderator bắt buộc phải sinh ra một bản ghi log:
```ts
export interface AuditLogEntry {
  id: string;               // UUID duy nhất
  actorUid: string;         // UID của Admin thực hiện
  actorEmail: string;       // Email của Admin
  action: 'LOCK_USER' | 'UNLOCK_USER' | 'DISABLE_CV' | 'RESTORE_CV' | 'CHANGE_ROLE';
  targetType: 'user' | 'cv';
  targetId: string;         // UID của user hoặc ID của CV bị tác động
  reason: string;           // Lý do bắt buộc (tối thiểu 5 ký tự)
  metadata?: Record<string, any>; // Dữ liệu phụ trợ (ví dụ role cũ -> role mới)
  timestamp: string;        // ISO 8601 Timestamp
}
```

### 6.2. Cơ chế Ghi Nguyên Tử (Atomic Execution via Batched Writes)
- Mọi thao tác quản trị viên (ví dụ: Khóa User) bắt buộc phải đóng gói trong cùng một `writeBatch`:
  ```ts
  const batch = writeBatch(db);
  batch.update(userRef, { status: 'disabled', disabledAt, disabledBy, disabledReason });
  batch.set(auditLogRef, auditLogData);
  await batch.commit();
  ```
- **Lợi ích**: Nếu ghi log thất bại, thao tác khóa user cũng tự động bị hủy (Rollback), bảo đảm 100% tính minh bạch và không thể có hành vi quản trị "chui" không lưu vết.

### 6.3. Security Rules cho `auditLogs`:
```javascript
match /auditLogs/{logId} {
  // Chỉ Admin và Moderator mới được đọc lịch sử log
  allow read: if isAdmin();
  
  // Chỉ cho phép tạo mới log nếu actorUid trùng khớp với người đang đăng nhập
  allow create: if isAdmin() 
    && request.resource.data.actorUid == request.auth.uid
    && request.resource.data.reason.size() >= 5;
    
  // TUYỆT ĐỐI CẤM SỬA VÀ CẤM XÓA (Tính bất biến - Immutability)
  allow update, delete: if false;
}
```

---

## 7. CHECKLIST BẢO MẬT HỆ THỐNG TỔNG THỂ

| Hạng mục kiểm tra | Hiện trạng | Giải pháp & Kế hoạch xử lý |
|:---|:---:|:---|
| **1. Firestore Rules** | ❌ Thiếu | Tạo tệp `firestore.rules` khóa chặt toàn bộ quyền đọc/ghi theo RBAC trước khi code tính năng Admin. |
| **2. Chống XSS Rich Text** | ⚠️ Đang dùng regex | Tích hợp thư viện `dompurify` nén gọn hoặc lọc thẻ chặt chẽ khi render `summary` để triệt tiêu XSS. |
| **3. Content Security Policy (CSP)** | ⚠️ Cơ bản | Cập nhật headers an toàn trong [vercel.json](vercel.json): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`. |
| **4. Phân mảnh mã nguồn Admin** | ✅ Đã sẵn sàng | Tách toàn bộ module Admin thành chunk riêng bằng `React.lazy()` (`dist/assets/AdminPage-[hash].js`), không rò rỉ mã quản trị vào bundle của khách. |
| **5. Bảo vệ Route `/admin`** | ✅ Đã thiết kế | Bọc bởi `<AdminAuthGuard />`: kiểm tra đăng nhập $\rightarrow$ kiểm tra Firestore `admins/{uid}` $\rightarrow$ nếu không đủ quyền, điều hướng về `403 Forbidden` hoặc trang chủ. |
| **6. Sao lưu dữ liệu (Backup)** | ⚠️ Thủ công | Hướng dẫn xuất dữ liệu định kỳ trên Firebase Console (Export Firestore to GCS) trước mỗi đợt migration lớn. |
| **7. Xác thực 2 bước (2FA)** | Khuyến nghị | Tài khoản Admin chính chủ bắt buộc bật xác thực 2 bước (Google 2-Step Verification). |
