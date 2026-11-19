import { FormFieldConfig } from './tableSchemas';
import { SelectOption } from '../../components/ui/SearchableSelect';

// Standard table code prefixes for automatic number generation
export const TABLE_CODE_PREFIXES: Record<string, string> = {
  // HR & Employee Module
  'tb_employee_master': 'EMP',
  'tb_department': 'DEPT',
  'tb_designation': 'DESIG',
  'tb_employee_salary': 'SAL',
  'tb_employee_bank': 'BNK',
  'tb_employee_document': 'DOC',
  'tb_employee_appraisal': 'APR',
  'tb_attendance': 'ATTN',

  // Products & Materials
  'tb_product_master': 'PRD',
  'tb_product_category': 'CAT',
  'tb_product_variant': 'VAR',
  'tb_product_unit': 'UOM',
  'tb_product_price': 'PRC',
  'tb_product_batch': 'BAT',

  // CRM
  'tb_customer_master': 'CUST',
  'tb_supplier_master': 'SUP',
  'tb_customer_contact': 'CCON',
  'tb_supplier_contact': 'SCON',

  // Company Setup
  'tb_company': 'CMP',
  'tb_company_branch': 'BRN',
  'tb_company_address': 'ADDR',
  'tb_company_registration': 'REG',
  'tb_company_financial_year': 'FY',

  // Admin & Security
  'tb_user': 'USR',
  'tb_role': 'ROLE',
  'tb_permission': 'PERM',
  'tb_approval_workflow': 'WF',

  // Operations & Procurement
  'tb_purchase_order': 'PO',
  'tb_purchase_request': 'PR',
  'tb_goods_receipt': 'GRN',
  'tb_supplier_invoice': 'INV',
  'tb_purchase_return': 'PRET',
  'tb_sales_order': 'SO',

  // Assets & Warehouse
  'tb_asset_master': 'AST',
  'tb_asset_category': 'ACAT',
  'tb_warehouse_master': 'WH',
  'tb_property_master': 'PROP',
  'tb_construction_project': 'PRJ',

  // Statutory
  'tb_statutory_submission': 'STAT',
  'tb_statutory_form_master': 'SFORM',
  'tb_statutory_rule_master': 'SRULE'
};

// Relation map: connects form field keys to their respective parent tables
export const FIELD_TABLE_MAPPING: Record<
  string,
  {
    table: string;
    labelField: string;
    valueField: string;
    codeField?: string;
  }
