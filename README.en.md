# CV Studio — Modern Online CV & Portfolio Platform

<p align="center">
  <strong>Build, customize, and share professional, print-accurate A4 CVs and portfolios online.</strong>
</p>

<p align="center">
  <a href="#project-status"><img src="https://img.shields.io/badge/Status-Prototype%20v0.1.0-orange?style=flat-square" alt="Status" /></a>
  <a href="#automated-tests"><img src="https://img.shields.io/badge/Vitest-15%2F15%20Passed-brightgreen?style=flat-square" alt="Tests" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-61dafb?style=flat-square" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square" alt="Tailwind CSS" /></a>
</p>

<p align="center">
  <a href="README.md"><strong>Bản Tiếng Việt (README.md)</strong></a> | <a href="#quick-start-in-5-minutes"><strong>Quick Start</strong></a> | <a href="docs/ARCHITECTURE.md"><strong>Architecture</strong></a> | <a href="CHANGELOG.md"><strong>Changelog</strong></a>
</p>

---

## 1. Overview

**CV Studio** is an open-source, client-side Single Page Application (SPA) designed to help software engineers, product designers, and professionals build elegant, typography-optimized, print-ready CVs and personal portfolios.

- **Problem**: Most existing online CV builders enforce rigid layouts, suffer from Vietnamese accent font glitches, produce broken PDF exports, or require subscriptions just to save editing drafts.
- **Solution**: A modular React + TypeScript architecture:
  - Real-time keystroke live preview.
  - Strict decoupling of resume data (`CVData`) from visual representation using the **Template Registry Pattern**.
  - ID-isolated local storage draft persistence with auto-save debouncing.
- **Target Audience**: Developers, UX/UI Designers, Data Scientists, Marketers, and HR specialists looking for a modern personal CV page.

---

## 2. Project Status

> [!NOTE]
> **This project is currently a Client-Side Prototype (v0.1.0).**  
> All profiles and editor modifications are stored locally in the browser's `localStorage`. The platform currently **has no backend database or authentication integrated**. Firebase Auth and Cloud Firestore integration are scheduled for Phases 3 and 4.

### Feature Matrix

| Feature / Module | Status | Technical Details |
|:---|:---:|:---|
| **Explore Directory (`/`)** | ✅ Done | Keyword search (name/skills) and industry category filters (Tech, Design, Data & AI, Marketing, HR). |
| **Public CV View (`/cv/:id`)** | ✅ Done | Standard A4 canvas, shareable link bar, print action, and quick edit toggle. |
| **Template 1: Classic Teal** | ✅ Done | 2-column sidebar layout in deep teal, space-efficient and elegant. |
| **Template 2: Warm Bold** | ✅ Done | Tangerine warm palette with prominent cards, tailored for Senior & Lead roles. |
| **Template 3: Modern Minimal** | ✅ Done | International minimalist styling, light typography, and clean white space. |
| **Interactive Editor (`/editor/:id`)** | ✅ Done | Split-screen workspace: 9 accordion form sections on the left, live A4 preview on the right. |
| **Draft Persistence** | ✅ Done | 600ms debounce auto-save, isolated per CV ID (`cv_studio_draft_${id}`), survives page reload (F5). |
| **Dynamic Theme Customizer** | ✅ Done | Live switching across 6 accent color presets, 5 typography sets, and Dark/Light paper modes. |
| **Seamless Dark Mode (Zero-FOUC)** | ✅ Done | Zero flash of unstyled content on reload via synchronous blocking script in `<head>`. |
| **Stored XSS Prevention** | ✅ Done | `formatSafeUrl()` sanitizes malicious `javascript:` and `data:` schemes in user-supplied links. |
| **404 Routing Fallback** | ✅ Done | Graceful `<NotFoundPage />` display when an invalid CV ID or slug is requested. |
| **Font Subsetting & Bundle Optimization** | 🚧 In Progress | Phase 2: Convert local fonts to WOFF2 (< 400 kB) and code-split routes via `React.lazy()`. |
| **State Management (Zustand)** | 🚧 In Progress | Phase 2: Migrate `useCVEditor` hook to a global Zustand Store. |
| **Authentication (Firebase Auth)** | ⏳ Planned | Phase 3: Google 1-click & Email/Password login, `isOwner` permission checks. |
| **Cloud Storage (Cloud Firestore)** | ⏳ Planned | Phase 4: Multi-device sync and real personal portfolio URL publishing. |
| **Avatar Upload (Cloudinary)** | ⏳ Planned | Phase 4: Local image upload with automatic 1:1 face crop and WebP compression. |
| **Native Print Engine** | ⏳ Planned | Phase 5: Standardize native CSS `@media print` A4, deprecate and remove legacy `html2pdf.js`. |

