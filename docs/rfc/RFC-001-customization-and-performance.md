# RFC-001: KIẾN TRÚC TÙY BIẾN THEO PHẦN, ZUSTAND STORE VÀ TỐI ƯU HIỆU NĂNG BUNDLE / FONT

- **Tác giả:** Senior Frontend Architect kiêm Engineer
- **Ngày ban hành:** 13/10/2026
- **Trạng thái:** Proposed (Chờ duyệt)
- **Phạm vi:** Giai đoạn 2 (Brief 4a, Brief 4b, Brief 5, Brief 6)
- **Tài liệu tham chiếu:** `y_tuong.txt`, `DECISIONS.md`, `docs/baseline/BASELINE-20261013.md`, `TEST_PLAN.md`

---

## 1. TỔNG QUAN & MỤC TIÊU KỸ THUẬT

### 1.1. Bối cảnh
CV Studio là ứng dụng client-side prototype chạy trên Vite + React 18 + TypeScript + Tailwind CSS. Đo lường cơ sở (Pha 0) cho thấy:
1. Entry chunk JS đang ở mức **1,045.30 kB (297.31 kB gzip)** do tải tĩnh tất cả các trang, cả 3 mẫu CV và thư viện PDF nặng (`html2pdf.js`/`jspdf`).
2. Tài nguyên phông chữ gồm **39 tệp `.otf` tĩnh** nặng **5.41 MB**, ngốn băng thông và làm chậm First Contentful Paint (FCP).
3. State quản lý phân tán trong hook `useCVEditor` (`useState` cục bộ), chưa sẵn sàng cho việc tích hợp Auth và Dashboard đa CV.
4. Chưa hỗ trợ tùy biến chi tiết màu sắc và font chữ theo từng phần của CV, người dùng bị gò bó vào preset cứng của mẫu.

### 1.2. Mục tiêu kỹ thuật đo lường được
- **Hiệu năng Bundle (Brief 4b):** Chunk JS chính của ứng dụng giảm từ **1,045 kB xuống dưới 500 kB** (kỳ vọng thực tế: < 350 kB thô / < 100 kB gzip).
- **Hiệu năng Phông chữ (Brief 4a):** Chuyển đổi toàn bộ 39 file `.otf` sang WOFF2 Google Fonts có subsetting (`vietnamese` + `latin`). Dung lượng tải phông ban đầu **dưới 400 kB**.
- **Quản lý State (Brief 5):** Chuyển đổi toàn bộ logic của `useCVEditor` sang Zustand v5 store toàn cục, hỗ trợ middleware `persist` có migration versioning, tương thích ngược 100% với dữ liệu draft cũ.
- **Tính năng mới Tùy biến theo phần (Brief 6):** Người dùng được tự do đổi màu chữ, màu nhấn và font chữ cho từng phần trong 9 phần của CV thông qua CSS Custom Properties; có color picker hợp lệ `#RRGGBB`, kiểm tra độ tương phản WCAG 2.1, nút "Đặt lại" và "Áp dụng cho tất cả".

---

## 2. CHỦ ĐỀ A: ZUSTAND V5 & QUẢN LÝ STATE TOÀN CỤC (BRIEF 5)

### 2.1. Thiết kế Store & Cấu trúc Slice
Thay vì gộp toàn bộ vào một monolithic state, store được thiết kế theo cấu trúc module rõ ràng (`src/stores/useCVStore.ts`):
- `cvData`: Dữ liệu nội dung CV (9 phần + `themeConfig`).
- `saveStatus`: `'saved' | 'saving' | 'unsaved'`.
- `activeSection`: Khối đang được chọn để tùy biến trong Editor.
- `history`: Dự phòng cho trạng thái dirty.

### 2.2. Tránh vòng lặp Render vô hạn trong Zustand v5
Zustand v5 thay đổi cơ chế equality check mặc định (dùng `Object.is`). Nếu selector trả về một object hoặc mảng mới ở mỗi lần gọi, component sẽ rơi vào vòng lặp re-render vô tận.
- **Giải pháp:**
  1. Ưu tiên selector trả về kiểu dữ liệu nguyên thủy (primitive):  
     `const fullName = useCVStore((s) => s.cvData.personalInfo.fullName);`
  2. Với selector trả về object/array slice, bắt buộc dùng `useShallow` từ `zustand/react/shallow`:  
     `const personalInfo = useCVStore(useShallow((s) => s.cvData.personalInfo));`

