-- ==============================================================================
-- ZUNO ERP — COMPLETE PRODUCTION DATABASE DDL (ALL 243 APPROVED TABLES)
-- Operational Database: Neon PostgreSQL
-- Conforms strictly to Zuno Phase 1–4 Approved Catalogue
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- [Table 1 / 243] tb_tenant (Phase 1: Company Management)
-- Purpose: A customer account boundary that owns one or more companies in Zuno.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_tenant (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_code VARCHAR(30),
  tenant_name VARCHAR(200),
  account_status VARCHAR(30) DEFAULT 'ACTIVE',
  registration_source VARCHAR(30),
  registered_time TIMESTAMPTZ,
  activated_time TIMESTAMPTZ,
  suspended_time TIMESTAMPTZ,
  suspension_reason TEXT,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- ------------------------------------------------------------------------------
-- [Table 2 / 243] tb_tenant_owner (Phase 1: Company Management)
-- Purpose: Owner and primary contact details for a tenant account.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_tenant_owner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  owner_name VARCHAR(150),
  email VARCHAR(150),
  mobile VARCHAR(20),
  designation VARCHAR(100),
  is_primary BOOLEAN,
  is_verified BOOLEAN,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_tenant_owner_tenant ON tb_tenant_owner(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 3 / 243] tb_company (Phase 1: Company Management)
-- Purpose: Legal/business entity registered under a tenant.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  company_code VARCHAR(30),
  company_name VARCHAR(200),
  legal_name VARCHAR(200),
  business_type VARCHAR(50),
  ownership_type VARCHAR(50),
  industry_type VARCHAR(100),
  pan_number VARCHAR(20),
  tan_number VARCHAR(20),
  gstin VARCHAR(20),
  cin_number VARCHAR(30),
  udyam_number VARCHAR(30),
  incorporation_date DATE,
  financial_year_start DATE,
  currency_code VARCHAR(3),
  country_code VARCHAR(2),
  company_status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_tenant ON tb_company(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 4 / 243] tb_company_address (Phase 1: Company Management)
-- Purpose: Registered, billing, office or other company addresses.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company_address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  company_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_address_tenant ON tb_company_address(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_company_address_status ON tb_company_address(status);

-- ------------------------------------------------------------------------------
-- [Table 5 / 243] tb_company_contact (Phase 1: Company Management)
-- Purpose: Named company contacts and their communication details.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  company_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_contact_tenant ON tb_company_contact(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_company_contact_status ON tb_company_contact(status);

-- ------------------------------------------------------------------------------
-- [Table 6 / 243] tb_company_registration (Phase 1: Company Management)
-- Purpose: Government and statutory registration identifiers for a company.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company_registration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_registration_tenant ON tb_company_registration(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_company_registration_status ON tb_company_registration(status);

-- ------------------------------------------------------------------------------
-- [Table 7 / 243] tb_company_branch (Phase 1: Company Management)
-- Purpose: A shop, office, factory, warehouse or other operating branch.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company_branch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_branch_tenant ON tb_company_branch(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_company_branch_status ON tb_company_branch(status);

-- ------------------------------------------------------------------------------
-- [Table 8 / 243] tb_company_document (Phase 1: Company Management)
-- Purpose: Secure metadata for company certificates and uploaded documents.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  company_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  file_name VARCHAR(255),
  storage_key TEXT,
  file_type VARCHAR(80),
  uploaded_by UUID,
  uploaded_time TIMESTAMPTZ,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_document_tenant ON tb_company_document(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_company_document_status ON tb_company_document(status);

-- ------------------------------------------------------------------------------
-- [Table 9 / 243] tb_company_financial_year (Phase 1: Company Management)
-- Purpose: Financial-year periods configured for a company.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company_financial_year (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_financial_year_tenant ON tb_company_financial_year(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_company_financial_year_status ON tb_company_financial_year(status);

-- ------------------------------------------------------------------------------
-- [Table 10 / 243] tb_company_settings (Phase 1: Company Management)
-- Purpose: Company-level regional, currency, date and application settings.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_settings_tenant ON tb_company_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_company_settings_status ON tb_company_settings(status);

-- ------------------------------------------------------------------------------
-- [Table 11 / 243] tb_module_category (Phase 1: SaaS Platform & Subscription)
-- Purpose: Shared catalogue grouping for Zuno modules.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_module_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_module_category_code ON tb_module_category(code);

-- ------------------------------------------------------------------------------
-- [Table 12 / 243] tb_module (Phase 1: SaaS Platform & Subscription)
-- Purpose: Shared catalogue of purchasable Zuno modules.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_module (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID,
  module_code VARCHAR(40),
  module_name VARCHAR(150),
  description TEXT,
  icon_name VARCHAR(80),
  display_order INTEGER,
  is_selectable BOOLEAN,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- ------------------------------------------------------------------------------
-- [Table 13 / 243] tb_submodule (Phase 1: SaaS Platform & Subscription)
-- Purpose: Functional sections within a main module.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_submodule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_submodule_tenant ON tb_submodule(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_submodule_status ON tb_submodule(status);

-- ------------------------------------------------------------------------------
-- [Table 14 / 243] tb_module_feature (Phase 1: SaaS Platform & Subscription)
-- Purpose: Individual application features within a submodule.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_module_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_module_feature_tenant ON tb_module_feature(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_module_feature_status ON tb_module_feature(status);

-- ------------------------------------------------------------------------------
-- [Table 15 / 243] tb_module_dependency (Phase 1: SaaS Platform & Subscription)
-- Purpose: Rules describing modules required by other modules.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_module_dependency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_module_dependency_status ON tb_module_dependency(status);

-- ------------------------------------------------------------------------------
-- [Table 16 / 243] tb_module_price (Phase 1: SaaS Platform & Subscription)
-- Purpose: Versioned fixed prices for modules by currency and billing cycle.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_module_price (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID,
  price_name VARCHAR(100),
  billing_cycle VARCHAR(20),
  currency_code VARCHAR(3),
  fixed_amount NUMERIC(12,2),
  effective_from DATE,
  effective_to DATE,
  price_version INTEGER,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);


-- ------------------------------------------------------------------------------
-- [Table 17 / 243] tb_tax_rate (Phase 1: SaaS Platform & Subscription)
-- Purpose: Tax rates and effective dates used for subscription billing.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_tax_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_tax_rate_tenant ON tb_tax_rate(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_tax_rate_status ON tb_tax_rate(status);

-- ------------------------------------------------------------------------------
-- [Table 18 / 243] tb_discount_coupon (Phase 1: SaaS Platform & Subscription)
-- Purpose: Promotional discount codes and their validity rules.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_discount_coupon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_discount_coupon_tenant ON tb_discount_coupon(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_discount_coupon_status ON tb_discount_coupon(status);

-- ------------------------------------------------------------------------------
-- [Table 19 / 243] tb_subscription (Phase 1: SaaS Platform & Subscription)
-- Purpose: A tenant or company subscription contract and billing period.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  company_id UUID,
  subscription_number VARCHAR(50),
  billing_cycle VARCHAR(20),
  currency_code VARCHAR(3),
  start_date DATE,
  end_date DATE,
  next_billing_date DATE,
  subtotal_amount NUMERIC(12,2),
  discount_amount NUMERIC(12,2),
  tax_amount NUMERIC(12,2),
  total_amount NUMERIC(12,2),
  subscription_status VARCHAR(30),
  auto_renew BOOLEAN,
  trial_end_date DATE,
  grace_period_end DATE,
  cancelled_time TIMESTAMPTZ,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_tenant ON tb_subscription(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 20 / 243] tb_subscription_item (Phase 1: SaaS Platform & Subscription)
-- Purpose: A purchased module line and its agreed price snapshot.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID,
  module_id UUID,
  module_price_id UUID,
  module_name_snapshot VARCHAR(150),
  billing_cycle VARCHAR(20),
  unit_price NUMERIC(12,2),
  discount_amount NUMERIC(12,2),
  tax_amount NUMERIC(12,2),
  final_amount NUMERIC(12,2),
  item_status VARCHAR(30),
  activation_time TIMESTAMPTZ,
  expiry_time TIMESTAMPTZ,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_item_tenant ON tb_subscription_item(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 21 / 243] tb_subscription_entitlement (Phase 1: SaaS Platform & Subscription)
-- Purpose: Effective permission to access a subscribed module.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription_entitlement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  company_id UUID,
  subscription_id UUID,
  subscription_item_id UUID,
  module_id UUID,
  entitlement_status VARCHAR(30),
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  activation_source VARCHAR(30),
  activated_by UUID,
  activated_time TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_entitlement_tenant ON tb_subscription_entitlement(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 22 / 243] tb_subscription_feature (Phase 1: SaaS Platform & Subscription)
-- Purpose: Feature-level entitlements within an activated module.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_feature_tenant ON tb_subscription_feature(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_subscription_feature_status ON tb_subscription_feature(status);

-- ------------------------------------------------------------------------------
-- [Table 23 / 243] tb_subscription_history (Phase 1: SaaS Platform & Subscription)
-- Purpose: Audit trail of subscription status and commercial changes.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  parent_id UUID NOT NULL REFERENCES tb_subscription(id) ON DELETE CASCADE,
  action_type VARCHAR(50),
  action_by UUID,
  action_time TIMESTAMPTZ,
  details JSONB,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_history_tenant ON tb_subscription_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_subscription_history_parent ON tb_subscription_history(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 24 / 243] tb_invoice (Phase 1: SaaS Platform & Subscription)
-- Purpose: Zuno sales invoice issued to a subscribing customer.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_invoice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_invoice_tenant ON tb_invoice(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_invoice_doc_num ON tb_invoice(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_invoice_status ON tb_invoice(status);

-- ------------------------------------------------------------------------------
-- [Table 25 / 243] tb_invoice_detail (Phase 1: SaaS Platform & Subscription)
-- Purpose: Individual module or service lines on a subscription invoice.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_invoice_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  parent_id UUID NOT NULL REFERENCES tb_invoice(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_invoice_detail_tenant ON tb_invoice_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_invoice_detail_parent ON tb_invoice_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 26 / 243] tb_payment (Phase 1: SaaS Platform & Subscription)
-- Purpose: Payment transaction against a Zuno invoice.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_payment_tenant ON tb_payment(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payment_doc_num ON tb_payment(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_payment_status ON tb_payment(status);

-- ------------------------------------------------------------------------------
-- [Table 27 / 243] tb_payment_attempt (Phase 1: SaaS Platform & Subscription)
-- Purpose: Individual checkout/payment attempts, including retries.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payment_attempt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_payment_attempt_tenant ON tb_payment_attempt(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payment_attempt_doc_num ON tb_payment_attempt(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_payment_attempt_status ON tb_payment_attempt(status);

-- ------------------------------------------------------------------------------
-- [Table 28 / 243] tb_payment_webhook (Phase 1: SaaS Platform & Subscription)
-- Purpose: Verified gateway event inbox for idempotent payment processing.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payment_webhook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_payment_webhook_tenant ON tb_payment_webhook(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payment_webhook_doc_num ON tb_payment_webhook(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_payment_webhook_status ON tb_payment_webhook(status);

-- ------------------------------------------------------------------------------
-- [Table 29 / 243] tb_refund (Phase 1: SaaS Platform & Subscription)
-- Purpose: Refund request and gateway refund result.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_refund (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_refund_tenant ON tb_refund(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_refund_status ON tb_refund(status);

-- ------------------------------------------------------------------------------
-- [Table 30 / 243] tb_subscription_change_request (Phase 1: SaaS Platform & Subscription)
-- Purpose: Customer request to add, remove or change subscribed modules.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription_change_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_change_request_tenant ON tb_subscription_change_request(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_subscription_change_request_doc_num ON tb_subscription_change_request(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_subscription_change_request_status ON tb_subscription_change_request(status);

-- ------------------------------------------------------------------------------
-- [Table 31 / 243] tb_subscription_change_detail (Phase 1: SaaS Platform & Subscription)
-- Purpose: Module-level changes within a subscription change request.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription_change_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  parent_id UUID NOT NULL REFERENCES tb_subscription_change_request(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_change_detail_tenant ON tb_subscription_change_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_subscription_change_detail_parent ON tb_subscription_change_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 32 / 243] tb_subscription_renewal (Phase 1: SaaS Platform & Subscription)
-- Purpose: Renewal periods and renewal processing status.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription_renewal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_renewal_tenant ON tb_subscription_renewal(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_subscription_renewal_status ON tb_subscription_renewal(status);

-- ------------------------------------------------------------------------------
-- [Table 33 / 243] tb_subscription_limit (Phase 1: SaaS Platform & Subscription)
-- Purpose: Quantitative limits included in a subscription.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription_limit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_limit_tenant ON tb_subscription_limit(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_subscription_limit_status ON tb_subscription_limit(status);

-- ------------------------------------------------------------------------------
-- [Table 34 / 243] tb_subscription_module_usage (Phase 1: SaaS Platform & Subscription)
-- Purpose: Measured module usage against subscription limits.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_subscription_module_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_subscription_module_usage_tenant ON tb_subscription_module_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_subscription_module_usage_status ON tb_subscription_module_usage(status);

-- ------------------------------------------------------------------------------
-- [Table 35 / 243] tb_user (Phase 1: Administration & Management)
-- Purpose: Customer-side user identity within a tenant.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  username VARCHAR(100),
  full_name VARCHAR(150),
  email VARCHAR(150),
  mobile VARCHAR(20),
  user_type VARCHAR(30),
  user_status VARCHAR(30) DEFAULT 'ACTIVE',
  email_verified BOOLEAN,
  mobile_verified BOOLEAN,
  last_login_time TIMESTAMPTZ,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_user_tenant ON tb_user(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 36 / 243] tb_user_credential (Phase 1: Administration & Management)
-- Purpose: Password hash and credential security state for a user.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_user_credential (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  password_hash TEXT,
  password_changed_time TIMESTAMPTZ,
  failed_attempts INTEGER,
  locked_until TIMESTAMPTZ,
  force_password_change BOOLEAN,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_user_credential_tenant ON tb_user_credential(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 37 / 243] tb_user_otp (Phase 1: Administration & Management)
-- Purpose: Hashed one-time verification codes and expiry details.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_user_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_user_otp_tenant ON tb_user_otp(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_user_otp_status ON tb_user_otp(status);

-- ------------------------------------------------------------------------------
-- [Table 38 / 243] tb_user_session (Phase 1: Administration & Management)
-- Purpose: Refresh-token session and device login information.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_user_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_user_session_tenant ON tb_user_session(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_user_session_status ON tb_user_session(status);

-- ------------------------------------------------------------------------------
-- [Table 39 / 243] tb_login_history (Phase 1: Administration & Management)
-- Purpose: Successful and failed customer login activity.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  parent_id UUID NOT NULL REFERENCES tb_user(id) ON DELETE CASCADE,
  action_type VARCHAR(50),
  action_by UUID,
  action_time TIMESTAMPTZ,
  details JSONB,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_login_history_tenant ON tb_login_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_login_history_parent ON tb_login_history(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 40 / 243] tb_role (Phase 1: Administration & Management)
-- Purpose: Tenant-defined role such as HR Manager or Accountant.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_role (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_role_tenant ON tb_role(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_role_status ON tb_role(status);

-- ------------------------------------------------------------------------------
-- [Table 41 / 243] tb_permission (Phase 1: Administration & Management)
-- Purpose: Permission catalogue for module actions.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_permission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_permission_tenant ON tb_permission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_permission_status ON tb_permission(status);

-- ------------------------------------------------------------------------------
-- [Table 42 / 243] tb_role_permission (Phase 1: Administration & Management)
-- Purpose: Permissions granted or denied to a role.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_role_permission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_role_permission_tenant ON tb_role_permission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_role_permission_status ON tb_role_permission(status);

-- ------------------------------------------------------------------------------
-- [Table 43 / 243] tb_user_role (Phase 1: Administration & Management)
-- Purpose: Role assignments for users and optional company scope.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_user_role (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_user_role_tenant ON tb_user_role(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_user_role_status ON tb_user_role(status);

-- ------------------------------------------------------------------------------
-- [Table 44 / 243] tb_user_company_access (Phase 1: Administration & Management)
-- Purpose: Company-level access granted to a user.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_user_company_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_user_company_access_tenant ON tb_user_company_access(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_user_company_access_status ON tb_user_company_access(status);

-- ------------------------------------------------------------------------------
-- [Table 45 / 243] tb_user_branch_access (Phase 1: Administration & Management)
-- Purpose: Branch-level access granted to a user.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_user_branch_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_user_branch_access_tenant ON tb_user_branch_access(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_user_branch_access_status ON tb_user_branch_access(status);

-- ------------------------------------------------------------------------------
-- [Table 46 / 243] tb_approval_workflow (Phase 1: Administration & Management)
-- Purpose: Configurable approval process for a business activity.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_approval_workflow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  parent_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_approval_workflow_tenant ON tb_approval_workflow(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_approval_workflow_parent ON tb_approval_workflow(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_approval_workflow_status ON tb_approval_workflow(status);

-- ------------------------------------------------------------------------------
-- [Table 47 / 243] tb_approval_workflow_step (Phase 1: Administration & Management)
-- Purpose: Ordered approval steps and approver rules.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_approval_workflow_step (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  parent_id UUID NOT NULL REFERENCES tb_approval_workflow(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_approval_workflow_step_tenant ON tb_approval_workflow_step(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_approval_workflow_step_parent ON tb_approval_workflow_step(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_approval_workflow_step_status ON tb_approval_workflow_step(status);

-- ------------------------------------------------------------------------------
-- [Table 48 / 243] tb_platform_admin (Phase 1: Administration & Management)
-- Purpose: Separate internal Zuno administrator identity.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_platform_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_code VARCHAR(30),
  admin_name VARCHAR(150),
  email VARCHAR(150),
  mobile VARCHAR(20),
  password_hash TEXT,
  admin_role VARCHAR(50),
  admin_status VARCHAR(30),
  last_login_time TIMESTAMPTZ,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- ------------------------------------------------------------------------------
-- [Table 49 / 243] tb_product_category (Phase 2: Product & Material Management)
-- Purpose: Stores product category information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_category_tenant ON tb_product_category(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_category_code ON tb_product_category(code);

-- ------------------------------------------------------------------------------
-- [Table 50 / 243] tb_product_subcategory (Phase 2: Product & Material Management)
-- Purpose: Stores product subcategory information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_subcategory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_subcategory_tenant ON tb_product_subcategory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_subcategory_code ON tb_product_subcategory(code);

-- ------------------------------------------------------------------------------
-- [Table 51 / 243] tb_product_master (Phase 2: Product & Material Management)
-- Purpose: Stores product master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_master_tenant ON tb_product_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_master_code ON tb_product_master(code);

-- ------------------------------------------------------------------------------
-- [Table 52 / 243] tb_product_variant (Phase 2: Product & Material Management)
-- Purpose: Stores product variant information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_variant (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_variant_tenant ON tb_product_variant(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_variant_status ON tb_product_variant(status);

-- ------------------------------------------------------------------------------
-- [Table 53 / 243] tb_product_unit (Phase 2: Product & Material Management)
-- Purpose: Stores product unit information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_unit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_unit_tenant ON tb_product_unit(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_unit_code ON tb_product_unit(code);

-- ------------------------------------------------------------------------------
-- [Table 54 / 243] tb_product_unit_conversion (Phase 2: Product & Material Management)
-- Purpose: Stores product unit conversion information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_unit_conversion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_unit_conversion_tenant ON tb_product_unit_conversion(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_unit_conversion_code ON tb_product_unit_conversion(code);

-- ------------------------------------------------------------------------------
-- [Table 55 / 243] tb_product_barcode (Phase 2: Product & Material Management)
-- Purpose: Stores product barcode information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_barcode (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_barcode_tenant ON tb_product_barcode(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_barcode_status ON tb_product_barcode(status);

-- ------------------------------------------------------------------------------
-- [Table 56 / 243] tb_product_price (Phase 2: Product & Material Management)
-- Purpose: Stores product price information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_price (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_price_tenant ON tb_product_price(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_price_status ON tb_product_price(status);

-- ------------------------------------------------------------------------------
-- [Table 57 / 243] tb_product_tax (Phase 2: Product & Material Management)
-- Purpose: Stores product tax information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_tax (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_tax_tenant ON tb_product_tax(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_tax_status ON tb_product_tax(status);

-- ------------------------------------------------------------------------------
-- [Table 58 / 243] tb_product_batch (Phase 2: Product & Material Management)
-- Purpose: Stores product batch information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_batch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_batch_tenant ON tb_product_batch(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_batch_status ON tb_product_batch(status);

-- ------------------------------------------------------------------------------
-- [Table 59 / 243] tb_product_brand (Phase 2: Product & Material Management)
-- Purpose: Stores product brand information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_brand (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_brand_tenant ON tb_product_brand(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_brand_code ON tb_product_brand(code);

-- ------------------------------------------------------------------------------
-- [Table 60 / 243] tb_product_document (Phase 2: Product & Material Management)
-- Purpose: Stores product document information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_product_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  file_name VARCHAR(255),
  storage_key TEXT,
  file_type VARCHAR(80),
  uploaded_by UUID,
  uploaded_time TIMESTAMPTZ,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_product_document_tenant ON tb_product_document(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_document_status ON tb_product_document(status);

-- ------------------------------------------------------------------------------
-- [Table 61 / 243] tb_department (Phase 2: HR & Employee Management)
-- Purpose: Stores department information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_department (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_department_tenant ON tb_department(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_department_status ON tb_department(status);

-- ------------------------------------------------------------------------------
-- [Table 62 / 243] tb_designation (Phase 2: HR & Employee Management)
-- Purpose: Stores designation information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_designation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_designation_tenant ON tb_designation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_designation_status ON tb_designation(status);

-- ------------------------------------------------------------------------------
-- [Table 63 / 243] tb_employee_master (Phase 2: HR & Employee Management)
-- Purpose: Stores employee master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_master_tenant ON tb_employee_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_master_code ON tb_employee_master(code);

-- ------------------------------------------------------------------------------
-- [Table 64 / 243] tb_employee_personal (Phase 2: HR & Employee Management)
-- Purpose: Stores employee personal information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_personal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_personal_tenant ON tb_employee_personal(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_personal_status ON tb_employee_personal(status);

-- ------------------------------------------------------------------------------
-- [Table 65 / 243] tb_employee_address (Phase 2: HR & Employee Management)
-- Purpose: Stores employee address information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_address_tenant ON tb_employee_address(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_address_status ON tb_employee_address(status);

-- ------------------------------------------------------------------------------
-- [Table 66 / 243] tb_employee_contact (Phase 2: HR & Employee Management)
-- Purpose: Stores employee contact information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_contact_tenant ON tb_employee_contact(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_contact_status ON tb_employee_contact(status);

-- ------------------------------------------------------------------------------
-- [Table 67 / 243] tb_employee_bank (Phase 2: HR & Employee Management)
-- Purpose: Stores employee bank information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_bank_tenant ON tb_employee_bank(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_bank_status ON tb_employee_bank(status);

-- ------------------------------------------------------------------------------
-- [Table 68 / 243] tb_employee_document (Phase 2: HR & Employee Management)
-- Purpose: Stores employee document information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  file_name VARCHAR(255),
  storage_key TEXT,
  file_type VARCHAR(80),
  uploaded_by UUID,
  uploaded_time TIMESTAMPTZ,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_document_tenant ON tb_employee_document(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_document_status ON tb_employee_document(status);

-- ------------------------------------------------------------------------------
-- [Table 69 / 243] tb_employee_education (Phase 2: HR & Employee Management)
-- Purpose: Stores employee education information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_education_tenant ON tb_employee_education(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_education_status ON tb_employee_education(status);

-- ------------------------------------------------------------------------------
-- [Table 70 / 243] tb_employee_experience (Phase 2: HR & Employee Management)
-- Purpose: Stores employee experience information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_experience_tenant ON tb_employee_experience(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_experience_status ON tb_employee_experience(status);

-- ------------------------------------------------------------------------------
-- [Table 71 / 243] tb_employee_family (Phase 2: HR & Employee Management)
-- Purpose: Stores employee family information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_family (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_family_tenant ON tb_employee_family(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_family_status ON tb_employee_family(status);

-- ------------------------------------------------------------------------------
-- [Table 72 / 243] tb_employee_job_history (Phase 2: HR & Employee Management)
-- Purpose: Stores employee job history information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_job_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID,
  action_type VARCHAR(50),
  action_by UUID,
  action_time TIMESTAMPTZ,
  details JSONB,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_job_history_tenant ON tb_employee_job_history(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 73 / 243] tb_employee_salary_history (Phase 2: HR & Employee Management)
-- Purpose: Stores employee salary history information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_salary_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID,
  action_type VARCHAR(50),
  action_by UUID,
  action_time TIMESTAMPTZ,
  details JSONB,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_salary_history_tenant ON tb_employee_salary_history(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 74 / 243] tb_employee_bgv (Phase 2: HR & Employee Management)
-- Purpose: Stores employee bgv information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_bgv (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_bgv_tenant ON tb_employee_bgv(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_bgv_status ON tb_employee_bgv(status);

-- ------------------------------------------------------------------------------
-- [Table 75 / 243] tb_employee_nominee (Phase 2: HR & Employee Management)
-- Purpose: Stores employee nominee information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_nominee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_nominee_tenant ON tb_employee_nominee(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_nominee_status ON tb_employee_nominee(status);

-- ------------------------------------------------------------------------------
-- [Table 76 / 243] tb_employee_status_history (Phase 2: HR & Employee Management)
-- Purpose: Stores employee status history information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID,
  action_type VARCHAR(50),
  action_by UUID,
  action_time TIMESTAMPTZ,
  details JSONB,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_status_history_tenant ON tb_employee_status_history(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 77 / 243] tb_customer_master (Phase 2: Customer & Supplier Master)
-- Purpose: Stores customer master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_customer_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_customer_master_tenant ON tb_customer_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_customer_master_code ON tb_customer_master(code);

-- ------------------------------------------------------------------------------
-- [Table 78 / 243] tb_customer_address (Phase 2: Customer & Supplier Master)
-- Purpose: Stores customer address information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_customer_address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_customer_address_tenant ON tb_customer_address(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_customer_address_status ON tb_customer_address(status);

-- ------------------------------------------------------------------------------
-- [Table 79 / 243] tb_customer_contact (Phase 2: Customer & Supplier Master)
-- Purpose: Stores customer contact information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_customer_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_customer_contact_tenant ON tb_customer_contact(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_customer_contact_status ON tb_customer_contact(status);

-- ------------------------------------------------------------------------------
-- [Table 80 / 243] tb_customer_document (Phase 2: Customer & Supplier Master)
-- Purpose: Stores customer document information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_customer_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  file_name VARCHAR(255),
  storage_key TEXT,
  file_type VARCHAR(80),
  uploaded_by UUID,
  uploaded_time TIMESTAMPTZ,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_customer_document_tenant ON tb_customer_document(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_customer_document_status ON tb_customer_document(status);

-- ------------------------------------------------------------------------------
-- [Table 81 / 243] tb_supplier_master (Phase 2: Customer & Supplier Master)
-- Purpose: Stores supplier master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_supplier_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_supplier_master_tenant ON tb_supplier_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_supplier_master_code ON tb_supplier_master(code);

-- ------------------------------------------------------------------------------
-- [Table 82 / 243] tb_supplier_address (Phase 2: Customer & Supplier Master)
-- Purpose: Stores supplier address information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_supplier_address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_supplier_address_tenant ON tb_supplier_address(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_supplier_address_status ON tb_supplier_address(status);

-- ------------------------------------------------------------------------------
-- [Table 83 / 243] tb_supplier_contact (Phase 2: Customer & Supplier Master)
-- Purpose: Stores supplier contact information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_supplier_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_supplier_contact_tenant ON tb_supplier_contact(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_supplier_contact_status ON tb_supplier_contact(status);

-- ------------------------------------------------------------------------------
-- [Table 84 / 243] tb_supplier_document (Phase 2: Customer & Supplier Master)
-- Purpose: Stores supplier document information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_supplier_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  file_name VARCHAR(255),
  storage_key TEXT,
  file_type VARCHAR(80),
  uploaded_by UUID,
  uploaded_time TIMESTAMPTZ,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_supplier_document_tenant ON tb_supplier_document(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_supplier_document_status ON tb_supplier_document(status);

-- ------------------------------------------------------------------------------
-- [Table 85 / 243] tb_property_master (Phase 2: Land & Building Management)
-- Purpose: Stores property master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_property_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_property_master_tenant ON tb_property_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_master_code ON tb_property_master(code);

-- ------------------------------------------------------------------------------
-- [Table 86 / 243] tb_property_owner (Phase 2: Land & Building Management)
-- Purpose: Stores property owner information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_property_owner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_property_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_property_owner_tenant ON tb_property_owner(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_owner_parent ON tb_property_owner(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_owner_status ON tb_property_owner(status);

-- ------------------------------------------------------------------------------
-- [Table 87 / 243] tb_property_address (Phase 2: Land & Building Management)
-- Purpose: Stores property address information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_property_address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_property_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_property_address_tenant ON tb_property_address(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_address_parent ON tb_property_address(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_address_status ON tb_property_address(status);

-- ------------------------------------------------------------------------------
-- [Table 88 / 243] tb_property_document (Phase 2: Land & Building Management)
-- Purpose: Stores property document information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_property_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_property_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  file_name VARCHAR(255),
  storage_key TEXT,
  file_type VARCHAR(80),
  uploaded_by UUID,
  uploaded_time TIMESTAMPTZ,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_property_document_tenant ON tb_property_document(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_document_parent ON tb_property_document(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_document_status ON tb_property_document(status);

-- ------------------------------------------------------------------------------
-- [Table 89 / 243] tb_property_legal_verification (Phase 2: Land & Building Management)
-- Purpose: Stores property legal verification information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_property_legal_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_property_legal_verification_tenant ON tb_property_legal_verification(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_legal_verification_status ON tb_property_legal_verification(status);

-- ------------------------------------------------------------------------------
-- [Table 90 / 243] tb_property_approval (Phase 2: Land & Building Management)
-- Purpose: Stores property approval information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_property_approval (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_property_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_property_approval_tenant ON tb_property_approval(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_approval_parent ON tb_property_approval(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_property_approval_status ON tb_property_approval(status);

-- ------------------------------------------------------------------------------
-- [Table 91 / 243] tb_construction_project (Phase 2: Land & Building Management)
-- Purpose: Stores construction project information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_construction_project (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_construction_project_tenant ON tb_construction_project(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_construction_project_doc_num ON tb_construction_project(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_construction_project_status ON tb_construction_project(status);

-- ------------------------------------------------------------------------------
-- [Table 92 / 243] tb_construction_phase (Phase 2: Land & Building Management)
-- Purpose: Stores construction phase information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_construction_phase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_construction_project(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_construction_phase_tenant ON tb_construction_phase(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_construction_phase_parent ON tb_construction_phase(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_construction_phase_status ON tb_construction_phase(status);

-- ------------------------------------------------------------------------------
-- [Table 93 / 243] tb_construction_contractor (Phase 2: Land & Building Management)
-- Purpose: Stores construction contractor information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_construction_contractor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_construction_contractor_tenant ON tb_construction_contractor(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_construction_contractor_status ON tb_construction_contractor(status);

-- ------------------------------------------------------------------------------
-- [Table 94 / 243] tb_construction_material (Phase 2: Land & Building Management)
-- Purpose: Stores construction material information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_construction_material (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_construction_material_tenant ON tb_construction_material(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_construction_material_status ON tb_construction_material(status);

-- ------------------------------------------------------------------------------
-- [Table 95 / 243] tb_construction_expense (Phase 2: Land & Building Management)
-- Purpose: Stores construction expense information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_construction_expense (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_construction_expense_tenant ON tb_construction_expense(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_construction_expense_status ON tb_construction_expense(status);

-- ------------------------------------------------------------------------------
-- [Table 96 / 243] tb_construction_progress (Phase 2: Land & Building Management)
-- Purpose: Stores construction progress information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_construction_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_construction_project(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_construction_progress_tenant ON tb_construction_progress(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_construction_progress_parent ON tb_construction_progress(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_construction_progress_status ON tb_construction_progress(status);

-- ------------------------------------------------------------------------------
-- [Table 97 / 243] tb_asset_category (Phase 2: Assets & Maintenance Master)
-- Purpose: Stores asset category information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_asset_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_asset_category_tenant ON tb_asset_category(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_category_code ON tb_asset_category(code);

-- ------------------------------------------------------------------------------
-- [Table 98 / 243] tb_asset_master (Phase 2: Assets & Maintenance Master)
-- Purpose: Stores asset master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_asset_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_asset_master_tenant ON tb_asset_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_master_code ON tb_asset_master(code);

-- ------------------------------------------------------------------------------
-- [Table 99 / 243] tb_asset_location (Phase 2: Assets & Maintenance Master)
-- Purpose: Stores asset location information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_asset_location (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_asset_location_tenant ON tb_asset_location(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_location_code ON tb_asset_location(code);

-- ------------------------------------------------------------------------------
-- [Table 100 / 243] tb_asset_allocation (Phase 2: Assets & Maintenance Master)
-- Purpose: Stores asset allocation information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_asset_allocation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_asset_master(id) ON DELETE CASCADE,
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_asset_allocation_tenant ON tb_asset_allocation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_allocation_parent ON tb_asset_allocation(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_allocation_code ON tb_asset_allocation(code);

-- ------------------------------------------------------------------------------
-- [Table 101 / 243] tb_asset_document (Phase 2: Assets & Maintenance Master)
-- Purpose: Stores asset document information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_asset_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_asset_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  file_name VARCHAR(255),
  storage_key TEXT,
  file_type VARCHAR(80),
  uploaded_by UUID,
  uploaded_time TIMESTAMPTZ,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_asset_document_tenant ON tb_asset_document(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_document_parent ON tb_asset_document(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_document_status ON tb_asset_document(status);

-- ------------------------------------------------------------------------------
-- [Table 102 / 243] tb_asset_warranty (Phase 2: Assets & Maintenance Master)
-- Purpose: Stores asset warranty information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_asset_warranty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_asset_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_asset_warranty_tenant ON tb_asset_warranty(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_warranty_parent ON tb_asset_warranty(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_warranty_status ON tb_asset_warranty(status);

-- ------------------------------------------------------------------------------
-- [Table 103 / 243] tb_asset_vendor (Phase 2: Assets & Maintenance Master)
-- Purpose: Stores asset vendor information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_asset_vendor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_asset_vendor_tenant ON tb_asset_vendor(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_vendor_status ON tb_asset_vendor(status);

-- ------------------------------------------------------------------------------
-- [Table 104 / 243] tb_asset_depreciation_setup (Phase 2: Assets & Maintenance Master)
-- Purpose: Stores asset depreciation setup information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_asset_depreciation_setup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_asset_depreciation_setup_tenant ON tb_asset_depreciation_setup(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_asset_depreciation_setup_status ON tb_asset_depreciation_setup(status);

-- ------------------------------------------------------------------------------
-- [Table 105 / 243] tb_purchase_request (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores purchase request information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_purchase_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_purchase_request_tenant ON tb_purchase_request(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_request_doc_num ON tb_purchase_request(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_request_status ON tb_purchase_request(status);

-- ------------------------------------------------------------------------------
-- [Table 106 / 243] tb_purchase_request_detail (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores purchase request detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_purchase_request_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_purchase_request(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_purchase_request_detail_tenant ON tb_purchase_request_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_request_detail_parent ON tb_purchase_request_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 107 / 243] tb_purchase_order (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores purchase order information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_purchase_order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_purchase_order_tenant ON tb_purchase_order(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_order_doc_num ON tb_purchase_order(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_order_status ON tb_purchase_order(status);

-- ------------------------------------------------------------------------------
-- [Table 108 / 243] tb_purchase_order_detail (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores purchase order detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_purchase_order_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_purchase_order(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_purchase_order_detail_tenant ON tb_purchase_order_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_order_detail_parent ON tb_purchase_order_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 109 / 243] tb_goods_receipt (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores goods receipt information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_goods_receipt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_goods_receipt_tenant ON tb_goods_receipt(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_goods_receipt_doc_num ON tb_goods_receipt(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_goods_receipt_status ON tb_goods_receipt(status);

-- ------------------------------------------------------------------------------
-- [Table 110 / 243] tb_goods_receipt_detail (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores goods receipt detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_goods_receipt_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_goods_receipt(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_goods_receipt_detail_tenant ON tb_goods_receipt_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_goods_receipt_detail_parent ON tb_goods_receipt_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 111 / 243] tb_supplier_invoice (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores supplier invoice information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_supplier_invoice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_supplier_invoice_tenant ON tb_supplier_invoice(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_supplier_invoice_doc_num ON tb_supplier_invoice(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_supplier_invoice_status ON tb_supplier_invoice(status);

-- ------------------------------------------------------------------------------
-- [Table 112 / 243] tb_supplier_invoice_detail (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores supplier invoice detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_supplier_invoice_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_supplier_invoice_detail_tenant ON tb_supplier_invoice_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 113 / 243] tb_purchase_return (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores purchase return information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_purchase_return (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_purchase_return_tenant ON tb_purchase_return(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_return_parent ON tb_purchase_return(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_return_doc_num ON tb_purchase_return(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_return_status ON tb_purchase_return(status);

-- ------------------------------------------------------------------------------
-- [Table 114 / 243] tb_purchase_return_detail (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores purchase return detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_purchase_return_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_purchase_return(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_purchase_return_detail_tenant ON tb_purchase_return_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_return_detail_parent ON tb_purchase_return_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 115 / 243] tb_supplier_payment_allocation (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores supplier payment allocation information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_supplier_payment_allocation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID,
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_supplier_payment_allocation_tenant ON tb_supplier_payment_allocation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_supplier_payment_allocation_code ON tb_supplier_payment_allocation(code);

-- ------------------------------------------------------------------------------
-- [Table 116 / 243] tb_purchase_approval_history (Phase 3: Purchase & Supplier Operations)
-- Purpose: Stores purchase approval history information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_purchase_approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID,
  action_type VARCHAR(50),
  action_by UUID,
  action_time TIMESTAMPTZ,
  details JSONB,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_purchase_approval_history_tenant ON tb_purchase_approval_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_purchase_approval_history_parent ON tb_purchase_approval_history(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 117 / 243] tb_warehouse_master (Phase 3: Inventory & Warehouse)
-- Purpose: Stores warehouse master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_warehouse_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_warehouse_master_tenant ON tb_warehouse_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_warehouse_master_code ON tb_warehouse_master(code);

-- ------------------------------------------------------------------------------
-- [Table 118 / 243] tb_warehouse_location (Phase 3: Inventory & Warehouse)
-- Purpose: Stores warehouse location information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_warehouse_location (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_warehouse_location_tenant ON tb_warehouse_location(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_warehouse_location_code ON tb_warehouse_location(code);

-- ------------------------------------------------------------------------------
-- [Table 119 / 243] tb_stock_balance (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock balance information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_balance_tenant ON tb_stock_balance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_stock_balance_status ON tb_stock_balance(status);

-- ------------------------------------------------------------------------------
-- [Table 120 / 243] tb_stock_ledger (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock ledger information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_ledger_tenant ON tb_stock_ledger(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_stock_ledger_code ON tb_stock_ledger(code);

-- ------------------------------------------------------------------------------
-- [Table 121 / 243] tb_stock_inward (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock inward information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_inward (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_inward_tenant ON tb_stock_inward(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_stock_inward_status ON tb_stock_inward(status);

-- ------------------------------------------------------------------------------
-- [Table 122 / 243] tb_stock_inward_detail (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock inward detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_inward_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_inward_detail_tenant ON tb_stock_inward_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 123 / 243] tb_stock_outward (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock outward information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_outward (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_outward_tenant ON tb_stock_outward(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_stock_outward_status ON tb_stock_outward(status);

-- ------------------------------------------------------------------------------
-- [Table 124 / 243] tb_stock_outward_detail (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock outward detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_outward_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_outward_detail_tenant ON tb_stock_outward_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 125 / 243] tb_stock_transfer (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock transfer information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_transfer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_transfer_tenant ON tb_stock_transfer(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_stock_transfer_doc_num ON tb_stock_transfer(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_stock_transfer_status ON tb_stock_transfer(status);

-- ------------------------------------------------------------------------------
-- [Table 126 / 243] tb_stock_transfer_detail (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock transfer detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_transfer_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_transfer_detail_tenant ON tb_stock_transfer_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 127 / 243] tb_stock_adjustment (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock adjustment information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_adjustment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_adjustment_tenant ON tb_stock_adjustment(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_stock_adjustment_doc_num ON tb_stock_adjustment(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_stock_adjustment_status ON tb_stock_adjustment(status);

-- ------------------------------------------------------------------------------
-- [Table 128 / 243] tb_stock_adjustment_detail (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock adjustment detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_adjustment_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_adjustment_detail_tenant ON tb_stock_adjustment_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 129 / 243] tb_stock_audit (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock audit information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_audit_tenant ON tb_stock_audit(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_stock_audit_doc_num ON tb_stock_audit(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_stock_audit_status ON tb_stock_audit(status);

-- ------------------------------------------------------------------------------
-- [Table 130 / 243] tb_stock_audit_detail (Phase 3: Inventory & Warehouse)
-- Purpose: Stores stock audit detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_stock_audit_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_stock_audit_detail_tenant ON tb_stock_audit_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 131 / 243] tb_sales_enquiry (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales enquiry information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_enquiry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_enquiry_tenant ON tb_sales_enquiry(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_sales_enquiry_status ON tb_sales_enquiry(status);

-- ------------------------------------------------------------------------------
-- [Table 132 / 243] tb_sales_quotation (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales quotation information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_quotation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_quotation_tenant ON tb_sales_quotation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_sales_quotation_doc_num ON tb_sales_quotation(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_sales_quotation_status ON tb_sales_quotation(status);

-- ------------------------------------------------------------------------------
-- [Table 133 / 243] tb_sales_quotation_detail (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales quotation detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_quotation_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_quotation_detail_tenant ON tb_sales_quotation_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 134 / 243] tb_sales_order (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales order information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_order_tenant ON tb_sales_order(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_sales_order_doc_num ON tb_sales_order(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_sales_order_status ON tb_sales_order(status);

-- ------------------------------------------------------------------------------
-- [Table 135 / 243] tb_sales_order_detail (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales order detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_order_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_order_detail_tenant ON tb_sales_order_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 136 / 243] tb_sales_invoice (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales invoice information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_invoice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_invoice_tenant ON tb_sales_invoice(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_sales_invoice_doc_num ON tb_sales_invoice(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_sales_invoice_status ON tb_sales_invoice(status);

-- ------------------------------------------------------------------------------
-- [Table 137 / 243] tb_sales_invoice_detail (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales invoice detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_invoice_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_invoice_detail_tenant ON tb_sales_invoice_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 138 / 243] tb_sales_return (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales return information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_return (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_return_tenant ON tb_sales_return(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_sales_return_doc_num ON tb_sales_return(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_sales_return_status ON tb_sales_return(status);

-- ------------------------------------------------------------------------------
-- [Table 139 / 243] tb_sales_return_detail (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales return detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_return_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_return_detail_tenant ON tb_sales_return_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 140 / 243] tb_customer_receipt (Phase 3: Sales & Customer Operations)
-- Purpose: Stores customer receipt information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_customer_receipt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_customer_receipt_tenant ON tb_customer_receipt(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_customer_receipt_doc_num ON tb_customer_receipt(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_customer_receipt_status ON tb_customer_receipt(status);

-- ------------------------------------------------------------------------------
-- [Table 141 / 243] tb_customer_receipt_allocation (Phase 3: Sales & Customer Operations)
-- Purpose: Stores customer receipt allocation information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_customer_receipt_allocation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_customer_receipt_allocation_tenant ON tb_customer_receipt_allocation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_customer_receipt_allocation_code ON tb_customer_receipt_allocation(code);

-- ------------------------------------------------------------------------------
-- [Table 142 / 243] tb_sales_delivery (Phase 3: Sales & Customer Operations)
-- Purpose: Stores sales delivery information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_sales_delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_sales_delivery_tenant ON tb_sales_delivery(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_sales_delivery_doc_num ON tb_sales_delivery(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_sales_delivery_status ON tb_sales_delivery(status);

-- ------------------------------------------------------------------------------
-- [Table 143 / 243] tb_shift_master (Phase 3: Attendance & Leave Management)
-- Purpose: Stores shift master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_shift_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_shift_master_tenant ON tb_shift_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_shift_master_code ON tb_shift_master(code);

-- ------------------------------------------------------------------------------
-- [Table 144 / 243] tb_employee_shift (Phase 3: Attendance & Leave Management)
-- Purpose: Stores employee shift information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_shift (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_shift_tenant ON tb_employee_shift(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_shift_status ON tb_employee_shift(status);

-- ------------------------------------------------------------------------------
-- [Table 145 / 243] tb_shift_roster (Phase 3: Attendance & Leave Management)
-- Purpose: Stores shift roster information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_shift_roster (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_shift_roster_tenant ON tb_shift_roster(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_shift_roster_status ON tb_shift_roster(status);

-- ------------------------------------------------------------------------------
-- [Table 146 / 243] tb_attendance (Phase 3: Attendance & Leave Management)
-- Purpose: Stores attendance information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_attendance_tenant ON tb_attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_attendance_status ON tb_attendance(status);

-- ------------------------------------------------------------------------------
-- [Table 147 / 243] tb_attendance_punch (Phase 3: Attendance & Leave Management)
-- Purpose: Stores attendance punch information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_attendance_punch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_attendance(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_attendance_punch_tenant ON tb_attendance_punch(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_attendance_punch_parent ON tb_attendance_punch(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_attendance_punch_status ON tb_attendance_punch(status);

-- ------------------------------------------------------------------------------
-- [Table 148 / 243] tb_attendance_device (Phase 3: Attendance & Leave Management)
-- Purpose: Stores attendance device information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_attendance_device (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_attendance_device_tenant ON tb_attendance_device(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_attendance_device_code ON tb_attendance_device(code);

-- ------------------------------------------------------------------------------
-- [Table 149 / 243] tb_attendance_location (Phase 3: Attendance & Leave Management)
-- Purpose: Stores attendance location information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_attendance_location (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_attendance_location_tenant ON tb_attendance_location(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_attendance_location_code ON tb_attendance_location(code);

-- ------------------------------------------------------------------------------
-- [Table 150 / 243] tb_attendance_correction (Phase 3: Attendance & Leave Management)
-- Purpose: Stores attendance correction information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_attendance_correction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_attendance_correction_tenant ON tb_attendance_correction(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_attendance_correction_status ON tb_attendance_correction(status);

-- ------------------------------------------------------------------------------
-- [Table 151 / 243] tb_leave_type (Phase 3: Attendance & Leave Management)
-- Purpose: Stores leave type information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_leave_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_leave_type_tenant ON tb_leave_type(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_leave_type_code ON tb_leave_type(code);

-- ------------------------------------------------------------------------------
-- [Table 152 / 243] tb_leave_balance (Phase 3: Attendance & Leave Management)
-- Purpose: Stores leave balance information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_leave_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_leave_balance_tenant ON tb_leave_balance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_leave_balance_parent ON tb_leave_balance(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_leave_balance_status ON tb_leave_balance(status);

-- ------------------------------------------------------------------------------
-- [Table 153 / 243] tb_leave_request (Phase 3: Attendance & Leave Management)
-- Purpose: Stores leave request information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_leave_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_leave_request_tenant ON tb_leave_request(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_leave_request_doc_num ON tb_leave_request(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_leave_request_status ON tb_leave_request(status);

-- ------------------------------------------------------------------------------
-- [Table 154 / 243] tb_leave_approval (Phase 3: Attendance & Leave Management)
-- Purpose: Stores leave approval information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_leave_approval (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_leave_request(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_leave_approval_tenant ON tb_leave_approval(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_leave_approval_parent ON tb_leave_approval(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_leave_approval_status ON tb_leave_approval(status);

-- ------------------------------------------------------------------------------
-- [Table 155 / 243] tb_employee_permission_request (Phase 3: Attendance & Leave Management)
-- Purpose: Stores employee permission request information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_permission_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_permission_request_tenant ON tb_employee_permission_request(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_permission_request_doc_num ON tb_employee_permission_request(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_employee_permission_request_status ON tb_employee_permission_request(status);

-- ------------------------------------------------------------------------------
-- [Table 156 / 243] tb_employee_on_duty (Phase 3: Attendance & Leave Management)
-- Purpose: Stores employee on duty information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_on_duty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_on_duty_tenant ON tb_employee_on_duty(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_on_duty_status ON tb_employee_on_duty(status);

-- ------------------------------------------------------------------------------
-- [Table 157 / 243] tb_overtime (Phase 3: Attendance & Leave Management)
-- Purpose: Stores overtime information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_overtime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_overtime_tenant ON tb_overtime(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_overtime_status ON tb_overtime(status);

-- ------------------------------------------------------------------------------
-- [Table 158 / 243] tb_bom_master (Phase 3: Production & Manufacturing)
-- Purpose: Stores bom master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_bom_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_bom_master_tenant ON tb_bom_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_bom_master_code ON tb_bom_master(code);

-- ------------------------------------------------------------------------------
-- [Table 159 / 243] tb_bom_detail (Phase 3: Production & Manufacturing)
-- Purpose: Stores bom detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_bom_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_bom_master(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_bom_detail_tenant ON tb_bom_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_bom_detail_parent ON tb_bom_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 160 / 243] tb_production_plan (Phase 3: Production & Manufacturing)
-- Purpose: Stores production plan information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_production_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_production_plan_tenant ON tb_production_plan(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_production_plan_doc_num ON tb_production_plan(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_production_plan_status ON tb_production_plan(status);

-- ------------------------------------------------------------------------------
-- [Table 161 / 243] tb_production_plan_detail (Phase 3: Production & Manufacturing)
-- Purpose: Stores production plan detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_production_plan_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_production_plan_detail_tenant ON tb_production_plan_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 162 / 243] tb_work_order (Phase 3: Production & Manufacturing)
-- Purpose: Stores work order information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_work_order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_work_order_tenant ON tb_work_order(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_work_order_doc_num ON tb_work_order(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_work_order_status ON tb_work_order(status);

-- ------------------------------------------------------------------------------
-- [Table 163 / 243] tb_work_order_detail (Phase 3: Production & Manufacturing)
-- Purpose: Stores work order detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_work_order_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_work_order(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_work_order_detail_tenant ON tb_work_order_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_work_order_detail_parent ON tb_work_order_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 164 / 243] tb_material_issue (Phase 3: Production & Manufacturing)
-- Purpose: Stores material issue information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_material_issue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_material_issue_tenant ON tb_material_issue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_material_issue_doc_num ON tb_material_issue(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_material_issue_status ON tb_material_issue(status);

-- ------------------------------------------------------------------------------
-- [Table 165 / 243] tb_material_issue_detail (Phase 3: Production & Manufacturing)
-- Purpose: Stores material issue detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_material_issue_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  product_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_material_issue_detail_tenant ON tb_material_issue_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 166 / 243] tb_material_return (Phase 3: Production & Manufacturing)
-- Purpose: Stores material return information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_material_return (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  product_id UUID,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_material_return_tenant ON tb_material_return(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_material_return_doc_num ON tb_material_return(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_material_return_status ON tb_material_return(status);

-- ------------------------------------------------------------------------------
-- [Table 167 / 243] tb_material_return_detail (Phase 3: Production & Manufacturing)
-- Purpose: Stores material return detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_material_return_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  product_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_material_return_detail_tenant ON tb_material_return_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 168 / 243] tb_production_entry (Phase 3: Production & Manufacturing)
-- Purpose: Stores production entry information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_production_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_production_entry_tenant ON tb_production_entry(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_production_entry_doc_num ON tb_production_entry(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_production_entry_status ON tb_production_entry(status);

-- ------------------------------------------------------------------------------
-- [Table 169 / 243] tb_production_entry_detail (Phase 3: Production & Manufacturing)
-- Purpose: Stores production entry detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_production_entry_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_production_entry_detail_tenant ON tb_production_entry_detail(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 170 / 243] tb_work_in_progress (Phase 3: Production & Manufacturing)
-- Purpose: Stores work in progress information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_work_in_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_work_in_progress_tenant ON tb_work_in_progress(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_work_in_progress_parent ON tb_work_in_progress(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_work_in_progress_status ON tb_work_in_progress(status);

-- ------------------------------------------------------------------------------
-- [Table 171 / 243] tb_production_quality_check (Phase 3: Production & Manufacturing)
-- Purpose: Stores production quality check information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_production_quality_check (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_production_quality_check_tenant ON tb_production_quality_check(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_production_quality_check_status ON tb_production_quality_check(status);

-- ------------------------------------------------------------------------------
-- [Table 172 / 243] tb_production_rejection (Phase 3: Production & Manufacturing)
-- Purpose: Stores production rejection information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_production_rejection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_production_rejection_tenant ON tb_production_rejection(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_production_rejection_status ON tb_production_rejection(status);

-- ------------------------------------------------------------------------------
-- [Table 173 / 243] tb_production_wastage (Phase 3: Production & Manufacturing)
-- Purpose: Stores production wastage information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_production_wastage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_production_wastage_tenant ON tb_production_wastage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_production_wastage_status ON tb_production_wastage(status);

-- ------------------------------------------------------------------------------
-- [Table 174 / 243] tb_account_group (Phase 4: Banking & Accounting)
-- Purpose: Stores account group information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_account_group (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_account_group_tenant ON tb_account_group(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_account_group_code ON tb_account_group(code);

-- ------------------------------------------------------------------------------
-- [Table 175 / 243] tb_account_ledger (Phase 4: Banking & Accounting)
-- Purpose: Stores account ledger information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_account_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID,
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_account_ledger_tenant ON tb_account_ledger(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_account_ledger_parent ON tb_account_ledger(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_account_ledger_code ON tb_account_ledger(code);

-- ------------------------------------------------------------------------------
-- [Table 176 / 243] tb_accounting_voucher (Phase 4: Banking & Accounting)
-- Purpose: Stores accounting voucher information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_accounting_voucher (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_accounting_voucher_tenant ON tb_accounting_voucher(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_accounting_voucher_doc_num ON tb_accounting_voucher(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_accounting_voucher_status ON tb_accounting_voucher(status);

-- ------------------------------------------------------------------------------
-- [Table 177 / 243] tb_accounting_voucher_detail (Phase 4: Banking & Accounting)
-- Purpose: Stores accounting voucher detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_accounting_voucher_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  parent_id UUID NOT NULL REFERENCES tb_accounting_voucher(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_accounting_voucher_detail_tenant ON tb_accounting_voucher_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_accounting_voucher_detail_parent ON tb_accounting_voucher_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 178 / 243] tb_voucher_type (Phase 4: Banking & Accounting)
-- Purpose: Stores voucher type information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_voucher_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_voucher_type_tenant ON tb_voucher_type(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_voucher_type_code ON tb_voucher_type(code);

-- ------------------------------------------------------------------------------
-- [Table 179 / 243] tb_fiscal_period (Phase 4: Banking & Accounting)
-- Purpose: Stores fiscal period information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_fiscal_period (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_fiscal_period_tenant ON tb_fiscal_period(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_fiscal_period_code ON tb_fiscal_period(code);

-- ------------------------------------------------------------------------------
-- [Table 180 / 243] tb_bank_master (Phase 4: Banking & Accounting)
-- Purpose: Stores bank master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_bank_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_bank_master_tenant ON tb_bank_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_bank_master_code ON tb_bank_master(code);

-- ------------------------------------------------------------------------------
-- [Table 181 / 243] tb_company_bank_account (Phase 4: Banking & Accounting)
-- Purpose: Stores company bank account information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company_bank_account (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_bank_account_tenant ON tb_company_bank_account(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_company_bank_account_status ON tb_company_bank_account(status);

-- ------------------------------------------------------------------------------
-- [Table 182 / 243] tb_bank_statement (Phase 4: Banking & Accounting)
-- Purpose: Stores bank statement information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_bank_statement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_bank_statement_tenant ON tb_bank_statement(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_bank_statement_doc_num ON tb_bank_statement(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_bank_statement_status ON tb_bank_statement(status);

-- ------------------------------------------------------------------------------
-- [Table 183 / 243] tb_bank_statement_detail (Phase 4: Banking & Accounting)
-- Purpose: Stores bank statement detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_bank_statement_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_bank_statement(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_bank_statement_detail_tenant ON tb_bank_statement_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_bank_statement_detail_parent ON tb_bank_statement_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 184 / 243] tb_bank_reconciliation (Phase 4: Banking & Accounting)
-- Purpose: Stores bank reconciliation information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_bank_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_bank_reconciliation_tenant ON tb_bank_reconciliation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_bank_reconciliation_parent ON tb_bank_reconciliation(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_bank_reconciliation_status ON tb_bank_reconciliation(status);

-- ------------------------------------------------------------------------------
-- [Table 185 / 243] tb_cash_transaction (Phase 4: Banking & Accounting)
-- Purpose: Stores cash transaction information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_cash_transaction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  parent_id UUID,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_cash_transaction_tenant ON tb_cash_transaction(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_cash_transaction_parent ON tb_cash_transaction(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_cash_transaction_status ON tb_cash_transaction(status);

-- ------------------------------------------------------------------------------
-- [Table 186 / 243] tb_expense_category (Phase 4: Banking & Accounting)
-- Purpose: Stores expense category information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_expense_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_expense_category_tenant ON tb_expense_category(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_expense_category_code ON tb_expense_category(code);

-- ------------------------------------------------------------------------------
-- [Table 187 / 243] tb_expense_claim (Phase 4: Banking & Accounting)
-- Purpose: Stores expense claim information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_expense_claim (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_expense_claim_tenant ON tb_expense_claim(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_expense_claim_doc_num ON tb_expense_claim(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_expense_claim_status ON tb_expense_claim(status);

-- ------------------------------------------------------------------------------
-- [Table 188 / 243] tb_expense_claim_detail (Phase 4: Banking & Accounting)
-- Purpose: Stores expense claim detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_expense_claim_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_expense_claim(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_expense_claim_detail_tenant ON tb_expense_claim_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_expense_claim_detail_parent ON tb_expense_claim_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 189 / 243] tb_payment_voucher (Phase 4: Banking & Accounting)
-- Purpose: Stores payment voucher information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payment_voucher (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_payment_voucher_tenant ON tb_payment_voucher(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payment_voucher_doc_num ON tb_payment_voucher(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_payment_voucher_status ON tb_payment_voucher(status);

-- ------------------------------------------------------------------------------
-- [Table 190 / 243] tb_receipt_voucher (Phase 4: Banking & Accounting)
-- Purpose: Stores receipt voucher information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_receipt_voucher (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_receipt_voucher_tenant ON tb_receipt_voucher(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_receipt_voucher_doc_num ON tb_receipt_voucher(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_receipt_voucher_status ON tb_receipt_voucher(status);

-- ------------------------------------------------------------------------------
-- [Table 191 / 243] tb_journal_voucher (Phase 4: Banking & Accounting)
-- Purpose: Stores journal voucher information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_journal_voucher (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_journal_voucher_tenant ON tb_journal_voucher(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_journal_voucher_doc_num ON tb_journal_voucher(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_journal_voucher_status ON tb_journal_voucher(status);

-- ------------------------------------------------------------------------------
-- [Table 192 / 243] tb_salary_component (Phase 4: Payroll & Benefits)
-- Purpose: Stores salary component information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_salary_component (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_salary_component_tenant ON tb_salary_component(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_salary_component_code ON tb_salary_component(code);

-- ------------------------------------------------------------------------------
-- [Table 193 / 243] tb_salary_structure (Phase 4: Payroll & Benefits)
-- Purpose: Stores salary structure information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_salary_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_salary_structure_tenant ON tb_salary_structure(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_salary_structure_status ON tb_salary_structure(status);

-- ------------------------------------------------------------------------------
-- [Table 194 / 243] tb_salary_structure_detail (Phase 4: Payroll & Benefits)
-- Purpose: Stores salary structure detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_salary_structure_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_salary_structure(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_salary_structure_detail_tenant ON tb_salary_structure_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_salary_structure_detail_parent ON tb_salary_structure_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 195 / 243] tb_employee_salary (Phase 4: Payroll & Benefits)
-- Purpose: Stores employee salary information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_employee_salary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_employee_salary_tenant ON tb_employee_salary(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_employee_salary_status ON tb_employee_salary(status);

-- ------------------------------------------------------------------------------
-- [Table 196 / 243] tb_payroll_period (Phase 4: Payroll & Benefits)
-- Purpose: Stores payroll period information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payroll_period (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_payroll_period_tenant ON tb_payroll_period(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payroll_period_code ON tb_payroll_period(code);

-- ------------------------------------------------------------------------------
-- [Table 197 / 243] tb_payroll_run (Phase 4: Payroll & Benefits)
-- Purpose: Stores payroll run information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payroll_run (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_payroll_run_tenant ON tb_payroll_run(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payroll_run_doc_num ON tb_payroll_run(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_payroll_run_status ON tb_payroll_run(status);

-- ------------------------------------------------------------------------------
-- [Table 198 / 243] tb_payroll_detail (Phase 4: Payroll & Benefits)
-- Purpose: Stores payroll detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payroll_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_payroll_run(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_payroll_detail_tenant ON tb_payroll_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payroll_detail_parent ON tb_payroll_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 199 / 243] tb_payroll_component_detail (Phase 4: Payroll & Benefits)
-- Purpose: Stores payroll component detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payroll_component_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_payroll_detail(id) ON DELETE CASCADE,
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  quantity NUMERIC(14,3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_payroll_component_detail_tenant ON tb_payroll_component_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payroll_component_detail_parent ON tb_payroll_component_detail(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_payroll_component_detail_code ON tb_payroll_component_detail(code);

-- ------------------------------------------------------------------------------
-- [Table 200 / 243] tb_payroll_deduction (Phase 4: Payroll & Benefits)
-- Purpose: Stores payroll deduction information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payroll_deduction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_payroll_deduction_tenant ON tb_payroll_deduction(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payroll_deduction_status ON tb_payroll_deduction(status);

-- ------------------------------------------------------------------------------
-- [Table 201 / 243] tb_payroll_overtime (Phase 4: Payroll & Benefits)
-- Purpose: Stores payroll overtime information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payroll_overtime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_payroll_overtime_tenant ON tb_payroll_overtime(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payroll_overtime_status ON tb_payroll_overtime(status);

-- ------------------------------------------------------------------------------
-- [Table 202 / 243] tb_pf_contribution (Phase 4: Payroll & Benefits)
-- Purpose: Stores pf contribution information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_pf_contribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  quantity NUMERIC(14,3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_pf_contribution_tenant ON tb_pf_contribution(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_pf_contribution_status ON tb_pf_contribution(status);

-- ------------------------------------------------------------------------------
-- [Table 203 / 243] tb_esi_contribution (Phase 4: Payroll & Benefits)
-- Purpose: Stores esi contribution information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_esi_contribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  quantity NUMERIC(14,3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_esi_contribution_tenant ON tb_esi_contribution(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_esi_contribution_status ON tb_esi_contribution(status);

-- ------------------------------------------------------------------------------
-- [Table 204 / 243] tb_bonus_calculation (Phase 4: Payroll & Benefits)
-- Purpose: Stores bonus calculation information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_bonus_calculation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_bonus_calculation_tenant ON tb_bonus_calculation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_bonus_calculation_status ON tb_bonus_calculation(status);

-- ------------------------------------------------------------------------------
-- [Table 205 / 243] tb_gratuity_calculation (Phase 4: Payroll & Benefits)
-- Purpose: Stores gratuity calculation information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_gratuity_calculation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_gratuity_calculation_tenant ON tb_gratuity_calculation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_gratuity_calculation_status ON tb_gratuity_calculation(status);

-- ------------------------------------------------------------------------------
-- [Table 206 / 243] tb_payslip (Phase 4: Payroll & Benefits)
-- Purpose: Stores payslip information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_payslip (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_payslip_tenant ON tb_payslip(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_payslip_status ON tb_payslip(status);

-- ------------------------------------------------------------------------------
-- [Table 207 / 243] tb_full_final_settlement (Phase 4: Payroll & Benefits)
-- Purpose: Stores full final settlement information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_full_final_settlement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_full_final_settlement_tenant ON tb_full_final_settlement(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_full_final_settlement_doc_num ON tb_full_final_settlement(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_full_final_settlement_status ON tb_full_final_settlement(status);

-- ------------------------------------------------------------------------------
-- [Table 208 / 243] tb_licence_type (Phase 4: Licence & Compliance)
-- Purpose: Stores licence type information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_licence_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_licence_type_tenant ON tb_licence_type(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_licence_type_code ON tb_licence_type(code);

-- ------------------------------------------------------------------------------
-- [Table 209 / 243] tb_company_licence (Phase 4: Licence & Compliance)
-- Purpose: Stores company licence information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_company_licence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tb_company_licence_tenant ON tb_company_licence(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_company_licence_status ON tb_company_licence(status);

-- ------------------------------------------------------------------------------
-- [Table 210 / 243] tb_licence_document (Phase 4: Licence & Compliance)
-- Purpose: Stores licence document information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_licence_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_company_licence(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  file_name VARCHAR(255),
  storage_key TEXT,
  file_type VARCHAR(80),
  uploaded_by UUID,
  uploaded_time TIMESTAMPTZ,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_licence_document_tenant ON tb_licence_document(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_licence_document_parent ON tb_licence_document(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_licence_document_status ON tb_licence_document(status);

-- ------------------------------------------------------------------------------
-- [Table 211 / 243] tb_licence_renewal (Phase 4: Licence & Compliance)
-- Purpose: Stores licence renewal information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_licence_renewal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_licence_renewal_tenant ON tb_licence_renewal(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_licence_renewal_status ON tb_licence_renewal(status);

-- ------------------------------------------------------------------------------
-- [Table 212 / 243] tb_compliance_type (Phase 4: Licence & Compliance)
-- Purpose: Stores compliance type information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_compliance_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_compliance_type_tenant ON tb_compliance_type(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_type_code ON tb_compliance_type(code);

-- ------------------------------------------------------------------------------
-- [Table 213 / 243] tb_compliance_master (Phase 4: Licence & Compliance)
-- Purpose: Stores compliance master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_compliance_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_compliance_master_tenant ON tb_compliance_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_master_code ON tb_compliance_master(code);

-- ------------------------------------------------------------------------------
-- [Table 214 / 243] tb_compliance_calendar (Phase 4: Licence & Compliance)
-- Purpose: Stores compliance calendar information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_compliance_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_compliance_calendar_tenant ON tb_compliance_calendar(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_calendar_status ON tb_compliance_calendar(status);

-- ------------------------------------------------------------------------------
-- [Table 215 / 243] tb_compliance_task (Phase 4: Licence & Compliance)
-- Purpose: Stores compliance task information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_compliance_task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_compliance_task_tenant ON tb_compliance_task(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_task_doc_num ON tb_compliance_task(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_task_status ON tb_compliance_task(status);

-- ------------------------------------------------------------------------------
-- [Table 216 / 243] tb_compliance_submission (Phase 4: Licence & Compliance)
-- Purpose: Stores compliance submission information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_compliance_submission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_compliance_submission_tenant ON tb_compliance_submission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_submission_doc_num ON tb_compliance_submission(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_submission_status ON tb_compliance_submission(status);

-- ------------------------------------------------------------------------------
-- [Table 217 / 243] tb_compliance_payment (Phase 4: Licence & Compliance)
-- Purpose: Stores compliance payment information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_compliance_payment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_compliance_payment_tenant ON tb_compliance_payment(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_payment_doc_num ON tb_compliance_payment(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_payment_status ON tb_compliance_payment(status);

-- ------------------------------------------------------------------------------
-- [Table 218 / 243] tb_compliance_notice (Phase 4: Licence & Compliance)
-- Purpose: Stores compliance notice information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_compliance_notice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_compliance_notice_tenant ON tb_compliance_notice(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_notice_doc_num ON tb_compliance_notice(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_notice_status ON tb_compliance_notice(status);

-- ------------------------------------------------------------------------------
-- [Table 219 / 243] tb_compliance_document (Phase 4: Licence & Compliance)
-- Purpose: Stores compliance document information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_compliance_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_compliance_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  effective_from DATE,
  effective_to DATE,
  file_name VARCHAR(255),
  storage_key TEXT,
  file_type VARCHAR(80),
  uploaded_by UUID,
  uploaded_time TIMESTAMPTZ,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_compliance_document_tenant ON tb_compliance_document(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_document_parent ON tb_compliance_document(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_compliance_document_status ON tb_compliance_document(status);

-- ------------------------------------------------------------------------------
-- [Table 220 / 243] tb_government_portal (Phase 4: Government Integration & Statutory)
-- Purpose: Stores government portal information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_government_portal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_government_portal_tenant ON tb_government_portal(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_government_portal_code ON tb_government_portal(code);

-- ------------------------------------------------------------------------------
-- [Table 221 / 243] tb_government_api_config (Phase 4: Government Integration & Statutory)
-- Purpose: Stores government api config information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_government_api_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_government_api_config_tenant ON tb_government_api_config(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_government_api_config_status ON tb_government_api_config(status);

-- ------------------------------------------------------------------------------
-- [Table 222 / 243] tb_government_api_log (Phase 4: Government Integration & Statutory)
-- Purpose: Stores government api log information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_government_api_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type VARCHAR(50),
  action_by UUID,
  action_time TIMESTAMPTZ,
  details JSONB,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_government_api_log_tenant ON tb_government_api_log(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 223 / 243] tb_statutory_form_master (Phase 4: Government Integration & Statutory)
-- Purpose: Stores statutory form master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_statutory_form_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_statutory_form_master_tenant ON tb_statutory_form_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_form_master_code ON tb_statutory_form_master(code);

-- ------------------------------------------------------------------------------
-- [Table 224 / 243] tb_statutory_form_version (Phase 4: Government Integration & Statutory)
-- Purpose: Stores statutory form version information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_statutory_form_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_statutory_form_master(id) ON DELETE CASCADE,
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_statutory_form_version_tenant ON tb_statutory_form_version(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_form_version_parent ON tb_statutory_form_version(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_form_version_code ON tb_statutory_form_version(code);

-- ------------------------------------------------------------------------------
-- [Table 225 / 243] tb_statutory_submission (Phase 4: Government Integration & Statutory)
-- Purpose: Stores statutory submission information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_statutory_submission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(50),
  document_date DATE,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  remarks TEXT,
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_statutory_submission_tenant ON tb_statutory_submission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_submission_doc_num ON tb_statutory_submission(document_number);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_submission_status ON tb_statutory_submission(status);

-- ------------------------------------------------------------------------------
-- [Table 226 / 243] tb_statutory_submission_detail (Phase 4: Government Integration & Statutory)
-- Purpose: Stores statutory submission detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_statutory_submission_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_statutory_submission(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  effective_from DATE,
  effective_to DATE,
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_statutory_submission_detail_tenant ON tb_statutory_submission_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_submission_detail_parent ON tb_statutory_submission_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 227 / 243] tb_statutory_acknowledgement (Phase 4: Government Integration & Statutory)
-- Purpose: Stores statutory acknowledgement information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_statutory_acknowledgement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_statutory_acknowledgement_tenant ON tb_statutory_acknowledgement(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_acknowledgement_status ON tb_statutory_acknowledgement(status);

-- ------------------------------------------------------------------------------
-- [Table 228 / 243] tb_statutory_rule_master (Phase 4: Government Integration & Statutory)
-- Purpose: Stores statutory rule master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_statutory_rule_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_statutory_rule_master_tenant ON tb_statutory_rule_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_rule_master_code ON tb_statutory_rule_master(code);

-- ------------------------------------------------------------------------------
-- [Table 229 / 243] tb_statutory_rule_version (Phase 4: Government Integration & Statutory)
-- Purpose: Stores statutory rule version information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_statutory_rule_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_statutory_rule_master(id) ON DELETE CASCADE,
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_statutory_rule_version_tenant ON tb_statutory_rule_version(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_rule_version_parent ON tb_statutory_rule_version(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_rule_version_code ON tb_statutory_rule_version(code);

-- ------------------------------------------------------------------------------
-- [Table 230 / 243] tb_minimum_wage_master (Phase 4: Government Integration & Statutory)
-- Purpose: Stores minimum wage master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_minimum_wage_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_minimum_wage_master_tenant ON tb_minimum_wage_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_minimum_wage_master_code ON tb_minimum_wage_master(code);

-- ------------------------------------------------------------------------------
-- [Table 231 / 243] tb_minimum_wage_detail (Phase 4: Government Integration & Statutory)
-- Purpose: Stores minimum wage detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_minimum_wage_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_minimum_wage_master(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_minimum_wage_detail_tenant ON tb_minimum_wage_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_minimum_wage_detail_parent ON tb_minimum_wage_detail(parent_id);

-- ------------------------------------------------------------------------------
-- [Table 232 / 243] tb_statutory_calculation_log (Phase 4: Government Integration & Statutory)
-- Purpose: Stores statutory calculation log information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_statutory_calculation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type VARCHAR(50),
  action_by UUID,
  action_time TIMESTAMPTZ,
  details JSONB,
  quantity NUMERIC(14,3),
  amount NUMERIC(14,2),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_statutory_calculation_log_tenant ON tb_statutory_calculation_log(tenant_id);

-- ------------------------------------------------------------------------------
-- [Table 233 / 243] tb_statutory_rule_impact (Phase 4: Government Integration & Statutory)
-- Purpose: Stores statutory rule impact information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_statutory_rule_impact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_statutory_rule_impact_tenant ON tb_statutory_rule_impact(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_statutory_rule_impact_code ON tb_statutory_rule_impact(code);

-- ------------------------------------------------------------------------------
-- [Table 234 / 243] tb_investment_type (Phase 4: Investment & Finance)
-- Purpose: Stores investment type information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_investment_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_investment_type_tenant ON tb_investment_type(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_investment_type_code ON tb_investment_type(code);

-- ------------------------------------------------------------------------------
-- [Table 235 / 243] tb_investment_master (Phase 4: Investment & Finance)
-- Purpose: Stores investment master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_investment_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_investment_master_tenant ON tb_investment_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_investment_master_code ON tb_investment_master(code);

-- ------------------------------------------------------------------------------
-- [Table 236 / 243] tb_investment_transaction (Phase 4: Investment & Finance)
-- Purpose: Stores investment transaction information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_investment_transaction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_investment_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  quantity NUMERIC(14,3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_investment_transaction_tenant ON tb_investment_transaction(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_investment_transaction_parent ON tb_investment_transaction(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_investment_transaction_status ON tb_investment_transaction(status);

-- ------------------------------------------------------------------------------
-- [Table 237 / 243] tb_capital_contribution (Phase 4: Investment & Finance)
-- Purpose: Stores capital contribution information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_capital_contribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  quantity NUMERIC(14,3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_capital_contribution_tenant ON tb_capital_contribution(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_capital_contribution_status ON tb_capital_contribution(status);

-- ------------------------------------------------------------------------------
-- [Table 238 / 243] tb_loan_master (Phase 4: Investment & Finance)
-- Purpose: Stores loan master information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_loan_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name VARCHAR(200),
  description TEXT,
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_loan_master_tenant ON tb_loan_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_loan_master_code ON tb_loan_master(code);

-- ------------------------------------------------------------------------------
-- [Table 239 / 243] tb_loan_schedule (Phase 4: Investment & Finance)
-- Purpose: Stores loan schedule information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_loan_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_loan_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  effective_from DATE,
  effective_to DATE,
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_loan_schedule_tenant ON tb_loan_schedule(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_loan_schedule_parent ON tb_loan_schedule(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_loan_schedule_status ON tb_loan_schedule(status);

-- ------------------------------------------------------------------------------
-- [Table 240 / 243] tb_loan_transaction (Phase 4: Investment & Finance)
-- Purpose: Stores loan transaction information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_loan_transaction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_loan_master(id) ON DELETE CASCADE,
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  quantity NUMERIC(14,3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_loan_transaction_tenant ON tb_loan_transaction(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_loan_transaction_parent ON tb_loan_transaction(parent_id);
CREATE INDEX IF NOT EXISTS idx_tb_loan_transaction_status ON tb_loan_transaction(status);

-- ------------------------------------------------------------------------------
-- [Table 241 / 243] tb_interest_calculation (Phase 4: Investment & Finance)
-- Purpose: Stores interest calculation information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_interest_calculation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  quantity NUMERIC(14,3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_interest_calculation_tenant ON tb_interest_calculation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_interest_calculation_status ON tb_interest_calculation(status);

-- ------------------------------------------------------------------------------
-- [Table 242 / 243] tb_financial_budget (Phase 4: Investment & Finance)
-- Purpose: Stores financial budget information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_financial_budget (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  description TEXT,
  status VARCHAR(30) DEFAULT 'ACTIVE',
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_financial_budget_tenant ON tb_financial_budget(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_financial_budget_status ON tb_financial_budget(status);

-- ------------------------------------------------------------------------------
-- [Table 243 / 243] tb_financial_budget_detail (Phase 4: Investment & Finance)
-- Purpose: Stores financial budget detail information for the related Zuno ERP business process.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tb_financial_budget_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES tb_financial_budget(id) ON DELETE CASCADE,
  line_number INTEGER,
  description TEXT,
  quantity NUMERIC(14,3),
  unit_price NUMERIC(14,2),
  line_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  currency_code VARCHAR(3),
  created_by UUID,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by UUID,
  updated_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tb_financial_budget_detail_tenant ON tb_financial_budget_detail(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tb_financial_budget_detail_parent ON tb_financial_budget_detail(parent_id);

-- ==============================================================================
-- OPERATIONAL PLATFORM INFRASTRUCTURE: Reliable Outbox & Audit Log
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tb_archive_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE CASCADE,
  source_table VARCHAR(100) NOT NULL,
  source_record_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  next_retry_at TIMESTAMPTZ,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  processed_time TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_archive_outbox_status ON tb_archive_outbox(status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_archive_outbox_tenant ON tb_archive_outbox(tenant_id);

CREATE TABLE IF NOT EXISTS tb_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tb_tenant(id) ON DELETE SET NULL,
  company_id UUID,
  branch_id UUID,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id UUID,
  ip_address VARCHAR(50),
  user_agent TEXT,
  old_data JSONB,
  new_data JSONB,
  status VARCHAR(20) DEFAULT 'SUCCESS' NOT NULL,
  created_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_log_tenant ON tb_audit_log(tenant_id, created_time DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON tb_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource ON tb_audit_log(resource, resource_id);
