import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../stores/auth-store';
import { Lock, Mail, Building, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin@acme.com');
  const [password, setPassword] = useState('ZunoEnterprise2026!#');
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ usernameOrEmail, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials or tenant locked');
    }
  };

  const handleDemoFill = () => {
    setUsernameOrEmail('admin@acme.com');
    setPassword('ZunoEnterprise2026!#');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
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
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username or Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500" />
                <span>Remember session</span>
              </label>
              <a href="#forgot" className="text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-1.5 px-3 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700/60"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Autofill Demo Credentials (Admin)</span>
            </button>
          </div>

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