---

## 3. Screenshots

### Explore Directory
![Explore Directory](docs/images/01-homepage-showcase.png)

### Split-Screen CV Editor
![Split-Screen CV Editor](docs/images/03-cv-editor-split-view.png)

### Public CV View
![Public CV View](docs/images/02-cv-public-view.png)

---

## 4. Tech Stack

- **Core**: React 18, TypeScript 5.6, Vite 5.4.
- **Styling**: Tailwind CSS 3.4, PostCSS, Autoprefixer.
- **Routing**: React Router DOM v7.
- **Icons**: Lucide React.
- **Testing**: Vitest 2.1, @testing-library/react, @testing-library/dom, JSDOM.
- **Typography**: Google Fonts (`Outfit`, `Be Vietnam Pro`) + self-hosted typefaces (`iCiel Cubano`, `SVN-Optima`, `Gilroy`, `Montserrat`).

---

## 5. Quick Start in 5 Minutes

### Prerequisites
- **Node.js**: `18.x` or `20.x` LTS.
- **Package Manager**: `npm` `9.x` or higher.

### 1. Clone the repository
```bash
git clone https://github.com/JunWinpro/cv-studio.git
cd cv-studio
```

### 2. Install dependencies
```bash
cd frontend
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000/`.

### 4. Build for production
```bash
npm run build
```
Production assets are generated in `frontend/dist/`.

---

## 6. Automated Testing

Run the Vitest test suite:
```bash
cd frontend
npm run test
```

```text
 ✓ src/utils/__tests__/url.test.ts (6 tests)
 ✓ src/data/__tests__/mockProfiles.test.ts (4 tests)
 ✓ src/features/cv-editor/hooks/__tests__/useCVEditor.test.ts (5 tests)

 Test Files  3 passed (3)
      Tests  15 passed (15)
   Duration  2.38s
```

---

## 7. Adding a New CV Template

1. Create a new directory in `frontend/src/features/cv-templates/template-name/`.
2. Implement your component matching the standard `TemplateProps` interface:
   ```typescript
   import { CVData, ThemeConfig } from '../../../types/cv';

   export const CVTemplateMyStyle: React.FC<{ data: CVData; theme: ThemeConfig }> = ({ data, theme }) => {
     return <div className="page-a4">...</div>;
   };
   ```
3. Register it inside `TemplateRegistry.ts`. It will automatically appear in both the editor and the viewer menus!

---

## 8. Security & Known Issues

- **Legacy PDF dependencies**: The temporary `html2pdf.js@0.10.2` library has 2 critical CVEs (BUG-005). Client-side PDF generation is deferred; native browser printing (Ctrl + P) is recommended.
- **Local typefaces**: Bundled fonts are included for educational preview purposes. For commercial deployment, acquire the appropriate commercial font licenses or switch to Google Fonts.
- To report vulnerabilities responsibly, please review [SECURITY.md](SECURITY.md).

---

## 9. License

Distributed under the [MIT License](LICENSE).  
Copyright © 2026 **Tran Anh Khoi** and Contributors.
