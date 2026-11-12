// Auto-generated catalogue schemas for all 97 tables across 19 ERP modules
export interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

export const TABLE_SCHEMAS: Record<string, FormFieldConfig[]> = {
  "tb_company": [
    {
      "key": "name",
      "label": "Company Legal Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Apex Global Industries Ltd"
    },
    {
      "key": "code",
      "label": "Company Identifier Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. APEX-HQ-01"
    },
    {
      "key": "legal_name",
      "label": "Trade / Registration Name",
      "type": "text",
      "placeholder": "e.g. Apex Technologies Pvt Ltd"
    },
    {
      "key": "gstin",
      "label": "GSTIN / Statutory Tax ID",
      "type": "text",
      "placeholder": "e.g. 33AAAAA0000A1Z5"
    },
    {
      "key": "currency_code",
      "label": "Base Operational Currency",
      "type": "select",
      "options": [
        "INR",
        "USD",
        "EUR",
        "GBP",
        "AED",
        "SGD"
      ],
      "defaultValue": "INR"
    },
    {
      "key": "email",
      "label": "Corporate Contact Email",
      "type": "email",
      "placeholder": "contact@company.com"
    },
    {
      "key": "phone",
      "label": "Corporate Phone",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "city",
      "label": "Registered City / State",
      "type": "text",
      "placeholder": "e.g. Chennai, Tamil Nadu"
    },
    {
      "key": "description",
      "label": "Headquarters Address & Details",
      "type": "textarea",
      "placeholder": "Registered corporate office location..."
    }
  ],
  "tb_company_branch": [
    {
      "key": "name",
      "label": "Branch / Plant Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Chennai Central Plant & Warehouse"
    },
    {
      "key": "code",
      "label": "Branch Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CHN-PLANT-01"
    },
    {
      "key": "city",
      "label": "City / Region",
      "type": "text",
      "placeholder": "e.g. Chennai, Tamil Nadu"
    },
    {
      "key": "manager_name",
      "label": "Branch Head / Manager",
      "type": "text",
      "placeholder": "e.g. Rajesh Sharma"
    },
    {
      "key": "phone",
      "label": "Branch Contact Phone",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "description",
      "label": "Branch Operational Notes",
      "type": "textarea",
      "placeholder": "Warehouse capacity, production lines..."
    }
  ],
  "tb_company_address": [
    {
      "key": "name",
      "label": "Address Label / Premise",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Plant 1 Shipping Dock"
    },
    {
      "key": "code",
      "label": "Address Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. ADDR-CHN-01"
    },
    {
      "key": "address_line1",
      "label": "Premises / Building / Street",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 104, Industrial Estate 4th Cross"
    },
    {
      "key": "city",
      "label": "City / Town",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Chennai"
    },
    {
      "key": "state",
      "label": "State / Province",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Tamil Nadu"
    },
    {
      "key": "postal_code",
      "label": "Postal PIN Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 600058"
    },
    {
      "key": "country",
      "label": "Country",
      "type": "select",
      "options": [
        "India",
        "United States",
        "United Kingdom",
        "UAE",
        "Singapore",
        "Germany"
      ],
      "defaultValue": "India"
    },
    {
      "key": "description",
      "label": "Landmark / Dispatch Notes",
      "type": "textarea",
      "placeholder": "Near Ambattur Industrial Estate Gate 2"
    }
  ],
  "tb_company_registration": [
    {
      "key": "name",
      "label": "Registration Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Central GST Registration"
    },
    {
      "key": "code",
      "label": "Certificate Reference Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. REG-GST-2026"
    },
    {
      "key": "registration_type",
      "label": "Registration Category",
      "type": "select",
      "options": [
        "GSTIN",
        "PAN",
        "CIN",
        "MSME / Udyam",
        "Factory Licence",
        "Import Export Code (IEC)",
        "Pollution Control"
      ],
      "defaultValue": "GSTIN"
    },
    {
      "key": "gstin",
      "label": "Registration / Tax Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 33AAAAA0000A1Z5"
    },
    {
      "key": "issuing_authority",
      "label": "Issuing Statutory Body",
      "type": "text",
      "placeholder": "e.g. Ministry of Finance, Govt of India"
    },
    {
      "key": "date",
      "label": "Date of Issue / Grant",
      "type": "date"
    },
    {
      "key": "expiry_date",
      "label": "Validity / Expiry Date",
      "type": "date"
    },
    {
      "key": "description",
      "label": "Statutory Endorsement & Notes",
      "type": "textarea",
      "placeholder": "Registered HSN/SAC codes endorsed..."
    }
  ],
  "tb_company_financial_year": [
    {
      "key": "name",
      "label": "Financial Year Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. FY 2026-2027"
    },
    {
      "key": "code",
      "label": "FY Identifier Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. FY-2026-27"
    },
    {
      "key": "start_date",
      "label": "Fiscal Start Date",
      "type": "date",
      "required": true
    },
    {
      "key": "end_date",
      "label": "Fiscal Close Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Fiscal Period Status",
      "type": "select",
      "options": [
        "ACTIVE_OPEN",
        "AUDIT_IN_PROGRESS",
        "CLOSED_ARCHIVED"
      ],
      "defaultValue": "ACTIVE_OPEN"
    },
    {
      "key": "description",
      "label": "Auditor & Accounting Policies",
      "type": "textarea",
      "placeholder": "Statutory auditor: M/s Raman & Associates..."
    }
  ],
  "tb_company_settings": [
    {
      "key": "name",
      "label": "Setting Parameter Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Auto-Invoice Sequential Numbering"
    },
    {
      "key": "code",
      "label": "Parameter Key Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CFG-INV-SEQ"
    },
    {
      "key": "category",
      "label": "Module Category",
      "type": "select",
      "options": [
        "Finance & Accounting",
        "Tax & Compliance",
        "Inventory & Barcode",
        "HR & Payroll",
        "Security & Audit"
      ],
      "defaultValue": "Finance & Accounting"
    },
    {
      "key": "setting_value",
      "label": "Parameter Value",
      "type": "text",
      "required": true,
      "placeholder": "e.g. INV-{YYYY}-{0000}"
    },
    {
      "key": "status",
      "label": "Enforcement Status",
      "type": "select",
      "options": [
        "ENABLED",
        "DISABLED"
      ],
      "defaultValue": "ENABLED"
    },
    {
      "key": "description",
      "label": "Policy Rationale & Documentation",
      "type": "textarea",
      "placeholder": "Applies prefix INV with fiscal year..."
    }
  ],
  "tb_user": [
    {
      "key": "name",
      "label": "User Full Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Rajesh Sharma"
    },
    {
      "key": "code",
      "label": "Username",
      "type": "text",
      "required": true,
      "placeholder": "e.g. admin"
    },
    {
      "key": "email",
      "label": "Corporate Work Email",
      "type": "email",
      "required": true,
      "placeholder": "admin@company.com"
    },
    {
      "key": "phone",
      "label": "Mobile Phone Number",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "user_type",
      "label": "Access Role",
      "type": "select",
      "options": [
        "OWNER",
        "ADMIN",
        "MANAGER",
        "USER",
        "AUDITOR"
      ],
      "defaultValue": "OWNER"
    },
    {
      "key": "status",
      "label": "Account Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "DISABLED",
        "LOCKED"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Assigned Department & Modules",
      "type": "textarea",
      "placeholder": "Full ERP access..."
    }
  ],
  "tb_role": [
    {
      "key": "name",
      "label": "Role Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Finance Operations Head"
    },
    {
      "key": "code",
      "label": "Role Identifier Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. ROLE-FIN-HEAD"
    },
    {
      "key": "department",
      "label": "Department Assignment",
      "type": "select",
      "options": [
        "Finance & Accounts",
        "Operations & Plants",
        "Human Resources",
        "Supply Chain",
        "Sales & Marketing",
        "IT & Security"
      ],
      "defaultValue": "Finance & Accounts"
    },
    {
      "key": "permission_level",
      "label": "Access Level",
      "type": "select",
      "options": [
        "SUPER_ADMIN",
        "DEPARTMENT_HEAD",
        "MANAGER",
        "OPERATOR",
        "AUDITOR_READONLY"
      ],
      "defaultValue": "MANAGER"
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "INACTIVE"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Role Responsibilities & Scopes",
      "type": "textarea",
      "placeholder": "Authorizations for voucher signing and PO approvals..."
    }
  ],
  "tb_permission": [
    {
      "key": "name",
      "label": "Permission Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Sales Orders Full Access & Approval"
    },
    {
      "key": "code",
      "label": "Permission Key Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PERM-SALES-OPS"
    },
    {
      "key": "role",
      "label": "Assigned Access Role",
      "type": "select",
      "options": [
        "ALL",
        "OWNER",
        "ADMIN",
        "ROLE-FIN-HEAD",
        "ROLE-OPS-MGR",
        "ROLE-HR-MGR",
        "ROLE-SALES-EXEC",
        "ROLE-AUDITOR-RO",
        "MANAGER",
        "USER"
      ],
      "defaultValue": "ADMIN"
    },
    {
      "key": "user_email",
      "label": "Assigned User Email",
      "type": "text",
      "placeholder": "e.g. ALL or user@company.com",
      "defaultValue": "ALL"
    },
    {
      "key": "module_name",
      "label": "Target ERP Menu / Module",
      "type": "select",
      "options": [
        "all",
        "company",
        "subscriptions",
        "admin",
        "products",
        "hr",
        "crm",
        "land-building",
        "assets",
        "purchase",
        "inventory",
        "sales",
        "attendance",
        "production",
        "portal",
        "banking",
        "payroll",
        "compliance",
        "statutory",
        "investment",
        "reports",
        "history"
      ],
      "defaultValue": "sales"
    },
    {
      "key": "actions",
      "label": "Permitted Actions Scope",
      "type": "select",
      "options": [
        "VIEW,CREATE,UPDATE,DELETE,APPROVE",
        "VIEW,CREATE,UPDATE,APPROVE",
        "VIEW,CREATE,UPDATE",
        "VIEW,APPROVE",
        "VIEW_ONLY",
        "NO_ACCESS"
      ],
      "defaultValue": "VIEW,CREATE,UPDATE,APPROVE"
    },
    {
      "key": "can_view",
      "label": "Show In Menu & Allow View",
      "type": "select",
      "options": ["YES", "NO"],
      "defaultValue": "YES"
    },
    {
      "key": "can_create",
      "label": "Allow Create Records",
      "type": "select",
      "options": ["YES", "NO"],
      "defaultValue": "YES"
    },
    {
      "key": "can_update",
      "label": "Allow Update / Edit Records",
      "type": "select",
      "options": ["YES", "NO"],
      "defaultValue": "YES"
    },
    {
      "key": "can_delete",
      "label": "Allow Delete / Archive Records",
      "type": "select",
      "options": ["YES", "NO"],
      "defaultValue": "NO"
    },
    {
      "key": "can_approve",
      "label": "Allow Approval Authority",
      "type": "select",
      "options": ["YES", "NO"],
      "defaultValue": "NO"
    },
    {
      "key": "status",
      "label": "Permission Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "INACTIVE"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Access Control Boundary Details",
      "type": "textarea",
      "placeholder": "Grants signing rights on transactions above INR 100,000..."
    }
  ],
  "tb_approval_workflow": [
    {
      "key": "name",
      "label": "Workflow Route Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. High-Value PO Approval Matrix"
    },
    {
      "key": "code",
      "label": "Workflow Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. WF-PO-HIGH"
    },
    {
      "key": "module_name",
      "label": "ERP Functional Module",
      "type": "select",
      "options": [
        "purchase",
        "sales",
        "banking",
        "inventory",
        "payroll"
      ],
      "defaultValue": "purchase"
    },
    {
      "key": "approver_role",
      "label": "Designated Approver Role",
      "type": "select",
      "options": [
        "Managing Director / Owner",
        "Finance Head",
        "Plant Manager",
        "Department HOD"
      ],
      "defaultValue": "Managing Director / Owner"
    },
    {
      "key": "amount",
      "label": "Approval Threshold Limit (INR)",
      "type": "number",
      "placeholder": "e.g. 500000.00"
    },
    {
      "key": "status",
      "label": "Workflow Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "INACTIVE"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Escalation & SLA Guidelines",
      "type": "textarea",
      "placeholder": "24-hour auto-escalation to Platform Owner..."
    }
  ],
  "tb_login_history": [
    {
      "key": "name",
      "label": "User Full Name / Login",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Alex Morgan"
    },
    {
      "key": "code",
      "label": "Session Reference ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SES-2026-9021"
    },
    {
      "key": "user_email",
      "label": "Corporate Email Address",
      "type": "email",
      "placeholder": "name@company.com"
    },
    {
      "key": "role",
      "label": "Access Role",
      "type": "text",
      "placeholder": "e.g. Platform Super Owner"
    },
    {
      "key": "action",
      "label": "Authentication Event",
      "type": "text",
      "placeholder": "e.g. SIGN_IN_PASSWORD"
    },
    {
      "key": "ip_address",
      "label": "Client IPv4 / IPv6 Address",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 49.207.214.18"
    },
    {
      "key": "user_agent",
      "label": "Browser & Operating System",
      "type": "text",
      "placeholder": "e.g. Chrome 130 on Windows 11"
    },
    {
      "key": "status",
      "label": "Authentication Result",
      "type": "select",
      "options": [
        "SUCCESS_AUTHENTICATED",
        "FAILED_BAD_CREDENTIALS",
        "LOCKED_OUT"
      ],
      "defaultValue": "SUCCESS_AUTHENTICATED"
    },
    {
      "key": "description",
      "label": "Security Geolocation Notes",
      "type": "textarea",
      "placeholder": "Corporate office VPN connection verified..."
    }
  ],
  "tb_product_master": [
    {
      "key": "name",
      "label": "Product / Material Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Stainless Steel Rod 12mm"
    },
    {
      "key": "code",
      "label": "SKU / Part Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-SSR-12"
    },
    {
      "key": "category",
      "label": "Product Category",
      "type": "select",
      "options": [
        "Raw Materials",
        "Finished Goods",
        "Sub-Assemblies",
        "Consumables",
        "Packaging"
      ],
      "defaultValue": "Raw Materials"
    },
    {
      "key": "uom",
      "label": "Unit of Measure (UOM)",
      "type": "select",
      "options": [
        "PCS",
        "KG",
        "MTR",
        "LTR",
        "BOX",
        "NOS",
        "TON"
      ],
      "defaultValue": "PCS"
    },
    {
      "key": "amount",
      "label": "Unit Selling Price (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 1250.00"
    },
    {
      "key": "gst_rate",
      "label": "Statutory GST Rate",
      "type": "select",
      "options": [
        "0%",
        "5%",
        "12%",
        "18%",
        "28%"
      ],
      "defaultValue": "18%"
    },
    {
      "key": "reorder_level",
      "label": "Min Safety Reorder Level",
      "type": "number",
      "placeholder": "e.g. 50"
    },
    {
      "key": "description",
      "label": "Technical Specifications",
      "type": "textarea",
      "placeholder": "Material grade, tolerance, storage specs..."
    }
  ],
  "tb_product_category": [
    {
      "key": "name",
      "label": "Category Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Industrial Fasteners & Bolts"
    },
    {
      "key": "code",
      "label": "Category Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CAT-FAST-01"
    },
    {
      "key": "hsn_code",
      "label": "Statutory HSN Code",
      "type": "text",
      "placeholder": "e.g. 7318"
    },
    {
      "key": "gst_rate",
      "label": "Standard GST Slab",
      "type": "select",
      "options": [
        "0%",
        "5%",
        "12%",
        "18%",
        "28%"
      ],
      "defaultValue": "18%"
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "INACTIVE"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Category Hierarchy & Description",
      "type": "textarea",
      "placeholder": "Specifications for procurement and inventory classification..."
    }
  ],
  "tb_product_variant": [
    {
      "key": "name",
      "label": "Variant Title / Specification",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SS Rod 12mm - Grade 316 Polished"
    },
    {
      "key": "code",
      "label": "Variant SKU Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. VAR-SSR12-G316"
    },
    {
      "key": "product_id",
      "label": "Parent Base Product SKU",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-SSR-12"
    },
    {
      "key": "color",
      "label": "Finish / Color / Spec",
      "type": "text",
      "placeholder": "e.g. Bright Mirror Finish"
    },
    {
      "key": "size",
      "label": "Dimensions / Gauge",
      "type": "text",
      "placeholder": "e.g. 12mm x 3000mm"
    },
    {
      "key": "amount",
      "label": "Variant Price Premium (INR)",
      "type": "number",
      "placeholder": "e.g. 1450.00"
    },
    {
      "key": "description",
      "label": "Engineering Tolerances",
      "type": "textarea",
      "placeholder": "Tested to ASTM A276 standard..."
    }
  ],
  "tb_product_unit": [
    {
      "key": "name",
      "label": "Unit Full Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Metric Kilogram"
    },
    {
      "key": "code",
      "label": "UOM Standard Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. UOM-KG"
    },
    {
      "key": "symbol",
      "label": "Display Symbol",
      "type": "text",
      "required": true,
      "placeholder": "e.g. KG"
    },
    {
      "key": "conversion_factor",
      "label": "Base Conversion Factor",
      "type": "number",
      "defaultValue": "1",
      "placeholder": "e.g. 1.00"
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "INACTIVE"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "GST Statutory UQC Mapping",
      "type": "textarea",
      "placeholder": "Indian GST UQC: KGS..."
    }
  ],
  "tb_product_price": [
    {
      "key": "name",
      "label": "Price Matrix Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Wholesale Tier-1 Pricing"
    },
    {
      "key": "code",
      "label": "Price List Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PRC-WHL-01"
    },
    {
      "key": "product_code",
      "label": "Applicable SKU / Item",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-SSR-12"
    },
    {
      "key": "currency_code",
      "label": "Currency",
      "type": "select",
      "options": [
        "INR",
        "USD",
        "EUR"
      ],
      "defaultValue": "INR"
    },
    {
      "key": "amount",
      "label": "Tier Unit Price (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 1180.00"
    },
    {
      "key": "min_quantity",
      "label": "Minimum Batch Quantity",
      "type": "number",
      "defaultValue": "100",
      "placeholder": "e.g. 100"
    },
    {
      "key": "description",
      "label": "Discount Conditions & Validity",
      "type": "textarea",
      "placeholder": "Valid for advance purchase orders above 100 units..."
    }
  ],
  "tb_product_batch": [
    {
      "key": "name",
      "label": "Batch Lot Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Heat Run Batch #2026-B81"
    },
    {
      "key": "code",
      "label": "Batch Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. BAT-2026-081"
    },
    {
      "key": "product_code",
      "label": "Item SKU Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-SSR-12"
    },
    {
      "key": "quantity",
      "label": "Batch Quantity Available",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 500"
    },
    {
      "key": "date",
      "label": "Manufacturing Date",
      "type": "date",
      "required": true
    },
    {
      "key": "expiry_date",
      "label": "Expiry / Retest Date",
      "type": "date"
    },
    {
      "key": "description",
      "label": "Mill Test Certificate (MTC) Notes",
      "type": "textarea",
      "placeholder": "MTC #MTC-9921 certified chemistry & tensile strength..."
    }
  ],
  "tb_employee_master": [
    {
      "key": "name",
      "label": "Employee Full Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Anand Venkatesh"
    },
    {
      "key": "code",
      "label": "Employee ID Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-006"
    },
    {
      "key": "department",
      "label": "Department",
      "type": "select",
      "options": [
        "Engineering & Production",
        "Operations & Plant Maintenance",
        "Accounts & Financial Control",
        "Human Resources & Talent",
        "Quality Assurance & ISO Compliance",
        "Supply Chain & Procurement",
        "Sales & Client Relations",
        "Information Technology & Security"
      ],
      "defaultValue": "Engineering & Production"
    },
    {
      "key": "designation",
      "label": "Job Title / Role",
      "type": "select",
      "required": true,
      "placeholder": "e.g. Senior Production Engineer",
      "options": [
        "Senior Production Engineer",
        "Operations Plant Manager",
        "Quality Assurance Lead",
        "Senior Accounts Executive",
        "HR Business Partner",
        "Supply Chain Specialist",
        "Principal Enterprise Architect",
        "Maintenance Technician"
      ],
      "defaultValue": "Senior Production Engineer"
    },
    {
      "key": "email",
      "label": "Work Email (Used for Login)",
      "type": "email",
      "required": true,
      "placeholder": "anand.v@company.com"
    },
    {
      "key": "phone",
      "label": "Work Phone / Mobile",
      "type": "tel",
      "required": true,
      "placeholder": "9876543210"
    },
    {
      "key": "aadhaar",
      "label": "Aadhaar Number (12 Digits)",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 542189031245"
    },
    {
      "key": "pan",
      "label": "PAN Card Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. ABCDE1234F"
    },
    {
      "key": "driving_licence",
      "label": "Licence / Passport / Govt ID",
      "type": "text",
      "placeholder": "e.g. DL-0420110098231"
    },
    {
      "key": "dob",
      "label": "Date of Birth",
      "type": "date"
    },
    {
      "key": "gender",
      "label": "Gender",
      "type": "select",
      "options": ["Male", "Female", "Other"],
      "defaultValue": "Male"
    },
    {
      "key": "blood_group",
      "label": "Blood Group",
      "type": "select",
      "options": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      "defaultValue": "O+"
    },
    {
      "key": "personal_email",
      "label": "Personal Email",
      "type": "email",
      "placeholder": "anand.personal@gmail.com"
    },
    {
      "key": "personal_phone",
      "label": "Personal Mobile Number",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "permanent_address",
      "label": "Permanent Residential Address",
      "type": "textarea",
      "placeholder": "Flat / House No, Street, Landmark"
    },
    {
      "key": "permanent_city",
      "label": "Permanent City",
      "type": "text",
      "placeholder": "e.g. Chennai"
    },
    {
      "key": "permanent_pincode",
      "label": "Permanent PIN Code",
      "type": "text",
      "placeholder": "e.g. 600028"
    },
    {
      "key": "current_address",
      "label": "Current / Temporary Address",
      "type": "textarea",
      "placeholder": "Current local address if different from permanent"
    },
    {
      "key": "current_city",
      "label": "Current City",
      "type": "text",
      "placeholder": "e.g. Chennai"
    },
    {
      "key": "nominee_name",
      "label": "Nominee / Family Member Name",
      "type": "text",
      "placeholder": "e.g. Meena Anand"
    },
    {
      "key": "nominee_relation",
      "label": "Nominee Relationship",
      "type": "select",
      "options": ["Spouse", "Father", "Mother", "Son", "Daughter", "Brother", "Sister"],
      "defaultValue": "Spouse"
    },
    {
      "key": "nominee_phone",
      "label": "Nominee Mobile Contact",
      "type": "tel",
      "placeholder": "9876543219"
    },
    {
      "key": "pf_uan",
      "label": "EPF Universal Account No (UAN)",
      "type": "text",
      "placeholder": "e.g. 100924810294"
    },
    {
      "key": "esi_number",
      "label": "ESI IP Insurance Number",
      "type": "text",
      "placeholder": "e.g. 31092847102938471"
    },
    {
      "key": "highest_qualification",
      "label": "Highest Education Qualification",
      "type": "select",
      "options": [
        "B.E. / B.Tech",
        "M.E. / M.Tech",
        "MBA / PGDM",
        "MCA / M.Sc",
        "B.Com / M.Com",
        "Polytechnic Diploma",
        "ITI Certificate",
        "Ph.D / Doctorate"
      ],
      "defaultValue": "B.E. / B.Tech"
    },
    {
      "key": "institution",
      "label": "College / University Name",
      "type": "text",
      "placeholder": "e.g. College of Engineering Guindy"
    },
    {
      "key": "total_experience_years",
      "label": "Prior Work Experience (Years)",
      "type": "number",
      "placeholder": "e.g. 5"
    },
    {
      "key": "previous_company",
      "label": "Immediate Previous Employer",
      "type": "text",
      "placeholder": "e.g. Larsen & Toubro Ltd"
    },
    {
      "key": "bank_account",
      "label": "Salary Bank Account Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 50100294827103"
    },
    {
      "key": "ifsc",
      "label": "Bank IFSC Code (Auto-fills Bank)",
      "type": "text",
      "required": true,
      "placeholder": "e.g. HDFC0000240"
    },
    {
      "key": "bank_name",
      "label": "Bank Name (Auto-Filled from IFSC)",
      "type": "text",
      "placeholder": "Auto-filled from IFSC"
    },
    {
      "key": "bank_branch",
      "label": "Bank Branch Location",
      "type": "text",
      "placeholder": "Auto-filled from IFSC"
    },
    {
      "key": "amount",
      "label": "Monthly Gross CTC (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 75000.00"
    },
    {
      "key": "basic_salary",
      "label": "Basic Salary (50% Auto-Calculated)",
      "type": "number",
      "placeholder": "e.g. 37500.00"
    },
    {
      "key": "hra",
      "label": "House Rent Allowance (HRA 20%)",
      "type": "number",
      "placeholder": "e.g. 15000.00"
    },
    {
      "key": "da",
      "label": "Dearness Allowance (DA 15%)",
      "type": "number",
      "placeholder": "e.g. 11250.00"
    },
    {
      "key": "special_allowance",
      "label": "Special Allowance (15%)",
      "type": "number",
      "placeholder": "e.g. 11250.00"
    },
    {
      "key": "net_salary",
      "label": "Net Take-Home Monthly Salary",
      "type": "number",
      "placeholder": "e.g. 69938.00"
    },
    {
      "key": "date",
      "label": "Date of Joining",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Emergency Contact & Special Notes",
      "type": "textarea",
      "placeholder": "Allergies, emergency contact numbers, special skills..."
    }
  ],
  "tb_department": [
    {
      "key": "name",
      "label": "Department Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Quality Assurance & Testing"
    },
    {
      "key": "code",
      "label": "Department Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. DEPT-QA-01"
    },
    {
      "key": "head_name",
      "label": "Head of Department (HOD)",
      "type": "text",
      "placeholder": "e.g. Ramesh Kumar"
    },
    {
      "key": "cost_center",
      "label": "Cost Center Code",
      "type": "text",
      "placeholder": "e.g. CC-104"
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "INACTIVE"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Operational Scope",
      "type": "textarea",
      "placeholder": "Plant quality inspection and ISO audit functions..."
    }
  ],
  "tb_designation": [
    {
      "key": "name",
      "label": "Designation Job Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Principal Systems Architect"
    },
    {
      "key": "code",
      "label": "Designation Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. DESG-ARCH-01"
    },
    {
      "key": "grade",
      "label": "Salary Grade Band",
      "type": "select",
      "options": [
        "Band E1 (Executive)",
        "Band M1 (Management)",
        "Band D1 (Director)",
        "Band T1 (Technical)",
        "Band O1 (Operator)"
      ],
      "defaultValue": "Band M1 (Management)"
    },
    {
      "key": "amount",
      "label": "Designation Benchmark CTC (INR)",
      "type": "number",
      "placeholder": "e.g. 1800000.00"
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "INACTIVE"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Key Performance Areas (KPAs)",
      "type": "textarea",
      "placeholder": "Architectural leadership and engineering compliance..."
    }
  ],
  "tb_employee_salary": [
    {
      "key": "name",
      "label": "Salary Structure Profile",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Senior Tech Grade Band CTC"
    },
    {
      "key": "code",
      "label": "Structure Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SAL-STR-042"
    },
    {
      "key": "employee_code",
      "label": "Employee ID Reference",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-042"
    },
    {
      "key": "basic_salary",
      "label": "Basic Pay Component (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 50000.00"
    },
    {
      "key": "hra",
      "label": "House Rent Allowance (HRA)",
      "type": "number",
      "placeholder": "e.g. 25000.00"
    },
    {
      "key": "amount",
      "label": "Monthly Gross CTC (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 100000.00"
    },
    {
      "key": "description",
      "label": "Variable Pay & Deductions",
      "type": "textarea",
      "placeholder": "Annual performance bonus 10%, PF & ESI statutory deductions..."
    }
  ],
  "tb_employee_bank": [
    {
      "key": "name",
      "label": "Beneficiary Account Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Anand Venkatesh"
    },
    {
      "key": "code",
      "label": "Bank Profile Ref Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. BNK-EMP-042"
    },
    {
      "key": "employee_code",
      "label": "Employee ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-042"
    },
    {
      "key": "bank_name",
      "label": "Financial Institution Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. HDFC Bank Ltd"
    },
    {
      "key": "account_number",
      "label": "Bank Account Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 50100294827103"
    },
    {
      "key": "ifsc_code",
      "label": "Bank IFSC Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. HDFC0001234"
    },
    {
      "key": "branch_name",
      "label": "Bank Branch Location",
      "type": "text",
      "placeholder": "e.g. Anna Nagar Branch, Chennai"
    },
    {
      "key": "description",
      "label": "Salary Disbursement Mandate",
      "type": "textarea",
      "placeholder": "Primary direct-deposit salary credit account..."
    }
  ],
  "tb_customer_master": [
    {
      "key": "name",
      "label": "Customer / Business Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Tata Motors Engineering Ltd"
    },
    {
      "key": "code",
      "label": "Customer Account Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CUST-TM-001"
    },
    {
      "key": "contact_person",
      "label": "Primary Contact Person",
      "type": "text",
      "placeholder": "e.g. Ramesh Kumar"
    },
    {
      "key": "email",
      "label": "Billing Email Address",
      "type": "email",
      "placeholder": "accounts@tatamotors.com"
    },
    {
      "key": "phone",
      "label": "Contact Phone Number",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "gstin",
      "label": "Customer GSTIN",
      "type": "text",
      "placeholder": "e.g. 27AAACT2727Q1ZW"
    },
    {
      "key": "pan",
      "label": "Customer PAN Number",
      "type": "text",
      "placeholder": "e.g. AAACT2727Q"
    },
    {
      "key": "amount",
      "label": "Approved Credit Limit (INR)",
      "type": "number",
      "placeholder": "e.g. 1000000"
    },
    {
      "key": "city",
      "label": "City / State",
      "type": "text",
      "placeholder": "e.g. Pune, Maharashtra"
    },
    {
      "key": "description",
      "label": "Billing Address & Terms",
      "type": "textarea",
      "placeholder": "Registered delivery address..."
    }
  ],
  "tb_supplier_master": [
    {
      "key": "name",
      "label": "Supplier / Vendor Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Jindal Steel & Power Ltd"
    },
    {
      "key": "code",
      "label": "Vendor Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. VEND-JS-01"
    },
    {
      "key": "contact_person",
      "label": "Vendor Representative",
      "type": "text",
      "placeholder": "e.g. Suresh Patel"
    },
    {
      "key": "email",
      "label": "Vendor Email",
      "type": "email",
      "placeholder": "sales@jindalsteel.com"
    },
    {
      "key": "phone",
      "label": "Contact Mobile",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "gstin",
      "label": "Vendor GSTIN",
      "type": "text",
      "placeholder": "e.g. 06AAACJ0123P1Z1"
    },
    {
      "key": "pan",
      "label": "Vendor PAN Number",
      "type": "text",
      "placeholder": "e.g. AAACJ0123P"
    },
    {
      "key": "payment_terms",
      "label": "Payment Terms",
      "type": "select",
      "options": [
        "Immediate",
        "Net 15 Days",
        "Net 30 Days",
        "Net 60 Days",
        "100% Advance"
      ],
      "defaultValue": "Net 30 Days"
    },
    {
      "key": "description",
      "label": "Warehouse / Factory Address",
      "type": "textarea",
      "placeholder": "Supplier factory location..."
    }
  ],
  "tb_customer_contact": [
    {
      "key": "name",
      "label": "Contact Person Full Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Deepak Sundaram"
    },
    {
      "key": "code",
      "label": "Contact Ref Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CONT-CUST-089"
    },
    {
      "key": "customer_code",
      "label": "Customer Account Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CUST-TM-001"
    },
    {
      "key": "designation",
      "label": "Designation / Department",
      "type": "select",
      "placeholder": "e.g. Procurement Head",
      "options": [
        "Procurement Head",
        "Key Accounts Manager",
        "General Manager",
        "Commercial Director",
        "Purchase Executive"
      ]
    },
    {
      "key": "email",
      "label": "Official Business Email",
      "type": "email",
      "placeholder": "deepak@tatamotors.com"
    },
    {
      "key": "phone",
      "label": "Direct Mobile Phone",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "description",
      "label": "Escalation & Communication Notes",
      "type": "textarea",
      "placeholder": "Primary point of contact for PO approvals..."
    }
  ],
  "tb_supplier_contact": [
    {
      "key": "name",
      "label": "Vendor Executive Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Rajesh Khurana"
    },
    {
      "key": "code",
      "label": "Supplier Contact Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CONT-VEND-012"
    },
    {
      "key": "supplier_code",
      "label": "Supplier Vendor Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. VEND-JS-01"
    },
    {
      "key": "designation",
      "label": "Designation / Role",
      "type": "select",
      "placeholder": "e.g. Regional Key Accounts Manager",
      "options": [
        "Regional Key Accounts Manager",
        "Technical Sales Lead",
        "Commercial Director",
        "Logistics Coordinator",
        "Managing Director"
      ]
    },
    {
      "key": "email",
      "label": "Direct Corporate Email",
      "type": "email",
      "placeholder": "r.khurana@jindalsteel.com"
    },
    {
      "key": "phone",
      "label": "Mobile Contact",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "description",
      "label": "Dispatch Liaison Details",
      "type": "textarea",
      "placeholder": "Liaison for dispatch tracking and e-way bill coordination..."
    }
  ],
  "tb_property_master": [
    {
      "key": "name",
      "label": "Property / Land Asset Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Ambattur Industrial Plot 4B"
    },
    {
      "key": "code",
      "label": "Asset Reference Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PROP-AMB-04B"
    },
    {
      "key": "property_type",
      "label": "Property Classification",
      "type": "select",
      "options": [
        "Freehold Industrial Land",
        "Commercial Office Space",
        "Factory Shed & Plant",
        "Warehouse Facility",
        "Leasehold Plot"
      ],
      "defaultValue": "Factory Shed & Plant"
    },
    {
      "key": "amount",
      "label": "Book Value / Valuation (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 85000000.00"
    },
    {
      "key": "survey_no",
      "label": "Survey / Patta Number",
      "type": "text",
      "placeholder": "e.g. SF-142/2B"
    },
    {
      "key": "city",
      "label": "City & Location",
      "type": "text",
      "placeholder": "e.g. Chennai, Tamil Nadu"
    },
    {
      "key": "description",
      "label": "Title Deed & Legal Boundaries",
      "type": "textarea",
      "placeholder": "Deed registration details, boundary dimensions..."
    }
  ],
  "tb_construction_project": [
    {
      "key": "name",
      "label": "Construction Project Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Plant 2 Cold Forging Expansion Shed"
    },
    {
      "key": "code",
      "label": "Project Tracking Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PRJ-CNST-02"
    },
    {
      "key": "amount",
      "label": "Estimated Project Budget (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 45000000.00"
    },
    {
      "key": "start_date",
      "label": "Project Groundbreaking Date",
      "type": "date",
      "required": true
    },
    {
      "key": "end_date",
      "label": "Estimated Commissioning Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Civil Execution Status",
      "type": "select",
      "options": [
        "PLANNING",
        "IN_EXECUTION",
        "STRUCTURAL_COMPLETE",
        "FITOUT",
        "COMMISSIONED"
      ],
      "defaultValue": "IN_EXECUTION"
    },
    {
      "key": "description",
      "label": "Architect & Engineering Contractor",
      "type": "textarea",
      "placeholder": "Principal civil contractor: Larsen & Toubro Engineering..."
    }
  ],
  "tb_construction_phase": [
    {
      "key": "name",
      "label": "Milestone / Phase Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Phase 1 - Foundation & Piling"
    },
    {
      "key": "code",
      "label": "Phase Identifier Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PHS-PRJ02-01"
    },
    {
      "key": "project_code",
      "label": "Master Project Reference Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PRJ-CNST-02"
    },
    {
      "key": "start_date",
      "label": "Phase Start Date",
      "type": "date",
      "required": true
    },
    {
      "key": "end_date",
      "label": "Target Completion Date",
      "type": "date",
      "required": true
    },
    {
      "key": "progress_percentage",
      "label": "Civil Progress (%)",
      "type": "number",
      "defaultValue": "0",
      "placeholder": "e.g. 75"
    },
    {
      "key": "status",
      "label": "Milestone Status",
      "type": "select",
      "options": [
        "PENDING",
        "ON_TRACK",
        "DELAYED",
        "COMPLETED_INSPECTED"
      ],
      "defaultValue": "ON_TRACK"
    },
    {
      "key": "description",
      "label": "Soil Testing & Structural Audit Notes",
      "type": "textarea",
      "placeholder": "Certified soil test load bearing capacity: 250 kN/m2..."
    }
  ],
  "tb_construction_expense": [
    {
      "key": "name",
      "label": "Expense Disbursement Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Ready-Mix Concrete Pouring Lot #4"
    },
    {
      "key": "code",
      "label": "Expense Voucher Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EXP-CNST-019"
    },
    {
      "key": "project_code",
      "label": "Associated Project Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PRJ-CNST-02"
    },
    {
      "key": "vendor_name",
      "label": "Contractor / Vendor Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. UltraTech Cement ReadyMix Ltd"
    },
    {
      "key": "amount",
      "label": "Disbursement Amount (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 845000.00"
    },
    {
      "key": "date",
      "label": "Invoice / Payment Date",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Quality Audit Sign-Off Notes",
      "type": "textarea",
      "placeholder": "Cube test strength certified at 35 MPa after 28 days..."
    }
  ],
  "tb_asset_master": [
    {
      "key": "name",
      "label": "Capital Asset Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CNC 5-Axis Milling Machine"
    },
    {
      "key": "code",
      "label": "Asset Tag Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. AST-CNC-004"
    },
    {
      "key": "category",
      "label": "Asset Category",
      "type": "select",
      "options": [
        "Plant & Machinery",
        "Electrical & Utilities",
        "Heavy Vehicles",
        "IT Hardware & Servers",
        "Office Furniture"
      ],
      "defaultValue": "Plant & Machinery"
    },
    {
      "key": "amount",
      "label": "Purchase Capital Cost (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 4500000.00"
    },
    {
      "key": "serial_no",
      "label": "Manufacturer Serial No",
      "type": "text",
      "placeholder": "e.g. SN-HAAS-2026-99"
    },
    {
      "key": "location",
      "label": "Factory Bay / Location",
      "type": "text",
      "placeholder": "e.g. Bay 3 - Precision Machining Wing"
    },
    {
      "key": "status",
      "label": "Asset Operational Status",
      "type": "select",
      "options": [
        "ACTIVE_RUNNING",
        "UNDER_MAINTENANCE",
        "IDLE",
        "SCRAPPED"
      ],
      "defaultValue": "ACTIVE_RUNNING"
    },
    {
      "key": "description",
      "label": "Maintenance Schedule & Warranty",
      "type": "textarea",
      "placeholder": "Annual AMC provider and warranty terms..."
    }
  ],
  "tb_asset_category": [
    {
      "key": "name",
      "label": "Asset Category Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CNC Precision Machining Centers"
    },
    {
      "key": "code",
      "label": "Category Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. AST-CAT-CNC"
    },
    {
      "key": "depreciation_rate",
      "label": "Statutory Depreciation Rate (%)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 15.00"
    },
    {
      "key": "depreciation_method",
      "label": "Depreciation Method",
      "type": "select",
      "options": [
        "Written Down Value (WDV)",
        "Straight Line Method (SLM)"
      ],
      "defaultValue": "Written Down Value (WDV)"
    },
    {
      "key": "status",
      "label": "Category Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "INACTIVE"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Statutory Companies Act Schedule II Guidance",
      "type": "textarea",
      "placeholder": "Useful life 15 years as per Companies Act 2013..."
    }
  ],
  "tb_asset_allocation": [
    {
      "key": "name",
      "label": "Allocation Record Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Tooling Setup Deployment to Bay 2"
    },
    {
      "key": "code",
      "label": "Allocation Reference Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. ALLOC-AST-052"
    },
    {
      "key": "asset_code",
      "label": "Capital Asset Tag Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. AST-CNC-004"
    },
    {
      "key": "employee_code",
      "label": "Custodian Employee ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-042"
    },
    {
      "key": "department",
      "label": "Department Wing",
      "type": "select",
      "options": [
        "Operations",
        "Engineering & Production",
        "Quality Assurance",
        "Supply Chain",
        "Tool Room"
      ],
      "defaultValue": "Engineering & Production"
    },
    {
      "key": "start_date",
      "label": "Handover / Allocation Date",
      "type": "date",
      "required": true
    },
    {
      "key": "end_date",
      "label": "Scheduled Return Date",
      "type": "date"
    },
    {
      "key": "description",
      "label": "Custody Sign-Off & Tool Condition",
      "type": "textarea",
      "placeholder": "All spindle accessories and tooling chucks verified..."
    }
  ],
  "tb_asset_warranty": [
    {
      "key": "name",
      "label": "OEM Warranty Contract Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Haas 3-Year Extended Comprehensive Warranty"
    },
    {
      "key": "code",
      "label": "Warranty Reference Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. WAR-HAAS-092"
    },
    {
      "key": "asset_code",
      "label": "Capital Asset Tag Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. AST-CNC-004"
    },
    {
      "key": "vendor_name",
      "label": "Warranty OEM / AMC Vendor",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Haas Automation India Pvt Ltd"
    },
    {
      "key": "start_date",
      "label": "Warranty Effective Date",
      "type": "date",
      "required": true
    },
    {
      "key": "end_date",
      "label": "Warranty Expiry Date",
      "type": "date",
      "required": true
    },
    {
      "key": "phone",
      "label": "AMC Emergency Service Helpline",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "description",
      "label": "Covered Components & SLA Terms",
      "type": "textarea",
      "placeholder": "Spindle motor, CNC controller PCB and axis ball screws covered..."
    }
  ],
  "tb_purchase_order": [
    {
      "key": "code",
      "label": "PO Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PO-2026-1049"
    },
    {
      "key": "name",
      "label": "Supplier / Vendor Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Bharat Heavy Metals Ltd"
    },
    {
      "key": "amount",
      "label": "Total PO Value (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 124000.00"
    },
    {
      "key": "date",
      "label": "Expected Delivery Date",
      "type": "date"
    },
    {
      "key": "status",
      "label": "Order Status",
      "type": "select",
      "options": [
        "DRAFT",
        "ISSUED_TO_VENDOR",
        "GOODS_RECEIVED",
        "CLOSED",
        "CANCELLED"
      ],
      "defaultValue": "ISSUED_TO_VENDOR"
    },
    {
      "key": "description",
      "label": "PO Delivery Instructions",
      "type": "textarea",
      "placeholder": "Dispatch gate pass instructions..."
    }
  ],
  "tb_purchase_request": [
    {
      "key": "name",
      "label": "Procurement Indent Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Urgent Carbide Inserts Reorder"
    },
    {
      "key": "code",
      "label": "Purchase Indent Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PR-2026-031"
    },
    {
      "key": "department",
      "label": "Requesting Department",
      "type": "select",
      "options": [
        "Engineering & Production",
        "Operations",
        "Quality Assurance",
        "Maintenance & Utilities"
      ],
      "defaultValue": "Engineering & Production"
    },
    {
      "key": "requested_by",
      "label": "Indent Creator Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Suresh Patel"
    },
    {
      "key": "amount",
      "label": "Estimated Indent Cost (INR)",
      "type": "number",
      "placeholder": "e.g. 48500.00"
    },
    {
      "key": "date",
      "label": "Target Delivery Needed By",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Indent Status",
      "type": "select",
      "options": [
        "PENDING_APPROVAL",
        "APPROVED_PO_PENDING",
        "PO_GENERATED",
        "REJECTED"
      ],
      "defaultValue": "PENDING_APPROVAL"
    },
    {
      "key": "description",
      "label": "Operational Justification",
      "type": "textarea",
      "placeholder": "Current stock below safety reorder threshold for Line 2..."
    }
  ],
  "tb_goods_receipt": [
    {
      "key": "name",
      "label": "Inward Consignment Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Steel Rod Inward Lot #881"
    },
    {
      "key": "code",
      "label": "Goods Receipt Note (GRN) No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GRN-2026-0442"
    },
    {
      "key": "po_number",
      "label": "Associated Purchase Order No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PO-2026-1049"
    },
    {
      "key": "supplier_name",
      "label": "Supplier Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Jindal Steel & Power Ltd"
    },
    {
      "key": "date",
      "label": "Gate Inward Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Inspection / QC Status",
      "type": "select",
      "options": [
        "PENDING_QC",
        "QC_ACCEPTED",
        "QC_REJECTED",
        "PARTIALLY_ACCEPTED"
      ],
      "defaultValue": "QC_ACCEPTED"
    },
    {
      "key": "description",
      "label": "QC Inspection Report & Heat Numbers",
      "type": "textarea",
      "placeholder": "Physical dimensions, surface finish and MTC verified OK..."
    }
  ],
  "tb_supplier_invoice": [
    {
      "key": "name",
      "label": "Supplier Invoice Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. JSPL Monthly Supply Invoice"
    },
    {
      "key": "code",
      "label": "Vendor Invoice Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. INV-JSPL-9921"
    },
    {
      "key": "po_number",
      "label": "Purchase Order Reference",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PO-2026-1049"
    },
    {
      "key": "supplier_name",
      "label": "Vendor Legal Entity Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Jindal Steel & Power Ltd"
    },
    {
      "key": "amount",
      "label": "Invoice Gross Value (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 146320.00"
    },
    {
      "key": "tax_amount",
      "label": "GST Tax Component (INR)",
      "type": "number",
      "placeholder": "e.g. 22320.00"
    },
    {
      "key": "date",
      "label": "Supplier Bill Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Accounts Payable Status",
      "type": "select",
      "options": [
        "3_WAY_MATCHED",
        "PENDING_APPROVAL",
        "APPROVED_FOR_PAYMENT",
        "PAID"
      ],
      "defaultValue": "3_WAY_MATCHED"
    },
    {
      "key": "description",
      "label": "GST Input Tax Credit (ITC) Notes",
      "type": "textarea",
      "placeholder": "GSTR-2B invoice reflection verified for input tax credit..."
    }
  ],
  "tb_purchase_return": [
    {
      "key": "name",
      "label": "Material Return Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Rejected Rods Return to Vendor"
    },
    {
      "key": "code",
      "label": "Debit Note / Return No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. DN-2026-018"
    },
    {
      "key": "invoice_number",
      "label": "Original Vendor Invoice No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. INV-JSPL-9921"
    },
    {
      "key": "supplier_name",
      "label": "Supplier Legal Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Jindal Steel & Power Ltd"
    },
    {
      "key": "amount",
      "label": "Debit Note Amount (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 35000.00"
    },
    {
      "key": "date",
      "label": "Dispatch / Return Date",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Rejection Reason & Return Gate Pass",
      "type": "textarea",
      "placeholder": "Tolerance deviation exceeds +/- 0.05mm. Dispatched under RGP-992..."
    }
  ],
  "tb_stock_balance": [
    {
      "key": "name",
      "label": "Product Item Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Copper Wire Spool 2.5mm"
    },
    {
      "key": "code",
      "label": "Item SKU Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-COP-25"
    },
    {
      "key": "warehouse",
      "label": "Storage Warehouse",
      "type": "select",
      "options": [
        "Central Plant Warehouse",
        "Raw Material Yard",
        "Finished Goods Hub",
        "Cold Storage Bay"
      ],
      "defaultValue": "Central Plant Warehouse"
    },
    {
      "key": "quantity",
      "label": "Available Stock Quantity",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 1500"
    },
    {
      "key": "uom",
      "label": "Unit of Measure (UOM)",
      "type": "select",
      "options": [
        "PCS",
        "KG",
        "MTR",
        "BOX",
        "TON"
      ],
      "defaultValue": "KG"
    },
    {
      "key": "amount",
      "label": "Valuation Cost (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 480.00"
    },
    {
      "key": "status",
      "label": "Stock Health",
      "type": "select",
      "options": [
        "ADEQUATE",
        "REORDER_REQUIRED",
        "OVERSTOCKED",
        "QUARANTINE"
      ],
      "defaultValue": "ADEQUATE"
    },
    {
      "key": "description",
      "label": "Bin & Rack Storage Details",
      "type": "textarea",
      "placeholder": "Aisle 4, Rack B2, Bin 12"
    }
  ],
  "tb_stock_ledger": [
    {
      "key": "name",
      "label": "Ledger Audit Entry Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Stock Inward Posting Batch 442"
    },
    {
      "key": "code",
      "label": "Ledger Transaction Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. STK-TXN-9021"
    },
    {
      "key": "item_code",
      "label": "Item SKU Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-COP-25"
    },
    {
      "key": "warehouse",
      "label": "Warehouse Code",
      "type": "select",
      "options": [
        "Central Plant Warehouse",
        "Raw Material Yard",
        "Finished Goods Hub"
      ],
      "defaultValue": "Central Plant Warehouse"
    },
    {
      "key": "transaction_type",
      "label": "Transaction Type",
      "type": "select",
      "options": [
        "INWARD_PURCHASE",
        "OUTWARD_SALES",
        "ISSUE_PRODUCTION",
        "RETURN_CUSTOMER",
        "CYCLE_COUNT_ADJUSTMENT"
      ],
      "defaultValue": "INWARD_PURCHASE"
    },
    {
      "key": "quantity",
      "label": "Transaction Units Quantity",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 250"
    },
    {
      "key": "date",
      "label": "Posting Date & Time",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Supporting Audit Voucher Ref",
      "type": "textarea",
      "placeholder": "Associated GRN-2026-0442 verified and posted to perpetual inventory..."
    }
  ],
  "tb_stock_inward": [
    {
      "key": "name",
      "label": "Inward Consignment Slip",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Raw Material Batch Inward"
    },
    {
      "key": "code",
      "label": "Inward Slip Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. INW-2026-019"
    },
    {
      "key": "grn_number",
      "label": "Referenced GRN Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GRN-2026-0442"
    },
    {
      "key": "item_code",
      "label": "Material SKU Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-COP-25"
    },
    {
      "key": "quantity",
      "label": "Inward Quantity (Units)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 500"
    },
    {
      "key": "warehouse",
      "label": "Receiving Warehouse",
      "type": "select",
      "options": [
        "Central Plant Warehouse",
        "Raw Material Yard"
      ],
      "defaultValue": "Central Plant Warehouse"
    },
    {
      "key": "date",
      "label": "Inward Stocking Date",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Rack Allocation & Barcode Tag",
      "type": "textarea",
      "placeholder": "Assigned 2D Datamatrix barcode batch sticker #BAR-9901..."
    }
  ],
  "tb_stock_outward": [
    {
      "key": "name",
      "label": "Dispatch Outward Slip",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Finished Goods Delivery Dispatch"
    },
    {
      "key": "code",
      "label": "Outward Dispatch Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. OUT-2026-081"
    },
    {
      "key": "so_number",
      "label": "Sales Order Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SO-2026-4421"
    },
    {
      "key": "item_code",
      "label": "Finished Item SKU",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-HA-50"
    },
    {
      "key": "quantity",
      "label": "Quantity Dispatched",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 120"
    },
    {
      "key": "date",
      "label": "Dispatch Gate Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Dispatch Status",
      "type": "select",
      "options": [
        "STAGED",
        "DISPATCHED_IN_TRANSIT",
        "DELIVERED_ACKNOWLEDGED"
      ],
      "defaultValue": "DISPATCHED_IN_TRANSIT"
    },
    {
      "key": "description",
      "label": "Outward E-Way Bill & Gate Pass",
      "type": "textarea",
      "placeholder": "E-Way bill #992104928192 validated at security gate..."
    }
  ],
  "tb_stock_transfer": [
    {
      "key": "name",
      "label": "Inter-Warehouse Transfer Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Transfer Plant 1 to Finished Hub"
    },
    {
      "key": "code",
      "label": "Transfer Note Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. TRF-2026-034"
    },
    {
      "key": "from_warehouse",
      "label": "Dispatching Warehouse",
      "type": "select",
      "options": [
        "Central Plant Warehouse",
        "Raw Material Yard",
        "Finished Goods Hub"
      ],
      "defaultValue": "Central Plant Warehouse"
    },
    {
      "key": "to_warehouse",
      "label": "Destination Warehouse",
      "type": "select",
      "options": [
        "Finished Goods Hub",
        "Cold Storage Bay",
        "Regional Distribution Center"
      ],
      "defaultValue": "Finished Goods Hub"
    },
    {
      "key": "item_code",
      "label": "Item SKU Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-HA-50"
    },
    {
      "key": "quantity",
      "label": "Transfer Quantity",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 80"
    },
    {
      "key": "date",
      "label": "Transfer Movement Date",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Internal Transit Gate Pass & Driver",
      "type": "textarea",
      "placeholder": "Internal shuttle vehicle TN-04-AB-1234..."
    }
  ],
  "tb_warehouse_master": [
    {
      "key": "name",
      "label": "Warehouse Facility Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Chennai Central Distribution Hub"
    },
    {
      "key": "code",
      "label": "Warehouse Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. WH-CHN-01"
    },
    {
      "key": "city",
      "label": "Location / City",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Chennai, Tamil Nadu"
    },
    {
      "key": "manager_name",
      "label": "Warehouse Head / Custodian",
      "type": "text",
      "placeholder": "e.g. Anand Venkatesh"
    },
    {
      "key": "phone",
      "label": "Warehouse Contact Phone",
      "type": "tel",
      "placeholder": "9876543210"
    },
    {
      "key": "capacity",
      "label": "Storage Area / Capacity",
      "type": "text",
      "placeholder": "e.g. 45,000 Sq Ft / 2,000 Pallets"
    },
    {
      "key": "status",
      "label": "Operational Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "UNDER_MAINTENANCE",
        "CLOSED"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Security & Fire Compliance Details",
      "type": "textarea",
      "placeholder": "Equipped with 24/7 CCTV, temperature monitors and fire hydrants..."
    }
  ],
  "tb_sales_order": [
    {
      "key": "code",
      "label": "Sales Order Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SO-2026-4421"
    },
    {
      "key": "name",
      "label": "Customer Legal Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Mahindra Automotive Ltd"
    },
    {
      "key": "amount",
      "label": "Total Order Value (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 350000.00"
    },
    {
      "key": "date",
      "label": "Expected Dispatch Date",
      "type": "date"
    },
    {
      "key": "payment_terms",
      "label": "Payment Terms",
      "type": "select",
      "options": [
        "Net 30 Days",
        "Net 60 Days",
        "LC at Sight",
        "100% Advance Against PI"
      ],
      "defaultValue": "Net 30 Days"
    },
    {
      "key": "status",
      "label": "Order Processing Status",
      "type": "select",
      "options": [
        "CONFIRMED",
        "IN_PRODUCTION",
        "READY_FOR_DISPATCH",
        "DELIVERED",
        "CANCELLED"
      ],
      "defaultValue": "CONFIRMED"
    },
    {
      "key": "description",
      "label": "Customer Purchase Order & Delivery Instructions",
      "type": "textarea",
      "placeholder": "Ref Customer PO: MA-PO-992. Gate pass dispatch instructions..."
    }
  ],
  "tb_sales_quotation": [
    {
      "key": "name",
      "label": "Quotation Commercial Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Quotation for Actuator Assemblies"
    },
    {
      "key": "code",
      "label": "Quotation Ref Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. QUOT-2026-0812"
    },
    {
      "key": "customer_name",
      "label": "Prospect / Client Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Tata Motors Engineering Ltd"
    },
    {
      "key": "amount",
      "label": "Quoted Gross Value (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 420000.00"
    },
    {
      "key": "date",
      "label": "Quotation Validity Expiry Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Quotation Status",
      "type": "select",
      "options": [
        "DRAFT",
        "SENT_TO_CLIENT",
        "ACCEPTED_ORDER_CREATED",
        "EXPIRED",
        "DECLINED"
      ],
      "defaultValue": "SENT_TO_CLIENT"
    },
    {
      "key": "description",
      "label": "Commercial Terms & Warranties",
      "type": "textarea",
      "placeholder": "Prices valid for 30 days. Freight extra at actuals..."
    }
  ],
  "tb_sales_invoice": [
    {
      "key": "code",
      "label": "Invoice Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. INV-2026-0891"
    },
    {
      "key": "name",
      "label": "Customer / Client Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Apex Industries Pvt Ltd"
    },
    {
      "key": "amount",
      "label": "Invoice Gross Value (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 85000.00"
    },
    {
      "key": "tax_amount",
      "label": "GST Tax Amount (INR)",
      "type": "number",
      "placeholder": "e.g. 15300.00"
    },
    {
      "key": "date",
      "label": "Invoice Date",
      "type": "date"
    },
    {
      "key": "status",
      "label": "Payment Status",
      "type": "select",
      "options": [
        "DRAFT",
        "PENDING_APPROVAL",
        "APPROVED",
        "PAID",
        "OVERDUE"
      ],
      "defaultValue": "PENDING_APPROVAL"
    },
    {
      "key": "description",
      "label": "Terms of Delivery & Payment",
      "type": "textarea",
      "placeholder": "Delivery dispatch terms..."
    }
  ],
  "tb_customer_receipt": [
    {
      "key": "name",
      "label": "Receipt Confirmation Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Payment Received from Apex Industries"
    },
    {
      "key": "code",
      "label": "Receipt Voucher Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. RCP-2026-0319"
    },
    {
      "key": "invoice_number",
      "label": "Settled Sales Invoice No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. INV-2026-0891"
    },
    {
      "key": "customer_name",
      "label": "Customer Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Apex Industries Pvt Ltd"
    },
    {
      "key": "amount",
      "label": "Amount Received (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 85000.00"
    },
    {
      "key": "payment_mode",
      "label": "Settlement Payment Mode",
      "type": "select",
      "options": [
        "RTGS / NEFT Transfer",
        "UPI / IMPS",
        "Corporate Cheque",
        "Letter of Credit (LC)"
      ],
      "defaultValue": "RTGS / NEFT Transfer"
    },
    {
      "key": "date",
      "label": "Credit Realization Date",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Bank UTR Reference & Notes",
      "type": "textarea",
      "placeholder": "Bank UTR #HDFCR52026049281 confirmed in current account..."
    }
  ],
  "tb_sales_delivery": [
    {
      "key": "name",
      "label": "Outward Delivery Shipment",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Dispatch Consignment to Apex Plant"
    },
    {
      "key": "code",
      "label": "Delivery Challan Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. DC-2026-0741"
    },
    {
      "key": "order_number",
      "label": "Sales Order Reference No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SO-2026-4421"
    },
    {
      "key": "customer_name",
      "label": "Customer Legal Entity",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Apex Industries Pvt Ltd"
    },
    {
      "key": "vehicle_number",
      "label": "Transport Vehicle Registration No",
      "type": "text",
      "placeholder": "e.g. TN-04-CD-5678"
    },
    {
      "key": "date",
      "label": "Dispatch Challan Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Delivery Progress Status",
      "type": "select",
      "options": [
        "DISPATCHED",
        "IN_TRANSIT",
        "DELIVERED_POD_RECEIVED",
        "RETURNED"
      ],
      "defaultValue": "DISPATCHED"
    },
    {
      "key": "description",
      "label": "Transporter Docket & POD Details",
      "type": "textarea",
      "placeholder": "Transporter: VRL Logistics. E-Way Bill #341092837492..."
    }
  ],
  "tb_attendance": [
    {
      "key": "name",
      "label": "Employee Full Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Suresh Patel"
    },
    {
      "key": "code",
      "label": "Employee ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-081"
    },
    {
      "key": "date",
      "label": "Attendance Date",
      "type": "date"
    },
    {
      "key": "status",
      "label": "Attendance Status",
      "type": "select",
      "options": [
        "PRESENT",
        "ABSENT",
        "HALF_DAY",
        "ON_LEAVE",
        "BUSINESS_DUTY"
      ],
      "defaultValue": "PRESENT"
    },
    {
      "key": "shift",
      "label": "Assigned Work Shift",
      "type": "select",
      "options": [
        "Morning General (09:00 - 18:00)",
        "First Shift (06:00 - 14:30)",
        "Second Shift (14:30 - 23:00)",
        "Night Shift (23:00 - 06:00)"
      ],
      "defaultValue": "Morning General (09:00 - 18:00)"
    },
    {
      "key": "description",
      "label": "Biometric Log / Punch Notes",
      "type": "textarea",
      "placeholder": "Punch IN: 08:55 AM, Punch OUT: 06:12 PM"
    }
  ],
  "tb_shift_master": [
    {
      "key": "name",
      "label": "Shift Schedule Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. First Operational Shift"
    },
    {
      "key": "code",
      "label": "Shift Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SFT-MOR-01"
    },
    {
      "key": "start_time",
      "label": "Shift Start Time",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 06:00 AM"
    },
    {
      "key": "end_time",
      "label": "Shift End Time",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 02:30 PM"
    },
    {
      "key": "break_minutes",
      "label": "Lunch / Tea Break Duration (Mins)",
      "type": "number",
      "defaultValue": "45",
      "placeholder": "e.g. 45"
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "INACTIVE"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Applicable Plant Wings",
      "type": "textarea",
      "placeholder": "Applicable to Bay 1 & Bay 2 manufacturing staff..."
    }
  ],
  "tb_shift_roster": [
    {
      "key": "name",
      "label": "Roster Schedule Period",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Week 46 Plant 1 Line Roster"
    },
    {
      "key": "code",
      "label": "Roster Reference Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. RST-2026-W46"
    },
    {
      "key": "employee_code",
      "label": "Assigned Employee ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-081"
    },
    {
      "key": "shift_code",
      "label": "Assigned Shift Code",
      "type": "select",
      "options": [
        "SFT-MOR-01 (06:00 - 14:30)",
        "SFT-GEN-01 (09:00 - 18:00)",
        "SFT-EVE-02 (14:30 - 23:00)",
        "SFT-NGT-03 (23:00 - 06:00)"
      ],
      "defaultValue": "SFT-GEN-01 (09:00 - 18:00)"
    },
    {
      "key": "start_date",
      "label": "Roster Cycle Start Date",
      "type": "date",
      "required": true
    },
    {
      "key": "end_date",
      "label": "Roster Cycle End Date",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Weekly Offs & Overtime Notes",
      "type": "textarea",
      "placeholder": "Designated weekly off: Sunday. Backup operator: EMP-042..."
    }
  ],
  "tb_leave_request": [
    {
      "key": "name",
      "label": "Leave Purpose Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Annual Family Vacation Leave"
    },
    {
      "key": "code",
      "label": "Leave Request Ticket No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. LV-2026-092"
    },
    {
      "key": "employee_code",
      "label": "Applicant Employee ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-081"
    },
    {
      "key": "leave_type",
      "label": "Statutory Leave Classification",
      "type": "select",
      "options": [
        "Earned / Privilege Leave (PL)",
        "Casual Leave (CL)",
        "Sick / Medical Leave (SL)",
        "Maternity / Paternity Leave",
        "Compensatory Off (Comp-Off)"
      ],
      "defaultValue": "Earned / Privilege Leave (PL)"
    },
    {
      "key": "start_date",
      "label": "Leave From Date",
      "type": "date",
      "required": true
    },
    {
      "key": "end_date",
      "label": "Leave To Date",
      "type": "date",
      "required": true
    },
    {
      "key": "quantity",
      "label": "Total Calendar Days",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 4"
    },
    {
      "key": "status",
      "label": "Approval Status",
      "type": "select",
      "options": [
        "SUBMITTED",
        "HOD_APPROVED",
        "HR_SANCTIONED",
        "REJECTED"
      ],
      "defaultValue": "SUBMITTED"
    },
    {
      "key": "description",
      "label": "Reliever Plan & Justification",
      "type": "textarea",
      "placeholder": "Handover completed to Anand Venkatesh for Bay 1 operations..."
    }
  ],
  "tb_overtime": [
    {
      "key": "name",
      "label": "Overtime Session Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Weekend Rush Order Production OT"
    },
    {
      "key": "code",
      "label": "OT Approval Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. OT-2026-0419"
    },
    {
      "key": "employee_code",
      "label": "Overtime Employee ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-081"
    },
    {
      "key": "date",
      "label": "Overtime Shift Date",
      "type": "date",
      "required": true
    },
    {
      "key": "quantity",
      "label": "Overtime Hours Logged",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 4.5"
    },
    {
      "key": "amount",
      "label": "Statutory Double-Time Payout (INR)",
      "type": "number",
      "placeholder": "e.g. 2250.00"
    },
    {
      "key": "status",
      "label": "Supervisor Sign-Off",
      "type": "select",
      "options": [
        "VERIFIED_SUPERVISOR",
        "HR_PROCESSED",
        "REJECTED"
      ],
      "defaultValue": "VERIFIED_SUPERVISOR"
    },
    {
      "key": "description",
      "label": "Production Work Order Reference",
      "type": "textarea",
      "placeholder": "Completed precision turning for Work Order #WO-2026-051..."
    }
  ],
  "tb_work_order": [
    {
      "key": "code",
      "label": "Work Order Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. WO-2026-051"
    },
    {
      "key": "name",
      "label": "Manufactured Product Item",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Hydraulic Actuator Assembly 50kN"
    },
    {
      "key": "quantity",
      "label": "Production Batch Target (Units)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 200"
    },
    {
      "key": "date",
      "label": "Scheduled Completion Date",
      "type": "date"
    },
    {
      "key": "production_line",
      "label": "Assigned Assembly Line",
      "type": "select",
      "options": [
        "Line 1 - Heavy Fabrication",
        "Line 2 - Precision Assembly",
        "Line 3 - Finishing & Testing"
      ],
      "defaultValue": "Line 2 - Precision Assembly"
    },
    {
      "key": "status",
      "label": "Manufacturing Status",
      "type": "select",
      "options": [
        "PLANNED",
        "IN_PROGRESS",
        "QUALITY_HOLD",
        "COMPLETED"
      ],
      "defaultValue": "IN_PROGRESS"
    },
    {
      "key": "description",
      "label": "BOM Route & Engineering Guidelines",
      "type": "textarea",
      "placeholder": "Ensure pressure testing at 250 bar before packaging..."
    }
  ],
  "tb_bom_master": [
    {
      "key": "name",
      "label": "Bill of Materials (BOM) Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Engineering BOM - Hydraulic Actuator 50kN"
    },
    {
      "key": "code",
      "label": "BOM Identifier Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. BOM-HA50-V2"
    },
    {
      "key": "product_code",
      "label": "Finished Product Item SKU",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-HA-50"
    },
    {
      "key": "revision_number",
      "label": "BOM Engineering Revision",
      "type": "text",
      "defaultValue": "REV-02",
      "placeholder": "e.g. REV-02"
    },
    {
      "key": "yield_percentage",
      "label": "Standard Target Yield (%)",
      "type": "number",
      "defaultValue": "98",
      "placeholder": "e.g. 98.5"
    },
    {
      "key": "status",
      "label": "Engineering Release Status",
      "type": "select",
      "options": [
        "RELEASED_ACTIVE",
        "UNDER_REVISION",
        "OBSOLETE"
      ],
      "defaultValue": "RELEASED_ACTIVE"
    },
    {
      "key": "description",
      "label": "Component Hierarchy & Assembly Steps",
      "type": "textarea",
      "placeholder": "1x Cylinder Barrel, 1x Piston Rod, 4x Viton High-Pressure Seals..."
    }
  ],
  "tb_production_plan": [
    {
      "key": "name",
      "label": "Master Production Schedule (MPS) Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Q4 High-Pressure Cylinder Production Plan"
    },
    {
      "key": "code",
      "label": "Plan Reference Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PLN-2026-Q4"
    },
    {
      "key": "start_date",
      "label": "Planning Horizon Start Date",
      "type": "date",
      "required": true
    },
    {
      "key": "end_date",
      "label": "Planning Horizon End Date",
      "type": "date",
      "required": true
    },
    {
      "key": "quantity",
      "label": "Aggregate Target Production (Units)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 2500"
    },
    {
      "key": "status",
      "label": "Schedule Execution Status",
      "type": "select",
      "options": [
        "DRAFT",
        "RELEASED_TO_SHOPFLOOR",
        "IN_EXECUTION",
        "CLOSED"
      ],
      "defaultValue": "RELEASED_TO_SHOPFLOOR"
    },
    {
      "key": "description",
      "label": "Capacity Utilization & Bottlenecks",
      "type": "textarea",
      "placeholder": "Machining center running 2 shifts at 85% planned utilization..."
    }
  ],
  "tb_material_issue": [
    {
      "key": "name",
      "label": "Material Requisition Slip Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Raw Material Issue for WO-051"
    },
    {
      "key": "code",
      "label": "Issue Voucher Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. ISS-2026-0312"
    },
    {
      "key": "work_order_code",
      "label": "Target Work Order No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. WO-2026-051"
    },
    {
      "key": "item_code",
      "label": "Raw Material SKU Issued",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SKU-SSR-12"
    },
    {
      "key": "quantity",
      "label": "Quantity Issued to Shopfloor",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 220"
    },
    {
      "key": "date",
      "label": "Material Dispatch Date",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Issued To Operator & Heat Number",
      "type": "textarea",
      "placeholder": "Dispatched to Lead Machinist Suresh Patel. Heat #H-99201..."
    }
  ],
  "tb_production_entry": [
    {
      "key": "name",
      "label": "Daily Production Run Output Slip",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Day Shift Actuator Assembly Run"
    },
    {
      "key": "code",
      "label": "Production Run Log Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PRD-LOG-2026-018"
    },
    {
      "key": "work_order_code",
      "label": "Work Order Reference No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. WO-2026-051"
    },
    {
      "key": "quantity",
      "label": "Finished Units Produced",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 48"
    },
    {
      "key": "scrap_quantity",
      "label": "Scrap / Rework Units",
      "type": "number",
      "defaultValue": "0",
      "placeholder": "e.g. 2"
    },
    {
      "key": "operator_name",
      "label": "Shift In-Charge Supervisor",
      "type": "text",
      "placeholder": "e.g. Anand Venkatesh"
    },
    {
      "key": "date",
      "label": "Shift Completion Date",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "Quality Audit & Pressure Test Results",
      "type": "textarea",
      "placeholder": "100% pneumatic hydro-test cleared at 250 bar pressure..."
    }
  ],
  "tb_accounting_voucher": [
    {
      "key": "code",
      "label": "Voucher Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. VCH-PAY-0082"
    },
    {
      "key": "voucher_type",
      "label": "Voucher Type",
      "type": "select",
      "options": [
        "Payment Voucher",
        "Receipt Voucher",
        "Journal Voucher",
        "Contra Voucher"
      ],
      "defaultValue": "Payment Voucher"
    },
    {
      "key": "name",
      "label": "Debit Account Head",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Machine Maintenance & Repairs"
    },
    {
      "key": "credit_account",
      "label": "Credit Account Head",
      "type": "text",
      "required": true,
      "placeholder": "e.g. HDFC Bank Current A/c"
    },
    {
      "key": "amount",
      "label": "Voucher Amount (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 24500.00"
    },
    {
      "key": "description",
      "label": "Statutory Narration",
      "type": "textarea",
      "placeholder": "Being payment made towards factory repairs..."
    }
  ],
  "tb_account_ledger": [
    {
      "key": "name",
      "label": "General Ledger Account Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Plant Machinery & Capital Assets"
    },
    {
      "key": "code",
      "label": "Chart of Accounts (COA) Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GL-1040-AST"
    },
    {
      "key": "account_group",
      "label": "COA Grouping Classification",
      "type": "select",
      "options": [
        "Fixed Assets",
        "Current Assets",
        "Current Liabilities",
        "Long-Term Liabilities",
        "Direct Expenses",
        "Indirect Expenses",
        "Sales Operating Revenue",
        "Direct Cost of Goods Sold"
      ],
      "defaultValue": "Fixed Assets"
    },
    {
      "key": "opening_balance",
      "label": "Fiscal Opening Balance (INR)",
      "type": "number",
      "defaultValue": "0",
      "placeholder": "e.g. 85000000.00"
    },
    {
      "key": "amount",
      "label": "Current Net Ledger Balance (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 89500000.00"
    },
    {
      "key": "status",
      "label": "Ledger Health Status",
      "type": "select",
      "options": [
        "ACTIVE_OPEN",
        "RECONCILED",
        "FROZEN_YEAR_END"
      ],
      "defaultValue": "ACTIVE_OPEN"
    },
    {
      "key": "description",
      "label": "Statutory Accounting Notes",
      "type": "textarea",
      "placeholder": "Audited balance as per Schedule III Balance Sheet..."
    }
  ],
  "tb_company_bank_account": [
    {
      "key": "name",
      "label": "Bank Account Nickname",
      "type": "text",
      "required": true,
      "placeholder": "e.g. HDFC Main Operating Current A/c"
    },
    {
      "key": "code",
      "label": "Bank Account Identifier Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. BNK-HDFC-01"
    },
    {
      "key": "bank_name",
      "label": "Banking Institution Legal Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. HDFC Bank Ltd"
    },
    {
      "key": "account_number",
      "label": "Bank Account Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 50200084920194"
    },
    {
      "key": "ifsc_code",
      "label": "Branch IFSC Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. HDFC0001234"
    },
    {
      "key": "branch_name",
      "label": "Branch Location",
      "type": "text",
      "placeholder": "e.g. Anna Nagar Central Branch, Chennai"
    },
    {
      "key": "account_type",
      "label": "Account Type",
      "type": "select",
      "options": [
        "Current Operating Account",
        "Overdraft (OD) Facility",
        "Cash Credit (CC) Account",
        "Statutory Escrow Account",
        "EEFC Foreign Currency Account"
      ],
      "defaultValue": "Current Operating Account"
    },
    {
      "key": "currency_code",
      "label": "Currency",
      "type": "select",
      "options": [
        "INR",
        "USD",
        "EUR"
      ],
      "defaultValue": "INR"
    },
    {
      "key": "description",
      "label": "Authorized Signatories & Limits",
      "type": "textarea",
      "placeholder": "Joint signatory authorization: Managing Director & Finance Head..."
    }
  ],
  "tb_bank_statement": [
    {
      "key": "name",
      "label": "Statement Transaction Description",
      "type": "text",
      "required": true,
      "placeholder": "e.g. NEFT INW - Tata Motors Invoice Settlement"
    },
    {
      "key": "code",
      "label": "Bank Transaction Ref / UTR",
      "type": "text",
      "required": true,
      "placeholder": "e.g. UTR-HDFC-9901928"
    },
    {
      "key": "bank_account_no",
      "label": "Target Bank Account Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 50200084920194"
    },
    {
      "key": "date",
      "label": "Transaction Realization Date",
      "type": "date",
      "required": true
    },
    {
      "key": "debit",
      "label": "Debit Outflow (INR)",
      "type": "number",
      "defaultValue": "0",
      "placeholder": "e.g. 0.00"
    },
    {
      "key": "credit",
      "label": "Credit Inflow (INR)",
      "type": "number",
      "defaultValue": "0",
      "placeholder": "e.g. 420000.00"
    },
    {
      "key": "amount",
      "label": "Running Balance (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 8450000.00"
    },
    {
      "key": "description",
      "label": "Auto-Reconciliation Status",
      "type": "textarea",
      "placeholder": "Matched against Customer Receipt #RCP-2026-0319..."
    }
  ],
  "tb_expense_claim": [
    {
      "key": "name",
      "label": "Expense Claim Subject",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Client Site Audit Travel Reimbursement"
    },
    {
      "key": "code",
      "label": "Expense Claim Ticket No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EXP-CLM-2026-081"
    },
    {
      "key": "employee_name",
      "label": "Claimant Employee Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Anand Venkatesh"
    },
    {
      "key": "expense_category",
      "label": "Expense Category Head",
      "type": "select",
      "options": [
        "Domestic Travel & Conveyance",
        "Lodging & Boarding",
        "Client Business Entertainment",
        "Site Utilities & Emergency Spares",
        "Office Stationeries"
      ],
      "defaultValue": "Domestic Travel & Conveyance"
    },
    {
      "key": "amount",
      "label": "Claim Amount (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 18450.00"
    },
    {
      "key": "date",
      "label": "Claim Incurred Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Reimbursement Audit Status",
      "type": "select",
      "options": [
        "SUBMITTED_FOR_AUDIT",
        "APPROVED_PAYMENT_QUEUED",
        "DISBURSED_REIMBURSED",
        "REJECTED"
      ],
      "defaultValue": "SUBMITTED_FOR_AUDIT"
    },
    {
      "key": "description",
      "label": "Audit GST Bills & Tax Slips",
      "type": "textarea",
      "placeholder": "Flight ticket and hotel GST bill attached for Pune client visit..."
    }
  ],
  "tb_payroll_run": [
    {
      "key": "name",
      "label": "Payroll Cycle Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. November 2026 Enterprise Salary Run"
    },
    {
      "key": "code",
      "label": "Payroll Processing Batch No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PAY-2026-M11"
    },
    {
      "key": "month_year",
      "label": "Wage Month & Year",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 2026-11"
    },
    {
      "key": "quantity",
      "label": "Eligible Employees Count",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 142"
    },
    {
      "key": "gross_amount",
      "label": "Total Gross Wage Payout (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 8450000.00"
    },
    {
      "key": "amount",
      "label": "Total Net Disbursed Payout (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 7420000.00"
    },
    {
      "key": "status",
      "label": "Payroll Cycle Status",
      "type": "select",
      "options": [
        "DRAFT_CALCULATING",
        "AUDIT_APPROVED",
        "DISBURSED_BANK_UPLOADED",
        "COMPLETED_LOCKED"
      ],
      "defaultValue": "AUDIT_APPROVED"
    },
    {
      "key": "description",
      "label": "Statutory EPF, ESI & TDS Reconciliations",
      "type": "textarea",
      "placeholder": "Total EPF statutory remittance: INR 482,000; TDS: INR 548,000..."
    }
  ],
  "tb_salary_structure": [
    {
      "key": "name",
      "label": "Compensation Band Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Standard Plant Technical Grade 2 Structure"
    },
    {
      "key": "code",
      "label": "Structure Template Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. STRUC-TECH-02"
    },
    {
      "key": "grade",
      "label": "Salary Grade",
      "type": "select",
      "options": [
        "Band E1 (Executive)",
        "Band M1 (Management)",
        "Band D1 (Director)",
        "Band T1 (Technical)",
        "Band O1 (Operator)"
      ],
      "defaultValue": "Band T1 (Technical)"
    },
    {
      "key": "basic_percentage",
      "label": "Basic Salary Allocation (%)",
      "type": "number",
      "defaultValue": "50",
      "placeholder": "e.g. 50"
    },
    {
      "key": "hra_percentage",
      "label": "HRA Component (%)",
      "type": "number",
      "defaultValue": "25",
      "placeholder": "e.g. 25"
    },
    {
      "key": "da_percentage",
      "label": "Special Allowance (%)",
      "type": "number",
      "defaultValue": "25",
      "placeholder": "e.g. 25"
    },
    {
      "key": "description",
      "label": "Statutory Provident Fund & ESI Policy",
      "type": "textarea",
      "placeholder": "12% EPF calculated on basic salary up to statutory ceiling..."
    }
  ],
  "tb_pf_contribution": [
    {
      "key": "name",
      "label": "EPF Remittance Record",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Employee EPF Monthly Filing"
    },
    {
      "key": "code",
      "label": "PF Ledger Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PF-2026-M11-042"
    },
    {
      "key": "employee_code",
      "label": "Employee ID Reference",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-042"
    },
    {
      "key": "uan",
      "label": "12-Digit Statutory UAN Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 101234567890"
    },
    {
      "key": "employee_pf",
      "label": "Employee PF Share (12%) (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 1800.00"
    },
    {
      "key": "employer_pf",
      "label": "Employer PF Share (12%) (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 1800.00"
    },
    {
      "key": "date",
      "label": "Contribution Wage Month",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "EPFO ECR Electronic Challan Return",
      "type": "textarea",
      "placeholder": "Reconciled with EPFO monthly Electronic Challan Return file..."
    }
  ],
  "tb_esi_contribution": [
    {
      "key": "name",
      "label": "ESIC Statutory Record",
      "type": "text",
      "required": true,
      "placeholder": "e.g. ESIC Monthly Filing"
    },
    {
      "key": "code",
      "label": "ESI Filing Ref Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. ESI-2026-M11-081"
    },
    {
      "key": "employee_code",
      "label": "Employee ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-081"
    },
    {
      "key": "ip_number",
      "label": "17-Digit ESIC Insurance IP No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 31002938471928374"
    },
    {
      "key": "employee_esi",
      "label": "Employee ESIC Share (0.75%) (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 150.00"
    },
    {
      "key": "employer_esi",
      "label": "Employer ESIC Share (3.25%) (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 650.00"
    },
    {
      "key": "date",
      "label": "Contribution Wage Month",
      "type": "date",
      "required": true
    },
    {
      "key": "description",
      "label": "ESIC Portal Filing Acknowledgement",
      "type": "textarea",
      "placeholder": "Monthly wage declaration verified on ESIC Shram Suvidha portal..."
    }
  ],
  "tb_payslip": [
    {
      "key": "name",
      "label": "Salary Slip Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Payslip - Anand Venkatesh - Nov 2026"
    },
    {
      "key": "code",
      "label": "Payslip Certificate Serial No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SLIP-2026-M11-042"
    },
    {
      "key": "employee_code",
      "label": "Employee ID Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EMP-2026-042"
    },
    {
      "key": "gross_pay",
      "label": "Gross Monthly Earnings (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 100000.00"
    },
    {
      "key": "deductions",
      "label": "Total Deductions (PF+TDS+PT) (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 15400.00"
    },
    {
      "key": "amount",
      "label": "Net Take-Home Salary (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 84600.00"
    },
    {
      "key": "status",
      "label": "Payslip Status",
      "type": "select",
      "options": [
        "GENERATED",
        "DISPATCHED_TO_EMPLOYEE",
        "ACKNOWLEDGED"
      ],
      "defaultValue": "GENERATED"
    },
    {
      "key": "description",
      "label": "Income Tax Form 16 Cumulative Tracker",
      "type": "textarea",
      "placeholder": "Cumulative financial year tax deduction to date: INR 92,400..."
    }
  ],
  "tb_compliance_master": [
    {
      "key": "name",
      "label": "Compliance Register Obligation",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Factories Act Annual Health & Safety Audit"
    },
    {
      "key": "code",
      "label": "Compliance Item Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CMP-FACT-01"
    },
    {
      "key": "statutory_body",
      "label": "Statutory Regulator / Department",
      "type": "select",
      "options": [
        "Directorate of Industrial Safety & Health",
        "Goods and Services Tax Council",
        "Ministry of Corporate Affairs (MCA)",
        "Central Pollution Control Board",
        "Employees Provident Fund Organisation"
      ],
      "defaultValue": "Directorate of Industrial Safety & Health"
    },
    {
      "key": "frequency",
      "label": "Mandated Filing Frequency",
      "type": "select",
      "options": [
        "Monthly",
        "Quarterly",
        "Half-Yearly",
        "Annually",
        "Event-Triggered"
      ],
      "defaultValue": "Annually"
    },
    {
      "key": "amount",
      "label": "Statutory Renewal Fee / Penalty (INR)",
      "type": "number",
      "placeholder": "e.g. 25000.00"
    },
    {
      "key": "status",
      "label": "Compliance Health",
      "type": "select",
      "options": [
        "COMPLIANT_ACTIVE",
        "RENEWAL_DUE",
        "AUDIT_PENDING",
        "NON_COMPLIANT_RISK"
      ],
      "defaultValue": "COMPLIANT_ACTIVE"
    },
    {
      "key": "description",
      "label": "Statutory Act, Section & Mandate",
      "type": "textarea",
      "placeholder": "Section 7A of Factories Act 1948 - Safety officer appointment mandatory..."
    }
  ],
  "tb_company_licence": [
    {
      "key": "name",
      "label": "Statutory Operating Licence Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Tamil Nadu Factory Manufacturing Licence"
    },
    {
      "key": "code",
      "label": "Licence Reference Certificate No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. LIC-FACT-2026-904"
    },
    {
      "key": "licence_type",
      "label": "Licence Statutory Category",
      "type": "select",
      "options": [
        "Factory Manufacturing Licence",
        "Pollution Control Consent to Operate (CTO)",
        "Fire Safety No Objection Certificate (NOC)",
        "Boiler Operation Clearance",
        "Groundwater Extraction Permit"
      ],
      "defaultValue": "Factory Manufacturing Licence"
    },
    {
      "key": "issuing_authority",
      "label": "Issuing Government Department",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Directorate of Industrial Safety, Govt of Tamil Nadu"
    },
    {
      "key": "start_date",
      "label": "Licence Grant Date",
      "type": "date",
      "required": true
    },
    {
      "key": "expiry_date",
      "label": "Licence Expiry / Renewal Due",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Licence Validity Status",
      "type": "select",
      "options": [
        "ACTIVE_VALID",
        "RENEWAL_APPLICATION_SUBMITTED",
        "EXPIRED"
      ],
      "defaultValue": "ACTIVE_VALID"
    },
    {
      "key": "description",
      "label": "Permitted Horsepower & Worker Headcount",
      "type": "textarea",
      "placeholder": "Approved connected load: 750 HP. Permitted workers: 250 per shift..."
    }
  ],
  "tb_compliance_calendar": [
    {
      "key": "name",
      "label": "Statutory Event / Filing Deadline",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GSTR-3B Monthly Return Filing"
    },
    {
      "key": "code",
      "label": "Filing Calendar Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CAL-GST3B-M11"
    },
    {
      "key": "department",
      "label": "Responsible Corporate Department",
      "type": "select",
      "options": [
        "Accounts & Finance",
        "Human Resources",
        "Plant Operations",
        "Legal & Company Secretary"
      ],
      "defaultValue": "Accounts & Finance"
    },
    {
      "key": "statutory_form",
      "label": "Prescribed Return Form",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Form GSTR-3B"
    },
    {
      "key": "date",
      "label": "Statutory Due Date",
      "type": "date",
      "required": true
    },
    {
      "key": "reminder_days",
      "label": "Early Reminder Alert (Days)",
      "type": "number",
      "defaultValue": "5",
      "placeholder": "e.g. 5"
    },
    {
      "key": "status",
      "label": "Filing Completion Status",
      "type": "select",
      "options": [
        "UPCOMING_PENDING",
        "DATA_RECONCILED",
        "FILED_ACKNOWLEDGED",
        "OVERDUE"
      ],
      "defaultValue": "UPCOMING_PENDING"
    },
    {
      "key": "description",
      "label": "Statutory Penalty on Delay",
      "type": "textarea",
      "placeholder": "Late fee INR 50/day and 18% statutory interest on tax due..."
    }
  ],
  "tb_compliance_task": [
    {
      "key": "name",
      "label": "Compliance Action Item",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Upload Annual Factory Return Form 22"
    },
    {
      "key": "code",
      "label": "Compliance Task Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. TSK-CMP-2026-081"
    },
    {
      "key": "assigned_to",
      "label": "Designated Compliance Officer",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Rajesh Sharma"
    },
    {
      "key": "date",
      "label": "Task Execution Deadline",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Task Progress",
      "type": "select",
      "options": [
        "OPEN_NOT_STARTED",
        "IN_PROGRESS",
        "REVIEW_BY_LEGAL",
        "COMPLETED_DOCUMENTED"
      ],
      "defaultValue": "IN_PROGRESS"
    },
    {
      "key": "description",
      "label": "Checklist Deliverables & Documents",
      "type": "textarea",
      "placeholder": "Collect accident-free working hours log and Form 25 registers..."
    }
  ],
  "tb_statutory_submission": [
    {
      "key": "name",
      "label": "Government Portal Submission Record",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GSTR-1 Outward Supplies Electronic Filing"
    },
    {
      "key": "code",
      "label": "Submission Tracking Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SUB-GST1-2026-11"
    },
    {
      "key": "form_code",
      "label": "Statutory Return Form Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GSTR-1"
    },
    {
      "key": "ack_number",
      "label": "Government ARN / Acknowledgement No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. AA331126049281A"
    },
    {
      "key": "date",
      "label": "Filing Submission Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Government Validation Status",
      "type": "select",
      "options": [
        "ACCEPTED_ACKNOWLEDGED",
        "PROCESSING_AT_GATEWAY",
        "REJECTED_VALIDATION_ERROR"
      ],
      "defaultValue": "ACCEPTED_ACKNOWLEDGED"
    },
    {
      "key": "description",
      "label": "Cryptographic Hash & Signer Info",
      "type": "textarea",
      "placeholder": "Digitally signed with Platform Owner Class-3 DSC token..."
    }
  ],
  "tb_statutory_form_master": [
    {
      "key": "name",
      "label": "Statutory Form Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GSTR-3B Self-Assessed Monthly Tax Return"
    },
    {
      "key": "code",
      "label": "Statutory Form Identifier",
      "type": "text",
      "required": true,
      "placeholder": "e.g. FORM-GSTR-3B"
    },
    {
      "key": "statutory_act",
      "label": "Governing Legislation / Act",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Central Goods and Services Tax Act 2017"
    },
    {
      "key": "frequency",
      "label": "Filing Frequency",
      "type": "select",
      "options": [
        "Monthly",
        "Quarterly",
        "Annual",
        "Event Based"
      ],
      "defaultValue": "Monthly"
    },
    {
      "key": "status",
      "label": "Status",
      "type": "select",
      "options": [
        "ACTIVE",
        "AMENDED"
      ],
      "defaultValue": "ACTIVE"
    },
    {
      "key": "description",
      "label": "Statutory Form Architecture & Guidelines",
      "type": "textarea",
      "placeholder": "Includes Table 3.1 outward supplies and Table 4 eligible ITC..."
    }
  ],
  "tb_statutory_rule_master": [
    {
      "key": "name",
      "label": "Statutory Section / Rule Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Section 16(4) GST ITC Inward Claim Time Limit"
    },
    {
      "key": "code",
      "label": "Statutory Rule Reference Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. RULE-GST-S16"
    },
    {
      "key": "section_ref",
      "label": "Statutory Section Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Section 16(4)"
    },
    {
      "key": "date",
      "label": "Statutory Enactment Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Applicability Status",
      "type": "select",
      "options": [
        "ACTIVE_ENFORCED",
        "STAYED_COURT_ORDER",
        "REPEALED"
      ],
      "defaultValue": "ACTIVE_ENFORCED"
    },
    {
      "key": "description",
      "label": "Legal Interpretation & Compliance Rule",
      "type": "textarea",
      "placeholder": "ITC claim cut-off date is 30th November following fiscal close..."
    }
  ],
  "tb_government_portal": [
    {
      "key": "name",
      "label": "Government Portal Gateway Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GST Common Portal (GSTN)"
    },
    {
      "key": "code",
      "label": "Portal Gateway Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PORT-GSTN-PROD"
    },
    {
      "key": "portal_url",
      "label": "Government Gateway Webhook / URL",
      "type": "text",
      "required": true,
      "placeholder": "https://services.gst.gov.in"
    },
    {
      "key": "user_id",
      "label": "Registered Government Portal User ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GST_PORTAL_USER_01"
    },
    {
      "key": "status",
      "label": "API Connection Health",
      "type": "select",
      "options": [
        "CONNECTED_API_ONLINE",
        "MAINTENANCE_DOWNTIME",
        "CREDENTIALS_EXPIRED"
      ],
      "defaultValue": "CONNECTED_API_ONLINE"
    },
    {
      "key": "description",
      "label": "API Session Token & Public Key",
      "type": "textarea",
      "placeholder": "NIC GSP API integration enabled with automated token refresh..."
    }
  ],
  "tb_financial_budget": [
    {
      "key": "name",
      "label": "Annual Operating Budget Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. FY 2026-27 Plant Modernization CapEx Budget"
    },
    {
      "key": "code",
      "label": "Budget Reference Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. BDG-CAPEX-2026"
    },
    {
      "key": "department",
      "label": "Allocated Department",
      "type": "select",
      "options": [
        "Operations & Plants",
        "Engineering & R&D",
        "Information Technology",
        "Sales & Marketing",
        "Quality Assurance"
      ],
      "defaultValue": "Operations & Plants"
    },
    {
      "key": "fiscal_year",
      "label": "Financial Fiscal Year",
      "type": "text",
      "required": true,
      "placeholder": "e.g. FY 2026-2027"
    },
    {
      "key": "amount",
      "label": "Approved Budget Allocation (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 50000000.00"
    },
    {
      "key": "spent_amount",
      "label": "Disbursed Spend to Date (INR)",
      "type": "number",
      "defaultValue": "0",
      "placeholder": "e.g. 18450000.00"
    },
    {
      "key": "status",
      "label": "Budget Status",
      "type": "select",
      "options": [
        "APPROVED_ACTIVE",
        "UNDER_REVISION",
        "EXHAUSTED",
        "CLOSED"
      ],
      "defaultValue": "APPROVED_ACTIVE"
    },
    {
      "key": "description",
      "label": "CapEx Investment Thesis & Payback Period",
      "type": "textarea",
      "placeholder": "Projected IRR 24.5%, payback period 3.2 years through CNC automation..."
    }
  ],
  "tb_investment_master": [
    {
      "key": "name",
      "label": "Corporate Investment Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. HDFC Treasury Liquid Mutual Fund"
    },
    {
      "key": "code",
      "label": "Investment Portfolio Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. INV-HD-LIQ-01"
    },
    {
      "key": "institution",
      "label": "Financial Institution / AMC",
      "type": "text",
      "required": true,
      "placeholder": "e.g. HDFC Asset Management Company Ltd"
    },
    {
      "key": "instrument_type",
      "label": "Asset Class Instrument",
      "type": "select",
      "options": [
        "Fixed Deposit (FD)",
        "Liquid Mutual Fund",
        "Treasury Bills",
        "Sovereign Gold Bonds",
        "Inter-Corporate Deposit (ICD)"
      ],
      "defaultValue": "Fixed Deposit (FD)"
    },
    {
      "key": "amount",
      "label": "Principal Investment Amount (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 25000000.00"
    },
    {
      "key": "interest_rate",
      "label": "Yield / Coupon Interest Rate (%)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 7.65"
    },
    {
      "key": "expiry_date",
      "label": "Maturity / Liquidation Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Investment Health",
      "type": "select",
      "options": [
        "ACTIVE_HOLDING",
        "MATURED_REDEMPTION_PENDING",
        "LIQUIDATED"
      ],
      "defaultValue": "ACTIVE_HOLDING"
    },
    {
      "key": "description",
      "label": "FDR Certificate No & Lien Details",
      "type": "textarea",
      "placeholder": "FDR Certificate #HDFC-FD-99201. Unencumbered corporate reserve..."
    }
  ],
  "tb_loan_master": [
    {
      "key": "name",
      "label": "Credit Facility Agreement Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Term Loan for Plant CNC Machinery"
    },
    {
      "key": "code",
      "label": "Loan Account Number",
      "type": "text",
      "required": true,
      "placeholder": "e.g. LN-SBI-2026-904"
    },
    {
      "key": "bank_name",
      "label": "Lending Bank / Institution",
      "type": "text",
      "required": true,
      "placeholder": "e.g. State Bank of India"
    },
    {
      "key": "loan_type",
      "label": "Credit Facility Classification",
      "type": "select",
      "options": [
        "Machinery Term Loan",
        "Working Capital Cash Credit (CC)",
        "Packing Credit for Exports",
        "Corporate Working Capital Loan"
      ],
      "defaultValue": "Machinery Term Loan"
    },
    {
      "key": "amount",
      "label": "Sanctioned Loan Principal (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 35000000.00"
    },
    {
      "key": "interest_rate",
      "label": "Annual Interest Rate (MCLR + Spread) (%)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 8.95"
    },
    {
      "key": "emi_amount",
      "label": "Monthly Repayment EMI (INR)",
      "type": "number",
      "placeholder": "e.g. 724800.00"
    },
    {
      "key": "start_date",
      "label": "First Disbursement Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Facility Service Status",
      "type": "select",
      "options": [
        "ACTIVE_REGULAR",
        "PARTIALLY_PREPAID",
        "CLOSED_NOC_RECEIVED"
      ],
      "defaultValue": "ACTIVE_REGULAR"
    },
    {
      "key": "description",
      "label": "Primary Security & Hypothecation Charge",
      "type": "textarea",
      "placeholder": "First exclusive hypothecation charge on CNC Milling Machine AST-004..."
    }
  ],
  "tb_capital_contribution": [
    {
      "key": "name",
      "label": "Partner / Shareholder Equity Record",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Series-A Founder Equity Inward"
    },
    {
      "key": "code",
      "label": "Capital Certificate Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. CAP-EQUITY-001"
    },
    {
      "key": "partner_name",
      "label": "Shareholder / Partner Legal Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Rajesh Sharma"
    },
    {
      "key": "amount",
      "label": "Capital Contribution Amount (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 50000000.00"
    },
    {
      "key": "share_percentage",
      "label": "Equity Ownership Stake (%)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 100.00"
    },
    {
      "key": "date",
      "label": "Capital Realization Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Share Allotment Status",
      "type": "select",
      "options": [
        "SHARES_ALLOTTED_PAS3_FILED",
        "APPLICATION_MONEY_PENDING",
        "CANCELLED"
      ],
      "defaultValue": "SHARES_ALLOTTED_PAS3_FILED"
    },
    {
      "key": "description",
      "label": "MCA Form PAS-3 Filing Reference",
      "type": "textarea",
      "placeholder": "Return of allotment filed with Registrar of Companies under SRN #R99201948..."
    }
  ],
  "tb_employee_request": [
    {
      "key": "name",
      "label": "Helpdesk Service Request Subject",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Dual-Monitor Setup for CAD Workstation"
    },
    {
      "key": "code",
      "label": "Service Ticket ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. REQ-IT-2026-042"
    },
    {
      "key": "employee_name",
      "label": "Requester Employee Full Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Anand Venkatesh"
    },
    {
      "key": "request_type",
      "label": "Helpdesk Support Category",
      "type": "select",
      "options": [
        "IT Hardware & Software",
        "HR & Policy Query",
        "Facilities & Maintenance",
        "Finance & Reimbursement Assistance",
        "Travel Desk Booking"
      ],
      "defaultValue": "IT Hardware & Software"
    },
    {
      "key": "priority",
      "label": "Urgency Priority",
      "type": "select",
      "options": [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL_URGENT"
      ],
      "defaultValue": "MEDIUM"
    },
    {
      "key": "status",
      "label": "Ticket Resolution Status",
      "type": "select",
      "options": [
        "OPEN_SUBMITTED",
        "IN_PROGRESS",
        "WAITING_ON_USER",
        "RESOLVED_CLOSED"
      ],
      "defaultValue": "OPEN_SUBMITTED"
    },
    {
      "key": "description",
      "label": "Technical Need Justification",
      "type": "textarea",
      "placeholder": "Required for 3D SolidWorks tool path simulations..."
    }
  ],
  "tb_leave_application": [
    {
      "key": "name",
      "label": "Leave Application Subject",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Medical Recovery Leave Application"
    },
    {
      "key": "code",
      "label": "Application Ticket No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. LAP-2026-081"
    },
    {
      "key": "employee_name",
      "label": "Applicant Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Suresh Patel"
    },
    {
      "key": "leave_type",
      "label": "Leave Classification",
      "type": "select",
      "options": [
        "Privilege / Annual Leave",
        "Casual Leave",
        "Sick Leave",
        "Maternity / Paternity Leave",
        "Compensatory Off"
      ],
      "defaultValue": "Privilege / Annual Leave"
    },
    {
      "key": "start_date",
      "label": "First Day of Leave",
      "type": "date",
      "required": true
    },
    {
      "key": "end_date",
      "label": "Last Day of Leave",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Manager Sanction Status",
      "type": "select",
      "options": [
        "PENDING_SUPERVISOR",
        "APPROVED",
        "REJECTED"
      ],
      "defaultValue": "PENDING_SUPERVISOR"
    },
    {
      "key": "description",
      "label": "Emergency Contact & Relief Operator",
      "type": "textarea",
      "placeholder": "Contactable on mobile for emergency technical queries..."
    }
  ],
  "tb_gate_pass": [
    {
      "key": "name",
      "label": "Security Gate Pass Subject",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Visitor Pass - Haas Maintenance Engineer"
    },
    {
      "key": "code",
      "label": "Gate Pass Serial No",
      "type": "text",
      "required": true,
      "placeholder": "e.g. GP-2026-0419"
    },
    {
      "key": "visitor_name",
      "label": "Visitor / Driver Full Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Vikramaditya Sharma"
    },
    {
      "key": "vehicle_number",
      "label": "Vehicle Number (if driving)",
      "type": "text",
      "placeholder": "e.g. TN-05-AA-9901"
    },
    {
      "key": "purpose",
      "label": "Premises Purpose",
      "type": "select",
      "options": [
        "Vendor Maintenance & Servicing",
        "Client Commercial Meeting",
        "Material Inward Delivery",
        "Audit & Government Inspection",
        "Interview Candidate"
      ],
      "defaultValue": "Vendor Maintenance & Servicing"
    },
    {
      "key": "date",
      "label": "Visit Date & Entry Time",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Gate Security Status",
      "type": "select",
      "options": [
        "ENTRY_ALLOWED",
        "INSIDE_PREMISES",
        "EXITED_GATE_CLOSED",
        "DENIED_ENTRY"
      ],
      "defaultValue": "INSIDE_PREMISES"
    },
    {
      "key": "description",
      "label": "Host Employee & Belongings Carried",
      "type": "textarea",
      "placeholder": "Carrying tool calibration kit #CAL-88. Host: Anand Venkatesh..."
    }
  ],
  "tb_approval_action": [
    {
      "key": "name",
      "label": "Executive Approval Action Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Sign-Off for PO-2026-1049"
    },
    {
      "key": "code",
      "label": "Approval Tracking Hash",
      "type": "text",
      "required": true,
      "placeholder": "e.g. APP-PO-9921"
    },
    {
      "key": "request_type",
      "label": "Transaction Type",
      "type": "select",
      "options": [
        "Purchase Order Approval",
        "Sales Invoice Final Signing",
        "Expense Claim Reimbursement",
        "High-Value Accounting Voucher",
        "Employee Leave Escalation"
      ],
      "defaultValue": "Purchase Order Approval"
    },
    {
      "key": "document_ref",
      "label": "Source Document Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PO-2026-1049"
    },
    {
      "key": "approver_name",
      "label": "Deciding Approver Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Rajesh Sharma"
    },
    {
      "key": "date",
      "label": "Action Decision Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Approval Status",
      "type": "select",
      "options": [
        "APPROVED",
        "REJECTED_RETURNED_FOR_EDIT",
        "DELEGATED_TO_AUDITOR"
      ],
      "defaultValue": "APPROVED"
    },
    {
      "key": "description",
      "label": "Executive Decision Rationale & Comments",
      "type": "textarea",
      "placeholder": "Approved after verifying competitive quote with Jindal Steel..."
    }
  ],
  "tb_employee_document": [
    {
      "key": "name",
      "label": "Employee Dossier Document Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. B.E. Mechanical Degree & Aadhaar Record"
    },
    {
      "key": "code",
      "label": "Document Vault Identifier",
      "type": "text",
      "required": true,
      "placeholder": "e.g. DOC-EMP-042-01"
    },
    {
      "key": "employee_name",
      "label": "Associated Employee Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Anand Venkatesh"
    },
    {
      "key": "document_type",
      "label": "Document Classification",
      "type": "select",
      "options": [
        "Government Identity (Aadhaar / Passport)",
        "Educational Certificates & Degrees",
        "Prior Employment Relieving Letters",
        "Form 16 Tax Certificates",
        "Confidential Non-Disclosure Agreement (NDA)"
      ],
      "defaultValue": "Government Identity (Aadhaar / Passport)"
    },
    {
      "key": "date",
      "label": "Verification & Upload Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "HR Verification Status",
      "type": "select",
      "options": [
        "VERIFIED_ORIGINAL_SIGHTED",
        "PENDING_HR_VERIFICATION",
        "REJECTED_BLURRY"
      ],
      "defaultValue": "VERIFIED_ORIGINAL_SIGHTED"
    },
    {
      "key": "description",
      "label": "Vault Cryptographic File Reference",
      "type": "textarea",
      "placeholder": "Encrypted document stored in isolated compliance file vault..."
    }
  ],
  "tb_employee_appraisal": [
    {
      "key": "name",
      "label": "Annual Appraisal Cycle Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. FY 2026 Annual Performance Review"
    },
    {
      "key": "code",
      "label": "Appraisal Record Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. APR-2026-042"
    },
    {
      "key": "employee_name",
      "label": "Appraisee Employee Full Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Anand Venkatesh"
    },
    {
      "key": "review_period",
      "label": "Review Appraisal Cycle",
      "type": "text",
      "required": true,
      "placeholder": "e.g. April 2025 - March 2026"
    },
    {
      "key": "rating",
      "label": "Consolidated Performance Rating",
      "type": "select",
      "options": [
        "Rating 5 (Outstanding Exceeds Expectations)",
        "Rating 4 (Very Good Strong Performer)",
        "Rating 3 (Meets Job Standards)",
        "Rating 2 (Performance Improvement Required)",
        "Rating 1 (Unsatisfactory)"
      ],
      "defaultValue": "Rating 5 (Outstanding Exceeds Expectations)"
    },
    {
      "key": "reviewer_name",
      "label": "Evaluating Manager Full Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Rajesh Sharma"
    },
    {
      "key": "status",
      "label": "Appraisal Cycle Stage",
      "type": "select",
      "options": [
        "SELF_EVALUATION_COMPLETE",
        "MANAGER_RATED",
        "PROMOTION_HIKE_SANCTIONED",
        "CLOSED_ARCHIVED"
      ],
      "defaultValue": "PROMOTION_HIKE_SANCTIONED"
    },
    {
      "key": "description",
      "label": "Key Achievements & Recommended Salary Increment",
      "type": "textarea",
      "placeholder": "Led shopfloor automation reducing cycle time by 18%. Recommended 15% merit hike..."
    }
  ],
  "tb_subscription": [
    {
      "key": "name",
      "label": "Enterprise Subscription Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Zuno ERP Enterprise Cloud Plan"
    },
    {
      "key": "code",
      "label": "Subscription License Key",
      "type": "text",
      "required": true,
      "placeholder": "e.g. SUB-ZUNO-2026-ENT"
    },
    {
      "key": "tenant_name",
      "label": "Subscribing Tenant Organization",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Acme Global Enterprises Ltd"
    },
    {
      "key": "plan_name",
      "label": "Selected SaaS Tier Plan",
      "type": "select",
      "options": [
        "Enterprise Multi-Tenant All-Module Suite",
        "Manufacturing Professional Suite",
        "Financials & Compliance Core",
        "Starter Cloud Suite"
      ],
      "defaultValue": "Enterprise Multi-Tenant All-Module Suite"
    },
    {
      "key": "amount",
      "label": "Annual Subscription Fee (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 240000.00"
    },
    {
      "key": "start_date",
      "label": "Activation Start Date",
      "type": "date",
      "required": true
    },
    {
      "key": "expiry_date",
      "label": "Annual Renewal Due Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Subscription SLA Status",
      "type": "select",
      "options": [
        "ACTIVE_PAID",
        "GRACE_PERIOD",
        "SUSPENDED_OVERDUE",
        "CANCELLED"
      ],
      "defaultValue": "ACTIVE_PAID"
    },
    {
      "key": "description",
      "label": "Entitled User Seats & SLA Terms",
      "type": "textarea",
      "placeholder": "Unlimited users, 19 integrated modules, 99.99% cloud uptime SLA..."
    }
  ],
  "tb_subscription_plan": [
    {
      "key": "name",
      "label": "Commercial Plan Package Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Zuno Global Enterprise Tier"
    },
    {
      "key": "code",
      "label": "Plan SKU Identifier Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PLAN-ENT-ALL"
    },
    {
      "key": "billing_cycle",
      "label": "Billing Recurrence",
      "type": "select",
      "options": [
        "Monthly Recurring",
        "Quarterly Invoiced",
        "Annual Prepaid (15% Savings)",
        "Multi-Year Enterprise Contract"
      ],
      "defaultValue": "Annual Prepaid (15% Savings)"
    },
    {
      "key": "amount",
      "label": "List Price (INR / Year)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 240000.00"
    },
    {
      "key": "user_limit",
      "label": "Included User License Seats",
      "type": "number",
      "defaultValue": "50",
      "placeholder": "e.g. 50"
    },
    {
      "key": "storage_limit",
      "label": "Included Cloud Storage (GB)",
      "type": "number",
      "defaultValue": "500",
      "placeholder": "e.g. 500"
    },
    {
      "key": "status",
      "label": "Offer Status",
      "type": "select",
      "options": [
        "ACTIVE_PUBLISHED",
        "LEGACY_GRANDFATHERED",
        "SUNSET"
      ],
      "defaultValue": "ACTIVE_PUBLISHED"
    },
    {
      "key": "description",
      "label": "Feature Entitlements & API Limits",
      "type": "textarea",
      "placeholder": "Includes all 243 approved database catalogue tables and unlimited API outbox sync..."
    }
  ],
  "tb_subscription_module": [
    {
      "key": "name",
      "label": "Module License Feature Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Advanced Production & MRP II Module"
    },
    {
      "key": "code",
      "label": "Module Identifier Key",
      "type": "text",
      "required": true,
      "placeholder": "e.g. MOD-PROD-MRP"
    },
    {
      "key": "module_name",
      "label": "Functional Module Name",
      "type": "select",
      "options": [
        "production",
        "banking",
        "payroll",
        "compliance",
        "statutory",
        "investment",
        "portal",
        "subscriptions",
        "reports"
      ],
      "defaultValue": "production"
    },
    {
      "key": "date",
      "label": "Module Provisioning Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Module License State",
      "type": "select",
      "options": [
        "ENABLED_PROVISIONED",
        "DISABLED_INACTIVE",
        "TRIAL_EVALUATION"
      ],
      "defaultValue": "ENABLED_PROVISIONED"
    },
    {
      "key": "description",
      "label": "Role Permissions & Access Bounds",
      "type": "textarea",
      "placeholder": "Provisioned across all registered company entities and branches..."
    }
  ],
  "tb_payment": [
    {
      "key": "name",
      "label": "Subscription Billing Transaction Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Annual ERP License Fee - FY26"
    },
    {
      "key": "code",
      "label": "Payment Gateway Transaction ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PAY-RZP-2026-90418"
    },
    {
      "key": "amount",
      "label": "Amount Paid (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 240000.00"
    },
    {
      "key": "payment_method",
      "label": "Payment Gateway Channel",
      "type": "select",
      "options": [
        "Razorpay Payment Gateway",
        "Corporate NetBanking (HDFC)",
        "Credit Card Corporate Amex",
        "Automated NACH / e-Mandate"
      ],
      "defaultValue": "Razorpay Payment Gateway"
    },
    {
      "key": "date",
      "label": "Payment Settlement Date",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Payment Status",
      "type": "select",
      "options": [
        "SETTLED_SUCCESS",
        "REFUNDED",
        "FAILED"
      ],
      "defaultValue": "SETTLED_SUCCESS"
    },
    {
      "key": "description",
      "label": "Tax Invoice & GST Breakup",
      "type": "textarea",
      "placeholder": "Includes 18% IGST of INR 36,610.17. Tax Invoice #ZUNO-INV-2026-904..."
    }
  ],
  "tb_payment_webhook": [
    {
      "key": "name",
      "label": "Payment Webhook Callback Title",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Razorpay Payment Captured Event"
    },
    {
      "key": "code",
      "label": "Webhook Event ID",
      "type": "text",
      "required": true,
      "placeholder": "e.g. EVT-RZP-2026-9921"
    },
    {
      "key": "gateway",
      "label": "Payment Gateway Provider",
      "type": "select",
      "options": [
        "Razorpay",
        "Stripe",
        "PayU Enterprise",
        "Cashfree"
      ],
      "defaultValue": "Razorpay"
    },
    {
      "key": "event_type",
      "label": "Webhook Event Name",
      "type": "select",
      "options": [
        "payment.captured",
        "invoice.paid",
        "subscription.renewed",
        "payment.failed"
      ],
      "defaultValue": "payment.captured"
    },
    {
      "key": "portal_url",
      "label": "Callback Webhook Endpoint URL",
      "type": "text",
      "required": true,
      "placeholder": "https://api.zuno.in/v1/subscriptions/webhooks/razorpay"
    },
    {
      "key": "date",
      "label": "Receipt Timestamp",
      "type": "date",
      "required": true
    },
    {
      "key": "status",
      "label": "Processing Status",
      "type": "select",
      "options": [
        "PROCESSED_SUCCESS",
        "FAILED_RETRY_QUEUED",
        "IGNORED_DUPLICATE"
      ],
      "defaultValue": "PROCESSED_SUCCESS"
    },
    {
      "key": "description",
      "label": "Cryptographic HMAC-SHA256 Signature",
      "type": "textarea",
      "placeholder": "HMAC signature validated against shared webhook secret..."
    }
  ],
  "tb_sales_summary": [
    {
      "key": "name",
      "label": "Executive Sales Summary Report",
      "type": "text",
      "required": true,
      "placeholder": "e.g. November 2026 Consolidated Sales MIS"
    },
    {
      "key": "code",
      "label": "Report Snapshot Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. MIS-SLS-2026-M11"
    },
    {
      "key": "period",
      "label": "Reporting Period",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 2026-11"
    },
    {
      "key": "amount",
      "label": "Total Invoiced Revenue (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 48500000.00"
    },
    {
      "key": "quantity",
      "label": "Total Invoices Executed",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 312"
    },
    {
      "key": "top_customer",
      "label": "Top Purchasing Customer Entity",
      "type": "text",
      "placeholder": "e.g. Tata Motors Engineering Ltd"
    },
    {
      "key": "status",
      "label": "Report Sign-Off",
      "type": "select",
      "options": [
        "AUDITED_FINAL",
        "PROVISIONAL_ESTIMATE",
        "BOARD_PRESENTED"
      ],
      "defaultValue": "AUDITED_FINAL"
    },
    {
      "key": "description",
      "label": "Key Growth Drivers & Margin Analysis",
      "type": "textarea",
      "placeholder": "14.2% month-on-month growth driven by automotive sector actuator orders..."
    }
  ],
  "tb_purchase_summary": [
    {
      "key": "name",
      "label": "Procurement & Spend Audit Report",
      "type": "text",
      "required": true,
      "placeholder": "e.g. November 2026 Procurement MIS"
    },
    {
      "key": "code",
      "label": "Purchase Summary Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. MIS-PUR-2026-M11"
    },
    {
      "key": "period",
      "label": "Reporting Period",
      "type": "text",
      "required": true,
      "placeholder": "e.g. 2026-11"
    },
    {
      "key": "amount",
      "label": "Total Procurement Outflow (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 28450000.00"
    },
    {
      "key": "quantity",
      "label": "Total POs Dispatched Count",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 184"
    },
    {
      "key": "top_supplier",
      "label": "Primary Raw Material Vendor",
      "type": "text",
      "placeholder": "e.g. Jindal Steel & Power Ltd"
    },
    {
      "key": "status",
      "label": "Procurement Audit Status",
      "type": "select",
      "options": [
        "AUDITED_FINAL",
        "PRELIMINARY_DRAFT"
      ],
      "defaultValue": "AUDITED_FINAL"
    },
    {
      "key": "description",
      "label": "Commodity Price Trends & Cost Savings",
      "type": "textarea",
      "placeholder": "Negotiated bulk steel purchase rate saving INR 420,000 against spot market..."
    }
  ],
  "tb_inventory_valuation": [
    {
      "key": "name",
      "label": "Perpetual Inventory Valuation Snapshot",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Q3 End Inventory Valuation (AS-2 Standard)"
    },
    {
      "key": "code",
      "label": "Valuation Snapshot Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. VAL-INV-2026-Q3"
    },
    {
      "key": "date",
      "label": "Valuation As-On Cutoff Date",
      "type": "date",
      "required": true
    },
    {
      "key": "quantity",
      "label": "Active Active SKUs Count",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 480"
    },
    {
      "key": "amount",
      "label": "Total Inventory Valuation (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 64200000.00"
    },
    {
      "key": "method",
      "label": "Accounting Valuation Method",
      "type": "select",
      "options": [
        "Weighted Average Cost (WAC)",
        "First In First Out (FIFO)",
        "Standard Costing"
      ],
      "defaultValue": "Weighted Average Cost (WAC)"
    },
    {
      "key": "status",
      "label": "Statutory Auditor Certification",
      "type": "select",
      "options": [
        "AUDITED_CERTIFIED",
        "PHYSICAL_VERIFICATION_IN_PROGRESS"
      ],
      "defaultValue": "AUDITED_CERTIFIED"
    },
    {
      "key": "description",
      "label": "Accounting Standard AS-2 Compliance Notes",
      "type": "textarea",
      "placeholder": "Valued at lower of cost or net realizable value in compliance with ICAI AS-2..."
    }
  ],
  "tb_profit_loss": [
    {
      "key": "name",
      "label": "Statement of Profit and Loss (P&L)",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Q3 FY 2026-27 Executive P&L Statement"
    },
    {
      "key": "code",
      "label": "P&L Statement Code",
      "type": "text",
      "required": true,
      "placeholder": "e.g. PNL-2026-Q3"
    },
    {
      "key": "fiscal_period",
      "label": "Financial Reporting Quarter",
      "type": "text",
      "required": true,
      "placeholder": "e.g. Q3 (Oct - Dec 2026)"
    },
    {
      "key": "total_revenue",
      "label": "Total Operational Revenue (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 145000000.00"
    },
    {
      "key": "total_expenses",
      "label": "Total Operating & Manufacturing Expenses (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 112000000.00"
    },
    {
      "key": "amount",
      "label": "Net Profit Before Tax (PBT) (INR)",
      "type": "number",
      "required": true,
      "placeholder": "e.g. 33000000.00"
    },
    {
      "key": "status",
      "label": "Statutory Board Approval Status",
      "type": "select",
      "options": [
        "BOARD_APPROVED",
        "AUDITOR_REVIEWED",
        "UNAUDITED_MANAGEMENT_MIS"
      ],
      "defaultValue": "BOARD_APPROVED"
    },
    {
      "key": "description",
      "label": "EBITDA Margin & Shareholder Value Notes",
      "type": "textarea",
      "placeholder": "Consolidated EBITDA margin achieved 24.8%. Corporate income tax provision: INR 8.25 Cr..."
    }
  ]
};
