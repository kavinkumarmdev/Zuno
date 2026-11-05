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
  X
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
    }

    if (!formData.ownerName.trim()) {
      errors.ownerName = 'Owner / Managing Director name is required.';
    } else if (formData.ownerName.trim().length < 2) {
      errors.ownerName = 'Owner name must be at least 2 characters.';
    }

    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile phone number is required.';
    } else if (formData.mobile.trim().length !== 10) {
      errors.mobile = 'Mobile phone number must be exactly 10 digits (no letters or symbols).';
    }

    if (!formData.email.trim()) {
      errors.email = 'Corporate email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid corporate email format (e.g. name@company.com).';
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center z-10 px-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-3">
          <img src="/logo/logo.png" alt="Zuno ERP" className="w-10 h-10 object-contain" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Register Organization on Zuno ERP</h2>
        <p className="mt-1 text-xs text-slate-400">
          Instant 30-day trial with all 19 approved ERP modules unlocked and isolated multi-tenant data boundaries.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Row 1: Tenant & Primary Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tenant / Organization Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={formData.tenantName}
                    onChange={(e) => {
                      setFormData({ ...formData, tenantName: e.target.value });
                      if (fieldErrors.tenantName) setFieldErrors((p) => ({ ...p, tenantName: undefined }));
                    }}
                    placeholder="e.g. Apex Industrial Group"
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                      fieldErrors.tenantName
                        ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/40'
                        : 'border-slate-800 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {fieldErrors.tenantName && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.tenantName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Company Entity *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => {
                    setFormData({ ...formData, companyName: e.target.value });
                    if (fieldErrors.companyName) setFieldErrors((p) => ({ ...p, companyName: undefined }));
                  }}
                  placeholder="e.g. Apex Industries Pvt Ltd"
                  className={`w-full px-3 py-2 text-xs bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                    fieldErrors.companyName
                      ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.companyName && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.companyName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Owner Name & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Managing Director / Owner Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
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
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                      fieldErrors.ownerName
                        ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/40'
                        : 'border-slate-800 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {fieldErrors.ownerName && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.ownerName}</span>
                  </p>
                )}
              </div>

              {/* Strict 10-Digit Phone Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Business Mobile Number *
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      formData.mobile.length === 10
                        ? 'text-emerald-400 font-bold'
                        : formData.mobile.length > 0
                        ? 'text-cyan-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {formData.mobile.length}/10 digits
                  </span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <div className="absolute left-9 top-2 text-xs text-slate-400 font-mono select-none border-r border-slate-800 pr-1.5">
                    +91
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
                    className={`w-full pl-20 pr-3 py-2 text-xs bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 font-mono focus:outline-none transition-all tracking-wider ${
                      fieldErrors.mobile
                        ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/40'
                        : 'border-slate-800 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {fieldErrors.mobile && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.mobile}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Corporate Email & Master Password with Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Corporate Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="owner@company.com"
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                      fieldErrors.email
                        ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/40'
                        : 'border-slate-800 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Master Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                    className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                      fieldErrors.password
                        ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/40'
                        : 'border-slate-800 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Password Security Criteria Checklist */}
            {formData.password.length > 0 && (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] grid grid-cols-2 gap-1.5 animate-in fade-in duration-200">
                <div className={`flex items-center gap-1.5 ${passHasMinLen ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {passHasMinLen ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passHasUpper ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {passHasUpper ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span>1 uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passHasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {passHasNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span>1 number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passHasSpecial ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {passHasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span>1 special symbol (!@#$)</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{isLoading ? 'Creating Tenant Boundary...' : 'Activate Free 30-Day Trial'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
