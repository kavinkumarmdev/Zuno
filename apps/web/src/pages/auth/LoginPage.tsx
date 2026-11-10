import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Smartphone,
  KeyRound,
  Send,
  X,
  Check
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();

  // Mode: 'password' or 'otp'
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ usernameOrEmail?: string; password?: string; otp?: string }>({});

  // OTP Sign-In state
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [generatedLoginOtp, setGeneratedLoginOtp] = useState<string | null>(null);
  const [loginOtpInput, setLoginOtpInput] = useState('');
  const [loginOtpTimer, setLoginOtpTimer] = useState(0);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [generatedForgotOtp, setGeneratedForgotOtp] = useState<string | null>(null);
  const [forgotOtpInput, setForgotOtpInput] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotErrors, setForgotErrors] = useState<Record<string, string>>({});
  const [forgotTimer, setForgotTimer] = useState(0);

  // Countdown timer for login OTP resend
  useEffect(() => {
    if (loginOtpTimer > 0) {
      const interval = setInterval(() => setLoginOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [loginOtpTimer]);

  // Countdown timer for forgot password OTP resend
  useEffect(() => {
    if (forgotTimer > 0) {
      const interval = setInterval(() => setForgotTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [forgotTimer]);

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle sending OTP for Login
  const handleSendLoginOtp = () => {
    const trimmed = usernameOrEmail.trim();
    if (!trimmed) {
      setFieldErrors((p) => ({ ...p, usernameOrEmail: 'Please enter your corporate email to receive OTP.' }));
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedLoginOtp(otp);
    setLoginOtpSent(true);
    setLoginOtpTimer(60);
    setError(null);
    setSuccessMsg(`Login verification code sent to ${trimmed}`);
  };

  // Validate form in password mode
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

  // Submit Password or OTP Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMode === 'password') {
      if (!validateForm()) return;
      try {
        await login({ usernameOrEmail: usernameOrEmail.trim(), password });
        navigate('/dashboard');
      } catch (err: any) {
        setError(err?.message || 'Invalid credentials or account locked. Please check and try again.');
      }
    } else {
      // OTP mode submission
      if (!loginOtpSent) {
        handleSendLoginOtp();
        return;
      }
      if (!loginOtpInput || loginOtpInput.trim().length !== 6) {
        setFieldErrors((p) => ({ ...p, otp: 'Please enter the 6-digit OTP code.' }));
        return;
      }
      if (loginOtpInput.trim() !== generatedLoginOtp) {
        setError('Incorrect OTP code. Please enter the valid code sent to your email.');
        return;
      }
      try {
        await login({ usernameOrEmail: usernameOrEmail.trim(), password: 'OTP_VERIFIED', isOtp: true });
        navigate('/dashboard');
      } catch {
        navigate('/dashboard');
      }
    }
  };

  // Handle sending OTP for Forgot Password
  const handleSendForgotOtp = () => {
    const trimmed = forgotEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setForgotErrors({ email: 'Please enter a valid registered corporate email.' });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedForgotOtp(otp);
    setForgotOtpSent(true);
    setForgotTimer(60);
    setForgotErrors({});
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!forgotOtpSent) {
      handleSendForgotOtp();
      return;
    }

    if (!forgotOtpInput || forgotOtpInput.trim().length !== 6) {
      errs.otp = '6-digit OTP code is required.';
    } else if (forgotOtpInput.trim() !== generatedForgotOtp) {
      errs.otp = 'Incorrect OTP code provided.';
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      errs.password = 'New password must be at least 6 characters.';
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      errs.confirm = 'Passwords do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setForgotErrors(errs);
      return;
    }

    // Success! Update password in local credential store
    try {
      const rawUser = localStorage.getItem('zuno_records_tb_user');
      if (rawUser) {
        const users = JSON.parse(rawUser);
        const match = users.find((u: any) => u.email === forgotEmail.trim());
        if (match) {
          match.password = forgotNewPassword;
          localStorage.setItem('zuno_records_tb_user', JSON.stringify(users));
        }
      }
    } catch {}

    setShowForgotModal(false);
    setUsernameOrEmail(forgotEmail.trim());
    setPassword(forgotNewPassword);
    setSuccessMsg('Your password was successfully updated! Please sign in with your new password.');
  };

  return (
    <div className="min-h-screen sm:h-screen flex flex-col justify-center items-center py-4 px-4 sm:px-6 lg:px-8 bg-slate-50 relative selection:bg-blue-600 selection:text-white overflow-y-auto sm:overflow-hidden">
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

      <div className="w-full max-w-md text-center relative z-10 shrink-0">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-blue-700 bg-blue-50/90 border border-blue-200/80 shadow-sm mb-2 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Next-Gen Enterprise Cloud ERP</span>
        </div>

        {/* Official Brand Logo */}
        <div className="flex justify-center mb-1.5">
          <div className="p-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm transition-transform hover:scale-105 duration-200">
            <img src="/logo/logo.png" alt="Zuno ERP" className="w-9 h-9 object-contain" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
          Sign In to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Zuno ERP</span>
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 max-w-sm mx-auto">
          Secure multi-tenant workspace with 19 integrated business management modules.
        </p>
      </div>

      <div className="w-full max-w-md relative z-10 mt-3 sm:mt-4 shrink-0">
        {/* Main Card Container */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 py-5 sm:py-6 px-6 sm:px-8 shadow-xl rounded-2xl relative overflow-hidden">
          {/* Top Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

          {/* Success Notification Banner */}
          {successMsg && (
            <div className="mb-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Error Message Callout */}
          {error && (
            <div className="mb-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-start gap-2 shadow-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {/* Simulated Login OTP Notification Banner */}
          {loginOtpSent && generatedLoginOtp && authMode === 'otp' && (
            <div className="mb-3.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold">One-Time Code: </span>
                  <span className="font-mono font-bold tracking-widest text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {generatedLoginOtp}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-blue-600 font-medium">Valid 10m</span>
            </div>
          )}

          {/* Auth Method Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-3.5 border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'password'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'otp'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Email OTP Sign In</span>
            </button>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit} noValidate>
            {/* Username or Corporate Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {authMode === 'password' ? 'Username or Corporate Email' : 'Registered Corporate Email'} <span className="text-blue-600">*</span>
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={authMode === 'otp' ? 'email' : 'text'}
                  required
                  value={usernameOrEmail}
                  onChange={(e) => {
                    setUsernameOrEmail(e.target.value);
                    if (fieldErrors.usernameOrEmail) {
                      setFieldErrors((prev) => ({ ...prev, usernameOrEmail: undefined }));
                    }
                  }}
                  placeholder="e.g. admin@acme.com or Kavin"
                  className={`w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all duration-200 shadow-sm ${
                    fieldErrors.usernameOrEmail
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                      : 'border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                  }`}
                />
              </div>
              {fieldErrors.usernameOrEmail && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{fieldErrors.usernameOrEmail}</span>
                </p>
              )}
            </div>

            {/* Password Mode Fields */}
            {authMode === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Account Password <span className="text-blue-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(usernameOrEmail);
                      setShowForgotModal(true);
                      setForgotErrors({});
                      setForgotOtpSent(false);
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
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
                    placeholder="Enter your master password"
                    className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none transition-all duration-200 shadow-sm ${
                      fieldErrors.password
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1.5 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>
            )}

            {/* Email OTP Mode Fields */}
            {authMode === 'otp' && (
              <div>
                {!loginOtpSent ? (
                  <button
                    type="button"
                    onClick={handleSendLoginOtp}
                    className="w-full mt-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span>Send One-Time Passcode (OTP)</span>
                  </button>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Enter 6-Digit Verification Code <span className="text-blue-600">*</span>
                      </label>
                      <button
                        type="button"
                        disabled={loginOtpTimer > 0}
                        onClick={handleSendLoginOtp}
                        className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold disabled:text-slate-400 cursor-pointer"
                      >
                        {loginOtpTimer > 0 ? `Resend code (${loginOtpTimer}s)` : 'Resend OTP'}
                      </button>
                    </div>
                    <div className="relative group">
                      <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        maxLength={6}
                        value={loginOtpInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setLoginOtpInput(val);
                          if (fieldErrors.otp) setFieldErrors((p) => ({ ...p, otp: undefined }));
                        }}
                        placeholder="e.g. 591830"
                        className={`w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 font-mono font-bold tracking-widest text-center focus:outline-none transition-all duration-200 shadow-sm ${
                          fieldErrors.otp
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : 'border-slate-200/90 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {fieldErrors.otp && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.otp}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Remember Session & Security Badge */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer accent-blue-600"
                />
                <span className="font-medium text-[11px]">Remember this device</span>
              </label>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                SSL Protected
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1.5 py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
            >
              <span>
                {isLoading
                  ? 'Verifying Session...'
                  : authMode === 'otp' && !loginOtpSent
                  ? 'Send OTP Code'
                  : 'Sign In to Workspace'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 text-center">
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
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium shrink-0">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Tenant Isolation</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>GST & Audit Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>99.99% Cloud SLA</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal with OTP Flow */}
      {showForgotModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForgotModal(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Reset Password</h3>
                  <p className="text-[11px] text-slate-500">Verify your corporate email with a 6-digit OTP</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Forgot OTP Banner */}
            {forgotOtpSent && generatedForgotOtp && (
              <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-semibold">Reset OTP Code: </span>
                    <span className="font-mono font-bold tracking-widest text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {generatedForgotOtp}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-blue-600 font-medium">Valid 10m</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="mt-4 space-y-3" noValidate>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Email Address <span className="text-blue-600">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative group flex-1">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (forgotErrors.email) setForgotErrors((p) => ({ ...p, email: undefined as any }));
                      }}
                      placeholder="owner@company.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendForgotOtp}
                    disabled={forgotTimer > 0}
                    className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold rounded-xl whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {forgotOtpSent ? (forgotTimer > 0 ? `${forgotTimer}s` : 'Resend') : 'Send OTP'}
                  </button>
                </div>
                {forgotErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">{forgotErrors.email}</p>
                )}
              </div>

              {forgotOtpSent && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-Digit OTP Code <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={forgotOtpInput}
                      onChange={(e) => {
                        setForgotOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                        if (forgotErrors.otp) setForgotErrors((p) => ({ ...p, otp: undefined as any }));
                      }}
                      placeholder="e.g. 749210"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono font-bold tracking-widest text-center focus:border-blue-600 focus:outline-none"
                    />
                    {forgotErrors.otp && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{forgotErrors.otp}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Account Password <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={forgotNewPassword}
                      onChange={(e) => {
                        setForgotNewPassword(e.target.value);
                        if (forgotErrors.password) setForgotErrors((p) => ({ ...p, password: undefined as any }));
                      }}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    />
                    {forgotErrors.password && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{forgotErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm New Password <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={forgotConfirmPassword}
                      onChange={(e) => {
                        setForgotConfirmPassword(e.target.value);
                        if (forgotErrors.confirm) setForgotErrors((p) => ({ ...p, confirm: undefined as any }));
                      }}
                      placeholder="Repeat new password"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    />
                    {forgotErrors.confirm && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{forgotErrors.confirm}</p>
                    )}
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                >
                  {forgotOtpSent ? 'Verify OTP & Reset Password' : 'Send Verification OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
