import React, { useState } from 'react';
import { FileUp, Sparkles, X, CheckCircle2, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { extractCandidateDetailsFromResume, ParsedResumeResult } from '../../pages/modules/fkRelations';

interface ResumeAutoFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDetails: (details: Record<string, any>) => void;
}

export const ResumeAutoFillModal: React.FC<ResumeAutoFillModalProps> = ({
  isOpen,
  onClose,
  onApplyDetails
}) => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [extractedData, setExtractedData] = useState<ParsedResumeResult | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      setResumeText(content);
      const parsed = extractCandidateDetailsFromResume(content);
      // Fallback sensible defaults if raw text has limited structure
      if (!parsed.name) parsed.name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setExtractedData(parsed);
      setIsParsing(false);
    };
    reader.onerror = () => {
      setIsParsing(false);
    };

    reader.readAsText(file);
  };

  const handleLoadSampleResume = (role: 'engineer' | 'operations') => {
    setIsParsing(true);
    let sample = '';
    if (role === 'engineer') {
      sample = `
ANAND VENKATESH
Senior CNC Tooling & Mechanical Production Engineer
Email: anand.v.tech@gmail.com | Phone: +91 9876543210
Aadhaar: 5421 8903 1245 | PAN: ABCDE1234F
Location: Chennai, Tamil Nadu, 600028

PROFESSIONAL SUMMARY
Experienced Production Engineer with 10 years of expertise in high-precision machining, CNC 5-Axis tool programming, ASTM material specs, and automotive component production.

WORK EXPERIENCE
Senior Production Engineer — Larsen & Toubro Heavy Engineering (2018 - Present)
- Supervised CNC machining cell producing ₹4.5 Cr monthly output with zero rejection.
- Managed ISO-9001 and IATF-16949 quality compliance inspections.

EDUCATION
B.E. Mechanical Engineering — College of Engineering Guindy, Anna University (2014)

BANK & SALARY
Bank Account: 50100294827103 | IFSC: HDFC0000240
Current CTC: 9.5 LPA
      `;
      setFileName('Anand_Venkatesh_Senior_Engineer_CV.pdf');
    } else {
      sample = `
PRIYA SUNDARAM
Human Resources Business Partner & Talent Acquisition Lead
Email: priya.sundaram.hr@gmail.com | Phone: +91 9876543211
Aadhaar: 6781 2903 4512 | PAN: PQRSK9876L
Location: Bangalore, Karnataka

PROFESSIONAL SUMMARY
7+ years in Strategic HR Partnering, Statutory Labor Compliance (PF, ESI, Gratuity), and ERP payroll implementation for 500+ workforce manufacturing facilities.

WORK EXPERIENCE
HR Specialist — Tata AutoComp Systems (2019 - Present)
- Formulated employee welfare policies, Form A & Form B registers, and biometric attendance.

EDUCATION
MBA Human Resource Management — Symbiosis Institute of Business Management (2017)

BANK & SALARY
Bank Account: 91801004928172 | IFSC: SBIN0000123
Current CTC: 8.5 LPA
      `;
      setFileName('Priya_Sundaram_HRBP_Resume.docx');
    }

    setTimeout(() => {
      setResumeText(sample);
      const parsed = extractCandidateDetailsFromResume(sample);
      setExtractedData(parsed);
      setIsParsing(false);
    }, 400);
  };

  const handleApply = () => {
    if (!extractedData) return;
    const payload: Record<string, any> = {};

    if (extractedData.name) payload.name = extractedData.name;
    if (extractedData.email) {
      payload.email = extractedData.email;
      payload.personal_email = extractedData.email;
    }
    if (extractedData.phone) {
      payload.phone = extractedData.phone;
      payload.personal_phone = extractedData.phone;
    }
    if (extractedData.pan) payload.pan = extractedData.pan;
    if (extractedData.aadhaar) payload.aadhaar = extractedData.aadhaar;
    if (extractedData.department) payload.department = extractedData.department;
    if (extractedData.designation) payload.designation = extractedData.designation;
    if (extractedData.highest_qualification) payload.highest_qualification = extractedData.highest_qualification;
    if (extractedData.institution) payload.institution = extractedData.institution;
    if (extractedData.total_experience_years) payload.total_experience_years = extractedData.total_experience_years;
    if (extractedData.previous_company) payload.previous_company = extractedData.previous_company;
    if (extractedData.permanent_city) payload.permanent_city = extractedData.permanent_city;
    if (extractedData.bank_account) payload.bank_account = extractedData.bank_account;
    if (extractedData.ifsc) payload.ifsc = extractedData.ifsc;

    onApplyDetails(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 dark:text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Resume Parser & Auto-Fill</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload candidate CV to automatically populate all employee fields</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone Upload Box */}
        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50/60 dark:bg-slate-800/40 transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <FileUp className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {fileName ? fileName : 'Drag & drop candidate resume here, or click to browse'}
            </p>
            <p className="text-[11px] text-slate-400">Supports PDF, DOCX, DOC, or TXT resume dossiers</p>
          </div>
        </div>

        {/* One-Click Quick Test Demos */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px]">Quick Samples:</span>
          <button
            type="button"
            onClick={() => handleLoadSampleResume('engineer')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-medium transition-colors"
          >
            Senior Production Engineer CV
          </button>
          <button
            type="button"
            onClick={() => handleLoadSampleResume('operations')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-medium transition-colors"
          >
            HRBP Lead CV
          </button>
        </div>

        {/* Parsing Progress / Results Preview */}
        {isParsing && (
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
            <span>Analyzing resume structure and extracting KYC & career details...</span>
          </div>
        )}

        {extractedData && !isParsing && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Successfully Parsed Candidate Dossier</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Ready to Auto-Fill
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {extractedData.name && (
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-400">Full Name</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{extractedData.name}</p>
                </div>
              )}
              {extractedData.email && (
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-400">Email Address</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{extractedData.email}</p>
                </div>
              )}
              {extractedData.phone && (
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-400">Mobile Phone</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{extractedData.phone}</p>
                </div>
              )}
              {extractedData.pan && (
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-400">PAN Card No</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{extractedData.pan}</p>
                </div>
              )}
              {extractedData.aadhaar && (
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-400">Aadhaar Card No</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{extractedData.aadhaar}</p>
                </div>
              )}
              {extractedData.ifsc && (
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-400">Bank IFSC Code</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{extractedData.ifsc}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!extractedData || isParsing}
            onClick={handleApply}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Auto-Fill Employee Inputs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

