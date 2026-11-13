import React, { useState } from 'react';
import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronRight, Sparkles, ShieldAlert } from 'lucide-react';
import { sanitizeErrorMessage } from '../../utils/errorSanitizer';

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  let errorMessage = 'An unexpected error occurred while rendering this page.';
  let errorStatus = 500;
  let stackTrace = '';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    stackTrace = error.stack || '';
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <span>Error Code {errorStatus}</span>
              </div>
              <h1 className="text-xl font-extrabold text-white">Application Exception Encountered</h1>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-sm leading-relaxed">
            <p className="font-medium text-white mb-1">Status Notice:</p>
            <p className="text-xs text-rose-300/90 leading-relaxed">{sanitizeErrorMessage(errorMessage, 'The requested system view is temporarily synchronizing. Please reload the page or return to dashboard.')}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Executive Dashboard</span>
            </button>

            <button
              onClick={() => navigate('/modules')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>19 Modules Hub</span>
            </button>
          </div>

          {/* Technical Diagnostics Collapsible */}
          {stackTrace && (
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
              >
                {showDetails ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>Technical Diagnostics & Stack Trace</span>
              </button>

              {showDetails && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 max-h-48 overflow-auto font-mono text-[11px] text-slate-400 whitespace-pre-wrap leading-tight">
                  {stackTrace}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              Zuno ERP Enterprise Recovery Engine — Automatic tenant perimeter preservation active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

