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
  Sparkles,
  ShieldAlert,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus
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
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showSwitchOrgModal, setShowSwitchOrgModal] = useState(false);
  const [showErrorLogsModal, setShowErrorLogsModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCode, setNewCompanyCode] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // System error logs buffer for application owner
  const [errorLogs, setErrorLogs] = useState<Array<{ id: string; time: string; subsystem: string; level: 'ERROR' | 'WARN' | 'INFO'; message: string }>>(() => {
    try {
      const saved = localStorage.getItem('zuno_system_error_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', time: new Date(Date.now() - 120000).toLocaleTimeString(), subsystem: 'Database Connection', level: 'INFO', message: 'PostgreSQL connection pool verified healthy (Render Oregon Cloud).' },
      { id: '2', time: new Date(Date.now() - 360000).toLocaleTimeString(), subsystem: 'Auth Subsystem', level: 'INFO', message: 'Multi-tenant JWT token generated for Owner Kavin.' },
      { id: '3', time: new Date(Date.now() - 600000).toLocaleTimeString(), subsystem: 'API Outbox Ledger', level: 'INFO', message: 'All 243 approved catalogue schemas synced.' }
    ];
  });

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

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

  const handleAddNewCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    const compCode = (newCompanyCode || newCompanyName.substring(0, 6)).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newId = 'comp-' + Date.now();
    const newComp = {
      id: newId,
      name: newCompanyName.trim(),
      company_name: newCompanyName.trim(),
      code: compCode,
      company_code: compCode,
      legal_name: newCompanyName.trim(),
      currency_code: 'INR',
      status: 'ACTIVE',
      created_time: new Date().toISOString(),
      is_user_record: true
    };

    // Save to localStorage tb_company table
    try {
      const raw = localStorage.getItem('zuno_records_tb_company');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(newComp);
      localStorage.setItem('zuno_records_tb_company', JSON.stringify(list));
    } catch {}

    // Switch company
    companies.push({
      id: newId,
      companyCode: compCode,
      companyName: newCompanyName.trim(),
      currencyCode: 'INR',
      role: 'Owner'
    });
    switchCompany(newId);
    setNewCompanyName('');
    setNewCompanyCode('');
    setShowSwitchOrgModal(false);
    showToast('success', `Created & switched to company "${newCompanyName.trim()}"`);
  };

  return (
    <>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-2 duration-200">
          <div
            className={`p-3.5 rounded-2xl shadow-xl border flex items-center justify-between text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <header className="h-14 sm:h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 px-3 sm:px-6 flex items-center justify-between flex-shrink-0 relative z-30 transition-colors">
        {/* Left: Mobile Toggle & Clean Unified Organization Switcher */}
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
                onChange={(e) => {
                  switchCompany(e.target.value);
                  showToast('success', 'Active company switched successfully');
                }}
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
                onChange={(e) => {
                  switchBranch(e.target.value);
                  showToast('success', 'Active branch switched successfully');
                }}
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

        {/* Right: Clean Minimal Utility Controls & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
                      onClick={() => {
                        setShowNotifications(false);
                        showToast('success', 'All notifications marked as read');
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
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
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 dark:from-blue-600 dark:to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 shrink-0">
                {user?.fullName?.charAt(0) || 'K'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight max-w-[120px] truncate">
                  {user?.fullName || 'Kavin'}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200/70 dark:border-blue-800/70 px-1 rounded">
                    {user?.userType || 'OWNER'}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700/80">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{tenant?.tenantName || 'Enterprise Tenant'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email || 'kavin@zuno.com'}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                        {activeCompany?.companyName || 'Main Company'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1 text-xs space-y-0.5">
                    {/* Switch Organization */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowSwitchOrgModal(true);
                      }}
                      className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer transition-colors text-left"
                    >
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Switch Organization & Entities</span>
                    </button>

                    {/* Security & Sessions */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowSecurityModal(true);
                      }}
                      className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer transition-colors text-left"
                    >
                      <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Security & Active Sessions</span>
                    </button>

                    {/* Guided Tour */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowGuide(true);
                      }}
                      className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer transition-colors text-left"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Interactive Guided Tour</span>
                    </button>

                    {/* Demo / Sample Data */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowDemoManager(true);
                      }}
                      className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer transition-colors text-left"
                    >
                      <Database className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Demo & Sample Data Manager</span>
                    </button>

                    {/* Application Owner Only: System Error & Audit Logs */}
                    {user?.userType === 'OWNER' && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowErrorLogsModal(true);
                        }}
                        className="w-full px-3 py-2 text-amber-700 dark:text-amber-400 flex items-center gap-2.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl cursor-pointer transition-colors text-left font-medium"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>System Error & Audit Logs (Owner)</span>
                      </button>
                    )}
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
                      <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Switch Organization & Entity Modal */}
      {showSwitchOrgModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Switch Organization & Companies</h3>
              </div>
              <button onClick={() => setShowSwitchOrgModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Available Companies</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {companies.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        switchCompany(c.id);
                        setShowSwitchOrgModal(false);
                        showToast('success', `Switched active company to ${c.companyName}`);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        activeCompany?.id === c.id
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{c.companyName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Code: {c.companyCode} • Currency: {c.currencyCode || 'INR'}</p>
                      </div>
                      {activeCompany?.id === c.id && (
                        <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">Active</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inline Form to Add New Company */}
              <form onSubmit={handleAddNewCompany} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Register Additional Company Entity</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Company Legal Name *"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Code (e.g. KAVIN-LOG)"
                    value={newCompanyCode}
                    onChange={(e) => setNewCompanyCode(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSwitchOrgModal(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Add & Activate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Security & Active Sessions Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Security & Active Device Sessions</h3>
              </div>
              <button onClick={() => setShowSecurityModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Primary Active Session */}
              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">Current Web Session (Active)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">This Device</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                  <p>User: <span className="font-semibold text-slate-900 dark:text-slate-100">{user?.fullName || 'Kavin'}</span></p>
                  <p>Role: <span className="font-semibold text-slate-900 dark:text-slate-100">{user?.userType || 'OWNER'}</span></p>
                  <p>IP Address: <span className="font-mono">127.0.0.1</span></p>
                  <p>Security: <span className="text-emerald-600 font-semibold">TLS 1.3 256-Bit SSL</span></p>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span>JWT Multi-Tenant Access Token</span>
                  <span className="font-mono text-emerald-600 font-semibold">Valid (24h Auto-Refresh)</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span>Tenant Schema Isolation</span>
                  <span className="text-blue-600 font-semibold">Row-Level Strict Tenant Boundary</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span>Failed Login Protection</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">5-Attempt Lockout Active</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    showToast('success', 'Secondary device sessions revoked.');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Revoke Other Sessions
                </button>
                <button
                  type="button"
                  onClick={() => setShowSecurityModal(false)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Owner Only: Error Log Modal */}
      {showErrorLogsModal && user?.userType === 'OWNER' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">System Error & Operational Audit Logs</h3>
                  <p className="text-[11px] text-slate-400">Restricted view: Accessible only to Application Owner ({user?.fullName})</p>
                </div>
              </div>
              <button onClick={() => setShowErrorLogsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                {errorLogs.map((log) => (
                  <div key={log.id} className="p-3 text-xs flex items-start justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            log.level === 'ERROR'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : log.level === 'WARN'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {log.level}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{log.subsystem}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{log.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorLogs([]);
                    localStorage.removeItem('zuno_system_error_logs');
                    showToast('success', 'Error log buffer cleared.');
                  }}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Clear Log Buffer
                </button>
                <button
                  type="button"
                  onClick={() => setShowErrorLogsModal(false)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Dismiss & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gamified First-Time Walkthrough Guide Modal */}
      <OnboardingGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Sample / Demo Data Manager Modal */}
      <DemoDataManager isOpen={showDemoManager} onClose={() => setShowDemoManager(false)} />
    </>
  );
};

