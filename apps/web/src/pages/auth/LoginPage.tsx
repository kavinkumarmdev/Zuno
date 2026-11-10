import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../stores/auth-store';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = (): boolean => {
    const errors: { usernameOrEmail?: string; password?: string } = {};

    const trimmedUser = usernameOrEmail.trim();
    if (!trimmedUser) {
      errors.usernameOrEmail = 'Username or corporate email is required.';
    } else if (trimmedUser.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedUser)) {
      errors.usernameOrEmail = 'Please enter a valid corporate email (e.g. user@company.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await login({ usernameOrEmail: usernameOrEmail.trim(), password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials or account locked. Please check and try again.');
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-700 bg-blue-50/90 border border-blue-200/80 shadow-sm mb-4 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Next-Gen Enterprise Cloud ERP</span>
        </div>

        {/* Official Brand Logo */}
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-md shadow-blue-500/5 transition-transform hover:scale-105 duration-300">
            <img src="/logo/logo.png" alt="Zuno ERP" className="w-12 h-12 object-contain" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Sign In to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Zuno ERP</span>
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Secure multi-tenant workspace with 19 integrated business management modules.
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
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
            {/* Username or Corporate Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username or Corporate Email <span className="text-blue-600">*</span>
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => {
                    setUsernameOrEmail(e.target.value);
                    if (fieldErrors.usernameOrEmail) {
                      setFieldErrors((prev) => ({ ...prev, usernameOrEmail: undefined }));
                    }
                  }}
                  onBlur={() => {
                    const trimmed = usernameOrEmail.trim();
                    if (!trimmed) {
                      setFieldErrors((prev) => ({ ...prev, usernameOrEmail: 'Username or corporate email is required.' }));
                    } else if (trimmed.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                      setFieldErrors((prev) => ({ ...prev, usernameOrEmail: 'Invalid corporate email format.' }));
                    }
                  }}
                  placeholder="e.g. admin@acme.com or username"
                  className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all duration-200 shadow-sm ${
                    fieldErrors.usernameOrEmail
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                      : 'border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                  }`}
                />
              </div>
              {fieldErrors.usernameOrEmail && (
                <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.usernameOrEmail}</span>
                </p>
              )}
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Account Password <span className="text-blue-600">*</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Please contact your tenant organization administrator to reset your password.');
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  onBlur={() => {
                    if (!password) {
                      setFieldErrors((prev) => ({ ...prev, password: 'Password is required.' }));
                    } else if (password.length < 6) {
                      setFieldErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters.' }));
                    }
                  }}
                  placeholder="Enter your master password"
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
                <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Session */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer accent-blue-600"
                />
                <span className="font-medium text-[11px] sm:text-xs">Remember this device</span>
              </label>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                SSL Protected
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Credentials Pill */}
            <div className="mt-3.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="text-[11px] font-semibold text-slate-700">
                  Default User: <span className="text-blue-700 font-mono">Kavin</span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Password: Kavin@987</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsernameOrEmail('Kavin');
                  setPassword('Kavin@987');
                  setFieldErrors({});
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-blue-600 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an enterprise account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline ml-1 inline-flex items-center gap-0.5"
              >
                <span>Register new organization</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Tenant Isolation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>GST & Audit Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>99.99% Cloud SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
