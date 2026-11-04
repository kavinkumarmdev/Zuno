# ZUNO ERP — Complete Database Table & Column Catalogue

**Approved Reference Architecture**: Phase 1 to Phase 4 (243 Tables)

| Phase | Scope | Table Count |
| :--- | :--- | :--- |
| Phase 1 | SaaS Foundation | 48 |
| Phase 2 | Business Master Data | 56 |
| Phase 3 | Daily Business Operations | 69 |
| Phase 4 | Finance & Compliance | 70 |
| **Total** | **All 4 Phases** | **243** |


# Phase 1: SaaS Foundation


## Module: Company Management

### 1. `tb_tenant`
**Purpose**: A customer account boundary that owns one or more companies in Zuno.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique tenant identifier. |
| `tenant_code` | `VARCHAR(30)` | Unique customer account code. |
| `tenant_name` | `VARCHAR(200)` | Customer account or business group name. |
| `account_status` | `VARCHAR(30)` | PENDING, ACTIVE, SUSPENDED or CANCELLED. |
| `registration_source` | `VARCHAR(30)` | WEB, MOBILE, ADMIN or referral source. |
| `registered_time` | `TIMESTAMPTZ` | Account registration time. |
| `activated_time` | `TIMESTAMPTZ` | Account activation time. |
| `suspended_time` | `TIMESTAMPTZ` | Time account was suspended. |
| `suspension_reason` | `TEXT` | Reason for suspension. |
| `created_time` | `TIMESTAMPTZ` | Creation time. |
| `updated_time` | `TIMESTAMPTZ` | Last update time. |

---

### 2. `tb_tenant_owner`
**Purpose**: Owner and primary contact details for a tenant account.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique owner-contact row. |
| `tenant_id` | `UUID` | Tenant account reference. |
| `owner_name` | `VARCHAR(150)` | Owner/contact full name. |
| `email` | `VARCHAR(150)` | Email address. |
| `mobile` | `VARCHAR(20)` | Mobile number. |
| `designation` | `VARCHAR(100)` | Owner, director, partner or contact designation. |
| `is_primary` | `BOOLEAN` | Whether this is the primary contact. |
| `is_verified` | `BOOLEAN` | Whether contact details are verified. |
| `created_time` | `TIMESTAMPTZ` | Creation time. |

---

### 3. `tb_company`
**Purpose**: Legal/business entity registered under a tenant.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique company identifier. |
| `tenant_id` | `UUID` | Owning tenant. |
| `company_code` | `VARCHAR(30)` | Company code unique within tenant. |
| `company_name` | `VARCHAR(200)` | Display/business name. |
| `legal_name` | `VARCHAR(200)` | Registered legal name. |
| `business_type` | `VARCHAR(50)` | Retail, manufacturing, service or other business type. |
| `ownership_type` | `VARCHAR(50)` | Proprietorship, partnership, LLP, private limited, etc. |
| `industry_type` | `VARCHAR(100)` | Industry classification. |
| `pan_number` | `VARCHAR(20)` | PAN, where applicable; protect as sensitive data. |
| `tan_number` | `VARCHAR(20)` | TAN, where applicable. |
| `gstin` | `VARCHAR(20)` | GST registration number, if registered. |
| `cin_number` | `VARCHAR(30)` | Corporate identification number, if applicable. |
| `udyam_number` | `VARCHAR(30)` | Udyam/MSME registration number, if applicable. |
| `incorporation_date` | `DATE` | Incorporation or establishment date. |
| `financial_year_start` | `DATE` | Configured financial-year start date. |
| `currency_code` | `VARCHAR(3)` | Default ISO currency code, e.g. INR. |
| `country_code` | `VARCHAR(2)` | ISO country code. |
| `company_status` | `VARCHAR(30)` | ACTIVE, INACTIVE or CLOSED. |
| `created_by` | `UUID` | Creator user reference. |
| `created_time` | `TIMESTAMPTZ` | Creation time. |
| `updated_by` | `UUID` | Last updater user reference. |
| `updated_time` | `TIMESTAMPTZ` | Last update time. |

---

### 4. `tb_company_address`
**Purpose**: Registered, billing, office or other company addresses.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `company_id` | `UUID` | Related company identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 5. `tb_company_contact`
**Purpose**: Named company contacts and their communication details.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `company_id` | `UUID` | Related company identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 6. `tb_company_registration`
**Purpose**: Government and statutory registration identifiers for a company.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 7. `tb_company_branch`
**Purpose**: A shop, office, factory, warehouse or other operating branch.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 8. `tb_company_document`
**Purpose**: Secure metadata for company certificates and uploaded documents.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `company_id` | `UUID` | Related company identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `file_name` | `VARCHAR(255)` | Original uploaded file name. |
| `storage_key` | `TEXT` | Private object-storage key; not a public URL. |
| `file_type` | `VARCHAR(80)` | MIME type or file extension. |
| `uploaded_by` | `UUID` | User who uploaded the file. |
| `uploaded_time` | `TIMESTAMPTZ` | Upload timestamp. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 9. `tb_company_financial_year`
**Purpose**: Financial-year periods configured for a company.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 10. `tb_company_settings`
**Purpose**: Company-level regional, currency, date and application settings.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. SaaS Platform & Subscription |

