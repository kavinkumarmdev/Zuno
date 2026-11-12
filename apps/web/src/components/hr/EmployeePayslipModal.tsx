import React, { useState } from 'react';
import { Printer, Download, X, Banknote, Building2, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { calculateSalaryComponents } from '../../pages/modules/fkRelations';

interface EmployeePayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

export const EmployeePayslipModal: React.FC<EmployeePayslipModalProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [otHours, setOtHours] = useState(8.5);
  const [lopDays, setLopDays] = useState(0);

  if (!isOpen || !employee) return null;

  const grossMonthly = Number(employee.amount || 75000);
  const sal = calculateSalaryComponents(grossMonthly);

  // Overtime rate: double ordinary hourly rate under Section 59 of Factories Act, 1948
  // Hourly rate = Gross / (26 days * 8 hours) = Gross / 208
  const normalHourlyRate = Math.round(grossMonthly / 208);
  const otHourlyRate = normalHourlyRate * 2;
  const overtimeEarning = Math.round(otHourlyRate * otHours);

  // LOP deduction if any
  const perDayRate = Math.round(grossMonthly / 30);
  const lopDeduction = perDayRate * lopDays;

  // Earnings
  const basic = sal.basicSalary;
  const hra = sal.hra;
  const da = sal.da;
  const specialAllowance = sal.specialAllowance;
  const grossEarnings = basic + hra + da + specialAllowance + overtimeEarning - lopDeduction;

  // Deductions
  const pf = sal.pfDeduction;
  const esi = sal.esiDeduction;
  const professionalTax = 200; // Standard monthly PT in Indian industrial slabs
  const incomeTaxTds = grossMonthly > 100000 ? Math.round(grossMonthly * 0.1) : 0;
  const totalDeductions = pf + esi + professionalTax + incomeTaxTds;

  // Net Pay
  const netPay = Math.max(0, grossEarnings - totalDeductions);

  // Employer statutory contributions
  const employerPf = Math.round(basic * 0.12);
  const employerEsi = grossMonthly <= 21000 ? Math.round(grossMonthly * 0.0325) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-3xl w-full max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-900 dark:text-white my-auto space-y-6">
        {/* Modal Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-600">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Salary Payslip & Wage Slip
              </h3>
              <p className="text-xs text-slate-500">
                Statutory Wage Slip under Rule 26(2) of the Payment of Wages Act, 1936
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Payslip</span>
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

        {/* Month & Parameter Filters */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Wage Period:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div>
              <span className="text-slate-400 mr-1">OT Hours:</span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={otHours}
                onChange={(e) => setOtHours(Number(e.target.value) || 0)}
                className="w-14 px-1.5 py-0.5 border border-slate-300 dark:border-slate-700 rounded text-center bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <span className="text-slate-400 mr-1">LOP Days:</span>
              <input
                type="number"
                min="0"
                max="30"
                value={lopDays}
                onChange={(e) => setLopDays(Number(e.target.value) || 0)}
                className="w-12 px-1.5 py-0.5 border border-slate-300 dark:border-slate-700 rounded text-center bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Printable Payslip Card */}
        <div id="printable-payslip" className="p-6 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl space-y-5 text-xs text-slate-800 dark:text-slate-200">
          {/* Company Banner */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                Z
              </div>
              <div>
                <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                  Apex Global Technologies Private Limited
                </h2>
                <p className="text-[11px] text-slate-500">
                  Plot 104, Industrial Estate, Guindy, Chennai — 600032 | GSTIN: 33AAAAA0000A1Z5
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                Payslip: {selectedMonth} {selectedYear}
              </span>
            </div>
          </div>

          {/* Employee Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-[11px]">
            <div>
              <span className="text-slate-400 block">Employee ID:</span>
              <strong className="font-mono text-blue-600">{employee.code}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Employee Full Name:</span>
              <strong className="font-bold text-slate-900 dark:text-white">{employee.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Department:</span>
              <span>{employee.department || 'Operations'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Designation:</span>
              <span>{employee.designation || 'Staff'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Bank Account:</span>
              <span className="font-mono font-bold">{employee.bank_account || '50100294827103'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Bank & IFSC:</span>
              <span>{employee.bank_name || 'HDFC Bank'} ({employee.ifsc || 'HDFC0000240'})</span>
            </div>
            <div>
              <span className="text-slate-400 block">EPF UAN:</span>
              <span className="font-mono">{employee.pf_uan || '100924810294'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">PAN Number:</span>
              <span className="font-mono">{employee.pan || 'ABCDE1234F'}</span>
            </div>
          </div>

          {/* Attendance Overview Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-[11px] p-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Calendar Days</span>
              <strong>30</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Paid Days</span>
              <strong className="text-emerald-600">{30 - lopDays}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Loss of Pay (LOP)</span>
              <strong className={lopDays > 0 ? 'text-rose-600' : 'text-slate-600'}>{lopDays}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Overtime Hours</span>
              <strong className="text-amber-600">{otHours} hrs</strong>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-2 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Gross Earnings
              </div>
              <div className="p-3 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Basic Salary (50%)</span>
                  <strong>₹{basic.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">House Rent Allowance (HRA 20%)</span>
                  <strong>₹{hra.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Dearness Allowance (DA 15%)</span>
                  <strong>₹{da.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Special Allowance (15%)</span>
                  <strong>₹{specialAllowance.toLocaleString('en-IN')}</strong>
                </div>
                {overtimeEarning > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400">
                    <span className="font-sans">Overtime Wages (2x Rate)</span>
                    <strong>+₹{overtimeEarning.toLocaleString('en-IN')}</strong>
                  </div>
                )}
                {lopDeduction > 0 && (
                  <div className="flex justify-between text-rose-600 dark:text-rose-400">
                    <span className="font-sans">LOP Deduction ({lopDays} days)</span>
                    <strong>-₹{lopDeduction.toLocaleString('en-IN')}</strong>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span className="font-sans">Total Gross Earnings</span>
                  <span className="text-blue-600">₹{grossEarnings.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-2 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Statutory Deductions
              </div>
              <div className="p-3 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Provident Fund (EPF 12%)</span>
                  <strong>₹{pf.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">ESI Contribution (0.75%)</span>
                  <strong>{esi > 0 ? `₹${esi.toLocaleString('en-IN')}` : '₹0.00 (Exempt)'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Professional Tax (PT)</span>
                  <strong>₹{professionalTax.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Income Tax TDS Deduction</span>
                  <strong>{incomeTaxTds > 0 ? `₹${incomeTaxTds.toLocaleString('en-IN')}` : '₹0.00'}</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span className="font-sans">Total Deductions</span>
                  <span className="text-rose-600">₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight Box */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 dark:text-emerald-300">
                Net Disbursed Take-Home Pay
              </span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                Credited directly to {employee.bank_name || 'Bank'} A/c {employee.bank_account || '50100294827103'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                ₹{netPay.toLocaleString('en-IN')}.00
              </span>
            </div>
          </div>

          {/* Employer Contributions & Disclaimer */}
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
            <span>Employer PF: ₹{employerPf.toLocaleString('en-IN')} | Employer ESI: ₹{employerEsi.toLocaleString('en-IN')}</span>
            <span>Digitally authenticated by Zuno Cloud ERP • Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
};

