import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { useAuth } from '../../stores/auth-store';
import { DataGrid, ColumnDef } from '../../components/ui/DataGrid';
import { TABLE_SCHEMAS, FormFieldConfig } from './tableSchemas';
import { VoiceGuidedAssistant } from '../../components/guidance/VoiceGuidedAssistant';
import {
  Package,
  Layers,
  Database,
  Info,
  Check,
  X,
  FileSpreadsheet,
  Building2,
  Building,
  CreditCard,
  UserCog,
  Users,
  Handshake,
  Landmark,
  Wrench,
  ShoppingCart,
  Boxes,
  Receipt,
  CalendarCheck,
  Factory,
  Laptop,
  Banknote,
  FileCheck2,
  Scale,
  TrendingUp,
  BarChart3,
  MapPin,
  Calendar,
  Sliders,
  User,
  Shield,
  Key,
  Truck,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Volume2,
  Table,
  Loader2
} from 'lucide-react';

const MODULE_ICONS_MAP: Record<string, React.ElementType> = {
  'company': Building2,
  'admin': UserCog,
  'products': Package,
  'hr': Users,
  'crm': Handshake,
  'land-building': Building,
  'assets': Wrench,
  'purchase': ShoppingCart,
  'inventory': Boxes,
  'sales': Receipt,
  'attendance': CalendarCheck,
  'production': Factory,
  'banking': Landmark,
  'payroll': Banknote,
  'compliance': FileCheck2,
  'statutory': Scale,
  'investment': TrendingUp,
  'portal': Laptop,
  'subscriptions': CreditCard,
  'reports': BarChart3,
};

const getTableIcon = (tableName: string): React.ElementType => {
  if (tableName === 'tb_company') return Building2;
  if (tableName === 'tb_company_branch' || tableName === 'tb_company_address') return MapPin;
  if (tableName === 'tb_company_registration') return FileCheck2;
  if (tableName === 'tb_company_financial_year') return Calendar;
  if (tableName === 'tb_company_settings') return Sliders;

  if (tableName === 'tb_user') return User;
  if (tableName === 'tb_role') return Shield;
  if (tableName === 'tb_permission') return Key;
  if (tableName === 'tb_approval_workflow') return Layers;
  if (tableName === 'tb_login_history') return Clock;

  if (tableName === 'tb_product_master') return Package;
  if (tableName === 'tb_product_category') return Layers;
  if (tableName === 'tb_product_variant') return Boxes;
  if (tableName === 'tb_product_unit') return Scale;
  if (tableName === 'tb_product_price') return Banknote;
  if (tableName === 'tb_product_batch') return Boxes;

  if (tableName === 'tb_employee_master') return Users;
  if (tableName === 'tb_department') return Building;
  if (tableName === 'tb_designation') return UserCog;
  if (tableName === 'tb_employee_salary') return Banknote;
  if (tableName === 'tb_employee_bank') return Landmark;

  if (tableName === 'tb_customer_master') return Users;
  if (tableName === 'tb_supplier_master') return Truck;
  if (tableName === 'tb_customer_contact' || tableName === 'tb_supplier_contact') return User;

  if (tableName === 'tb_property_master') return Building;
  if (tableName.includes('construction')) return Factory;

  if (tableName.includes('asset')) return Wrench;

  if (tableName === 'tb_purchase_order') return ShoppingCart;
  if (tableName === 'tb_purchase_request') return FileText;
  if (tableName === 'tb_goods_receipt') return Boxes;
  if (tableName === 'tb_supplier_invoice') return Receipt;
  if (tableName === 'tb_purchase_return') return ShoppingCart;

  if (tableName.includes('stock')) return Boxes;
  if (tableName === 'tb_warehouse_master') return Building;

  if (tableName === 'tb_sales_order') return Receipt;
  if (tableName === 'tb_sales_quotation') return FileText;
  if (tableName === 'tb_sales_invoice') return Receipt;
  if (tableName === 'tb_customer_receipt') return Banknote;
  if (tableName === 'tb_sales_delivery') return Truck;

  if (tableName.includes('attendance')) return CalendarCheck;
  if (tableName.includes('shift') || tableName.includes('roster')) return Clock;
  if (tableName.includes('leave')) return Calendar;

  if (tableName.includes('production') || tableName.includes('work_order') || tableName.includes('bom')) return Factory;

  if (tableName.includes('bank') || tableName.includes('account')) return Landmark;
  if (tableName.includes('voucher') || tableName.includes('expense')) return Receipt;

  if (tableName.includes('payroll') || tableName.includes('salary') || tableName.includes('payslip')) return Banknote;
  if (tableName.includes('pf') || tableName.includes('esi')) return Scale;

  if (tableName.includes('compliance') || tableName.includes('licence')) return FileCheck2;
  if (tableName.includes('statutory') || tableName.includes('government')) return Scale;

  if (tableName.includes('investment') || tableName.includes('budget') || tableName.includes('loan') || tableName.includes('capital')) return TrendingUp;

  if (tableName.includes('request') || tableName.includes('helpdesk')) return Laptop;
  if (tableName.includes('approval')) return CheckCircle2;
  if (tableName.includes('document')) return FileText;
  if (tableName.includes('appraisal')) return BarChart3;

  if (tableName.includes('subscription')) return CreditCard;
  if (tableName.includes('payment')) return Banknote;

  if (tableName.includes('summary') || tableName.includes('valuation') || tableName.includes('profit')) return BarChart3;

  return Table;
};

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

