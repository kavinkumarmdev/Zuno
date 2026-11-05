import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  ShieldCheck,
  Package,
  Users,
  Briefcase,
  Landmark,
  Wrench,
  ShoppingCart,
  Boxes,
  TrendingUp,
  Clock,
  Factory,
  Wallet,
  BadgePercent,
  FileCheck,
  Scale,
  PiggyBank,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Database,
  History,
  Sparkles,
  UserCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ERP_MODULES = [
  { id: 'dashboard', name: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'modules-hub', name: '19 Modules Architecture', path: '/modules', icon: Sparkles },
  {
    phase: 'Core Setup & Admin',
    items: [
      { id: 'company', name: 'Company Management', path: '/modules/company', icon: Building2, count: 10, table: 'tb_company' },
      { id: 'subscriptions', name: 'SaaS & Subscriptions', path: '/modules/subscriptions', icon: CreditCard, count: 24, table: 'tb_subscription' },
      { id: 'admin', name: 'Administration & RBAC', path: '/modules/admin', icon: ShieldCheck, count: 14, table: 'tb_user' }
    ]
  },
  {
    phase: 'Master Records',
    items: [
      { id: 'products', name: 'Product & Material', path: '/modules/products', icon: Package, count: 12, table: 'tb_product_master' },
      { id: 'hr', name: 'HR & Employees', path: '/modules/hr', icon: Users, count: 16, table: 'tb_employee_master' },
      { id: 'crm', name: 'Customer & Supplier', path: '/modules/crm', icon: Briefcase, count: 8, table: 'tb_customer_master' },
      { id: 'land-building', name: 'Land & Building', path: '/modules/land-building', icon: Landmark, count: 12, table: 'tb_property_master' },
      { id: 'assets', name: 'Assets & Maintenance', path: '/modules/assets', icon: Wrench, count: 8, table: 'tb_asset_master' }
    ]
  },
  {
    phase: 'Business Operations',
    items: [
      { id: 'purchase', name: 'Purchase Management', path: '/modules/purchase', icon: ShoppingCart, count: 12, table: 'tb_purchase_order' },
      { id: 'inventory', name: 'Inventory & Warehouse', path: '/modules/inventory', icon: Boxes, count: 14, table: 'tb_stock_balance' },
      { id: 'sales', name: 'Sales Management', path: '/modules/sales', icon: TrendingUp, count: 12, table: 'tb_sales_order' },
      { id: 'attendance', name: 'Attendance & Leave', path: '/modules/attendance', icon: Clock, count: 15, table: 'tb_attendance' },
      { id: 'production', name: 'Manufacturing & BOM', path: '/modules/production', icon: Factory, count: 16, table: 'tb_work_order' },
      { id: 'portal', name: 'Employee & Manager Portal', path: '/modules/portal', icon: UserCheck, count: 6, table: 'tb_employee_request' }
    ]
  },
  {
    phase: 'Finance & Compliance',
    items: [
      { id: 'banking', name: 'Banking & Accounts', path: '/modules/banking', icon: Wallet, count: 18, table: 'tb_accounting_voucher' },
      { id: 'payroll', name: 'Payroll & Benefits', path: '/modules/payroll', icon: BadgePercent, count: 16, table: 'tb_payroll_run' },
      { id: 'compliance', name: 'Licence & Compliance', path: '/modules/compliance', icon: FileCheck, count: 12, table: 'tb_compliance_master' },
      { id: 'statutory', name: 'Government & Statutory', path: '/modules/statutory', icon: Scale, count: 14, table: 'tb_statutory_submission' },
      { id: 'investment', name: 'Investment & Finance', path: '/modules/investment', icon: PiggyBank, count: 10, table: 'tb_financial_budget' }
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
          isOpen ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden'
        } lg:flex w-64 bg-slate-900 text-slate-300 flex-col flex-shrink-0 h-screen border-r border-slate-800 select-none shadow-2xl lg:shadow-none transition-all`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo/logo.png"
              alt="Zuno ERP"
              className="w-9 h-9 object-contain rounded-lg bg-slate-800/80 p-1 ring-1 ring-slate-700 shadow-md"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-wide">ZUNO</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30">
                  ERP
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Enterprise SaaS</span>
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
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Top-Level Navigation Links */}
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Executive Dashboard</span>
            </NavLink>

            <NavLink
              to="/modules"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>19-Module Matrix</span>
              </div>
            </NavLink>
          </div>

          {/* Phase Groups */}
          {ERP_MODULES.filter((group: any) => group.phase && Array.isArray(group.items)).map((group: any) => {
            const isCollapsed = collapsedPhases[group.phase];
            return (
              <div key={group.phase} className="space-y-1">
                <button
                  onClick={() => togglePhase(group.phase)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
                >
                  <span>{group.phase}</span>
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
                            `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                              isActive
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                            }`
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
                            <span>{item.name}</span>
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Clean Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-500 text-center font-medium">
          Zuno Enterprise SaaS
        </div>
      </aside>
    </>
  );
};

