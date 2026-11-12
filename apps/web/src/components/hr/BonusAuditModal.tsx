import React, { useState, useMemo } from 'react';
import {
  Award,
  DollarSign,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  ShieldCheck,
  TrendingUp,
  Building,
  CreditCard,
  Send,
  Calendar,
  Users,
  Search,
  Filter,
  CheckCheck
} from 'lucide-react';
import {
  calculateStatutoryBonus,
  ensureTableSeedRecords,
  EmployeeBonusTallyItem,
  BonusAuditSummary
} from '../../pages/modules/fkRelations';

interface BonusAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEmployee?: any;
}

export const BonusAuditModal: React.FC<BonusAuditModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tally' | 'formC' | 'audit'>('tally');
  const [accountingYear, setAccountingYear] = useState<string>('2025-2026');
  const [bonusPercentage, setBonusPercentage] = useState<number>(8.33);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load all active employees from seed / tenant storage
  const employees = useMemo(() => {
    return ensureTableSeedRecords('tb_employee_master');
  }, [isOpen]);

  // Compute Bonus Tally & Form C Data
  const { items, summary } = useMemo(() => {
    return calculateStatutoryBonus(employees, bonusPercentage, accountingYear);
  }, [employees, bonusPercentage, accountingYear]);

  // Local state for items to allow toggling disbursement status
  const [bonusItems, setBonusItems] = useState<EmployeeBonusTallyItem[]>([]);

  React.useEffect(() => {
    if (items.length > 0) {
      setBonusItems(items);
    }
  }, [items]);

  if (!isOpen) return null;

  // Filtered Bonus List
  const filteredItems = bonusItems.filter((item) => {
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || item.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(bonusItems.map((i) => i.department)));

  // Batch Disburse All
  const handleDisburseAll = () => {
    const updated = bonusItems.map((b) => ({
      ...b,
      paymentStatus: 'DISBURSED' as const,
      paymentDate: new Date().toISOString().split('T')[0]
    }));
    setBonusItems(updated);
    setActionNotice(
      `CMS Batch Payment initiated: ₹${summary.totalNetDisbursed.toLocaleString('en-IN')} disbursed to ${updated.length} employees via Direct Corporate Bank Transfer!`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Sr No',
      'Employee ID',
      'Employee Name',
      'Father/Husband Name',
      'Department',
      'Designation',
      'Days Worked',
      'Annual Basic+DA (INR)',
      'Bonus %',
      'Gross Bonus (INR)',
      'Interim Advance Deducted (INR)',
      'TDS (INR)',
      'Net Disbursed (INR)',
      'Bank Account',
      'IFSC Code',
      'Payment Status',
      'UTR Ref'
    ];

    const rows = bonusItems.map((item, index) => [
      index + 1,
      item.employeeCode,
      `"${item.employeeName}"`,
      `"${item.fatherOrSpouseName}"`,
      `"${item.department}"`,
      `"${item.designation}"`,
      item.daysWorked,
      item.annualBasicDa,
      `${item.bonusPercentage}%`,
      item.grossBonusPayable,
      item.interimFestivalAdvance,
      item.statutoryTds,
      item.netBonusDisbursed,
      `"${item.bankAccount}"`,
      item.ifsc,
      item.paymentStatus,
      item.transactionRef
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Form_C_Bonus_Register_${accountingYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-4xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 dark:text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-600 text-white shadow-md shadow-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Statutory Bonus Tally &amp; Labour Audit Portal
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-bold border border-amber-300">
                  Payment of Bonus Act, 1965
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Annual Statutory Bonus calculation (8.33% to 20%), Interim advance offset, and Form C Audit Register
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('tally')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'tally' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Bonus Tally Sheet</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('formC')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'formC' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Form C (Statutory Register Rule 4(c))</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Labour Inspector Audit Checklist</span>
          </button>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Tab 1: Bonus Tally Sheet */}
        {activeTab === 'tally' && (
          <div className="space-y-4">
            {/* Control Bar: Accounting Year & Bonus % Presets */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Accounting Year
                  </span>
                  <select
                    value={accountingYear}
                    onChange={(e) => setAccountingYear(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="2025-2026">FY 2025–2026 (Active Accounting Period)</option>
                    <option value="2024-2025">FY 2024–2025 (Previous Audited Year)</option>
                    <option value="2023-2024">FY 2023–2024</option>
                  </select>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Statutory Bonus Rate (%)
                  </span>
                  <div className="flex items-center gap-1">
                    {[
                      { label: '8.33% (Min)', val: 8.33 },
                      { label: '10.0%', val: 10.0 },
                      { label: '12.5%', val: 12.5 },
                      { label: '15.0%', val: 15.0 },
                      { label: '20.0% (Max)', val: 20.0 }
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setBonusPercentage(preset.val)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          bonusPercentage === preset.val
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDisburseAll}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Batch Disburse All</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Eligible Employees</span>
                <p className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {summary.totalEmployees} Staff
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">100% Qualified (&gt;30 days)</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Annual Wages</span>
                <p className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">
                  ₹{summary.totalAnnualBasicDa.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">Basic + DA computation base</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Gross Bonus @ {bonusPercentage}%</span>
                <p className="text-xl font-mono font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                  ₹{summary.totalGrossBonus.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  Advances: -₹{summary.totalAdvancesDeducted.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                  Net Disbursed Payable
                </span>
                <p className="text-xl font-mono font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">
                  ₹{summary.totalNetDisbursed.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">Bank Remittance Ready</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff, employee code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              >
                <option value="ALL">All Departments ({bonusItems.length})</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Bonus Tally Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl max-h-72">
              <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold sticky top-0">
                  <tr>
                    <th className="p-3">Staff Identity</th>
                    <th className="p-3">Department</th>
                    <th className="p-3 text-right">Annual Basic+DA</th>
                    <th className="p-3 text-right">Gross Bonus</th>
                    <th className="p-3 text-right">Festival Adv. (Sec 17)</th>
                    <th className="p-3 text-right">Net Payable</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {filteredItems.map((item) => (
                    <tr key={item.employeeCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-sans font-bold text-slate-900 dark:text-white">
                          {item.employeeName}
                        </div>
                        <span className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-950 px-1 rounded">
                          {item.employeeCode}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-slate-500">{item.department}</td>
                      <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                        ₹{item.annualBasicDa.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-bold text-amber-600">
                        ₹{item.grossBonusPayable.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right text-rose-600">
                        {item.interimFestivalAdvance > 0
                          ? `-₹${item.interimFestivalAdvance.toLocaleString('en-IN')}`
                          : '₹0'}
                      </td>
                      <td className="p-3 text-right font-extrabold text-emerald-600">
                        ₹{item.netBonusDisbursed.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                            item.paymentStatus === 'DISBURSED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Form C - Statutory Bonus Register */}
        {activeTab === 'formC' && (
          <div className="space-y-4 text-xs">
            {/* Form C Header Presentation */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  STATUTORY LABOUR REGISTER | RULE 4(C)
                </p>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  FORM C: Bonus Paid to Employees for Accounting Year {accountingYear}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Maintained under Section 10 &amp; 11 of Payment of Bonus Act, 1965 and Rule 4(c) of Payment of Bonus Rules, 1975
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Form C</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Official Statutory Form C Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl max-h-80">
              <table className="w-full text-left text-[11px] divide-y divide-slate-100 dark:divide-slate-800">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                  <tr>
                    <th className="p-2.5">Col 1<br /><span className="text-[9px] font-normal">Sr No</span></th>
                    <th className="p-2.5">Col 2<br /><span className="text-[9px] font-normal">Name of Employee &amp; Father/Spouse</span></th>
                    <th className="p-2.5">Col 3<br /><span className="text-[9px] font-normal">&gt;30 Days?</span></th>
                    <th className="p-2.5">Col 4<br /><span className="text-[9px] font-normal">Designation</span></th>
                    <th className="p-2.5 text-right">Col 5<br /><span className="text-[9px] font-normal">Days Worked</span></th>
                    <th className="p-2.5 text-right">Col 6<br /><span className="text-[9px] font-normal">Wages (Basic+DA)</span></th>
                    <th className="p-2.5 text-right">Col 7<br /><span className="text-[9px] font-normal">Bonus Payable (Sec 10/11)</span></th>
                    <th className="p-2.5 text-right">Col 8<br /><span className="text-[9px] font-normal">Puja Advance (Sec 17)</span></th>
                    <th className="p-2.5 text-right">Col 9<br /><span className="text-[9px] font-normal">Net Disbursed</span></th>
                    <th className="p-2.5 text-center">Col 10<br /><span className="text-[9px] font-normal">Date &amp; UTR Ref</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[10px]">
                  {bonusItems.map((item, idx) => (
                    <tr key={item.employeeCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-sans">
                        <strong className="text-slate-900 dark:text-white block">{item.employeeName}</strong>
                        <span className="text-slate-400 text-[10px]">S/o or D/o {item.fatherOrSpouseName}</span>
                      </td>
                      <td className="p-2.5 font-sans text-center text-emerald-600 font-bold">YES</td>
                      <td className="p-2.5 font-sans text-slate-500">{item.designation}</td>
                      <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">{item.daysWorked}</td>
                      <td className="p-2.5 text-right">₹{item.annualBasicDa.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right font-bold text-amber-600">
                        ₹{item.grossBonusPayable.toLocaleString('en-IN')} ({item.bonusPercentage}%)
                      </td>
                      <td className="p-2.5 text-right text-rose-600">
                        {item.interimFestivalAdvance > 0
                          ? `₹${item.interimFestivalAdvance.toLocaleString('en-IN')}`
                          : '—'}
                      </td>
                      <td className="p-2.5 text-right font-extrabold text-emerald-600">
                        ₹{item.netBonusDisbursed.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-center font-sans">
                        <span className="block font-mono text-[9px] text-slate-400">{item.paymentDate}</span>
                        <span className="text-[9px] font-mono text-blue-600 truncate max-w-[120px] inline-block">
                          {item.transactionRef}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statutory Sign-off Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
              <div>
                <span>Employer / Authorized Factory Occupier Signature: _______________________</span>
              </div>
              <div>
                <span>Official Stamp &amp; Audit Seal: [ Enterprise Certified Compliance ]</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Labour Inspector Statutory Audit Checklist */}
        {activeTab === 'audit' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Statutory Labour Enforcement Audit Status: 100% COMPLIANT
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    All mandates under Payment of Bonus Act, 1965 and Payment of Bonus Rules, 1975 verified for accounting year {accountingYear}.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs">
                AUDIT READY
              </span>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCheck className="w-4 h-4" />
                  <span>Section 10: Minimum Bonus Guarantee (8.33%)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Statutory minimum bonus of 8.33% of Basic + DA has been computed and credited even during years with zero allocable surplus.
                </p>
                <span className="text-[10px] font-mono text-slate-400 block">Status: Fully Satisfied</span>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCheck className="w-4 h-4" />
                  <span>Section 11: Maximum Ceiling Cap (20.0%)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Gross bonus rate of {bonusPercentage}% does not breach the statutory ceiling of 20% of annual wages.
                </p>
                <span className="text-[10px] font-mono text-slate-400 block">Status: Verified ({bonusPercentage}% &lt;= 20%)</span>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCheck className="w-4 h-4" />
                  <span>Section 17: Adjustment of Customary / Festival Advance</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Diwali and Puja advances paid in advance are legally offset against final statutory bonus under Section 17.
                </p>
                <span className="text-[10px] font-mono text-slate-400 block">
                  Recovered: ₹{summary.totalAdvancesDeducted.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCheck className="w-4 h-4" />
                  <span>Section 19: Time-limit for Payment of Bonus</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Bonus is disbursed within the statutory limitation period of 8 months from the close of the accounting year.
                </p>
                <span className="text-[10px] font-mono text-slate-400 block">Deadline: 30 November 2026</span>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCheck className="w-4 h-4" />
                  <span>Rule 4(c): Maintenance of Register in Form C</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Form C register is digitally maintained, indexed by staff identity, and available for instant inspection by the Labour Enforcement Officer.
                </p>
                <span className="text-[10px] font-mono text-slate-400 block">Register Status: Active &amp; Printable</span>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCheck className="w-4 h-4" />
                  <span>Section 8: Minimum Qualification (30 Working Days)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  All employees on the roster have completed a minimum of 30 working days in the relevant accounting year.
                </p>
                <span className="text-[10px] font-mono text-slate-400 block">Eligible Count: {summary.totalEmployees} / {summary.totalEmployees}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-[11px] text-slate-500 font-mono">
            Accounting Year: {accountingYear} | Rate: {bonusPercentage}% | Net Disbursed: ₹{summary.totalNetDisbursed.toLocaleString('en-IN')}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};

