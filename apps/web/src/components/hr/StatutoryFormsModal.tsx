import React, { useState } from 'react';
import { FileText, Printer, Download, CheckCircle2, X, Award, ShieldCheck, Building } from 'lucide-react';
import { STATUTORY_FORMS_CATALOG, StatutoryFormDefinition } from '../../pages/modules/fkRelations';

interface StatutoryFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

export const StatutoryFormsModal: React.FC<StatutoryFormsModalProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  const [selectedForm, setSelectedForm] = useState<StatutoryFormDefinition>(STATUTORY_FORMS_CATALOG[0]);
  const [activeTab, setActiveTab] = useState<'forms' | 'training'>('forms');

  if (!isOpen || !employee) return null;

  const trainingRecords = [
    { title: 'Factory Health, Safety & Hazardous Tooling Induction', date: '2024-03-20', status: 'CERTIFIED', certNo: 'CERT-SAF-2024-091' },
    { title: 'ISO 9001:2015 Quality Management & Zero-Defect Inspection', date: '2024-04-12', status: 'CERTIFIED', certNo: 'CERT-ISO-2024-114' },
    { title: '5-Axis CNC Precision Tool Programming & Safety Interlocks', date: '2024-05-02', status: 'CERTIFIED', certNo: 'CERT-CNC-2024-038' },
    { title: 'Industrial Fire Hazard Prevention & Rapid Evacuation Protocol', date: '2024-06-15', status: 'CERTIFIED', certNo: 'CERT-FIR-2024-202' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-900 dark:text-white my-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Statutory Labour Compliance Dossier & Training Records
              </h3>
              <p className="text-xs text-slate-500">
                Candidate: <strong className="text-slate-800 dark:text-slate-200">{employee.name}</strong> ({employee.code}) | {employee.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
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
            onClick={() => setActiveTab('forms')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'forms'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Statutory Labour Forms (Form A, B, C, D, 11, F)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('training')}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'training'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Employee Training Certifications</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono">
              4 Completed
            </span>
          </button>
        </div>

        {/* Tab 1: Statutory Labour Forms */}
        {activeTab === 'forms' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form Selector Sidebar */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Government Labor Registers</p>
              {STATUTORY_FORMS_CATALOG.map((form) => (
                <button
                  key={form.code}
                  type="button"
                  onClick={() => setSelectedForm(form)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs transition-all ${
                    selectedForm.code === form.code
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">{form.code}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{form.category}</span>
                  </div>
                  <p className="mt-1 font-semibold truncate">{form.title}</p>
                </button>
              ))}
            </div>

            {/* Live Form Preview Document */}
            <div className="md:col-span-2 p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-3xl space-y-4 text-xs font-serif">
              <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-slate-500">
                  Government of India — Statutory Labour Compliance
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 font-sans">{selectedForm.title}</h3>
                <p className="text-[11px] text-slate-500 font-sans italic">{selectedForm.act}</p>
              </div>

              {/* Form Content Structure */}
              <div className="space-y-3 font-sans">
                <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400">Employer / Establishment:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100">Apex Global Technologies Pvt Ltd</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Employee Full Name:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{employee.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Employee Token Code:</span>
                    <p className="font-mono font-bold text-blue-600">{employee.code}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Department & Designation:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{employee.department} — {employee.designation}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Aadhaar Identification:</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{employee.aadhaar || '5421-8903-1245'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">PAN Card Number:</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{employee.pan || 'ABCDE1234F'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">EPF UAN Number:</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{employee.pf_uan || '100924810294'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">ESI Insurance Number:</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{employee.esi_number || '31092847102938471'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Bank IFSC & Account:</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{employee.ifsc || 'HDFC0000240'} | {employee.bank_account || '50100294827103'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Bank & Branch:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{employee.bank_name || 'HDFC Bank'} ({employee.bank_branch || 'Anna Nagar'})</p>
                  </div>
                </div>

                {/* Salary Section for Form B */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Wage Structure Schedule (Monthly INR)</span>
                  <div className="grid grid-cols-3 gap-2 font-mono">
                    <div>Gross CTC: <strong>₹{employee.amount || '75,000'}</strong></div>
                    <div>Basic (50%): <strong>₹{employee.basic_salary || '37,500'}</strong></div>
                    <div>HRA (20%): <strong>₹{employee.hra || '15,000'}</strong></div>
                    <div>DA (15%): <strong>₹{employee.da || '11,250'}</strong></div>
                    <div>PF Deduct: <strong>₹{employee.pf_deduction || '4,500'}</strong></div>
                    <div>Net Payable: <strong className="text-emerald-600">₹{employee.net_salary || '69,938'}</strong></div>
                  </div>
                </div>

                {/* Statutory Certification Signature Section */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="text-center">
                    <p className="font-mono underline">Verified & Signed</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{employee.name}</p>
                    <p className="text-[10px] text-slate-400">Employee Signature</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-emerald-600 font-bold">DIGITALLY SEALED</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">Authorized Factory Manager</p>
                    <p className="text-[10px] text-slate-400">Employer Seal & Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Training Certifications */}
        {activeTab === 'training' && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900 dark:text-blue-200">
                  Mandatory Factory & Safety Induction Certifications for {employee.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                100% Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trainingRecords.map((t, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{t.title}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <span>Completed: {t.date}</span>
                    <span className="text-slate-400">{t.certNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