---


## Module: SaaS Platform & Subscription

### 11. `tb_module_category`
**Purpose**: Shared catalogue grouping for Zuno modules.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 12. `tb_module`
**Purpose**: Shared catalogue of purchasable Zuno modules.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique module identifier. |
| `category_id` | `UUID` | Module category reference. |
| `module_code` | `VARCHAR(40)` | Stable unique module code. |
| `module_name` | `VARCHAR(150)` | Display name. |
| `description` | `TEXT` | What the module provides. |
| `icon_name` | `VARCHAR(80)` | Frontend icon identifier. |
| `display_order` | `INTEGER` | Display sequence. |
| `is_selectable` | `BOOLEAN` | Whether customers can purchase it. |
| `is_active` | `BOOLEAN` | Whether the module is available on the platform. |
| `created_time` | `TIMESTAMPTZ` | Creation time. |

---

### 13. `tb_submodule`
**Purpose**: Functional sections within a main module.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 14. `tb_module_feature`
**Purpose**: Individual application features within a submodule.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 15. `tb_module_dependency`
**Purpose**: Rules describing modules required by other modules.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 16. `tb_module_price`
**Purpose**: Versioned fixed prices for modules by currency and billing cycle.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique price version identifier. |
| `module_id` | `UUID` | Module being priced. |
| `price_name` | `VARCHAR(100)` | Name of price option. |
| `billing_cycle` | `VARCHAR(20)` | MONTHLY, YEARLY or ONE_TIME. |
| `currency_code` | `VARCHAR(3)` | Currency code. |
| `fixed_amount` | `NUMERIC(12,2)` | Published fixed module price. |
| `effective_from` | `DATE` | First date this price applies. |
| `effective_to` | `DATE` | Last date this price applies; nullable for current price. |
| `price_version` | `INTEGER` | Sequential price version. |
| `is_active` | `BOOLEAN` | Whether price can be selected. |

---

### 17. `tb_tax_rate`
**Purpose**: Tax rates and effective dates used for subscription billing.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 18. `tb_discount_coupon`
**Purpose**: Promotional discount codes and their validity rules.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 19. `tb_subscription`
**Purpose**: A tenant or company subscription contract and billing period.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique subscription identifier. |
| `tenant_id` | `UUID` | Tenant purchasing the subscription. |
| `company_id` | `UUID` | Company scope; nullable for tenant-wide subscription. |
| `subscription_number` | `VARCHAR(50)` | Human-readable subscription reference. |
| `billing_cycle` | `VARCHAR(20)` | MONTHLY or YEARLY. |
| `currency_code` | `VARCHAR(3)` | Billing currency. |
| `start_date` | `DATE` | Subscription period start. |
| `end_date` | `DATE` | Subscription period end. |
| `next_billing_date` | `DATE` | Next scheduled billing date. |
| `subtotal_amount` | `NUMERIC(12,2)` | Amount before discount and tax. |
| `discount_amount` | `NUMERIC(12,2)` | Total discount. |
| `tax_amount` | `NUMERIC(12,2)` | Total tax. |
| `total_amount` | `NUMERIC(12,2)` | Final payable amount. |
| `subscription_status` | `VARCHAR(30)` | PENDING, TRIAL, ACTIVE, PAST_DUE, SUSPENDED, CANCELLED or EXPIRED. |
| `auto_renew` | `BOOLEAN` | Whether renewal is automatic. |
| `trial_end_date` | `DATE` | Trial end date, if applicable. |
| `grace_period_end` | `DATE` | Last date of payment grace period. |
| `cancelled_time` | `TIMESTAMPTZ` | Cancellation timestamp. |
| `created_time` | `TIMESTAMPTZ` | Creation time. |

---

### 20. `tb_subscription_item`
**Purpose**: A purchased module line and its agreed price snapshot.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique subscription line identifier. |
| `subscription_id` | `UUID` | Parent subscription. |
| `module_id` | `UUID` | Purchased module. |
| `module_price_id` | `UUID` | Catalogue price version used. |
| `module_name_snapshot` | `VARCHAR(150)` | Module name preserved at purchase. |
| `billing_cycle` | `VARCHAR(20)` | Billing cycle for this item. |
| `unit_price` | `NUMERIC(12,2)` | Agreed price snapshot. |
| `discount_amount` | `NUMERIC(12,2)` | Line discount. |
| `tax_amount` | `NUMERIC(12,2)` | Line tax. |
| `final_amount` | `NUMERIC(12,2)` | Final line amount. |
| `item_status` | `VARCHAR(30)` | PENDING, ACTIVE, SUSPENDED, CANCELLED or EXPIRED. |
| `activation_time` | `TIMESTAMPTZ` | Module activation time. |
| `expiry_time` | `TIMESTAMPTZ` | Module expiry time. |

---