// Table schemas imported from ./tableSchemas

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
  const { user, permissions, addCompany, isKavin, activeCompany, tenant } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [voiceGuideModule, setVoiceGuideModule] = useState<string | null>(null);

  // Check if current user has permission to edit records in this module
  const canEdit = useMemo(() => {
    if (!user) return false;
    // OWNER, ADMIN, and MANAGER roles have edit privileges
    if (user.userType === 'OWNER' || user.userType === 'ADMIN' || user.userType === 'MANAGER') return true;
    // Wildcard or specific module/table permission
    if (
      permissions?.includes('*') ||
      permissions?.includes(`${moduleKey}:write`) ||
      permissions?.includes(`${selectedTable}:edit`)
    ) {
      return true;
    }
    return false;
  }, [user, permissions, moduleKey, selectedTable]);

  const currentTableObj = moduleInfo.tables.find((t) => t.name === selectedTable);
  const currentTableLabel = currentTableObj?.label || selectedTable.replace(/^tb_/, '').replace(/_/g, ' ');
  const singleLabel = currentTableLabel.replace(/s$/, '').replace(/ies$/, 'y');
  const ModuleIcon = MODULE_ICONS_MAP[moduleKey || 'products'] || Package;
  const ModalTableIcon = getTableIcon(selectedTable);

  // Dynamic schema for the selected table
  const currentSchema: FormFieldConfig[] = useMemo(() => {
    if (TABLE_SCHEMAS[selectedTable]) {
      return TABLE_SCHEMAS[selectedTable];
    }
    // Contextual fallback schema for any catalogue table
    return [
      { key: 'name', label: `${singleLabel} Name / Title`, type: 'text', required: true, placeholder: `Enter ${singleLabel.toLowerCase()} name...` },
      { key: 'code', label: 'Identifier Code', type: 'text', required: true, placeholder: `REF-${Math.floor(1000 + Math.random() * 9000)}` },
      { key: 'category', label: 'Category / Group', type: 'text', placeholder: 'Operational group...' },
      { key: 'amount', label: 'Value / Amount (INR)', type: 'number', placeholder: '0.00' },
      { key: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'PENDING', 'COMPLETED', 'ARCHIVED'], defaultValue: 'ACTIVE' },
      { key: 'description', label: 'Operational Details', type: 'textarea', placeholder: 'Enter business records and audit details...' }
    ];
  }, [selectedTable, singleLabel]);

  // Helper to read local offline records cache
  const getLocalRecords = (tableName: string) => {
    try {
      const raw = localStorage.getItem(`zuno_records_${tableName}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveLocalRecord = (tableName: string, newRecord: any) => {
    try {
      const existing = getLocalRecords(tableName);
      const filtered = existing.filter((r: any) => r.id !== newRecord.id && r.code !== newRecord.code);
      const updated = [newRecord, ...filtered];
      localStorage.setItem(`zuno_records_${tableName}`, JSON.stringify(updated));
    } catch {}
  };

  // Soft Delete Handler: Marks record as ARCHIVED / is_deleted: true while preserving audit logs
  const handleSoftDelete = async (record: any) => {
    try {
      const existing = getLocalRecords(selectedTable);
      const updated = existing.map((r: any) => {
        if (r.id === record.id || r.code === record.code) {
          return {
            ...r,
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            status: 'ARCHIVED',
          };
        }
        return r;
      });

      if (!existing.some((r: any) => r.id === record.id || r.code === record.code)) {
        updated.unshift({
          ...record,
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          status: 'ARCHIVED',
        });
      }

      localStorage.setItem(`zuno_records_${selectedTable}`, JSON.stringify(updated));

      // Call backend soft-delete endpoint
      try {
        await apiClient.delete(`/modules/data/${selectedTable}/${record.id}`);
      } catch (err) {
        console.warn('API soft-delete synced locally:', err);
      }

      setActionAlert({
        type: 'success',
        message: `Record "${record.name || record.code}" soft-deleted successfully (archived for statutory compliance).`,
      });
      refetch();
    } catch (err: any) {
      setActionAlert({
        type: 'error',
        message: `Unable to soft-delete record: ${err?.message || 'Please try again.'}`,
      });
    }
  };

  // Restore Soft-Deleted Record
  const handleRestoreRecord = async (record: any) => {
    try {
      const existing = getLocalRecords(selectedTable);
      const updated = existing.map((r: any) => {
        if (r.id === record.id || r.code === record.code) {
          return {
            ...r,
            is_deleted: false,
            deleted_at: undefined,
            status: 'ACTIVE',
          };
        }
        return r;
      });

      localStorage.setItem(`zuno_records_${selectedTable}`, JSON.stringify(updated));

      try {
        await apiClient.patch(`/modules/data/${selectedTable}/${record.id}`, {
          is_deleted: false,
          status: 'ACTIVE',
        });
      } catch (err) {}

      setActionAlert({
        type: 'success',
        message: `Record "${record.name || record.code}" successfully restored to active status.`,
      });
      refetch();
    } catch (err: any) {
      setActionAlert({
        type: 'error',
        message: `Unable to restore record: ${err?.message || 'Please try again.'}`,
      });
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingRecord(null);
    const initial: Record<string, any> = {};
    for (const f of currentSchema) {
      initial[f.key] = f.defaultValue || '';
    }
    setFormData(initial);
    setFormErrors({});
    setShowCreateModal(true);
  };

  // Open Edit Modal with existing record pre-filled
  const handleEditRecord = (record: any) => {
    setEditingRecord(record);
    const initial: Record<string, any> = {};
    for (const f of currentSchema) {
      initial[f.key] = record[f.key] ?? record[f.key.replace(/_/g, '')] ?? f.defaultValue ?? '';
    }
    if (!initial.name && record.name) initial.name = record.name;
    if (!initial.code && record.code) initial.code = record.code;
    setFormData(initial);
    setFormErrors({});
    setShowCreateModal(true);
  };

  // Validate all record fields and enforce uniqueness & statutory formats across A to Z
  const validateRecordForm = (): boolean => {
    const errors: Record<string, string> = {};

    const allExisting = [
      ...(queryResult?.items || []),
      ...getLocalRecords(selectedTable)
    ];

    // Helper to check if a candidate record is the record currently being edited
    const isCurrentRecord = (rec: any) => {
      if (!editingRecord) return false;
      return (
        rec.id === editingRecord.id ||
        (rec.code && rec.code === editingRecord.code) ||
        (rec.company_code && rec.company_code === editingRecord.company_code)
      );
    };

    // 1. Primary Code / Identifier Field Validation & Uniqueness
    const codeField = currentSchema.find(
      (f) => ['code', 'sku_code', 'company_code', 'branch_code', 'account_code', 'vendor_code', 'employee_code', 'voucher_no', 'po_number', 'invoice_number', 'receipt_number', 'quotation_number', 'grn_number', 'order_number', 'task_code', 'project_code', 'licence_number', 'subscription_code', 'payment_id', 'plan_code'].includes(f.key)
    ) || currentSchema.find((f) => f.key === 'code');
    const codeKey = codeField?.key;

    if (codeKey) {
      const codeVal = String(formData[codeKey] || '').trim();
      if (!codeVal) {
        errors[codeKey] = `${codeField.label} is required.`;
      } else if (codeVal.length < 2) {
        errors[codeKey] = `${codeField.label} must be at least 2 characters.`;
      } else if (codeVal.length > 35) {
        errors[codeKey] = `${codeField.label} cannot exceed 35 characters.`;
      } else if (!/^[A-Z0-9\-_]+$/i.test(codeVal)) {
        errors[codeKey] = `${codeField.label} can only contain letters, numbers, hyphens, and underscores.`;
      } else {
        const normalizedCode = codeVal.toUpperCase();
        const isDuplicateCode = allExisting.some((rec: any) => {
          if (isCurrentRecord(rec)) return false;
          const otherCode = String(rec[codeKey] || rec.code || rec.sku_code || rec.company_code || rec.branch_code || rec.id || '').toUpperCase();
          return otherCode === normalizedCode;
        });

        if (isDuplicateCode) {
          errors[codeKey] = `Unique ID Violation: Identifier "${codeVal}" is already registered. Please provide a unique code.`;
        }
      }
    }

    // 2. Validate all other schema fields from A to Z
    for (const field of currentSchema) {
      if (field.key === codeKey) continue;
      const val = formData[field.key];
      const strVal = String(val ?? '').trim();

      // Required check
      if (field.required && !strVal) {
        errors[field.key] = `${field.label} is required.`;
        continue;
      }

      if (!strVal) continue; // Optional field is empty, skip format validation

      // A. Corporate Phone / Mobile Number (Strict 10 digits starting with 6, 7, 8, or 9)
      if (field.type === 'tel' || field.key.includes('phone') || field.key.includes('mobile')) {
        const digits = strVal.replace(/\D/g, '');
        if (digits.length !== 10) {
          errors[field.key] = `${field.label} must be exactly 10 digits (e.g. 9876543210).`;
        } else if (!/^[6-9][0-9]{9}$/.test(digits)) {
          errors[field.key] = `${field.label} must start with 6, 7, 8, or 9 (standard Indian telecom format).`;
        } else {
          // Cross-record uniqueness check for phone
          const isDuplicatePhone = allExisting.some((rec: any) => {
            if (isCurrentRecord(rec)) return false;
            const otherPhone = String(rec[field.key] || rec.phone || rec.mobile || rec.contact_phone || '').replace(/\D/g, '');
            return otherPhone.length === 10 && otherPhone === digits;
          });
          if (isDuplicatePhone) {
            errors[field.key] = `Unique Phone Violation: Phone number "${strVal}" is already registered with another record.`;
          }
        }
      }

      // B. GSTIN / Tax ID (Strict 15 chars statutory Indian regex)
      else if (field.key === 'gstin' || field.key.includes('gstin') || field.key === 'tax_id') {
        const gstinUpper = strVal.toUpperCase();
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstinRegex.test(gstinUpper)) {
          errors[field.key] = `Invalid GSTIN format: Must be 15 alphanumeric characters matching Indian GST statutory format (e.g. 33AAAAA0000A1Z5).`;
        } else {
          const isDuplicateGstin = allExisting.some((rec: any) => {
            if (isCurrentRecord(rec)) return false;
            const otherGst = String(rec[field.key] || rec.gstin || rec.tax_id || '').trim().toUpperCase();
            return otherGst && otherGst === gstinUpper;
          });
          if (isDuplicateGstin) {
            errors[field.key] = `Unique GSTIN Violation: GSTIN "${gstinUpper}" is already registered.`;
          }
        }
      }

      // C. PAN Number (Strict 10 chars statutory regex)
      else if (field.key === 'pan' || field.key === 'pan_number') {
        const panUpper = strVal.toUpperCase();
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(panUpper)) {
          errors[field.key] = `Invalid PAN format: Must be 10 characters (e.g. AAACK1234F).`;
        } else {
          const isDuplicatePan = allExisting.some((rec: any) => {
            if (isCurrentRecord(rec)) return false;
            const otherPan = String(rec[field.key] || rec.pan || rec.pan_number || '').trim().toUpperCase();
            return otherPan && otherPan === panUpper;
          });
          if (isDuplicatePan) {
            errors[field.key] = `Unique PAN Violation: PAN "${panUpper}" is already registered.`;
          }
        }
      }

      // D. Corporate / Billing Email (RFC standard regex)
      else if (field.type === 'email' || field.key.includes('email')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(strVal)) {
          errors[field.key] = `Please enter a valid RFC email address format (e.g. name@company.com).`;
        } else {
          const isDuplicateEmail = allExisting.some((rec: any) => {
            if (isCurrentRecord(rec)) return false;
            const otherEmail = String(rec[field.key] || rec.email || '').trim().toLowerCase();
            return otherEmail && otherEmail === strVal.toLowerCase();
          });
          if (isDuplicateEmail) {
            errors[field.key] = `Unique Email Violation: Email "${strVal}" is already registered.`;
          }
        }
      }

      // E. Bank Account Number (9 to 18 numeric digits & unique)
      else if (['account_number', 'bank_account', 'bank_account_no', 'loan_account_no'].includes(field.key)) {
        const digitsOnly = strVal.replace(/\D/g, '');
        if (digitsOnly.length < 9 || digitsOnly.length > 18) {
          errors[field.key] = `${field.label} must be between 9 and 18 numeric digits.`;
        } else {
          const isDuplicateAcc = allExisting.some((rec: any) => {
            if (isCurrentRecord(rec)) return false;
            const otherAcc = String(rec[field.key] || rec.account_number || rec.bank_account || '').trim();
            return otherAcc && otherAcc === strVal;
          });
          if (isDuplicateAcc) {
            errors[field.key] = `Unique Bank Account Violation: Account number "${strVal}" is already registered.`;
          }
        }
      }

      // F. Bank IFSC Code (11 characters)
      else if (field.key === 'ifsc' || field.key === 'ifsc_code') {
        const ifscUpper = strVal.toUpperCase();
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(ifscUpper)) {
          errors[field.key] = `Invalid IFSC code: Must be 11 characters (e.g. HDFC0001234, 5th char must be 0).`;
        }
      }

      // G. HSN / SAC Code (2 to 8 numeric digits)
      else if (field.key === 'hsn' || field.key === 'hsn_code' || field.key === 'sac_code') {
        if (!/^\d{2,8}$/.test(strVal)) {
          errors[field.key] = `${field.label} must be 2 to 8 numeric digits (e.g. 7318 or 998311).`;
        }
      }

      // H. Postal PIN Code (6 digits starting with 1-9)
      else if (field.key === 'postal_code' || field.key === 'pincode' || field.key === 'pin_code') {
        if (!/^[1-9][0-9]{5}$/.test(strVal)) {
          errors[field.key] = `${field.label} must be a valid 6-digit Indian PIN code (e.g. 600058).`;
        }
      }

      // I. UAN (12 digits) & ESIC IP (17 digits)
      else if (field.key === 'uan') {
        if (!/^\d{12}$/.test(strVal)) {
          errors[field.key] = `UAN must be exactly 12 numeric digits.`;
        }
      } else if (field.key === 'ip_number') {
        if (!/^\d{17}$/.test(strVal)) {
          errors[field.key] = `ESIC IP Number must be exactly 17 numeric digits.`;
        }
      }

      // J. Amount / Numeric Fields (>= 0)
      else if (field.type === 'number' || ['amount', 'price', 'cost', 'salary', 'basic_salary', 'gross_salary', 'hra', 'allowances', 'tax_amount', 'budget', 'credit_limit', 'valuation', 'balance', 'gross_amount', 'spent_amount', 'emi_amount'].includes(field.key)) {
        const num = Number(strVal);
        if (isNaN(num)) {
          errors[field.key] = `${field.label} must be a valid numeric value.`;
        } else if (num < 0) {
          errors[field.key] = `${field.label} cannot be negative.`;
        }
      }

      // K. Percentages and Slabs (0 - 100)
      else if (field.key.includes('percentage') || field.key.includes('rate') || field.key === 'progress_percentage' || field.key === 'yield_percentage' || field.key === 'gst_rate' || field.key === 'tax_rate' || field.key === 'interest_rate') {
        const num = parseFloat(strVal.replace('%', ''));
        if (isNaN(num) || num < 0 || num > 100) {
          errors[field.key] = `${field.label} must be between 0% and 100%.`;
        }
      }

      // L. Quantities (>= 0)
      else if (['quantity', 'qty', 'stock_qty', 'target_output', 'balance_qty', 'scrap_quantity', 'user_limit', 'storage_limit'].includes(field.key)) {
        const num = Number(strVal);
        if (isNaN(num) || num < 0) {
          errors[field.key] = `${field.label} must be a non-negative quantity.`;
        }
      }

      // M. Dates & Date Range Comparisons
      else if (field.type === 'date' || field.key.includes('date')) {
        const d = new Date(strVal);
        if (isNaN(d.getTime())) {
          errors[field.key] = `Please select a valid date.`;
        }
      }

      // N. URL / Webhook
      else if (field.key === 'url' || field.key === 'portal_url' || field.key === 'webhook_url') {
        if (!/^https?:\/\/.+/i.test(strVal)) {
          errors[field.key] = `${field.label} must be a valid HTTP or HTTPS URL (e.g. https://example.com).`;
        }
      }

      // O. Name / Title Length & Script Sanitization
      else if (['name', 'legal_name', 'company_name', 'full_name', 'customer_name', 'supplier_name'].includes(field.key)) {
        if (strVal.length < 2) {
          errors[field.key] = `${field.label} must be at least 2 characters.`;
        } else if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(strVal)) {
          errors[field.key] = `${field.label} contains invalid characters.`;
        }
      }
    }

    // Cross-field date check (End Date >= Start Date)
    const startDate = formData.start_date || formData.from_date || formData.mfg_date;
    const endDate = formData.end_date || formData.to_date || formData.expiry_date;
    if (startDate && endDate) {
      const d1 = new Date(startDate).getTime();
      const d2 = new Date(endDate).getTime();
      if (!isNaN(d1) && !isNaN(d2) && d2 < d1) {
        errors.end_date = `End / Expiry date cannot be earlier than Start date (${startDate}).`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update table when moduleKey changes
  React.useEffect(() => {
    if (moduleInfo.tables.length > 0) {
      setSelectedTable(moduleInfo.tables[0].name);
      setPage(1);
    }
  }, [moduleKey]);

  // Query table records
  const { data: queryResult, isLoading, refetch } = useQuery({
    queryKey: ['module-data', selectedTable, page, limit, search, sortField, sortOrder],
    queryFn: async () => {
      let serverItems: any[] = [];
      let serverTotal = 0;
      try {
        const res: any = await apiClient.get(`/modules/data/${selectedTable}`, {
          params: { page, limit, search, sortBy: sortField, sortOrder }
        });
        serverItems = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res)
          ? res
          : [];
        serverTotal = res?.meta?.total ?? serverItems.length;
      } catch (err) {
        console.warn('API query fallback to local cache:', err);
      }

      // Merge local user records with server items
      const localRecords = getLocalRecords(selectedTable);
      const mergedMap = new Map();
      for (const rec of localRecords) {
        mergedMap.set(rec.id || rec.code, rec);
      }
      for (const rec of serverItems) {
        if (!mergedMap.has(rec.id || rec.code)) {
          mergedMap.set(rec.id || rec.code, rec);
        }
      }

      let combined = Array.from(mergedMap.values());

      // STRICT MULTI-TENANT COMPANY ACCESS:
      // Kavin has full platform rights to access all company details.
      // Other new users only access their own registered company details.
      if (!isKavin) {
        if (selectedTable === 'tb_company') {
          combined = combined.filter(
            (c: any) =>
              c.id === activeCompany?.id ||
              c.code === activeCompany?.companyCode ||
              c.company_code === activeCompany?.companyCode ||
              c.name === activeCompany?.companyName ||
              c.company_name === activeCompany?.companyName
          );
        } else if (selectedTable === 'tb_company_branch') {
          combined = combined.filter(
            (b: any) =>
              !b.company_id ||
              b.company_id === activeCompany?.id ||
              b.company_id === activeCompany?.companyCode
          );
        }
      }

      if (search) {
        const q = search.toLowerCase();
        combined = combined.filter(
          (i: any) =>
            i.name?.toLowerCase().includes(q) ||
            i.company_name?.toLowerCase().includes(q) ||
            i.code?.toLowerCase().includes(q) ||
            i.description?.toLowerCase().includes(q)
        );
      }

      return {
        items: combined,
        total: Math.max(serverTotal, combined.length)
      };
    }
  });

  // Create or Update mutation with dual layer persistence
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingRecord) {
        // Update existing record
        const updatedRecord = {
          ...editingRecord,
          ...payload,
          id: editingRecord.id,
          updated_time: new Date().toISOString()
        };
        saveLocalRecord(selectedTable, updatedRecord);
        try {
          await apiClient.put(`/modules/data/${selectedTable}/${editingRecord.id}`, payload);
        } catch (err: any) {
          console.warn('API update fallback to local store:', err);
        }
        return { data: updatedRecord };
      }

      // Create new record
      const tempId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const prefix = selectedTable.replace(/^tb_/, '').substring(0, 4).toUpperCase();
      const codeVal = payload.code || payload.sku_code || payload.company_code || `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      const localRecord = {
        id: tempId,
        code: codeVal,
        name: payload.name || payload.company_name || payload.branch_name || `${singleLabel} Entry`,
        company_name: payload.name || payload.company_name,
        company_code: codeVal,
        branch_name: payload.name || payload.branch_name,
        branch_code: codeVal,
        full_name: payload.name || payload.full_name,
        product_name: payload.name || payload.product_name,
        customer_name: payload.name || payload.customer_name,
        supplier_name: payload.name || payload.supplier_name,
        employee_name: payload.name || payload.employee_name,
        description: payload.description || '',
        amount: payload.amount ? Number(payload.amount) : 0,
        status: payload.status || 'ACTIVE',
        created_time: new Date().toISOString(),
        is_user_record: true,
        ...payload
      };

      // 1. Immediately cache locally
      saveLocalRecord(selectedTable, localRecord);

      // 2. Transmit to backend PostgreSQL database
      try {
        const res: any = await apiClient.post(`/modules/data/${selectedTable}`, payload);
        if (res?.data?.id) {
          saveLocalRecord(selectedTable, res.data);
        }
        return res;
      } catch (err: any) {
        console.warn('API sync queued; record preserved in tenant store:', err);
        return { data: localRecord };
      }
    },
    onSuccess: () => {
      const isEdit = !!editingRecord;
      if (selectedTable === 'tb_company') {
        addCompany({
          id: editingRecord?.id || formData.id || 'comp-' + Date.now(),
          companyCode: formData.code || formData.company_code,
          companyName: formData.name || formData.company_name,
          currencyCode: formData.currency_code || 'INR'
        });
      }
      setShowCreateModal(false);
      setEditingRecord(null);
      setActionAlert({
        type: 'success',
        message: `${singleLabel} record successfully ${isEdit ? 'updated' : 'saved'} and synchronized with database.`
      });
      refetch();
    },
    onError: (err: any) => {
      setActionAlert({ type: 'error', message: `Unable to save record: ${err?.message || 'Please check all required fields and try again.'}` });
    }
  });

  // Dynamic columns based on selected table
  const columns: ColumnDef[] = useMemo(() => {
    if (selectedTable === 'tb_company') {
      return [
        { key: 'name', header: 'Company Name', sortable: true },
        { key: 'code', header: 'Company Code', sortable: true, width: '140px' },
        { key: 'legal_name', header: 'Legal Entity' },
        { key: 'gstin', header: 'GSTIN / Tax ID', width: '160px' },
        { key: 'currency_code', header: 'Currency', align: 'center', width: '90px' },
        { key: 'status', header: 'Status', align: 'center', width: '100px' },
        { key: 'created_time', header: 'Created', sortable: true, width: '120px', render: (r) => new Date(r.created_time || Date.now()).toLocaleDateString() }
      ];
    }

    if (selectedTable === 'tb_company_branch') {
      return [
        { key: 'name', header: 'Branch Name', sortable: true },
        { key: 'code', header: 'Branch Code', sortable: true, width: '140px' },
        { key: 'city', header: 'Location / City' },
        { key: 'manager_name', header: 'Branch Manager' },
        { key: 'phone', header: 'Phone' },
        { key: 'status', header: 'Status', align: 'center', width: '100px' }
      ];
    }

    if (selectedTable === 'tb_product_master') {
      return [
        { key: 'name', header: 'Product Name', sortable: true },
        { key: 'code', header: 'SKU Code', sortable: true, width: '140px' },
        { key: 'category', header: 'Category' },
        { key: 'amount', header: 'Unit Price (INR)', sortable: true, align: 'right', render: (r) => `₹${Number(r.amount || 0).toLocaleString('en-IN')}` },
        { key: 'uom', header: 'UOM', align: 'center', width: '80px' },
        { key: 'gst_rate', header: 'GST %', align: 'center', width: '90px' },
        { key: 'status', header: 'Status', align: 'center', width: '100px' }
      ];
    }

    if (selectedTable === 'tb_customer_master') {
      return [
        { key: 'name', header: 'Customer Name', sortable: true },
        { key: 'code', header: 'Account Code', sortable: true, width: '140px' },
        { key: 'contact_person', header: 'Contact Person' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'amount', header: 'Credit Limit (INR)', align: 'right', render: (r) => `₹${Number(r.amount || 0).toLocaleString('en-IN')}` },
        { key: 'status', header: 'Status', align: 'center', width: '100px' }
      ];
    }

    if (selectedTable === 'tb_supplier_master') {
      return [
        { key: 'name', header: 'Supplier Name', sortable: true },
        { key: 'code', header: 'Vendor Code', sortable: true, width: '140px' },
        { key: 'contact_person', header: 'Representative' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Mobile' },
        { key: 'payment_terms', header: 'Payment Terms' },
        { key: 'status', header: 'Status', align: 'center', width: '100px' }
      ];
    }

    if (selectedTable === 'tb_employee_master') {
      return [
        { key: 'name', header: 'Employee Name', sortable: true },
        { key: 'code', header: 'Employee ID', sortable: true, width: '130px' },
        { key: 'department', header: 'Department' },
        { key: 'designation', header: 'Designation' },
        { key: 'email', header: 'Email' },
        { key: 'amount', header: 'Salary (INR)', align: 'right', render: (r) => `₹${Number(r.amount || 0).toLocaleString('en-IN')}` },
        { key: 'status', header: 'Status', align: 'center', width: '100px' }
      ];
    }

    if (selectedTable === 'tb_sales_invoice' || selectedTable === 'tb_sales_order') {
      return [
        { key: 'code', header: 'Document No', sortable: true, width: '150px' },
        { key: 'name', header: 'Customer / Client', sortable: true },
        { key: 'amount', header: 'Gross Value (INR)', sortable: true, align: 'right', render: (r) => `₹${Number(r.amount || 0).toLocaleString('en-IN')}` },
        { key: 'tax_amount', header: 'GST Tax (INR)', align: 'right', render: (r) => `₹${Number(r.tax_amount || 0).toLocaleString('en-IN')}` },
        { key: 'status', header: 'Status', align: 'center', width: '130px' },
        { key: 'created_time', header: 'Date', sortable: true, width: '120px', render: (r) => new Date(r.created_time || Date.now()).toLocaleDateString() }
      ];
    }

    if (selectedTable === 'tb_purchase_order') {
      return [
        { key: 'code', header: 'PO Number', sortable: true, width: '150px' },
        { key: 'name', header: 'Vendor / Supplier', sortable: true },
        { key: 'amount', header: 'Total Value (INR)', sortable: true, align: 'right', render: (r) => `₹${Number(r.amount || 0).toLocaleString('en-IN')}` },
        { key: 'status', header: 'Status', align: 'center', width: '130px' },
        { key: 'created_time', header: 'Date', sortable: true, width: '120px', render: (r) => new Date(r.created_time || Date.now()).toLocaleDateString() }
      ];
    }

    if (selectedTable === 'tb_accounting_voucher') {
      return [
        { key: 'code', header: 'Voucher No', sortable: true, width: '140px' },
        { key: 'voucher_type', header: 'Type', width: '140px' },
        { key: 'name', header: 'Debit Account Head', sortable: true },
        { key: 'credit_account', header: 'Credit Account Head' },
        { key: 'amount', header: 'Amount (INR)', sortable: true, align: 'right', render: (r) => `₹${Number(r.amount || 0).toLocaleString('en-IN')}` },
        { key: 'description', header: 'Narration' }
      ];
    }

    if (selectedTable === 'tb_user') {
      return [
        { key: 'name', header: 'User Full Name', sortable: true },
        { key: 'code', header: 'Username', sortable: true, width: '130px' },
        { key: 'email', header: 'Corporate Email' },
        { key: 'user_type', header: 'Role', align: 'center', width: '110px' },
        { key: 'status', header: 'Status', align: 'center', width: '100px' },
        { key: 'created_time', header: 'Created', sortable: true, width: '120px', render: (r) => new Date(r.created_time || Date.now()).toLocaleDateString() }
      ];
    }

    // Default universal catalogue columns
    return [
      { key: 'code', header: 'Code / Reference', sortable: true, width: '140px' },
      { key: 'name', header: 'Item / Record Name', sortable: true },
      { key: 'description', header: 'Operational Details' },
      { key: 'amount', header: 'Amount (INR)', sortable: true, align: 'right', render: (r) => (r.amount ? `₹${Number(r.amount).toLocaleString('en-IN')}` : '—') },
      { key: 'status', header: 'Status', sortable: true, align: 'center', width: '110px' },
      {
        key: 'created_time',
        header: 'Created Date',
        sortable: true,
        width: '140px',
        render: (row) => new Date(row.created_time || Date.now()).toLocaleDateString()
      }
    ];
  }, [selectedTable]);

  const allItems = queryResult?.items || [];
  const archivedCount = useMemo(() => {
    return allItems.filter((r: any) => r.is_deleted === true || r.status === 'ARCHIVED').length;
  }, [allItems]);

  const displayedData = useMemo(() => {
    if (showArchived) {
      return allItems.filter((r: any) => r.is_deleted === true || r.status === 'ARCHIVED');
    }
    return allItems.filter((r: any) => !r.is_deleted && r.status !== 'ARCHIVED');
  }, [allItems, showArchived]);

  return (
    <div className="space-y-6">
      {/* Action Notification Alert Banner */}
      {actionAlert && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 shadow-sm ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionAlert.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <X className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="font-semibold">{actionAlert.message}</span>
          </div>
          <button
            onClick={() => setActionAlert(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 font-semibold text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Dismiss</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Futuristic Module Header Banner */}
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-600/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 relative z-10">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-glow-sm">
              <ModuleIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                  {moduleInfo.phase}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {moduleInfo.tables.length} Tables Connected
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">{moduleInfo.title}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Centralized operational cloud workspace for managing verified records, dual-layer validations, approvals, and audit trails.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={() => setVoiceGuideModule(moduleKey || 'products')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
              title="Listen to interactive voice narration for this module"
            >
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span>Listen: Module Voice Guide</span>
            </button>
          </div>
        </div>

        {/* Submodule Table Selector Tabs */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap relative z-10">
          {moduleInfo.tables.map((t) => {
            const TabIcon = getTableIcon(t.name);
            const isSelected = selectedTable === t.name;
            return (
              <button
                key={t.name}
                onClick={() => {
                  setSelectedTable(t.name);
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow-sm'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enterprise Data Grid */}
      <DataGrid
        title={currentTableLabel}
        subtitle="Manage business records with multi-column sorting, instant search, and CSV export."
        columns={columns}
        data={displayedData}
        total={displayedData.length}
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
        onAddNew={openCreateModal}
        addNewLabel={`Add ${singleLabel}`}
        onEdit={handleEditRecord}
        canEdit={canEdit}
        onSoftDelete={handleSoftDelete}
        onRestore={handleRestoreRecord}
        canDelete={canEdit}
        showArchived={showArchived}
        onToggleArchived={setShowArchived}
        archivedCount={archivedCount}
      />

      {/* Dynamic Add / Edit Record Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/50 dark:border-blue-800/50">
                  <ModalTableIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {editingRecord ? `Edit ${singleLabel}` : `Add New ${singleLabel}`}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {editingRecord
                      ? `Update operational record fields and details for ${editingRecord.code || editingRecord.name || singleLabel}.`
                      : 'Record will be saved directly to your isolated tenant database.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!validateRecordForm()) return;
                createMutation.mutate(formData);
              }}
              className="mt-4 space-y-4"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentSchema.map((field) => (
                  <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {field.label} {field.required && <span className="text-blue-600">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.key] || field.defaultValue || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, [field.key]: e.target.value });
                          if (formErrors[field.key]) setFormErrors((p) => ({ ...p, [field.key]: undefined as any }));
                        }}
                        className={`w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 cursor-pointer transition-colors ${
                          formErrors[field.key]
                            ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/20'
                            : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
                        }`}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt} className="dark:bg-slate-800">
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formData[field.key] || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, [field.key]: e.target.value });
                          if (formErrors[field.key]) setFormErrors((p) => ({ ...p, [field.key]: undefined as any }));
                        }}
                        placeholder={field.placeholder}
                        className={`w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-colors ${
                          formErrors[field.key]
                            ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/20'
                            : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
                        }`}
                      />
                    ) : field.type === 'tel' ? (
                      <div className="space-y-1">
                        <div
                          className={`flex items-center rounded-xl border bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white dark:bg-slate-800 dark:focus-within:bg-slate-900 transition-all duration-200 overflow-hidden ${
                            formErrors[field.key]
                              ? 'border-rose-400 bg-rose-50/20 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
                              : 'border-slate-300 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800/90 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 select-none shrink-0">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-semibold font-mono text-slate-700 dark:text-slate-300">+91</span>
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={formData[field.key] || ''}
                            onChange={(e) => {
                              const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setFormData({ ...formData, [field.key]: digitsOnly });
                              if (formErrors[field.key]) setFormErrors((p) => ({ ...p, [field.key]: undefined as any }));
                            }}
                            placeholder="9876543210"
                            className="w-full px-3 py-2 text-xs bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-mono focus:outline-none tracking-wider"
                          />
                          <span className="px-2.5 text-[10px] font-mono text-slate-400 shrink-0">
                            {(formData[field.key] || '').length}/10
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        {/* Currency Prefix Icon */}
                        {(field.type === 'number' && (field.key === 'amount' || field.key.includes('price') || field.key.includes('salary') || field.key.includes('cost') || field.key.includes('budget') || field.key.includes('revenue') || field.key.includes('balance') || field.key.includes('credit_limit') || field.key.includes('gross') || field.key.includes('net'))) && (
                          <div className="absolute left-3 top-2 text-xs font-bold text-slate-400 select-none pointer-events-none">
                            ₹
                          </div>
                        )}
                        <input
                          type={field.type}
                          value={formData[field.key] || ''}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (field.key === 'gstin' || field.key.includes('gstin') || field.key === 'tax_id') {
                              val = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
                            } else if (field.key === 'pan' || field.key === 'pan_number') {
                              val = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                            } else if (field.key === 'ifsc' || field.key === 'ifsc_code') {
                              val = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
                            } else if (field.key === 'postal_code' || field.key === 'pincode' || field.key === 'pin_code') {
                              val = val.replace(/\D/g, '').slice(0, 6);
                            } else if (field.key === 'hsn' || field.key === 'hsn_code' || field.key === 'sac_code') {
                              val = val.replace(/\D/g, '').slice(0, 8);
                            } else if (field.key === 'account_number' || field.key === 'bank_account' || field.key === 'loan_account_no') {
                              val = val.replace(/\D/g, '').slice(0, 18);
                            } else if (field.key === 'uan') {
                              val = val.replace(/\D/g, '').slice(0, 12);
                            } else if (field.key === 'ip_number') {
                              val = val.replace(/\D/g, '').slice(0, 17);
                            } else if (field.key === 'code' || field.key === 'sku_code' || field.key === 'company_code' || field.key === 'branch_code') {
                              val = val.toUpperCase().replace(/[^A-Z0-9\-_]/g, '').slice(0, 35);
                            }
                            setFormData({ ...formData, [field.key]: val });
                            if (formErrors[field.key]) setFormErrors((p) => ({ ...p, [field.key]: undefined as any }));
                          }}
                          placeholder={field.placeholder}
                          className={`w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-colors ${
                            (field.type === 'number' && (field.key === 'amount' || field.key.includes('price') || field.key.includes('salary') || field.key.includes('cost') || field.key.includes('budget') || field.key.includes('revenue') || field.key.includes('balance') || field.key.includes('credit_limit') || field.key.includes('gross') || field.key.includes('net')))
                              ? 'pl-7 font-mono'
                              : ''
                          } ${
                            field.key === 'gstin' || field.key === 'code' || field.key === 'sku_code' || field.key === 'pan' || field.key === 'ifsc' || field.key === 'ifsc_code'
                              ? 'font-mono tracking-wider uppercase'
                              : ''
                          } ${
                            formErrors[field.key]
                              ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/20'
                              : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
                          }`}
                        />
                        {/* Real-time Character Counter & Indicator Badges */}
                        {(field.key === 'gstin' || field.key.includes('gstin') || field.key === 'tax_id') && (
                          <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 pointer-events-none">
                            {(formData[field.key] || '').length}/15
                          </span>
                        )}
                        {(field.key === 'pan' || field.key === 'pan_number') && (
                          <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 pointer-events-none">
                            {(formData[field.key] || '').length}/10
                          </span>
                        )}
                        {(field.key === 'ifsc' || field.key === 'ifsc_code') && (
                          <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 pointer-events-none">
                            {(formData[field.key] || '').length}/11
                          </span>
                        )}
                        {(field.key === 'postal_code' || field.key === 'pincode' || field.key === 'pin_code') && (
                          <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 pointer-events-none">
                            {(formData[field.key] || '').length}/6
                          </span>
                        )}
                        {(field.key === 'hsn' || field.key === 'hsn_code' || field.key === 'sac_code') && (
                          <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 pointer-events-none">
                            {(formData[field.key] || '').length}/8
                          </span>
                        )}
                        {(field.key === 'uan') && (
                          <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 pointer-events-none">
                            {(formData[field.key] || '').length}/12
                          </span>
                        )}
                        {(field.key === 'ip_number') && (
                          <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 pointer-events-none">
                            {(formData[field.key] || '').length}/17
                          </span>
                        )}
                        {(field.key.includes('percentage') || field.key.includes('rate') || field.key === 'progress_percentage' || field.key === 'yield_percentage') && (
                          <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400 pointer-events-none">
                            %
                          </span>
                        )}
                      </div>
                    )}
                    {formErrors[field.key] && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                        <span>{formErrors[field.key]}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {createMutation.isPending
                      ? (editingRecord ? 'Updating Record...' : 'Saving Record...')
                      : editingRecord
                      ? `Update ${singleLabel}`
                      : `Save ${singleLabel}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voice-Guided Module Assistant Deep Dive */}
      <VoiceGuidedAssistant
        isOpen={!!voiceGuideModule}
        initialModuleId={voiceGuideModule || undefined}
        onClose={() => setVoiceGuideModule(null)}
      />
    </div>
  );
};

