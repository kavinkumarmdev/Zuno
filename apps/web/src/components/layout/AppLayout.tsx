import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChevronRight, Home, Activity, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../stores/auth-store';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading, activeCompany, tenant } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative">
      {/* Ambient Future Gradient Blooms */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-600/10 blur-[100px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-gradient-to-t from-cyan-500/10 to-transparent dark:from-cyan-500/5 blur-[120px] pointer-events-none -z-0" />

      {/* 19-Module SaaS Sidebar (Desktop Static + Mobile / Tablet Drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header */}
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Futuristic Breadcrumb & Live Telemetry Bar */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/80 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-slate-500 overflow-x-auto scrollbar-none whitespace-nowrap">
          <div className="flex items-center">
            <Home className="w-3.5 h-3.5 mr-2 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="font-medium text-slate-600 dark:text-slate-400">Hub</span>
            {pathParts.map((part, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 dark:text-slate-600 shrink-0" />
                <span className="capitalize font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
                  {part.replace(/-/g, ' ')}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Right Status Capsule */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium shrink-0 ml-4">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Cloud Ledger Live</span>
            </div>

            {activeCompany && (
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span className="truncate max-w-[160px] font-medium">{activeCompany.companyName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Page Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 bg-slate-50/50 dark:bg-slate-950/80 bg-cyber-grid">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