### 21. `tb_subscription_entitlement`
**Purpose**: Effective permission to access a subscribed module.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique access entitlement identifier. |
| `tenant_id` | `UUID` | Tenant receiving access. |
| `company_id` | `UUID` | Company scope; nullable for tenant-wide access. |
| `subscription_id` | `UUID` | Source subscription. |
| `subscription_item_id` | `UUID` | Purchased module line. |
| `module_id` | `UUID` | Module granted. |
| `entitlement_status` | `VARCHAR(30)` | PENDING, ACTIVE, SUSPENDED, REVOKED or EXPIRED. |
| `valid_from` | `TIMESTAMPTZ` | Access start. |
| `valid_until` | `TIMESTAMPTZ` | Access end. |
| `activation_source` | `VARCHAR(30)` | PAYMENT, TRIAL, ADMIN or PROMOTION. |
| `activated_by` | `UUID` | User/admin that activated access. |
| `activated_time` | `TIMESTAMPTZ` | Activation timestamp. |

---

### 22. `tb_subscription_feature`
**Purpose**: Feature-level entitlements within an activated module.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 23. `tb_subscription_history`
**Purpose**: Audit trail of subscription status and commercial changes.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `action_type` | `VARCHAR(50)` | Action or event type. |
| `action_by` | `UUID` | User or system actor. |
| `action_time` | `TIMESTAMPTZ` | Event timestamp. |
| `details` | `JSONB` | Structured event details. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 24. `tb_invoice`
**Purpose**: Zuno sales invoice issued to a subscribing customer.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 25. `tb_invoice_detail`
**Purpose**: Individual module or service lines on a subscription invoice.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 26. `tb_payment`
**Purpose**: Payment transaction against a Zuno invoice.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 27. `tb_payment_attempt`
**Purpose**: Individual checkout/payment attempts, including retries.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 28. `tb_payment_webhook`
**Purpose**: Verified gateway event inbox for idempotent payment processing.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 29. `tb_refund`
**Purpose**: Refund request and gateway refund result.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 30. `tb_subscription_change_request`
**Purpose**: Customer request to add, remove or change subscribed modules.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 31. `tb_subscription_change_detail`
**Purpose**: Module-level changes within a subscription change request.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 32. `tb_subscription_renewal`
**Purpose**: Renewal periods and renewal processing status.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 33. `tb_subscription_limit`
**Purpose**: Quantitative limits included in a subscription.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 34. `tb_subscription_module_usage`
**Purpose**: Measured module usage against subscription limits.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Administration & Management |

---


## Module: Administration & Management

### 35. `tb_user`
**Purpose**: Customer-side user identity within a tenant.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique customer user identifier. |
| `tenant_id` | `UUID` | Tenant owning this user. |
| `username` | `VARCHAR(100)` | Login username, unique within tenant. |
| `full_name` | `VARCHAR(150)` | User's display name. |
| `email` | `VARCHAR(150)` | Email address. |
| `mobile` | `VARCHAR(20)` | Mobile number. |
| `user_type` | `VARCHAR(30)` | OWNER, ADMIN, MANAGER or EMPLOYEE. |
| `user_status` | `VARCHAR(30)` | PENDING, ACTIVE, LOCKED or DISABLED. |
| `email_verified` | `BOOLEAN` | Email verification flag. |
| `mobile_verified` | `BOOLEAN` | Mobile verification flag. |
| `last_login_time` | `TIMESTAMPTZ` | Most recent successful login. |
| `created_time` | `TIMESTAMPTZ` | Creation time. |
| `updated_time` | `TIMESTAMPTZ` | Last update time. |

---

### 36. `tb_user_credential`
**Purpose**: Password hash and credential security state for a user.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique credential row. |
| `user_id` | `UUID` | User reference; unique per user. |
| `password_hash` | `TEXT` | Argon2id or other approved password hash; never plaintext. |
| `password_changed_time` | `TIMESTAMPTZ` | Last password change. |
| `failed_attempts` | `INTEGER` | Consecutive failed login count. |
| `locked_until` | `TIMESTAMPTZ` | Account lock expiry. |
| `force_password_change` | `BOOLEAN` | Require password reset at next login. |
| `created_time` | `TIMESTAMPTZ` | Creation time. |
| `updated_time` | `TIMESTAMPTZ` | Last update time. |

---

