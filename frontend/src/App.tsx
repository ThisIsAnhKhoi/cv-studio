import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageSkeleton } from './components/common/PageSkeleton';
import { AuthModal } from './components/auth/AuthModal';
import { useAuthStore } from './stores/useAuthStore';

// Route-level code-splitting
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const CVViewPage = lazy(() => import('./pages/CVViewPage').then((m) => ({ default: m.CVViewPage })));
const CVEditorPage = lazy(() => import('./pages/CVEditorPage').then((m) => ({ default: m.CVEditorPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const AppLayout: React.FC<{
  darkMode: boolean;
  toggleDarkMode: () => void;
}> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Global Firebase Auth Modal */}
      <AuthModal />

      {/* Hide marketing Navbar in dedicated fullscreen studio editor to prevent header duplication */}
      {!isEditor && <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}

      {/* Dynamic Route Content with Suspense boundary */}
      <div className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* Route 1: Home / Explore Directory */}
            <Route path="/" element={<HomePage />} />

            {/* Route 2: User CV Management Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Route 3: Interactive CV Editor Studio */}
            <Route
              path="/editor"
              element={<CVEditorPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
            />
            <Route
              path="/editor/:id"
              element={<CVEditorPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
            />

            {/* Route 4: Public CV View by id or slug */}
            <Route
              path="/cv/:id"
              element={<CVViewPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
            />

            {/* Route 4b: Alias /u/:id */}
            <Route
              path="/u/:id"
              element={<CVViewPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
            />

            {/* Route 5: 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>

      {/* Global Footer (hidden on editor and print) */}
      {!isEditor && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  const initAuth = useAuthStore((s) => s.initAuth);

  // Initialize Firebase Auth listener on startup
  useEffect(() => {
    const unsubscribe = initAuth();
    return () => {
      unsubscribe();
    };
  }, [initAuth]);

  // Global Dark Mode state (defaults to current class on documentElement, localStorage or system preference)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return (
      localStorage.getItem('cv_studio_theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('cv_studio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('cv_studio_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <AppLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </BrowserRouter>
  );
};

export default App;
