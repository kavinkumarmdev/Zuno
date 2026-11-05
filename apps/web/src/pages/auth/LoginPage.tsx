import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../stores/auth-store';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

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
      errors.usernameOrEmail = 'Please enter a valid email format (e.g. user@company.com).';
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Official Brand Logo */}
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-4">
          <img src="/logo/logo.png" alt="Zuno ERP" className="w-12 h-12 object-contain" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to Zuno ERP</h2>
        <p className="mt-1 text-xs text-slate-400">
          Enterprise Cloud SaaS • Multi-Tenant Business Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Username or Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Username or Corporate Email *
                </label>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
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
                      setFieldErrors((prev) => ({ ...prev, usernameOrEmail: 'Invalid email address format.' }));
                    }
                  }}
                  placeholder="e.g. admin@acme.com or username"
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                    fieldErrors.usernameOrEmail
                      ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
              {fieldErrors.usernameOrEmail && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{fieldErrors.usernameOrEmail}</span>
                </p>
              )}
            </div>

            {/* Password with Eye Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Password *
                </label>
                <a href="#forgot" className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
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
                  placeholder="Enter your account password"
                  className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                    fieldErrors.password
                      ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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

            <div className="flex items-center text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Need an enterprise account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Register new organization
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
