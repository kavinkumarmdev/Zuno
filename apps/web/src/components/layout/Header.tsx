import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  User,
  LogOut,
  Shield,
  ChevronDown,
  Gamepad2,
  Sparkles,
  Database,
  Menu
} from 'lucide-react';
import { useAuth } from '../../stores/auth-store';
import { OnboardingGuide } from '../guidance/OnboardingGuide';
import { DemoDataManager } from '../demo/DemoDataManager';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
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

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between flex-shrink-0 relative z-30">
      {/* Left: Mobile Toggle & Organization / Company Selectors */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors -ml-1"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Company Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 sm:px-3 py-1.5 text-xs max-w-[170px] sm:max-w-none">
          <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <select
            value={activeCompany?.id || ''}
            onChange={(e) => switchCompany(e.target.value)}
            className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer truncate text-xs"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id} className="dark:bg-slate-800">
                {c.companyName} ({c.companyCode})
              </option>
            ))}
          </select>
        </div>

        {/* Branch Selector */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <select
            value={activeBranch?.id || ''}
            onChange={(e) => switchBranch(e.target.value)}
            className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id} className="dark:bg-slate-800">
                {b.branchName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center relative w-80">
        <Search className="w-4 h-4 absolute left-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search modules, vouchers, invoices..."
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-full focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* HUD Interactive Guide Tour Button */}
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-all hover:scale-105 active:scale-95"
          title="Interactive Game-Style Controller Guide Tour"
        >
          <Gamepad2 className="w-3.5 h-3.5 animate-pulse text-cyan-600 dark:text-cyan-400" />
          <span className="hidden sm:inline">Guide Tour</span>
        </button>

        {/* Demo / Sample Data Manager Button */}
        <button
          onClick={() => setShowDemoManager(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all hover:scale-105 active:scale-95"
          title="Populate Sample Data or Clear Operational Data"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Demo Data</span>
        </button>

        {/* Dark/Light Mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
          </button>
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Alerts & Actions</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-medium">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs py-1">
                  <div className="py-2">
                    <p className="font-medium text-slate-800 dark:text-slate-200">GST-3B Statutory Return Due</p>
                    <p className="text-[11px] text-slate-500">Government filing deadline in 4 days</p>
                  </div>
                  <div className="py-2">
                    <p className="font-medium text-slate-800 dark:text-slate-200">Pending PO-2026-1049 Approval</p>
                    <p className="text-[11px] text-slate-500">Awaiting Managing Director signature</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.fullName || 'Admin User'}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">
                {user?.userType || 'Administrator'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{tenant?.tenantName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <div className="py-1 text-xs">
                  <div
                    onClick={() => setShowProfileMenu(false)}
                    className="px-3 py-1.5 text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Security & Sessions</span>
                  </div>
                  <div
                    onClick={() => setShowProfileMenu(false)}
                    className="px-3 py-1.5 text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch Organization</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded flex items-center gap-2 cursor-pointer font-medium transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
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

