import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CVViewPage } from './pages/CVViewPage';
import { CVEditorPage } from './pages/CVEditorPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppLayout: React.FC<{
  darkMode: boolean;
  toggleDarkMode: () => void;
}> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Hide marketing Navbar in dedicated fullscreen studio editor to prevent header duplication */}
      {!isEditor && <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}

      {/* Dynamic Route Content */}
      <div className="flex-1">
        <Routes>
          {/* Route 1: Home / Explore Directory */}
          <Route path="/" element={<HomePage />} />

          {/* Route 2: Interactive CV Editor Dashboard */}
          <Route
            path="/editor"
            element={<CVEditorPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
          />
          <Route
            path="/editor/:id"
            element={<CVEditorPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
          />

          {/* Route 3: Public CV View by id or slug */}
          <Route
            path="/cv/:id"
            element={<CVViewPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
          />

          {/* Route 3b: Alias /u/:id */}
          <Route
            path="/u/:id"
            element={<CVViewPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
          />

          {/* Route 4: 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Global Footer (hidden on editor and print) */}
      {!isEditor && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  // Global Dark Mode state (defaults to system preference or false)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('cv_studio_theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cv_studio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
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
