# Hướng Dẫn Đóng Góp (Contributing Guide)

Cảm ơn bạn đã quan tâm đến dự án **CV Studio / MyPortfolio**! Dự án hoan nghênh mọi đóng góp từ cộng đồng nhằm nâng cao trải nghiệm tạo CV và thiết kế portfolio chuyên nghiệp.

---

## 1. Quy trình làm việc (Workflow)

1. **Fork** repository này về tài khoản GitHub của bạn.
2. Tạo một nhánh mới từ nhánh `master`:
   ```bash
   git checkout -b feature/ten-tinh-nang-moi
   # hoặc: git checkout -b fix/ten-loi-can-sua
   ```
3. Cài đặt dependencies và khởi chạy môi trường dev:
   ```bash
   npm install
   npm run dev
   ```
4. Thực hiện các thay đổi mã nguồn.
5. Kiểm tra tính toàn vẹn và chạy toàn bộ unit tests:
   ```bash
   npm run test
   npm run build
   ```
6. Commit thay đổi theo quy chuẩn **Conventional Commits**:
   - `feat:` bổ sung tính năng mới
   - `fix:` sửa lỗi
   - `docs:` tài liệu
   - `style:` định dạng, CSS
   - `refactor:` tái cấu trúc mã nguồn
   - `test:` bổ sung hoặc sửa đổi bài kiểm thử
7. Push nhánh lên GitHub và tạo **Pull Request (PR)** vào nhánh `master`.

---

## 2. Tiêu chuẩn mã nguồn (Code Standards)

- **Type-Safety**: 100% mã nguồn TypeScript phải vượt qua `npx tsc --noEmit` với 0 cảnh báo. Tuyệt đối không dùng `any` bừa bãi.
- **Thiết kế UI**: Giữ phong cách hiện đại, thanh lịch, hỗ trợ song song Dark & Light mode. Sử dụng Tailwind CSS đồng bộ, không viết CSS inline tuỳ tiện.
- **Kiểm thử**: Mọi tính năng cốt lõi mới hoặc bản vá lỗi phải đi kèm ít nhất một test case Vitest tương ứng.
- **Bảo mật**: Mọi đầu vào từ người dùng (User Input) phải được sanitize trước khi render.
