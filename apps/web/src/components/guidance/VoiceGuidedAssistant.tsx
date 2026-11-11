import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  CheckCircle2,
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
  Laptop,
  Banknote,
  FileCheck2,
  Scale,
  TrendingUp,
  Search,
  ExternalLink,
  HelpCircle,
  Activity,
  Sliders,
  Compass
} from 'lucide-react';

export interface ModuleGuideData {
  id: string;
  name: string;
  phase: string;
  phaseNumber: number;
  icon: React.ElementType;
  catalogueCount: number;
  keyTables: string[];
  summary: string;
  description: string;
  whyWeNeedIt: {
    title: string;
    points: string[];
    complianceValue: string;
  };
  howWeUseIt: {
    steps: Array<{ step: number; title: string; detail: string }>;
  };
  audioOverviewScript: string;
  audioWhyScript: string;
  audioHowScript: string;
}

export const MODULE_GUIDE_CATALOGUE: ModuleGuideData[] = [
  {
    id: 'company',
    name: 'Company Management',
    phase: 'Core Setup & Admin',
    phaseNumber: 1,
    icon: Building2,
    catalogueCount: 10,
    keyTables: ['tb_company', 'tb_company_branch', 'tb_company_registration', 'tb_company_financial_year', 'tb_company_settings'],
    summary: 'Centralized multi-entity corporate master, legal registrations, branch network, and fiscal calendars.',
    description: 'Company Management forms the structural backbone of Zuno ERP. It allows enterprises to model holding corporations, regional subsidiaries, domestic and international operating branches, and multi-state GST registrations under strict multi-tenant isolation. All subsequent ERP transactions inherit statutory configurations and fiscal year boundaries defined here.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Company Management',
      points: [
        'Multi-Entity Consolidation: Manage unlimited legal entities and branches from a single unified workspace without data contamination.',
        'Statutory Registration Tracking: Enforces valid CIN, GSTIN, and PAN compliance across all states as mandated by corporate law.',
        'Fiscal Year Integrity: Automates financial year lockouts and period rollovers to prevent backdated fraudulent postings.',
        'Audit-Ready Isolation: Ensures strict data sovereignty for external tax audits and corporate governance.'
      ],
      complianceValue: 'Compliant with Companies Act 2013, GST Rule 138, and statutory corporate registry requirements.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Legal Entity Master Setup', detail: 'Register your primary company legal name, CIN, PAN, and corporate headquarters address in tb_company.' },
        { step: 2, title: 'Branch & Warehouse Provisioning', detail: 'Add operating branches with state-specific GSTIN codes and assign local branch managers.' },
        { step: 3, title: 'Fiscal Year & Currency Lock', detail: 'Establish the active financial year (e.g. FY 2026-27), reporting currency (INR/USD), and period freeze rules.' },
        { step: 4, title: 'Multi-Company Switching', detail: 'Use the top-bar entity switcher to switch workspaces in real-time or review consolidated group health.' }
      ]
    },
    audioOverviewScript: 'Welcome to Company Management. This foundational module governs your legal corporate hierarchy, branch infrastructure, and fiscal year calendars. It allows you to model parent corporations and regional operating subsidiaries with strict multi-tenant data boundaries.',
    audioWhyScript: 'Why do we need Company Management? In any growing business, operating multiple entities across different states introduces tax and regulatory complexity. This module enforces valid corporate identification numbers, PANs, and state-specific GSTINs. It automates fiscal year rollovers and eliminates the risk of backdated unauthorized accounting entries.',
    audioHowScript: 'How to use Company Management: Step 1, create your primary corporate entity and tax identifiers. Step 2, provision operating branches and warehouse locations. Step 3, configure your active fiscal calendar and default currencies. Step 4, utilize the entity selector in the top bar to transition between company workspaces effortlessly.'
  },
  {
    id: 'subscriptions',
    name: 'SaaS & Subscriptions',
    phase: 'Core Setup & Admin',
    phaseNumber: 1,
    icon: CreditCard,
    catalogueCount: 24,
    keyTables: ['tb_subscription', 'tb_subscription_plan', 'tb_subscription_invoice', 'tb_subscription_payment', 'tb_subscription_feature'],
    summary: 'Enterprise SaaS tier management, module entitlement gates, user seat quotas, and recurring billing.',
    description: 'The SaaS and Subscriptions module governs tenant licensing, plan tiers (Starter, Growth, Enterprise Cloud), feature flags, and automated recurring invoices. It ensures organizations maintain active subscription contracts and provides self-service plan upgrades as operations scale.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs SaaS & Subscriptions',
      points: [
        'Automated License Governance: Controls user seat limits, storage quotas, and unlocked enterprise modules dynamically.',
        'Predictable Financial Cashflows: Tracks recurring software expenditures and automated tax invoice receipts.',
        'Instant Module Activation: Upgrade plans with zero downtime to unlock advanced modules like BOM manufacturing or statutory reporting.',
        'Zero Over-Billing Risk: Provides transparent prorated usage logs and renewal alert reminders.'
      ],
      complianceValue: 'Supports automated GST B2B tax invoice generation and automated payment ledger entries.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Review Active Subscription Tier', detail: 'Examine current plan limits, active user seats, and enabled ERP modules.' },
        { step: 2, title: 'Select Target Enterprise Tier', detail: 'Choose from Growth or Enterprise tiers to increase branch quotas and processing bandwidth.' },
        { step: 3, title: 'Automated Billing & Invoicing', detail: 'Generate compliant tax invoices with GST breakdown and automated payment reconciliation.' },
        { step: 4, title: 'Feature Gate Synchronization', detail: 'The system instantly unlocks corresponding API capabilities and module routes without downtime.' }
      ]
    },
    audioOverviewScript: 'SaaS and Subscriptions oversees your ERP service tier, user seat allocation, and feature entitlements. It ensures smooth billing continuity and dynamic module access.',
    audioWhyScript: 'Why do we need Subscriptions? To prevent service interruptions and govern organization-wide access limits. This module guarantees transparent pricing, automated GST tax invoicing, and seamless self-service capacity upgrades.',
    audioHowScript: 'How to use Subscriptions: Step 1, inspect your active subscription plan and resource utilization. Step 2, compare enterprise tiers for higher user allowances. Step 3, process renewals through automated payment gateways. Step 4, immediately leverage newly unlocked ERP features across your company branches.'
  },
  {
    id: 'admin',
    name: 'Administration & RBAC',
    phase: 'Core Setup & Admin',
    phaseNumber: 1,
    icon: UserCog,
    catalogueCount: 14,
    keyTables: ['tb_user', 'tb_role', 'tb_permission', 'tb_approval_workflow', 'tb_login_history'],
    summary: 'Zero-trust role-based access control, user credentials, approval matrix, and comprehensive audit logs.',
    description: 'Administration and RBAC provides military-grade access control for your enterprise. System administrators can create granular permission roles, invite team members across departments, enforce strong password policies, and track every user authentication and data modification with forensic audit timestamps.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Administration & RBAC',
      points: [
        'Data Security & Zero Unauthorized Access: Prevents non-finance employees from viewing salaries or sensitive profit ledgers.',
        'Maker-Checker Separation of Duties: Enforces two-person approval rules before high-value purchase orders or payments can execute.',
        'Forensic Tamper Detection: Records every login, IP address, user-agent, and data modification timestamp for compliance auditors.',
        'Instant Offboarding: Revoke access immediately when an employee departs, safeguarding intellectual property and financial data.'
      ],
      complianceValue: 'Compliant with ISO 27001, SOC 2 Type II, and Companies Act internal financial control mandates.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Configure Role Permissions', detail: 'Define functional roles like Finance Manager, Store Incharge, and Production Supervisor in tb_role.' },
        { step: 2, title: 'User Account Provisioning', detail: 'Invite employees with unique corporate emails and assign them to specific branch roles.' },
        { step: 3, title: 'Set Approval Thresholds', detail: 'Establish workflow rules (e.g. purchases exceeding ₹50,000 require CFO sign-off).' },
        { step: 4, title: 'Monitor Security Logs', detail: 'Review real-time login histories and permission changes to detect anomalies.' }
      ]
    },
    audioOverviewScript: 'Administration and Role-Based Access Control is the security shield of Zuno ERP. It enforces zero-trust permissions, dual approvals, and comprehensive audit logging.',
    audioWhyScript: 'Why do we need RBAC? In an enterprise, sensitive financial, employee, and client records must never be exposed indiscriminately. This module enforces strict separation of duties, maker-checker authorization, and forensic security logging required for statutory audits.',
    audioHowScript: 'How to use Administration: Step 1, create designated roles with tailored permissions. Step 2, onboard users with corporate emails and role bindings. Step 3, set multi-tier approval thresholds for high-value transactions. Step 4, periodically review the immutable login history and access logs.'
  },
  {
    id: 'products',
    name: 'Product & Material Master',
    phase: 'Master Records',
    phaseNumber: 2,
    icon: Package,
    catalogueCount: 12,
    keyTables: ['tb_product_master', 'tb_product_category', 'tb_product_variant', 'tb_product_unit', 'tb_product_price'],
    summary: 'SKU cataloging, raw materials, bill-of-materials items, HSN/SAC codes, price lists, and batch rules.',
    description: 'The Product & Material Master centralizes all sellable items, raw materials, consumables, and sub-assemblies. It provides unified SKU cataloging with statutory HSN/SAC classifications, multiple units of measure (UOM), tiered selling price lists, and batch/serial tracking configurations.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Product & Material Master',
      points: [
        'Single Source of Truth: Eliminates duplicate items, mismatched unit conversions, and conflicting inventory descriptions.',
        'Automated GST Rates: Associates statutory HSN and SAC codes so tax invoices calculate GST rates automatically.',
        'Dynamic Pricing Matrices: Enables custom price lists for distributors, retailers, and wholesale clients.',
        'Production Foundation: Supplies accurate item specifications for BOM engineering and work order assembly.'
      ],
      complianceValue: 'Mandated by GST Law for statutory HSN reporting and E-Way Bill generation.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Category & Unit Setup', detail: 'Create product hierarchies (Finished Goods, Raw Materials) and standard units (KG, PCS, BOX).' },
        { step: 2, title: 'Item Creation with HSN Code', detail: 'Enter item SKU, name, statutory HSN code, and default GST slab rate.' },
        { step: 3, title: 'Configure Price Lists', detail: 'Define standard cost, minimum selling price, and wholesale price tiers.' },
        { step: 4, title: 'Enable Batch & Expiry Tracking', detail: 'Toggle batch-level tracking for perishable or batch-manufactured goods.' }
      ]
    },
    audioOverviewScript: 'Product and Material Master is the definitive catalog for all items, raw materials, and finished goods handled across your supply chain.',
    audioWhyScript: 'Why do we need this module? Operating without a centralized product catalog leads to pricing inconsistencies, duplicate stock codes, and severe GST calculation errors. This module embeds statutory HSN and SAC codes, multi-tier pricing, and standardized units of measurement.',
    audioHowScript: 'How to use Product Master: Step 1, configure item categories and standard units of measure. Step 2, register items with HSN codes and tax brackets. Step 3, set baseline costs and customer price tiers. Step 4, activate batch and serial tracking for strict inventory traceability.'
  },
  {
    id: 'hr',
    name: 'HR & Employee Master',
    phase: 'Master Records',
    phaseNumber: 2,
    icon: Users,
    catalogueCount: 16,
    keyTables: ['tb_employee_master', 'tb_department', 'tb_designation', 'tb_employee_salary', 'tb_employee_bank'],
    summary: 'Employee lifecycle records, corporate organizational chart, statutory KYC, and bank account linkages.',
    description: 'HR and Employee Master manages the complete workforce directory across all branches. It tracks employee onboarding, designated departments, job titles, PF/ESI statutory identification numbers, direct deposit bank accounts, and assigned salary structures for seamless payroll execution.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs HR & Employee Master',
      points: [
        'Statutory Labor Compliance: Maintains Provident Fund (UAN), ESI numbers, and PANs required by labor departments.',
        'Eliminates Ghost Employees: Strict identity validation and unique corporate mobile checks prevent payroll fraud.',
        'Direct Bank Disbursals: Integrates IFSC and verified account details for bulk NEFT/RTGS salary processing.',
        'Org Chart Clarity: Defines departmental reporting lines and manager approval hierarchies.'
      ],
      complianceValue: 'Complies with Employees Provident Funds Act 1952 and Payment of Wages Act.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Department & Designation Setup', detail: 'Structure organizational departments (Engineering, Accounts, Plant Operations) and designations.' },
        { step: 2, title: 'Employee Onboarding', detail: 'Add employee profile, date of joining, official email, and emergency contact details.' },
        { step: 3, title: 'Statutory KYC Entry', detail: 'Input Aadhaar, PAN, and UAN numbers for automated statutory deductions.' },
        { step: 4, title: 'Salary Structure Assignment', detail: 'Link employee to a compliant salary grade with Basic, HRA, and Special Allowances.' }
      ]
    },
    audioOverviewScript: 'HR and Employee Master maintains your workforce directory, organizational departments, and employee KYC credentials.',
    audioWhyScript: 'Why do we need HR Master? To eliminate ghost employees, maintain statutory compliance with Provident Fund and ESI regulations, and ensure error-free salary transfers directly into verified bank accounts.',
    audioHowScript: 'How to use HR Master: Step 1, create your departmental hierarchy and job titles. Step 2, onboard personnel with verified contact details. Step 3, record statutory UAN and PAN numbers. Step 4, assign structured salary compensation plans.'
  },
  {
    id: 'crm',
    name: 'Customer & Supplier Master',
    phase: 'Master Records',
    phaseNumber: 2,
    icon: Handshake,
    catalogueCount: 8,
    keyTables: ['tb_customer_master', 'tb_supplier_master', 'tb_partner_address', 'tb_partner_contact'],
    summary: 'B2B customer profiles, vendor directories, GSTIN verification, credit limits, and payment terms.',
    description: 'Customer & Supplier Master unifies your external business relationships. It records B2B client details, approved vendor rosters, state-wise shipping addresses, GSTIN tax identifiers, payment credit days, and credit limits to mitigate credit risk and streamline procurement.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Customer & Supplier Master',
      points: [
        'Credit Risk Mitigation: Enforces maximum credit limits and payment windows to stop runaway bad debts.',
        'GST Reconciliation Ready: Verifies vendor GSTIN to ensure 100% eligibility for statutory Input Tax Credit (ITC).',
        'Vendor Performance Rating: Track on-time delivery ratios and quality acceptance scores.',
        'Omnichannel Contact Directory: Stores key accounts, buyer contacts, and accounting liaisons.'
      ],
      complianceValue: 'Critical for GSTR-2B Input Tax Credit reconciliation and MSME 45-day payment compliance.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Partner Registration', detail: 'Add trade partner name, trade type (Customer/Supplier), and corporate phone.' },
        { step: 2, title: 'GSTIN & PAN Validation', detail: 'Enter statutory 15-character GSTIN to auto-derive state code and tax eligibility.' },
        { step: 3, title: 'Credit Terms Assignment', detail: 'Set authorized credit limit (e.g. ₹5,00,000) and credit period (30 days).' },
        { step: 4, title: 'Transactions Linkage', detail: 'Select registered partners instantly when authoring sales orders or purchase requisitions.' }
      ]
    },
    audioOverviewScript: 'Customer and Supplier Master manages your external business ecosystem of buyers, distributors, and certified vendors.',
    audioWhyScript: 'Why do we need this module? To safeguard against uncollectible debts through strict credit limits, and to protect your Input Tax Credit by validating vendor GST numbers before purchase orders are issued.',
    audioHowScript: 'How to use Customer and Supplier Master: Step 1, register trade partners with verified commercial names. Step 2, record GSTIN and PAN details. Step 3, assign credit terms and payment allowances. Step 4, execute commercial orders seamlessly.'
  },
  {
    id: 'purchase',
    name: 'Purchase Management',
    phase: 'Business Operations',
    phaseNumber: 3,
    icon: ShoppingCart,
    catalogueCount: 12,
    keyTables: ['tb_purchase_order', 'tb_purchase_order_item', 'tb_purchase_receipt', 'tb_purchase_invoice'],
    summary: 'End-to-end procurement, purchase orders, goods receipt notes (GRN), and 3-way invoice matching.',
    description: 'Purchase Management automates enterprise procurement from purchase requisition to final vendor payment. It coordinates RFQ price comparisons, official Purchase Order issuance, warehouse Goods Receipt Notes (GRN), and 3-way matching against vendor bills to prevent duplicate or inflated disbursements.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Purchase Management',
      points: [
        'Eliminates Rogue Spending: Every purchase requires an approved PO before orders can be placed with suppliers.',
        '3-Way Matching Protection: Matches PO, GRN receipt quantity, and Vendor Invoice to prevent overpaying.',
        'Procurement Cost Savings: Enables batch purchasing and vendor volume discounts.',
        'ITC Maximization: Captures vendor invoice GST details for automated tax credit filing.'
      ],
      complianceValue: 'Mandated by statutory accounting standards for verifiable expenditure documentation.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Generate Purchase Order', detail: 'Select vendor, item SKUs, ordered quantities, agreed price, and expected delivery date.' },
        { step: 2, title: 'Multi-Level Approval', detail: 'Department head reviews and approves the PO within established budget parameters.' },
        { step: 3, title: 'Goods Receipt Note (GRN)', detail: 'Warehouse team inspects physical delivery and logs accepted vs rejected counts.' },
        { step: 4, title: 'Bill Booking & Payment Voucher', detail: 'Finance posts vendor bill, matches against GRN, and schedules disbursement.' }
      ]
    },
    audioOverviewScript: 'Purchase Management guides your complete procurement lifecycle from request to vendor bill reconciliation.',
    audioWhyScript: 'Why do we need Purchase Management? Uncontrolled purchasing is the number one cause of corporate cash leakage. This module enforces 3-way invoice matching across orders, physical receipts, and supplier bills, ensuring you only pay for what was actually delivered.',
    audioHowScript: 'How to use Purchase Management: Step 1, author purchase orders with verified rates. Step 2, route for managerial approval. Step 3, record warehouse goods receipt notes upon physical arrival. Step 4, book the vendor invoice for payment.'
  },
  {
    id: 'inventory',
    name: 'Inventory & Warehouse',
    phase: 'Business Operations',
    phaseNumber: 3,
    icon: Boxes,
    catalogueCount: 14,
    keyTables: ['tb_stock_balance', 'tb_warehouse', 'tb_stock_entry', 'tb_stock_transfer'],
    summary: 'Multi-location warehouse stock, automated reorder triggers, batch tracking, and stock transfers.',
    description: 'Inventory & Warehouse delivers real-time visibility across all physical storage locations, distribution centers, and shop-floor stores. It tracks live stock balances, calculates moving average valuation, generates automated reorder alerts, and logs inter-warehouse transfer challans.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Inventory & Warehouse',
      points: [
        'Prevents Stockouts & Halts: Automated minimum stock triggers notify procurement before materials run dry.',
        'Eliminates Inventory Pilferage: Every stock movement requires an authorized stock entry or transfer challan.',
        'Accurate Balance Sheet Valuation: Implements FIFO and Weighted Average cost valuation for audit compliance.',
        'Batch Traceability: Track material batches to quarantine defects or manage expiration dates.'
      ],
      complianceValue: 'Complies with Indian Accounting Standard (Ind AS 2) for inventory valuation and audit.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Define Warehouses & Bins', detail: 'Create warehouse locations (Raw Material Yard, Central Hub, Finished Goods Bay).' },
        { step: 2, title: 'Automated Stock Inwarding', detail: 'Approved GRN entries automatically increase warehouse stock quantities.' },
        { step: 3, title: 'Inter-Branch Stock Transfers', detail: 'Issue delivery challans to transfer items between regional branches.' },
        { step: 4, title: 'Physical Stock Audits', detail: 'Perform periodic physical reconciliation and log adjustment entries for write-offs.' }
      ]
    },
    audioOverviewScript: 'Inventory and Warehouse tracks your physical assets, stock valuation, and multi-location logistics in real time.',
    audioWhyScript: 'Why do we need this module? Trapped or misplaced inventory ties up working capital. This module guarantees zero stockouts, eliminates warehouse shrinkage, and provides accurate balance sheet valuations under standard accounting rules.',
    audioHowScript: 'How to use Inventory: Step 1, configure your network of warehouses and storage zones. Step 2, receive inward stock automatically from procurement receipts. Step 3, execute stock transfers with authorized transfer documents. Step 4, conduct regular physical audits to verify ledger counts.'
  },
  {
    id: 'sales',
    name: 'Sales Management',
    phase: 'Business Operations',
    phaseNumber: 3,
    icon: Receipt,
    catalogueCount: 12,
    keyTables: ['tb_sales_order', 'tb_sales_invoice', 'tb_sales_order_item', 'tb_delivery_challan'],
    summary: 'Customer quotation pipeline, sales orders, automated GST tax invoices, and revenue tracking.',
    description: 'Sales Management drives the enterprise revenue engine. It facilitates quotations, converts confirmed bids into Sales Orders, generates dispatch delivery challans, and outputs statutory GST-compliant tax invoices with real-time receivables ledger posting.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Sales Management',
      points: [
        'Faster Order-to-Cash Cycle: Accelerates quote-to-invoice turnaround to collect customer payments sooner.',
        'Flawless GST Invoicing: Automatically calculates CGST, SGST, and IGST based on place of supply.',
        'Revenue Recognition Accuracy: Generates audit-backed sales ledgers aligned with accounting standards.',
        'Customer Credit Enforcement: Blocks order dispatch if customer exceeds approved credit limit or aging terms.'
      ],
      complianceValue: 'Fully compliant with GST Rule 46 for statutory B2B and B2C tax invoices.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Sales Order Creation', detail: 'Select customer, line items, quoted rates, and delivery schedule.' },
        { step: 2, title: 'Credit Limit Verification', detail: 'The system validates customer outstanding balance and credit clearance.' },
        { step: 3, title: 'Delivery Challan Dispatch', detail: 'Generate dispatch documentation for warehouse picking and transport.' },
        { step: 4, title: 'Post GST Tax Invoice', detail: 'Produce official tax invoice, decrement inventory, and post debtor receivables.' }
      ]
    },
    audioOverviewScript: 'Sales Management coordinates your customer orders, delivery fulfillment, and automated GST tax billing.',
    audioWhyScript: 'Why do we need Sales Management? To accelerate your cash collection, enforce credit limits before goods leave the warehouse, and generate legally compliant GST tax invoices that protect your commercial standing.',
    audioHowScript: 'How to use Sales Management: Step 1, create verified sales orders. Step 2, run credit limit checks on client accounts. Step 3, dispatch shipments with delivery challans. Step 4, post the final GST tax invoice to trigger receivables.'
  },
  {
    id: 'production',
    name: 'Manufacturing & BOM',
    phase: 'Business Operations',
    phaseNumber: 3,
    icon: Factory,
    catalogueCount: 16,
    keyTables: ['tb_work_order', 'tb_bill_of_materials', 'tb_bom_item', 'tb_production_log'],
    summary: 'Multi-level Bill of Materials (BOM), production routing, work orders, and shop-floor job cards.',
    description: 'The Manufacturing & BOM module powers discreet and process manufacturing operations. It enables multi-level Bill of Materials modeling, capacity planning, Work Order release, shop-floor job card execution, and automated consumption of raw materials into finished assemblies.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Manufacturing & BOM',
      points: [
        'Precise Cost of Goods Sold (COGS): Accurately tallies raw material, labor, and machine overhead costs.',
        'Eliminates Assembly Bottlenecks: Verifies material availability before releasing work orders to the shop floor.',
        'Automated Raw Material Depletion: Consumes raw materials and increments finished goods stock simultaneously upon work order completion.',
        'Quality & Yield Tracking: Identifies scrap percentages and manufacturing anomalies in real time.'
      ],
      complianceValue: 'Supports standard cost accounting and statutory excise/manufacturing tax documentation.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Engineer Bill of Materials (BOM)', detail: 'Specify exact raw material quantities, scrap allowance, and labor hours per unit.' },
        { step: 2, title: 'Release Work Order', detail: 'Issue production orders linked to approved sales orders or stock replenishment targets.' },
        { step: 3, title: 'Shop-Floor Material Issue', detail: 'Transfer required raw materials from warehouse to the active production line.' },
        { step: 4, title: 'Complete Production Run', detail: 'Log finished units produced; the system writes off consumed parts and stocks finished inventory.' }
      ]
    },
    audioOverviewScript: 'Manufacturing and BOM manages your bill of materials, shop-floor production stages, and work order execution.',
    audioWhyScript: 'Why do we need Manufacturing? Producing without accurate BOMs causes component shortages, inflated scrap rates, and distorted product pricing. This module provides precise unit costing and automated raw material write-offs.',
    audioHowScript: 'How to use Manufacturing: Step 1, define multi-level bills of materials for your products. Step 2, release scheduled work orders. Step 3, issue components to the shop floor. Step 4, finalize production runs to receive finished goods into active inventory.'
  },
  {
    id: 'attendance',
    name: 'Attendance & Leave',
    phase: 'Business Operations',
    phaseNumber: 3,
    icon: CalendarCheck,
    catalogueCount: 15,
    keyTables: ['tb_attendance', 'tb_leave_application', 'tb_shift_master', 'tb_holiday_calendar'],
    summary: 'Biometric timesheet sync, shift rosters, leave balances, overtime calculations, and manager approvals.',
    description: 'Attendance & Leave captures daily workforce presence across office and factory shifts. It integrates with biometric devices, manages leave balances (Casual, Sick, Earned), computes overtime hours, and exports clean payable-days summaries directly into payroll processing.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Attendance & Leave',
      points: [
        'Eliminates Payroll Overpayments: Ensures salaries are paid strictly for verified working days and authorized leaves.',
        'Biometric Verification: Stops buddy punching and proxy clock-ins with automated device syncing.',
        'Statutory Leave Compliance: Enforces statutory leave encashment and carry-forward rules under the Factories Act.',
        'Dynamic Shift Rosters: Facilitates 24/7 rotating plant shifts with customizable overtime multipliers.'
      ],
      complianceValue: 'Complies with the Factories Act 1948 and Shops and Commercial Establishments Acts.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Shift & Holiday Configuration', detail: 'Define morning, evening, and night shifts with grace periods and set holiday calendars.' },
        { step: 2, title: 'Daily Attendance Capture', detail: 'Sync biometric logs or record daily check-in and check-out timestamps.' },
        { step: 3, title: 'Leave Application & Approval', detail: 'Employees submit leave requests through self-service for manager sign-off.' },
        { step: 4, title: 'Monthly Pay-Days Export', detail: 'Lock monthly attendance to auto-compute total present, absent, and payable days for payroll.' }
      ]
    },
    audioOverviewScript: 'Attendance and Leave captures workforce working hours, shifts, biometric attendance, and leave workflows.',
    audioWhyScript: 'Why do we need this module? Inaccurate attendance records lead to manual payroll errors and labor disputes. This module synchronizes verified working hours directly with payroll to prevent overpayments.',
    audioHowScript: 'How to use Attendance: Step 1, define work shifts and corporate holidays. Step 2, record daily biometric attendance logs. Step 3, manage and approve digital leave requests. Step 4, generate the monthly payable-days summary for payroll processing.'
  },
  {
    id: 'portal',
    name: 'Employee & Manager Portal',
    phase: 'Business Operations',
    phaseNumber: 3,
    icon: Laptop,
    catalogueCount: 6,
    keyTables: ['tb_employee_request', 'tb_expense_claim', 'tb_payslip_view', 'tb_manager_approval'],
    summary: 'Self-service dashboard for employee payslips, leave submissions, expense claims, and manager approvals.',
    description: 'The Employee & Manager Portal delivers a modern self-service experience. Employees can view monthly payslips, download Form 16 certificates, submit travel expense reimbursements with receipts, and view team calendars without burdening the HR department.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Employee & Manager Portal',
      points: [
        'Drastically Reduces HR Overhead: Employees access payslips and tax documents without manual HR ticket requests.',
        'Accelerated Expense Claims: Upload travel bills digitally for direct manager review and fast reimbursement.',
        'Transparency & Morale: Gives staff real-time visibility into leave balances, provident fund contributions, and company policies.',
        'Mobile-Responsive: Operates on any smartphone or workstation for field staff and managers on the go.'
      ],
      complianceValue: 'Complies with statutory digital payslip and Form 16 disclosure standards.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Employee Self-Service Access', detail: 'Team members log in with their corporate credentials to view personal dashboards.' },
        { step: 2, title: 'Payslip & Tax Download', detail: 'Download encrypted monthly payslips and year-end tax deduction summaries.' },
        { step: 3, title: 'Submit Expense Reimbursement', detail: 'Attach expense receipts for client travel or local operational expenditures.' },
        { step: 4, title: 'Manager One-Click Approval', detail: 'Department heads review and approve pending requests from their approval queue.' }
      ]
    },
    audioOverviewScript: 'Employee and Manager Portal provides a dedicated self-service hub for payslips, travel claims, and team approvals.',
    audioWhyScript: 'Why do we need the Portal? Managing routine employee queries for payslips and leave forms manually is inefficient. This module empowers employees with instant access to their documents while giving managers streamlined approval workflows.',
    audioHowScript: 'How to use the Portal: Step 1, log into your personal self-service portal. Step 2, view and download verified payslips. Step 3, submit reimbursement claims with attached receipts. Step 4, review and approve team submissions as a manager.'
  },
  {
    id: 'banking',
    name: 'Banking & Accounts',
    phase: 'Finance & Compliance',
    phaseNumber: 4,
    icon: Landmark,
    catalogueCount: 18,
    keyTables: ['tb_accounting_voucher', 'tb_general_ledger', 'tb_bank_account', 'tb_bank_reconciliation', 'tb_chart_of_accounts'],
    summary: 'Double-entry general ledger, automated bank feeds, payment vouchers, and financial statements.',
    description: 'Banking and Accounts represents the financial heart of Zuno ERP. Operating on strict double-entry principles, it maintains the Chart of Accounts, posts automated journal vouchers for all business transactions, executes bank reconciliations, and generates live Balance Sheets and Profit & Loss reports.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Banking & Accounts',
      points: [
        'Strict Double-Entry Integrity: Debits always equal credits; prevents unbalancing and unauthorized financial alterations.',
        'Automated Bank Reconciliation: Reconciles internal cash ledgers with real bank statements to catch uncredited checks or unauthorized charges.',
        'Real-Time Balance Sheet & P&L: Executives inspect live financial performance without waiting for month-end manual accounting.',
        'Statutory Audit Compliance: Provides an unbroken audit trail for statutory chartered accountants and tax authorities.'
      ],
      complianceValue: 'Complies with Indian Accounting Standards (Ind AS), Companies Act Section 128, and GAAP principles.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Chart of Accounts Architecture', detail: 'Structure Assets, Liabilities, Equity, Revenue, and Expense account groups in tb_chart_of_accounts.' },
        { step: 2, title: 'Link Corporate Bank Accounts', detail: 'Register bank accounts with verified IFSC codes and initial opening balances.' },
        { step: 3, title: 'Post Journal & Payment Vouchers', detail: 'Execute double-entry vouchers for expenditures, receipts, and inter-bank transfers.' },
        { step: 4, title: 'Perform Bank Reconciliation', detail: 'Match statement entries against internal ledger records to produce clean reconciliation statements.' }
      ]
    },
    audioOverviewScript: 'Banking and Accounts powers your double-entry general ledger, bank reconciliations, and financial statements.',
    audioWhyScript: 'Why do we need Banking and Accounts? Without strict double-entry accounting, financial leaks go undetected and regulatory audits will fail. This module ensures absolute balancing of debits and credits with instant financial reporting.',
    audioHowScript: 'How to use Banking and Accounts: Step 1, establish your Chart of Accounts. Step 2, link your corporate bank accounts. Step 3, process journal and payment vouchers. Step 4, execute monthly bank reconciliations and review financial statements.'
  },
  {
    id: 'payroll',
    name: 'Payroll & Benefits',
    phase: 'Finance & Compliance',
    phaseNumber: 4,
    icon: Banknote,
    catalogueCount: 16,
    keyTables: ['tb_payroll_run', 'tb_payslip_detail', 'tb_statutory_deduction', 'tb_bank_transfer_file'],
    summary: 'Automated salary calculation, PF/ESI/PT deduction schedules, bulk bank disbursals, and payslip generation.',
    description: 'Payroll & Benefits automates monthly compensation processing across all employee tiers. It reads verified attendance days, computes Gross Salary with statutory deductions (Provident Fund, Employee State Insurance, Professional Tax, TDS), outputs direct bank disbursement files, and generates digital payslips.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Payroll & Benefits',
      points: [
        '100% Error-Free Salary Calculations: Eliminates calculation mistakes in overtime, loss of pay, and allowances.',
        'Statutory Deduction Safeguards: Automatically calculates employee and employer shares for PF and ESI to avoid heavy regulatory penalties.',
        'One-Click Bank Transfers: Generates standardized NEFT/RTGS payment files for instant upload to corporate banking portals.',
        'Direct Ledger Integration: Automatically posts salary expense vouchers directly into the accounting ledger.'
      ],
      complianceValue: 'Complies with Employees Provident Fund Act, ESI Act 1948, and Income Tax TDS Section 192.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Lock Monthly Attendance', detail: 'Verify finalized payable days and leave balances from the Attendance module.' },
        { step: 2, title: 'Execute Payroll Run', detail: 'The system computes gross pay, deductions, tax withholdings, and net payable amounts.' },
        { step: 3, title: 'Generate Bank Transfer File', detail: 'Export the bulk payment file for direct salary upload to your corporate bank.' },
        { step: 4, title: 'Publish Digital Payslips', detail: 'Release payslips to the employee portal and auto-post salary journal entries.' }
      ]
    },
    audioOverviewScript: 'Payroll and Benefits automates monthly salary processing, statutory tax deductions, and bulk bank transfers.',
    audioWhyScript: 'Why do we need Payroll? Calculating compensation manually across hundreds of employees results in delays and statutory penalties. This module guarantees accurate calculations, statutory PF and ESI compliance, and one-click bulk bank disbursement.',
    audioHowScript: 'How to use Payroll: Step 1, lock the finalized monthly attendance records. Step 2, execute the automated payroll computation. Step 3, download the bulk bank transfer file for direct payment. Step 4, distribute digital payslips to employee portals.'
  },
  {
    id: 'compliance',
    name: 'Licence & Compliance',
    phase: 'Finance & Compliance',
    phaseNumber: 4,
    icon: FileCheck2,
    catalogueCount: 12,
    keyTables: ['tb_compliance_master', 'tb_compliance_renewal', 'tb_compliance_audit', 'tb_safety_certificate'],
    summary: 'Factory licenses, pollution control permits, fire safety clearances, renewal alerts, and audit records.',
    description: 'Licence & Compliance safeguards your business from operational shutdowns and regulatory fines. It monitors corporate licenses, factory permits, pollution control approvals, fire safety certificates, and trade registrations with proactive expiration notifications and compliance document archives.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Licence & Compliance',
      points: [
        'Prevents Operational Shutdowns: Proactive 60, 30, and 15-day alerts ensure licenses are renewed before expiration.',
        'Avoids Hefty Penalties: Protects management from legal liabilities resulting from expired pollution or municipal permits.',
        'Centralized Certificate Vault: Stores digital copies of all trade licenses and safety clearances for immediate inspection.',
        'Inspection Readiness: Maintains audit inspection checklists and resolution logs.'
      ],
      complianceValue: 'Ensures compliance with State Factory Rules, Environmental Protection Act, and Municipal Corporation Bylaws.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Register Corporate Licenses', detail: 'Record license name, issuing government authority, permit number, and expiration date in tb_compliance_master.' },
        { step: 2, title: 'Upload Digital Certificates', detail: 'Store verified digital copies of statutory clearance certificates in the vault.' },
        { step: 3, title: 'Set Automated Renewal Reminders', detail: 'Configure alert thresholds to notify compliance officers ahead of renewal deadlines.' },
        { step: 4, title: 'Log Inspection & Renewal Actions', detail: 'Record renewal application fees, inspection dates, and updated license certificates.' }
      ]
    },
    audioOverviewScript: 'Licence and Compliance manages your statutory operating permits, factory licenses, and proactive renewal alerts.',
    audioWhyScript: 'Why do we need Licence and Compliance? Operating with an expired factory permit or safety certificate risks immediate government closure and criminal liability. This module safeguards your business with proactive renewal tracking and digital certificate archives.',
    audioHowScript: 'How to use Compliance: Step 1, register your statutory operating permits. Step 2, upload verified digital clearance documents. Step 3, configure proactive renewal alert schedules. Step 4, record inspection logs and updated license renewals.'
  },
  {
    id: 'statutory',
    name: 'Government & Statutory',
    phase: 'Finance & Compliance',
    phaseNumber: 4,
    icon: Scale,
    catalogueCount: 14,
    keyTables: ['tb_statutory_submission', 'tb_gst_return_filing', 'tb_tds_return_filing', 'tb_statutory_audit_trail'],
    summary: 'GSTR-1, GSTR-3B summaries, TDS Form 26Q computations, advance tax ledgers, and e-Way bills.',
    description: 'Government & Statutory integrates your enterprise with state and central tax frameworks. It compiles sales and purchase invoices into statutory GSTR-1 and GSTR-3B formats, tallies TDS withholdings under Form 26Q, calculates advance corporate tax, and maintains statutory audit logs for GST authorities.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Government & Statutory',
      points: [
        'Automated GSTR-1 & 3B Preparation: Compiles B2B, B2C, and credit note lines directly from verified sales invoices.',
        'Input Tax Credit (ITC) Protection: Reconciles vendor purchase bills against GSTR-2B to avoid disallowance of tax credits.',
        'TDS Deduction Accuracy: Categorizes vendor payments under statutory sections (194C, 194J, 194H) with exact tax withholding rates.',
        'Penalty-Free Filings: Meet strict monthly and quarterly government deadlines consistently.'
      ],
      complianceValue: 'Complies with Central Goods and Services Tax (CGST) Act and Income Tax Act 1961.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Auto-Compile GST Outward Data', detail: 'The system aggregates all validated sales invoices into GSTR-1 reporting tables.' },
        { step: 2, title: 'Reconcile Inward Tax Credit (ITC)', detail: 'Compare purchase bills against supplier GSTR-2B filings to confirm ITC eligibility.' },
        { step: 3, title: 'Generate GSTR-3B Tax Summary', detail: 'Calculate net tax payable after offsetting eligible Input Tax Credit against outward tax.' },
        { step: 4, title: 'Archive Statutory Submission Proof', detail: 'Record government filing acknowledgment numbers (ARN) and challan receipts for audits.' }
      ]
    },
    audioOverviewScript: 'Government and Statutory integrates your ERP with state tax regimes, preparing GSTR-1, GSTR-3B, and TDS reports.',
    audioWhyScript: 'Why do we need this module? Inaccurate tax filings trigger heavy interest penalties, cancellation of GST registrations, and loss of input tax credits. This module automates government tax computations directly from your commercial vouchers.',
    audioHowScript: 'How to use Statutory: Step 1, compile monthly sales invoices for GSTR-1. Step 2, reconcile vendor purchase credits against tax portal data. Step 3, generate net tax payable summaries for GSTR-3B. Step 4, archive government ARN filing receipts.'
  },
  {
    id: 'investment',
    name: 'Investment & Finance',
    phase: 'Finance & Compliance',
    phaseNumber: 4,
    icon: TrendingUp,
    catalogueCount: 10,
    keyTables: ['tb_financial_budget', 'tb_investment_portfolio', 'tb_capital_expenditure', 'tb_treasury_ledger'],
    summary: 'Annual departmental budgets, capital expenditure (CapEx) tracking, treasury funds, and ROI monitoring.',
    description: 'Investment & Finance enables executive capital management. It manages annual departmental budgets, monitors Capital Expenditures (CapEx) against actual outlays, tracks corporate treasury investments (Fixed Deposits, Mutual Funds, Securities), and forecasts enterprise liquidity.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Investment & Finance',
      points: [
        'Budget Overrun Prevention: Alerts managers when departmental purchase orders approach or exceed allocated budget limits.',
        'CapEx Project Tracking: Monitors capital assets under construction until capitalization onto the balance sheet.',
        'Treasury Yield Optimization: Tracks interest accruals and maturity dates on corporate bank deposits and instruments.',
        'Executive Cash Flow Forecasting: Predicts future cash liquidity to support strategic expansion plans.'
      ],
      complianceValue: 'Aligns with Ind AS 7 Statement of Cash Flows and Ind AS 16 Property, Plant and Equipment.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Establish Departmental Budgets', detail: 'Allocate annual operational and capital expenditure budgets by department.' },
        { step: 2, title: 'Monitor Budget Utilization', detail: 'Every purchase order and voucher checks real-time remaining budget balances.' },
        { step: 3, title: 'Track Corporate Investments', detail: 'Record treasury deposits, term investments, interest yields, and maturity dates.' },
        { step: 4, title: 'Executive Variance Reporting', detail: 'Review Budget vs Actual variance reports to optimize corporate capital allocation.' }
      ]
    },
    audioOverviewScript: 'Investment and Finance governs your enterprise capital allocation, departmental budgets, and treasury assets.',
    audioWhyScript: 'Why do we need this module? Without disciplined budget oversight, departmental spending easily spirals out of control. This module enforces budgetary spending limits, tracks long-term capital projects, and optimizes return on investment.',
    audioHowScript: 'How to use Investment: Step 1, define annual departmental budgets. Step 2, enforce automated budget checks on outgoing purchase orders. Step 3, manage treasury instruments and interest earnings. Step 4, analyze budget-versus-actual variance reports.'
  },
  {
    id: 'land-building',
    name: 'Land & Building',
    phase: 'Master Records',
    phaseNumber: 2,
    icon: Building,
    catalogueCount: 12,
    keyTables: ['tb_property_master', 'tb_facility_master', 'tb_lease_contract', 'tb_property_tax'],
    summary: 'Corporate real estate, lease contracts, commercial premises, property tax, and facility layouts.',
    description: 'Land & Building maintains your corporate physical estate portfolio. It catalogs owned properties, leased commercial office spaces, manufacturing plants, facility utility zones, lease contract expiry terms, and local property tax records.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Land & Building',
      points: [
        'Lease Expiration Safeguards: Never miss lease renewal deadlines or commercial escalation dates.',
        'Property Tax Compliance: Tracks municipal assessment numbers and timely property tax payments.',
        'Facility Cost Allocation: Accurately apportions rent, maintenance, and power utilities across branch units.',
        'Capital Asset Valuation: Maintains title deeds, survey numbers, and municipal registration records.'
      ],
      complianceValue: 'Complies with Ind AS 116 for lease accounting and municipal property taxation laws.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Register Real Estate Properties', detail: 'Record property name, survey number, municipal registration, and physical address.' },
        { step: 2, title: 'Configure Lease Contracts', detail: 'Record lessor details, monthly rental amounts, security deposits, and renewal dates.' },
        { step: 3, title: 'Track Maintenance & Property Taxes', detail: 'Schedule recurring municipal tax payments and facility maintenance jobs.' },
        { step: 4, title: 'Link to Operating Branches', detail: 'Map properties to active operating branches for accurate branch P&L reporting.' }
      ]
    },
    audioOverviewScript: 'Land and Building manages your commercial real estate properties, plant facilities, and corporate lease agreements.',
    audioWhyScript: 'Why do we need Land and Building? Real estate and long-term commercial leases represent substantial overhead costs. This module prevents lease renewal oversights, tracks municipal property tax obligations, and accurately allocates premises costs.',
    audioHowScript: 'How to use Land and Building: Step 1, register owned and leased properties with legal survey numbers. Step 2, configure lease terms and rental escalation clauses. Step 3, manage recurring property taxes and facility upkeep. Step 4, allocate premises to operating business branches.'
  },
  {
    id: 'assets',
    name: 'Assets & Maintenance',
    phase: 'Master Records',
    phaseNumber: 2,
    icon: Wrench,
    catalogueCount: 8,
    keyTables: ['tb_asset_master', 'tb_depreciation_schedule', 'tb_maintenance_schedule', 'tb_asset_repair_log'],
    summary: 'Fixed asset register, automated depreciation schedules, preventive maintenance, and breakdown logs.',
    description: 'Assets & Maintenance manages physical machinery, vehicles, computing equipment, and plant assets. It maintains the fixed asset register, calculates straight-line and WDV depreciation schedules for statutory filing, and coordinates preventive maintenance to maximize equipment uptime.',
    whyWeNeedIt: {
      title: 'Why Your Enterprise Needs Assets & Maintenance',
      points: [
        'Automated Depreciation Posting: Computes Companies Act and Income Tax depreciation schedules automatically.',
        'Minimizes Plant Downtime: Schedules preventive maintenance routines before critical machinery fails.',
        'Fixed Asset Tagging: Assigns unique asset barcodes/QR codes to prevent asset loss or theft.',
        'Warranty & AMC Tracking: Tracks annual maintenance contracts (AMC) and warranty coverage to prevent unnecessary repair costs.'
      ],
      complianceValue: 'Mandated by Companies Act 2013 Schedule II and Income Tax Act Section 32.'
    },
    howWeUseIt: {
      steps: [
        { step: 1, title: 'Asset Master Entry', detail: 'Record asset description, serial number, purchase cost, capitalization date, and location in tb_asset_master.' },
        { step: 2, title: 'Assign Depreciation Method', detail: 'Select Straight Line (SLM) or Written Down Value (WDV) method and useful asset life.' },
        { step: 3, title: 'Schedule Preventive Maintenance', detail: 'Set periodic maintenance intervals (e.g. monthly machine calibration) with designated service vendors.' },
        { step: 4, title: 'Log Breakdown & Repair History', detail: 'Record maintenance repairs, spare part costs, and updated operational status.' }
      ]
    },
    audioOverviewScript: 'Assets and Maintenance governs your fixed asset register, automated depreciation, and preventive equipment maintenance.',
    audioWhyScript: 'Why do we need Assets and Maintenance? Equipment breakdowns halt production, and inaccurate asset depreciation causes severe tax audit penalties. This module guarantees maximum machine uptime and automated statutory depreciation schedules.',
    audioHowScript: 'How to use Assets: Step 1, register assets with serial numbers and purchase values. Step 2, select approved depreciation methods. Step 3, establish recurring preventive maintenance schedules. Step 4, record maintenance logs to track lifecycle repair costs.'
  }
];

