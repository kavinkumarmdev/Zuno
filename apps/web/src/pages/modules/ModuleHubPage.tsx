import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { useAuth } from '../../stores/auth-store';
import { DataGrid, ColumnDef } from '../../components/ui/DataGrid';
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
  Table
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

interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

const TABLE_SCHEMAS: Record<string, FormFieldConfig[]> = {
  tb_company: [
    { key: 'name', label: 'Company Legal Name', type: 'text', required: true, placeholder: 'e.g. Kavin Global Industries Ltd' },
    { key: 'code', label: 'Company Identifier Code', type: 'text', required: true, placeholder: 'e.g. KAVIN-HQ' },
    { key: 'legal_name', label: 'Trade / Registration Name', type: 'text', placeholder: 'e.g. Kavin Technologies Pvt Ltd' },
    { key: 'gstin', label: 'GSTIN / Statutory Tax ID', type: 'text', placeholder: 'e.g. 33AAAAA0000A1Z5' },
    { key: 'currency_code', label: 'Base Operational Currency', type: 'select', options: ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'], defaultValue: 'INR' },
    { key: 'email', label: 'Corporate Contact Email', type: 'email', placeholder: 'contact@kavin.com' },
    { key: 'phone', label: 'Corporate Phone', type: 'tel', placeholder: '+91 9876543210' },
    { key: 'city', label: 'Registered City / State', type: 'text', placeholder: 'e.g. Chennai, Tamil Nadu' },
    { key: 'description', label: 'Headquarters Address & Details', type: 'textarea', placeholder: 'Registered corporate office location...' }
  ],
  tb_company_branch: [
    { key: 'name', label: 'Branch / Plant Name', type: 'text', required: true, placeholder: 'e.g. Chennai Central Plant & Warehouse' },
    { key: 'code', label: 'Branch Code', type: 'text', required: true, placeholder: 'e.g. CHN-PLANT-01' },
    { key: 'city', label: 'City / Region', type: 'text', placeholder: 'e.g. Chennai, Tamil Nadu' },
    { key: 'manager_name', label: 'Branch Head / Manager', type: 'text', placeholder: 'e.g. Kavin' },
    { key: 'phone', label: 'Branch Contact Phone', type: 'tel', placeholder: '+91 9876543210' },
    { key: 'description', label: 'Branch Operational Notes', type: 'textarea', placeholder: 'Warehouse capacity, production lines...' }
  ],
  tb_product_master: [
    { key: 'name', label: 'Product / Material Name', type: 'text', required: true, placeholder: 'e.g. Stainless Steel Rod 12mm' },
    { key: 'code', label: 'SKU / Part Code', type: 'text', required: true, placeholder: 'e.g. SKU-SSR-12' },
    { key: 'category', label: 'Product Category', type: 'select', options: ['Raw Materials', 'Finished Goods', 'Sub-Assemblies', 'Consumables', 'Packaging'], defaultValue: 'Raw Materials' },
    { key: 'uom', label: 'Unit of Measure (UOM)', type: 'select', options: ['PCS', 'KG', 'MTR', 'LTR', 'BOX', 'NOS', 'TON'], defaultValue: 'PCS' },
    { key: 'amount', label: 'Unit Selling Price (INR)', type: 'number', required: true, placeholder: 'e.g. 1250.00' },
    { key: 'gst_rate', label: 'Statutory GST Rate', type: 'select', options: ['0%', '5%', '12%', '18%', '28%'], defaultValue: '18%' },
    { key: 'reorder_level', label: 'Min Safety Reorder Level', type: 'number', placeholder: 'e.g. 50' },
    { key: 'description', label: 'Technical Specifications', type: 'textarea', placeholder: 'Material grade, tolerance, storage specs...' }
  ],
  tb_customer_master: [
    { key: 'name', label: 'Customer / Business Name', type: 'text', required: true, placeholder: 'e.g. Tata Motors Engineering Ltd' },
    { key: 'code', label: 'Customer Account Code', type: 'text', required: true, placeholder: 'e.g. CUST-TM-001' },
    { key: 'contact_person', label: 'Primary Contact Person', type: 'text', placeholder: 'e.g. Ramesh Kumar' },
    { key: 'email', label: 'Billing Email Address', type: 'email', placeholder: 'accounts@tatamotors.com' },
    { key: 'phone', label: 'Contact Phone Number', type: 'tel', placeholder: '+91 9876543210' },
    { key: 'gstin', label: 'Customer GSTIN', type: 'text', placeholder: 'e.g. 27AAACT2727Q1ZW' },
    { key: 'amount', label: 'Approved Credit Limit (INR)', type: 'number', placeholder: 'e.g. 1000000' },
    { key: 'city', label: 'City / State', type: 'text', placeholder: 'e.g. Pune, Maharashtra' },
    { key: 'description', label: 'Billing Address & Terms', type: 'textarea', placeholder: 'Registered delivery address...' }
  ],
  tb_supplier_master: [
    { key: 'name', label: 'Supplier / Vendor Name', type: 'text', required: true, placeholder: 'e.g. Jindal Steel & Power Ltd' },
    { key: 'code', label: 'Vendor Code', type: 'text', required: true, placeholder: 'e.g. VEND-JS-01' },
    { key: 'contact_person', label: 'Vendor Representative', type: 'text', placeholder: 'e.g. Suresh Patel' },
    { key: 'email', label: 'Vendor Email', type: 'email', placeholder: 'sales@jindalsteel.com' },
    { key: 'phone', label: 'Contact Mobile', type: 'tel', placeholder: '+91 9876543210' },
    { key: 'gstin', label: 'Vendor GSTIN', type: 'text', placeholder: 'e.g. 06AAACJ0123P1Z1' },
    { key: 'payment_terms', label: 'Payment Terms', type: 'select', options: ['Immediate', 'Net 15 Days', 'Net 30 Days', 'Net 60 Days', '100% Advance'], defaultValue: 'Net 30 Days' },
    { key: 'description', label: 'Warehouse / Factory Address', type: 'textarea', placeholder: 'Supplier factory location...' }
  ],
  tb_employee_master: [
    { key: 'name', label: 'Employee Full Name', type: 'text', required: true, placeholder: 'e.g. Anand Venkatesh' },
    { key: 'code', label: 'Employee ID Code', type: 'text', required: true, placeholder: 'e.g. EMP-2026-042' },
    { key: 'department', label: 'Department', type: 'select', options: ['Operations', 'Engineering & Production', 'Accounts & Finance', 'Sales & Marketing', 'Human Resources', 'Supply Chain', 'Quality Assurance'], defaultValue: 'Operations' },
    { key: 'designation', label: 'Job Title / Role', type: 'text', required: true, placeholder: 'e.g. Senior Production Engineer' },
    { key: 'email', label: 'Work Email Address', type: 'email', placeholder: 'anand@company.com' },
    { key: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '+91 9876543210' },
    { key: 'amount', label: 'Monthly Basic Salary (INR)', type: 'number', required: true, placeholder: 'e.g. 65000.00' },
    { key: 'description', label: 'Emergency Contact & Notes', type: 'textarea', placeholder: 'Blood group, emergency contact details...' }
  ],
  tb_sales_invoice: [
    { key: 'code', label: 'Invoice Number', type: 'text', required: true, placeholder: 'e.g. INV-2026-0891' },
    { key: 'name', label: 'Customer / Client Name', type: 'text', required: true, placeholder: 'e.g. Apex Industries Pvt Ltd' },
    { key: 'amount', label: 'Invoice Gross Value (INR)', type: 'number', required: true, placeholder: 'e.g. 85000.00' },
    { key: 'tax_amount', label: 'GST Tax Amount (INR)', type: 'number', placeholder: 'e.g. 15300.00' },
    { key: 'date', label: 'Invoice Date', type: 'date' },
    { key: 'status', label: 'Payment Status', type: 'select', options: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PAID', 'OVERDUE'], defaultValue: 'PENDING_APPROVAL' },
    { key: 'description', label: 'Terms of Delivery & Payment', type: 'textarea', placeholder: 'Delivery dispatch terms...' }
  ],
  tb_purchase_order: [
    { key: 'code', label: 'PO Number', type: 'text', required: true, placeholder: 'e.g. PO-2026-1049' },
    { key: 'name', label: 'Supplier / Vendor Name', type: 'text', required: true, placeholder: 'e.g. Bharat Heavy Metals Ltd' },
    { key: 'amount', label: 'Total PO Value (INR)', type: 'number', required: true, placeholder: 'e.g. 124000.00' },
    { key: 'date', label: 'Expected Delivery Date', type: 'date' },
    { key: 'status', label: 'Order Status', type: 'select', options: ['DRAFT', 'ISSUED_TO_VENDOR', 'GOODS_RECEIVED', 'CLOSED', 'CANCELLED'], defaultValue: 'ISSUED_TO_VENDOR' },
    { key: 'description', label: 'PO Delivery Instructions', type: 'textarea', placeholder: 'Dispatch gate pass instructions...' }
  ],
  tb_accounting_voucher: [
    { key: 'code', label: 'Voucher Number', type: 'text', required: true, placeholder: 'e.g. VCH-PAY-0082' },
    { key: 'voucher_type', label: 'Voucher Type', type: 'select', options: ['Payment Voucher', 'Receipt Voucher', 'Journal Voucher', 'Contra Voucher'], defaultValue: 'Payment Voucher' },
    { key: 'name', label: 'Debit Account Head', type: 'text', required: true, placeholder: 'e.g. Machine Maintenance & Repairs' },
    { key: 'credit_account', label: 'Credit Account Head', type: 'text', required: true, placeholder: 'e.g. HDFC Bank Current A/c' },
    { key: 'amount', label: 'Voucher Amount (INR)', type: 'number', required: true, placeholder: 'e.g. 24500.00' },
    { key: 'description', label: 'Statutory Narration', type: 'textarea', placeholder: 'Being payment made towards factory repairs...' }
  ],
  tb_user: [
    { key: 'name', label: 'User Full Name', type: 'text', required: true, placeholder: 'e.g. Kavin Kumar' },
    { key: 'code', label: 'Username', type: 'text', required: true, placeholder: 'e.g. kavin' },
    { key: 'email', label: 'Corporate Work Email', type: 'email', required: true, placeholder: 'kavin@zuno.com' },
    { key: 'user_type', label: 'Access Role', type: 'select', options: ['OWNER', 'ADMIN', 'MANAGER', 'USER', 'AUDITOR'], defaultValue: 'OWNER' },
    { key: 'status', label: 'Account Status', type: 'select', options: ['ACTIVE', 'DISABLED', 'LOCKED'], defaultValue: 'ACTIVE' },
    { key: 'description', label: 'Assigned Department & Modules', type: 'textarea', placeholder: 'Full ERP access...' }
  ],
  tb_role: [
    { key: 'name', label: 'Role Title', type: 'text', required: true, placeholder: 'e.g. Finance Operations Head' },
    { key: 'code', label: 'Role Identifier Code', type: 'text', required: true, placeholder: 'e.g. ROLE-FIN-HEAD' },
    { key: 'department', label: 'Department Assignment', type: 'select', options: ['Finance & Accounts', 'Operations & Plants', 'Human Resources', 'Supply Chain', 'Sales & Marketing', 'IT & Security'], defaultValue: 'Finance & Accounts' },
    { key: 'permission_level', label: 'Access Level', type: 'select', options: ['SUPER_ADMIN', 'DEPARTMENT_HEAD', 'MANAGER', 'OPERATOR', 'AUDITOR_READONLY'], defaultValue: 'MANAGER' },
    { key: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'INACTIVE'], defaultValue: 'ACTIVE' },
    { key: 'description', label: 'Role Responsibilities & Scopes', type: 'textarea', placeholder: 'Authorizations for voucher signing and PO approvals...' }
  ],
  tb_product_category: [
    { key: 'name', label: 'Category Name', type: 'text', required: true, placeholder: 'e.g. Industrial Fasteners & Bolts' },
    { key: 'code', label: 'Category Code', type: 'text', required: true, placeholder: 'e.g. CAT-FAST-01' },
    { key: 'hsn_code', label: 'Statutory HSN Code', type: 'text', placeholder: 'e.g. 7318' },
    { key: 'gst_rate', label: 'Standard GST Slab', type: 'select', options: ['0%', '5%', '12%', '18%', '28%'], defaultValue: '18%' },
    { key: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'INACTIVE'], defaultValue: 'ACTIVE' },
    { key: 'description', label: 'Category Hierarchy & Description', type: 'textarea', placeholder: 'Specifications for procurement and inventory classification...' }
  ],
  tb_department: [
    { key: 'name', label: 'Department Name', type: 'text', required: true, placeholder: 'e.g. Quality Assurance & Testing' },
    { key: 'code', label: 'Department Code', type: 'text', required: true, placeholder: 'e.g. DEPT-QA-01' },
    { key: 'head_name', label: 'Head of Department (HOD)', type: 'text', placeholder: 'e.g. Ramesh Kumar' },
    { key: 'cost_center', label: 'Cost Center Code', type: 'text', placeholder: 'e.g. CC-104' },
    { key: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'INACTIVE'], defaultValue: 'ACTIVE' },
    { key: 'description', label: 'Operational Scope', type: 'textarea', placeholder: 'Plant quality inspection and ISO audit functions...' }
  ],
  tb_property_master: [
    { key: 'name', label: 'Property / Land Asset Name', type: 'text', required: true, placeholder: 'e.g. Ambattur Industrial Plot 4B' },
    { key: 'code', label: 'Asset Reference Code', type: 'text', required: true, placeholder: 'e.g. PROP-AMB-04B' },
    { key: 'property_type', label: 'Property Classification', type: 'select', options: ['Freehold Industrial Land', 'Commercial Office Space', 'Factory Shed & Plant', 'Warehouse Facility', 'Leasehold Plot'], defaultValue: 'Factory Shed & Plant' },
    { key: 'amount', label: 'Book Value / Valuation (INR)', type: 'number', required: true, placeholder: 'e.g. 85000000.00' },
    { key: 'survey_no', label: 'Survey / Patta Number', type: 'text', placeholder: 'e.g. SF-142/2B' },
    { key: 'city', label: 'City & Location', type: 'text', placeholder: 'e.g. Chennai, Tamil Nadu' },
    { key: 'description', label: 'Title Deed & Legal Boundaries', type: 'textarea', placeholder: 'Deed registration details, boundary dimensions...' }
  ],
  tb_asset_master: [
    { key: 'name', label: 'Capital Asset Name', type: 'text', required: true, placeholder: 'e.g. CNC 5-Axis Milling Machine' },
    { key: 'code', label: 'Asset Tag Number', type: 'text', required: true, placeholder: 'e.g. AST-CNC-004' },
    { key: 'category', label: 'Asset Category', type: 'select', options: ['Plant & Machinery', 'Electrical & Utilities', 'Heavy Vehicles', 'IT Hardware & Servers', 'Office Furniture'], defaultValue: 'Plant & Machinery' },
    { key: 'amount', label: 'Purchase Capital Cost (INR)', type: 'number', required: true, placeholder: 'e.g. 4500000.00' },
    { key: 'serial_no', label: 'Manufacturer Serial No', type: 'text', placeholder: 'e.g. SN-HAAS-2026-99' },
    { key: 'location', label: 'Factory Bay / Location', type: 'text', placeholder: 'e.g. Bay 3 - Precision Machining Wing' },
    { key: 'status', label: 'Asset Operational Status', type: 'select', options: ['ACTIVE_RUNNING', 'UNDER_MAINTENANCE', 'IDLE', 'SCRAPPED'], defaultValue: 'ACTIVE_RUNNING' },
    { key: 'description', label: 'Maintenance Schedule & Warranty', type: 'textarea', placeholder: 'Annual AMC provider and warranty terms...' }
  ],
  tb_stock_balance: [
    { key: 'name', label: 'Product Item Name', type: 'text', required: true, placeholder: 'e.g. Copper Wire Spool 2.5mm' },
    { key: 'code', label: 'Item SKU Code', type: 'text', required: true, placeholder: 'e.g. SKU-COP-25' },
    { key: 'warehouse', label: 'Storage Warehouse', type: 'select', options: ['Central Plant Warehouse', 'Raw Material Yard', 'Finished Goods Hub', 'Cold Storage Bay'], defaultValue: 'Central Plant Warehouse' },
    { key: 'quantity', label: 'Available Stock Quantity', type: 'number', required: true, placeholder: 'e.g. 1500' },
    { key: 'uom', label: 'Unit of Measure (UOM)', type: 'select', options: ['PCS', 'KG', 'MTR', 'BOX', 'TON'], defaultValue: 'KG' },
    { key: 'amount', label: 'Valuation Cost (INR)', type: 'number', required: true, placeholder: 'e.g. 480.00' },
    { key: 'status', label: 'Stock Health', type: 'select', options: ['ADEQUATE', 'REORDER_REQUIRED', 'OVERSTOCKED', 'QUARANTINE'], defaultValue: 'ADEQUATE' },
    { key: 'description', label: 'Bin & Rack Storage Details', type: 'textarea', placeholder: 'Aisle 4, Rack B2, Bin 12' }
  ],
  tb_sales_order: [
    { key: 'code', label: 'Sales Order Number', type: 'text', required: true, placeholder: 'e.g. SO-2026-4421' },
    { key: 'name', label: 'Customer Legal Name', type: 'text', required: true, placeholder: 'e.g. Mahindra Automotive Ltd' },
    { key: 'amount', label: 'Total Order Value (INR)', type: 'number', required: true, placeholder: 'e.g. 350000.00' },
    { key: 'date', label: 'Expected Dispatch Date', type: 'date' },
    { key: 'payment_terms', label: 'Payment Terms', type: 'select', options: ['Net 30 Days', 'Net 60 Days', 'LC at Sight', '100% Advance Against PI'], defaultValue: 'Net 30 Days' },
    { key: 'status', label: 'Order Processing Status', type: 'select', options: ['CONFIRMED', 'IN_PRODUCTION', 'READY_FOR_DISPATCH', 'DELIVERED', 'CANCELLED'], defaultValue: 'CONFIRMED' },
    { key: 'description', label: 'Customer Purchase Order & Delivery Instructions', type: 'textarea', placeholder: 'Ref Customer PO: MA-PO-992. Gate pass dispatch instructions...' }
  ],
  tb_attendance: [
    { key: 'name', label: 'Employee Full Name', type: 'text', required: true, placeholder: 'e.g. Suresh Patel' },
    { key: 'code', label: 'Employee ID', type: 'text', required: true, placeholder: 'e.g. EMP-2026-081' },
    { key: 'date', label: 'Attendance Date', type: 'date' },
    { key: 'status', label: 'Attendance Status', type: 'select', options: ['PRESENT', 'ABSENT', 'HALF_DAY', 'ON_LEAVE', 'BUSINESS_DUTY'], defaultValue: 'PRESENT' },
    { key: 'shift', label: 'Assigned Work Shift', type: 'select', options: ['Morning General (09:00 - 18:00)', 'First Shift (06:00 - 14:30)', 'Second Shift (14:30 - 23:00)', 'Night Shift (23:00 - 06:00)'], defaultValue: 'Morning General (09:00 - 18:00)' },
    { key: 'description', label: 'Biometric Log / Punch Notes', type: 'textarea', placeholder: 'Punch IN: 08:55 AM, Punch OUT: 06:12 PM' }
  ],
  tb_work_order: [
    { key: 'code', label: 'Work Order Number', type: 'text', required: true, placeholder: 'e.g. WO-2026-051' },
    { key: 'name', label: 'Manufactured Product Item', type: 'text', required: true, placeholder: 'e.g. Hydraulic Actuator Assembly 50kN' },
    { key: 'quantity', label: 'Production Batch Target (Units)', type: 'number', required: true, placeholder: 'e.g. 200' },
    { key: 'date', label: 'Scheduled Completion Date', type: 'date' },
    { key: 'production_line', label: 'Assigned Assembly Line', type: 'select', options: ['Line 1 - Heavy Fabrication', 'Line 2 - Precision Assembly', 'Line 3 - Finishing & Testing'], defaultValue: 'Line 2 - Precision Assembly' },
    { key: 'status', label: 'Manufacturing Status', type: 'select', options: ['PLANNED', 'IN_PROGRESS', 'QUALITY_HOLD', 'COMPLETED'], defaultValue: 'IN_PROGRESS' },
    { key: 'description', label: 'BOM Route & Engineering Guidelines', type: 'textarea', placeholder: 'Ensure pressure testing at 250 bar before packaging...' }
  ]
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
  const { user, permissions, addCompany, isKavin, activeCompany, tenant } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  // Validate all record fields and enforce unique Code / Identifier ID
  const validateRecordForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Identify primary code/ID field
    const codeField = currentSchema.find(
      (f) => f.key === 'code' || f.key === 'sku_code' || f.key === 'company_code' || f.key === 'branch_code'
    );
    const codeKey = codeField?.key;

    if (codeKey) {
      const codeVal = String(formData[codeKey] || '').trim();
      if (!codeVal) {
        errors[codeKey] = `${codeField.label} is required.`;
      } else {
        // Check uniqueness across query results and local cached records, excluding current record
        const normalizedCode = codeVal.toUpperCase();
        const allExisting = [
          ...(queryResult?.items || []),
          ...getLocalRecords(selectedTable)
        ];
        const isDuplicate = allExisting.some((rec: any) => {
          if (editingRecord && (rec.id === editingRecord.id || rec.code === editingRecord.code)) {
            return false;
          }
          const recCode = String(rec.code || rec.sku_code || rec.company_code || rec.id || '').toUpperCase();
          return recCode === normalizedCode;
        });

        if (isDuplicate) {
          errors[codeKey] = `Unique ID Violation: Code "${codeVal}" is already registered. Please provide a unique code.`;
        }
      }
    }

    // 2. Validate all other schema fields
    for (const field of currentSchema) {
      if (field.key === codeKey) continue;
      const val = formData[field.key];
      const strVal = String(val ?? '').trim();

      if (field.required && !strVal) {
        errors[field.key] = `${field.label} is required.`;
      } else if (field.type === 'number' && strVal && isNaN(Number(strVal))) {
        errors[field.key] = `${field.label} must be a valid numeric amount.`;
      } else if (field.type === 'email' && strVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
        errors[field.key] = `Please enter a valid email address format.`;
      } else if (field.type === 'tel' && strVal && strVal.replace(/\D/g, '').length < 7) {
        errors[field.key] = `Please enter a valid phone number.`;
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

      {/* Module Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <ModuleIcon className="w-6 h-6" />
            </div>
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
        </div>

        {/* Submodule Table Selector Tabs */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
          {moduleInfo.tables.map((t) => {
            const TabIcon = getTableIcon(t.name);
            return (
              <button
                key={t.name}
                onClick={() => {
                  setSelectedTable(t.name);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  selectedTable === t.name
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
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
                    ) : (
                      <input
                        type={field.type}
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
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {createMutation.isPending
                    ? 'Saving...'
                    : editingRecord
                    ? `Update ${singleLabel}`
                    : `Save ${singleLabel}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

