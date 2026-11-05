import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { DataGrid, ColumnDef } from '../../components/ui/DataGrid';
import {
  Package,
  Layers,
  Database,
  Info,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';

// Approved catalogue tables mapped to each module
const MODULE_TABLES_MAP: Record<string, { title: string; phase: string; tables: Array<{ name: string; label: string; count?: number }> }> = {
  'company': {
    title: 'Company Management',
    phase: 'Core Setup & Admin',
    tables: [
      { name: 'tb_company', label: 'Companies' },
      { name: 'tb_company_branch', label: 'Branches' },
      { name: 'tb_company_address', label: 'Addresses' },
      { name: 'tb_company_registration', label: 'Tax & GST Registrations' },
      { name: 'tb_company_financial_year', label: 'Financial Years' },
      { name: 'tb_company_settings', label: 'Company Settings' }
    ]
  },
  'admin': {
    title: 'Administration & Management',
    phase: 'Core Setup & Admin',
    tables: [
      { name: 'tb_user', label: 'Users' },
      { name: 'tb_role', label: 'Roles' },
      { name: 'tb_permission', label: 'Permission Catalog' },
      { name: 'tb_approval_workflow', label: 'Approval Workflows' },
      { name: 'tb_login_history', label: 'Login History' }
    ]
  },
  'products': {
    title: 'Product & Material Management',
    phase: 'Master Records',
    tables: [
      { name: 'tb_product_master', label: 'Product Master' },
      { name: 'tb_product_category', label: 'Categories' },
      { name: 'tb_product_variant', label: 'Variants' },
      { name: 'tb_product_unit', label: 'Units of Measure' },
      { name: 'tb_product_price', label: 'Price Matrix' },
      { name: 'tb_product_batch', label: 'Batches' }
    ]
  },
  'hr': {
    title: 'HR & Employee Management',
    phase: 'Master Records',
    tables: [
      { name: 'tb_employee_master', label: 'Employee Master' },
      { name: 'tb_department', label: 'Departments' },
      { name: 'tb_designation', label: 'Designations' },
      { name: 'tb_employee_salary', label: 'Salary Master' },
      { name: 'tb_employee_bank', label: 'Bank Details' }
    ]
  },
  'crm': {
    title: 'Customer & Supplier Master',
    phase: 'Master Records',
    tables: [
      { name: 'tb_customer_master', label: 'Customers' },
      { name: 'tb_supplier_master', label: 'Suppliers' },
      { name: 'tb_customer_contact', label: 'Customer Contacts' },
      { name: 'tb_supplier_contact', label: 'Supplier Contacts' }
    ]
  },
  'land-building': {
    title: 'Land & Building Management',
    phase: 'Master Records',
    tables: [
      { name: 'tb_property_master', label: 'Properties' },
      { name: 'tb_construction_project', label: 'Projects' },
      { name: 'tb_construction_phase', label: 'Phases' },
      { name: 'tb_construction_expense', label: 'Project Expenses' }
    ]
  },
  'assets': {
    title: 'Assets & Maintenance Master',
    phase: 'Master Records',
    tables: [
      { name: 'tb_asset_master', label: 'Asset Master' },
      { name: 'tb_asset_category', label: 'Asset Categories' },
      { name: 'tb_asset_allocation', label: 'Allocations' },
      { name: 'tb_asset_warranty', label: 'Warranties' }
    ]
  },
  'purchase': {
    title: 'Purchase & Supplier Operations',
    phase: 'Business Operations',
    tables: [
      { name: 'tb_purchase_order', label: 'Purchase Orders' },
      { name: 'tb_purchase_request', label: 'Purchase Requests' },
      { name: 'tb_goods_receipt', label: 'Goods Receipts (GRN)' },
      { name: 'tb_supplier_invoice', label: 'Supplier Invoices' },
      { name: 'tb_purchase_return', label: 'Purchase Returns' }
    ]
  },
  'inventory': {
    title: 'Inventory & Warehouse Operations',
    phase: 'Business Operations',
    tables: [
      { name: 'tb_stock_balance', label: 'Stock Balances' },
      { name: 'tb_stock_ledger', label: 'Stock Ledger' },
      { name: 'tb_stock_inward', label: 'Stock Inward' },
      { name: 'tb_stock_outward', label: 'Stock Outward' },
      { name: 'tb_stock_transfer', label: 'Stock Transfers' },
      { name: 'tb_warehouse_master', label: 'Warehouses' }
    ]
  },
  'sales': {
    title: 'Sales & Customer Operations',
    phase: 'Business Operations',
    tables: [
      { name: 'tb_sales_order', label: 'Sales Orders' },
      { name: 'tb_sales_quotation', label: 'Quotations' },
      { name: 'tb_sales_invoice', label: 'Invoices' },
      { name: 'tb_customer_receipt', label: 'Payment Receipts' },
      { name: 'tb_sales_delivery', label: 'Deliveries' }
    ]
  },
  'attendance': {
    title: 'Attendance & Leave Management',
    phase: 'Business Operations',
    tables: [
      { name: 'tb_attendance', label: 'Daily Attendance' },
      { name: 'tb_shift_master', label: 'Shifts' },
      { name: 'tb_shift_roster', label: 'Rosters' },
      { name: 'tb_leave_request', label: 'Leave Requests' },
      { name: 'tb_overtime', label: 'Overtime Logs' }
    ]
  },
  'production': {
    title: 'Production & Manufacturing',
    phase: 'Business Operations',
    tables: [
      { name: 'tb_work_order', label: 'Work Orders' },
      { name: 'tb_bom_master', label: 'Bill of Materials (BOM)' },
      { name: 'tb_production_plan', label: 'Production Plans' },
      { name: 'tb_material_issue', label: 'Material Issues' },
      { name: 'tb_production_entry', label: 'Output Entries' }
    ]
  },
  'banking': {
    title: 'Banking & Financial Accounting',
    phase: 'Finance & Compliance',
    tables: [
      { name: 'tb_accounting_voucher', label: 'Vouchers' },
      { name: 'tb_account_ledger', label: 'Chart of Accounts' },
      { name: 'tb_company_bank_account', label: 'Bank Accounts' },
      { name: 'tb_bank_statement', label: 'Bank Statements' },
      { name: 'tb_expense_claim', label: 'Expense Claims' }
    ]
  },
  'payroll': {
    title: 'Payroll & Employee Benefits',
    phase: 'Finance & Compliance',
    tables: [
      { name: 'tb_payroll_run', label: 'Payroll Runs' },
      { name: 'tb_salary_structure', label: 'Salary Structures' },
      { name: 'tb_pf_contribution', label: 'PF Contributions' },
      { name: 'tb_esi_contribution', label: 'ESI Contributions' },
      { name: 'tb_payslip', label: 'Generated Payslips' }
    ]
  },
  'compliance': {
    title: 'Licence & Statutory Compliance',
    phase: 'Finance & Compliance',
    tables: [
      { name: 'tb_compliance_master', label: 'Compliance Register' },
      { name: 'tb_company_licence', label: 'Company Licences' },
      { name: 'tb_compliance_calendar', label: 'Filing Calendar' },
      { name: 'tb_compliance_task', label: 'Compliance Tasks' }
    ]
  },
  'statutory': {
    title: 'Government Integration & Statutory',
    phase: 'Finance & Compliance',
    tables: [
      { name: 'tb_statutory_submission', label: 'Submissions' },
      { name: 'tb_statutory_form_master', label: 'Statutory Forms' },
      { name: 'tb_statutory_rule_master', label: 'Statutory Rules' },
      { name: 'tb_government_portal', label: 'Portals' }
    ]
  },
  'investment': {
    title: 'Investment & Corporate Finance',
    phase: 'Finance & Compliance',
    tables: [
      { name: 'tb_financial_budget', label: 'Budgets' },
      { name: 'tb_investment_master', label: 'Investments' },
      { name: 'tb_loan_master', label: 'Loans' },
      { name: 'tb_capital_contribution', label: 'Capital Accounts' }
    ]
  },
  'portal': {
    title: 'Employee & Manager Portal (ESS)',
    phase: 'Self-Service & Approvals',
    tables: [
      { name: 'tb_employee_request', label: 'My Requests & Helpdesk' },
      { name: 'tb_leave_application', label: 'Leave Applications' },
      { name: 'tb_gate_pass', label: 'Gate Passes' },
      { name: 'tb_approval_action', label: 'Pending Approvals' },
      { name: 'tb_employee_document', label: 'My Documents' },
      { name: 'tb_employee_appraisal', label: 'Performance Appraisals' }
    ]
  },
  'subscriptions': {
    title: 'SaaS Platform & Subscriptions',
    phase: 'Core Setup & Admin',
    tables: [
      { name: 'tb_subscription', label: 'Tenant Subscriptions' },
      { name: 'tb_subscription_plan', label: 'Pricing Plans' },
      { name: 'tb_subscription_module', label: 'Active Modules' },
      { name: 'tb_payment', label: 'Billing Payments' },
      { name: 'tb_payment_webhook', label: 'Webhook Logs' }
    ]
  },
  'reports': {
    title: 'Reports & Management Information Systems (MIS)',
    phase: 'Analytics & Archive',
    tables: [
      { name: 'tb_sales_summary', label: 'Sales Performance' },
      { name: 'tb_purchase_summary', label: 'Procurement Summary' },
      { name: 'tb_inventory_valuation', label: 'Stock Valuation' },
      { name: 'tb_profit_loss', label: 'Profit & Loss (P&L)' }
    ]
  }
};

export const ModuleHubPage: React.FC = () => {
  const { moduleKey } = useParams<{ moduleKey: string }>();
  const queryClient = useQueryClient();

  const moduleInfo = MODULE_TABLES_MAP[moduleKey || 'products'] || MODULE_TABLES_MAP['products'];
  const [selectedTable, setSelectedTable] = useState(moduleInfo.tables[0].name);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({ name: '', description: '', code: '', amount: '' });

  // Update table when moduleKey changes
  React.useEffect(() => {
    if (moduleInfo.tables.length > 0) {
      setSelectedTable(moduleInfo.tables[0].name);
      setPage(1);
    }
  }, [moduleKey]);

  // Query table records
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['module-data', selectedTable, page, limit, search, sortField, sortOrder],
    queryFn: async () => {
      const res: any = await apiClient.get(`/modules/data/${selectedTable}`, {
        params: { page, limit, search, sortBy: sortField, sortOrder }
      });
      return res.data || res;
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return apiClient.post(`/modules/data/${selectedTable}`, payload);
    },
    onSuccess: () => {
      setShowCreateModal(false);
      setCreateFormData({ name: '', description: '', code: '', amount: '' });
      refetch();
    }
  });

  const columns: ColumnDef[] = useMemo(() => {
    return [
      { key: 'code', header: 'Code', sortable: true, width: '150px' },
      { key: 'name', header: 'Name / Subject', sortable: true },
      { key: 'description', header: 'Description' },
      { key: 'amount', header: 'Amount (INR)', sortable: true, align: 'right' },
      { key: 'status', header: 'Status', sortable: true, align: 'center', width: '120px' },
      {
        key: 'created_time',
        header: 'Created Date',
        sortable: true,
        width: '160px',
        render: (row) => new Date(row.created_time || Date.now()).toLocaleDateString()
      }
    ];
  }, [selectedTable]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                {moduleInfo.phase}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{moduleInfo.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage operational records, approvals, and documents across your company entities and branches.
            </p>
          </div>
        </div>

        {/* Submodule Table Selector Tabs */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
          {moduleInfo.tables.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                setSelectedTable(t.name);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                selectedTable === t.name
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Enterprise Data Grid */}
      <DataGrid
        title={`${moduleInfo.tables.find((t) => t.name === selectedTable)?.label || selectedTable}`}
        subtitle="Manage business records with multi-column sorting, instant search, and CSV export."
        columns={columns}
        data={data?.items || []}
        total={data?.meta?.total || 0}
        page={page}
        limit={limit}
        isLoading={isLoading}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearchChange={setSearch}
        onSortChange={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
        onRefresh={() => refetch()}
        onAddNew={() => setShowCreateModal(true)}
        addNewLabel={`Add ${moduleInfo.tables.find((t) => t.name === selectedTable)?.label || 'Record'}`}
      />

      {/* Add Record Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                New Record: {selectedTable}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(createFormData);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Item / Document Name *
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  placeholder="e.g. Standard Operating Asset"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Identification Code (Uppercase Alphanumeric)
                </label>
                <input
                  type="text"
                  value={createFormData.code}
                  onChange={(e) => {
                    const cleanCode = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 30);
                    setCreateFormData({ ...createFormData, code: cleanCode });
                  }}
                  placeholder="e.g. REF-2026-001"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Value / Amount (INR, numbers only)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={createFormData.amount}
                  onChange={(e) => setCreateFormData({ ...createFormData, amount: e.target.value })}
                  placeholder="e.g. 50000.00"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Operational Description
                </label>
                <textarea
                  rows={3}
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  placeholder="Enter business details..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  {createMutation.isPending ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

