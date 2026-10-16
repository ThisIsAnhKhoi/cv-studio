# BÁO CÁO KIỂM TOÁN HIỆN TRẠNG HỆ THỐNG & ĐO LƯỜNG BASELINE
**Dự án**: CV Studio / MyPortfolio  
**Phiên bản**: v0.3.0  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày thực hiện**: 16/10/2026  
**Trạng thái**: Giai đoạn 0 — Nghiên cứu & Kiểm toán (Không can thiệp mã nguồn)

---

## 1. TỔNG QUAN VỀ KẾ HOẠCH ADMIN & ĐẾM LƯỢT XEM TRONG TÀI LIỆU CŨ

*Câu hỏi kiểm toán 1.1: Trong tài liệu dự án đã có kế hoạch Admin / đếm lượt xem / trang duyệt CV chưa?*

### Đối chiếu tài liệu gốc:
1. **Tài liệu [y_tuong.txt](y_tuong.txt)**:
   - *Dòng 11*: Đề cập mô hình công khai: *"Khám phá danh sách các profile ấn tượng, xem CV của từng người với đường dẫn riêng biệt (ví dụ: /u/username hoặc /cv/:id)"*.
   - *Dòng 17-21*: Mô tả Trang Menu/Khám phá tại route `/` tích hợp tìm kiếm theo tên/vị trí và lọc theo ngành nghề/tags kỹ năng.
   - *Dòng 40*: Trong mô tả Dashboard cá nhân có ghi: *"xem thống kê lượt xem"*.
   - **[SỰ THẬT ĐÃ XÁC MINH]**: Hoàn toàn **CHƯA CÓ** bất kỳ đặc tả nào về trang Admin, vai trò Quản trị viên, cơ chế kiểm duyệt/vô hiệu hóa người dùng hoặc CV, và chưa có trang duyệt CV riêng biệt tách rời khỏi Trang chủ.

2. **Tài liệu [DEVELOPMENT_PLAN_V2.md](DEVELOPMENT_PLAN_V2.md)**:
   - Kế hoạch Master Plan ban đầu chỉ quy hoạch từ Giai đoạn 1 đến Giai đoạn 5 (Vá lỗi P0, Template, State, Auth/Firestore, In ấn Native).
   - Chưa hề có Task Brief nào về phân hệ Admin hay Đếm lượt xem trong [TASK_BRIEFS.md](TASK_BRIEFS.md).

3. **Kết luận**:
   - Phân hệ Quản trị (Admin Panel), Động cơ Đếm Lượt Xem Atomic (View Counter Engine) và Trang Duyệt CV Chuyên Sâu (`/explore`) là các tính năng **mới 100%**, thuộc **Giai đoạn 6** của lộ trình phát triển mở rộng.

---

## 2. BÁO ĐỘNG ĐỎ BẢO MẬT P0: HIỆN TRẠNG FIRESTORE SECURITY RULES

*Câu hỏi kiểm toán 1.3: Firestore Security Rules đã tồn tại và đã triển khai chưa?*

> [!CAUTION]
> **RỦI RO BẢO MẬT KHẨN CẤP [MỨC ĐỘ P0 - CRITICAL BLOCKER]:**  
> Trong toàn bộ repository hiện tại, **HOÀN TOÀN CHƯA CÓ** các tệp:
> - `firestore.rules` (Quy tắc an ninh Firestore)
> - `firebase.json` (Cấu hình Firebase CLI)
> - `.firebaserc` (Khai báo Project ID)

### Phân tích hiểm họa bảo mật:
1. **Tình trạng Rules trên Cloud**: Vì không có file rules trong repo được triển khai qua CI/CD, cơ sở dữ liệu Cloud Firestore trên Firebase Console đang chạy bằng Rules mặc định khi tạo Database (thường là chế độ **Test Mode** `allow read, write: if true;` hoặc `allow read, write: if request.auth != null;` không kiểm tra quyền sở hữu).
2. **Nguy cơ xóa sổ toàn bộ dữ liệu**:
   - Cấu hình Firebase Client (`apiKey`, `projectId`, `appId`) là công khai trong mã nguồn frontend.
   - Bất kỳ ai mở Console trình duyệt đều có thể gọi:
     ```js
     import { deleteDoc, doc } from 'firebase/firestore';
     await deleteDoc(doc(db, 'cvs', 'bat-ky-cv-id-nao'));
     ```
     để **xóa sạch toàn bộ CV của người dùng khác** mà không gặp bất kỳ rào cản nào!
3. **Nguy cơ đánh cắp dữ liệu riêng tư**:
   - Mọi CV ở chế độ Riêng tư (`isPublic: false`) đều có thể bị đọc trộm bằng một câu query đơn giản `getDocs(collection(db, 'cvs'))`.
4. **Hành động bắt buộc**:
   - **Tuyệt đối không phát triển tính năng Admin khi chưa có `firestore.rules` khóa chặt.**
   - Triển khai tệp `firestore.rules` chuẩn an ninh là **Nhiệm vụ P0 số 1** của Giai đoạn triển khai.

