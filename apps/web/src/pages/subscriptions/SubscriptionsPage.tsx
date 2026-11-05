import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Download,
  QrCode,
  Copy,
  Check,
  X,
  Building2,
  Lock,
  BadgeCheck,
  FileText
} from 'lucide-react';
import { BillingCycle } from '@zuno/shared-types';
import { useAuth } from '../../stores/auth-store';

interface PendingPayment {
  id: string;
  tenantName: string;
  planName: string;
  amount: number;
  utrNumber: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const SubscriptionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const [selectedModules, setSelectedModules] = useState<Set<string>>(
    new Set(['MOD_COMPANY', 'MOD_PRODUCT', 'MOD_SALES', 'MOD_PURCHASE', 'MOD_INVENTORY'])
  );

  // QR Modal & Payment States
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // Mock pending payments for Admin manual verification workflow
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>(() => {
    const saved = localStorage.getItem('zuno_pending_payments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'PAY-2026-901',
        tenantName: 'Acme Global Enterprises Ltd',
        planName: 'Enterprise Growth (5 Modules)',
        amount: 7495,
        utrNumber: '429184029184',
        submittedAt: new Date(Date.now() - 3600000).toLocaleString(),
        status: 'PENDING',
      },
    ];
  });

  // Current subscription status
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>(() => {
    return localStorage.getItem('zuno_sub_status') || 'TRIAL';
  });

  const toggleModule = (code: string) => {
    const next = new Set(selectedModules);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setSelectedModules(next);
  };

  const modulePriceMonthly = 1499;
  const modulePriceYearly = 14990;
  const totalAmount =
    selectedModules.size *
    (billingCycle === BillingCycle.YEARLY ? modulePriceYearly : modulePriceMonthly);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Submit manual payment
  const handleSubmitManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setUtrError(null);

    const cleanUtr = utrNumber.replace(/\D/g, '');
    if (!cleanUtr) {
      setUtrError('Transaction reference number (UTR) is required.');
      return;
    }
    if (cleanUtr.length !== 12) {
      setUtrError(`Transaction reference (UTR) must be exactly 12 digits (currently ${cleanUtr.length} digits).`);
      return;
    }

    const newPayment: PendingPayment = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      tenantName: 'Acme Global Enterprises Ltd',
      planName: `Custom Pack (${selectedModules.size} Modules)`,
      amount: totalAmount,
      utrNumber: cleanUtr,
      submittedAt: new Date().toLocaleString(),
      status: 'PENDING',
    };

    const updated = [newPayment, ...pendingPayments];
    setPendingPayments(updated);
    localStorage.setItem('zuno_pending_payments', JSON.stringify(updated));
    localStorage.setItem('zuno_sub_status', 'PENDING_VERIFICATION');
    setSubscriptionStatus('PENDING_VERIFICATION');
    setPaymentSubmitted(true);
    setShowQrModal(false);
    setUtrNumber('');
    setUtrError(null);
  };

  // Admin approves manual payment
  const handleApprovePayment = (id: string) => {
    const updated = pendingPayments.map((p) =>
      p.id === id ? { ...p, status: 'APPROVED' as const } : p
    );
    setPendingPayments(updated);
    localStorage.setItem('zuno_pending_payments', JSON.stringify(updated));
    localStorage.setItem('zuno_sub_status', 'ACTIVE');
    setSubscriptionStatus('ACTIVE');
  };

  // Admin rejects manual payment
  const handleRejectPayment = (id: string) => {
    const updated = pendingPayments.map((p) =>
      p.id === id ? { ...p, status: 'REJECTED' as const } : p
    );
    setPendingPayments(updated);
    localStorage.setItem('zuno_pending_payments', JSON.stringify(updated));
  };

  const modulesList = [
    { id: '1', module_code: 'MOD_COMPANY', module_name: 'Company Setup & Registration', description: 'Core multi-company and branch architecture' },
    { id: '2', module_code: 'MOD_PRODUCT', module_name: 'Product & Material Management', description: 'Master catalog, categories, BOM and barcodes' },
    { id: '3', module_code: 'MOD_PURCHASE', module_name: 'Purchase & Supplier Operations', description: 'Supplier orders, GRN and supplier invoices' },
    { id: '4', module_code: 'MOD_INVENTORY', module_name: 'Inventory & Warehouse Operations', description: 'Real-time stock ledger and multi-location balances' },
    { id: '5', module_code: 'MOD_SALES', module_name: 'Sales & Customer Operations', description: 'Customer orders, invoices and receipts' },
    { id: '6', module_code: 'MOD_HR', module_name: 'HR & Employee Management', description: 'Complete employee lifecycle and personnel records' },
    { id: '7', module_code: 'MOD_ATTENDANCE', module_name: 'Attendance & Leave Requests', description: 'Biometric punches, shift rosters and gate passes' },
    { id: '8', module_code: 'MOD_PAYROLL', module_name: 'Payroll & Benefits', description: 'Salary structures, PF, ESI & statutory payslips' },
    { id: '9', module_code: 'MOD_MANUFACTURING', module_name: 'Production & Manufacturing', description: 'BOM, work orders and production entries' },
    { id: '10', module_code: 'MOD_ACCOUNTING', module_name: 'Banking & Financial Accounting', description: 'Double-entry vouchers, ledgers and bank reconciliation' },
    { id: '11', module_code: 'MOD_COMPLIANCE', module_name: 'Licence & Regulatory Compliance', description: 'Compliance registers, renewals and license tracking' },
    { id: '12', module_code: 'MOD_STATUTORY', module_name: 'Government Integration', description: 'GST returns, TDS and statutory submissions' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            SaaS Subscription & Licensing Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Activate modules independently per organization. Secure payment via UPI QR code with instant admin verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setBillingCycle(BillingCycle.MONTHLY)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === BillingCycle.MONTHLY
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle(BillingCycle.YEARLY)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === BillingCycle.YEARLY
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan & Pay via QR</span>
          </button>
        </div>
      </div>

      {/* Payment Submitted Notification Banner */}
      {subscriptionStatus === 'PENDING_VERIFICATION' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-amber-300">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <h4 className="text-sm font-bold text-white">Payment Reference Submitted (Under Verification)</h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Your transaction reference is in the verification queue. The administrator will verify and mark your plan active.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30">
            Awaiting Admin Sign-off
          </span>
        </div>
      )}

      {/* Active Contract Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Subscription Status</span>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                subscriptionStatus === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : subscriptionStatus === 'PENDING_VERIFICATION'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800'
              }`}
            >
              {subscriptionStatus}
            </span>
            <span className="text-xs text-slate-500 capitalize">{billingCycle.toLowerCase()} cycle</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-mono">Ref: SUB-2026-9042</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Selected Module Entitlements</span>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {selectedModules.size} Active Modules
          </p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Unlocks corresponding catalogue tables</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Calculated Payable Amount</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              ₹{totalAmount.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-400">
                / {billingCycle === BillingCycle.YEARLY ? 'year' : 'month'}
              </span>
            </p>
          </div>
          <button
            onClick={() => setShowQrModal(true)}
            className="mt-3 w-full py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Pay ₹{totalAmount.toLocaleString('en-IN')} via UPI QR</span>
          </button>
        </div>
      </div>

      {/* Admin Manual Payment Approval Desk (Visible to Admin/Owner) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Admin Payment Verification Desk
              </h2>
              <p className="text-xs text-slate-500">
                Review submitted bank/UPI transaction references and manually approve subscription activations.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {pendingPayments.filter((p) => p.status === 'PENDING').length} Pending Approval
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Payment ID</th>
                <th className="py-2.5 px-3">Tenant & Plan</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Bank UTR / Reference</th>
                <th className="py-2.5 px-3">Submitted At</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {pendingPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-medium">{payment.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{payment.tenantName}</p>
                    <p className="text-[11px] text-slate-400">{payment.planName}</p>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {payment.utrNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{payment.submittedAt}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        payment.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : payment.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {payment.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprovePayment(payment.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          Approve & Activate
                        </button>
                        <button
                          onClick={() => handleRejectPayment(payment.id)}
                          className="px-2 py-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchasable SaaS Module Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Select Business Modules to Include
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Check or uncheck modules to customize your enterprise subscription bundle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulesList.map((m) => {
            const isSelected = selectedModules.has(m.module_code);
            return (
              <div
                key={m.module_code}
                onClick={() => toggleModule(m.module_code)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm ring-1 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-slate-400">{m.module_code}</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${
                        isSelected ? 'bg-blue-600' : 'border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-2">{m.module_name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{m.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {billingCycle === BillingCycle.YEARLY ? '₹14,990 / yr' : '₹1,499 / mo'}
                  </span>
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                    {isSelected ? 'Selected' : 'Click to Add'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Scan & Pay Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Scan & Pay via UPI</h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitManualPayment} className="mt-4 space-y-4">
              {/* Amount Display */}
              <div className="p-3 bg-slate-800/80 rounded-2xl text-center border border-slate-700">
                <p className="text-xs text-slate-400">Total Payable Amount</p>
                <p className="text-2xl font-black text-cyan-400 mt-0.5">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedModules.size} Modules • {billingCycle} Billing
                </p>
              </div>

              {/* QR Code Graphic Box */}
              <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner">
                {/* Simulated UPI QR Code */}
                <div className="w-48 h-48 bg-slate-100 rounded-xl p-2 border-2 border-slate-900 flex flex-col items-center justify-center relative">
                  {/* Decorative QR Pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                    <rect x="5" y="5" width="25" height="25" rx="3" fill="#000" />
                    <rect x="8" y="8" width="19" height="19" rx="2" fill="#fff" />
                    <rect x="12" y="12" width="11" height="11" fill="#000" />

                    <rect x="70" y="5" width="25" height="25" rx="3" fill="#000" />
                    <rect x="73" y="8" width="19" height="19" rx="2" fill="#fff" />
                    <rect x="77" y="12" width="11" height="11" fill="#000" />

                    <rect x="5" y="70" width="25" height="25" rx="3" fill="#000" />
                    <rect x="8" y="73" width="19" height="19" rx="2" fill="#fff" />
                    <rect x="12" y="77" width="11" height="11" fill="#000" />

                    <rect x="35" y="10" width="6" height="6" />
                    <rect x="45" y="10" width="10" height="6" />
                    <rect x="60" y="15" width="5" height="5" />
                    <rect x="35" y="25" width="10" height="6" />
                    <rect x="50" y="25" width="15" height="5" />
                    <rect x="10" y="35" width="8" height="10" />
                    <rect x="25" y="40" width="15" height="6" />
                    <rect x="45" y="40" width="10" height="10" />
                    <rect x="65" y="35" width="8" height="8" />
                    <rect x="80" y="40" width="15" height="6" />
                    <rect x="35" y="55" width="15" height="6" />
                    <rect x="55" y="55" width="8" height="8" />
                    <rect x="70" y="55" width="15" height="6" />
                    <rect x="35" y="70" width="6" height="15" />
                    <rect x="45" y="75" width="15" height="6" />
                    <rect x="70" y="70" width="10" height="10" />
                    <rect x="85" y="75" width="10" height="15" />
                  </svg>
                  <span className="text-[10px] font-bold text-slate-800 mt-1 uppercase tracking-wider">
                    Scan with any UPI App
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-slate-600 text-[11px] font-semibold">
                  <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                </div>
              </div>

              {/* UPI ID Copy Field */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Merchant UPI ID:</span>
                  <span className="font-mono text-cyan-300 font-bold">zuno.payments@icici</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('zuno.payments@icici')}
                  className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Bank Details Collapsible Note */}
              <div className="text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-300">Bank Transfer (NEFT/IMPS):</p>
                <p>A/C: <span className="font-mono text-slate-200">50200084920192</span> | IFSC: <span className="font-mono text-slate-200">ICIC0000102</span></p>
              </div>

              {/* UTR Input Form */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Enter 12-Digit Transaction Reference (UTR / UPI Ref Number) *
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      utrNumber.length === 12
                        ? 'text-emerald-400 font-bold'
                        : utrNumber.length > 0
                        ? 'text-cyan-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {utrNumber.length}/12 digits
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{12}"
                  maxLength={12}
                  required
                  placeholder="12-digit number (e.g. 429184029184)"
                  value={utrNumber}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setUtrNumber(digits);
                    if (utrError) setUtrError(null);
                  }}
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none transition-all tracking-wider ${
                    utrError
                      ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/40'
                      : 'border-slate-700 focus:ring-2 focus:ring-cyan-500'
                  }`}
                />
                {utrError && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                    <span>{utrError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={utrNumber.length !== 12}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-lg transition-all"
              >
                Submit Payment for Manual Verification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