### 37. `tb_user_otp`
**Purpose**: Hashed one-time verification codes and expiry details.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 38. `tb_user_session`
**Purpose**: Refresh-token session and device login information.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 39. `tb_login_history`
**Purpose**: Successful and failed customer login activity.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `action_type` | `VARCHAR(50)` | Action or event type. |
| `action_by` | `UUID` | User or system actor. |
| `action_time` | `TIMESTAMPTZ` | Event timestamp. |
| `details` | `JSONB` | Structured event details. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 40. `tb_role`
**Purpose**: Tenant-defined role such as HR Manager or Accountant.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 41. `tb_permission`
**Purpose**: Permission catalogue for module actions.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 42. `tb_role_permission`
**Purpose**: Permissions granted or denied to a role.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 43. `tb_user_role`
**Purpose**: Role assignments for users and optional company scope.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 44. `tb_user_company_access`
**Purpose**: Company-level access granted to a user.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 45. `tb_user_branch_access`
**Purpose**: Branch-level access granted to a user.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 46. `tb_approval_workflow`
**Purpose**: Configurable approval process for a business activity.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 47. `tb_approval_workflow_step`
**Purpose**: Ordered approval steps and approver rules.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 48. `tb_platform_admin`
**Purpose**: Separate internal Zuno administrator identity.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique internal administrator identifier. |
| `admin_code` | `VARCHAR(30)` | Internal admin code. |
| `admin_name` | `VARCHAR(150)` | Administrator name. |
| `email` | `VARCHAR(150)` | Login email. |
| `mobile` | `VARCHAR(20)` | Mobile number. |
| `password_hash` | `TEXT` | Secure password hash. |
| `admin_role` | `VARCHAR(50)` | SUPER_ADMIN, SUPPORT or BILLING_ADMIN. |
| `admin_status` | `VARCHAR(30)` | ACTIVE, LOCKED or DISABLED. |
| `last_login_time` | `TIMESTAMPTZ` | Last successful login. |
| `created_time` | `TIMESTAMPTZ` | Creation time. Phase 2 – Business Master Data Product & Material Management |

---


# Phase 2: Business Master Data


## Module: Product & Material Management

### 49. `tb_product_category`
**Purpose**: Stores product category information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 50. `tb_product_subcategory`
**Purpose**: Stores product subcategory information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 51. `tb_product_master`
**Purpose**: Stores product master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 52. `tb_product_variant`
**Purpose**: Stores product variant information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 53. `tb_product_unit`
**Purpose**: Stores product unit information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 54. `tb_product_unit_conversion`
**Purpose**: Stores product unit conversion information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 55. `tb_product_barcode`
**Purpose**: Stores product barcode information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 56. `tb_product_price`
**Purpose**: Stores product price information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 57. `tb_product_tax`
**Purpose**: Stores product tax information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 58. `tb_product_batch`
**Purpose**: Stores product batch information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 59. `tb_product_brand`
**Purpose**: Stores product brand information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 60. `tb_product_document`
**Purpose**: Stores product document information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `file_name` | `VARCHAR(255)` | Original uploaded file name. |
| `storage_key` | `TEXT` | Private object-storage key; not a public URL. |
| `file_type` | `VARCHAR(80)` | MIME type or file extension. |
| `uploaded_by` | `UUID` | User who uploaded the file. |
| `uploaded_time` | `TIMESTAMPTZ` | Upload timestamp. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. HR & Employee Management |

---


## Module: HR & Employee Management

### 61. `tb_department`
**Purpose**: Stores department information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 62. `tb_designation`
**Purpose**: Stores designation information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 63. `tb_employee_master`
**Purpose**: Stores employee master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 64. `tb_employee_personal`
**Purpose**: Stores employee personal information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 65. `tb_employee_address`
**Purpose**: Stores employee address information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `employee_id` | `UUID` | Related employee identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 66. `tb_employee_contact`
**Purpose**: Stores employee contact information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `employee_id` | `UUID` | Related employee identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 67. `tb_employee_bank`
**Purpose**: Stores employee bank information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 68. `tb_employee_document`
**Purpose**: Stores employee document information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `employee_id` | `UUID` | Related employee identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `file_name` | `VARCHAR(255)` | Original uploaded file name. |
| `storage_key` | `TEXT` | Private object-storage key; not a public URL. |
| `file_type` | `VARCHAR(80)` | MIME type or file extension. |
| `uploaded_by` | `UUID` | User who uploaded the file. |
| `uploaded_time` | `TIMESTAMPTZ` | Upload timestamp. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 69. `tb_employee_education`
**Purpose**: Stores employee education information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 70. `tb_employee_experience`
**Purpose**: Stores employee experience information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 71. `tb_employee_family`
**Purpose**: Stores employee family information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 72. `tb_employee_job_history`
**Purpose**: Stores employee job history information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `employee_id` | `UUID` | Related employee identifier. |
| `action_type` | `VARCHAR(50)` | Action or event type. |
| `action_by` | `UUID` | User or system actor. |
| `action_time` | `TIMESTAMPTZ` | Event timestamp. |
| `details` | `JSONB` | Structured event details. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 73. `tb_employee_salary_history`
**Purpose**: Stores employee salary history information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `employee_id` | `UUID` | Related employee identifier. |
| `action_type` | `VARCHAR(50)` | Action or event type. |
| `action_by` | `UUID` | User or system actor. |
| `action_time` | `TIMESTAMPTZ` | Event timestamp. |
| `details` | `JSONB` | Structured event details. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 74. `tb_employee_bgv`
**Purpose**: Stores employee bgv information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 75. `tb_employee_nominee`
**Purpose**: Stores employee nominee information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 76. `tb_employee_status_history`
**Purpose**: Stores employee status history information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `employee_id` | `UUID` | Related employee identifier. |
| `action_type` | `VARCHAR(50)` | Action or event type. |
| `action_by` | `UUID` | User or system actor. |
| `action_time` | `TIMESTAMPTZ` | Event timestamp. |
| `details` | `JSONB` | Structured event details. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Customer & Supplier Master |