### Kiểm tra các yếu tố an toàn khác:
- **Tệp `.env`**: [ĐÃ XÁC MINH] Không bị commit vào git; nằm trong `.gitignore`.
- **Firebase App Check**: [ĐÃ XÁC MINH] **Chưa được bật**. Client chưa có reCAPTCHA v3/Enterprise bảo vệ endpoint.
- **Authorized Domains**: Trước đó gặp lỗi `auth/unauthorized-domain` do Vercel domain chưa được thêm thủ công vào whitelist của Firebase Auth. Cần kiểm tra danh sách này trên Firebase Console.

---

## 3. KIỂM TOÁN SCHEMA & DỮ LIỆU FIRESTORE HIỆN TẠI

*Câu hỏi kiểm toán 1.2: Đọc mã nguồn và kiểm toán chi tiết schema, collection, query, isOwner*

### 3.1. Cấu trúc Collection hiện tại
- **Collection duy nhất đang hoạt động**: `cvs/{cvId}`.
- **Các collection chưa tồn tại**: `users/{uid}`, `admins/{uid}`, `auditLogs/{logId}`.

### 3.2. Schema Document `cvs/{cvId}` đối chiếu code
*Bằng chứng mã nguồn: [frontend/src/types/cv.ts](frontend/src/types/cv.ts) và [frontend/src/services/cvStorageService.ts](frontend/src/services/cvStorageService.ts)*

| Trường dữ liệu | Kiểu dữ liệu | Trạng thái hiện tại | Đánh giá kỹ thuật |
|:---|:---|:---:|:---|
| `id` | `string` | ✅ Đã có | Khóa chính duy nhất của CV |
| `userId` | `string` | ✅ Đã có | UID của tài khoản tạo CV trên Firebase Auth |
| `isPublic` | `boolean` | ✅ Đã có | Cờ công khai (True = hiện ở trang chủ, False = riêng tư) |
| `createdAt` | `string (ISO)` | ✅ Đã có | Thời điểm tạo |
| `updatedAt` | `string (ISO)` | ✅ Đã có | Thời điểm cập nhật cuối |
| `templateId` | `string` | ✅ Đã có | Mẫu CV đang chọn (`template-1`, `2`, `3`) |
| `personalInfo` | `PersonalInfo` | ✅ Đã có | Họ tên, vị trí, email, phone, location, birthday, avatar, socialLinks |
| `summary` | `string` | ✅ Đã có | Đoạn văn bản HTML rich text |
| `experiences` | `ExperienceItem[]`| ✅ Đã có | Danh sách kinh nghiệm |
| `educations` | `EducationItem[]` | ✅ Đã có | Danh sách học vấn |
| `skills` | `SkillCategory[]` | ✅ Đã có | Danh sách kỹ năng |
| `projects` | `ProjectItem[]` | ✅ Đã có | Danh sách dự án |
| `achievements` | `AchievementItem[]`| ✅ Đã có | Danh sách thành tựu |
| `certificates` | `CertificateItem[]`| ✅ Đã có | Danh sách chứng chỉ |
| `themeConfig` | `ThemeConfig` | ✅ Đã có | Cấu hình màu sắc, font, spacing |
| `sectionStyles`| `Record<...>` | ✅ Đã có | Tùy biến chi tiết 9 khối (Section Customizer) |
| **`viewCount`** | `number` | ❌ **CHƯA CÓ** | **Cần bổ sung ở Giai đoạn 6** |
| **`status`** | `'active' \| 'disabled'`| ❌ **CHƯA CÓ** | **Cần bổ sung cho Soft Delete** |
| **`ownerDisabled`** | `boolean` | ❌ **CHƯA CÓ** | **Cần bổ sung để ẩn CV khi user bị khóa** |
| **`category`** | `string` | ❌ **CHƯA CÓ** | **Cần bổ sung để lọc ngành nghề** |
| **`searchKeywords`**| `string[]` | ❌ **CHƯA CÓ** | **Cần bổ sung cho tìm kiếm** |

### 3.3. Cơ chế Đọc / Ghi / Xóa trong `cvStorageService.ts`
1. **Thao tác Ghi**: `setDoc(doc(db, 'cvs', cv.id), cleanData)`. Ghi đè toàn bộ document.
2. **Thao tác Xóa**: `deleteDoc(doc(db, 'cvs', id))` $\rightarrow$ **[SỰ THẬT ĐÃ XÁC MINH] ĐÂY LÀ HARD DELETE (Xóa vật lý vĩnh viễn)**.
   - Khi xóa, document biến mất hoàn toàn khỏi Firestore.
   - Không có trường `deletedAt`, không có bản sao lưu, không thể khôi phục (Unrecoverable).
