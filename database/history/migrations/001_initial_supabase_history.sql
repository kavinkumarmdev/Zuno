-- ==============================================================================
-- ZUNO ERP — SUPABASE HISTORICAL & STATUTORY ARCHIVE DDL
-- Provider: Supabase PostgreSQL
-- Purpose: Cold storage, statutory audit logs, archived fiscal periods, deleted records
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Master History Archive Table (Unified immutable payload store)
CREATE TABLE IF NOT EXISTS tb_historical_records (
  archive_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  company_id UUID,
  source_table VARCHAR(100) NOT NULL,
  source_record_id UUID NOT NULL,
  archive_reason VARCHAR(100) NOT NULL,
  fiscal_year VARCHAR(30),
  version_number INTEGER DEFAULT 1 NOT NULL,
  payload_snapshot JSONB NOT NULL,
  hash_checksum VARCHAR(128) NOT NULL,
  archived_by UUID,
  archived_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_hist_tenant_table ON tb_historical_records(tenant_id, source_table, source_record_id);
CREATE INDEX IF NOT EXISTS idx_hist_archived_at ON tb_historical_records(archived_at DESC);
CREATE INDEX IF NOT EXISTS idx_hist_source_record ON tb_historical_records(source_record_id);

-- Dedicated Historical Mirror for Audited Financial Invoices
CREATE TABLE IF NOT EXISTS tb_historical_sales_invoice (
  archive_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  company_id UUID,
  document_number VARCHAR(50) NOT NULL,
  document_date DATE,
  customer_id UUID,
  amount NUMERIC(14,2),
  details_snapshot JSONB NOT NULL,
  archived_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_hist_inv_tenant ON tb_historical_sales_invoice(tenant_id, document_number);

-- Dedicated Historical Mirror for Audited Payroll Runs
CREATE TABLE IF NOT EXISTS tb_historical_payroll_run (
  archive_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  company_id UUID,
  payroll_period VARCHAR(50),
  document_number VARCHAR(50),
  total_payout NUMERIC(14,2),
  details_snapshot JSONB NOT NULL,
  archived_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_hist_payroll_tenant ON tb_historical_payroll_run(tenant_id);

-- Dedicated Historical Mirror for Deleted Record Audit
CREATE TABLE IF NOT EXISTS tb_historical_tombstones (
  archive_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  source_table VARCHAR(100) NOT NULL,
  deleted_record_id UUID NOT NULL,
  deleted_by UUID,
  deletion_reason TEXT,
  record_data JSONB NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tombstones_tenant ON tb_historical_tombstones(tenant_id, source_table);
