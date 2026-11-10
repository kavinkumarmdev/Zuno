import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  Database,
  Menu,
  Shield,
  LogOut,
  Command,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../stores/auth-store';
import { OnboardingGuide } from '../guidance/OnboardingGuide';
import { DemoDataManager } from '../demo/DemoDataManager';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, tenant, activeCompany, activeBranch, companies, branches, switchCompany, switchBranch, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showDemoManager, setShowDemoManager] = useState(false);

  useEffect(() => {
    // Open gamified guide automatically for first-time visitors
    const completed = localStorage.getItem('zuno_tour_completed');
    if (!completed) {
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-14 sm:h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 px-3 sm:px-6 flex items-center justify-between flex-shrink-0 relative z-30 transition-colors">
      {/* Left: Mobile Toggle & Organization Breadcrumb Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors -ml-1"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Clean Unified Organization Switcher */}
        <div className="flex items-center bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-0.5 shadow-sm">
          {/* Company Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs max-w-[150px] sm:max-w-[210px] md:max-w-[240px]">
            <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <select
              value={activeCompany?.id || ''}
              onChange={(e) => switchCompany(e.target.value)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer truncate text-xs w-full hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Switch Active Company"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100">
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <span className="hidden sm:inline-block w-px h-4 bg-slate-200 dark:bg-slate-700 my-auto" />

          {/* Branch Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs max-w-[140px] md:max-w-[180px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={activeBranch?.id || ''}
              onChange={(e) => switchBranch(e.target.value)}
              className="bg-transparent font-medium text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer truncate text-xs w-full hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Switch Active Branch"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100">
                  {b.branchName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Center: Executive Command Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4">
        <div className="relative w-full group">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search modules, vouchers, invoices..."
            className="w-full pl-8 pr-14 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Clean Utility Controls & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Quick Tour Button */}
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 transition-colors shadow-sm shrink-0"
          title="Interactive Walkthrough & Guided Tour"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          <span className="hidden sm:inline">Tour</span>
        </button>

        {/* Demo / Sample Data Manager Button */}
        <button
          onClick={() => setShowDemoManager(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 transition-colors shadow-sm shrink-0"
          title="Sample Data & Multi-Tenant Reset Tools"
        >
          <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          <span className="hidden sm:inline">Demo Data</span>
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notification Bell */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Alerts & Actions</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-medium px-1.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                      2 New
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs py-1">
                  <div className="py-2.5 flex items-start gap-2.5 hover:bg-slate-50/60 dark:hover:bg-slate-700/40 px-1.5 rounded-lg transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">GST-3B Statutory Return Due</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Government filing deadline in 4 days</p>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-start gap-2.5 hover:bg-slate-50/60 dark:hover:bg-slate-700/40 px-1.5 rounded-lg transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">Pending PO-2026-1049 Approval</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Awaiting Managing Director signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <span className="hidden sm:inline-block w-px h-6 bg-slate-200/80 dark:bg-slate-700/80 my-auto mx-0.5" />

        {/* User Profile Pill Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 dark:from-blue-600 dark:to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 shrink-0">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight max-w-[120px] truncate">
                {user?.fullName || 'Admin User'}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200/70 dark:border-blue-800/70 px-1 rounded">
                  {user?.userType || 'Owner'}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700/80">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{tenant?.tenantName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="py-1 text-xs">
                  <div
                    onClick={() => setShowProfileMenu(false)}
                    className="px-3 py-2 text-slate-700 dark:text-slate-300 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer transition-colors"
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Security & Sessions</span>
                  </div>
                  <div
                    onClick={() => setShowProfileMenu(false)}
                    className="px-3 py-2 text-slate-700 dark:text-slate-300 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Switch Organization</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-700/80">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gamified First-Time Walkthrough Guide Modal */}
      <OnboardingGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Sample / Demo Data Manager Modal */}
      <DemoDataManager isOpen={showDemoManager} onClose={() => setShowDemoManager(false)} />
    </header>
  );
};

