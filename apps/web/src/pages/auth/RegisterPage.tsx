import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../stores/auth-store';
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Layers
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    tenantName: '',
    ownerName: '',
    email: '',
    mobile: '',
    password: '',
    companyName: '',
    currencyCode: 'INR',
    countryCode: 'IN'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    tenantName?: string;
    companyName?: string;
    ownerName?: string;
    mobile?: string;
    email?: string;
    password?: string;
  }>({});

  // Password rule checks
  const passHasMinLen = formData.password.length >= 8;
  const passHasUpper = /[A-Z]/.test(formData.password);
  const passHasNumber = /[0-9]/.test(formData.password);
  const passHasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);

  const validateAll = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!formData.tenantName.trim()) {
      errors.tenantName = 'Organization / Tenant name is required (min 2 chars).';
    } else if (formData.tenantName.trim().length < 2) {
      errors.tenantName = 'Organization name must be at least 2 characters.';
    }

    if (!formData.companyName.trim()) {
      errors.companyName = 'Primary legal company entity name is required.';
    } else if (formData.companyName.trim().length < 2) {
      errors.companyName = 'Company name must be at least 2 characters.';
    } else {
      try {
        const rawComp = localStorage.getItem('zuno_records_tb_company');
        const comps = rawComp ? JSON.parse(rawComp) : [];
        if (comps.some((c: any) => c.name?.toLowerCase() === formData.companyName.trim().toLowerCase())) {
          errors.companyName = `Unique Company Violation: "${formData.companyName.trim()}" is already registered.`;
        }
      } catch {}
    }

    if (!formData.ownerName.trim()) {
      errors.ownerName = 'Owner / Managing Director name is required.';
    } else if (formData.ownerName.trim().length < 2) {
      errors.ownerName = 'Owner name must be at least 2 characters.';
    }

    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile phone number is required.';
    } else if (formData.mobile.trim().length !== 10) {
      errors.mobile = 'Mobile phone number must be exactly 10 digits.';
    } else if (!/^[6-9][0-9]{9}$/.test(formData.mobile.trim())) {
      errors.mobile = 'Mobile phone number must start with 6, 7, 8, or 9 (standard Indian format).';
    } else {
      try {
        const rawUsers = localStorage.getItem('zuno_records_tb_user');
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        if (users.some((u: any) => u.mobile?.replace(/\D/g, '') === formData.mobile.trim())) {
          errors.mobile = `Unique Phone Violation: Mobile "${formData.mobile.trim()}" is already registered.`;
        }
      } catch {}
    }

    if (!formData.email.trim()) {
      errors.email = 'Corporate email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid corporate email format (e.g. name@company.com).';
    } else {
      try {
        const rawUsers = localStorage.getItem('zuno_records_tb_user');
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        if (users.some((u: any) => u.email?.toLowerCase() === formData.email.trim().toLowerCase())) {
          errors.email = `Unique Email Violation: Email "${formData.email.trim()}" is already registered.`;
        }
      } catch {}
    }

    if (!formData.password) {
      errors.password = 'Master password is required.';
    } else if (!passHasMinLen || !passHasUpper || !passHasNumber || !passHasSpecial) {
      errors.password = 'Password must meet all 4 security criteria below.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateAll()) {
      return;
    }

    try {
      await register({
        ...formData,
        tenantName: formData.tenantName.trim(),
        companyName: formData.companyName.trim(),
        ownerName: formData.ownerName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to complete registration. Please check and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Premium Ambient Background Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/70 via-indigo-50/40 to-slate-50 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Mesh */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center relative z-10">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-700 bg-blue-50/90 border border-blue-200/80 shadow-sm mb-3 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Instant 30-Day Free Trial • 19 Enterprise Modules</span>
        </div>

        {/* Official Brand Logo */}
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-md shadow-blue-500/5 transition-transform hover:scale-105 duration-300">
            <img src="/logo/logo.png" alt="Zuno ERP" className="w-12 h-12 object-contain" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">Enterprise Tenant</span>
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Start your multi-tenant workspace with isolated PostgreSQL schemas, role-based controls, and automated compliance.
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        {/* Main Card Container */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 py-8 px-6 sm:px-10 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] rounded-3xl relative overflow-hidden">
          {/* Top Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

          {/* Error Message Callout */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-start gap-2.5 shadow-sm animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{error}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Row 1: Tenant & Primary Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tenant / Organization Name <span className="text-blue-600">*</span>
                </label>
                <div className="relative group">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.tenantName}
                    onChange={(e) => {
                      setFormData({ ...formData, tenantName: e.target.value });
                      if (fieldErrors.tenantName) setFieldErrors((p) => ({ ...p, tenantName: undefined }));
                    }}
                    placeholder="e.g. Apex Industrial Holdings"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all duration-200 shadow-sm ${
                      fieldErrors.tenantName
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                    }`}
                  />
                </div>
                {fieldErrors.tenantName && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.tenantName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Company Legal Entity <span className="text-blue-600">*</span>
                </label>
                <div className="relative group">
                  <Layers className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => {
                      setFormData({ ...formData, companyName: e.target.value });
                      if (fieldErrors.companyName) setFieldErrors((p) => ({ ...p, companyName: undefined }));
                    }}
                    placeholder="e.g. Apex Technologies Pvt Ltd"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all duration-200 shadow-sm ${
                      fieldErrors.companyName
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                    }`}
                  />
                </div>
                {fieldErrors.companyName && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.companyName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Owner Name & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Managing Director / Owner Name <span className="text-blue-600">*</span>
                </label>
                <div className="relative group">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => {
                      // Only allow alphabetic characters and spaces
                      const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setFormData({ ...formData, ownerName: lettersOnly });
                      if (fieldErrors.ownerName) setFieldErrors((p) => ({ ...p, ownerName: undefined }));
                    }}
                    placeholder="e.g. Ramesh Kumar"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all duration-200 shadow-sm ${
                      fieldErrors.ownerName
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                    }`}
                  />
                </div>
                {fieldErrors.ownerName && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.ownerName}</span>
                  </p>
                )}
              </div>

              {/* Strict 10-Digit Phone Number */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Business Mobile Number <span className="text-blue-600">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                      formData.mobile.length === 10
                        ? 'text-emerald-700 font-bold bg-emerald-50 border-emerald-200'
                        : formData.mobile.length > 0
                        ? 'text-blue-700 font-semibold bg-blue-50 border-blue-200'
                        : 'text-slate-400 bg-slate-100 border-slate-200'
                    }`}
                  >
                    {formData.mobile.length}/10 digits
                  </span>
                </div>
                <div
                  className={`flex items-center rounded-xl border bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white transition-all duration-200 shadow-xs overflow-hidden ${
                    fieldErrors.mobile
                      ? 'border-rose-400 bg-rose-50/30 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10'
                      : 'border-slate-200/90 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100/80 border-r border-slate-200/80 text-slate-600 select-none shrink-0">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-semibold font-mono text-slate-700">+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    value={formData.mobile}
                    onChange={(e) => {
                      // Strictly digits only: strip out any letter, space, or special symbol
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, mobile: digitsOnly });
                      if (fieldErrors.mobile) setFieldErrors((p) => ({ ...p, mobile: undefined }));
                    }}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 text-xs bg-transparent text-slate-900 placeholder:text-slate-400 font-mono font-medium focus:outline-none tracking-wider"
                  />
                </div>
                {fieldErrors.mobile && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.mobile}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Corporate Email & Master Password with Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Corporate Email Address <span className="text-blue-600">*</span>
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="owner@company.com"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all duration-200 shadow-sm ${
                      fieldErrors.email
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Master Account Password <span className="text-blue-600">*</span>
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                    className={`w-full pl-10 pr-11 py-2.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all duration-200 shadow-sm ${
                      fieldErrors.password
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Password Security Criteria Checklist in Light Mode */}
            {formData.password.length > 0 && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-[11px] grid grid-cols-2 gap-2 animate-in fade-in duration-200 shadow-inner">
                <div
                  className={`flex items-center gap-1.5 p-1.5 rounded-lg transition-colors ${
                    passHasMinLen
                      ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-700 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {passHasMinLen ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>8+ characters</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 p-1.5 rounded-lg transition-colors ${
                    passHasUpper
                      ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-700 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {passHasUpper ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>1 uppercase letter</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 p-1.5 rounded-lg transition-colors ${
                    passHasNumber
                      ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-700 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {passHasNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>1 number (0-9)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 p-1.5 rounded-lg transition-colors ${
                    passHasSpecial
                      ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-700 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {passHasSpecial ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>1 special symbol (!@#$)</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
            >
              <span>{isLoading ? 'Creating Tenant Workspace...' : 'Activate Free 30-Day Trial'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an enterprise account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline ml-1 inline-flex items-center gap-0.5"
              >
                <span>Sign in</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dedicated PostgreSQL Schema</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Instant Provisioning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>No Credit Card Required</span>
          </div>
        </div>
      </div>
    </div>
  );
};
