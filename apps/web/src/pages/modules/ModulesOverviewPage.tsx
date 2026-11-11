import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Building,
  Landmark,
  TrendingUp,
  FileCheck2,
  Package,
  ShoppingCart,
  Factory,
  Receipt,
  Boxes,
  Users,
  CalendarCheck,
  Banknote,
  Scale,
  Wrench,
  UserCog,
  BarChart3,
  Laptop,
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
  Eye,
  Volume2
} from 'lucide-react';
import { VoiceGuidedAssistant } from '../../components/guidance/VoiceGuidedAssistant';

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
    icon: Building,
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
    icon: TrendingUp,
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
    icon: FileCheck2,
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
    icon: Receipt,
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
    icon: CalendarCheck,
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
    icon: Banknote,
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
    icon: Landmark,
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
    icon: UserCog,
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
    icon: Laptop,
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
  const [voiceGuideModule, setVoiceGuideModule] = useState<string | null>(null);

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

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              One Platform. Infinite Possibilities. 19 fully integrated enterprise modules designed
              for modern workforce management, multi-company accounting, supply chain, and compliance.
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
              onClick={() => setVoiceGuideModule('company')}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/40 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>🎙️ Voice Guided Tour</span>
            </button>
            <button
              onClick={() => setShowPosterModal(true)}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg backdrop-blur-sm"
            >
              <Eye className="w-4 h-4 text-cyan-300" />
              <span>View Architecture Matrix</span>
            </button>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-center">
              <span className="text-2xl font-black text-cyan-400">19</span>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Enterprise Modules</p>
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
              className={`group relative flex flex-col justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border ${mod.colorScheme.border} p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${mod.colorScheme.bgHover} overflow-hidden`}
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

              {/* Header: Module Number, Category & Icon */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-xl font-black text-xs bg-slate-900 text-white dark:bg-slate-800 dark:text-cyan-300 shadow-sm border border-slate-700/60 font-mono">
                      {mod.number < 10 ? `0${mod.number}` : mod.number}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase ${mod.colorScheme.badgeBg} ${mod.colorScheme.badgeText}`}>
                      {mod.category}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-2xl ${mod.colorScheme.iconBg} ${mod.colorScheme.iconColor} group-hover:scale-110 shadow-sm transition-transform duration-300`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                {/* Module Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                  {mod.name}
                </h3>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {mod.phase}
                </p>

                {/* Submodules Tags */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Submodules</p>
                    <span className="text-[10px] font-mono text-slate-400">{mod.tablesCount} Tables</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.submodules.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-medium border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer: Launch Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Enterprise Live</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setVoiceGuideModule(mod.id);
                    }}
                    className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800 transition-colors cursor-pointer shadow-2xs"
                    title={`Listen to Voice Guide for ${mod.name}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    to={mod.path}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 hover:text-white text-xs font-bold text-blue-600 dark:text-blue-300 group-hover:translate-x-0.5 transition-all shadow-2xs"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
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

      {/* Voice-Guided Assistant & Module Deep Dive Navigator */}
      <VoiceGuidedAssistant
        isOpen={!!voiceGuideModule}
        initialModuleId={voiceGuideModule || undefined}
        onClose={() => setVoiceGuideModule(null)}
      />
    </div>
  );
};

