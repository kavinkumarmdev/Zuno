import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../../stores/auth-store';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* 19-Module SaaS Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Breadcrumb Bar */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800 px-6 py-2 flex items-center text-xs text-slate-500">
          <Home className="w-3.5 h-3.5 mr-2 text-slate-400" />
          <span>Home</span>
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 dark:text-slate-600" />
              <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                {part.replace(/-/g, ' ')}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Dynamic Page Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/60 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

