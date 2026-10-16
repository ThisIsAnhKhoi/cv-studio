# MỤC LỤC TÀI LIỆU DỰ ÁN (DOCUMENTATION INDEX)
**CV Studio / MyPortfolio Platform**  
*Phiên bản hiện tại: v0.4.0 (16/10/2026)*

---

## 1. 📌 Tài Liệu Trọng Yếu Hiện Hành (Active & Canonical Documents)

| Tên tài liệu | Đường dẫn | Mục đích & Nội dung | Trạng thái |
|:---|:---|:---|:---:|
| **Báo Cáo Kiểm Toán Toàn Diện v2** | [`docs/QA_AUDIT_v2.md`](QA_AUDIT_v2.md) | Báo cáo kiểm định chất lượng, an ninh, hiệu năng, phân tích lỗi giao diện (Navbar/ProfileCard) và rà soát tài liệu tại Pha 3 & 4. | 🟢 **MỚI NHẤT (v0.4.0)** |
| **Tiến Độ Dự Án (Canonical)** | [`PROJECT_STATUS.md`](../PROJECT_STATUS.md) | Bảng theo dõi tiến độ tổng thể, hiện trạng 95.2%, đối chiếu thực tế giữa code và tài liệu. | 🟢 **CHÍNH THỨC** |
| **Nhật Ký Thay Đổi** | [`CHANGELOG.md`](../CHANGELOG.md) | Lịch sử cập nhật chi tiết theo chuẩn Keep a Changelog (v0.1.0 $\rightarrow$ v0.4.0). | 🟢 **HOẠT ĐỘNG** |
| **Kiến Trúc Hệ Thống** | [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) | Đặc tả kiến trúc 4 lớp Clean Architecture, Template Registry, State Management và Firestore Security Rules. | 🟢 **HOẠT ĐỘNG** |
| **Hướng Dẫn Triển Khai Font** | [`docs/DEPLOYMENT_FONTS_GUIDE.md`](DEPLOYMENT_FONTS_GUIDE.md) | Quy trình đóng gói Self-Hosted Web Fonts WOFF2 chống lỗi font tiếng Việt khi deploy. | 🟢 **HOẠT ĐỘNG** |
| **Tài Liệu Đặc Tả Ý Tưởng** | [`docs/y_tuong.txt`](y_tuong.txt) | 9 phần đặc tả yêu cầu chức năng, luồng người dùng và UX/UI nguyên bản của sản phẩm. | 🟢 **THAM CHIẾU** |

---

## 2. 🛡️ Phân Hệ Quản Trị & Nghiên Cứu Kỹ Thuật (Admin & RFCs)

- [`docs/admin-research/`](admin-research/): Tài liệu nghiên cứu chi tiết về kiến trúc phân quyền RBAC, kiểm duyệt hồ sơ và nhật ký kiểm toán bất biến.
- [`docs/rfc/`](rfc/): Các đề xuất thay đổi kỹ thuật (Request For Comments) của đội ngũ kỹ sư.
- [`docs/IMPLEMENTATION_PLAN_STAGE2.md`](IMPLEMENTATION_PLAN_STAGE2.md): Kế hoạch triển khai kỹ thuật giai đoạn 2 (Editor & Template Customization).

---

## 3. 📦 Tài Liệu Lưu Trữ Lịch Sử (Archived / Historical Baselines)

> [!NOTE]
> Các tài liệu dưới đây được lưu giữ nhằm mục đích theo dõi lịch sử tiến hóa của dự án. Không sử dụng làm căn cứ cho hiện trạng kỹ thuật hiện tại.

- [`QA_REPORT.md`](../QA_REPORT.md): Báo cáo kiểm toán Pha 1 (13/10/2026 - tiến độ 28.5% khi còn là Client-Side Prototype). Đã gắn cờ chuyển hướng sang [`docs/QA_AUDIT_v2.md`](QA_AUDIT_v2.md).
- [`docs/baseline/PROJECT_STATUS_LEGACY_v0.1.md`](baseline/PROJECT_STATUS_LEGACY_v0.1.md): Bảng tiến độ sơ khai lúc bắt đầu dự án.
- [`docs/baseline/BASELINE-20261013.md`](baseline/BASELINE-20261013.md): Điểm chuẩn kiểm thử và commit baseline của phiên bản v0.1.0.

---

## 4. 🚀 Hướng Dẫn Phát Triển Nhanh

- **Khởi chạy môi trường Dev**: `npm run dev` (Port 3000)
- **Kiểm tra kiểu dữ liệu (Strict Mode)**: `cd frontend && npx tsc --noEmit` (Mục tiêu: 0 lỗi)
- **Chạy toàn bộ 132 automated tests**: `cd frontend && npm test -- --run`
- **Build kiểm tra bundle**: `cd frontend && npm run build`
