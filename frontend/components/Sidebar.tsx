import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { LayoutDashboard, PlusCircle, CheckSquare, Image, Shield, FileBarChart, X, Moon, Sun, Trophy, LogOut, KeyRound, AlertCircle, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { useJCS } from '../services/JCSContext';
import LoginModal from './LoginModal';

// ... (SidebarItem component stays same)
const SidebarItem = ({ to, icon: Icon, label, onClick }: any) => (
  // ... (same content)
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      relative group flex items-center px-3 py-3 my-1.5 mx-2 rounded-xl transition-all duration-300 ease-in-out
      ${isActive
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
        : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600'
      }
    `}
  >
    <Icon size={22} strokeWidth={1.5} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
    <span className="font-medium text-sm ml-3 whitespace-nowrap">{label}</span>
  </NavLink>
);

const Sidebar = ({ isOpen, onClose }: any) => {
  const { currentUser, darkMode, toggleDarkMode, logout, changeUserPassword } = useJCS();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/login');
      setIsLoggingOut(false);
    }, 1500);
  };

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passData, setPassData] = useState({ new: '', confirm: '' }); // Removed current
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Visibility toggle

  // Login Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Close sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (passData.new !== passData.confirm) {
      setPassError("New passwords do not match.");
      return;
    }
    if (passData.new.length < 6) {
      setPassError("Password must be at least 6 characters.");
      return;
    }

    try {
      await changeUserPassword({
        userId: currentUser?.id,
        newPassword: passData.new
      });
      setPassSuccess("Password updated successfully!");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassData({ new: '', confirm: '' });
        setPassSuccess('');
        setShowPassword(false);
      }, 1500);
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password');
    }
  };

  return (
    <>
      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in text-white">
          <Loader2 size={64} className="text-brand-500 animate-spin mb-6" />
          <h2 className="text-2xl font-bold animate-pulse">Logging Out...</h2>
          <p className="text-slate-400 mt-2">See you next time!</p>
        </div>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col shadow-2xl md:shadow-none
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 w-64
      `}>

        {/* Header / Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-brand-500/50 shadow-md">
              J
            </div>
            <span className="font-bold text-xl tracking-tight text-main whitespace-nowrap">JCS Dashboard</span>
          </div>

          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-muted hover:text-main">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 scrollbar-hide">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={handleLinkClick} />

          <SidebarItem to="/reports" icon={FileBarChart} label="Reports & Analysis" onClick={handleLinkClick} />

          <SidebarItem to="/gallery" icon={Image} label="Event Gallery" onClick={handleLinkClick} />

          <SidebarItem to="/leaderboard" icon={Trophy} label="Leaderboard" onClick={handleLinkClick} />

          {/* Divider */}
          <div className="my-2 border-t border-border/50 mx-4"></div>

          {/* Role Based Links */}
          {currentUser && currentUser.role === 'Coordinator' && (
            <>
              <SidebarItem to="/submit" icon={PlusCircle} label="Submit Event" onClick={handleLinkClick} />
              <SidebarItem to="/my-events" icon={CheckSquare} label="My Events" onClick={handleLinkClick} />
            </>
          )}

          {currentUser && currentUser.role === 'Admin' && (
            <SidebarItem to="/admin" icon={Shield} label="Admin Panel" onClick={handleLinkClick} />
          )}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2 bg-page/50">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-start p-2 rounded-lg text-muted hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-main transition-colors"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="ml-3 text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* User Profile OR Login Button */}
          {currentUser ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/50 shadow-sm">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-brand-300 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>

                <div className="ml-3 min-w-0">
                  <p className="text-xs font-bold text-main truncate max-w-[80px]" title={currentUser?.name}>{currentUser?.name}</p>
                  <p className="text-[10px] text-muted truncate">{currentUser?.role}</p>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-muted hover:text-brand-600 p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors mr-1"
                  title="Change Password"
                >
                  <KeyRound size={16} />
                </button>
                <button
                  onClick={handleLogout}
                  className="text-muted hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="w-full flex items-center justify-center p-3 rounded-xl bg-slate-900 dark:bg-brand-600 text-white font-bold text-sm shadow-lg hover:bg-slate-800 dark:hover:bg-brand-700 transition-all"
            >
              <LogIn size={18} className="mr-2" />
              Login
            </NavLink>
          )}

        </div>

      </aside>

      {/* LOGIN MODAL */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowPasswordModal(false)} />
          <div className="relative z-10 bg-card rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-main mb-1">Change Password</h3>
            <p className="text-sm text-muted mb-4">Set a new password for your account.</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">

              <div className="relative">
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passData.new}
                  onChange={e => setPassData({ ...passData, new: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-page text-main focus:ring-2 focus:ring-brand-500 outline-none transition-all pr-10"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-7 text-muted hover:text-main"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passData.confirm}
                  onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-page text-main focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                />
              </div>

              {passError && (
                <div className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-medium">
                  <AlertCircle size={14} /> {passError}
                </div>
              )}
              {passSuccess && (
                <div className="flex items-center gap-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-green-600 text-xs font-medium">
                  <CheckSquare size={14} /> {passSuccess}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3 py-2 text-sm text-muted hover:bg-page rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Sidebar;