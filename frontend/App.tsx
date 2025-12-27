import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { JCSProvider, useJCS } from './services/JCSContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SubmitEvent from './pages/SubmitEvent';
import AdminPanel from './pages/AdminPanel';
import EventGallery from './pages/EventGallery';
import Reports from './pages/Reports';
import Leaderboard from './pages/Leaderboard';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import { Menu } from 'lucide-react';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './components/ToastContext';

// Layout component for authenticated/sidebar views
const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-page text-main font-sans transition-colors duration-300 overflow-x-hidden">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:ml-64">

        {/* Mobile Header */}
        <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-muted hover:text-brand-600 focus:outline-none p-1 rounded-md active:bg-slate-100 dark:active:bg-slate-800"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-main text-lg">JCS Portal</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[100vw]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Wrapper to handle layout and routing based on auth state
const AppContent = () => {
  const { currentUser, isLoading } = useJCS();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page text-main">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // ALL users (including guests) see the sidebar and main content
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Portfolio Landing Page at Root */}
        <Route path="/" element={<MainPage />} />

        {/* Full Page Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Main Application Layout */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<EventGallery />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Protected Routes - Coordinator */}
          <Route path="/submit" element={currentUser?.role === 'Coordinator' ? <SubmitEvent /> : <Navigate to="/dashboard" />} />
          <Route path="/my-events" element={currentUser?.role === 'Coordinator' ? <EventGallery myEventsOnly={true} /> : <Navigate to="/dashboard" />} />

          {/* Protected Routes - Admin */}
          <Route path="/admin" element={currentUser?.role === 'Admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
};

const App = () => {
  try {
    return (
      <ToastProvider>
        <JCSProvider>
          <AppContent />
        </JCSProvider>
      </ToastProvider>
    );
  } catch (error) {
    console.error('❌ Error in App component:', error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>App Error</h1>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
};

export default App;