---


## Module: Customer & Supplier Master

### 77. `tb_customer_master`
**Purpose**: Stores customer master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 78. `tb_customer_address`
**Purpose**: Stores customer address information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `customer_id` | `UUID` | Related customer identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 79. `tb_customer_contact`
**Purpose**: Stores customer contact information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `customer_id` | `UUID` | Related customer identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 80. `tb_customer_document`
**Purpose**: Stores customer document information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `customer_id` | `UUID` | Related customer identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `file_name` | `VARCHAR(255)` | Original uploaded file name. |
| `storage_key` | `TEXT` | Private object-storage key; not a public URL. |
| `file_type` | `VARCHAR(80)` | MIME type or file extension. |
| `uploaded_by` | `UUID` | User who uploaded the file. |
| `uploaded_time` | `TIMESTAMPTZ` | Upload timestamp. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 81. `tb_supplier_master`
**Purpose**: Stores supplier master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 82. `tb_supplier_address`
**Purpose**: Stores supplier address information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `supplier_id` | `UUID` | Related supplier identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 83. `tb_supplier_contact`
**Purpose**: Stores supplier contact information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `supplier_id` | `UUID` | Related supplier identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 84. `tb_supplier_document`
**Purpose**: Stores supplier document information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `supplier_id` | `UUID` | Related supplier identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `file_name` | `VARCHAR(255)` | Original uploaded file name. |
| `storage_key` | `TEXT` | Private object-storage key; not a public URL. |
| `file_type` | `VARCHAR(80)` | MIME type or file extension. |
| `uploaded_by` | `UUID` | User who uploaded the file. |
| `uploaded_time` | `TIMESTAMPTZ` | Upload timestamp. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Land & Building Management |

---


## Module: Land & Building Management

### 85. `tb_property_master`
**Purpose**: Stores property master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 86. `tb_property_owner`
**Purpose**: Stores property owner information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 87. `tb_property_address`
**Purpose**: Stores property address information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 88. `tb_property_document`
**Purpose**: Stores property document information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `file_name` | `VARCHAR(255)` | Original uploaded file name. |
| `storage_key` | `TEXT` | Private object-storage key; not a public URL. |
| `file_type` | `VARCHAR(80)` | MIME type or file extension. |
| `uploaded_by` | `UUID` | User who uploaded the file. |
| `uploaded_time` | `TIMESTAMPTZ` | Upload timestamp. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 89. `tb_property_legal_verification`
**Purpose**: Stores property legal verification information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 90. `tb_property_approval`
**Purpose**: Stores property approval information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 91. `tb_construction_project`
**Purpose**: Stores construction project information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 92. `tb_construction_phase`
**Purpose**: Stores construction phase information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 93. `tb_construction_contractor`
**Purpose**: Stores construction contractor information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 94. `tb_construction_material`
**Purpose**: Stores construction material information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 95. `tb_construction_expense`
**Purpose**: Stores construction expense information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 96. `tb_construction_progress`
**Purpose**: Stores construction progress information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Assets & Maintenance Master |

---


## Module: Assets & Maintenance Master

### 97. `tb_asset_category`
**Purpose**: Stores asset category information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 98. `tb_asset_master`
**Purpose**: Stores asset master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 99. `tb_asset_location`
**Purpose**: Stores asset location information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 100. `tb_asset_allocation`
**Purpose**: Stores asset allocation information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 101. `tb_asset_document`
**Purpose**: Stores asset document information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `file_name` | `VARCHAR(255)` | Original uploaded file name. |
| `storage_key` | `TEXT` | Private object-storage key; not a public URL. |
| `file_type` | `VARCHAR(80)` | MIME type or file extension. |
| `uploaded_by` | `UUID` | User who uploaded the file. |
| `uploaded_time` | `TIMESTAMPTZ` | Upload timestamp. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 102. `tb_asset_warranty`
**Purpose**: Stores asset warranty information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 103. `tb_asset_vendor`
**Purpose**: Stores asset vendor information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 104. `tb_asset_depreciation_setup`
**Purpose**: Stores asset depreciation setup information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Phase 3 – Daily Business Operations Purchase & Supplier Operations |

---


# Phase 3: Daily Business Operations


## Module: Purchase & Supplier Operations

