import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Building,
  CreditCard,
  UserCog,
  Package,
  Users,
  Handshake,
  Landmark,
  Wrench,
  ShoppingCart,
  Boxes,
  Receipt,
  CalendarCheck,
  Factory,
  Banknote,
  FileCheck2,
  Scale,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Database,
  History,
  Layers,
  Laptop,
  Volume2,
  X
} from 'lucide-react';
import { VoiceGuidedAssistant } from '../guidance/VoiceGuidedAssistant';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ERP_MODULES = [
  { id: 'dashboard', name: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'modules-hub', name: '19 Modules Architecture', path: '/modules', icon: Layers },
  {
    phase: 'Core Setup & Admin',
    items: [
      { id: 'company', name: 'Company Management', path: '/modules/company', icon: Building2, count: 10, table: 'tb_company' },
      { id: 'subscriptions', name: 'SaaS & Subscriptions', path: '/modules/subscriptions', icon: CreditCard, count: 24, table: 'tb_subscription' },
      { id: 'admin', name: 'Administration & RBAC', path: '/modules/admin', icon: UserCog, count: 14, table: 'tb_user' }
    ]
  },
  {
    phase: 'Master Records',
    items: [
      { id: 'products', name: 'Product & Material', path: '/modules/products', icon: Package, count: 12, table: 'tb_product_master' },
      { id: 'hr', name: 'HR & Employees', path: '/modules/hr', icon: Users, count: 16, table: 'tb_employee_master' },
      { id: 'crm', name: 'Customer & Supplier', path: '/modules/crm', icon: Handshake, count: 8, table: 'tb_customer_master' },
      { id: 'land-building', name: 'Land & Building', path: '/modules/land-building', icon: Building, count: 12, table: 'tb_property_master' },
      { id: 'assets', name: 'Assets & Maintenance', path: '/modules/assets', icon: Wrench, count: 8, table: 'tb_asset_master' }
    ]
  },
  {
    phase: 'Business Operations',
    items: [
      { id: 'purchase', name: 'Purchase Management', path: '/modules/purchase', icon: ShoppingCart, count: 12, table: 'tb_purchase_order' },
      { id: 'inventory', name: 'Inventory & Warehouse', path: '/modules/inventory', icon: Boxes, count: 14, table: 'tb_stock_balance' },
      { id: 'sales', name: 'Sales Management', path: '/modules/sales', icon: Receipt, count: 12, table: 'tb_sales_order' },
      { id: 'attendance', name: 'Attendance & Leave', path: '/modules/attendance', icon: CalendarCheck, count: 15, table: 'tb_attendance' },
      { id: 'production', name: 'Manufacturing & BOM', path: '/modules/production', icon: Factory, count: 16, table: 'tb_work_order' },
      { id: 'portal', name: 'Employee & Manager Portal', path: '/modules/portal', icon: Laptop, count: 6, table: 'tb_employee_request' }
    ]
  },
  {
    phase: 'Finance & Compliance',
    items: [
      { id: 'banking', name: 'Banking & Accounts', path: '/modules/banking', icon: Landmark, count: 18, table: 'tb_accounting_voucher' },
      { id: 'payroll', name: 'Payroll & Benefits', path: '/modules/payroll', icon: Banknote, count: 16, table: 'tb_payroll_run' },
      { id: 'compliance', name: 'Licence & Compliance', path: '/modules/compliance', icon: FileCheck2, count: 12, table: 'tb_compliance_master' },
      { id: 'statutory', name: 'Government & Statutory', path: '/modules/statutory', icon: Scale, count: 14, table: 'tb_statutory_submission' },
      { id: 'investment', name: 'Investment & Finance', path: '/modules/investment', icon: TrendingUp, count: 10, table: 'tb_financial_budget' }
    ]
  },
  {
    phase: 'Analytics & Archive',
    items: [
      { id: 'reports', name: 'Report Studio & MIS', path: '/modules/reports', icon: BarChart3, count: 1, table: 'reports' },
      { id: 'history', name: 'Audit & Historical Archive', path: '/history', icon: History, count: 1, table: 'tb_historical_records' }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const [collapsedPhases, setCollapsedPhases] = useState<Record<string, boolean>>({});
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);

  const togglePhase = (phase: string) => {
    setCollapsedPhases((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`${
          isOpen ? 'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw]' : 'hidden'
        } lg:flex lg:w-64 bg-slate-950/95 backdrop-blur-2xl text-slate-300 flex-col flex-shrink-0 h-screen border-r border-slate-800/80 select-none shadow-2xl lg:shadow-none transition-all relative overflow-hidden`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent pointer-events-none" />

        {/* Futuristic Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative p-1 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-glow-sm">
              <img
                src="/logo/logo.png"
                alt="Zuno ERP"
                className="w-8 h-8 object-contain rounded-lg bg-slate-900 p-0.5"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">ZUNO</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 font-mono tracking-wider">
                  ERP 2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Next-Gen Cloud OS
              </span>
            </div>
          </div>

          {/* Close button for mobile / tablet drawer */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 relative z-10">
          {/* Top-Level Navigation Links */}
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/20 text-white border border-blue-500/40 shadow-glow-sm'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Executive Dashboard</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70" />
            </NavLink>

            <NavLink
              to="/modules"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>19-Module Matrix</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">19</span>
            </NavLink>

            {/* Voice Module Guide Audio Tour Trigger */}
            <button
              onClick={() => {
                if (onClose) onClose();
                setShowVoiceGuide(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/60 transition-all cursor-pointer shadow-glow-sm group"
              title="Listen to interactive voice narration of all modules"
            >
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse group-hover:scale-110 transition-transform" />
                <span>Voice Module Guide</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 uppercase tracking-wider font-mono">
                AUDIO
              </span>
            </button>
          </div>

          {/* Phase Groups */}
          {ERP_MODULES.filter((group: any) => group.phase && Array.isArray(group.items)).map((group: any) => {
            const isCollapsed = collapsedPhases[group.phase];
            return (
              <div key={group.phase} className="space-y-1">
                <button
                  onClick={() => togglePhase(group.phase)}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    {group.phase}
                  </span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5 pl-1">
                    {group.items?.map((item: any) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                              isActive
                                ? 'bg-blue-600/25 text-blue-300 border border-blue-500/30 font-semibold shadow-2xs'
                                : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                            }`
                          }
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className="w-3.5 h-3.5 group-hover:text-cyan-400 transition-colors shrink-0" />
                            <span className="truncate">{item.name}</span>
                          </div>
                          {item.count && (
                            <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400 shrink-0">
                              {item.count}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Futuristic Mission Control Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-[10px] tracking-wider text-slate-400">POSTGRES CLUSTER</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold">LIVE 99.99%</span>
        </div>
      </aside>

      {/* Voice-Guided Assistant Audio Walkthrough Modal */}
      <VoiceGuidedAssistant isOpen={showVoiceGuide} onClose={() => setShowVoiceGuide(false)} />
    </>
  );
};

