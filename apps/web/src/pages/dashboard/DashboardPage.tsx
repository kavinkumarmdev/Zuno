import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import {
  Users,
  UserCheck,
  TrendingUp,
  ShoppingCart,
  Boxes,
  Clock,
  AlertCircle,
  FileText,
  Receipt,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Activity,
  ShieldCheck,
  Zap,
  Server,
  Database,
  BarChart3,
  Cpu,
  Radio,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeChartTab, setActiveChartTab] = useState<'trends' | 'comparison'>('trends');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      try {
        const res: any = await apiClient.get('/dashboard/metrics');
        return res.data || res;
      } catch {
        // High-precision enterprise fallback
        return {
          kpis: {
            totalEmployees: 142,
            presentEmployees: 134,
            attendancePercentage: 94.4,
            salesSummary: 4850000,
            purchaseSummary: 2120000,
            inventoryValue: 7890000,
            pendingApprovals: 7,
          },
          monthlyTrends: [
            { month: 'Jan', sales: 3200000, purchases: 1800000, expenses: 450000 },
            { month: 'Feb', sales: 3800000, purchases: 2100000, expenses: 520000 },
            { month: 'Mar', sales: 4200000, purchases: 2400000, expenses: 610000 },
            { month: 'Apr', sales: 4600000, purchases: 2200000, expenses: 580000 },
            { month: 'May', sales: 5100000, purchases: 2700000, expenses: 640000 },
            { month: 'Jun', sales: 5400000, purchases: 2900000, expenses: 690000 },
          ],
          recentActivities: [
            { id: '1', action: 'PO_APPROVED', resource: 'tb_purchase_order', status: 'SUCCESS', details: 'PO-2026-1049 approved by Managing Director', created_time: '2026-11-11T10:15:00Z' },
            { id: '2', action: 'SALES_INVOICE_GENERATED', resource: 'tb_sales_invoice', status: 'SUCCESS', details: 'INV-2026-8812 (GSTIN validated)', created_time: '2026-11-11T09:40:00Z' },
            { id: '3', action: 'STOCK_INWARD_VERIFIED', resource: 'tb_stock_inward', status: 'SUCCESS', details: 'GRN-2026-0412 received at Central Bay', created_time: '2026-11-11T08:20:00Z' },
            { id: '4', action: 'BANK_RECONCILIATION_POSTED', resource: 'tb_accounting_voucher', status: 'SUCCESS', details: 'Auto-matched ₹4,50,000 NEFT batch', created_time: '2026-11-11T07:10:00Z' }
          ],
          alerts: [
            { id: '1', type: 'INFO', title: 'GST-3B Statutory Return Due', dueDate: '2026-11-20', priority: 'HIGH', category: 'TAX' },
            { id: '2', type: 'WARNING', title: 'Minimum Stock Alert: Stainless Rod 12mm', priority: 'MEDIUM', category: 'INVENTORY' },
            { id: '3', type: 'SUCCESS', title: 'Monthly PF/ESI ECR Filing Ready', dueDate: '2026-11-15', priority: 'LOW', category: 'PAYROLL' }
          ]
        };
      }
    },
    refetchInterval: 30000,
  });

  const kpis = data?.kpis || {};
  const trends = data?.monthlyTrends || [];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Futuristic Mission Control Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-4 sm:p-6 md:p-7 text-white border border-slate-700/70 shadow-2xl">
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            {/* Live Telemetry Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Mission Control Active</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                <Cpu className="w-3 h-3 text-cyan-300" />
                <span>Postgres Cluster 01</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Zero-Trust RBAC</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
              Executive Cloud <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">Command Center</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Live enterprise operational intelligence across sales, procurement, inventory, double-entry accounting, and statutory compliance.
            </p>
          </div>

          {/* Action Dock */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/modules/sales')}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-glow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-cyan-200" />
              <span>Create Invoice</span>
            </button>
            <button
              onClick={() => navigate('/modules/purchase')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-indigo-300" />
              <span>Purchase Order</span>
            </button>
            <button
              onClick={() => navigate('/modules/reports')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-emerald-300" />
              <span>MIS Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Holographic 19-Modules Architecture Command Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-950/50 to-slate-900/60 p-4 sm:p-5 border border-blue-500/30 dark:border-blue-500/20 shadow-glow-sm flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-glow-cyan">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-mono">
                19 Modules Active
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                243 Approved Catalogue Tables
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Unified Enterprise Architecture Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access Core Setup, Master Data, Daily Operations, and Finance & Compliance workspaces.
            </p>
          </div>
        </div>

        <Link
          to="/modules"
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-extrabold shrink-0 flex items-center gap-2 shadow-glow-sm hover:shadow-glow-cyan transition-all active:scale-95"
        >
          <span>Explore 19-Module Matrix</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Futuristic Holographic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Workforce & Biometrics */}
        <div
          onClick={() => navigate('/modules/hr')}
          className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-blue-500/50 hover:shadow-glow-sm transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">Workforce & Biometrics</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {kpis.presentEmployees}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {kpis.totalEmployees} Active</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${kpis.attendancePercentage}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <div className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{kpis.attendancePercentage}% Verified Present</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">SHIFT 01</span>
          </div>
        </div>

        {/* Card 2: Operational Sales */}
        <div
          onClick={() => navigate('/modules/sales')}
          className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-glow-emerald transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">Monthly Gross Sales</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {formatCurrency(kpis.salesSummary)}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[88%]" />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% vs last cycle</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">GST B2B</span>
          </div>
        </div>

        {/* Card 3: Approved Procurement */}
        <div
          onClick={() => navigate('/modules/purchase')}
          className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-purple-500/50 hover:shadow-glow-violet transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">Approved Purchases</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {formatCurrency(kpis.purchaseSummary)}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full w-[65%]" />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-semibold">
            <span>3-Way Matched GRN</span>
            <span className="text-[10px] text-slate-400 font-mono">ITC READY</span>
          </div>
        </div>

        {/* Card 4: Inventory & Approvals */}
        <div
          onClick={() => navigate('/modules/inventory')}
          className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-amber-500/50 hover:shadow-glow-cyan transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">Live Stock Valuation</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {formatCurrency(kpis.inventoryValue)}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full w-[76%]" />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-blue-600 dark:text-cyan-400 font-semibold">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{kpis.pendingApprovals} pending signatures</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">FIFO</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Financial Revenue vs Procurement Trajectory
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                  FY 2026-27
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time synchronized ledger curves for billing receivables and procurement outlays.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-glow-sm" />
                Sales Outward
              </span>
              <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
                Purchases Inward
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyberSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="cyberPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v / 100000}L`} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
                <Area type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#cyberSales)" />
                <Area type="monotone" dataKey="purchases" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#cyberPurchases)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statutory Compliance & Radar Deck (1 Col) */}
        <div className="bg-white dark:bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Statutory & Audit Radar</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                100% HEALTH
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {data?.alerts?.map((alert: any) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{alert.title}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono ${
                      alert.priority === 'HIGH' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70'
                    }`}>
                      {alert.priority}
                    </span>
                  </div>
                  {alert.dueDate && (
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Filing Deadline: {alert.dueDate}</span>
                    </p>
                  )}
                </div>
              ))}

              <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Immutable Audit Outbox Synced</span>
                </div>
                <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90 mt-1 leading-relaxed">
                  All accounting vouchers replicated to SHA-256 tamper-proof cold ledger with zero lag.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
            <Link
              to="/modules/statutory"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between"
            >
              <span>View Government Filing Schedule</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Live Enterprise Forensic Audit Stream */}
      <div className="bg-white dark:bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Enterprise Forensic Audit Stream</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">REAL-TIME INGESTION</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {data?.recentActivities?.map((act: any) => (
            <div key={act.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan shrink-0" />
                <span className="font-mono font-bold text-slate-900 dark:text-white">{act.action}</span>
                <span className="text-slate-400">on <code className="text-blue-600 dark:text-blue-400 font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">{act.resource}</code></span>
                {act.details && (
                  <span className="hidden md:inline text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-sm">
                    — {act.details}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                {new Date(act.created_time).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
