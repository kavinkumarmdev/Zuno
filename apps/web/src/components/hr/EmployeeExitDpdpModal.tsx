import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserMinus,
  X,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Lock,
  EyeOff,
  FileText,
  DollarSign,
  Calculator,
  Calendar
} from 'lucide-react';
import { calculateFnFSettlement, maskPii } from '../../pages/modules/fkRelations';

interface EmployeeExitDpdpModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  onCompleteExit: (updatedRecord: any) => void;
}

export const EmployeeExitDpdpModal: React.FC<EmployeeExitDpdpModalProps> = ({
  isOpen,
  onClose,
  employee,
  onCompleteExit
}) => {
  const [activeTab, setActiveTab] = useState<'fnf' | 'dpdp'>('fnf');
  const [resignationDate, setResignationDate] = useState('2026-10-15');
  const [lastWorkingDay, setLastWorkingDay] = useState('2026-11-15');
  const [reason, setReason] = useState('Career Progression / Higher Studies');
  const [daysWorkedInFinalMonth, setDaysWorkedInFinalMonth] = useState(15);
  const [accumulatedLeaves, setAccumulatedLeaves] = useState(14);
  const [noticeRequiredDays, setNoticeRequiredDays] = useState(30);
  const [noticeServedDays, setNoticeServedDays] = useState(30);
  const [pendingAdvances, setPendingAdvances] = useState(0);
  const [assetDeductions, setAssetDeductions] = useState(0);

  // DPDP Checklist states
  const [purgeBiometrics, setPurgeBiometrics] = useState(true);
  const [maskPiiData, setMaskPiiData] = useState(true);
  const [lockTaxAudit7Years, setLockTaxAudit7Years] = useState(true);
  const [revokeAppAccess, setRevokeAppAccess] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !employee) return null;

  const grossMonthly = Number(employee.amount || 75000);
  const basicSalary = Number(employee.basic_salary || grossMonthly * 0.5);
  const da = Number(employee.da || grossMonthly * 0.15);

  const fnf = calculateFnFSettlement({
    monthlyGross: grossMonthly,
    basicSalary,
    da,
    joiningDate: employee.date || '2021-04-01',
    lwdDate: lastWorkingDay,
    daysWorkedInFinalMonth,
    accumulatedLeaves,
    noticeRequiredDays,
    noticeServedDays,
    pendingAdvances,
    assetDeductions
  });

  const handleExecuteDpdpSettlement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      const updated = {
        ...employee,
        status: 'RELIEVED',
        exit_date: lastWorkingDay,
        exit_reason: reason,
        fnf_net_settlement: fnf.netSettlementAmount,
        dpdp_status: 'PII_MASKED_AND_ARCHIVED',
        dpdp_redacted_at: new Date().toISOString(),
        aadhaar: maskPiiData ? maskPii('aadhaar', employee.aadhaar || '542189031245') : employee.aadhaar,
        pan: maskPiiData ? maskPii('pan', employee.pan || 'ABCDE1234F') : employee.pan,
        phone: maskPiiData ? maskPii('phone', employee.phone || '9876543210') : employee.phone
      };

      onCompleteExit(updated);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-3xl w-full max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-900 dark:text-white my-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-600">
              <UserMinus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Employee Exit, F&F Settlement & DPDP Act Compliance
              </h3>
              <p className="text-xs text-slate-500">
                Candidate: <strong className="text-slate-800 dark:text-slate-200">{employee.name}</strong> ({employee.code}) | {employee.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print F&F Statement</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('fnf')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'fnf'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Full & Final (F&F) Settlement Calculation</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dpdp')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dpdp'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 Data Privacy & PII Redaction</span>
          </button>
        </div>

        {/* Tab 1: F&F Settlement Calculation */}
        {activeTab === 'fnf' && (
          <div className="space-y-5 text-xs">
            {/* Exit Parameters Form */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Last Working Day (LWD)</label>
                <input
                  type="date"
                  value={lastWorkingDay}
                  onChange={(e) => setLastWorkingDay(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Days Worked in Final Month</label>
                <input
                  type="number"
                  min="0"
                  max="31"
                  value={daysWorkedInFinalMonth}
                  onChange={(e) => setDaysWorkedInFinalMonth(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Accumulated Earned Leaves</label>
                <input
                  type="number"
                  min="0"
                  value={accumulatedLeaves}
                  onChange={(e) => setAccumulatedLeaves(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Notice Required (Days)</label>
                <input
                  type="number"
                  value={noticeRequiredDays}
                  onChange={(e) => setNoticeRequiredDays(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Notice Served (Days)</label>
                <input
                  type="number"
                  value={noticeServedDays}
                  onChange={(e) => setNoticeServedDays(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Exit Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                >
                  <option value="Career Progression / Higher Studies">Career Progression / Resignation</option>
                  <option value="Relocation / Family Grounds">Relocation / Personal</option>
                  <option value="Superannuation / Retirement">Superannuation / Retirement</option>
                  <option value="Contract Expiry">Contract Expiry</option>
                  <option value="Mutual Separation">Mutual Separation</option>
                </select>
              </div>
            </div>

            {/* F&F Settlement Statement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Earnings & Entitlements */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  A. Payable Entitlements
                </span>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500">Unpaid Salary ({daysWorkedInFinalMonth} days)</span>
                    <strong className="text-emerald-600">₹{fnf.unpaidSalaryAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500">Earned Leave Encashment ({accumulatedLeaves} days)</span>
                    <strong className="text-emerald-600">₹{fnf.leaveEncashmentAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500">
                      Statutory Gratuity ({fnf.tenureYears} yrs service)
                    </span>
                    <strong className={fnf.isGratuityEligible ? 'text-emerald-600' : 'text-slate-400'}>
                      {fnf.isGratuityEligible
                        ? `₹${fnf.gratuityAmount.toLocaleString('en-IN')}`
                        : '₹0 (Tenure < 5 Yrs)'}
                    </strong>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                    <span className="font-sans">Gross Entitlements (A)</span>
                    <span>₹{fnf.grossPayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Deductions & Recoveries */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  B. Recoveries & Deductions
                </span>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500">
                      Notice Shortfall Recovery ({fnf.noticeShortfallDays} days)
                    </span>
                    <strong className={fnf.noticeRecoveryAmount > 0 ? 'text-rose-600' : 'text-slate-400'}>
                      ₹{fnf.noticeRecoveryAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500">Salary Advances / Tool Balance</span>
                    <strong className="text-slate-400">₹{pendingAdvances.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500">Unreturned Assets / Clearance</span>
                    <strong className="text-slate-400">₹{assetDeductions.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                    <span className="font-sans">Total Deductions (B)</span>
                    <span className="text-rose-600">₹{fnf.totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Settlement Banner */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500/40 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800 dark:text-amber-300">
                  Net Full & Final (F&F) Settlement Payable
                </span>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  Entitlements (A) minus Recoveries (B) payable on Last Working Day
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 font-mono">
                  ₹{fnf.netSettlementAmount.toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DPDP Act 2023 Compliance */}
        {activeTab === 'dpdp' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Digital Personal Data Protection Act, 2023 (DPDP Act) Statutory Compliance</span>
              </div>
              <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                Under Section 8(7) and Section 12 of India&apos;s DPDP Act, 2023, Data Fiduciaries must cease retaining personal data of separated employees once the operational purpose is fulfilled, subject only to statutory tax audit requirements (Income Tax Act Section 44AA &amp; EPFO 7-year retention).
              </p>
            </div>

            {/* DPDP Actions Checklist */}
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                Mandatory Statutory Privacy Enforcement Checklist:
              </h4>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={purgeBiometrics}
                  onChange={(e) => setPurgeBiometrics(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Purge Active Biometrics (Facial Vectors &amp; Thumbprint Hashes)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    De-indexes employee biometric templates from shop-floor access turnstiles and live attendance terminals.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={maskPiiData}
                  onChange={(e) => setMaskPiiData(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Mask Sensitive PII (Aadhaar &amp; PAN Tokenization)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Redacts Aadhaar to <code className="font-mono text-blue-600">{maskPii('aadhaar', employee.aadhaar || '542189031245')}</code> and PAN to <code className="font-mono text-blue-600">{maskPii('pan', employee.pan || 'ABCDE1234F')}</code> in tenant database.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={revokeAppAccess}
                  onChange={(e) => setRevokeAppAccess(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Revoke Application Login &amp; SSO Credentials
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Terminates active session tokens, disables ERP login for <code className="font-mono text-blue-600">{employee.email}</code>.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lockTaxAudit7Years}
                  onChange={(e) => setLockTaxAudit7Years(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Lock Statutory Payroll Ledger under 7-Year Statutory Retention
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Archives historical Form 16, Form B wages, and EPF contributions for legal compliance without public exposure.
                  </p>
                </div>
              </label>
            </div>

            {isCompleted && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-xs">
                  DPDP Redaction &amp; F&amp;F Clearance Executed! Employee status updated to RELIEVED, PII masked, and audit lock applied.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            disabled={isProcessing || isCompleted}
            onClick={handleExecuteDpdpSettlement}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 disabled:opacity-50 cursor-pointer transition-all flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Executing DPDP Redaction &amp; F&amp;F...</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Settlement &amp; DPDP Complete</span>
              </>
            ) : (
              <>
                <UserMinus className="w-4 h-4" />
                <span>Execute DPDP Redaction &amp; Relieve Employee</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

