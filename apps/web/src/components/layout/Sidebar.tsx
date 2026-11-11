import React, { useState, useEffect, useMemo } from 'react';
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
  X,
  Settings,
  Sliders,
  Check,
  CheckSquare,
  Square,
  Search,
  Loader2,
  Sparkles
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

  // Modular Workspace Architecture: Read user/tenant configured active modules
  const [enabledModules, setEnabledModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zuno_enabled_modules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    // Initial core defaults
    return [
      'company',
      'subscriptions',
      'admin',
      'products',
      'hr',
      'purchase',
      'inventory',
      'sales',
      'banking',
      'statutory',
      'reports',
      'history'
    ];
  });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pendingModules, setPendingModules] = useState<string[]>([]);
  const [moduleSearch, setModuleSearch] = useState('');
  const [isSavingModules, setIsSavingModules] = useState(false);

  useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem('zuno_enabled_modules');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setEnabledModules(parsed);
        }
      } catch {}
    };
    window.addEventListener('zuno_modules_updated', handler);
    return () => window.removeEventListener('zuno_modules_updated', handler);
  }, []);

  const filteredPhaseGroups = useMemo(() => {
    return ERP_MODULES.filter((group: any) => group.phase && Array.isArray(group.items))
      .map((group: any) => ({
        ...group,
        items: group.items.filter((item: any) => enabledModules.includes(item.id))
      }))
      .filter((group: any) => group.items.length > 0);
  }, [enabledModules]);

  const allAvailableModules = useMemo(() => {
    const list: Array<{ id: string; name: string; phase: string; icon: any; count?: number; table?: string }> = [];
    ERP_MODULES.forEach((g: any) => {
      if (g.phase && Array.isArray(g.items)) {
        g.items.forEach((item: any) => {
          list.push({ ...item, phase: g.phase });
        });
      }
    });
    return list;
  }, []);

  const handleToggleModule = (id: string) => {
    setPendingModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setPendingModules(allAvailableModules.map((m) => m.id));
  };

  const handleSelectCore = () => {
    setPendingModules([
      'company',
      'subscriptions',
      'admin',
      'products',
      'hr',
      'purchase',
      'inventory',
      'sales',
      'banking',
      'statutory'
    ]);
  };

  const handleClearAll = () => {
    setPendingModules(['company']);
  };

  const handleSaveModules = () => {
    setIsSavingModules(true);
    setTimeout(() => {
      localStorage.setItem('zuno_enabled_modules', JSON.stringify(pendingModules));
      setEnabledModules(pendingModules);
      window.dispatchEvent(new Event('zuno_modules_updated'));
      setIsSavingModules(false);
      setShowUpdateModal(false);
    }, 250);
  };

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

          {/* Phase Groups (Filtered by Enabled Modules) */}
          {filteredPhaseGroups.map((group: any) => {
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

        {/* Update Modules Button at Sidebar Bottom */}
        <div className="p-2.5 border-t border-slate-800/80 bg-slate-950/90 relative z-10 shrink-0">
          <button
            onClick={() => {
              setPendingModules([...enabledModules]);
              setModuleSearch('');
              setShowUpdateModal(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/30 hover:border-blue-400 text-blue-200 transition-all duration-200 shadow-sm cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
              <span>Update Modules</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {enabledModules.length} Active
            </span>
          </button>
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

      {/* Update Modules Modal Dialog */}
      {showUpdateModal && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowUpdateModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl p-6 relative max-h-[90vh] flex flex-col text-slate-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shadow-glow-sm">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">Update Active ERP Modules</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select which modules to display in your navigation sidebar ({pendingModules.length} of {allAvailableModules.length} enabled)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter & Search Bar */}
            <div className="py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-b border-slate-800/80 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={moduleSearch}
                  onChange={(e) => setModuleSearch(e.target.value)}
                  placeholder="Search modules (e.g. Sales, HR, Banking)..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 text-[11px] font-semibold text-blue-300 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleSelectCore}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  Core Only
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Modules Checkbox Grid */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
              {ERP_MODULES.filter((group: any) => group.phase && Array.isArray(group.items)).map((group: any) => {
                const groupItems = group.items.filter((item: any) =>
                  !moduleSearch ||
                  item.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
                  group.phase.toLowerCase().includes(moduleSearch.toLowerCase())
                );

                if (groupItems.length === 0) return null;

                return (
                  <div key={group.phase} className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>{group.phase}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {groupItems.map((item: any) => {
                        const Icon = item.icon;
                        const isChecked = pendingModules.includes(item.id);

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleToggleModule(item.id)}
                            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isChecked
                                ? 'bg-blue-950/40 border-blue-500/40 text-blue-100 shadow-sm'
                                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900/80 hover:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                                  isChecked
                                    ? 'bg-blue-600/30 border-blue-400/50 text-cyan-300'
                                    : 'bg-slate-900 border-slate-800 text-slate-500'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold truncate">{item.name}</div>
                                {item.table && (
                                  <div className="text-[10px] font-mono text-slate-500 truncate">
                                    {item.table}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isChecked ? (
                                <div className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-lg border border-slate-700 bg-slate-900/80" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                <span className="text-cyan-400 font-bold font-mono">{pendingModules.length}</span> modules selected
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingModules || pendingModules.length === 0}
                  onClick={handleSaveModules}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isSavingModules ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Modules...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Update Modules</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