### 105. `tb_purchase_request`
**Purpose**: Stores purchase request information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 106. `tb_purchase_request_detail`
**Purpose**: Stores purchase request detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 107. `tb_purchase_order`
**Purpose**: Stores purchase order information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 108. `tb_purchase_order_detail`
**Purpose**: Stores purchase order detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 109. `tb_goods_receipt`
**Purpose**: Stores goods receipt information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 110. `tb_goods_receipt_detail`
**Purpose**: Stores goods receipt detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 111. `tb_supplier_invoice`
**Purpose**: Stores supplier invoice information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 112. `tb_supplier_invoice_detail`
**Purpose**: Stores supplier invoice detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `supplier_id` | `UUID` | Related supplier identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 113. `tb_purchase_return`
**Purpose**: Stores purchase return information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 114. `tb_purchase_return_detail`
**Purpose**: Stores purchase return detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 115. `tb_supplier_payment_allocation`
**Purpose**: Stores supplier payment allocation information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `supplier_id` | `UUID` | Related supplier identifier. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 116. `tb_purchase_approval_history`
**Purpose**: Stores purchase approval history information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `action_type` | `VARCHAR(50)` | Action or event type. |
| `action_by` | `UUID` | User or system actor. |
| `action_time` | `TIMESTAMPTZ` | Event timestamp. |
| `details` | `JSONB` | Structured event details. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Inventory & Warehouse |

---


## Module: Inventory & Warehouse

### 117. `tb_warehouse_master`
**Purpose**: Stores warehouse master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 118. `tb_warehouse_location`
**Purpose**: Stores warehouse location information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 119. `tb_stock_balance`
**Purpose**: Stores stock balance information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 120. `tb_stock_ledger`
**Purpose**: Stores stock ledger information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 121. `tb_stock_inward`
**Purpose**: Stores stock inward information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 122. `tb_stock_inward_detail`
**Purpose**: Stores stock inward detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 123. `tb_stock_outward`
**Purpose**: Stores stock outward information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 124. `tb_stock_outward_detail`
**Purpose**: Stores stock outward detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 125. `tb_stock_transfer`
**Purpose**: Stores stock transfer information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 126. `tb_stock_transfer_detail`
**Purpose**: Stores stock transfer detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 127. `tb_stock_adjustment`
**Purpose**: Stores stock adjustment information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 128. `tb_stock_adjustment_detail`
**Purpose**: Stores stock adjustment detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 129. `tb_stock_audit`
**Purpose**: Stores stock audit information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 130. `tb_stock_audit_detail`
**Purpose**: Stores stock audit detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Sales & Customer Operations |

---


## Module: Sales & Customer Operations

### 131. `tb_sales_enquiry`
**Purpose**: Stores sales enquiry information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 132. `tb_sales_quotation`
**Purpose**: Stores sales quotation information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 133. `tb_sales_quotation_detail`
**Purpose**: Stores sales quotation detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `customer_id` | `UUID` | Related customer identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 134. `tb_sales_order`
**Purpose**: Stores sales order information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 135. `tb_sales_order_detail`
**Purpose**: Stores sales order detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `customer_id` | `UUID` | Related customer identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 136. `tb_sales_invoice`
**Purpose**: Stores sales invoice information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 137. `tb_sales_invoice_detail`
**Purpose**: Stores sales invoice detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `customer_id` | `UUID` | Related customer identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 138. `tb_sales_return`
**Purpose**: Stores sales return information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `customer_id` | `UUID` | Related customer identifier. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 139. `tb_sales_return_detail`
**Purpose**: Stores sales return detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `customer_id` | `UUID` | Related customer identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 140. `tb_customer_receipt`
**Purpose**: Stores customer receipt information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 141. `tb_customer_receipt_allocation`
**Purpose**: Stores customer receipt allocation information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `customer_id` | `UUID` | Related customer identifier. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 142. `tb_sales_delivery`
**Purpose**: Stores sales delivery information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Attendance & Leave Management |

---


## Module: Attendance & Leave Management

### 143. `tb_shift_master`
**Purpose**: Stores shift master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 144. `tb_employee_shift`
**Purpose**: Stores employee shift information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 145. `tb_shift_roster`
**Purpose**: Stores shift roster information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 146. `tb_attendance`
**Purpose**: Stores attendance information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 147. `tb_attendance_punch`
**Purpose**: Stores attendance punch information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 148. `tb_attendance_device`
**Purpose**: Stores attendance device information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 149. `tb_attendance_location`
**Purpose**: Stores attendance location information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 150. `tb_attendance_correction`
**Purpose**: Stores attendance correction information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 151. `tb_leave_type`
**Purpose**: Stores leave type information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 152. `tb_leave_balance`
**Purpose**: Stores leave balance information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 153. `tb_leave_request`
**Purpose**: Stores leave request information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 154. `tb_leave_approval`
**Purpose**: Stores leave approval information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 155. `tb_employee_permission_request`
**Purpose**: Stores employee permission request information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 156. `tb_employee_on_duty`
**Purpose**: Stores employee on duty information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 157. `tb_overtime`
**Purpose**: Stores overtime information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Production & Manufacturing |

---


## Module: Production & Manufacturing

