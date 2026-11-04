# ZUNO ERP — Database Relationship Architecture & ERD

## 1. Multi-Tenant Core & Organization Boundary

```mermaid
erDiagram
    tb_tenant ||--o{ tb_company : "owns"
    tb_tenant ||--o{ tb_tenant_owner : "has contact"
    tb_tenant ||--o{ tb_user : "contains"
    tb_tenant ||--o{ tb_role : "defines"
    tb_tenant ||--o{ tb_subscription : "contracts"
    
    tb_company ||--o{ tb_company_branch : "operates"
    tb_company ||--o{ tb_company_financial_year : "configures"
    tb_company ||--o{ tb_company_address : "locates"
    tb_company ||--o{ tb_company_registration : "holds"
    tb_company ||--o{ tb_company_settings : "governs"
    tb_company ||--o{ tb_company_bank_account : "maintains"

    tb_user ||--o{ tb_user_credential : "authenticates"
    tb_user ||--o{ tb_user_session : "sessions"
    tb_user ||--o{ tb_user_role : "assigned"
    tb_user ||--o{ tb_user_company_access : "scoped to"
    tb_user ||--o{ tb_user_branch_access : "branch scoped"
```

## 2. SaaS Entitlement & Subscription Lifecycle

```mermaid
erDiagram
    tb_module_category ||--o{ tb_module : "categorizes"
    tb_module ||--o{ tb_submodule : "subdivides"
    tb_submodule ||--o{ tb_module_feature : "features"
    tb_module ||--o{ tb_module_price : "prices"
    tb_module ||--o{ tb_module_dependency : "requires"

    tb_subscription ||--o{ tb_subscription_item : "lines"
    tb_subscription ||--o{ tb_subscription_entitlement : "grants"
    tb_subscription ||--o{ tb_invoice : "bills"
    tb_invoice ||--o{ tb_invoice_detail : "line items"
    tb_invoice ||--o{ tb_payment : "settles"
    tb_payment ||--o{ tb_payment_attempt : "attempts"
    tb_payment_webhook ||--o{ tb_payment : "verifies"
```

## 3. Product, Inventory & Supply Chain Flow

```mermaid
erDiagram
    tb_product_category ||--o{ tb_product_subcategory : "categorizes"
    tb_product_subcategory ||--o{ tb_product_master : "classifies"
    tb_product_master ||--o{ tb_product_variant : "variants"
    tb_product_master ||--o{ tb_product_price : "pricing"
    tb_product_master ||--o{ tb_stock_balance : "balances"
    tb_product_master ||--o{ tb_stock_ledger : "ledger"

    tb_purchase_request ||--o{ tb_purchase_request_detail : "items"
    tb_purchase_order ||--o{ tb_purchase_order_detail : "items"
    tb_purchase_order ||--o{ tb_goods_receipt : "receives"
    tb_goods_receipt ||--o{ tb_goods_receipt_detail : "lines"
    tb_goods_receipt ||--o{ tb_stock_inward : "creates inventory"
    tb_supplier_invoice ||--o{ tb_supplier_invoice_detail : "lines"
```

## 4. Sales, Invoicing & Delivery Workflow

```mermaid
erDiagram
    tb_customer_master ||--o{ tb_sales_enquiry : "inquires"
    tb_customer_master ||--o{ tb_sales_quotation : "quoted"
    tb_sales_quotation ||--o{ tb_sales_order : "confirms"
    tb_sales_order ||--o{ tb_sales_order_detail : "items"
    tb_sales_order ||--o{ tb_sales_delivery : "fulfills"
    tb_sales_order ||--o{ tb_sales_invoice : "bills"
    tb_sales_invoice ||--o{ tb_sales_invoice_detail : "lines"
    tb_sales_invoice ||--o{ tb_customer_receipt : "collected"
    tb_customer_receipt ||--o{ tb_customer_receipt_allocation : "allocates"
```

## 5. HR, Attendance & Payroll Lifecycle

```mermaid
erDiagram
    tb_department ||--o{ tb_employee_master : "employs"
    tb_designation ||--o{ tb_employee_master : "ranks"
    tb_employee_master ||--o{ tb_employee_personal : "profile"
    tb_employee_master ||--o{ tb_employee_bank : "payout account"
    tb_employee_master ||--o{ tb_employee_salary : "compensation"
    
    tb_shift_master ||--o{ tb_shift_roster : "schedules"
    tb_shift_roster ||--o{ tb_attendance : "tracks"
    tb_attendance ||--o{ tb_attendance_punch : "logs"
    
    tb_payroll_run ||--o{ tb_payroll_detail : "payslips"
    tb_payroll_detail ||--o{ tb_payroll_component_detail : "breakdowns"
    tb_payroll_run ||--o{ tb_pf_contribution : "statutory PF"
    tb_payroll_run ||--o{ tb_esi_contribution : "statutory ESI"
```

## 6. General Ledger & Double-Entry Accounting

```mermaid
erDiagram
    tb_account_group ||--o{ tb_account_ledger : "groups"
    tb_voucher_type ||--o{ tb_accounting_voucher : "types"
    tb_accounting_voucher ||--o{ tb_accounting_voucher_detail : "debits/credits"
    tb_company_bank_account ||--o{ tb_bank_statement : "imports"
    tb_bank_statement ||--o{ tb_bank_statement_detail : "lines"
    tb_bank_statement_detail ||--o{ tb_bank_reconciliation : "reconciles"
```

