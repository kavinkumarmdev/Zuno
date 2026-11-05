import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Landmark,
  PiggyBank,
  FileCheck,
  Package,
  ShoppingCart,
  Factory,
  TrendingUp,
  Boxes,
  Users,
  Clock,
  BadgePercent,
  Scale,
  Wallet,
  Wrench,
  ShieldCheck,
  BarChart3,
  UserCheck,
  CreditCard,
  Search,
  Sparkles,
  ExternalLink,
  Layers,
  Database,
  ArrowRight,
  Shield,
  Zap,
  Cloud,
  CheckCircle2,
  Eye
} from 'lucide-react';

export interface ModuleCardData {
  number: number;
  id: string;
  name: string;
  category: 'Foundation' | 'Master' | 'Operations' | 'Finance' | 'Intelligence';
  phase: string;
  icon: any;
  submodules: string[];
  tablesCount: number;
  primaryTable: string;
  path: string;
  colorScheme: {
    border: string;
    bgHover: string;
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconColor: string;
  };
}

export const OFFICIAL_19_MODULES: ModuleCardData[] = [
  {
    number: 1,
    id: 'company',
    name: 'Company Setup & Registration',
    category: 'Foundation',
    phase: 'Core Setup & Admin',
    icon: Building2,
    submodules: ['Company Profile', 'Branches', 'Business Details', 'Settings'],
    tablesCount: 6,
    primaryTable: 'tb_company',
    path: '/modules/company',
    colorScheme: {
      border: 'border-blue-500/30 hover:border-blue-500',
      bgHover: 'hover:bg-blue-500/5',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
      badgeText: 'text-blue-700 dark:text-blue-400',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  },
  {
    number: 2,
    id: 'land-building',
    name: 'Land, Building & Construction',
    category: 'Master',
    phase: 'Master Records',
    icon: Landmark,
    submodules: ['Land Records', 'Construction', 'Project Tracking', 'Assets'],
    tablesCount: 5,
    primaryTable: 'tb_property_master',
    path: '/modules/land-building',
    colorScheme: {
      border: 'border-emerald-500/30 hover:border-emerald-500',
      bgHover: 'hover:bg-emerald-500/5',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
      badgeText: 'text-emerald-700 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  },
  {
    number: 3,
    id: 'investment',
    name: 'Investment & Finance',
    category: 'Finance',
    phase: 'Finance & Compliance',
    icon: PiggyBank,
    submodules: ['Investments', 'Loans', 'Capital Management'],
    tablesCount: 4,
    primaryTable: 'tb_financial_investment',
    path: '/modules/investment',
    colorScheme: {
      border: 'border-amber-500/30 hover:border-amber-500',
      bgHover: 'hover:bg-amber-500/5',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
      badgeText: 'text-amber-700 dark:text-amber-400',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  },
  {
    number: 4,
    id: 'compliance',
    name: 'Licences & Compliance',
    category: 'Finance',
    phase: 'Finance & Compliance',
    icon: FileCheck,
    submodules: ['Licences', 'Renewals', 'Regulatory Compliance'],
    tablesCount: 4,
    primaryTable: 'tb_compliance_master',
    path: '/modules/compliance',
    colorScheme: {
      border: 'border-teal-500/30 hover:border-teal-500',
      bgHover: 'hover:bg-teal-500/5',
      badgeBg: 'bg-teal-100 dark:bg-teal-950/60',
      badgeText: 'text-teal-700 dark:text-teal-400',
      iconBg: 'bg-teal-500/10',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
  },
  {
    number: 5,
    id: 'products',
    name: 'Product & Material',
    category: 'Master',
    phase: 'Master Records',
    icon: Package,
    submodules: ['Products', 'Materials', 'BOM', 'Specifications'],
    tablesCount: 6,
    primaryTable: 'tb_product_master',
    path: '/modules/products',
    colorScheme: {
      border: 'border-orange-500/30 hover:border-orange-500',
      bgHover: 'hover:bg-orange-500/5',
      badgeBg: 'bg-orange-100 dark:bg-orange-950/60',
      badgeText: 'text-orange-700 dark:text-orange-400',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  },
  {
    number: 6,
    id: 'purchase',
    name: 'Purchase & Supplier',
    category: 'Operations',
    phase: 'Business Operations',
    icon: ShoppingCart,
    submodules: ['Suppliers', 'Purchase Orders', 'Procurement'],
    tablesCount: 6,
    primaryTable: 'tb_purchase_order',
    path: '/modules/purchase',
    colorScheme: {
      border: 'border-cyan-500/30 hover:border-cyan-500',
      bgHover: 'hover:bg-cyan-500/5',
      badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60',
      badgeText: 'text-cyan-700 dark:text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
  },
  {
    number: 7,
    id: 'production',
    name: 'Production & Manufacturing',
    category: 'Operations',
    phase: 'Business Operations',
    icon: Factory,
    submodules: ['Production Plans', 'Work Orders', 'Quality Control'],
    tablesCount: 5,
    primaryTable: 'tb_work_order',
    path: '/modules/production',
    colorScheme: {
      border: 'border-sky-500/30 hover:border-sky-500',
      bgHover: 'hover:bg-sky-500/5',
      badgeBg: 'bg-sky-100 dark:bg-sky-950/60',
      badgeText: 'text-sky-700 dark:text-sky-400',
      iconBg: 'bg-sky-500/10',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
  },
  {
    number: 8,
    id: 'sales',
    name: 'Sales & Customer',
    category: 'Operations',
    phase: 'Business Operations',
    icon: TrendingUp,
    submodules: ['Customers', 'Sales Orders', 'Invoicing'],
    tablesCount: 6,
    primaryTable: 'tb_sales_order',
    path: '/modules/sales',
    colorScheme: {
      border: 'border-rose-500/30 hover:border-rose-500',
      bgHover: 'hover:bg-rose-500/5',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
      badgeText: 'text-rose-700 dark:text-rose-400',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  },
  {
    number: 9,
    id: 'inventory',
    name: 'Inventory & Warehouse',
    category: 'Operations',
    phase: 'Business Operations',
    icon: Boxes,
    submodules: ['Stock', 'Warehouses', 'Stock Movement'],
    tablesCount: 6,
    primaryTable: 'tb_stock_balance',
    path: '/modules/inventory',
    colorScheme: {
      border: 'border-emerald-500/30 hover:border-emerald-500',
      bgHover: 'hover:bg-emerald-500/5',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
      badgeText: 'text-emerald-700 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  },
  {
    number: 10,
    id: 'hr',
    name: 'HR & Employee',
    category: 'Master',
    phase: 'Master Records',
    icon: Users,
    submodules: ['Employees', 'Recruitment', 'Organization Structure'],
    tablesCount: 5,
    primaryTable: 'tb_employee_master',
    path: '/modules/hr',
    colorScheme: {
      border: 'border-violet-500/30 hover:border-violet-500',
      bgHover: 'hover:bg-violet-500/5',
      badgeBg: 'bg-violet-100 dark:bg-violet-950/60',
      badgeText: 'text-violet-700 dark:text-violet-400',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
  },
  {
    number: 11,
    id: 'attendance',
    name: 'Attendance, Leave & Requests',
    category: 'Operations',
    phase: 'Business Operations',
    icon: Clock,
    submodules: ['Attendance', 'Leave', 'Gate Pass', 'Requests'],
    tablesCount: 5,
    primaryTable: 'tb_attendance',
    path: '/modules/attendance',
    colorScheme: {
      border: 'border-teal-500/30 hover:border-teal-500',
      bgHover: 'hover:bg-teal-500/5',
      badgeBg: 'bg-teal-100 dark:bg-teal-950/60',
      badgeText: 'text-teal-700 dark:text-teal-400',
      iconBg: 'bg-teal-500/10',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
  },
  {
    number: 12,
    id: 'payroll',
    name: 'Payroll & Benefits',
    category: 'Finance',
    phase: 'Finance & Compliance',
    icon: BadgePercent,
    submodules: ['Salary', 'Deductions', 'Benefits', 'Payslips'],
    tablesCount: 5,
    primaryTable: 'tb_payroll_run',
    path: '/modules/payroll',
    colorScheme: {
      border: 'border-lime-500/30 hover:border-lime-500',
      bgHover: 'hover:bg-lime-500/5',
      badgeBg: 'bg-lime-100 dark:bg-lime-950/60',
      badgeText: 'text-lime-700 dark:text-lime-400',
      iconBg: 'bg-lime-500/10',
      iconColor: 'text-lime-600 dark:text-lime-400',
    },
  },
  {
    number: 13,
    id: 'statutory',
    name: 'Government Integration',
    category: 'Finance',
    phase: 'Finance & Compliance',
    icon: Scale,
    submodules: ['GST', 'PF', 'ESI', 'Statutory Forms'],
    tablesCount: 4,
    primaryTable: 'tb_statutory_submission',
    path: '/modules/statutory',
    colorScheme: {
      border: 'border-amber-500/30 hover:border-amber-500',
      bgHover: 'hover:bg-amber-500/5',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
      badgeText: 'text-amber-700 dark:text-amber-400',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  },
  {
    number: 14,
    id: 'banking',
    name: 'Banking & Accounting',
    category: 'Finance',
    phase: 'Finance & Compliance',
    icon: Wallet,
    submodules: ['Bank Reconciliation', 'Accounts', 'Reports'],
    tablesCount: 5,
    primaryTable: 'tb_accounting_voucher',
    path: '/modules/banking',
    colorScheme: {
      border: 'border-blue-600/30 hover:border-blue-600',
      bgHover: 'hover:bg-blue-600/5',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
      badgeText: 'text-blue-700 dark:text-blue-400',
      iconBg: 'bg-blue-600/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  },
  {
    number: 15,
    id: 'assets',
    name: 'Assets & Maintenance',
    category: 'Master',
    phase: 'Master Records',
    icon: Wrench,
    submodules: ['Asset Tracking', 'Maintenance Schedules', 'Depreciation'],
    tablesCount: 4,
    primaryTable: 'tb_asset_master',
    path: '/modules/assets',
    colorScheme: {
      border: 'border-slate-500/30 hover:border-slate-500',
      bgHover: 'hover:bg-slate-500/5',
      badgeBg: 'bg-slate-100 dark:bg-slate-800',
      badgeText: 'text-slate-700 dark:text-slate-300',
      iconBg: 'bg-slate-500/10',
      iconColor: 'text-slate-600 dark:text-slate-400',
    },
  },
  {
    number: 16,
    id: 'admin',
    name: 'Administration & RBAC',
    category: 'Foundation',
    phase: 'Core Setup & Admin',
    icon: ShieldCheck,
    submodules: ['User Accounts', 'Role Matrix', 'Permissions', 'Audit Logs'],
    tablesCount: 5,
    primaryTable: 'tb_user',
    path: '/modules/admin',
    colorScheme: {
      border: 'border-purple-500/30 hover:border-purple-500',
      bgHover: 'hover:bg-purple-500/5',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
      badgeText: 'text-purple-700 dark:text-purple-400',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  },
  {
    number: 17,
    id: 'reports',
    name: 'Reports & MIS',
    category: 'Intelligence',
    phase: 'Analytics & Archive',
    icon: BarChart3,
    submodules: ['Business Reports', 'Dashboards', 'Analytics'],
    tablesCount: 4,
    primaryTable: 'reports',
    path: '/modules/reports',
    colorScheme: {
      border: 'border-cyan-500/30 hover:border-cyan-500',
      bgHover: 'hover:bg-cyan-500/5',
      badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60',
      badgeText: 'text-cyan-700 dark:text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
  },
  {
    number: 18,
    id: 'portal',
    name: 'Employee & Manager Portal',
    category: 'Operations',
    phase: 'Business Operations',
    icon: UserCheck,
    submodules: ['Self-Service', 'Approvals', 'Performance'],
    tablesCount: 6,
    primaryTable: 'tb_employee_request',
    path: '/modules/portal',
    colorScheme: {
      border: 'border-orange-500/30 hover:border-orange-500',
      bgHover: 'hover:bg-orange-500/5',
      badgeBg: 'bg-orange-100 dark:bg-orange-950/60',
      badgeText: 'text-orange-700 dark:text-orange-400',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  },
  {
    number: 19,
    id: 'subscriptions',
    name: 'SaaS Platform & Subscription',
    category: 'Foundation',
    phase: 'Core Setup & Admin',
    icon: CreditCard,
    submodules: ['Subscription', 'Billing', 'Multi-Tenant Access'],
    tablesCount: 8,
    primaryTable: 'tb_subscription',
    path: '/modules/subscriptions',
    colorScheme: {
      border: 'border-emerald-500/30 hover:border-emerald-500',
      bgHover: 'hover:bg-emerald-500/5',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
      badgeText: 'text-emerald-700 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  },
];

export const ModulesOverviewPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showPosterModal, setShowPosterModal] = useState(false);

  const filteredModules = useMemo(() => {
    return OFFICIAL_19_MODULES.filter((mod) => {
      const matchesSearch =
        mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.primaryTable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.submodules.some((sub) => sub.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'ALL' || mod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const categories = [
    { id: 'ALL', label: 'All 19 Modules' },
    { id: 'Foundation', label: 'SaaS Foundation' },
    { id: 'Master', label: 'Master Data' },
    { id: 'Operations', label: 'Operations' },
    { id: 'Finance', label: 'Finance & Compliance' },
    { id: 'Intelligence', label: 'Intelligence' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Official Branding */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-8 md:p-10 shadow-2xl border border-slate-700/60 mt-1">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zuno ERP — Architecture Matrix</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Run Your Entire Business in One Powerful Platform
            </h1>

            <p className="text-slate-300 text-base leading-relaxed">
              One Platform. Infinite Possibilities. 19 fully integrated enterprise modules backed by
              the approved 243-table cloud operational ledger and immutable cold archive architecture.
            </p>

            {/* 4 Architectural Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-200 font-medium">Grow Faster</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">Stay Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs">
                <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200 font-medium">Operate Efficient</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs">
                <Cloud className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-200 font-medium">Scale on Cloud</span>
              </div>
            </div>
          </div>

          {/* Quick Action & Poster Preview Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setShowPosterModal(true)}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg backdrop-blur-sm"
            >
              <Eye className="w-4 h-4 text-cyan-300" />
              <span>View Architecture Poster</span>
            </button>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-center">
              <span className="text-2xl font-black text-white">243</span>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Approved Tables</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search module, submodule, or table..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 19 Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((mod) => {
          const IconComponent = mod.icon;
          return (
            <div
              key={mod.id}
              className={`group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border ${mod.colorScheme.border} p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${mod.colorScheme.bgHover}`}
            >
              {/* Header: Module Number & Category */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg font-black text-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm">
                      {mod.number}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${mod.colorScheme.badgeBg} ${mod.colorScheme.badgeText}`}>
                      {mod.category}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl ${mod.colorScheme.iconBg} ${mod.colorScheme.iconColor} group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                {/* Module Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {mod.name}
                </h3>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {mod.phase}
                </p>

                {/* Submodules Tags */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Smart Submodules</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.submodules.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-medium border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer: Database Metadata & Launch Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-mono">
                  <Database className="w-3.5 h-3.5 text-blue-500" />
                  <span className="truncate max-w-[130px] font-medium">{mod.primaryTable}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
                    +{mod.tablesCount} tables
                  </span>
                </div>

                <Link
                  to={mod.path}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Open Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slogan Footer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 border border-slate-800 text-center">
        <p className="text-sm font-semibold text-blue-400">
          Zuno — Smart Business. Stronger Tomorrow.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Complete Enterprise SaaS ERP — Engineered with Multi-Tenant Architecture, High-Speed Operational Cloud Ledger, and Immutable Audit Vault.
        </p>
      </div>

      {/* Architecture Poster High-Res Modal */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Zuno Complete Business ERP Platform — 19 Modules</h3>
              </div>
              <button
                onClick={() => setShowPosterModal(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex justify-center max-h-[80vh] overflow-auto">
              <img
                src="/assets/zuno-19-modules-architecture.jpg"
                alt="Zuno 19 Modules Architecture Diagram"
                className="rounded-2xl max-h-[75vh] object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