interface VoiceGuidedAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialModuleId?: string;
}

export const VoiceGuidedAssistant: React.FC<VoiceGuidedAssistantProps> = ({
  isOpen,
  onClose,
  initialModuleId
}) => {
  const navigate = useNavigate();

  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    initialModuleId || 'company'
  );
  const [activeTab, setActiveTab] = useState<'description' | 'why' | 'how'>('description');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('ALL');

  // Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speakingTextTitle, setSpeakingTextTitle] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Web Speech API Voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);
        // Default to a clear English voice if available
        const preferred =
          voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Zira'))) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];
        setSelectedVoice(preferred || null);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update selected module when initialModuleId changes
  useEffect(() => {
    if (initialModuleId) {
      setSelectedModuleId(initialModuleId);
    }
  }, [initialModuleId]);

  // Stop speech when modal closes
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingTextTitle('');
    }
  }, [isOpen]);

  const selectedModule =
    MODULE_GUIDE_CATALOGUE.find((m) => m.id === selectedModuleId) ||
    MODULE_GUIDE_CATALOGUE[0];

  // Core Speech Synthesis execution
  const speakText = (title: string, textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setSpeakingTextTitle(title);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingTextTitle('');
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingTextTitle('');
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResume = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeakingTextTitle('');
    }
  };

  // General Grand Tour Audio Script
  const handleGrandTour = () => {
    const grandTourScript = `Welcome to Zuno Enterprise ERP, a unified multi-tenant platform built for modern enterprises. Zuno provides nineteen mission-critical business modules organized into four functional pillars. First, Core Setup and Administration governs your multi-company entities, SaaS tiers, and zero-trust security. Second, Master Records establishes your product catalogs, human resources, suppliers, customers, and fixed assets. Third, Daily Business Operations powers procurement, multi-warehouse inventory, manufacturing bills of materials, sales order fulfillment, and employee portals. And fourth, Finance and Compliance handles double-entry accounting, automated payroll, regulatory licenses, and statutory GST tax filings. Select any module from the list to explore what it contains, why your enterprise needs it, and how to operate it step by step.`;
    speakText('Platform Grand Tour (All 19 Modules)', grandTourScript);
  };

  const filteredModules = MODULE_GUIDE_CATALOGUE.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.keyTables.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPhase =
      selectedPhaseFilter === 'ALL' ||
      m.phase.toLowerCase().includes(selectedPhaseFilter.toLowerCase());

    return matchesSearch && matchesPhase;
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-6xl w-full h-[90vh] max-h-[850px] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  Voice-Guided Module Assistant
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  19 ERP Modules
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Listen to platform architecture, module capabilities, business ROI, and step-by-step operating workflows.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGrandTour}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm cursor-pointer transition-all active:scale-95"
              title="Narrate complete overview of all 19 ERP modules"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Listen: Platform Grand Tour</span>
              <span className="sm:hidden">Grand Tour</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Layout: Sidebar List (Left) + Detail & Player (Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel: Module Navigator & Search */}
          <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/60 dark:bg-slate-900/40 shrink-0">
            {/* Search & Phase Filter */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search modules or tables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phase Quick Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                {['ALL', 'Core', 'Master', 'Operations', 'Finance'].map((phaseKey) => (
                  <button
                    key={phaseKey}
                    onClick={() => setSelectedPhaseFilter(phaseKey)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      selectedPhaseFilter === phaseKey
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                    }`}
                  >
                    {phaseKey === 'ALL' ? 'All (19)' : phaseKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredModules.map((mod) => {
                const IconComponent = mod.icon;
                const isSelected = mod.id === selectedModule.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                      // If speaking something else, update
                    }}
                    className={`w-full text-left p-3 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600'
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {mod.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 font-mono">
                          {mod.catalogueCount} tables
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {mod.summary}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                        {mod.phase}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Module Deep Dive & Controls */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
            {/* Module Title Banner & Narration Actions */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/30 dark:bg-slate-900/20 shrink-0">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 shrink-0">
                  <selectedModule.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Phase {selectedModule.phaseNumber}: {selectedModule.phase}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {selectedModule.catalogueCount} Certified Tables
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedModule.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
                    {selectedModule.summary}
                  </p>
                </div>
              </div>

              {/* Direct Link to Workspace */}
              <button
                onClick={() => {
                  onClose();
                  navigate(`/modules/${selectedModule.id}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer transition-colors self-start sm:self-auto shrink-0"
              >
                <span>Open Module Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Audio Section Triggers (3 Quick Voice Buttons) */}
            <div className="px-5 py-2.5 bg-indigo-50/50 dark:bg-slate-850/60 border-b border-indigo-100/60 dark:border-slate-800 flex flex-wrap items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mr-1">
                <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Listen to Voice Guide:</span>
              </span>

              <button
                onClick={() => {
                  setActiveTab('description');
                  speakText(`${selectedModule.name} - Overview`, selectedModule.audioOverviewScript);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-blue-200 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Play className="w-3 h-3 text-blue-600 fill-current" />
                <span>🔊 Listen: Overview</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('why');
                  speakText(`${selectedModule.name} - Why We Need It`, selectedModule.audioWhyScript);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 border border-purple-200 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Play className="w-3 h-3 text-purple-600 fill-current" />
                <span>💡 Listen: Why We Need It</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('how');
                  speakText(`${selectedModule.name} - How to Use It`, selectedModule.audioHowScript);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-200 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Play className="w-3 h-3 text-emerald-600 fill-current" />
                <span>🚀 Listen: How to Use It</span>
              </button>
            </div>

            {/* Deep Dive Tabs */}
            <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-slate-50/20 dark:bg-slate-900/10 shrink-0">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'description'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>What It Contains (Overview & Tables)</span>
              </button>
              <button
                onClick={() => setActiveTab('why')}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'why'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Why We Need To Use It (Business Value)</span>
              </button>
              <button
                onClick={() => setActiveTab('how')}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'how'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>How We Use It (Step-by-Step Guide)</span>
              </button>
            </div>

            {/* Tab Contents Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === 'description' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                      Full Module Description
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedModule.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Underlying Catalogue Tables ({selectedModule.catalogueCount} Tables Total)</span>
                      <span className="text-[11px] font-normal text-slate-400">PostgreSQL Schema Compliant</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedModule.keyTables.map((tbl) => (
                        <div
                          key={tbl}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-2xs"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          <code className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                            {tbl}
                          </code>
                          <span className="text-[10px] text-slate-400 ml-auto">Indexed & Isolated</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'why' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800">
                    <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1">
                      {selectedModule.whyWeNeedIt.title}
                    </h4>
                    <p className="text-xs text-purple-800 dark:text-purple-400 font-medium">
                      Operational justification, financial leakage prevention, and regulatory safeguards.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {selectedModule.whyWeNeedIt.points.map((pt, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3 shadow-2xs"
                      >
                        <div className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                          {pt}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                    <Scale className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>
                      <strong>Statutory Requirement:</strong> {selectedModule.whyWeNeedIt.complianceValue}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'how' && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                    <strong>Standard Operating Procedure (SOP):</strong> Follow this 4-step workflow to operationalize {selectedModule.name} within your company workspace.
                  </div>

                  <div className="space-y-3">
                    {selectedModule.howWeUseIt.steps.map((st) => (
                      <div
                        key={st.step}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3.5 shadow-2xs"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {st.step}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {st.title}
                          </h5>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {st.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Persistent Audio Player Bar at Bottom */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              {/* Speaking State & Animated Wave */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1 h-7 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-xl shadow-glow-sm">
                  {isSpeaking && !isPaused ? (
                    <>
                      <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms] shadow-glow-cyan" />
                      <span className="w-1 h-5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms] shadow-glow-sm" />
                      <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      <span className="w-1 h-5 bg-cyan-300 rounded-full animate-bounce [animation-delay:450ms] shadow-glow-cyan" />
                      <span className="w-1 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:200ms]" />
                    </>
                  ) : (
                    <>
                      <span className="w-1 h-2 bg-slate-700 rounded-full" />
                      <span className="w-1 h-2 bg-slate-700 rounded-full" />
                      <span className="w-1 h-2 bg-slate-700 rounded-full" />
                      <span className="w-1 h-2 bg-slate-700 rounded-full" />
                      <span className="w-1 h-2 bg-slate-700 rounded-full" />
                    </>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {isSpeaking ? speakingTextTitle : 'Ready to narrate module guide'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isSpeaking ? (isPaused ? 'Audio Paused' : 'Voice is speaking...') : 'Click any Listen button above'}
                  </div>
                </div>
              </div>

              {/* Controls: Play/Pause, Stop, Speed */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {isSpeaking && (
                  <button
                    onClick={handlePauseResume}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-xs transition-colors"
                    title={isPaused ? 'Resume narration' : 'Pause narration'}
                  >
                    {isPaused ? <Play className="w-4 h-4 fill-current text-blue-600" /> : <Pause className="w-4 h-4" />}
                  </button>
                )}

                {isSpeaking && (
                  <button
                    onClick={handleStopSpeech}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer shadow-xs transition-colors"
                    title="Stop narration"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                )}

                {/* Speed Selector */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs">
                  <span className="text-[10px] font-semibold text-slate-400 mr-1">Speed:</span>
                  {[0.85, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSpeechRate(rate)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                        speechRate === rate
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Launch Workspace CTA */}
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/modules/${selectedModule.id}`);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                >
                  <span>Open {selectedModule.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
