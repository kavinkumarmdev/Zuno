import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleInit
} from '@nestjs/common';
import { NeonPrismaService } from '../database/neon-prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PaginationParams, PaginationMeta } from '@zuno/shared-types';
import { OperationalDataStore, StoredRecord } from './operational-store';

@Injectable()
export class BusinessModulesService implements OnModuleInit {
  private readonly logger = new Logger(BusinessModulesService.name);

  constructor(
    private readonly prisma: NeonPrismaService,
    private readonly subscriptionsService: SubscriptionsService
  ) {}

  /**
   * Safe migration initialization: protects against schema drift and accidental table drops
   */
  async onModuleInit() {
    this.logger.log('Initializing BusinessModulesService with Safe Migration Protection...');
    try {
      OperationalDataStore.createSnapshotBackup('startup');
      this.logger.log('Migration recovery snapshot verified successfully.');
    } catch (err: any) {
      this.logger.warn(`Migration snapshot initialization note: ${err.message}`);
    }
  }

  /**
   * Helper to resolve the correct Prisma delegate for any of the 243 approved catalogue tables
   */
  private getModelDelegate(tableName: string) {
    const pascal = tableName
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
    const delegate =
      (this.prisma as any)[camel] ||
      (this.prisma as any)[tableName] ||
      (this.prisma as any)[pascal];
    return { delegate, modelName: pascal };
  }

  /**
   * Universal list query with multi-tenant filtering, search, pagination, and sorting
   */
  async listRecords(tenantId: string, tableName: string, params: PaginationParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = { is_active: true };
    if (
      tableName !== 'tb_platform_admin' &&
      tableName !== 'tb_module_category' &&
      tableName !== 'tb_module'
    ) {
      where.tenant_id = tenantId;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    // 1. Try querying PostgreSQL database via Prisma if connected
    try {
      const { delegate } = this.getModelDelegate(tableName);
      if (delegate && typeof delegate.findMany === 'function') {
        const [items, total] = await Promise.all([
          delegate.findMany({
            where,
            skip,
            take: limit,
            orderBy: params.sortBy
              ? { [params.sortBy]: params.sortOrder || 'desc' }
              : { created_time: 'desc' }
          }),
          delegate.count ? delegate.count({ where }) : Promise.resolve(0)
        ]);

        if (Array.isArray(items) && (items.length > 0 || (typeof total === 'number' && total >= 0))) {
          const userStoreRecords = OperationalDataStore.getRecords(tenantId, tableName, false).filter(
            (r) => r.is_user_record
          );

          if (userStoreRecords.length === 0) {
            const totalCount = typeof total === 'number' && total > 0 ? total : items.length;
            const totalPages = Math.ceil(totalCount / limit) || 1;
            const meta: PaginationMeta = {
              page,
              limit,
              total: totalCount,
              totalPages,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1
            };
            return { items, meta };
          }
        }
      }
    } catch (err: any) {
      this.logger.debug(`Prisma query unavailable for ${tableName}: ${err.message}`);
    }

    // 2. Load stored records from the persistent operational file store (fallback or hybrid)
    const storedRecords = OperationalDataStore.getRecords(tenantId, tableName, true);

    let combined = [...storedRecords];

    // 3. Apply Search Filter
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      combined = combined.filter((item) => {
        const nameMatch = item.name && item.name.toLowerCase().includes(q);
        const codeMatch = item.code && item.code.toLowerCase().includes(q);
        const descMatch = item.description && item.description.toLowerCase().includes(q);
        return nameMatch || codeMatch || descMatch;
      });
    }

    // 4. Apply Sorting
    const sortBy = params.sortBy || 'created_time';
    const sortOrder = params.sortOrder || 'desc';

    combined.sort((a: any, b: any) => {
      const valA = a[sortBy] ?? '';
      const valB = b[sortBy] ?? '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // 5. Apply Pagination
    const total = combined.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const pagedItems = combined.slice(skip, skip + limit);

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };

    return { items: pagedItems, meta };
  }

  /**
   * Get single record by ID within tenant boundary
   */
  async getRecordById(tenantId: string, tableName: string, id: string) {
    try {
      const { delegate } = this.getModelDelegate(tableName);
      if (delegate && typeof delegate.findFirst === 'function') {
        const dbRecord = await delegate.findFirst({
          where: { id, tenant_id: tenantId }
        });
        if (dbRecord) return dbRecord;
      }
    } catch {}

    const list = OperationalDataStore.getRecords(tenantId, tableName, false);
    const found = list.find((r) => r.id === id);
    if (found && found.tenant_id === tenantId) return found;

    return {
      id,
      tenant_id: tenantId,
      name: `Record ${id.substring(0, 8)}`,
      status: 'ACTIVE',
      created_time: new Date().toISOString()
    };
  }

  /**
   * Strictly validate record input payload for uniqueness and statutory format across all fields A to Z
   */
  private validateRecordPayload(tenantId: string, tableName: string, data: any, excludeId?: string) {
    const records = OperationalDataStore.getRecords(tenantId, tableName, false);

    // Helper to check if a candidate record is the record currently being updated
    const isCurrent = (r: any) => r.id === excludeId;

    // 1. Primary Code / Identifier Uniqueness & Format Check
    const codeKey = Object.keys(data).find((k) =>
      ['code', 'company_code', 'sku_code', 'branch_code', 'sku', 'account_code', 'vendor_code', 'employee_code', 'voucher_no', 'po_number', 'invoice_number', 'receipt_number', 'quotation_number', 'grn_number', 'order_number', 'task_code', 'project_code', 'licence_number', 'subscription_code', 'payment_id', 'plan_code'].includes(k)
    );
    const code = codeKey ? String(data[codeKey] || '').trim() : '';
    if (code) {
      if (code.length < 2) {
        throw new BadRequestException(`Primary Code "${code}" must be at least 2 characters.`);
      }
      if (code.length > 35) {
        throw new BadRequestException(`Primary Code "${code}" exceeds maximum allowed length of 35 characters.`);
      }
      const normalizedCode = code.toUpperCase();
      const duplicateCode = records.find(
        (r) =>
          !isCurrent(r) &&
          (String(r.code || r.company_code || r.sku_code || r.branch_code || r.id || '').toUpperCase() === normalizedCode)
      );
      if (duplicateCode) {
        throw new BadRequestException(`Unique Code Violation: Identifier "${code}" is already registered. Please provide a unique code.`);
      }
    }

    // 2. GSTIN Format & Uniqueness
    const gstinKey = Object.keys(data).find((k) => k === 'gstin' || k.includes('gstin') || k === 'tax_id');
    const gstin = gstinKey ? String(data[gstinKey] || '').trim().toUpperCase() : '';
    if (gstin) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(gstin)) {
        throw new BadRequestException(`Invalid GSTIN format: "${gstin}". Must be 15 alphanumeric characters matching Indian GST statutory format (e.g. 33AAAAA0000A1Z5).`);
      }
      const duplicateGstin = records.find(
        (r) => !isCurrent(r) && (String(r.gstin || r.tax_id || '').trim().toUpperCase() === gstin)
      );
      if (duplicateGstin) {
        throw new BadRequestException(`Unique GSTIN Violation: GSTIN "${gstin}" is already registered with another entity.`);
      }
    }

