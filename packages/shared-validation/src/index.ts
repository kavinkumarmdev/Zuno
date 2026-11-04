import { z } from 'zod';

// Login Validation Schema
export const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, 'Username or Email is required').max(150),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional()
});

export type LoginInput = z.infer<typeof loginSchema>;

// Tenant Registration Schema
export const tenantRegistrationSchema = z.object({
  tenantName: z.string().min(2, 'Tenant or Organization name is required').max(200),
  ownerName: z.string().min(2, 'Owner name is required').max(150),
  email: z.string().email('Valid email address is required').max(150),
  mobile: z.string().min(10, 'Valid 10-digit mobile number required').max(20),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  companyName: z.string().min(2, 'Primary company name is required').max(200),
  currencyCode: z.string().length(3).default('INR'),
  countryCode: z.string().length(2).default('IN')
});

export type TenantRegistrationInput = z.infer<typeof tenantRegistrationSchema>;

// Company Creation Schema
export const companySchema = z.object({
  companyCode: z.string().min(2).max(30).regex(/^[A-Z0-9_-]+$/, 'Alphanumeric code only'),
  companyName: z.string().min(2).max(200),
  legalName: z.string().max(200).optional(),
  businessType: z.string().max(50).default('Retail'),
  ownershipType: z.string().max(50).default('Private Limited'),
  industryType: z.string().max(100).optional(),
  panNumber: z.string().max(20).optional(),
  tanNumber: z.string().max(20).optional(),
  gstin: z.string().max(20).optional(),
  cinNumber: z.string().max(30).optional(),
  udyamNumber: z.string().max(30).optional(),
  currencyCode: z.string().length(3).default('INR'),
  countryCode: z.string().length(2).default('IN'),
  financialYearStart: z.string().optional()
});

export type CompanyInput = z.infer<typeof companySchema>;

// Branch Creation Schema
export const branchSchema = z.object({
  companyId: z.string().uuid('Valid company ID required'),
  name: z.string().min(2, 'Branch name is required').max(200),
  description: z.string().max(500).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE')
});

export type BranchInput = z.infer<typeof branchSchema>;

// User Creation Schema
export const createUserSchema = z.object({
  username: z.string().min(3).max(100),
  fullName: z.string().min(2).max(150),
  email: z.string().email().max(150),
  mobile: z.string().max(20).optional(),
  userType: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE']).default('EMPLOYEE'),
  password: z.string().min(8),
  roleIds: z.array(z.string().uuid()).optional(),
  companyIds: z.array(z.string().uuid()).optional(),
  branchIds: z.array(z.string().uuid()).optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Pagination Query Schema
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.string().optional()
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;

