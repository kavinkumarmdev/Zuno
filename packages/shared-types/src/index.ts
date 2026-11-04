// ============================================================================
// ZUNO ERP — Shared Common Types & Interfaces
// ============================================================================

export type UUID = string;

// API Standard Envelope
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  errors?: ApiFieldError[];
  timestamp: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// User & Auth Types
export enum UserType {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  DISABLED = 'DISABLED'
}

export interface JwtPayload {
  sub: UUID;              // User ID
  tenantId: UUID;         // Tenant ID
  companyId?: UUID;       // Active company ID
  branchId?: UUID;        // Active branch ID
  email: string;
  username: string;
  userType: UserType;
  roles: string[];
  permissions: string[];
  isPlatformAdmin?: boolean;
}

export interface AuthSessionResponse {
  user: {
    id: UUID;
    tenantId: UUID;
    username: string;
    fullName: string;
    email: string;
    userType: UserType;
    userStatus: UserStatus;
  };
  tenant: {
    id: UUID;
    tenantCode: string;
    tenantName: string;
    accountStatus: string;
  };
  activeCompany?: {
    id: UUID;
    companyCode: string;
    companyName: string;
    currencyCode: string;
  };
  activeBranch?: {
    id: UUID;
    branchName: string;
  };
  companies: Array<{
    id: UUID;
    companyCode: string;
    companyName: string;
    currencyCode: string;
    role: string;
  }>;
  branches: Array<{
    id: UUID;
    companyId: UUID;
    branchName: string;
  }>;
  permissions: string[];
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Subscription & Module Types
export enum SubscriptionStatus {
  PENDING = 'PENDING',
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  ONE_TIME = 'ONE_TIME'
}

export interface ModuleMetadata {
  id: UUID;
  code: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  isSelectable: boolean;
  isActive: boolean;
  displayOrder: number;
  dependencies?: string[];
  submodules?: SubmoduleMetadata[];
}

export interface SubmoduleMetadata {
  id: UUID;
  moduleId: UUID;
  code: string;
  name: string;
  description?: string;
  features?: FeatureMetadata[];
}

export interface FeatureMetadata {
  id: UUID;
  submoduleId: UUID;
  code: string;
  name: string;
  description?: string;
}

// Granular Permission Actions
export enum PermissionAction {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  EXPORT = 'export',
  PRINT = 'print',
  IMPORT = 'import',
  MANAGE = 'manage',
  VIEW_SENSITIVE = 'view_sensitive'
}

// History & Archive Types
export enum ArchiveReason {
  FISCAL_YEAR_END = 'FISCAL_YEAR_END',
  STATUTORY_RETENTION = 'STATUTORY_RETENTION',
  TENANT_REQUEST = 'TENANT_REQUEST',
  AUTOMATED_LIFECYCLE = 'AUTOMATED_LIFECYCLE'
}

export interface ArchiveRecordPayload {
  tenantId: UUID;
  sourceTable: string;
  sourceRecordId: UUID;
  archiveReason: ArchiveReason;
  data: Record<string, any>;
  archivedBy?: UUID;
}

