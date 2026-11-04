import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  tenantRegistrationSchema,
  companySchema,
  branchSchema,
  createUserSchema,
  paginationQuerySchema,
} from '@zuno/shared-validation';
import { ZUNO_BRAND, STATUS_BADGE_STYLES, getStatusBadgeClass } from '@zuno/ui';
import { ERP_MODULES } from '../src/components/layout/Sidebar';

describe('Zuno ERP Frontend & Shared Logic Test Suite', () => {
  describe('Zod Validation Schemas', () => {
    it('should validate valid tenant registration payload', () => {
      const validPayload = {
        tenantName: 'Acme Global Corp',
        ownerName: 'Rajesh Sharma',
        email: 'rajesh@acme.com',
        mobile: '9876543210',
        password: 'Password123!',
        companyName: 'Acme HQ Pvt Ltd',
        currencyCode: 'INR',
        countryCode: 'IN',
      };

      const result = tenantRegistrationSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tenantName).toBe('Acme Global Corp');
        expect(result.data.currencyCode).toBe('INR');
      }
    });

    it('should reject invalid password or missing fields in tenant registration', () => {
      const invalidPayload = {
        tenantName: 'A', // too short (< 2)
        ownerName: '',
        email: 'invalid-email',
        mobile: '123', // too short (< 10)
        password: 'weak', // no uppercase, no number, no symbol (< 8)
        companyName: '',
      };

      const result = tenantRegistrationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues.map((i) => i.path[0]);
        expect(issues).toContain('email');
        expect(issues).toContain('password');
        expect(issues).toContain('mobile');
      }
    });

    it('should validate login schema with valid inputs', () => {
      const validLogin = {
        usernameOrEmail: 'admin@acme.com',
        password: 'SecretPassword99!',
      };
      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should validate company creation schema code format', () => {
      const validCompany = {
        companyCode: 'ACME_CORP_01',
        companyName: 'Acme Corporation',
        currencyCode: 'INR',
        countryCode: 'IN',
      };
      expect(companySchema.safeParse(validCompany).success).toBe(true);

      const invalidCompany = {
        companyCode: 'invalid code with spaces and @#$',
        companyName: 'Acme Corporation',
      };
      expect(companySchema.safeParse(invalidCompany).success).toBe(false);
    });

    it('should parse and coerce pagination queries with safe defaults', () => {
      const query = paginationQuerySchema.parse({
        page: '2',
        limit: '50',
        search: 'invoice',
        sortOrder: 'asc',
      });
      expect(query.page).toBe(2);
      expect(query.limit).toBe(50);
      expect(query.search).toBe('invoice');
      expect(query.sortOrder).toBe('asc');
    });
  });

  describe('UI Design System & Brand Tokens', () => {
    it('should have standard Zuno ERP brand colors defined', () => {
      expect(ZUNO_BRAND.name).toBe('ZUNO ERP');
      expect(ZUNO_BRAND.colors.primary).toBe('#2563EB');
      expect(ZUNO_BRAND.colors.secondary).toBe('#0F172A');
      expect(ZUNO_BRAND.colors.accentCyan).toBe('#06B6D4');
      expect(ZUNO_BRAND.colors.accentOrange).toBe('#F97316');
      expect(ZUNO_BRAND.colors.accentMagenta).toBe('#D946EF');
    });

    it('should return correct badge styling classes for status codes', () => {
      const activeBadge = getStatusBadgeClass('ACTIVE');
      expect(activeBadge).toContain('bg-emerald-50');
      expect(activeBadge).toContain('text-emerald-700');

      const pendingBadge = getStatusBadgeClass('PENDING');
      expect(pendingBadge).toContain('bg-amber-50');
      expect(pendingBadge).toContain('text-amber-700');

      const failedBadge = getStatusBadgeClass('SUSPENDED');
      expect(failedBadge).toContain('bg-rose-50');
      expect(failedBadge).toContain('text-rose-700');
    });
  });

  describe('ERP Module Navigation & Phase Integrity', () => {
    it('should define navigation items across all 4 ERP phases', () => {
      expect(ERP_MODULES.length).toBeGreaterThanOrEqual(5);

      const phaseNames = ERP_MODULES.filter((m: any) => m.phase).map((m: any) => m.phase);
      expect(phaseNames).toContain('Phase 1: SaaS Foundation');
      expect(phaseNames).toContain('Phase 2: Master Data');
      expect(phaseNames).toContain('Phase 3: Operations');
      expect(phaseNames).toContain('Phase 4: Finance & Compliance');
    });

    it('should map each module item to a valid route and table', () => {
      const phaseGroups = ERP_MODULES.filter((m: any) => m.items) as Array<{ phase: string; items: any[] }>;
      const allItems = phaseGroups.flatMap((g) => g.items);

      expect(allItems.length).toBeGreaterThanOrEqual(18);
      allItems.forEach((item) => {
        expect(item.id).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.path.startsWith('/')).toBe(true);
        expect(item.icon).toBeDefined();
      });
    });
  });
});
