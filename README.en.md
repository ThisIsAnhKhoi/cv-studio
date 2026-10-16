# CV Studio — Modern Online CV & Portfolio Platform

<p align="center">
  <strong>Build, customize, and share professional, print-accurate A4 CVs and portfolios online.</strong>
</p>

<p align="center">
  <a href="#project-status"><img src="https://img.shields.io/badge/Status-v0.4.0%20(95.2%25)-success?style=flat-square" alt="Status" /></a>
  <a href="#automated-testing"><img src="https://img.shields.io/badge/Vitest-132%2F132%20Passed-brightgreen?style=flat-square" alt="Tests" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-0%20Errors-blue?style=flat-square" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" /></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=flat-square" alt="Firebase" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-61dafb?style=flat-square" alt="React" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square" alt="Tailwind CSS" /></a>
</p>

<p align="center">
  <a href="README.md"><strong>Bản Tiếng Việt (README.md)</strong></a> | <a href="#quick-start-in-5-minutes"><strong>Quick Start</strong></a> | <a href="docs/ARCHITECTURE.md"><strong>Architecture</strong></a> | <a href="docs/QA_AUDIT_v2.md"><strong>QA Audit Report v2</strong></a> | <a href="CHANGELOG.md"><strong>Changelog</strong></a>
</p>

---

## 1. Overview

**CV Studio** is a full-featured, secure, and modern online CV & Portfolio platform engineered with Clean Architecture to help candidates build and share print-accurate A4 resumes.

- **Problem**: Most online resume builders impose rigid structures, break on Vietnamese diacritics, distort print outputs, or paywall basic draft saving.
- **Solution**: A production-grade React + TypeScript platform:
  - Real-time keystroke live preview.
  - Strict decoupling of resume data (`CVData`) from templates via the **Template Registry Pattern**.
  - **Firebase Authentication** (Google 1-click & Email) and dual-layer **Cloud Firestore** synchronization with local fallback.
  - **3-Tier RBAC Admin Subsystem** (Super Admin, Admin, Moderator) with immutable audit logging.
  - TipTap Rich Text Editor for career summaries and 16 dynamic social platform integrations.
- **Target Audience**: Developers, Designers, Data Specialists, Marketers, HR Managers, and Platform Administrators.

---

## 2. Project Status (v0.4.0 — October 16, 2026)

> [!NOTE]
> **Technical completion is at 95.2% (v0.4.0 Release).**  
> Firebase Auth, Cloud Firestore persistence, 3-tier RBAC admin dashboard, atomic view counter, and cleaned production database are verified. The test suite passes **132/132 automated tests (21 test suites)** with **0 TypeScript compiler errors**.

### Feature Matrix

| Feature / Module | Status | Technical Details |
|:---|:---:|:---|
| **Showcase Homepage (`/`)** | ✅ Done | Curated Top 6 most viewed CVs with direct navigation to the full Explore directory. |
| **Explore Directory (`/explore`)** | ✅ Done | 7 standardized career domains, Vietnamese unaccented search, fast pagination. |
| **Public CV View (`/cv/:id`)** | ✅ Done | Print-accurate A4 canvas, Action Bar for switching templates, colors, fonts, link sharing, and email. |
| **3 Production Templates** | ✅ Done | Classic Teal (sidebar), Warm Bold (Tangerine), Modern Minimal. |
| **User Authentication (Firebase Auth)** | ✅ Done | Google 1-click & Email/Password login, reactive auth modal, Vietnamese error mapping. |
| **Cloud Persistence (Cloud Firestore)** | ✅ Done | Realtime storage via `cvStorageService.ts` with offline-first `localStorage` fallback. |
| **Personal Dashboard (`/dashboard`)** | ✅ Done | Resume management, create, edit, duplicate, soft-delete, and Public/Private visibility toggle. |
| **RBAC Admin Guard (`/admin`)** | ✅ Done | 3 tiers (Super Admin, Admin, Moderator), `<AdminAuthGuard />`, custom 403 Forbidden screen. |
| **Resume Moderation (`/admin/cvs`)** | ✅ Done | Soft-disable & restore CVs with mandatory reason ($\ge 5$ chars) and automated audit logging. |
| **User Management (`/admin/users`)** | ✅ Done | Role promotion/demotion, account locking with atomic batch disabling of owned CVs. |
| **Immutable Audit Log (`/admin/logs`)** | ✅ Done | Secure logging of sensitive operations; locked from updates and deletions via Firestore rules. |
| **Atomic View Counter** | ✅ Done | Atomic `increment(1)`, 30-min session deduplication, and CV owner exemption. |
| **Rich Text Editor (TipTap)** | ✅ Done | Rich text formatting for summary & objectives (Bold, Italic, Underline, Fonts, Colors, Bullets). |
| **Dynamic Social Platforms** | ✅ Done | 16 platforms supported (GitHub, LinkedIn, Behance, YouTube...) with auto-overflow truncation. |
| **63 Provinces & Google Maps** | ✅ Done | Vietnam province dropdown with 1-click Google Maps coordinate locator. |
| **Native Date Picker** | ✅ Done | Standard date picker converting ISO inputs to Vietnamese `DD/MM/YYYY` format. |
| **Seamless Dark Mode (Zero-FOUC)** | ✅ Done | Synchronous `<head>` blocking script eliminating white reload flashes. |
| **Stored XSS Prevention** | ✅ Done | `formatSafeUrl()` and `DOMPurify` sanitize dangerous URLs and rich HTML snippets. |
| **Native Print Engine** | 🚧 Deferred | Preparing native CSS `@media print` A4 engine; download button temporarily disabled for polish. |

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

- **Core**: React 18.3, TypeScript 5.6 (Strict Mode, 0 Errors), Vite 5.4.
- **Styling**: Tailwind CSS 3.4, PostCSS, Autoprefixer, Custom Print CSS `@media print`.
- **Routing**: React Router DOM v7 (Client-side routing with lazy-split Admin & Explore chunks).
- **Backend as a Service (BaaS)**: Firebase Authentication & Cloud Firestore (NoSQL, Atomic increments, Security Rules).
- **State Management**: Zustand v5 (Auth Store, CV Store, Theme Store).
- **Rich Text Suite**: TipTap (@tiptap/react, starter-kit, color, font-family, text-style, underline) + DOMPurify.
- **Icons**: Lucide React (50+ vector icons).
- **Testing**: Vitest 2.1, @testing-library/react, @testing-library/dom, JSDOM (132 tests, 21 test suites).
- **Typography**: Google Fonts (`Outfit`, `Be Vietnam Pro`) + self-hosted WOFF2 fonts (`iCiel Cubano`, `SVN-Optima`, `Gilroy`, `Montserrat`).

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
 ✓ src/features/admin/__tests__/AdminAuthGuard.test.tsx (6 tests)
 ✓ src/features/admin/__tests__/adminModeration.test.ts (8 tests)
 ✓ src/features/view-counter/__tests__/useCVViewCount.test.ts (7 tests)
 ✓ src/features/explore/__tests__/exploreFilter.test.ts (9 tests)
 ... and 14 other test suites

 Test Files  21 passed (21)
      Tests  132 passed (132)
   Duration  43.46s
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
