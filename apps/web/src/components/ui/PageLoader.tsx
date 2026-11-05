import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
  subtext?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading Zuno Enterprise Workspace...',
  subtext = 'Synchronizing tenant cache and operational permissions',
}) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 animate-spin opacity-20 blur-md absolute inset-0" />
        <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{message}</h4>
        <p className="text-xs text-slate-400 max-w-sm">{subtext}</p>
      </div>
    </div>
  );
};