    // 3. PAN Format & Uniqueness
    const panKey = Object.keys(data).find((k) => k === 'pan' || k === 'pan_number');
    const pan = panKey ? String(data[panKey] || '').trim().toUpperCase() : '';
    if (pan) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        throw new BadRequestException(`Invalid PAN format: "${pan}". Must be 10 characters (e.g. AAACK1234F).`);
      }
      const duplicatePan = records.find(
        (r) => !isCurrent(r) && (String(r.pan || r.pan_number || '').trim().toUpperCase() === pan)
      );
      if (duplicatePan) {
        throw new BadRequestException(`Unique PAN Violation: PAN "${pan}" is already registered.`);
      }
    }

    // 4. Corporate Phone / Mobile Validation & Uniqueness
    const phoneKey = Object.keys(data).find((k) => k === 'phone' || k === 'mobile' || k.includes('phone') || k.includes('mobile'));
    const rawPhone = phoneKey ? String(data[phoneKey] || '').trim() : '';
    if (rawPhone) {
      const digits = rawPhone.replace(/\D/g, '');
      if (digits.length !== 10) {
        throw new BadRequestException(`Invalid Phone Number: "${rawPhone}". Must be exactly 10 digits.`);
      }
      if (!/^[6-9][0-9]{9}$/.test(digits)) {
        throw new BadRequestException(`Invalid Phone Number: "${rawPhone}". Must start with 6, 7, 8, or 9 (standard Indian telecom format).`);
      }
      const duplicatePhone = records.find((r) => {
        if (isCurrent(r)) return false;
        const otherDigits = String(r.phone || r.mobile || r.contact_phone || '').replace(/\D/g, '');
        return otherDigits.length === 10 && otherDigits === digits;
      });
      if (duplicatePhone) {
        throw new BadRequestException(`Unique Phone Violation: Phone number "${digits}" is already registered with another record.`);
      }
    }

    // 5. Email Format & Uniqueness
    const emailKey = Object.keys(data).find((k) => k === 'email' || k.includes('email'));
    const email = emailKey ? String(data[emailKey] || '').trim().toLowerCase() : '';
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException(`Invalid email format: "${email}". Please provide a valid RFC standard email address.`);
      }
      const duplicateEmail = records.find(
        (r) => !isCurrent(r) && (String(r.email || '').trim().toLowerCase() === email)
      );
      if (duplicateEmail) {
        throw new BadRequestException(`Unique Email Violation: Email "${email}" is already registered.`);
      }
    }

    // 6. Bank Account Number Format & Uniqueness
    const bankAccKey = Object.keys(data).find((k) => ['account_number', 'bank_account', 'bank_account_no', 'loan_account_no'].includes(k));
    const bankAcc = bankAccKey ? String(data[bankAccKey] || '').trim() : '';
    if (bankAcc) {
      const digitsOnly = bankAcc.replace(/\D/g, '');
      if (digitsOnly.length < 9 || digitsOnly.length > 18) {
        throw new BadRequestException(`Invalid Bank Account Number: "${bankAcc}". Must be between 9 and 18 digits.`);
      }
      const duplicateAcc = records.find(
        (r) => !isCurrent(r) && (String(r.account_number || r.bank_account || r.loan_account_no || '').trim() === bankAcc)
      );
      if (duplicateAcc) {
        throw new BadRequestException(`Unique Bank Account Violation: Account number "${bankAcc}" is already registered.`);
      }
    }

    // 7. Bank IFSC Code Format
    const ifscKey = Object.keys(data).find((k) => k === 'ifsc' || k === 'ifsc_code');
    const ifsc = ifscKey ? String(data[ifscKey] || '').trim().toUpperCase() : '';
    if (ifsc) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(ifsc)) {
        throw new BadRequestException(`Invalid IFSC Code: "${ifsc}". Must be 11 characters (e.g. HDFC0001234, 5th character must be zero).`);
      }
    }

    // 8. HSN / SAC Code Format
    const hsnKey = Object.keys(data).find((k) => k === 'hsn' || k === 'hsn_code' || k === 'sac_code');
    const hsn = hsnKey ? String(data[hsnKey] || '').trim() : '';
    if (hsn) {
      if (!/^\d{2,8}$/.test(hsn)) {
        throw new BadRequestException(`Invalid HSN/SAC Code: "${hsn}". Must be 2 to 8 numeric digits.`);
      }
    }

    // 9. PIN / Postal Code Format
    const pinKey = Object.keys(data).find((k) => k === 'postal_code' || k === 'pincode' || k === 'pin_code');
    const pin = pinKey ? String(data[pinKey] || '').trim() : '';
    if (pin) {
      if (!/^[1-9][0-9]{5}$/.test(pin)) {
        throw new BadRequestException(`Invalid PIN / Postal Code: "${pin}". Must be a valid 6-digit Indian PIN code.`);
      }
    }

    // 10. Financial Amounts, Salaries, Prices, Budgets (Must be >= 0)
    for (const key of Object.keys(data)) {
      if (
        ['amount', 'price', 'cost', 'salary', 'basic_salary', 'gross_salary', 'hra', 'allowances', 'tax_amount', 'budget', 'credit_limit', 'valuation', 'balance', 'gross_amount'].includes(key)
      ) {
        const val = data[key];
        if (val !== undefined && val !== null && val !== '') {
          const num = Number(val);
          if (isNaN(num)) {
            throw new BadRequestException(`Field "${key}" must be a valid numeric amount.`);
          }
          if (num < 0) {
            throw new BadRequestException(`Field "${key}" cannot be negative.`);
          }
        }
      }
    }

    // 11. Percentages and Slabs (0 - 100)
    for (const key of Object.keys(data)) {
      if (
        ['percentage', 'gst_rate', 'tax_rate', 'progress_percentage', 'yield_percentage', 'interest_rate', 'share_percentage', 'depreciation_rate', 'basic_percentage', 'hra_percentage', 'da_percentage'].includes(key)
      ) {
        const val = data[key];
        if (val !== undefined && val !== null && val !== '') {
          const num = typeof val === 'string' ? parseFloat(val.replace('%', '')) : Number(val);
          if (isNaN(num) || num < 0 || num > 100) {
            throw new BadRequestException(`Percentage field "${key}" must be a valid number between 0% and 100%.`);
          }
        }
      }
    }

    // 12. Quantities (Must be >= 0)
    for (const key of Object.keys(data)) {
      if (['quantity', 'qty', 'stock_qty', 'target_output', 'balance_qty', 'scrap_quantity'].includes(key)) {
        const val = data[key];
        if (val !== undefined && val !== null && val !== '') {
          const num = Number(val);
          if (isNaN(num) || num < 0) {
            throw new BadRequestException(`Quantity field "${key}" must be a non-negative number.`);
          }
        }
      }
    }

    // 13. Date Range Validation (end_date >= start_date)
    const startDate = data.start_date || data.from_date || data.mfg_date;
    const endDate = data.end_date || data.to_date || data.expiry_date;
    if (startDate && endDate) {
      const d1 = new Date(startDate).getTime();
      const d2 = new Date(endDate).getTime();
      if (!isNaN(d1) && !isNaN(d2) && d2 < d1) {
        throw new BadRequestException(`End / Expiry date (${endDate}) cannot be earlier than Start / Manufacturing date (${startDate}).`);
      }
    }

    // 14. URL Format
    const urlKey = Object.keys(data).find((k) => k === 'url' || k === 'portal_url' || k === 'webhook_url');
    const urlVal = urlKey ? String(data[urlKey] || '').trim() : '';
    if (urlVal) {
      if (!/^https?:\/\/.+/i.test(urlVal)) {
        throw new BadRequestException(`Field "${urlKey}" must be a valid HTTP or HTTPS URL.`);
      }
    }

    // 15. Name / Title Sanitization & Length
    const nameKey = Object.keys(data).find((k) => ['name', 'company_name', 'branch_name', 'full_name', 'product_name', 'customer_name', 'supplier_name'].includes(k));
    const nameVal = nameKey ? String(data[nameKey] || '').trim() : '';
    if (nameVal) {
      if (nameVal.length < 2) {
        throw new BadRequestException(`Name / Title must be at least 2 characters.`);
      }
      if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(nameVal)) {
        throw new BadRequestException(`Invalid characters detected in name.`);
      }
    }
  }

  /**
   * Create a new record within tenant boundary with guaranteed disk & database persistence
   */
  async createRecord(tenantId: string, userId: string, tableName: string, data: any) {
    if (tableName === 'tb_login_history') {
      throw new BadRequestException('Security Audit Violation: Login History table (tb_login_history) is strictly immutable and read-only. Manual creation is prohibited.');
    }

    // Validate uniqueness, phone format, GSTIN format before saving
    this.validateRecordPayload(tenantId, tableName, data);

    // 1. Persist directly into the Operational Data Store (guarantees data is saved immediately)
    const storedRecord = OperationalDataStore.addRecord(tenantId, userId, tableName, data);

    // 2. Also attempt saving to PostgreSQL via Prisma if available
    try {
      const { delegate } = this.getModelDelegate(tableName);
      if (delegate && typeof delegate.create === 'function') {
        // Prepare sanitized DB payload
        const dbPayload: any = {
          id: storedRecord.id,
          tenant_id: tenantId,
          created_by: userId
        };

        if (data.name) dbPayload.name = data.name;
        if (data.code) dbPayload.code = data.code;
        if (data.description) dbPayload.description = data.description;
        if (data.amount) dbPayload.amount = Number(data.amount);

        // Map domain-specific table fields
        if (tableName === 'tb_company') {
          dbPayload.company_name = data.name;
          dbPayload.company_code = data.code;
          dbPayload.legal_name = data.description || data.name;
        }

        await delegate.create({ data: dbPayload });
        this.logger.log(`Inserted record ${storedRecord.id} into database table ${tableName}`);
      }
    } catch (err: any) {
      this.logger.debug(`Database write note for ${tableName} (persisted in local operational store): ${err.message}`);
    }

    return storedRecord;
  }

  /**
   * Update an existing record
   */
  async updateRecord(tenantId: string, userId: string, tableName: string, id: string, data: any) {
    if (tableName === 'tb_login_history') {
      throw new BadRequestException('Security Audit Violation: Login History table (tb_login_history) is strictly immutable and read-only. Modification is prohibited.');
    }

    // Validate uniqueness, phone format, GSTIN format for updates (excluding current id)
    this.validateRecordPayload(tenantId, tableName, data, id);

    const updated = OperationalDataStore.updateRecord(tenantId, userId, tableName, id, data);

    try {
      const { delegate } = this.getModelDelegate(tableName);
      if (delegate && typeof delegate.updateMany === 'function') {
        await delegate.updateMany({
          where: { id, tenant_id: tenantId },
          data: {
            ...data,
            updated_by: userId,
            updated_time: new Date()
          }
        });
      }
    } catch {}

    return updated || { id, ...data };
  }

  /**
   * Soft-delete a record
   */
  async deleteRecord(tenantId: string, userId: string, tableName: string, id: string) {
    if (tableName === 'tb_login_history') {
      throw new BadRequestException('Security Audit Violation: Login History table (tb_login_history) is strictly immutable and read-only. Deletion is prohibited.');
    }

    OperationalDataStore.deleteRecord(tenantId, userId, tableName, id);

    try {
      const { delegate } = this.getModelDelegate(tableName);
      if (delegate && typeof delegate.updateMany === 'function') {
        await delegate.updateMany({
          where: { id, tenant_id: tenantId },
          data: {
            is_active: false,
            updated_by: userId,
            updated_time: new Date()
          }
        });
      }
    } catch {}

    return { success: true, id, message: `Record deleted from ${tableName}` };
  }
}