### 2.3. Chiến lược Persist & Schema Migration
Sử dụng middleware `persist` của Zustand với cấu hình nghiêm ngặt:
- **Tên khóa lưu trữ:** Động theo CV ID: `name: 'cv_studio_draft_' + id`.
- **`partialize`:** Chỉ tuần tự hóa dữ liệu `cvData`, loại bỏ hoàn toàn các hàm action và trạng thái UI tạm thời (`saveStatus`, `activeSection`).
- **Phiên bản Schema & Hàm Migrate:**
  ```ts
  version: 2,
  migrate: (persistedState: any, version: number) => {
    if (version === 0 || version === 1 || !version) {
      // Migrate từ dữ liệu cũ (chưa có schemaVersion và sectionStyles)
      return {
        ...persistedState,
        schemaVersion: 2,
        themeConfig: {
          ...persistedState.themeConfig,
          schemaVersion: 2,
          sectionStyles: persistedState.themeConfig?.sectionStyles || {},
        },
      };
    }
    return persistedState;
  }
  ```
- **Kiểm thử hồi quy:** Được kiểm chứng trực tiếp bằng fixture `legacyDraftFixture.json`.

### 2.4. Cơ chế Auto-Save Debounce
- Đặt timer debounce (600ms) tại tầng Store Subscription (`useCVStore.subscribe`), không đặt trong từng component UI.
- Khi state thay đổi $\rightarrow$ set `saveStatus = 'unsaved'`.
- Debounce 600ms $\rightarrow$ set `saveStatus = 'saving'` $\rightarrow$ ghi vào `localStorage` $\rightarrow$ 300ms sau set `saveStatus = 'saved'`.
- Tương thích React 18 StrictMode: Quản lý ID của `setTimeout` trong biến closure an toàn, hủy timer khi đổi route hoặc đóng trang.

### 2.5. Chuyển đổi an toàn: Strangler Fig Pattern
- Trong giai đoạn đầu, giữ lại hook `useCVEditor` như một lớp bọc mỏng (wrapper facade) ủy quyền đọc/ghi vào `useCVStore`.
- Toàn bộ 20 bài test đã viết ở Pha 0 tiếp tục chạy pass 100%.
- Sau khi kiểm thử toàn diện, các component sẽ dần kết nối trực tiếp vào `useCVStore`, giảm thiểu tối đa rủi ro hồi quy.

---

## 3. CHỦ ĐỀ B: KIẾN TRÚC TÙY BIẾN THEO TỪNG PHẦN (BRIEF 6)

### 3.1. Mô hình dữ liệu mở rộng
Mở rộng `ThemeConfig` mà không làm thay đổi các trường cốt lõi hiện có:

```ts
export type SectionId =
  | 'header'
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'certificates';

export interface SectionStyleConfig {
  headingColor?: string; // Mã hex chuẩn #RRGGBB
  textColor?: string;    // Mã hex chuẩn #RRGGBB
  accentColor?: string;   // Mã hex chuẩn #RRGGBB
  headingFont?: string;   // ID font trong fontRegistry
  bodyFont?: string;      // ID font trong fontRegistry
}

export interface ThemeConfig {
  primaryColor: string;
  fontFamily: string;
  templateId: string;
  schemaVersion?: number;
  sectionStyles?: Partial<Record<SectionId, SectionStyleConfig>>;
}
```

*Quy tắc bất biến:* Khóa theo `SectionId` thay vì `templateId` để khi người dùng đổi giữa 3 mẫu CV, mọi tùy biến màu và font đã chỉnh vẫn được giữ nguyên.

