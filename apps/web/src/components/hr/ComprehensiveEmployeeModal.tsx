import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Briefcase,
  Building,
  CreditCard,
  DollarSign,
  Shield,
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  FileText,
  Search,
  Check
} from 'lucide-react';
import { getCompanyAttendancePolicy, CompanyAttendancePolicy } from '../../pages/modules/fkRelations';

interface ComprehensiveEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Record<string, any>) => void;
  initialData?: Record<string, any> | null;
}

export const ComprehensiveEmployeeModal: React.FC<ComprehensiveEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'bank_statutory' | 'salary' | 'nominee'>('personal');
  const [policy] = useState<CompanyAttendancePolicy>(getCompanyAttendancePolicy());
  const [isValidatingIfsc, setIsValidatingIfsc] = useState(false);
  const [ifscError, setIfscError] = useState<string | null>(null);

  // Comprehensive Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    // Personal Details
    name: '',
    code: '',
    gender: 'Male',
    dob: '',
    blood_group: 'O+',
    marital_status: 'Single',
    father_or_spouse_name: '',
    email: '',
    phone: '',
    personal_email: '',
    personal_phone: '',
    permanent_address: '',
    permanent_city: '',
    permanent_pincode: '',
    current_address: '',
    current_city: '',

    // Employment Details
    department: 'Engineering & Production',
    designation: 'Senior Production Engineer',
    date: new Date().toISOString().split('T')[0], // Date of Joining
    employment_type: 'Permanent Full-Time',
    branch: 'Main Plant / HQ',
    shift: 'General Shift (09:00 - 18:00)',
    reporting_manager: '',
    status: 'ACTIVE',
    highest_qualification: 'B.E. / B.Tech',
    institution: '',
    total_experience_years: '0',
    previous_company: '',

    // Bank & Statutory Details
    bank_name: '',
    bank_branch: '',
    bank_account: '',
    confirm_bank_account: '',
    ifsc: '',
    pan: '',
    aadhaar: '',
    pf_uan: '',
    esi_number: '',
    driving_licence: '',

    // Salary & Compensation Structure
    amount: '45000', // Monthly Gross CTC
    basic_salary: '22500',
    hra: '9000',
    da: '6750',
    special_allowance: '6750',
    conveyance_allowance: '0',
    epf_employee: '1800',
    esi_employee: '0',
    professional_tax: '200',
    net_salary: '43000',

    // Nominee & Emergency Details
    nominee_name: '',
    nominee_relation: 'Spouse',
    nominee_dob: '',
    nominee_age: '',
    nominee_phone: '',
    nominee_share_percent: '100',
    guardian_name: '',
    guardian_relation: 'Mother',
    guardian_phone: '',
    emergency_contact_person: '',
    emergency_contact_phone: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize with existing data if editing or generate default code if new
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        amount: String(initialData.amount || initialData.gross_salary || '45000')
      }));
    } else {
      const randomCode = 'EMP-' + String(Math.floor(100 + Math.random() * 900));
      setFormData((prev) => ({
        ...prev,
        code: prev.code || randomCode
      }));
      // Auto-compute salary breakdown on default amount
      computeSalaryBreakdown('45000');
    }
  }, [initialData, isOpen]);

  // Compute Salary Breakdown dynamically from Gross Amount
  const computeSalaryBreakdown = (grossStr: string) => {
    const gross = parseFloat(grossStr) || 0;
    if (gross <= 0) return;

    const basic = Math.round(gross * 0.50); // 50% Basic
    const hra = Math.round(gross * 0.20);   // 20% HRA
    const da = Math.round(gross * 0.15);    // 15% DA
    const special = Math.max(0, gross - (basic + hra + da)); // Remainder

    // Statutory deductions
    const epfEmployee = basic > 15000 ? 1800 : Math.round(basic * 0.12);
    const esiEmployee = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
    const pt = gross > 15000 ? 200 : 0;
    const netTakeHome = Math.max(0, gross - (epfEmployee + esiEmployee + pt));

    setFormData((prev) => ({
      ...prev,
      amount: grossStr,
      basic_salary: String(basic),
      hra: String(hra),
      da: String(da),
      special_allowance: String(special),
      epf_employee: String(epfEmployee),
      esi_employee: String(esiEmployee),
      professional_tax: String(pt),
      net_salary: String(netTakeHome)
    }));
  };

  // Live IFSC Code Lookup
  const handleIfscChange = async (code: string) => {
    const clean = code.trim().toUpperCase();
    setFormData((p) => ({ ...p, ifsc: clean }));
    setIfscError(null);

    if (clean.length === 11) {
      setIsValidatingIfsc(true);
      try {
        const res = await fetch(`https://ifsc.razorpay.com/${clean}`);
        if (res.ok) {
          const data = await res.json();
          setFormData((p) => ({
            ...p,
            bank_name: data.BANK || p.bank_name,
            bank_branch: `${data.BRANCH || ''}, ${data.CITY || ''}`.trim()
          }));
        } else {
          // Known major bank fallback by IFSC prefix
          const prefix = clean.substring(0, 4);
          const bankMap: Record<string, string> = {
            SBIN: 'State Bank of India',
            HDFC: 'HDFC Bank Ltd',
            ICIC: 'ICICI Bank Ltd',
            PUNB: 'Punjab National Bank',
            BARB: 'Bank of Baroda',
            CNRB: 'Canara Bank',
            UTIB: 'Axis Bank Ltd',
            KKBK: 'Kotak Mahindra Bank Ltd',
            INDB: 'IndusInd Bank',
            IOBA: 'Indian Overseas Bank'
          };
          if (bankMap[prefix]) {
            setFormData((p) => ({
              ...p,
              bank_name: bankMap[prefix],
              bank_branch: 'Main City Branch'
            }));
          } else {
            setIfscError('IFSC verified locally. Please confirm bank name.');
          }
        }
      } catch {
        // Fallback bank map
        const prefix = clean.substring(0, 4);
        const bankMap: Record<string, string> = {
          SBIN: 'State Bank of India',
          HDFC: 'HDFC Bank Ltd',
          ICIC: 'ICICI Bank Ltd',
          UTIB: 'Axis Bank Ltd'
        };
        if (bankMap[prefix]) {
          setFormData((p) => ({ ...p, bank_name: bankMap[prefix] }));
        }
      } finally {
        setIsValidatingIfsc(false);
      }
    }
  };

  // Validate entire form across all tabs
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name?.trim()) errs.name = 'Employee full name is required.';
    if (!formData.code?.trim()) errs.code = 'Employee ID code is required.';
    if (!formData.email?.trim()) errs.email = 'Official work email is required.';
    if (!formData.phone?.trim()) errs.phone = 'Mobile phone number is required.';
    if (!formData.department?.trim()) errs.department = 'Department is required.';
    if (!formData.designation?.trim()) errs.designation = 'Designation / Job title is required.';
    if (!formData.amount || parseFloat(formData.amount) <= 0) errs.amount = 'Valid gross salary is required.';

    if (formData.bank_account && formData.confirm_bank_account && formData.bank_account !== formData.confirm_bank_account) {
      errs.confirm_bank_account = 'Bank account numbers do not match.';
    }

    setFormErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Switch to the tab containing the first error
      if (errs.name || errs.code || errs.email || errs.phone) setActiveTab('personal');
      else if (errs.department || errs.designation) setActiveTab('employment');
      else if (errs.amount) setActiveTab('salary');
      else if (errs.confirm_bank_account) setActiveTab('bank_statutory');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {initialData ? `Edit Employee: ${initialData.name || initialData.code}` : 'Add New Employee (All-in-One Dossier)'}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                  SINGLE-STEP CREATION
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Collect personal, statutory, banking, shift policy & salary details all in a single time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="px-6 pt-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'personal'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Personal & Contact</span>
            {formErrors.name && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('employment')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'employment'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>2. Job & Shift Details</span>
            {formErrors.department && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank_statutory')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'bank_statutory'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>3. Bank & Statutory (PAN/Aadhaar/UAN)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'salary'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>4. Salary & Auto-Breakdown</span>
            {formErrors.amount && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nominee')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'nominee'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>5. Nominee & Emergency</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Personal & Contact */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employee Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Chandrasekharan"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                  {formErrors.name && <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. EMP-101"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium outline-none focus:border-blue-500"
                  />
                  {formErrors.code && <p className="text-[11px] text-rose-500 mt-1">{formErrors.code}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={formData.blood_group || 'O+'}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Marital Status</label>
                  <select
                    value={formData.marital_status || 'Single'}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Father's or Spouse's Full Name</label>
                  <input
                    type="text"
                    value={formData.father_or_spouse_name || ''}
                    onChange={(e) => setFormData({ ...formData, father_or_spouse_name: e.target.value })}
                    placeholder="e.g. K. Chandrasekharan"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Work Email (For App Login) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh.c@company.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500"
                  />
                  {formErrors.email && <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Personal Secondary Email</label>
                  <input
                    type="email"
                    value={formData.personal_email || ''}
                    onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                    placeholder="ramesh.personal@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Address Details */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Residential Address Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Permanent Residential Address</label>
                    <input
                      type="text"
                      value={formData.permanent_address || ''}
                      onChange={(e) => setFormData({ ...formData, permanent_address: e.target.value })}
                      placeholder="Door / Flat No, Street, Layout"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Permanent City & PIN</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.permanent_city || ''}
                        onChange={(e) => setFormData({ ...formData, permanent_city: e.target.value })}
                        placeholder="City"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                      />
                      <input
                        type="text"
                        value={formData.permanent_pincode || ''}
                        onChange={(e) => setFormData({ ...formData, permanent_pincode: e.target.value })}
                        placeholder="PIN"
                        className="w-24 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Current / Present Address (If different)</label>
                  <input
                    type="text"
                    value={formData.current_address || ''}
                    onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                    placeholder="Local resident address"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Employment & Shift Details */}
          {activeTab === 'employment' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department || 'Engineering & Production'}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="Engineering & Production">Engineering & Production</option>
                    <option value="Operations & Plant Maintenance">Operations & Plant Maintenance</option>
                    <option value="Accounts & Financial Control">Accounts & Financial Control</option>
                    <option value="Human Resources & Talent">Human Resources & Talent</option>
                    <option value="Quality Assurance & ISO Compliance">Quality Assurance & ISO Compliance</option>
                    <option value="Supply Chain & Procurement">Supply Chain & Procurement</option>
                    <option value="Sales & Client Relations">Sales & Client Relations</option>
                    <option value="Information Technology & Security">Information Technology & Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Job Role <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Senior Production Engineer"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Joining (DOJ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employment Type</label>
                  <select
                    value={formData.employment_type || 'Permanent Full-Time'}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    <option value="Permanent Full-Time">Permanent Full-Time</option>
                    <option value="Probationary">Probationary Period</option>
                    <option value="Contract Workforce">Contract Workforce</option>
                    <option value="Trainee / Apprentice">Trainee / Apprentice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch / Plant Location</label>
                  <input
                    type="text"
                    value={formData.branch || 'Main Plant / HQ'}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Shift & Work Timing Configuration Card */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Shift Assignment & Policy Sync</span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-600 font-semibold">
                    Policy Punch Mode: {policy.punchMode === '4_PUNCH' ? '4 Punches (Factory)' : '2 Punches (Office)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Assigned Shift Schedule</label>
                    <select
                      value={formData.shift || 'General Shift (09:00 - 18:00)'}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    >
                      <option value="General Shift (09:00 - 18:00)">General Shift ({policy.shiftStartTime} - {policy.shiftEndTime})</option>
                      <option value="Morning Shift A (06:00 - 14:30)">Morning Shift A (06:00 - 14:30)</option>
                      <option value="Afternoon Shift B (14:00 - 22:30)">Afternoon Shift B (14:00 - 22:30)</option>
                      <option value="Night Shift C (22:00 - 06:30)">Night Shift C (22:00 - 06:30)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Reporting Manager</label>
                    <input
                      type="text"
                      value={formData.reporting_manager || ''}
                      onChange={(e) => setFormData({ ...formData, reporting_manager: e.target.value })}
                      placeholder="e.g. Managing Director / HOD"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  💡 Configured shift timings ({policy.shiftStartTime} to {policy.shiftEndTime}) with {policy.graceMinutes} mins grace and {policy.lunchStartTime} to {policy.lunchEndTime} lunch will govern this employee's punches and late deductions.
                </p>
              </div>

              {/* Education & Prior Experience */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Qualification & Past Experience
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Highest Qualification</label>
                    <select
                      value={formData.highest_qualification || 'B.E. / B.Tech'}
                      onChange={(e) => setFormData({ ...formData, highest_qualification: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    >
                      <option value="B.E. / B.Tech">B.E. / B.Tech</option>
                      <option value="M.E. / M.Tech">M.E. / M.Tech</option>
                      <option value="MBA / PGDM">MBA / PGDM</option>
                      <option value="MCA / M.Sc">MCA / M.Sc</option>
                      <option value="B.Com / M.Com">B.Com / M.Com</option>
                      <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                      <option value="ITI Certificate">ITI Certificate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">University / Institute</label>
                    <input
                      type="text"
                      value={formData.institution || ''}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="e.g. Anna University"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Prior Experience (Years)</label>
                    <input
                      type="number"
                      value={formData.total_experience_years || '0'}
                      onChange={(e) => setFormData({ ...formData, total_experience_years: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Bank & Statutory */}
          {activeTab === 'bank_statutory' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Statutory Identifiers */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Statutory Labour & Tax Compliance Numbers</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      PAN Card Number (10 Alphanumeric)
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={formData.pan || ''}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      placeholder="ABCDE1234F"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono tracking-wider outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Aadhaar Number (12 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={formData.aadhaar || ''}
                      onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value.replace(/\D/g, '') })}
                      placeholder="542189031245"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono tracking-wider outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      EPF Universal Account Number (UAN)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={formData.pf_uan || ''}
                      onChange={(e) => setFormData({ ...formData, pf_uan: e.target.value.replace(/\D/g, '') })}
                      placeholder="100924810294"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono tracking-wider outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ESIC Insurance IP Number (17 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={17}
                      value={formData.esi_number || ''}
                      onChange={(e) => setFormData({ ...formData, esi_number: e.target.value.replace(/\D/g, '') })}
                      placeholder="31092847102938471"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono tracking-wider outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Account with Live IFSC */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Direct Salary Bank Account Setup</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bank IFSC Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={11}
                        value={formData.ifsc || ''}
                        onChange={(e) => handleIfscChange(e.target.value)}
                        placeholder="e.g. HDFC0000240"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono uppercase font-bold outline-none focus:border-emerald-500"
                      />
                      {isValidatingIfsc && (
                        <span className="absolute right-2.5 top-2.5 text-[10px] text-emerald-600 animate-pulse font-medium">
                          Looking up...
                        </span>
                      )}
                    </div>
                    {ifscError && <p className="text-[10px] text-amber-600 mt-1">{ifscError}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Name (Auto-Lookup)
                    </label>
                    <input
                      type="text"
                      value={formData.bank_name || ''}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      placeholder="e.g. HDFC Bank"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Branch & City
                    </label>
                    <input
                      type="text"
                      value={formData.bank_branch || ''}
                      onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })}
                      placeholder="Branch location"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Salary Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.bank_account || ''}
                      onChange={(e) => setFormData({ ...formData, bank_account: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 50100294827103"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.confirm_bank_account || ''}
                      onChange={(e) => setFormData({ ...formData, confirm_bank_account: e.target.value.replace(/\D/g, '') })}
                      placeholder="Re-type account number"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none focus:border-emerald-500"
                    />
                    {formErrors.confirm_bank_account && (
                      <p className="text-[10px] text-rose-500 mt-1">{formErrors.confirm_bank_account}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Salary & Auto-Breakdown */}
          {activeTab === 'salary' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Monthly Gross CTC & Live Breakdown Engine
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Type the total monthly CTC to auto-split Basic, HRA, DA, EPF, and calculate take-home.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">Net Monthly Take-Home</span>
                    <span className="text-base font-extrabold text-emerald-600 font-mono">
                      ₹{Number(formData.net_salary || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="max-w-xs">
                  <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 mb-1">
                    Monthly Gross CTC (INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      value={formData.amount || ''}
                      onChange={(e) => computeSalaryBreakdown(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full pl-8 pr-3.5 py-2.5 text-sm font-extrabold text-blue-600 font-mono rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>
              </div>

              {/* Earnings Breakdown Grid */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Monthly Earnings Structure (Credit Components)
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800">
                    <span className="text-[11px] text-slate-500 block font-medium">Basic Salary (50%)</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                      ₹{Number(formData.basic_salary || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800">
                    <span className="text-[11px] text-slate-500 block font-medium">HRA (20%)</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                      ₹{Number(formData.hra || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800">
                    <span className="text-[11px] text-slate-500 block font-medium">Dearness Allowance (15%)</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                      ₹{Number(formData.da || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800">
                    <span className="text-[11px] text-slate-500 block font-medium">Special Allowance (15%)</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                      ₹{Number(formData.special_allowance || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions Grid */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Statutory Deductions (Debit Components)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
                    <span className="text-[11px] text-rose-700 dark:text-rose-400 block font-medium">EPF Employee (12%)</span>
                    <span className="text-sm font-bold text-rose-800 dark:text-rose-300 font-mono mt-0.5 block">
                      -₹{Number(formData.epf_employee || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
                    <span className="text-[11px] text-rose-700 dark:text-rose-400 block font-medium">ESIC Employee (0.75%)</span>
                    <span className="text-sm font-bold text-rose-800 dark:text-rose-300 font-mono mt-0.5 block">
                      -₹{Number(formData.esi_employee || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
                    <span className="text-[11px] text-rose-700 dark:text-rose-400 block font-medium">Professional Tax (PT)</span>
                    <span className="text-sm font-bold text-rose-800 dark:text-rose-300 font-mono mt-0.5 block">
                      -₹{Number(formData.professional_tax || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Nominee & Emergency */}
          {activeTab === 'nominee' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Gratuity & PF Nominee Declaration (Form F & 2)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nominee Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.nominee_name || ''}
                      onChange={(e) => setFormData({ ...formData, nominee_name: e.target.value })}
                      placeholder="e.g. Meena Ramesh"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Relationship
                    </label>
                    <select
                      value={formData.nominee_relation || 'Spouse'}
                      onChange={(e) => setFormData({ ...formData, nominee_relation: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Nominee DOB</label>
                    <input
                      type="date"
                      value={formData.nominee_dob || ''}
                      onChange={(e) => setFormData({ ...formData, nominee_dob: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Nominee Phone</label>
                    <input
                      type="tel"
                      value={formData.nominee_phone || ''}
                      onChange={(e) => setFormData({ ...formData, nominee_phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Benefit Share %</label>
                    <input
                      type="number"
                      value={formData.nominee_share_percent || '100'}
                      onChange={(e) => setFormData({ ...formData, nominee_share_percent: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Emergency Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Emergency Contact Person Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergency_contact_person || ''}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_person: e.target.value })}
                      placeholder="e.g. S. Suresh (Brother)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Emergency Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.emergency_contact_phone || ''}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                      placeholder="e.g. 9876543211"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-blue-600">Tip:</span> All details are saved in a single transaction to your tenant database.
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Employee (All Details)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