### 158. `tb_bom_master`
**Purpose**: Stores bom master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 159. `tb_bom_detail`
**Purpose**: Stores bom detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 160. `tb_production_plan`
**Purpose**: Stores production plan information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 161. `tb_production_plan_detail`
**Purpose**: Stores production plan detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 162. `tb_work_order`
**Purpose**: Stores work order information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 163. `tb_work_order_detail`
**Purpose**: Stores work order detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 164. `tb_material_issue`
**Purpose**: Stores material issue information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 165. `tb_material_issue_detail`
**Purpose**: Stores material issue detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `product_id` | `UUID` | Related product/material identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 166. `tb_material_return`
**Purpose**: Stores material return information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `product_id` | `UUID` | Related product/material identifier. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 167. `tb_material_return_detail`
**Purpose**: Stores material return detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `product_id` | `UUID` | Related product/material identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 168. `tb_production_entry`
**Purpose**: Stores production entry information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 169. `tb_production_entry_detail`
**Purpose**: Stores production entry detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `product_id` | `UUID` | Related product/material identifier. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 170. `tb_work_in_progress`
**Purpose**: Stores work in progress information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 171. `tb_production_quality_check`
**Purpose**: Stores production quality check information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 172. `tb_production_rejection`
**Purpose**: Stores production rejection information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 173. `tb_production_wastage`
**Purpose**: Stores production wastage information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Phase 4 – Finance & Compliance Banking & Accounting |

---


# Phase 4: Finance & Compliance


## Module: Banking & Accounting

### 174. `tb_account_group`
**Purpose**: Stores account group information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 175. `tb_account_ledger`
**Purpose**: Stores account ledger information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 176. `tb_accounting_voucher`
**Purpose**: Stores accounting voucher information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 177. `tb_accounting_voucher_detail`
**Purpose**: Stores accounting voucher detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 178. `tb_voucher_type`
**Purpose**: Stores voucher type information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 179. `tb_fiscal_period`
**Purpose**: Stores fiscal period information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 180. `tb_bank_master`
**Purpose**: Stores bank master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 181. `tb_company_bank_account`
**Purpose**: Stores company bank account information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 182. `tb_bank_statement`
**Purpose**: Stores bank statement information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 183. `tb_bank_statement_detail`
**Purpose**: Stores bank statement detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 184. `tb_bank_reconciliation`
**Purpose**: Stores bank reconciliation information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 185. `tb_cash_transaction`
**Purpose**: Stores cash transaction information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 186. `tb_expense_category`
**Purpose**: Stores expense category information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 187. `tb_expense_claim`
**Purpose**: Stores expense claim information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 188. `tb_expense_claim_detail`
**Purpose**: Stores expense claim detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 189. `tb_payment_voucher`
**Purpose**: Stores payment voucher information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 190. `tb_receipt_voucher`
**Purpose**: Stores receipt voucher information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 191. `tb_journal_voucher`
**Purpose**: Stores journal voucher information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Payroll & Benefits |

---


## Module: Payroll & Benefits

### 192. `tb_salary_component`
**Purpose**: Stores salary component information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 193. `tb_salary_structure`
**Purpose**: Stores salary structure information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 194. `tb_salary_structure_detail`
**Purpose**: Stores salary structure detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 195. `tb_employee_salary`
**Purpose**: Stores employee salary information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 196. `tb_payroll_period`
**Purpose**: Stores payroll period information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 197. `tb_payroll_run`
**Purpose**: Stores payroll run information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 198. `tb_payroll_detail`
**Purpose**: Stores payroll detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 199. `tb_payroll_component_detail`
**Purpose**: Stores payroll component detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 200. `tb_payroll_deduction`
**Purpose**: Stores payroll deduction information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 201. `tb_payroll_overtime`
**Purpose**: Stores payroll overtime information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 202. `tb_pf_contribution`
**Purpose**: Stores pf contribution information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 203. `tb_esi_contribution`
**Purpose**: Stores esi contribution information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 204. `tb_bonus_calculation`
**Purpose**: Stores bonus calculation information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 205. `tb_gratuity_calculation`
**Purpose**: Stores gratuity calculation information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 206. `tb_payslip`
**Purpose**: Stores payslip information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 207. `tb_full_final_settlement`
**Purpose**: Stores full final settlement information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Licence & Compliance |

---


## Module: Licence & Compliance

### 208. `tb_licence_type`
**Purpose**: Stores licence type information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 209. `tb_company_licence`
**Purpose**: Stores company licence information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `tenant_id` | `UUID` | Tenant owning this record; used for tenant isolation. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 210. `tb_licence_document`
**Purpose**: Stores licence document information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `file_name` | `VARCHAR(255)` | Original uploaded file name. |
| `storage_key` | `TEXT` | Private object-storage key; not a public URL. |
| `file_type` | `VARCHAR(80)` | MIME type or file extension. |
| `uploaded_by` | `UUID` | User who uploaded the file. |
| `uploaded_time` | `TIMESTAMPTZ` | Upload timestamp. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 211. `tb_licence_renewal`
**Purpose**: Stores licence renewal information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 212. `tb_compliance_type`
**Purpose**: Stores compliance type information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 213. `tb_compliance_master`
**Purpose**: Stores compliance master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 214. `tb_compliance_calendar`
**Purpose**: Stores compliance calendar information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 215. `tb_compliance_task`
**Purpose**: Stores compliance task information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 216. `tb_compliance_submission`
**Purpose**: Stores compliance submission information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 217. `tb_compliance_payment`
**Purpose**: Stores compliance payment information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 218. `tb_compliance_notice`
**Purpose**: Stores compliance notice information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 219. `tb_compliance_document`
**Purpose**: Stores compliance document information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `file_name` | `VARCHAR(255)` | Original uploaded file name. |
| `storage_key` | `TEXT` | Private object-storage key; not a public URL. |
| `file_type` | `VARCHAR(80)` | MIME type or file extension. |
| `uploaded_by` | `UUID` | User who uploaded the file. |
| `uploaded_time` | `TIMESTAMPTZ` | Upload timestamp. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Government Integration & Statutory |