### 3.2. Cơ chế áp dụng qua CSS Custom Properties (Tránh bẫy Tailwind)
- **Cấm tuyệt đối:** Không ghép chuỗi động vào class Tailwind (ví dụ `text-[${color}]`) vì Tailwind biên dịch class tĩnh tại thời điểm build (JIT scanner), chuỗi động sẽ không sinh ra CSS.
- **Giải pháp chuẩn kiến trúc:** Sử dụng CSS Custom Properties gắn trên thẻ bao bọc (wrapper) của từng section:
  ```tsx
  <section
    style={{
      '--sec-heading-color': style?.headingColor || 'var(--color-primary)',
      '--sec-text-color': style?.textColor || 'var(--color-text)',
      '--sec-accent-color': style?.accentColor || 'var(--color-accent)',
      '--sec-heading-font': style?.headingFont ? `"${style.headingFont}", sans-serif` : 'inherit',
      '--sec-body-font': style?.bodyFont ? `"${style.bodyFont}", sans-serif` : 'inherit',
    } as React.CSSProperties}
    className="section-container"
  >
  ```
- Các phần tử con trong template áp dụng biến CSS này kèm giá trị fallback chuẩn:
  `color: var(--sec-heading-color, var(--color-primary))`

### 3.3. Bảo mật & Xác thực Đầu vào
- Chỉ chấp nhận mã màu hex dạng chuẩn: `/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/`.
- Chuẩn hóa tự động về `#RRGGBB` chữ hoa.
- Từ chối tuyệt đối mọi chuỗi chứa ký tự nguy hiểm: `url(`, `;`, `expression`, `javascript:`, `<script>`, dấu ngoặc nhọn `{}`.
- Font chữ chỉ được chọn từ danh sách khóa trong `fontRegistry.ts`, từ chối nhận chuỗi font tùy ý từ bên ngoài.

### 3.4. Kiểm tra Tương phản WCAG 2.1 (Tự động Cảnh báo)
- Viết utility `calculateContrastRatio(colorHex, bgHex)` theo chuẩn WCAG:
  1. Chuyển đổi Hex sang RGB.
  2. Tính độ chói tương đối (Relative Luminance):  
     $L = 0.2126 \times R_{lin} + 0.7152 \times G_{lin} + 0.0722 \times B_{lin}$
  3. Tỷ lệ tương phản: $\text{Ratio} = (L_1 + 0.05) / (L_2 + 0.05)$.
- **Ngưỡng kiểm tra:**
  - Chữ thường: tối thiểu 4.5:1.
  - Tiêu đề / chữ lớn: tối thiểu 3.0:1.
- Nếu không đạt ngưỡng: Hiển thị thanh cảnh báo trực quan mềm: *"Độ tương phản thấp (2.8:1) - Khó đọc trên nền giấy sáng"*. Không chặn người dùng lưu nhưng khuyến cáo điều chỉnh.

### 3.5. Trải nghiệm Color Picker & Tối ưu Render
- Sử dụng kết hợp: Bảng màu gợi ý theo template (Palette presets) + Ô nhập Hex có kiểm tra tính hợp lệ + Color Picker native có nhãn truy cập bàn phím.
- **Tối ưu kéo chọn màu:** State màu cục bộ được giữ trong component Picker; khi kéo thả chỉ phát sự kiện cập nhật xem trước qua `requestAnimationFrame` hoặc `startTransition`, tránh kích hoạt auto-save ghi đĩa liên tục 60 lần/giây.
- **Hành động khôi phục:**
  - Nút *"Đặt lại phần này"*: Xóa ghi đè của section tương ứng, quay về mặc định của template.
  - Nút *"Đặt lại toàn bộ"*: Xóa toàn bộ `sectionStyles`.
  - Nút *"Áp dụng cho tất cả"*: Sao chép cấu hình màu/font của section hiện tại vào tất cả các section còn lại.

---

## 4. CHỦ ĐỀ C: CHIẾN LƯỢC PHÔNG CHỮ & SUBSETTING WOFF2 (BRIEF 4A)

