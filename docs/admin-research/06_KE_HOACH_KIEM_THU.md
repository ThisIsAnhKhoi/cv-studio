# KẾ HOẠCH KIỂM THỬ TOÀN DIỆN (TEST PLAN & ACCEPTANCE CRITERIA)
**Dự án**: CV Studio / MyPortfolio  
**Tác giả**: Kỹ sư IT cấp cao kiêm Quản trị hệ thống & Kiến trúc sư giải pháp  
**Ngày thực hiện**: 16/10/2026  
**Mục tiêu**: Bảo vệ 102 tests hiện có, bổ sung tối thiểu 45 tests mới ($\ge 147$ tests), đạt 100% tỷ lệ vượt qua.

---

## 1. MỤC TIÊU VÀ NGUYÊN TẮC KIỂM THỬ
1. **Bảo toàn hồi quy (Zero Regression)**: Toàn bộ 17 test suites (102 unit tests) hiện có bắt buộc phải tiếp tục **Pass 100%**.
2. **Kiểm thử tầng dữ liệu thật (Không chỉ kiểm thử giao diện)**: Sử dụng `@firebase/rules-unit-testing` kết hợp Firebase Local Emulator Suite để kiểm thử trực tiếp Security Rules với các kịch bản tấn công thực tế.
3. **Mọi tiêu chuẩn nghiệm thu phải đo lường được (Measurable AC)**.

---

## 2. DANH SÁCH CÁC TEST SUITE MỚI DỰ KIẾN BỔ SUNG ($\ge 45$ TESTS MỚI)

| STT | Tên Tệp Kiểm Thử | Số Lượng Test | Nội Dung & Kịch Bản Kiểm Thử Cốt Lõi |
|:---:|:---|:---:|:---|
| **1** | `src/utils/__tests__/vietnameseSearch.test.ts` | 6 tests | Chuẩn hóa tiếng Việt `removeVietnameseTones`, tìm kiếm không dấu ra có dấu ("nguyen" -> "Nguyễn"), ký tự đặc biệt, chuỗi rỗng. |
| **2** | `src/features/view-counter/__tests__/viewCounter.test.ts` | 8 tests | Khử trùng lặp 30 phút bằng `sessionStorage`, bỏ qua khi chủ sở hữu tự xem, ngăn chặn chạy 2 lần trong React StrictMode, kiểm tra không gửi `updatedAt`. |
| **3** | `src/features/explore/__tests__/explorePagination.test.ts` | 8 tests | Phân trang Cursor `startAfter`, reset trang khi đổi danh mục, tie-break sắp xếp, đồng bộ URL query params (`?q=&category=&sort=`). |
| **4** | `src/components/admin/__tests__/AdminAuthGuard.test.tsx` | 5 tests | Chặn khách vãng lai, chặn user thường hiển thị màn hình 403, cho phép Admin truy cập, trạng thái loading khi đang xác thực. |
| **5** | `src/features/admin/__tests__/AdminUserManagement.test.tsx` | 8 tests | Hiển thị danh sách user, validate lý do khóa ($\ge 5$ ký tự), chống tự khóa chính mình, chống hạ quyền admin cuối cùng, kiểm tra gọi Batched Write. |
| **6** | `src/features/admin/__tests__/AdminCVManagement.test.tsx` | 6 tests | Hiển thị tất cả CV (kể cả private), thao tác khóa CV kèm ghi audit log, thao tác khôi phục CV. |
| **7** | `src/services/__tests__/auditLogService.test.ts` | 4 tests | Đóng gói Batched Write nguyên tử, rollback khi ghi log lỗi, định dạng timestamp chuẩn ISO. |
| **Tổng cộng** | **7 Test Suites Mới** | **45 Tests Mới** | **Nâng tổng số test của dự án từ 102 lên 147 Tests (Pass 100%)** |

---

## 3. MA TRẬN KIỂM THỬ FIRESTORE SECURITY RULES (EMULATOR TESTS)

*Thực thi qua `@firebase/rules-unit-testing` trên môi trường giả lập cục bộ:*

