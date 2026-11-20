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
  Check,
  Plus,
  Trash2,
  Users,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { getCompanyAttendancePolicy, CompanyAttendancePolicy } from '../../pages/modules/fkRelations';

export interface NomineeItem {
  id: string;
  name: string;
  relation: string;
  dob: string;
  age: string;
  phone: string;
  share_percent: string;
  aadhaar_or_id: string;
  is_minor: boolean;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
}

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

  // Address sync and PIN lookup state
  const [sameAsPermanent, setSameAsPermanent] = useState<boolean>(true);
  const [permanentPostOffices, setPermanentPostOffices] = useState<string[]>([]);
  const [isLoadingPermanentPin, setIsLoadingPermanentPin] = useState<boolean>(false);
  const [permanentPinMessage, setPermanentPinMessage] = useState<string | null>(null);

  const [currentPostOffices, setCurrentPostOffices] = useState<string[]>([]);
  const [isLoadingCurrentPin, setIsLoadingCurrentPin] = useState<boolean>(false);
  const [currentPinMessage, setCurrentPinMessage] = useState<string | null>(null);

  // Multi-Nominee state
  const [nominees, setNominees] = useState<NomineeItem[]>([
    {
      id: 'nom-1',
      name: '',
      relation: 'Spouse',
      dob: '',
      age: '',
      phone: '',
      share_percent: '100',
      aadhaar_or_id: '',
      is_minor: false,
      guardian_name: '',
      guardian_relation: 'Mother',
      guardian_phone: ''
    }
  ]);

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

    // Permanent Address
    permanent_address: '',
    permanent_pincode: '',
    permanent_city: '',
    permanent_district: '',
    permanent_state: '',

    // Current Address
    same_as_permanent_address: true,
    current_address: '',
    current_pincode: '',
    current_city: '',
    current_district: '',
    current_state: '',

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

    // Emergency Details
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

      // Restore nominees if available
      if (Array.isArray(initialData.nominees) && initialData.nominees.length > 0) {
        setNominees(initialData.nominees);
      } else if (initialData.nominee_name) {
        setNominees([
          {
            id: 'nom-1',
            name: initialData.nominee_name || '',
            relation: initialData.nominee_relation || 'Spouse',
            dob: initialData.nominee_dob || '',
            age: initialData.nominee_age || '',
            phone: initialData.nominee_phone || '',
            share_percent: initialData.nominee_share_percent || '100',
            aadhaar_or_id: initialData.nominee_aadhaar || '',
            is_minor: !!initialData.is_minor,
            guardian_name: initialData.guardian_name || '',
            guardian_relation: initialData.guardian_relation || 'Mother',
            guardian_phone: initialData.guardian_phone || ''
          }
        ]);
      }

      if (initialData.same_as_permanent_address !== undefined) {
        setSameAsPermanent(!!initialData.same_as_permanent_address);
      }
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

  // Keep current address synchronized whenever sameAsPermanent is true
  useEffect(() => {
    if (sameAsPermanent) {
      setFormData((prev) => ({
        ...prev,
        same_as_permanent_address: true,
        current_address: prev.permanent_address,
        current_pincode: prev.permanent_pincode,
        current_city: prev.permanent_city,
        current_district: prev.permanent_district,
        current_state: prev.permanent_state
      }));
    }
  }, [
    sameAsPermanent,
    formData.permanent_address,
    formData.permanent_pincode,
    formData.permanent_city,
    formData.permanent_district,
    formData.permanent_state
  ]);

  // PIN Code Lookup via India Post Office Government API
  const lookupPincode = async (pincode: string, type: 'permanent' | 'current') => {
    const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);

    if (type === 'permanent') {
      setFormData((p) => ({ ...p, permanent_pincode: cleanPin }));
      if (cleanPin.length !== 6) {
        setPermanentPostOffices([]);
        setPermanentPinMessage(null);
        return;
      }

      setIsLoadingPermanentPin(true);
      setPermanentPinMessage(null);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json[0]?.Status === 'Success' && Array.isArray(json[0]?.PostOffice) && json[0].PostOffice.length > 0) {
            const offices = json[0].PostOffice;
            const names = offices.map((po: any) => po.Name).filter(Boolean);
            const district = offices[0]?.District || '';
            const state = offices[0]?.State || '';
            setPermanentPostOffices(names);
            setFormData((p) => ({
              ...p,
              permanent_pincode: cleanPin,
              permanent_city: names[0] || p.permanent_city,
              permanent_district: district,
              permanent_state: state
            }));
            setPermanentPinMessage(`✓ India Post: ${district}, ${state} (${names.length} areas found)`);
          } else {
            setPermanentPinMessage('No Post Office registered under this PIN. Please enter city manually.');
          }
        }
      } catch {
        setPermanentPinMessage('Offline PIN mode. Please verify city & district.');
      } finally {
        setIsLoadingPermanentPin(false);
      }
    } else {
      setFormData((p) => ({ ...p, current_pincode: cleanPin }));
      if (cleanPin.length !== 6) {
        setCurrentPostOffices([]);
        setCurrentPinMessage(null);
        return;
      }

      setIsLoadingCurrentPin(true);
      setCurrentPinMessage(null);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json[0]?.Status === 'Success' && Array.isArray(json[0]?.PostOffice) && json[0].PostOffice.length > 0) {
            const offices = json[0].PostOffice;
            const names = offices.map((po: any) => po.Name).filter(Boolean);
            const district = offices[0]?.District || '';
            const state = offices[0]?.State || '';
            setCurrentPostOffices(names);
            setFormData((p) => ({
              ...p,
              current_pincode: cleanPin,
              current_city: names[0] || p.current_city,
              current_district: district,
              current_state: state
            }));
            setCurrentPinMessage(`✓ India Post: ${district}, ${state} (${names.length} areas found)`);
          } else {
            setCurrentPinMessage('No Post Office registered under this PIN. Please enter city manually.');
          }
        }
      } catch {
        setCurrentPinMessage('Offline PIN mode. Please verify city & district.');
      } finally {
        setIsLoadingCurrentPin(false);
      }
    }
  };

  const handleSameAddressToggle = (checked: boolean) => {
    setSameAsPermanent(checked);
    if (checked) {
      setFormData((p) => ({
        ...p,
        same_as_permanent_address: true,
        current_address: p.permanent_address,
        current_pincode: p.permanent_pincode,
        current_city: p.permanent_city,
        current_district: p.permanent_district,
        current_state: p.permanent_state
      }));
    } else {
      setFormData((p) => ({
        ...p,
        same_as_permanent_address: false
      }));
    }
  };

  // Multi-Nominee Handlers (Preserves all existing data upon adding new rows)
  const handleAddNominee = () => {
    const totalAllocated = nominees.reduce((sum, n) => sum + (parseFloat(n.share_percent) || 0), 0);
    const remaining = Math.max(0, 100 - totalAllocated);

    setNominees((prev) => [
      ...prev,
      {
        id: `nom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: '',
        relation: prev.length === 1 ? 'Son' : prev.length === 2 ? 'Daughter' : 'Father',
        dob: '',
        age: '',
        phone: '',
        share_percent: String(remaining > 0 ? remaining : 0),
        aadhaar_or_id: '',
        is_minor: false,
        guardian_name: '',
        guardian_relation: 'Mother',
        guardian_phone: ''
      }
    ]);
  };

  const handleRemoveNominee = (id: string) => {
    if (nominees.length <= 1) return;
    setNominees((prev) => prev.filter((n) => n.id !== id));
  };

  const handleUpdateNominee = (id: string, updates: Partial<NomineeItem>) => {
    setNominees((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const updated = { ...n, ...updates };

        // Automatically compute age & minor flag if DOB is provided
        if (updates.dob !== undefined && updates.dob) {
          const birthDate = new Date(updates.dob);
          if (!isNaN(birthDate.getTime())) {
            const ageDiffMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDiffMs);
            const computedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            updated.age = String(computedAge);
            updated.is_minor = computedAge < 18;
          }
        }
        return updated;
      })
    );
  };

  // Total Nominee Share Calculation
  const totalNomineeShare = nominees.reduce((sum, n) => sum + (parseFloat(n.share_percent) || 0), 0);

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
              bank_branch: 'Main Branch'
            }));
          } else {
            setIfscError('IFSC verified. Please confirm bank name.');
          }
        }
      } catch {
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

  // Comprehensive Multi-Tab Form Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    // 1. Personal & Contact Validations
    if (!formData.name?.trim()) errs.name = 'Employee full name is required.';
    if (!formData.code?.trim()) errs.code = 'Employee ID code is required.';
    if (!formData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Valid official work email is required (e.g. name@company.com).';
    }
    const cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Valid 10-digit primary mobile number is required.';
    }
    if (!formData.father_or_spouse_name?.trim()) {
      errs.father_or_spouse_name = "Father's or Spouse's full name is required.";
    }

    // Permanent Address Validations
    if (!formData.permanent_address?.trim()) {
      errs.permanent_address = 'Permanent address line (Door/Street/Area) is required.';
    }
    const cleanPin = (formData.permanent_pincode || '').replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errs.permanent_pincode = 'Valid 6-digit PIN code is required.';
    }
    if (!formData.permanent_city?.trim()) {
      errs.permanent_city = 'Permanent city / post office area is required.';
    }

    // Current Address Validations (if different)
    if (!sameAsPermanent) {
      if (!formData.current_address?.trim()) {
        errs.current_address = 'Current address line is required when not same as permanent.';
      }
      const curPin = (formData.current_pincode || '').replace(/\D/g, '');
      if (!curPin || curPin.length !== 6) {
        errs.current_pincode = 'Valid 6-digit current PIN code is required.';
      }
      if (!formData.current_city?.trim()) {
        errs.current_city = 'Current city / post office is required.';
      }
    }

    // 2. Job & Shift Validations
    if (!formData.department?.trim()) errs.department = 'Department selection is required.';
    if (!formData.designation?.trim()) errs.designation = 'Designation / Job title is required.';
    if (!formData.date?.trim()) errs.date = 'Date of joining is required.';

    // 3. Bank & Statutory Validations
    if (formData.bank_account && formData.confirm_bank_account && formData.bank_account !== formData.confirm_bank_account) {
      errs.confirm_bank_account = 'Bank account numbers do not match.';
    }
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.trim().toUpperCase())) {
      errs.pan = 'Invalid PAN format. Must be 10 characters (e.g. ABCDE1234F).';
    }
    if (formData.aadhaar) {
      const aadhDigits = formData.aadhaar.replace(/\D/g, '');
      if (aadhDigits.length !== 12) {
        errs.aadhaar = 'Aadhaar number must be exactly 12 digits.';
      }
    }

    // 4. Salary Validations
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errs.amount = 'Valid gross salary amount is required.';
    }

    // 5. Nominees Validations
    nominees.forEach((nom, index) => {
      if (!nom.name.trim()) {
        errs[`nominee_${index}_name`] = `Nominee #${index + 1} full name is required.`;
      }
      if (nom.is_minor && !nom.guardian_name.trim()) {
        errs[`nominee_${index}_guardian`] = `Guardian name is required for minor Nominee #${index + 1}.`;
      }
    });

    if (Math.round(totalNomineeShare) !== 100) {
      errs.nominee_share = `Total Nominee share percentage must equal exactly 100% (currently ${totalNomineeShare}%).`;
    }

    setFormErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Auto-navigate to tab containing the earliest error
      if (
        errs.name ||
        errs.code ||
        errs.email ||
        errs.phone ||
        errs.father_or_spouse_name ||
        errs.permanent_address ||
        errs.permanent_pincode ||
        errs.permanent_city ||
        errs.current_address ||
        errs.current_pincode ||
        errs.current_city
      ) {
        setActiveTab('personal');
      } else if (errs.department || errs.designation || errs.date) {
        setActiveTab('employment');
      } else if (errs.bank_account || errs.confirm_bank_account || errs.pan || errs.aadhaar) {
        setActiveTab('bank_statutory');
      } else if (errs.amount) {
        setActiveTab('salary');
      } else if (errs.nominee_share || Object.keys(errs).some((k) => k.startsWith('nominee_'))) {
        setActiveTab('nominee');
      }
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Package comprehensive payload including multi-nominees and synchronized addresses
    const finalData = {
      ...formData,
      same_as_permanent_address: sameAsPermanent,
      current_address: sameAsPermanent ? formData.permanent_address : formData.current_address,
      current_pincode: sameAsPermanent ? formData.permanent_pincode : formData.current_pincode,
      current_city: sameAsPermanent ? formData.permanent_city : formData.current_city,
      current_district: sameAsPermanent ? formData.permanent_district : formData.current_district,
      current_state: sameAsPermanent ? formData.permanent_state : formData.current_state,
      nominees: nominees,
      // Backwards compatibility fields for single-nominee schemas
      nominee_name: nominees[0]?.name || '',
      nominee_relation: nominees[0]?.relation || 'Spouse',
      nominee_dob: nominees[0]?.dob || '',
      nominee_age: nominees[0]?.age || '',
      nominee_phone: nominees[0]?.phone || '',
      nominee_share_percent: nominees[0]?.share_percent || '100'
    };

    onSave(finalData);
  };

  if (!isOpen) return null;

  // Check tab error state for visual warning badges
  const hasPersonalErrors = !!(
    formErrors.name ||
    formErrors.code ||
    formErrors.email ||
    formErrors.phone ||
    formErrors.father_or_spouse_name ||
    formErrors.permanent_address ||
    formErrors.permanent_pincode ||
    formErrors.permanent_city ||
    formErrors.current_address ||
    formErrors.current_pincode
  );
  const hasEmploymentErrors = !!(formErrors.department || formErrors.designation || formErrors.date);
  const hasStatutoryErrors = !!(formErrors.confirm_bank_account || formErrors.pan || formErrors.aadhaar);
  const hasSalaryErrors = !!formErrors.amount;
  const hasNomineeErrors = !!(formErrors.nominee_share || Object.keys(formErrors).some((k) => k.startsWith('nominee_')));

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
                Collect personal, address, statutory, banking, shift policy & multiple nominees in a single time.
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

        {/* Tab Navigation Strip with Error Indicators */}
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
            {hasPersonalErrors && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
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
            {hasEmploymentErrors && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
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
            <span>3. Bank & Statutory</span>
            {hasStatutoryErrors && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
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
            <span>4. Salary Breakdown</span>
            {hasSalaryErrors && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
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
            <span>5. Multiple Nominees ({nominees.length})</span>
            {hasNomineeErrors && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
          </button>
        </div>

        {/* Tab Body Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Validation Alert Banner if errors exist */}
          {Object.keys(formErrors).length > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Please complete all required fields before saving:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-rose-700 dark:text-rose-400">
                  {Object.values(formErrors).slice(0, 4).map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                  {Object.keys(formErrors).length > 4 && (
                    <li>...and {Object.keys(formErrors).length - 4} more field(s)</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 1: Personal, Contact & Smart Indian Address */}
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
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${formErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none`}
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
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${formErrors.code ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 font-mono font-medium outline-none focus:border-blue-500`}
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Father's or Spouse's Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.father_or_spouse_name || ''}
                    onChange={(e) => setFormData({ ...formData, father_or_spouse_name: e.target.value })}
                    placeholder="e.g. K. Chandrasekharan"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${formErrors.father_or_spouse_name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500`}
                  />
                  {formErrors.father_or_spouse_name && <p className="text-[11px] text-rose-500 mt-1">{formErrors.father_or_spouse_name}</p>}
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
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${formErrors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500`}
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
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${formErrors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500`}
                  />
                  {formErrors.phone && <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>}
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

              {/* USER-FRIENDLY RESIDENTIAL ADDRESS SECTION WITH INDIA POST AUTO-LOOKUP */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Residential Address Information
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Live postal verification via Indian Postal Service API
                  </span>
                </div>

                {/* 1. Permanent Address Card */}
                <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      Permanent Residential Address
                    </span>
                    {permanentPinMessage && (
                      <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {permanentPinMessage}
                      </span>
                    )}
                  </div>

                  {/* 1st: Address Line */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      1. Address Line (Door / Flat No, Street, Landmark) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.permanent_address || ''}
                      onChange={(e) => setFormData({ ...formData, permanent_address: e.target.value })}
                      placeholder="e.g. 63/4, Anna Nagar, Anthiyur"
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${formErrors.permanent_address ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900 outline-none focus:border-blue-500`}
                    />
                    {formErrors.permanent_address && <p className="text-[10px] text-rose-500 mt-1">{formErrors.permanent_address}</p>}
                  </div>

                  {/* 2nd: PIN Code with Post Office Gov API Lookup */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        2. PIN Code (6 Digits) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={6}
                          value={formData.permanent_pincode || ''}
                          onChange={(e) => lookupPincode(e.target.value, 'permanent')}
                          placeholder="e.g. 638501"
                          className={`w-full px-3 py-2 text-xs rounded-xl border ${formErrors.permanent_pincode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900 font-mono font-medium outline-none focus:border-blue-500 pr-8`}
                        />
                        {isLoadingPermanentPin && (
                          <div className="absolute right-2.5 top-2.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                          </div>
                        )}
                      </div>
                      {formErrors.permanent_pincode && <p className="text-[10px] text-rose-500 mt-1">{formErrors.permanent_pincode}</p>}
                    </div>

                    {/* 3rd: City / Post Office multi-select from API */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        3. City / Post Office Area <span className="text-rose-500">*</span>
                      </label>
                      {permanentPostOffices.length > 0 ? (
                        <div className="relative">
                          <select
                            value={formData.permanent_city || ''}
                            onChange={(e) => setFormData({ ...formData, permanent_city: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-blue-500 appearance-none pr-8 cursor-pointer font-medium"
                          >
                            {permanentPostOffices.map((po) => (
                              <option key={po} value={po}>
                                {po}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={formData.permanent_city || ''}
                          onChange={(e) => setFormData({ ...formData, permanent_city: e.target.value })}
                          placeholder="Enter City / Post Office"
                          className={`w-full px-3 py-2 text-xs rounded-xl border ${formErrors.permanent_city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900 outline-none focus:border-blue-500`}
                        />
                      )}
                      {formErrors.permanent_city && <p className="text-[10px] text-rose-500 mt-1">{formErrors.permanent_city}</p>}
                    </div>

                    {/* 4th: District & State */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        4. District & State
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={formData.permanent_district || ''}
                          onChange={(e) => setFormData({ ...formData, permanent_district: e.target.value })}
                          placeholder="District"
                          className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                        />
                        <input
                          type="text"
                          value={formData.permanent_state || ''}
                          onChange={(e) => setFormData({ ...formData, permanent_state: e.target.value })}
                          placeholder="State"
                          className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* USER-FRIENDLY SINGLE CHECKBOX: SAME AS PERMANENT ADDRESS */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sameAsPermanent}
                      onChange={(e) => handleSameAddressToggle(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Current address is same as permanent address
                    </span>
                  </label>
                  <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                    {sameAsPermanent ? '✓ Auto-synced (No retyping)' : 'Separate current address active'}
                  </span>
                </div>

                {/* 2. Separate Current Address Form (Only displayed if unchecked) */}
                {!sameAsPermanent && (
                  <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Current / Present Residential Address
                      </span>
                      {currentPinMessage && (
                        <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {currentPinMessage}
                        </span>
                      )}
                    </div>

                    {/* Step 1: Address Line */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        1. Current Address Line (Door / Flat No, Street, Landmark) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.current_address || ''}
                        onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                        placeholder="Current residential quarters or rented flat"
                        className={`w-full px-3 py-2 text-xs rounded-xl border ${formErrors.current_address ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900 outline-none focus:border-amber-500`}
                      />
                      {formErrors.current_address && <p className="text-[10px] text-rose-500 mt-1">{formErrors.current_address}</p>}
                    </div>

                    {/* Step 2: PIN Code & City Multi-Select */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          2. Current PIN Code (6 Digits) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={6}
                            value={formData.current_pincode || ''}
                            onChange={(e) => lookupPincode(e.target.value, 'current')}
                            placeholder="e.g. 641001"
                            className={`w-full px-3 py-2 text-xs rounded-xl border ${formErrors.current_pincode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900 font-mono font-medium outline-none focus:border-amber-500 pr-8`}
                          />
                          {isLoadingCurrentPin && (
                            <div className="absolute right-2.5 top-2.5">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                            </div>
                          )}
                        </div>
                        {formErrors.current_pincode && <p className="text-[10px] text-rose-500 mt-1">{formErrors.current_pincode}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          3. Current City / Post Office Area <span className="text-rose-500">*</span>
                        </label>
                        {currentPostOffices.length > 0 ? (
                          <div className="relative">
                            <select
                              value={formData.current_city || ''}
                              onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-amber-500 appearance-none pr-8 cursor-pointer font-medium"
                            >
                              {currentPostOffices.map((po) => (
                                <option key={po} value={po}>
                                  {po}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={formData.current_city || ''}
                            onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                            placeholder="Enter Current City"
                            className={`w-full px-3 py-2 text-xs rounded-xl border ${formErrors.current_city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900 outline-none focus:border-amber-500`}
                          />
                        )}
                        {formErrors.current_city && <p className="text-[10px] text-rose-500 mt-1">{formErrors.current_city}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          4. District & State
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={formData.current_district || ''}
                            onChange={(e) => setFormData({ ...formData, current_district: e.target.value })}
                            placeholder="District"
                            className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                          />
                          <input
                            type="text"
                            value={formData.current_state || ''}
                            onChange={(e) => setFormData({ ...formData, current_state: e.target.value })}
                            placeholder="State"
                            className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                  {formErrors.designation && <p className="text-[11px] text-rose-500 mt-1">{formErrors.designation}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Joining <span className="text-rose-500">*</span>
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    <option value="Permanent Full-Time">Permanent Full-Time</option>
                    <option value="Probationary Period">Probationary Period</option>
                    <option value="Fixed Term Contract">Fixed Term Contract</option>
                    <option value="Apprentice / Intern">Apprentice / Intern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch / Plant Location</label>
                  <input
                    type="text"
                    value={formData.branch || 'Main Plant / HQ'}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Shift Policy Configuration */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Biometric Shift & Punch Model
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                    {policy.punchMode === '4_PUNCH' ? '4-Punch Factory Shift' : '2-Punch Corporate Shift'}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-300">
                  {policy.punchMode === '4_PUNCH'
                    ? 'Employee punches 4 times: Start Shift, Lunch Out, Lunch In, End Shift. Break deducted precisely.'
                    : 'Employee punches twice: Shift In and Shift Out. 1-hour lunch break is automatically factored.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Bank & Statutory (PAN/Aadhaar/UAN) */}
          {activeTab === 'bank_statutory' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Bank Details Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  Bank Account Information (For Salary Direct Deposit)
                </h4>

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
                        placeholder="e.g. SBIN0000800"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-medium outline-none uppercase focus:border-blue-500"
                      />
                      {isValidatingIfsc && (
                        <div className="absolute right-2.5 top-2.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>
                    {ifscError && <p className="text-[10px] text-amber-500 mt-1">{ifscError}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bank_name || ''}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      placeholder="e.g. State Bank of India"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={formData.bank_branch || ''}
                      onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })}
                      placeholder="e.g. Commercial Branch, Erode"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="password"
                      value={formData.bank_account || ''}
                      onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                      placeholder="Enter account number"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.confirm_bank_account || ''}
                      onChange={(e) => setFormData({ ...formData, confirm_bank_account: e.target.value })}
                      placeholder="Re-enter to confirm"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none"
                    />
                    {formErrors.confirm_bank_account && (
                      <p className="text-[10px] text-rose-500 mt-1">{formErrors.confirm_bank_account}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Statutory Registrations Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  Statutory Registrations (Indian Labor Codes)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Income Tax PAN Number
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={formData.pan || ''}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      placeholder="ABCDE1234F"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none uppercase"
                    />
                    {formErrors.pan && <p className="text-[10px] text-rose-500 mt-1">{formErrors.pan}</p>}
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
                      placeholder="123456789012"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none"
                    />
                    {formErrors.aadhaar && <p className="text-[10px] text-rose-500 mt-1">{formErrors.aadhaar}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      EPFO Universal Account No (UAN)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={formData.pf_uan || ''}
                      onChange={(e) => setFormData({ ...formData, pf_uan: e.target.value })}
                      placeholder="100000000000"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ESIC Insurance Number
                    </label>
                    <input
                      type="text"
                      value={formData.esi_number || ''}
                      onChange={(e) => setFormData({ ...formData, esi_number: e.target.value })}
                      placeholder="31000000000000000"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Driving Licence (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.driving_licence || ''}
                      onChange={(e) => setFormData({ ...formData, driving_licence: e.target.value })}
                      placeholder="TN3620200001234"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none uppercase font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Salary & Auto-Breakdown */}
          {activeTab === 'salary' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 dark:border-emerald-500/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Dynamic Indian Payroll Auto-Calculator
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Enter monthly gross CTC. Wage Code 2026 splits (Basic, HRA, DA, PF, ESIC) compute instantly.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Monthly Gross CTC:</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.amount || ''}
                        onChange={(e) => computeSalaryBreakdown(e.target.value)}
                        className="w-36 pl-6 pr-3 py-1.5 text-xs font-extrabold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Net Take-Home Highlight Banner */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Estimated Net In-Hand Salary:
                  </span>
                  <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                    ₹{Number(formData.net_salary || 0).toLocaleString('en-IN')} / month
                  </span>
                </div>
              </div>

              {/* Earnings Grid */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Earnings Breakdown (Credit Components)
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

          {/* TAB 5: MULTIPLE NOMINEES & EMERGENCY CONTACTS */}
          {activeTab === 'nominee' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Header with Live Allocation Progress & Plus Button */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-purple-600" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Gratuity, PF & Statutory Nominee Declarations (Form F & 2)
                    </h4>
                  </div>
                  <p className="text-[11px] text-purple-800 dark:text-purple-300 mt-0.5">
                    Add multiple family nominees. Benefit share % must equal 100% across all nominees.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Share Balance Pill */}
                  <span
                    className={`px-3 py-1 rounded-full font-bold font-mono text-xs border ${
                      Math.round(totalNomineeShare) === 100
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {Math.round(totalNomineeShare) === 100
                      ? '✓ 100% Fully Allocated'
                      : `⚠ ${totalNomineeShare}% / 100% (${100 - totalNomineeShare}% remaining)`}
                  </span>

                  {/* Add Nominee Plus Button */}
                  <button
                    type="button"
                    onClick={handleAddNominee}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    title="Click to add another nominee without clearing existing data"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Nominee</span>
                  </button>
                </div>
              </div>

              {formErrors.nominee_share && (
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 p-2.5 rounded-xl border border-rose-200">
                  {formErrors.nominee_share}
                </p>
              )}

              {/* Dynamic Multiple Nominee Cards List */}
              <div className="space-y-4">
                {nominees.map((nom, index) => (
                  <div
                    key={nom.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
                          #{index + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {nom.name || `Nominee ${index + 1}`} ({nom.relation})
                        </span>
                        {nom.is_minor && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Minor (&lt; 18 Yrs)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                          {nom.share_percent}% Share
                        </span>
                        {nominees.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveNominee(nom.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Remove this nominee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Nominee Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={nom.name}
                          onChange={(e) => handleUpdateNominee(nom.id, { name: e.target.value })}
                          placeholder="e.g. S. Meena"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-purple-500 font-medium"
                        />
                        {formErrors[`nominee_${index}_name`] && (
                          <p className="text-[10px] text-rose-500 mt-1">{formErrors[`nominee_${index}_name`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Relationship <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={nom.relation}
                          onChange={(e) => handleUpdateNominee(nom.id, { relation: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-purple-500"
                        >
                          <option value="Spouse">Spouse</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Other">Other Family Member</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={nom.dob}
                          onChange={(e) => handleUpdateNominee(nom.id, { dob: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Age (Years)
                        </label>
                        <input
                          type="number"
                          value={nom.age}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleUpdateNominee(nom.id, { age: val, is_minor: Number(val) < 18 });
                          }}
                          placeholder="e.g. 28"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Benefit Share % <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={nom.share_percent}
                          onChange={(e) => handleUpdateNominee(nom.id, { share_percent: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Nominee Phone
                        </label>
                        <input
                          type="tel"
                          value={nom.phone}
                          onChange={(e) => handleUpdateNominee(nom.id, { phone: e.target.value })}
                          placeholder="9876543210"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nominee Aadhaar / Government ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={nom.aadhaar_or_id}
                        onChange={(e) => handleUpdateNominee(nom.id, { aadhaar_or_id: e.target.value })}
                        placeholder="12-digit Aadhaar or Voter ID"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none"
                      />
                    </div>

                    {/* Minor Guardian Section */}
                    {nom.is_minor && (
                      <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2 mt-2">
                        <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 block">
                          Legal Guardian Details (Mandatory for minor nominees under 18 years)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <input
                              type="text"
                              value={nom.guardian_name}
                              onChange={(e) => handleUpdateNominee(nom.id, { guardian_name: e.target.value })}
                              placeholder="Guardian Full Name"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-xs"
                            />
                            {formErrors[`nominee_${index}_guardian`] && (
                              <p className="text-[9px] text-rose-500 mt-0.5">{formErrors[`nominee_${index}_guardian`]}</p>
                            )}
                          </div>
                          <div>
                            <select
                              value={nom.guardian_relation}
                              onChange={(e) => handleUpdateNominee(nom.id, { guardian_relation: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-xs"
                            >
                              <option value="Mother">Mother</option>
                              <option value="Father">Father</option>
                              <option value="Grandmother">Grandmother</option>
                              <option value="Grandfather">Grandfather</option>
                              <option value="Court Appointed Guardian">Court Appointed Guardian</option>
                            </select>
                          </div>
                          <div>
                            <input
                              type="tel"
                              value={nom.guardian_phone}
                              onChange={(e) => handleUpdateNominee(nom.id, { guardian_phone: e.target.value })}
                              placeholder="Guardian Mobile Phone"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Primary Emergency Contact Person
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
              <span className="font-semibold text-blue-600">Tip:</span> All details, multiple nominees and verified address records are saved in a single transaction.
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