### 4.1. Chuyển đổi từ OTF (5.4 MB) sang WOFF2 Google Fonts
- Định dạng WOFF2 nén thuật toán Brotli nhẹ hơn OTF từ 70% đến 85%.
- Áp dụng kỹ thuật chia dải ký tự (`unicode-range`):
  - Dải `vietnamese`: `U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB` (~15-25 kB/file).
  - Dải `latin`: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` (~20-30 kB/file).
- **Ngân sách tải ban đầu < 400 kB:**
  - Khi người dùng tải trang lần đầu, chỉ nạp font hệ thống và font mặc định của template đang mở (khoảng 2 font x 2 weight = ~80-120 kB).
  - Các font khác trong registry được nạp động khi người dùng chọn vào.

### 4.2. Danh mục Phông chữ Kiểm chứng (`fontRegistry.ts`)
Tất cả các font trong danh sách bắt buộc phải vượt qua bài kiểm tra hiển thị 100% tiếng Việt với chuỗi mẫu:  
*"Họ và tên: Nguyễn Văn Triệu Đô - ệ, ữ, ỳ, Ặ, đ, Đ, ơ, ư, ẵ, ặ, ẳ, ấ, ầ, ẩ, ẫ, ậ"*

Khởi tạo 7 họ font tiêu chuẩn:
1. **Montserrat** (Sans-serif): Hiện đại, mạnh mẽ, tiêu đề ấn tượng.
2. **Be Vietnam Pro** (Sans-serif): Thiết kế chuyên biệt cho tiếng Việt bởi chuyên gia Việt Nam, hoàn hảo cho tech/CV.
3. **Outfit** (Sans-serif): Hình khối tối giản, phong cách quốc tế.
4. **Inter** (Sans-serif): Chuẩn mực công nghiệp cho văn bản nội dung, cực kỳ dễ đọc.
5. **Playfair Display** (Serif): Sang trọng, hàn lâm, cổ điển.
6. **Merriweather** (Serif): Trang nhã, chuẩn mực in ấn văn phòng.
7. **Pacifico** (Display): Viết tay nghệ thuật, phù hợp phần chữ ký hoặc portfolio sáng tạo.

### 4.3. Chống Nhảy Phông (FOUT) & Dịch chuyển Bố cục (CLS)
- Khai báo `@font-face` với `font-display: swap`.
- Thiết lập font fallback hệ thống có cùng tỷ lệ:
  `font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`
- Đợi `document.fonts.ready` trước khi chụp ảnh màn hình hoặc in ấn.
- Dọn dẹp an toàn: Chỉ xóa thư mục `public/fonts` 39 file cũ sau khi đã xác nhận hệ thống mới hoạt động trơn tru.

---

## 5. CHỦ ĐỀ D: CODE-SPLITTING & TỐI ƯU BUNDLE (BRIEF 4B)

### 5.1. Phân tích Nguyên nhân Gốc rễ Entry Chunk 1,045 kB
1. **Tải tĩnh 100% trang:** `App.tsx` import tĩnh `HomePage`, `CVViewPage`, `CVEditorPage`, `NotFoundPage`.
2. **Nạp cứng thư viện PDF:** `exportPdfService.ts` import `html2pdf.js`, kéo theo `jspdf` và `html2canvas` (~600 kB) vào bundle ban đầu.
3. **Template Registry tải tĩnh:** Cả 3 template và toàn bộ Lucide icons đi kèm đều bị kéo vào trang chủ.

### 5.2. Giải pháp Triển khai
1. **Route-level Code-splitting:**
   ```tsx
   const HomePage = React.lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
   const CVEditorPage = React.lazy(() => import('./pages/CVEditorPage').then(m => ({ default: m.CVEditorPage })));
   const CVViewPage = React.lazy(() => import('./pages/CVViewPage').then(m => ({ default: m.CVViewPage })));
   const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
   ```
   Bọc `<Suspense fallback={<PageSkeleton />}>` với layout skeleton cố định chiều cao để không gây giật màn hình.
2. **Dynamic Import cho Thư viện Xuất PDF:**
   Chuyển đổi `exportPdfService.ts` sang nạp lười:
   ```ts
   export async function exportCVToPDF(elementId: string, filename: string): Promise<boolean> {
     const html2pdf = (await import('html2pdf.js')).default;
     // thực thi xuất PDF...
   }
   ```
   Hành động này ngay lập tức tách rời ~600 kB ra khỏi entry chunk!
3. **Tách Vendor Chunks qua Rollup:**
   Cấu hình `vite.config.ts`:
   ```ts
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'react-vendor': ['react', 'react-dom', 'react-router-dom'],
           'lucide-icons': ['lucide-react'],
         }
       }
     }
   }
   ```
4. **Kết quả kỳ vọng:** Entry chunk `index.js` giảm xuống **dưới 350 kB** (vượt xa chỉ tiêu 500 kB).

---

## 6. CHIẾN LƯỢC KIỂM THỬ TỰ ĐỘNG & BẢNG BẪY CẦN PHÒNG

### 6.1. Kim tự tháp kiểm thử
1. **Unit Tests (Vitest):**
   - Xác thực mã màu hex: chuỗi hợp lệ, mã độc, viết hoa/thường.
   - Tính toán tỷ lệ tương phản WCAG: kiểm tra ngưỡng 4.5:1 và 3:1.
   - Hàm migrate schema: kiểm thử nạp `legacyDraftFixture.json` và đảm bảo ra output version 2 đầy đủ.
   - Font Registry: kiểm tra tên, phân nhóm, dải glyph tiếng Việt.
2. **Integration Tests (React Testing Library):**
   - Hook `useCVStore`: các action thêm/xóa/sửa, debounce auto-save, khôi phục từ localStorage.
   - Component `SectionCustomizer`: tương tác chọn màu, đổi font, nút reset, cảnh báo tương phản.
3. **Visual Invariant Tests:**
   - Template không có cấu hình tùy biến phải hiển thị giống 100% so với baseline.

### 6.2. Bảng 14 Bẫy Kiến Trúc & Giải Pháp Phòng Ngừa
| STT | Bẫy Tiềm Ẩn | Mức Độ | Giải Pháp Phòng Ngừa Triệt Để |
| :--- | :--- | :--- | :--- |
| 1 | Vòng lặp render vô tận Zustand v5 | Nguy hiểm | Luôn dùng primitive selector hoặc bọc `useShallow` cho object/array. |
| 2 | Chớp dữ liệu mặc định khi hydrate | Trung bình | Khởi tạo state đọc ngay từ `localStorage` hoặc hiển thị skeleton khi chưa hydrate. |
| 3 | Auto-save timer nhân đôi ở StrictMode | Cao | Quản lý timeout ID trong closure/ref an toàn, dọn dẹp khi unmount. |
| 4 | Ghi đè nháp giữa các CV khác nhau | Nguy hiểm | Khóa lưu trữ luôn phân vùng theo CV ID: `cv_studio_draft_${id}`. |
| 5 | Class Tailwind động không sinh CSS | Cao | Tuyệt đối không dùng `text-[${color}]`; dùng biến CSS inline `style={{ '--sec-...': val }}`. |
| 6 | Biến CSS bị template ghi đè cứng | Trung bình | Rà soát template, thay các class màu cố định thành `var(--sec-..., var(--default))`. |
| 7 | Tương phản kém trên nền tối/cột màu | Cao | Thuật toán WCAG 2.1 tính toán theo nền thực tế của từng cột/khối và cảnh báo rõ. |
| 8 | Đổi mẫu CV làm mất tùy biến | Cao | Lưu `sectionStyles` theo `SectionId` độc lập với `templateId`. |
| 9 | Font thiếu glyph tiếng Việt gây nhảy chữ | Nguy hiểm | Kiểm chứng danh sách font với bộ chữ đầy đủ dấu thanh trước khi đưa vào registry. |
| 10 | Nhảy bố cục (CLS) khi nạp font | Trung bình | `font-display: swap` kèm font fallback đồng tỉ lệ. |
| 11 | Nạp quá nhiều font gây nghẽn mạng | Cao | Chỉ nạp font khi được chọn (on-demand), initial load dưới 400 kB. |
| 12 | Color picker làm giật lag máy yếu | Cao | Cập nhật tạm trong state cục bộ; ghi store qua `startTransition`/thả chuột. |
| 13 | Chèn mã độc CSS qua ô nhập màu | Nguy hiểm | Lọc regex nghiêm ngặt `^#[0-9A-Fa-f]{6}$`, từ chối mọi chuỗi bất thường. |
| 14 | Màn hình trắng khi tải lazy route | Trung bình | Bọc `<Suspense>` kèm `<PageSkeleton />` mượt mà, không giật layout. |