| Tài nguyên | Thao tác | Vai trò thử nghiệm | Kết quả mong đợi |
|:---|:---|:---|:---:|
| `cvs/{id}` | Read (CV Public) | Khách nặc danh (Unauthenticated) | ✅ **ALLOW** |
| `cvs/{id}` | Read (CV Private) | Khách nặc danh | ❌ **DENY** |
| `cvs/{id}` | Read (CV Private) | User khác (Không phải chủ) | ❌ **DENY** |
| `cvs/{id}` | Read (CV Private) | Chủ sở hữu (`auth.uid == userId`) | ✅ **ALLOW** |
| `cvs/{id}` | Read (CV Private) | Quản trị viên (Admin) | ✅ **ALLOW** |
| `cvs/{id}` | Update (Nội dung) | User khác | ❌ **DENY** |
| `cvs/{id}` | Update (`viewCount + 1`) | Khách vãng lai (CV Public) | ✅ **ALLOW** |
| `cvs/{id}` | Update (`viewCount + 100`) | Khách vãng lai (Gian lận) | ❌ **DENY** |
| `cvs/{id}` | Update (`viewCount + 1` kèm `updatedAt`) | Khách vãng lai | ❌ **DENY** |
| `users/{uid}` | Update (`role: 'admin'`) | Chính User đó (Leo thang quyền) | ❌ **DENY** |
| `users/{uid}` | Update (`status: 'disabled'`) | Chính User đó | ❌ **DENY** |
| `users/{uid}` | Update (`status: 'disabled'`) | Quản trị viên (Admin) | ✅ **ALLOW** |
| `auditLogs/{id}` | Create | User thường | ❌ **DENY** |
| `auditLogs/{id}` | Create | Quản trị viên | ✅ **ALLOW** |
| `auditLogs/{id}` | Update / Delete | Quản trị viên (Cố tình xóa vết) | ❌ **DENY** |

---

## 4. MA TRẬN KIỂM THỬ THỦ CÔNG TRÊN TRÌNH DUYỆT THẬT (CROSS-DEVICE MATRIX)

| Thiết bị & Độ phân giải | Chế độ | Trình duyệt kiểm thử | Hạng mục kiểm tra bắt buộc |
|:---|:---:|:---:|:---|
| **Desktop 1440 x 900** | Dark & Light | Chrome, Edge | Bảng Admin hiển thị đầy đủ cột, hover highlight, SWR cache trang chủ. |
| **Desktop 1280 x 800** | Dark | Chrome | Bố cục 3 cột thẻ CV, sticky filter bar mượt mà. |
| **Tablet 768 x 1024 (iPad)** | Light | Safari, Chrome | Lưới 2 cột thẻ CV, modal xác nhận căn giữa hoàn hảo. |
| **Mobile 375 x 667 (iPhone SE)** | Dark | Safari, Chrome | Bảng Admin chuyển sang Stacked Cards, Drawer bộ lọc trượt mượt mà. |
| **Mobile 360 x 800 (Android)** | Light | Chrome | Bàn phím ảo không đẩy vỡ modal; nút bấm ngón tay $\ge 44\text{px}$. |

---

## 5. TIÊU CHÍ NGHIỆM THU ĐO LƯỜNG ĐƯỢC (ACCEPTANCE CRITERIA)

1. **AC-01 (Security Rules)**: 100% các kịch bản trong Ma trận Security Rules được kiểm thử tự động trên Emulator và đều có kết quả Allow/Deny chính xác.
2. **AC-02 (Bundle Isolation)**: Kích thước Entry Chunk sau khi build `npm run build` không vượt quá **$35\text{ kB}$** (ngân sách hiện tại 33.5 kB). Mã nguồn Admin nằm riêng trong chunk độc lập.
3. **AC-03 (Deduplication)**: Một người dùng bấm F5 liên tục 10 lần trong 5 phút trên 1 CV public thì trường `viewCount` trên Firestore chỉ tăng đúng **+1**.
4. **AC-04 (Zero updatedAt Collision)**: Sau khi tăng lượt xem, giá trị `updatedAt` của CV giữ nguyên 100% so với trước khi xem.
5. **AC-05 (Soft Delete Enforcement)**: Khi một User bị khóa, tất cả CV của họ lập tức biến mất khỏi Trang chủ và Trang duyệt trong vòng **$\le 1$ giây**.
6. **AC-06 (Audit Trail Integrity)**: 100% các thao tác khóa/mở khóa/đổi role đều sinh ra bản ghi trong `auditLogs` với lý do hợp lệ $\ge 5$ ký tự.
7. **AC-07 (Quality Baseline)**: `npx tsc --noEmit` đạt 0 lỗi; `npm run test` đạt $\ge 147$ tests passed (100%).