3. **Cách HomePage tải CV Public**:
   - Mã nguồn: `query(collection(db, 'cvs'), where('isPublic', '==', true))`.
   - **Hạn chế nghiêm trọng**:
     - **Không có `limit()`**: Tải toàn bộ mọi document public có trong hệ thống. Nếu có 10,000 CV public, mỗi lượt truy cập trang chủ ngốn 10,000 read operations!
     - **Không có phân trang (Pagination)**.
     - **Không có `orderBy()`**: Thứ tự trả về ngẫu nhiên theo ID document của Firestore.
4. **Cách tính quyền sở hữu `isOwner`**:
   - Mã nguồn tại [CVViewPage.tsx](frontend/src/pages/CVViewPage.tsx):
     ```ts
     const isOwner = Boolean(user && cv && cv.userId && user.uid === cv.userId);
     ```
   - [ĐÃ XÁC MINH] Kiểm tra trực tiếp `user.uid === cv.userId`. Hợp lý và an toàn ở tầng Client UI.

---

## 4. ĐÁNH GIÁ DỮ LIỆU CÁ NHÂN (PII) ĐANG BỘC LỘ

*Câu hỏi kiểm toán 1.4: Đánh giá PII trên CV public*

### Hiện trạng rò rỉ PII:
Khi người dùng chuyển CV sang chế độ Công khai (`isPublic = true`), toàn bộ các trường sau đây được phơi bày không hạn chế trên Web:
1. `personalInfo.email`: Nguy cơ bị bot crawler cào dữ liệu gửi thư rác (Spam / Phishing).
2. `personalInfo.phone`: Nguy cơ bị cuộc gọi tiếp thị, tin nhắn lừa đảo.
3. `personalInfo.birthday`: Ngày tháng năm sinh chính xác là dữ liệu nhạy cảm cấp cao (thường dùng làm câu hỏi bảo mật ngân hàng, bảo hiểm).
4. `personalInfo.location`: Địa chỉ nơi ở chi tiết.

### Đề xuất giải pháp kiến trúc:
1. **Ngắn hạn (MVP Giai đoạn 6)**:
   - Thêm nhãn cảnh báo trực quan trong `PersonalInfoSection.tsx`: *"Lưu ý: Email, SĐT và Ngày sinh sẽ hiển thị công khai khi bạn chia sẻ link CV"*.
   - Cho phép để trống hoặc xóa nhanh ngày sinh (đã có nút bấm X).
2. **Dài hạn (Giai đoạn 7)**:
   - Thêm cấu hình `privacySettings`:
     - `hidePhoneWhenPublic: boolean`
     - `hideExactBirthDate: boolean` (chỉ hiện năm sinh, ví dụ: 2002 thay vì 15/08/2002)
     - `obfuscateEmail: boolean` (hiện captcha trước khi xem email thật).

---

## 5. ĐO LƯỜNG CHỈ SỐ KỸ THUẬT BASELINE (TRƯỚC KHI BẮT ĐẦU)

*Câu hỏi kiểm toán 1.5: Đo lường baseline tsc, test, build để làm mốc đối chiếu*

Mọi thay đổi trong tương lai **bắt buộc không được làm suy giảm** các chỉ số baseline chuẩn sau đây:

### 5.1. Kiểm tra Kiểu TypeScript (`npx tsc --noEmit`)
- **Kết quả**: **0 Lỗi (Exit Code 0)**.
- **Thời gian**: 6.1s.

### 5.2. Bộ Kiểm thử Tự động (`npm test -- --run`)
- **Số Test Suites**: **17 passed / 17 test files**.
- **Tổng số Unit Tests**: **102 passed / 102 tests (100% PASS)**.
- **Thời gian thực thi**: 9.64s.

### 5.3. Đóng gói Production Bundle (`npm run build`)
- **Thời gian build**: 8.05s.
- **Kích thước các chunk cốt lõi**:
  - `dist/index.html`: 2.85 kB (gzip: 1.30 kB)
  - `dist/assets/index-BLCu2tgw.css`: 81.55 kB (gzip: 12.67 kB)
  - **Entry JS (`dist/assets/index-nPL3yGso.js`)**: **33.50 kB (gzip: 9.64 kB)** *(Tuyệt đối không để mã Admin kéo phình chunk này)*
  - `dist/assets/HomePage-B9oJI4IC.js`: 22.61 kB (gzip: 6.57 kB)
  - `dist/assets/CVViewPage-BP4tbZBV.js`: 11.36 kB (gzip: 3.65 kB)
  - `dist/assets/CVEditorPage-BSriXKhI.js`: 499.57 kB (gzip: 147.58 kB)
  - `dist/assets/DashboardPage-BMo3epWc.js`: 14.26 kB (gzip: 3.94 kB)
  - `dist/assets/firebase-auth-BP7hdpAH.js`: 172.15 kB (gzip: 35.10 kB)
  - `dist/assets/firebase-firestore-DTDESQ7-.js`: 536.43 kB (gzip: 141.73 kB)
  - `dist/assets/react-vendor-BMML1Y9h.js`: 179.02 kB (gzip: 58.82 kB)
