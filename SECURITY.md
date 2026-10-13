# Chính Sách Bảo Mật (Security Policy)

---

## 1. Các phiên bản được hỗ trợ

Dự án hiện đang ở giai đoạn **Client-Side Prototype (v0.1.x)**.

| Phiên bản | Trạng thái hỗ trợ | Ghi chú |
|:---:|:---:|:---|
| **0.1.x** |  Được hỗ trợ | Nhận các bản vá lỗi client-side, XSS và UI stability |
| < 0.1.0 | ❌ Không hỗ trợ | Bản nháp ban đầu |

---

## 2. Báo cáo lỗ hổng bảo mật (Reporting a Vulnerability)

Nếu bạn phát hiện bất kỳ vấn đề bảo mật nào trong mã nguồn:

1. **Vui lòng KHÔNG mở Issue công khai trên GitHub**.
2. Hãy gửi thông tin chi tiết qua email cá nhân của người bảo trì dự án: `thanhanhkhoi.work@gmail.com` (hoặc sử dụng tính năng **Private Vulnerability Reporting** trên tab Security của GitHub).
3. Nội dung báo cáo nên bao gồm:
   - Mô tả chi tiết lỗ hổng.
   - Các bước tái hiện (Proof of Concept - PoC).
   - Tác động tiềm tàng đến người dùng.
4. Chúng tôi cam kết sẽ phản hồi trong vòng **48 giờ** và công bố bản vá trước khi công khai thông tin lỗi.

---

## 3. Hiện trạng bảo mật đã ghi nhận (Known Security Status)

| Mã lỗi | Mức độ | Trạng thái | Giải pháp đã thực hiện / Dự kiến |
|:---|:---:|:---:|:---|
| **BUG-001: Stored XSS qua URL** | Critical |  ĐÃ VÁ (f337732) | Toàn bộ URL người dùng nhập được bọc qua hàm `formatSafeUrl()`, chặn đứng `javascript:`, `data:`, `vbscript:`. Đã có 6 unit tests tự động bảo vệ. |
| **BUG-005: Lỗ hổng trong html2pdf.js** | Critical | ⚠️ ĐANG CÁCH LY | Phụ thuộc vào `html2pdf.js@0.10.2` và `jspdf@2.5.1`. Tính năng xuất PDF đã được **tạm hoãn (Deferred)**; dự kiến ở Giai đoạn 5 sẽ gỡ bỏ hoàn toàn thư viện này để chuyển sang Native CSS `@media print` A4. |
| **Client-Side Draft Storage** | Thông tin |  An toàn | Dữ liệu nháp lưu trong `localStorage` với key phân lập theo từng ID hồ sơ (`cv_studio_draft_${id}`), không chứa cookie xác thực hay token nhạy cảm. |