---


## Module: Government Integration & Statutory

### 220. `tb_government_portal`
**Purpose**: Stores government portal information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 221. `tb_government_api_config`
**Purpose**: Stores government api config information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 222. `tb_government_api_log`
**Purpose**: Stores government api log information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `action_type` | `VARCHAR(50)` | Action or event type. |
| `action_by` | `UUID` | User or system actor. |
| `action_time` | `TIMESTAMPTZ` | Event timestamp. |
| `details` | `JSONB` | Structured event details. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 223. `tb_statutory_form_master`
**Purpose**: Stores statutory form master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 224. `tb_statutory_form_version`
**Purpose**: Stores statutory form version information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 225. `tb_statutory_submission`
**Purpose**: Stores statutory submission information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `document_number` | `VARCHAR(50)` | Unique document/reference number. |
| `document_date` | `DATE` | Business document date. |
| `status` | `VARCHAR(30)` | Workflow status. |
| `remarks` | `TEXT` | Additional notes. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 226. `tb_statutory_submission_detail`
**Purpose**: Stores statutory submission detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 227. `tb_statutory_acknowledgement`
**Purpose**: Stores statutory acknowledgement information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 228. `tb_statutory_rule_master`
**Purpose**: Stores statutory rule master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 229. `tb_statutory_rule_version`
**Purpose**: Stores statutory rule version information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 230. `tb_minimum_wage_master`
**Purpose**: Stores minimum wage master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 231. `tb_minimum_wage_detail`
**Purpose**: Stores minimum wage detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 232. `tb_statutory_calculation_log`
**Purpose**: Stores statutory calculation log information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `action_type` | `VARCHAR(50)` | Action or event type. |
| `action_by` | `UUID` | User or system actor. |
| `action_time` | `TIMESTAMPTZ` | Event timestamp. |
| `details` | `JSONB` | Structured event details. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `amount` | `NUMERIC(14,2)` | Calculated monetary amount, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 233. `tb_statutory_rule_impact`
**Purpose**: Stores statutory rule impact information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. Investment & Finance |

---


## Module: Investment & Finance

### 234. `tb_investment_type`
**Purpose**: Stores investment type information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 235. `tb_investment_master`
**Purpose**: Stores investment master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 236. `tb_investment_transaction`
**Purpose**: Stores investment transaction information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 237. `tb_capital_contribution`
**Purpose**: Stores capital contribution information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 238. `tb_loan_master`
**Purpose**: Stores loan master information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `code` | `VARCHAR(50)` | Unique business code within the applicable scope. |
| `name` | `VARCHAR(200)` | Display name. |
| `description` | `TEXT` | Description or notes. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 239. `tb_loan_schedule`
**Purpose**: Stores loan schedule information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `effective_from` | `DATE` | Effective/start date. |
| `effective_to` | `DATE` | End/expiry date, if applicable. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 240. `tb_loan_transaction`
**Purpose**: Stores loan transaction information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 241. `tb_interest_calculation`
**Purpose**: Stores interest calculation information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `quantity` | `NUMERIC(14,3)` | Quantity or units, when relevant. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 242. `tb_financial_budget`
**Purpose**: Stores financial budget information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `name` | `VARCHAR(200)` | Name or display value. |
| `description` | `TEXT` | Description or notes. |
| `status` | `VARCHAR(30)` | Current business status. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---

### 243. `tb_financial_budget_detail`
**Purpose**: Stores financial budget detail information for the related Zuno ERP business process.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Unique row identifier; primary key. |
| `parent_id` | `UUID` | Parent/master record identifier; exact FK depends on the owning workflow. |
| `line_number` | `INTEGER` | Line sequence within the parent document. |
| `description` | `TEXT` | Line description. |
| `quantity` | `NUMERIC(14,3)` | Transaction quantity. |
| `unit_price` | `NUMERIC(14,2)` | Unit rate, where applicable. |
| `line_amount` | `NUMERIC(14,2)` | Calculated line amount. |
| `amount` | `NUMERIC(14,2)` | Monetary amount in the applicable currency. |
| `currency_code` | `VARCHAR(3)` | ISO currency code, e.g. INR. |
| `created_by` | `UUID` | User who created the row, where applicable. |
| `created_time` | `TIMESTAMPTZ` | Creation timestamp. |
| `updated_by` | `UUID` | User who last updated the row, where applicable. |
| `updated_time` | `TIMESTAMPTZ` | Last update timestamp. |
| `is_active` | `BOOLEAN` | Whether the row is active, where lifecycle rules permit. |

---
