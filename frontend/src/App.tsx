import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CVViewPage } from './pages/CVViewPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
        {/* Persistent Platform Navigation Bar */}
        <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

        {/* Dynamic Route Content */}
        <div className="flex-1">
          <Routes>
            {/* Route 1: Home / Explore Directory */}
            <Route path="/" element={<HomePage />} />

            {/* Route 2: Public CV View by id or slug */}
            <Route
              path="/cv/:id"
              element={<CVViewPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
            />

            {/* Route 2b: Alias /u/:id */}
            <Route
              path="/u/:id"
              element={<CVViewPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />}
            />

            {/* Route 3: 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

        {/* Global Footer (hidden on print) */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