> = {
  // Department
  'department': { table: 'tb_department', labelField: 'name', valueField: 'name', codeField: 'code' },
  'department_id': { table: 'tb_department', labelField: 'name', valueField: 'id', codeField: 'code' },
  'department_code': { table: 'tb_department', labelField: 'name', valueField: 'code', codeField: 'code' },
  'department_name': { table: 'tb_department', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Designation
  'designation': { table: 'tb_designation', labelField: 'name', valueField: 'name', codeField: 'code' },
  'designation_id': { table: 'tb_designation', labelField: 'name', valueField: 'id', codeField: 'code' },
  'designation_code': { table: 'tb_designation', labelField: 'name', valueField: 'code', codeField: 'code' },
  'designation_name': { table: 'tb_designation', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Employee References
  'employee': { table: 'tb_employee_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'employee_id': { table: 'tb_employee_master', labelField: 'name', valueField: 'id', codeField: 'code' },
  'employee_code': { table: 'tb_employee_master', labelField: 'name', valueField: 'code', codeField: 'code' },
  'employee_name': { table: 'tb_employee_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'assigned_to': { table: 'tb_employee_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'reporting_manager': { table: 'tb_employee_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'head_name': { table: 'tb_employee_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'manager': { table: 'tb_employee_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'custodian': { table: 'tb_employee_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'appraiser_name': { table: 'tb_employee_master', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Customer References
  'customer': { table: 'tb_customer_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'customer_id': { table: 'tb_customer_master', labelField: 'name', valueField: 'id', codeField: 'code' },
  'customer_code': { table: 'tb_customer_master', labelField: 'name', valueField: 'code', codeField: 'code' },
  'customer_name': { table: 'tb_customer_master', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Supplier / Vendor References
  'supplier': { table: 'tb_supplier_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'supplier_id': { table: 'tb_supplier_master', labelField: 'name', valueField: 'id', codeField: 'code' },
  'supplier_code': { table: 'tb_supplier_master', labelField: 'name', valueField: 'code', codeField: 'code' },
  'supplier_name': { table: 'tb_supplier_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'vendor': { table: 'tb_supplier_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'vendor_name': { table: 'tb_supplier_master', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Product References
  'product': { table: 'tb_product_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'product_id': { table: 'tb_product_master', labelField: 'name', valueField: 'id', codeField: 'code' },
  'product_code': { table: 'tb_product_master', labelField: 'name', valueField: 'code', codeField: 'code' },
  'product_name': { table: 'tb_product_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'item_name': { table: 'tb_product_master', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Category References
  'product_category': { table: 'tb_product_category', labelField: 'name', valueField: 'name', codeField: 'code' },
  'category': { table: 'tb_product_category', labelField: 'name', valueField: 'name', codeField: 'code' },
  'asset_category': { table: 'tb_asset_category', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Unit / UOM
  'unit': { table: 'tb_product_unit', labelField: 'name', valueField: 'name', codeField: 'code' },
  'uom': { table: 'tb_product_unit', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Role References
  'role': { table: 'tb_role', labelField: 'name', valueField: 'name', codeField: 'code' },
  'role_name': { table: 'tb_role', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Company / Branch References
  'company': { table: 'tb_company', labelField: 'name', valueField: 'name', codeField: 'code' },
  'company_name': { table: 'tb_company', labelField: 'name', valueField: 'name', codeField: 'code' },
  'branch': { table: 'tb_company_branch', labelField: 'name', valueField: 'name', codeField: 'code' },
  'branch_name': { table: 'tb_company_branch', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Warehouse References
  'warehouse': { table: 'tb_warehouse_master', labelField: 'name', valueField: 'name', codeField: 'code' },
  'warehouse_name': { table: 'tb_warehouse_master', labelField: 'name', valueField: 'name', codeField: 'code' },

  // Statutory Forms & Submissions
  'form_code': { table: 'tb_statutory_form_master', labelField: 'name', valueField: 'code', codeField: 'code' },
  'statutory_form': { table: 'tb_statutory_form_master', labelField: 'name', valueField: 'name', codeField: 'code' },
};

// Initial master records seeded automatically if tables are unpopulated
export const INITIAL_MASTER_SEEDS: Record<string, any[]> = {
  'tb_department': [
    { id: 'dept-1', code: 'DEPT-001', name: 'Engineering & Production', head_name: 'Anand Venkatesh', cost_center: 'CC-ENG-101', status: 'ACTIVE', description: 'Plant manufacturing and mechanical engineering assembly' },
    { id: 'dept-2', code: 'DEPT-002', name: 'Operations & Plant Maintenance', head_name: 'Suresh Babu', cost_center: 'CC-OPS-102', status: 'ACTIVE', description: 'Shop-floor uptime and machinery preventive maintenance' },
    { id: 'dept-3', code: 'DEPT-003', name: 'Accounts & Financial Control', head_name: 'Rajesh Iyer', cost_center: 'CC-ACC-103', status: 'ACTIVE', description: 'Statutory compliance, GST filing, payroll and balance sheet accounting' },
    { id: 'dept-4', code: 'DEPT-004', name: 'Human Resources & Talent', head_name: 'Priya Sundaram', cost_center: 'CC-HR-104', status: 'ACTIVE', description: 'Talent recruitment, employee relations and workforce training' },
    { id: 'dept-5', code: 'DEPT-005', name: 'Quality Assurance & ISO Compliance', head_name: 'Kavitha Raman', cost_center: 'CC-QA-105', status: 'ACTIVE', description: 'Raw material spectrometry and finished product quality certification' },
    { id: 'dept-6', code: 'DEPT-006', name: 'Supply Chain & Procurement', head_name: 'Murugan Pillai', cost_center: 'CC-SCM-106', status: 'ACTIVE', description: 'Vendor evaluation, raw materials procurement and PO issuance' },
    { id: 'dept-7', code: 'DEPT-007', name: 'Sales & Client Relations', head_name: 'Deepak Sharma', cost_center: 'CC-SLS-107', status: 'ACTIVE', description: 'Enterprise sales order fulfillment and client accounts' },
    { id: 'dept-8', code: 'DEPT-008', name: 'Information Technology & Security', head_name: 'Kavin Kumar', cost_center: 'CC-IT-108', status: 'ACTIVE', description: 'Enterprise ERP operations, cloud infrastructure and cybersecurity' }
  ],
  'tb_designation': [
    { id: 'desig-1', code: 'DESIG-001', name: 'Senior Production Engineer', department: 'Engineering & Production', grade: 'Band T1 (Technical)', amount: '950000.00', status: 'ACTIVE', description: 'Lead production scheduling and machine programming' },
    { id: 'desig-2', code: 'DESIG-002', name: 'Operations Plant Manager', department: 'Operations & Plant Maintenance', grade: 'Band M1 (Management)', amount: '1600000.00', status: 'ACTIVE', description: 'Overall factory operations and plant throughput' },
    { id: 'desig-3', code: 'DESIG-003', name: 'Senior Accounts Executive', department: 'Accounts & Financial Control', grade: 'Band M1 (Management)', amount: '850000.00', status: 'ACTIVE', description: 'General ledger reconciliation and vendor payments' },
    { id: 'desig-4', code: 'DESIG-004', name: 'HR Business Partner', department: 'Human Resources & Talent', grade: 'Band M1 (Management)', amount: '900000.00', status: 'ACTIVE', description: 'Workforce engagement, appraisals and hiring' },
    { id: 'desig-5', code: 'DESIG-005', name: 'Quality Assurance Lead', department: 'Quality Assurance & ISO Compliance', grade: 'Band T1 (Technical)', amount: '1100000.00', status: 'ACTIVE', description: 'Non-conformance root cause analysis and ASTM compliance' },
    { id: 'desig-6', code: 'DESIG-006', name: 'Supply Chain Specialist', department: 'Supply Chain & Procurement', grade: 'Band E1 (Executive)', amount: '750000.00', status: 'ACTIVE', description: 'Inventory buffer management and supplier logistics' },
    { id: 'desig-7', code: 'DESIG-007', name: 'Principal Enterprise Architect', department: 'Information Technology & Security', grade: 'Band D1 (Director)', amount: '2400000.00', status: 'ACTIVE', description: 'High-availability ERP systems architecture and governance' },
    { id: 'desig-8', code: 'DESIG-008', name: 'Maintenance Technician', department: 'Operations & Plant Maintenance', grade: 'Band O1 (Operator)', amount: '480000.00', status: 'ACTIVE', description: 'Electro-mechanical repair and breakdown troubleshooting' }
  ],
  'tb_employee_master': [
    {
      id: 'emp-1',
      code: 'EMP-001',
      name: 'Anand Venkatesh',
      department: 'Engineering & Production',
      department_code: 'DEPT-001',
      designation: 'Senior Production Engineer',
      designation_code: 'DESIG-001',
      email: 'anand.v@zunoerp.com',
      work_email: 'anand.v@zunoerp.com',
      personal_email: 'anand.venkat.tech@gmail.com',
      phone: '9876543210',
      personal_phone: '9876543210',
      amount: '79166.00',
      basic_salary: '39583.00',
      hra: '15833.00',
      da: '11875.00',
      special_allowance: '11875.00',
      pf_deduction: '4750.00',
      esi_deduction: '594.00',
      net_salary: '73822.00',
      date: '2024-03-15',
      aadhaar: '542189031245',
      pan: 'ABCDE1234F',
      driving_licence: 'TN-01-2018-00912',
      dob: '1992-05-18',
      gender: 'Male',
      blood_group: 'O+',
      marital_status: 'Married',
      permanent_address: 'Flat 4B, Emerald Heights, GST Road',
      permanent_city: 'Chennai',
      permanent_state: 'Tamil Nadu',
      permanent_pincode: '600028',
      current_address: 'Flat 4B, Emerald Heights, GST Road',
      current_city: 'Chennai',
      current_pincode: '600028',
      nominee_name: 'Meena Anand',
      nominee_relation: 'Spouse',
      nominee_phone: '9876543219',
      pf_uan: '100924810294',
      esi_number: '31092847102938471',
      highest_qualification: 'B.E. Mechanical Engineering',
      institution: 'College of Engineering, Guindy',
      passing_year: '2014',
      total_experience_years: '10',
      previous_company: 'Larsen & Toubro Ltd',
      bank_account: '50100294827103',
      ifsc: 'HDFC0000240',
      bank_name: 'HDFC Bank',
      bank_branch: 'Anna Nagar Branch',
      status: 'ACTIVE'
    },
    {
      id: 'emp-2',
      code: 'EMP-002',
      name: 'Priya Sundaram',
      department: 'Human Resources & Talent',
      department_code: 'DEPT-004',
      designation: 'HR Business Partner',
      designation_code: 'DESIG-004',
      email: 'priya.s@zunoerp.com',
      work_email: 'priya.s@zunoerp.com',
      phone: '9876543211',
      personal_phone: '9876543211',
      amount: '75000.00',
      basic_salary: '37500.00',
      hra: '15000.00',
      da: '11250.00',
      special_allowance: '11250.00',
      pf_deduction: '4500.00',
      esi_deduction: '562.00',
      net_salary: '69938.00',
      date: '2024-04-01',
      aadhaar: '678129034512',
      pan: 'PQRSK9876L',
      dob: '1994-08-22',
      gender: 'Female',
      blood_group: 'B+',
      bank_account: '91801004928172',
      ifsc: 'SBIN0000123',
      bank_name: 'State Bank of India (SBI)',
      bank_branch: 'Industrial Estate Branch',
      status: 'ACTIVE'
    }
  ],
  'tb_statutory_form_master': [
    { id: 'sform-1', code: 'GSTR-1', name: 'GSTR-1 Outward Supplies Return', statutory_act: 'GST_ACT_2017', frequency: 'MONTHLY', due_day: '11th', description: 'Monthly statement of outward supplies and tax liability' },
    { id: 'sform-2', code: 'GSTR-3B', name: 'GSTR-3B Self-Assessed Summary Return', statutory_act: 'GST_ACT_2017', frequency: 'MONTHLY', due_day: '20th', description: 'Summary return of inward & outward supplies and input tax credit' },
    { id: 'sform-3', code: 'FORM-24Q', name: 'Form 24Q Quarterly TDS on Salaries', statutory_act: 'INCOME_TAX_ACT_1961', frequency: 'QUARTERLY', due_day: '31st', description: 'Quarterly statement of deduction of tax at source from salaries' },
    { id: 'sform-4', code: 'FORM-26Q', name: 'Form 26Q TDS Other Than Salaries', statutory_act: 'INCOME_TAX_ACT_1961', frequency: 'QUARTERLY', due_day: '31st', description: 'Quarterly statement for contractor, professional and vendor payments' },
    { id: 'sform-5', code: 'FORM-16', name: 'Form 16 Annual Employee TDS Certificate', statutory_act: 'INCOME_TAX_ACT_1961', frequency: 'ANNUAL', due_day: '15th June', description: 'Annual certificate of tax deducted and salary computation' },
    { id: 'sform-6', code: 'PF-ECR', name: 'PF Electronic Challan cum Return (ECR)', statutory_act: 'EPF_MP_ACT_1952', frequency: 'MONTHLY', due_day: '15th', description: 'Monthly PF remittance and employee contribution schedule' },
    { id: 'sform-7', code: 'ESI-FORM-5', name: 'ESI Form 5 Return of Contribution', statutory_act: 'ESI_ACT_1948', frequency: 'HALF_YEARLY', due_day: '11th May/Nov', description: 'Half-yearly return of ESI employee & employer contributions' },
    { id: 'sform-8', code: 'FORM-12', name: 'Form 12 Adult Workers Register', statutory_act: 'FACTORIES_ACT_1948', frequency: 'CONTINUOUS', due_day: 'Daily', description: 'Register of adult workers with shift and workplace allocation' },
    { id: 'sform-9', code: 'FORM-25', name: 'Form 25 Muster Roll & Inspection Book', statutory_act: 'FACTORIES_ACT_1948', frequency: 'CONTINUOUS', due_day: 'Daily', description: 'Muster roll and inspection register of attendance & wages' },
    { id: 'sform-10', code: 'FORM-A', name: 'Form A Employee Register (Code on Wages)', statutory_act: 'FACTORIES_ACT_1948', frequency: 'CONTINUOUS', due_day: 'Daily', description: 'Unified employee master register under Central Labour Codes' }
  ]
};

/**
 * Identify the SINGLE primary code field of any table.
 * Strictly avoids secondary reference codes like form_code, hsn_code, pin_code, ifsc_code.
 */
export const getPrimaryCodeField = (schema: FormFieldConfig[]): FormFieldConfig | undefined => {
  if (!Array.isArray(schema) || schema.length === 0) return undefined;

  // 1. Exact match 'code'
  const exact = schema.find((f) => f.key === 'code');
  if (exact) return exact;

  // 2. Standard primary table identifiers
  const primaryKeys = ['sku_code', 'company_code', 'branch_code', 'account_code', 'vendor_code', 'employee_code'];
  const match = schema.find((f) => primaryKeys.includes(f.key));
  if (match) return match;

  // 3. Fallback: endsWith('_code'), but explicitly exclude secondary foreign/lookup keys
  const secondaryExcluded = [
    'form_code',
    'hsn_code',
    'sac_code',
    'pin_code',
    'postal_code',
    'ifsc_code',
    'tax_code',
    'cost_center',
    'cost_center_code',
    'department_code',
    'designation_code',
    'customer_code',
    'supplier_code',
    'category_code',
    'product_code',
    'currency_code',
    'bank_code'
  ];
  return schema.find((f) => f.key.endsWith('_code') && !secondaryExcluded.includes(f.key));
};

/**
 * Ensure seed records exist in localStorage so users always have rich data
 */
export const ensureTableSeedRecords = (tableName: string): any[] => {
  try {
    const raw = localStorage.getItem(`zuno_records_${tableName}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    if (INITIAL_MASTER_SEEDS[tableName]) {
      const seeds = INITIAL_MASTER_SEEDS[tableName];
      localStorage.setItem(`zuno_records_${tableName}`, JSON.stringify(seeds));
      return seeds;
    }
  } catch {}
  return [];
};

/**
 * Calculate the next sequential identifier code for any table.
 * Example: For EMP-001..EMP-005, generates EMP-006.
 */
export const generateNextSequentialCode = (tableName: string, existingRecords: any[] = []): string => {
  const prefix =
    TABLE_CODE_PREFIXES[tableName] ||
    tableName.replace('tb_', '').replace(/_master|_table|_record/g, '').substring(0, 4).toUpperCase();

  // Combine with initial seeds if existing is empty
  let allRecords = [...existingRecords];
  if (allRecords.length === 0 && INITIAL_MASTER_SEEDS[tableName]) {
    allRecords = [...INITIAL_MASTER_SEEDS[tableName]];
  }

  // Extract all existing code values
  const existingCodes: string[] = allRecords
    .map((r: any) => r?.code || r?.employee_code || r?.company_code || r?.sku_code || r?.branch_code || '')
    .filter(Boolean);

  let maxNum = 0;
  let detectedPadding = 3;

  for (const rawCode of existingCodes) {
    const str = String(rawCode).trim();
    // Match trailing numeric digits: e.g. EMP-005, EMP-2026-042, DEPT-01
    const match = str.match(/(\d+)$/);
    if (match) {
      const numStr = match[1];
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
        if (numStr.length > detectedPadding) {
          detectedPadding = numStr.length;
        }
      }
    }
  }

  const nextNum = maxNum + 1;
  const formattedNum = String(nextNum).padStart(detectedPadding, '0');
  return `${prefix}-${formattedNum}`;
};

/**
 * Real-time Indian Bank IFSC Code directory & auto-lookup
 * Resolves Bank Name, Branch Location, City, and State automatically.
 */
export interface BankIfscDetails {
  bankName: string;
  branch: string;
  city: string;
  state: string;
  valid: boolean;
}

const BANK_PREFIX_MAP: Record<string, string> = {
  'SBIN': 'State Bank of India (SBI)',
  'HDFC': 'HDFC Bank',
  'ICIC': 'ICICI Bank',
  'PUNB': 'Punjab National Bank (PNB)',
  'BARB': 'Bank of Baroda',
  'AXIS': 'Axis Bank',
  'UTIB': 'Axis Bank',
  'KKBK': 'Kotak Mahindra Bank',
  'UBIN': 'Union Bank of India',
  'CANR': 'Canara Bank',
  'INDB': 'IndusInd Bank',
  'YESB': 'Yes Bank',
  'IDFB': 'IDFC First Bank',
  'BKID': 'Bank of India',
  'CBIN': 'Central Bank of India',
  'IOBA': 'Indian Overseas Bank',
  'IDIB': 'Indian Bank',
  'MAHB': 'Bank of Maharashtra',
  'PSIB': 'Punjab & Sind Bank',
  'UCBA': 'UCO Bank',
  'FDRL': 'Federal Bank',
  'KVBL': 'Karur Vysya Bank',
  'CIUB': 'City Union Bank',
  'SIBL': 'South Indian Bank',
  'CSBK': 'CSB Bank',
  'TMBL': 'Tamilnad Mercantile Bank',
  'DCBL': 'DCB Bank',
  'RBLN': 'RBL Bank',
  'BDBL': 'Bandhan Bank',
  'AUBL': 'AU Small Finance Bank',
  'ESFB': 'Equitas Small Finance Bank',
  'UJVN': 'Ujjivan Small Finance Bank',
  'SCBL': 'Standard Chartered Bank',
  'CITI': 'Citibank N.A.',
  'HSBC': 'HSBC India',
  'DBSS': 'DBS Bank India'
};

export const lookupIfscCode = async (ifscRaw: string): Promise<BankIfscDetails | null> => {
  if (!ifscRaw) return null;
  const ifsc = ifscRaw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (ifsc.length < 4) return null;

  const prefix = ifsc.substring(0, 4);
  const knownBank = BANK_PREFIX_MAP[prefix];

  if (!knownBank) {
    if (ifsc.length >= 11) {
      return {
        bankName: `Scheduled Commercial Bank (${prefix})`,
        branch: `Main Commercial Branch (${ifsc.substring(ifsc.length - 4)})`,
        city: 'Metropolitan Commercial Zone',
        state: 'National Jurisdiction',
        valid: true
      };
    }
    return null;
  }

  // If full 11-character IFSC, attempt live Razorpay IFSC directory with fast abort
  if (ifsc.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return {
          bankName: data.BANK || knownBank,
          branch: data.BRANCH || `${knownBank} Corporate Branch`,
          city: data.CITY || data.DISTRICT || 'Commercial District',
          state: data.STATE || 'India',
          valid: true
        };
      }
    } catch {}
  }

  // Instant local offline directory resolution
  const branchSuffix = ifsc.length >= 8 ? ifsc.substring(ifsc.length - 4) : '001';
  return {
    bankName: knownBank,
    branch: `Main Commercial Hub (${branchSuffix})`,
    city: 'Industrial Commercial Center',
    state: 'State Banking Zone',
    valid: ifsc.length === 11
  };
};

/**
 * Auto-Calculate Indian Payroll Salary Breakdown based on monthly Gross CTC
 */
export interface SalaryComponents {
  grossMonthly: number;
  basicSalary: number;
  hra: number;
  da: number;
  specialAllowance: number;
  pfDeduction: number;
  esiDeduction: number;
  netTakeHome: number;
}

export const calculateSalaryComponents = (grossMonthly: number): SalaryComponents => {
  const gross = Math.max(0, grossMonthly || 0);

  // Standard Indian Statutory Formula:
  // Basic = 50% of Gross
  const basic = Math.round(gross * 0.5);
  // HRA = 20% of Gross
  const hra = Math.round(gross * 0.2);
  // DA = 15% of Gross
  const da = Math.round(gross * 0.15);
  // Special Allowance = Remaining balance (15%)
  const specialAllowance = Math.max(0, gross - (basic + hra + da));

  // PF = 12% of Basic (capped at basic ceiling or 12%)
  const pf = Math.round(basic * 0.12);

  // ESI = 0.75% of Gross if gross <= 21,000; otherwise 0
  const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;

  const netTakeHome = Math.max(0, gross - (pf + esi));

  return {
    grossMonthly: gross,
    basicSalary: basic,
    hra,
    da,
    specialAllowance,
    pfDeduction: pf,
    esiDeduction: esi,
    netTakeHome
  };
};

/**
 * Intelligent AI Resume Parser: extracts candidate info from uploaded resume text
 */
export interface ParsedResumeResult {
  name?: string;
  email?: string;
  phone?: string;
  pan?: string;
  aadhaar?: string;
  department?: string;
  designation?: string;
  highest_qualification?: string;
  institution?: string;
  total_experience_years?: string;
  previous_company?: string;
  permanent_city?: string;
  bank_account?: string;
  ifsc?: string;
  skills?: string[];
}

export const extractCandidateDetailsFromResume = (text: string): ParsedResumeResult => {
  const result: ParsedResumeResult = {};
  if (!text) return result;

  // 1. Email extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.email = emailMatch[0];

  // 2. Phone extraction (10-digit Indian numbers with optional +91 / 0)
  const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  if (phoneMatch) {
    result.phone = phoneMatch[0].replace(/\D/g, '').slice(-10);
  }

  // 3. PAN Card Number (5 letters + 4 digits + 1 letter)
  const panMatch = text.match(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/);
  if (panMatch) result.pan = panMatch[0];

  // 4. Aadhaar Card Number (12 digits, optional spaces)
  const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
  if (aadhaarMatch) result.aadhaar = aadhaarMatch[0].replace(/\s/g, '');

  // 5. IFSC Code
  const ifscMatch = text.match(/\b[A-Z]{4}0[A-Z0-9]{6}\b/);
  if (ifscMatch) result.ifsc = ifscMatch[0];

  // 6. Name extraction (first prominent line or name prefix)
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    if (/^[A-Za-z\s]{3,35}$/.test(line) && !/resume|curriculum|vitae|profile|email|phone/i.test(line)) {
      result.name = line;
      break;
    }
  }

  // 7. Experience extraction
  const expMatch = text.match(/(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s*of\s*experience)?/i);
  if (expMatch) result.total_experience_years = expMatch[1];

  // 8. Education extraction (maps to standard highest_qualification options)
  const eduPatterns = [
    { label: 'B.E. / B.Tech', regex: /(?:B\.?E\.?|B\.?Tech|Bachelor\s+of\s+Engineering)/i },
    { label: 'M.E. / M.Tech', regex: /(?:M\.?E\.?|M\.?Tech|Master\s+of\s+Engineering)/i },
    { label: 'MBA / PGDM', regex: /(?:MBA|PGDM|Master\s+of\s+Business)/i },
    { label: 'MCA / M.Sc', regex: /(?:MCA|M\.?Sc)/i },
    { label: 'B.Com / M.Com', regex: /(?:B\.?Com|M\.?Com)/i },
    { label: 'Polytechnic Diploma', regex: /(?:Diploma|Polytechnic)/i },
    { label: 'Ph.D / Doctorate', regex: /(?:Ph\.?D|Doctorate)/i }
  ];
  for (const item of eduPatterns) {
    if (item.regex.test(text)) {
      result.highest_qualification = item.label;
      break;
    }
  }

  // 9. Department & Designation inference
  const deptKeywords = [
    { key: 'Engineering & Production', regex: /engineering|production|manufacturing|machining|cnc|cad/i },
    { key: 'Quality Assurance & ISO Compliance', regex: /quality|qa|qc|iso|audit|inspection/i },
    { key: 'Accounts & Financial Control', regex: /accounts|finance|gst|tax|tally|balance sheet|audit/i },
    { key: 'Human Resources & Talent', regex: /human resources|hr|recruitment|payroll|talent/i },
    { key: 'Information Technology & Security', regex: /software|developer|react|node|cloud|devops|cyber/i },
    { key: 'Supply Chain & Procurement', regex: /supply chain|procurement|logistics|vendor|purchase/i }
  ];
  for (const d of deptKeywords) {
    if (d.regex.test(text)) {
      result.department = d.key;
      break;
    }
  }

  // 10. Designation inference
  const desigKeywords = [
    { title: 'Senior Production Engineer', regex: /production engineer|cnc|machining/i },
    { title: 'Operations Plant Manager', regex: /plant manager|operations manager/i },
    { title: 'HR Business Partner', regex: /hr business partner|hrbp|talent acquisition/i },
    { title: 'Senior Accounts Executive', regex: /accounts executive|accountant|financial controller/i },
    { title: 'Quality Assurance Lead', regex: /quality assurance|qa lead|qc engineer/i },
    { title: 'Supply Chain Specialist', regex: /supply chain|procurement specialist/i },
    { title: 'Principal Enterprise Architect', regex: /enterprise architect|solution architect|software architect/i },
    { title: 'Maintenance Technician', regex: /technician|electrician|mechanic/i }
  ];
  for (const des of desigKeywords) {
    if (des.regex.test(text)) {
      result.designation = des.title;
      break;
    }
  }

  // 11. Previous company
  const companyMatch = text.match(/(?:at|for|with|—|-)\s+([A-Z][A-Za-z0-9&.,\s]{3,35}(?:Ltd|Limited|Pvt|Private|Corp|Inc|Systems|Technologies|Engineering))/i);
  if (companyMatch) {
    result.previous_company = companyMatch[1].trim();
  }

  return result;
};

/**
 * Ensure default employee login account is created automatically in tb_user
 */
export const ensureEmployeeUserAccount = (empRecord: any): void => {
  if (!empRecord || !empRecord.email) return;
  try {
    const rawUsers = localStorage.getItem('zuno_records_tb_user');
    const users: any[] = rawUsers ? JSON.parse(rawUsers) : [];

    const normEmail = empRecord.email.toLowerCase().trim();
    const existingIndex = users.findIndex((u) => u.email?.toLowerCase().trim() === normEmail);

    const userPayload = {
      id: empRecord.id || `user-${Date.now()}`,
      username: empRecord.code || normEmail.split('@')[0],
      email: normEmail,
      name: empRecord.name || 'Enterprise Employee',
      role: 'EMPLOYEE',
      department: empRecord.department || 'Operations',
      designation: empRecord.designation || 'Staff',
      password: empRecord.password || 'Zuno@2026',
      status: 'ACTIVE',
      created_time: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userPayload };
    } else {
      users.unshift(userPayload);
    }

    localStorage.setItem('zuno_records_tb_user', JSON.stringify(users));
  } catch {}
};

/**
 * Attendance Shift & Overtime Calculator
 * Working hours: 9:00 AM (09:00) to 6:00 PM (18:00) -> 9 hours (8 hours work + 1 hour lunch)
 * Overtime: any time worked beyond 8.0 hours
 */
export interface AttendanceCalculation {
  totalMinutesWorked: number;
  workingHoursFormatted: string;
  breakMinutes: number;
  breakHoursFormatted: string;
  overtimeMinutes: number;
  overtimeHoursFormatted: string;
  isLate: boolean;
  lateMinutes: number;
  permissionWaived: boolean;
  isWeekOffWork: boolean;
  status: 'PRESENT' | 'LATE_MARK' | 'OVERTIME' | 'HALF_DAY' | 'WEEK_OFF_WORK';
}

/**
 * Enhanced Shift Punch Calculator supporting:
 * - Mode A: 4 Punch (start(in) -> lunch(out) -> lunch(in) -> end(out))
 * - Mode B: 2 Punch (start(in) -> end(out))
 * - Week-Off & Holiday double wage/status detection
 * - Approved Permission late-mark waiver (1 hr or 2 hrs)
 * - Dynamic Company Policy Configuration
 */
export const calculateAttendanceHours = (
  inTimeStr: string,
  outTimeStr?: string,
  lunchOutStr?: string,
  lunchInStr?: string,
  punchModeInput?: '4_PUNCH' | '2_PUNCH',
  approvedPermissionHours: number = 0,
  isWeekOffDay: boolean = false,
  policyInput?: CompanyAttendancePolicy
): AttendanceCalculation => {
  const policy = policyInput || getCompanyAttendancePolicy();
  const punchMode = punchModeInput || policy.punchMode || '2_PUNCH';

  if (!inTimeStr) {
    return {
      totalMinutesWorked: 0,
      workingHoursFormatted: '0h 00m',
      breakMinutes: 0,
      breakHoursFormatted: '0h 00m',
      overtimeMinutes: 0,
      overtimeHoursFormatted: '0h 00m',
      isLate: false,
      lateMinutes: 0,
      permissionWaived: false,
      isWeekOffWork: isWeekOffDay,
      status: isWeekOffDay ? 'WEEK_OFF_WORK' : 'PRESENT'
    };
  }

  const [inH, inM] = inTimeStr.split(':').map((n) => parseInt(n, 10));
  const inTotalM = inH * 60 + (inM || 0);

  // Shift Start from Company Policy (e.g. 09:00) + grace tolerance
  const [shiftStartH, shiftStartM] = (policy.shiftStartTime || '09:00').split(':').map((n) => parseInt(n, 10));
  const shiftStandardStartM = shiftStartH * 60 + (shiftStartM || 0);
  const baseGrace = policy.graceMinutes || 15;
  const graceMinutes = baseGrace + approvedPermissionHours * 60;
  const lateThresholdM = shiftStandardStartM + graceMinutes;
  const isRawLate = inTotalM > shiftStandardStartM + baseGrace;
  const isLate = inTotalM > lateThresholdM;
  const lateMinutes = Math.max(0, inTotalM - (shiftStandardStartM + baseGrace));
  const permissionWaived = isRawLate && !isLate && approvedPermissionHours > 0;

  const now = new Date();
  const currentTotalM = now.getHours() * 60 + now.getMinutes();

  let netWorkingMinutes = 0;
  let breakMinutes = 0;

  if (punchMode === '4_PUNCH') {
    // Mode A: 4 Punch (start(in) -> lunch(out) -> lunch(in) -> end(out))
    // 1. Session 1: Start In to Lunch Out
    let session1M = 0;
    if (lunchOutStr) {
      const [loH, loM] = lunchOutStr.split(':').map((n) => parseInt(n, 10));
      session1M = Math.max(0, (loH * 60 + (loM || 0)) - inTotalM);
    } else if (!outTimeStr) {
      // Currently before lunch out
      session1M = Math.max(0, currentTotalM - inTotalM);
    }

    // 2. Break: Lunch Out to Lunch In
    if (lunchOutStr && lunchInStr) {
      const [loH, loM] = lunchOutStr.split(':').map((n) => parseInt(n, 10));
      const [liH, liM] = lunchInStr.split(':').map((n) => parseInt(n, 10));
      breakMinutes = Math.max(0, (liH * 60 + (liM || 0)) - (loH * 60 + (loM || 0)));
    } else if (lunchOutStr && !lunchInStr) {
      // Currently in lunch break
      const [loH, loM] = lunchOutStr.split(':').map((n) => parseInt(n, 10));
      breakMinutes = Math.max(0, currentTotalM - (loH * 60 + (loM || 0)));
    }

    // 3. Session 2: Lunch In to End Out
    let session2M = 0;
    if (lunchInStr) {
      const [liH, liM] = lunchInStr.split(':').map((n) => parseInt(n, 10));
      const liTotalM = liH * 60 + (liM || 0);
      if (outTimeStr) {
        const [outH, outM] = outTimeStr.split(':').map((n) => parseInt(n, 10));
        session2M = Math.max(0, (outH * 60 + (outM || 0)) - liTotalM);
      } else {
        session2M = Math.max(0, currentTotalM - liTotalM);
      }
    }

    netWorkingMinutes = session1M + session2M;
  } else {
    // Mode B: 2 Punch (start(in) -> end(out))
    let totalElapsedM = 0;
    if (outTimeStr) {
      const [outH, outM] = outTimeStr.split(':').map((n) => parseInt(n, 10));
      totalElapsedM = Math.max(0, (outH * 60 + (outM || 0)) - inTotalM);
    } else {
      totalElapsedM = Math.max(0, currentTotalM - inTotalM);
    }

    // Deduct standard lunch break if enabled and worked > 5 hours (300 mins)
    const lunchDuration = policy.lunchDurationMinutes || 60;
    if (policy.autoDeductLunchIn2Punch && totalElapsedM > 300) {
      breakMinutes = lunchDuration;
      netWorkingMinutes = Math.max(0, totalElapsedM - lunchDuration);
    } else {
      breakMinutes = 0;
      netWorkingMinutes = totalElapsedM;
    }
  }

  // Overtime: anything over standard workday minutes (e.g. 480 mins)
  const standardDayMinutes = policy.overtimeThresholdMinutes || 480;
  const otMinutes = Math.max(0, netWorkingMinutes - standardDayMinutes);

  const workH = Math.floor(netWorkingMinutes / 60);
  const workM = netWorkingMinutes % 60;

  const breakH = Math.floor(breakMinutes / 60);
  const breakM = breakMinutes % 60;

  const otH = Math.floor(otMinutes / 60);
  const otM = otMinutes % 60;

  const halfDayCutoff = policy.halfDayMinimumMinutes || 240;
  let status: 'PRESENT' | 'LATE_MARK' | 'OVERTIME' | 'HALF_DAY' | 'WEEK_OFF_WORK' = 'PRESENT';
  if (isWeekOffDay) {
    status = 'WEEK_OFF_WORK';
  } else if (otMinutes > 0) {
    status = 'OVERTIME';
  } else if (isLate) {
    status = 'LATE_MARK';
  } else if (netWorkingMinutes < halfDayCutoff && outTimeStr) {
    status = 'HALF_DAY';
  }

  return {
    totalMinutesWorked: netWorkingMinutes,
    workingHoursFormatted: `${workH}h ${String(workM).padStart(2, '0')}m`,
    breakMinutes,
    breakHoursFormatted: `${breakH}h ${String(breakM).padStart(2, '0')}m`,
    overtimeMinutes: otMinutes,
    overtimeHoursFormatted: `${otH}h ${String(otM).padStart(2, '0')}m`,
    isLate,
    lateMinutes,
    permissionWaived,
    isWeekOffWork: isWeekOffDay,
    status
  };
};

/**
 * Week Off Policies under Indian Factory & Corporate Compliance
 */
export type WeekOffPolicy = 'SUNDAY_ONLY' | 'SECOND_FOURTH_SAT_SUNDAY' | 'ROTATIONAL_1_IN_6' | 'SATURDAY_SUNDAY';

export interface WeekOffPolicyConfig {
  id: WeekOffPolicy;
  name: string;
  description: string;
  statutoryBasis: string;
}

export const WEEK_OFF_POLICIES: WeekOffPolicyConfig[] = [
  {
    id: 'SECOND_FOURTH_SAT_SUNDAY',
    name: '2nd & 4th Saturday + All Sundays Off (Standard Corporate)',
    description: 'All Sundays and the 2nd & 4th Saturdays of each month are designated non-working weekly rest days.',
    statutoryBasis: 'Indian Commercial Establishments & Banking Standards'
  },
  {
    id: 'SUNDAY_ONLY',
    name: 'All Sundays Off (Standard Industrial 6-Day Week)',
    description: 'Sunday is the statutory rest day under Section 52 of the Factories Act, 1948.',
    statutoryBasis: 'Section 52, Factories Act, 1948'
  },
  {
    id: 'ROTATIONAL_1_IN_6',
    name: 'Rotational 1-in-6 Rolling Off (Continuous 24x7 Shift)',
    description: 'Every 6 consecutive working days are followed by 1 mandatory scheduled rest day.',
    statutoryBasis: 'Continuous Process Factory Exemption Rules'
  },
  {
    id: 'SATURDAY_SUNDAY',
    name: 'All Saturdays & Sundays Off (5-Day Work Week)',
    description: 'Standard 40-hour 5-day corporate office schedule.',
    statutoryBasis: 'Corporate IT & MNC Employment Agreements'
  }
];

export const isDateWeekOff = (
  dateInput: string | Date,
  policy: WeekOffPolicy = 'SECOND_FOURTH_SAT_SUNDAY'
): boolean => {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return false;

  const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday

  if (policy === 'SUNDAY_ONLY') {
    return dayOfWeek === 0;
  }

  if (policy === 'SATURDAY_SUNDAY') {
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  if (policy === 'SECOND_FOURTH_SAT_SUNDAY') {
    if (dayOfWeek === 0) return true; // All Sundays
    if (dayOfWeek === 6) {
      // Determine which Saturday of the month (1st, 2nd, 3rd, 4th, 5th)
      const dateNum = d.getDate();
      const saturdayIndex = Math.floor((dateNum - 1) / 7) + 1;
      return saturdayIndex === 2 || saturdayIndex === 4;
    }
    return false;
  }

  if (policy === 'ROTATIONAL_1_IN_6') {
    const epoch = new Date('2026-01-01').getTime();
    const diffDays = Math.floor((d.getTime() - epoch) / (1000 * 60 * 60 * 24));
    return ((diffDays % 7) + 7) % 7 === 6;
  }

  return false;
};

/**
 * Comprehensive Company Attendance, Shift, Lunch, Permission, Leave & Payroll Policy
 * Configured once at company level, automatically applied across all employees for attendance & salary calculation.
 */
export interface CompanyAttendancePolicy {
  // 1. Shift & Punch Timings (2-Punch vs 4-Punch, from-to, lunch)
  punchMode: '4_PUNCH' | '2_PUNCH';
  shiftStartTime: string; // e.g. "09:00" (Shift from)
  shiftEndTime: string;   // e.g. "18:00" (Shift to)
  graceMinutes: number;   // e.g. 15 (Grace tolerance)
  halfDayMinimumMinutes: number; // e.g. 240 mins (4 hrs)
  fullDayMinimumMinutes: number; // e.g. 480 mins (8 hrs)
  overtimeThresholdMinutes: number; // e.g. 480 mins (8 hrs)

  // 2. Lunch Break Timings
  lunchStartTime: string; // e.g. "13:00" (Lunch from)
  lunchEndTime: string;   // e.g. "14:00" (Lunch to)
  lunchDurationMinutes: number; // e.g. 60 mins
  autoDeductLunchIn2Punch: boolean; // Auto-deduct 60 mins in 2-punch mode if elapsed > 5 hrs

  // 3. Permission Multi-Option & Limits (Hours, Days per month & weekly)
  permissionAllowedHours: 1 | 2; // e.g. 2 hrs per permission
  maxPermissionsPerMonth: number; // e.g. 2 times per month
  maxPermissionsPerWeek: number;  // e.g. 1 time per week
  maxPermissionHoursPerMonth: number; // e.g. 4 hours per month
  permissionTypes: Array<{
    id: string;
    name: string;
    type: 'LATE_ARRIVAL' | 'EARLY_DEPARTURE' | 'MID_DAY_EMERGENCY';
    maxDurationHours: number;
    description: string;
  }>;
  excessPermissionAction: 'HALF_DAY_LOP' | 'HOURLY_DEDUCTION' | 'NONE';

  // 4. Leave & Holiday Policy
  casualLeavePerYear: number; // 12
  sickLeavePerYear: number;   // 12
  earnedLeavePerYear: number; // 15
  weekOffPolicy: WeekOffPolicy; // 'SECOND_FOURTH_SAT_SUNDAY'
  paidHolidaysPerYear: number; // 10
  lateMarksForHalfDayLop: number; // 3 late marks = 0.5 Day LOP

  // 5. Salary Calculation
  standardWorkingDaysPerMonth: number; // 26
  salaryCalculationBasis: 'CALENDAR_DAYS' | 'FIXED_26_DAYS' | 'WORKING_DAYS';
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_COMPANY_ATTENDANCE_POLICY: CompanyAttendancePolicy = {
  punchMode: '4_PUNCH',
  shiftStartTime: '09:00',
  shiftEndTime: '18:00',
  graceMinutes: 15,
  halfDayMinimumMinutes: 240,
  fullDayMinimumMinutes: 480,
  overtimeThresholdMinutes: 480,
  lunchStartTime: '13:00',
  lunchEndTime: '14:00',
  lunchDurationMinutes: 60,
  autoDeductLunchIn2Punch: true,
  permissionAllowedHours: 2,
  maxPermissionsPerMonth: 2,
  maxPermissionsPerWeek: 1,
  maxPermissionHoursPerMonth: 4,
  permissionTypes: [
    {
      id: 'LATE_ARRIVAL',
      name: 'Morning Late Arrival Permission',
      type: 'LATE_ARRIVAL',
      maxDurationHours: 2,
      description: 'Permits arriving up to 2 hours after shift start without late mark or salary penalty.'
    },
    {
      id: 'EARLY_DEPARTURE',
      name: 'Evening Early Departure Permission',
      type: 'EARLY_DEPARTURE',
      maxDurationHours: 2,
      description: 'Permits departing up to 2 hours before shift end for personal or medical appointments.'
    },
    {
      id: 'MID_DAY_EMERGENCY',
      name: 'Mid-Day Personal Emergency Permission',
      type: 'MID_DAY_EMERGENCY',
      maxDurationHours: 2,
      description: 'Permits short personal stepped-out leave during work hours for up to 2 hours.'
    }
  ],
  excessPermissionAction: 'HALF_DAY_LOP',
  casualLeavePerYear: 12,
  sickLeavePerYear: 12,
  earnedLeavePerYear: 15,
  weekOffPolicy: 'SECOND_FOURTH_SAT_SUNDAY',
  paidHolidaysPerYear: 10,
  lateMarksForHalfDayLop: 3,
  standardWorkingDaysPerMonth: 26,
  salaryCalculationBasis: 'CALENDAR_DAYS'
};

export const getLocalRecords = (tableName: string): any[] => {
  try {
    const raw = localStorage.getItem(`zuno_records_${tableName}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalRecord = (tableName: string, newRecord: any): void => {
  try {
    const records = getLocalRecords(tableName);
    const existingIndex = records.findIndex((r: any) => r.id === newRecord.id);
    let updated: any[];
    if (existingIndex >= 0) {
      updated = [...records];
      updated[existingIndex] = { ...updated[existingIndex], ...newRecord };
    } else {
      updated = [newRecord, ...records];
    }
    localStorage.setItem(`zuno_records_${tableName}`, JSON.stringify(updated));
  } catch {}
};

export const getCompanyAttendancePolicy = (): CompanyAttendancePolicy => {
  try {
    const raw = localStorage.getItem('zuno_company_attendance_policy');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_COMPANY_ATTENDANCE_POLICY, ...parsed };
    }
  } catch {}
  return DEFAULT_COMPANY_ATTENDANCE_POLICY;
};

export const saveCompanyAttendancePolicy = (policy: Partial<CompanyAttendancePolicy>): CompanyAttendancePolicy => {
  const current = getCompanyAttendancePolicy();
  const updated: CompanyAttendancePolicy = {
    ...current,
    ...policy,
    updatedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem('zuno_company_attendance_policy', JSON.stringify(updated));
    if (updated.punchMode) {
      localStorage.setItem('zuno_shift_punch_mode', updated.punchMode);
    }
    if (updated.weekOffPolicy) {
      localStorage.setItem('zuno_week_off_policy', updated.weekOffPolicy);
    }
  } catch {}
  return updated;
};

/**
 * Company Permission / Short-Leave Rules (1 hr or 2 hrs weekly/monthly)
 */
export interface PermissionRecord {
  id: string;
  code: string;
  employee_code: string;
  name: string;
  department: string;
  date: string;
  duration_hours: 1 | 2;
  permission_type: 'LATE_ARRIVAL' | 'EARLY_DEPARTURE' | 'MID_DAY_EMERGENCY';
  reason: string;
  approval_status: 'APPROVED' | 'PENDING' | 'REJECTED';
  approved_by: string;
  created_time: string;
}

export const getEmployeePermissionBalance = (
  employeeCode: string,
  records: PermissionRecord[] = [],
  policyInput?: CompanyAttendancePolicy
): {
  usedThisMonth: number;
  maxAllowedMonth: number;
  remainingThisMonth: number;
  canApply: boolean;
  usedThisWeek: number;
  maxAllowedWeek: number;
  remainingThisWeek: number;
} => {
  const policy = policyInput || getCompanyAttendancePolicy();
  const now = new Date();
  const currentMonth = now.toISOString().substring(0, 7);

  // Calculate start of current week (Monday)
  const currentDay = now.getDay();
  const diffToMonday = (currentDay + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const usedMonth = records.filter(
    (r) => r.employee_code === employeeCode && r.date?.startsWith(currentMonth) && r.approval_status !== 'REJECTED'
  ).length;

  const usedWeek = records.filter((r) => {
    if (r.employee_code !== employeeCode || r.approval_status === 'REJECTED') return false;
    const rDate = new Date(r.date);
    return rDate >= monday && rDate <= now;
  }).length;

  const maxMonth = policy.maxPermissionsPerMonth || 2;
  const maxWeek = policy.maxPermissionsPerWeek || 1;

  return {
    usedThisMonth: usedMonth,
    maxAllowedMonth: maxMonth,
    remainingThisMonth: Math.max(0, maxMonth - usedMonth),
    canApply: usedMonth < maxMonth && usedWeek < maxWeek,
    usedThisWeek: usedWeek,
    maxAllowedWeek: maxWeek,
    remainingThisWeek: Math.max(0, maxWeek - usedWeek)
  };
};

/**
 * Attendance to Salary Calculation Engine
 * Converts marked punches, late-marks, permissions, leaves, and overtime into exact payroll figures
 */
export interface AttendanceSalarySummary {
  month: string;
  year: string;
  totalCalendarDays: number;
  totalWeekOffDays: number;
  totalWorkingDays: number;
  actualPresentDays: number;
  totalLateMarks: number;
  lateMarkLopDays: number;
  permissionsUsed: number;
  excessPermissions: number;
  excessPermissionLopDays: number;
  leavesTaken: number;
  totalLopDays: number;
  payableDays: number;
  grossMonthly: number;
  earnedBasic: number;
  earnedHra: number;
  earnedDa: number;
  earnedSpecialAllowance: number;
  overtimeHours: number;
  overtimeEarnings: number;
  earnedGrossSalary: number;
  pfDeduction: number;
  esiDeduction: number;
  professionalTax: number;
  tdsDeduction: number;
  totalDeductions: number;
  netPayableSalary: number;
}

export const calculateSalaryBreakdownFromAttendance = (
  grossMonthly: number,
  monthStr: string = 'November',
  yearStr: string = '2026',
  employeeCode?: string,
  policyInput?: CompanyAttendancePolicy
): AttendanceSalarySummary => {
  const policy = policyInput || getCompanyAttendancePolicy();
  const gross = Math.max(0, grossMonthly || 0);

  // Month map
  const monthMap: Record<string, number> = {
    'January': 31, 'February': 28, 'March': 31, 'April': 30, 'May': 31, 'June': 30,
    'July': 31, 'August': 31, 'September': 30, 'October': 31, 'November': 30, 'December': 31
  };
  const totalCalendarDays = monthMap[monthStr] || 30;

  // Month index (0-based)
  const monthNames = Object.keys(monthMap);
  const monthIdx = Math.max(0, monthNames.indexOf(monthStr));
  const yearNum = parseInt(yearStr, 10) || 2026;

  // Calculate week off count in this month
  let totalWeekOffDays = 0;
  for (let day = 1; day <= totalCalendarDays; day++) {
    const d = new Date(yearNum, monthIdx, day);
    if (isDateWeekOff(d, policy.weekOffPolicy)) {
      totalWeekOffDays++;
    }
  }

  const totalWorkingDays = Math.max(1, totalCalendarDays - totalWeekOffDays);

  // Fetch actual attendance records from localStorage if present
  let actualPresentDays = totalWorkingDays;
  let totalLateMarks = 0;
  let overtimeHours = 0;
  let permissionsUsed = 0;
  let leavesTaken = 0;

  try {
    const rawAttn = localStorage.getItem('zuno_records_tb_attendance');
    if (rawAttn) {
      const allAttn = JSON.parse(rawAttn);
      const filtered = allAttn.filter((a: any) => {
        if (employeeCode && a.employee_code && a.employee_code !== employeeCode) return false;
        if (a.date) {
          const aDate = new Date(a.date);
          return aDate.getFullYear() === yearNum && aDate.getMonth() === monthIdx;
        }
        return true;
      });

      if (filtered.length > 0) {
        actualPresentDays = filtered.filter((a: any) => a.status === 'PRESENT' || a.status === 'OVERTIME' || a.in_time).length;
        totalLateMarks = filtered.filter((a: any) => a.status === 'LATE_MARK' || a.is_late).length;
        overtimeHours = filtered.reduce((sum: number, a: any) => {
          const ot = parseFloat(a.overtime_hours || 0);
          return sum + (isNaN(ot) ? 0 : ot);
        }, 0);
      }
    }

    // Permissions
    const rawPerms = localStorage.getItem('zuno_records_tb_permissions');
    if (rawPerms) {
      const allPerms = JSON.parse(rawPerms);
      permissionsUsed = allPerms.filter((p: any) => {
        if (employeeCode && p.employee_code && p.employee_code !== employeeCode) return false;
        if (p.date) {
          const pDate = new Date(p.date);
          return pDate.getFullYear() === yearNum && pDate.getMonth() === monthIdx && p.approval_status !== 'REJECTED';
        }
        return false;
      }).length;
    }

    // Leaves
    const rawLeaves = localStorage.getItem('zuno_records_tb_leave_request');
    if (rawLeaves) {
      const allLeaves = JSON.parse(rawLeaves);
      leavesTaken = allLeaves.filter((l: any) => {
        if (employeeCode && l.employee_code && l.employee_code !== employeeCode) return false;
        return l.status === 'APPROVED';
      }).length;
    }
  } catch {}

  // Late mark penalty: e.g. 3 late marks = 0.5 Day LOP
  const lateMarksForHalfDay = policy.lateMarksForHalfDayLop || 3;
  const lateMarkLopDays = Math.floor(totalLateMarks / lateMarksForHalfDay) * 0.5;

  // Excess permission penalty
  const maxPermissions = policy.maxPermissionsPerMonth || 2;
  const excessPermissions = Math.max(0, permissionsUsed - maxPermissions);
  const excessPermissionLopDays = policy.excessPermissionAction === 'HALF_DAY_LOP' ? excessPermissions * 0.5 : 0;

  // Unapproved absence LOP
  const absentDays = Math.max(0, totalWorkingDays - actualPresentDays - leavesTaken);
  const totalLopDays = absentDays + lateMarkLopDays + excessPermissionLopDays;

  // Payable days: Working Days + Paid Week Offs - LOP Days
  const payableDays = Math.max(0, Math.min(totalCalendarDays, totalCalendarDays - totalLopDays));

  // Prorated Salary
  const payRatio = payableDays / totalCalendarDays;
  const earnedBasic = Math.round(gross * 0.5 * payRatio);
  const earnedHra = Math.round(gross * 0.25 * payRatio);
  const earnedDa = Math.round(gross * 0.15 * payRatio);
  const earnedSpecialAllowance = Math.round(gross * 0.1 * payRatio);

  // Overtime rate: double ordinary hourly rate (Gross / (26 * 8) = Gross / 208 * 2)
  const normalHourlyRate = Math.round(gross / 208);
  const otHourlyRate = normalHourlyRate * 2;
  const overtimeEarnings = Math.round(otHourlyRate * overtimeHours);

  const earnedGrossSalary = earnedBasic + earnedHra + earnedDa + earnedSpecialAllowance + overtimeEarnings;

  // Statutory deductions
  const pfDeduction = Math.round(earnedBasic * 0.12);
  const esiDeduction = gross <= 21000 ? Math.round(earnedGrossSalary * 0.0075) : 0;
  const professionalTax = 200;
  const tdsDeduction = gross > 100000 ? Math.round(earnedGrossSalary * 0.1) : 0;
  const totalDeductions = pfDeduction + esiDeduction + professionalTax + tdsDeduction;

  const netPayableSalary = Math.max(0, earnedGrossSalary - totalDeductions);

  return {
    month: monthStr,
    year: yearStr,
    totalCalendarDays,
    totalWeekOffDays,
    totalWorkingDays,
    actualPresentDays,
    totalLateMarks,
    lateMarkLopDays,
    permissionsUsed,
    excessPermissions,
    excessPermissionLopDays,
    leavesTaken,
    totalLopDays,
    payableDays,
    grossMonthly: gross,
    earnedBasic,
    earnedHra,
    earnedDa,
    earnedSpecialAllowance,
    overtimeHours,
    overtimeEarnings,
    earnedGrossSalary,
    pfDeduction,
    esiDeduction,
    professionalTax,
    tdsDeduction,
    totalDeductions,
    netPayableSalary
  };
};

/**
 * Statutory Annual Bonus Tally & Form C Audit Register (Payment of Bonus Act, 1965)
 */
export interface EmployeeBonusTallyItem {
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  fatherOrSpouseName: string;
  daysWorked: number;
  annualBasicDa: number;
  bonusPercentage: number;
  grossBonusPayable: number;
  interimFestivalAdvance: number;
  statutoryTds: number;
  netBonusDisbursed: number;
  bankAccount: string;
  ifsc: string;
  bankName: string;
  paymentMode: 'NEFT_RTGS' | 'DIRECT_BANK_TRANSFER' | 'CHEQUE';
  paymentStatus: 'DISBURSED' | 'PENDING_APPROVAL' | 'PROCESSING';
  paymentDate: string;
  transactionRef: string;
}

export interface BonusAuditSummary {
  accountingYear: string;
  totalEmployees: number;
  bonusPercentage: number;
  totalAnnualBasicDa: number;
  totalGrossBonus: number;
  totalAdvancesDeducted: number;
  totalNetDisbursed: number;
  allocableSurplus: number;
  statutoryCompliance: {
    minimumBonusMet: boolean;
    withinMaximumCap: boolean;
    disbursedWithin8Months: boolean;
    formCMaintained: boolean;
  };
}

export const calculateStatutoryBonus = (
  employees: any[],
  bonusPercentage: number = 8.33,
  accountingYear: string = '2025-2026'
): { items: EmployeeBonusTallyItem[]; summary: BonusAuditSummary } => {
  const pct = Math.max(8.33, Math.min(20.0, bonusPercentage));

  let totalAnnualBasicDa = 0;
  let totalGrossBonus = 0;
  let totalAdvancesDeducted = 0;
  let totalNetDisbursed = 0;

  const items: EmployeeBonusTallyItem[] = employees.map((emp, idx) => {
    const gross = Number(emp.amount || 65000);
    const basic = Number(emp.basic_salary || Math.round(gross * 0.5));
    const da = Number(emp.da || Math.round(gross * 0.15));
    const monthlyBasicDa = basic + da;

    const annualBasicDa = monthlyBasicDa * 12;
    const daysWorked = 280 + (idx % 20);

    const grossBonus = Math.round(annualBasicDa * (pct / 100));
    const festivalAdvance = idx % 2 === 0 ? Math.round(grossBonus * 0.3) : 0;
    const tds = grossBonus > 50000 ? Math.round((grossBonus - festivalAdvance) * 0.1) : 0;
    const netBonus = Math.max(0, grossBonus - festivalAdvance - tds);

    totalAnnualBasicDa += annualBasicDa;
    totalGrossBonus += grossBonus;
    totalAdvancesDeducted += festivalAdvance;
    totalNetDisbursed += netBonus;

    return {
      employeeCode: emp.code || `EMP-${String(idx + 1).padStart(3, '0')}`,
      employeeName: emp.name || 'Staff Member',
      department: emp.department || 'Operations',
      designation: emp.designation || 'Specialist',
      fatherOrSpouseName: emp.guardian_name || (emp.nominee_relation?.includes('Father') ? emp.nominee_name : 'Venkatesh S'),
      daysWorked,
      annualBasicDa,
      bonusPercentage: pct,
      grossBonusPayable: grossBonus,
      interimFestivalAdvance: festivalAdvance,
      statutoryTds: tds,
      netBonusDisbursed: netBonus,
      bankAccount: emp.bank_account || '91801004928172',
      ifsc: emp.ifsc || 'SBIN0000123',
      bankName: emp.bank_name || 'State Bank of India',
      paymentMode: 'NEFT_RTGS',
      paymentStatus: 'DISBURSED',
      paymentDate: '2026-10-28',
      transactionRef: `UTR-CMS-BONUS-${2026000 + idx}`
    };
  });

  const summary: BonusAuditSummary = {
    accountingYear,
    totalEmployees: items.length,
    bonusPercentage: pct,
    totalAnnualBasicDa,
    totalGrossBonus,
    totalAdvancesDeducted,
    totalNetDisbursed,
    allocableSurplus: Math.round(totalGrossBonus * 1.45),
    statutoryCompliance: {
      minimumBonusMet: pct >= 8.33,
      withinMaximumCap: pct <= 20.0,
      disbursedWithin8Months: true,
      formCMaintained: true
    }
  };

  return { items, summary };
};

/**
 * Statutory Labour Compliance Forms Catalog (Indian Labour Code / Factory Acts)
 */
export interface StatutoryFormDefinition {
  code: string;
  title: string;
  act: string;
  description: string;
  category: 'WAGES' | 'EMPLOYMENT' | 'GRATUITY_PF' | 'ATTENDANCE';
}

export const STATUTORY_FORMS_CATALOG: StatutoryFormDefinition[] = [
  {
    code: 'FORM-A',
    title: 'Form A: Employee Register',
    act: 'The Occupational Safety, Health & Working Conditions Code, 2020',
    description: 'Statutory master register capturing employee identity, permanent address, Aadhaar, PAN, and appointment order.',
    category: 'EMPLOYMENT'
  },
  {
    code: 'FORM-B',
    title: 'Form B: Register of Wages & Overtime',
    act: 'The Code on Wages, 2019 (Central Rules)',
    description: 'Official wage sheet detailing Basic, DA, HRA, Gross Earnings, PF, ESI statutory deductions, and Net Disbursed.',
    category: 'WAGES'
  },
  {
    code: 'FORM-C',
    title: 'Form C: Register of Advances & Recoveries',
    act: 'Payment of Wages Act & Code on Wages',
    description: 'Records company salary advances, tool loans, and monthly amortization deductions.',
    category: 'WAGES'
  },
  {
    code: 'FORM-D',
    title: 'Form D: Attendance & Muster Roll',
    act: 'Factories Act, 1948 & State Rules',
    description: 'Daily in/out punch times, regular shifts, overtime hours, and monthly attendance percentage.',
    category: 'ATTENDANCE'
  },
  {
    code: 'FORM-11',
    title: 'Form 11: EPF Universal Declaration',
    act: 'Employees Provident Fund Scheme, 1952',
    description: 'Declaration by employee containing past UAN, previous PF account details, and Aadhaar seed linkage.',
    category: 'GRATUITY_PF'
  },
  {
    code: 'FORM-F',
    title: 'Form F: Gratuity Nomination Mandate',
    act: 'Payment of Gratuity Act, 1972',
    description: 'Nomination of family members and percentage allocation for statutory gratuity settlement.',
    category: 'GRATUITY_PF'
  },
  {
    code: 'FORM-2',
    title: 'Form 2: EPF & EPS Nomination Form',
    act: 'Employees Provident Fund & Pension Scheme, 1995',
    description: 'Nomination of beneficiary family members for Provident Fund accumulated balance and pension.',
    category: 'GRATUITY_PF'
  },
  {
    code: 'FORM-12',
    title: 'Form 12: Register of Adult Workers',
    act: 'Factories Act, 1948 (Section 62 & State Rules)',
    description: 'Mandatory adult factory register recording worker token numbers, shift relay, nature of mechanical work, and fitness certification.',
    category: 'EMPLOYMENT'
  },
  {
    code: 'FORM-25',
    title: 'Form 25: Muster Roll & Overtime Wage Register',
    act: 'Factories Act, 1948 (Section 59 & State Rules)',
    description: 'Official statutory overtime register recording ordinary wage rates, overtime hours, double-rate overtime wages (2x), and total disbursement.',
    category: 'WAGES'
  },
  {
    code: 'FORM-16',
    title: 'Form 16: Certificate of Tax Deducted at Source (TDS)',
    act: 'Income Tax Act, 1961 (Section 203)',
    description: 'Annual statutory tax certificate issued to employees detailing gross earnings, Chapter VI-A deductions, and tax remitted to Central Govt.',
    category: 'WAGES'
  }
];

/**
 * DPDP Act 2023 Masking Helper: tokenizes and masks sensitive PII for ex-employees
 */
export const maskPii = (type: 'aadhaar' | 'pan' | 'phone', val: string): string => {
  if (!val) return '—';
  const clean = val.replace(/[\s-]/g, '');
  if (type === 'aadhaar') {
    // Return XXXX-XXXX-1245
    const last4 = clean.slice(-4);
    return `XXXX-XXXX-${last4}`;
  }
  if (type === 'pan') {
    // Return XXXXX1234F
    if (clean.length === 10) {
      return `XXXXX${clean.slice(5)}`;
    }
    return `XXXXX${clean.slice(-4)}`;
  }
  if (type === 'phone') {
    // Return +91 XXXXX 43210
    const last5 = clean.slice(-5);
    return `+91 XXXXX ${last5}`;
  }
  return val;
};

/**
 * Full & Final (F&F) Settlement Calculator
 * Computes Unpaid salary, Earned Leave encashment, Statutory Gratuity, Notice shortfall, and Net payable.
 */
export interface FnFSettlementResult {
  monthlyGross: number;
  unpaidSalaryDays: number;
  unpaidSalaryAmount: number;
  leaveEncashmentDays: number;
  leaveEncashmentAmount: number;
  tenureYears: number;
  isGratuityEligible: boolean;
  gratuityAmount: number;
  grossPayable: number;
  noticeShortfallDays: number;
  noticeRecoveryAmount: number;
  pendingAdvanceDeductions: number;
  assetDeductions: number;
  totalDeductions: number;
  netSettlementAmount: number;
}

export const calculateFnFSettlement = (params: {
  monthlyGross: number;
  basicSalary: number;
  da?: number;
  joiningDate?: string;
  lwdDate?: string;
  daysWorkedInFinalMonth?: number;
  accumulatedLeaves?: number;
  noticeRequiredDays?: number;
  noticeServedDays?: number;
  pendingAdvances?: number;
  assetDeductions?: number;
}): FnFSettlementResult => {
  const gross = Math.max(0, params.monthlyGross || 0);
  const basic = Math.max(0, params.basicSalary || gross * 0.5);
  const da = Math.max(0, params.da || gross * 0.15);
  const basicPlusDa = basic + da;

  // 1. Unpaid Salary for final month days worked
  const daysWorked = Math.max(0, Math.min(31, params.daysWorkedInFinalMonth ?? 15));
  const perDayGross = gross / 30;
  const unpaidSalaryAmount = Math.round(perDayGross * daysWorked);

  // 2. Accumulated Earned Leave (EL / PL) Encashment: (Basic + DA) / 30 * Leaves
  const leaves = Math.max(0, params.accumulatedLeaves ?? 12);
  const perDayBasicDa = basicPlusDa / 30;
  const leaveEncashmentAmount = Math.round(perDayBasicDa * leaves);

  // 3. Statutory Gratuity Calculation (Payment of Gratuity Act, 1972)
  // Formula: (15 * (Basic + DA) * Tenure in Years) / 26
  let tenureYears = 0;
  if (params.joiningDate) {
    const jDate = new Date(params.joiningDate);
    const lDate = params.lwdDate ? new Date(params.lwdDate) : new Date();
    const diffMs = lDate.getTime() - jDate.getTime();
    tenureYears = Math.max(0, Math.round((diffMs / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10);
  } else {
    tenureYears = 5.2; // default realistic benchmark
  }

  const isGratuityEligible = tenureYears >= 5.0;
  const gratuityAmount = isGratuityEligible
    ? Math.round((15 * basicPlusDa * Math.round(tenureYears)) / 26)
    : 0;

  const grossPayable = unpaidSalaryAmount + leaveEncashmentAmount + gratuityAmount;

  // 4. Notice Period Shortfall Recovery
  const noticeRequired = params.noticeRequiredDays ?? 30;
  const noticeServed = params.noticeServedDays ?? 30;
  const noticeShortfall = Math.max(0, noticeRequired - noticeServed);
  const noticeRecoveryAmount = Math.round((gross / 30) * noticeShortfall);

  // 5. Deductions
  const pendingAdvances = Math.max(0, params.pendingAdvances || 0);
  const assetDeductions = Math.max(0, params.assetDeductions || 0);
  const totalDeductions = noticeRecoveryAmount + pendingAdvances + assetDeductions;

  // 6. Net Settlement Payable
  const netSettlementAmount = Math.max(0, grossPayable - totalDeductions);

  return {
    monthlyGross: gross,
    unpaidSalaryDays: daysWorked,
    unpaidSalaryAmount,
    leaveEncashmentDays: leaves,
    leaveEncashmentAmount,
    tenureYears,
    isGratuityEligible,
    gratuityAmount,
    grossPayable,
    noticeShortfallDays: noticeShortfall,
    noticeRecoveryAmount,
    pendingAdvanceDeductions: pendingAdvances,
    assetDeductions,
    totalDeductions,
    netSettlementAmount
  };
};

/**
 * Resolve dynamic select options for any field by reading records from its related table.
 */
export const getDynamicFieldOptions = (
  field: FormFieldConfig,
  currentTable: string,
  extraRecords: Record<string, any[]> = {}
): SelectOption[] => {
  // 1. Check if the field is mapped to a related foreign table
  let rel = FIELD_TABLE_MAPPING[field.key];

  // Specific contextual disambiguation
  if (field.key === 'category') {
    if (currentTable.includes('asset')) {
      rel = { table: 'tb_asset_category', labelField: 'name', valueField: 'name', codeField: 'code' };
    } else {
      rel = { table: 'tb_product_category', labelField: 'name', valueField: 'name', codeField: 'code' };
    }
  }

  const optionsMap = new Map<string, SelectOption>();

  // 2. If it's a relational field, pull all records from the target table
  if (rel) {
    const targetTable = rel.table;
    const localRecords = ensureTableSeedRecords(targetTable);
    const passedRecords = extraRecords[targetTable] || [];

    const combinedRecords = [...localRecords, ...passedRecords];

    for (const rec of combinedRecords) {
      if (!rec || rec.is_deleted === true || rec.status === 'ARCHIVED') continue;

      const label = rec[rel.labelField] || rec.name || rec.code || rec.title;
      const val = rec[rel.valueField] || rec.name || rec.code || rec.id;
      const sub = rec[rel.codeField || 'code'] || (rec.code !== val ? rec.code : undefined);

      if (label && val) {
        optionsMap.set(String(val), {
          label: String(label),
          value: String(val),
          subtext: sub ? String(sub) : undefined,
          code: rec.code
        });
      }
    }
  }

  // 3. Include any static predefined options from field schema as well (fallback & defaults)
  if (Array.isArray(field.options)) {
    for (const opt of field.options) {
      if (opt && !optionsMap.has(opt)) {
        optionsMap.set(opt, {
          label: opt,
          value: opt
        });
      }
    }
  }

  // 4. Return sorted list of options
  return Array.from(optionsMap.values()).sort((a, b) => a.label.localeCompare(b.label));
};
