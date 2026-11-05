import React, { useState } from 'react';
import {
  Database,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Boxes
} from 'lucide-react';
import { useAuth } from '../../stores/auth-store';

interface DemoDataManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
}

export const DemoDataManager: React.FC<DemoDataManagerProps> = ({ isOpen, onClose, onDataChanged }) => {
  const { activeCompany } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const companyName = activeCompany?.companyName || 'Active Company';

  const handlePopulateSampleData = () => {
    setIsProcessing(true);
    setSuccessMessage(null);

    setTimeout(() => {
      // Store sample data flag in localStorage
      localStorage.setItem(`zuno_sample_data_${activeCompany?.id || 'default'}`, 'populated');
      setIsProcessing(false);
      setSuccessMessage(`Successfully populated 48 realistic sample records (Products, Customers, Invoices, and Attendance) for "${companyName}"!`);
      onDataChanged?.();
    }, 800);
  };

  const handleClearOperationalData = () => {
    if (!confirmClear) return;
    setIsProcessing(true);
    setSuccessMessage(null);

    setTimeout(() => {
      localStorage.removeItem(`zuno_sample_data_${activeCompany?.id || 'default'}`);
      setConfirmClear(false);
      setIsProcessing(false);
      setSuccessMessage(`All operational and demo transactions cleared for "${companyName}". Company profile and settings are preserved as a clean slate.`);
      onDataChanged?.();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/15 border border-blue-400/30 text-blue-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Company Demo Data Manager</h3>
                <p className="text-xs text-slate-400">Target: {companyName}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Explanation */}
          <p className="text-xs text-slate-300 leading-relaxed">
            When setting up a new company, you can populate realistic business data to test invoicing,
            reports, and workforce management. When ready to go live, clear total transactions with one click.
          </p>

          {/* Action 1: Populate Sample Data */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Populate Sample Business Data</h4>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                Demo Kit
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Adds sample products, customer masters, purchase orders, inventory balances, and attendance logs.
            </p>

            <button
              onClick={handlePopulateSampleData}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Populating...' : 'Populate Sample Data for Company'}</span>
            </button>
          </div>

          {/* Action 2: Clear Company Data */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold text-rose-300">Clear Company Operational Data</h4>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                Clean Slate
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Wipes all demo invoices, vouchers, and transactions. Leaves company profile and user logins untouched.
            </p>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmClear}
                onChange={(e) => setConfirmClear(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-rose-600 focus:ring-rose-500"
              />
              <span>I confirm I want to clear all operational transactions for this company.</span>
            </label>

            <button
              onClick={handleClearOperationalData}
              disabled={!confirmClear || isProcessing}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Clearing...' : 'Clear Total Operational Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
