/**
 * Zuno ERP Enterprise Access Control & Role Permission Engine
 * Manages Role Master, Permission Table bindings (User, Role, Menu/Module, Multi-Action Rights),
 * and dynamic menu/page authorization enforcement.
 */

export interface ModulePermission {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

/**
 * Check if the given user is the master platform owner (Kavin)
 */
export function isMasterPlatformUser(user: any): boolean {
  if (!user) return false;
  const email = (user.email || '').trim().toLowerCase();
  const username = (user.username || '').trim().toLowerCase();
  const userType = (user.userType || user.user_type || '').toUpperCase();

  return (
    userType === 'OWNER' ||
    email === 'kavinkumarm987@zuno.in' ||
    email === 'admin987@zuno.in' ||
    email === 'kavin@zuno.com' ||
    email === 'kavimkumarm6383@gmail.com' ||
    username === 'kavin'
  );
}

/**
 * Evaluates whether a user is permitted to see and navigate to a given menu / module
 */
export function canUserAccessModule(user: any, moduleId: string): boolean {
  if (!user) return false;

  // 1. Platform Master User (Kavin / OWNER) has unrestricted visibility to all modules
  if (isMasterPlatformUser(user)) {
    return true;
  }

  // 2. Tenant Administrator (ADMIN) has full access to operational modules
  const userRole = (user.userType || user.user_type || user.role || 'USER').toUpperCase();
  if (userRole === 'ADMIN' || userRole.includes('ADMIN')) {
    return true;
  }

  const userEmail = (user.email || '').trim().toLowerCase();

  // 3. Inspect custom permissions in tb_permission store
  try {
    const rawPerms = localStorage.getItem('zuno_records_tb_permission');
    if (rawPerms) {
      const perms = JSON.parse(rawPerms);
      if (Array.isArray(perms) && perms.length > 0) {
        // Direct user permission override
        const userMatch = perms.find(
          (p: any) =>
            p.status !== 'INACTIVE' &&
            (p.user_email?.toLowerCase() === userEmail || p.user?.toLowerCase() === userEmail) &&
            (p.module_name === moduleId || p.module_name === 'all' || p.module_name === 'ALL')
        );
        if (userMatch) {
          const val = userMatch.can_view ?? userMatch.view;
          if (val === 'NO' || val === false) return false;
          if (val === 'YES' || val === true || userMatch.actions?.includes('VIEW') || userMatch.actions?.includes('READ')) return true;
        }

        // Role-based permission
        const roleMatch = perms.find(
          (p: any) =>
            p.status !== 'INACTIVE' &&
            (p.role?.toUpperCase() === userRole || p.role === 'ALL') &&
            (p.module_name === moduleId || p.module_name === 'all' || p.module_name === 'ALL')
        );
        if (roleMatch) {
          const val = roleMatch.can_view ?? roleMatch.view;
          if (val === 'NO' || val === false) return false;
          if (val === 'YES' || val === true || roleMatch.actions?.includes('VIEW') || roleMatch.actions?.includes('READ')) return true;
        }
      }
    }
  } catch {}

  // 4. Default Enterprise Role Scopes
  if (userRole === 'MANAGER' || userRole.includes('MANAGER')) {
    return [
      'products',
      'inventory',
      'purchase',
      'sales',
      'hr',
      'attendance',
      'banking',
      'statutory',
      'production',
      'reports'
    ].includes(moduleId);
  }

  if (userRole === 'AUDITOR' || userRole.includes('AUDITOR')) {
    return [
      'company',
      'banking',
      'payroll',
      'statutory',
      'compliance',
      'investment',
      'reports',
      'history'
    ].includes(moduleId);
  }

  if (userRole === 'OPERATOR' || userRole.includes('OPERATOR') || userRole.includes('STAFF')) {
    return ['sales', 'purchase', 'inventory', 'attendance', 'portal'].includes(moduleId);
  }

  // Regular Employee / User role
  return ['portal', 'attendance'].includes(moduleId);
}

/**
 * Gets fine-grained multi-action permissions (View, Create, Update, Delete, Approve)
 * for a user on a specific module or database table.
 */
export function getModuleActionPermissions(
  user: any,
  moduleId: string,
  tableName?: string
): ModulePermission {
  // CRITICAL AUDIT RULE: Login History is strictly READ-ONLY for everyone
  if (tableName === 'tb_login_history') {
    return {
      canView: true,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
      canApprove: false,
    };
  }

  if (!user) {
    return {
      canView: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
      canApprove: false,
    };
  }

  // 1. Platform Master User (Kavin / OWNER) has complete authority
  if (isMasterPlatformUser(user)) {
    return {
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      canApprove: true,
    };
  }

  // 2. Tenant Administrator has full creation, update, delete, approval in tenant workspace
  const userRole = (user.userType || user.user_type || user.role || 'USER').toUpperCase();
  if (userRole === 'ADMIN' || userRole.includes('ADMIN')) {
    return {
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      canApprove: true,
    };
  }

  // 3. Check tb_permission record
  try {
    const rawPerms = localStorage.getItem('zuno_records_tb_permission');
    if (rawPerms) {
      const perms = JSON.parse(rawPerms);
      const userEmail = (user.email || '').trim().toLowerCase();

      const matchedPerm = perms.find(
        (p: any) =>
          p.status !== 'INACTIVE' &&
          (p.user_email?.toLowerCase() === userEmail ||
            p.role?.toUpperCase() === userRole ||
            p.role === 'ALL') &&
          (p.module_name === moduleId || p.module_name === 'all' || p.module_name === 'ALL')
      );

      if (matchedPerm) {
        const actionsStr = String(matchedPerm.actions || '').toUpperCase();
        const canView =
          matchedPerm.can_view === true ||
          matchedPerm.can_view === 'YES' ||
          actionsStr.includes('VIEW') ||
          actionsStr.includes('READ');
        const canCreate =
          matchedPerm.can_create === true ||
          matchedPerm.can_create === 'YES' ||
          actionsStr.includes('CREATE');
        const canUpdate =
          matchedPerm.can_update === true ||
          matchedPerm.can_update === 'YES' ||
          actionsStr.includes('UPDATE') ||
          actionsStr.includes('EDIT');
        const canDelete =
          matchedPerm.can_delete === true ||
          matchedPerm.can_delete === 'YES' ||
          actionsStr.includes('DELETE');
        const canApprove =
          matchedPerm.can_approve === true ||
          matchedPerm.can_approve === 'YES' ||
          actionsStr.includes('APPROVE');

        return { canView, canCreate, canUpdate, canDelete, canApprove };
      }
    }
  } catch {}

  // 4. Fallbacks by Role
  if (userRole === 'AUDITOR' || userRole.includes('AUDITOR')) {
    return {
      canView: true,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
      canApprove: false,
    };
  }

  if (userRole === 'MANAGER' || userRole.includes('MANAGER')) {
    return {
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: false, // Managers cannot hard/soft delete audit critical records
      canApprove: true,
    };
  }

  // Standard user default
  return {
    canView: ['portal', 'attendance'].includes(moduleId),
    canCreate: ['portal', 'attendance'].includes(moduleId),
    canUpdate: false,
    canDelete: false,
    canApprove: false,
  };
}

/**
 * Standard Role Master Initial Dataset (tb_role)
 */
export const DEFAULT_ROLE_MASTER = [
  {
    id: 'role-001',
    code: 'ROLE-SUPER-ADMIN',
    name: 'Platform Super Administrator',
    department: 'IT & Administration',
    permission_level: 'SUPER_ADMIN',
    status: 'ACTIVE',
    description: 'Unrestricted enterprise owner rights across all 19 modules, multi-tenant databases, and statutory configurations.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'role-002',
    code: 'ROLE-TENANT-ADMIN',
    name: 'Tenant Administrator',
    department: 'Operations & Management',
    permission_level: 'SUPER_ADMIN',
    status: 'ACTIVE',
    description: 'Complete workspace administration, tenant company management, user provisioning, and role assignment.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'role-003',
    code: 'ROLE-FIN-HEAD',
    name: 'Finance & Accounts Head',
    department: 'Finance & Accounts',
    permission_level: 'DEPARTMENT_HEAD',
    status: 'ACTIVE',
    description: 'Full signing rights on bank vouchers, GSTR-1/3B submissions, payroll disbursements, and budget approvals.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'role-004',
    code: 'ROLE-OPS-MGR',
    name: 'Operations & Plant Manager',
    department: 'Operations & Plants',
    permission_level: 'MANAGER',
    status: 'ACTIVE',
    description: 'Authorizations for work orders, recipe BOMs, warehouse inventory batches, and machinery maintenance.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'role-005',
    code: 'ROLE-HR-MGR',
    name: 'Human Resources Manager',
    department: 'Human Resources',
    permission_level: 'MANAGER',
    status: 'ACTIVE',
    description: 'Employee onboarding, attendance regularisation, leave approvals, and monthly salary structure review.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'role-006',
    code: 'ROLE-SALES-EXEC',
    name: 'Sales & Commercial Executive',
    department: 'Sales & Marketing',
    permission_level: 'OPERATOR',
    status: 'ACTIVE',
    description: 'Quotation preparation, customer account management, sales order booking, and delivery challan tracking.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'role-007',
    code: 'ROLE-AUDITOR-RO',
    name: 'Statutory & Financial Auditor',
    department: 'Audit & Compliance',
    permission_level: 'AUDITOR_READONLY',
    status: 'ACTIVE',
    description: 'Read-only inspection rights across audit archives, login history, financial ledgers, and statutory compliance.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
];

/**
 * Standard Permission Table Initial Dataset (tb_permission)
 * Connects (user, menu or model, role, (create, update, approvel, in multiple action))
 */
export const DEFAULT_PERMISSION_CATALOG = [
  {
    id: 'perm-001',
    code: 'PERM-ADMIN-ALL',
    name: 'Tenant Administration Authority',
    role: 'ADMIN',
    user_email: 'ALL',
    module_name: 'all',
    actions: 'VIEW,CREATE,UPDATE,DELETE,APPROVE',
    can_view: 'YES',
    can_create: 'YES',
    can_update: 'YES',
    can_delete: 'YES',
    can_approve: 'YES',
    status: 'ACTIVE',
    description: 'Full workspace authority for Tenant Administrators across all ERP functional modules.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'perm-002',
    code: 'PERM-FIN-BANKING',
    name: 'Finance Banking & Accounting Rights',
    role: 'ROLE-FIN-HEAD',
    user_email: 'ALL',
    module_name: 'banking',
    actions: 'VIEW,CREATE,UPDATE,APPROVE',
    can_view: 'YES',
    can_create: 'YES',
    can_update: 'YES',
    can_delete: 'NO',
    can_approve: 'YES',
    status: 'ACTIVE',
    description: 'Permits creating ledger vouchers, posting journal entries, and approving bank reconciliations.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'perm-003',
    code: 'PERM-FIN-STATUTORY',
    name: 'Government Filings & Tax Compliance',
    role: 'ROLE-FIN-HEAD',
    user_email: 'ALL',
    module_name: 'statutory',
    actions: 'VIEW,CREATE,UPDATE,APPROVE',
    can_view: 'YES',
    can_create: 'YES',
    can_update: 'YES',
    can_delete: 'NO',
    can_approve: 'YES',
    status: 'ACTIVE',
    description: 'Permits managing GSTR-1, GSTR-3B filings, TDS return summaries, and statutory submissions.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'perm-004',
    code: 'PERM-OPS-MFG',
    name: 'Production & Manufacturing Control',
    role: 'ROLE-OPS-MGR',
    user_email: 'ALL',
    module_name: 'production',
    actions: 'VIEW,CREATE,UPDATE,APPROVE',
    can_view: 'YES',
    can_create: 'YES',
    can_update: 'YES',
    can_delete: 'NO',
    can_approve: 'YES',
    status: 'ACTIVE',
    description: 'Permits creating work orders, drafting BOM recipes, and approving production completion.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'perm-005',
    code: 'PERM-OPS-INV',
    name: 'Warehouse Stock & Inventory Operations',
    role: 'ROLE-OPS-MGR',
    user_email: 'ALL',
    module_name: 'inventory',
    actions: 'VIEW,CREATE,UPDATE',
    can_view: 'YES',
    can_create: 'YES',
    can_update: 'YES',
    can_delete: 'NO',
    can_approve: 'NO',
    status: 'ACTIVE',
    description: 'Permits stock transfers, goods receipt notes (GRN), and physical audit updates.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'perm-006',
    code: 'PERM-HR-PEOPLE',
    name: 'Human Capital Directory & Onboarding',
    role: 'ROLE-HR-MGR',
    user_email: 'ALL',
    module_name: 'hr',
    actions: 'VIEW,CREATE,UPDATE,APPROVE',
    can_view: 'YES',
    can_create: 'YES',
    can_update: 'YES',
    can_delete: 'NO',
    can_approve: 'YES',
    status: 'ACTIVE',
    description: 'Permits employee directory additions, designation mapping, and leave policy enforcement.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'perm-007',
    code: 'PERM-SALES-OPS',
    name: 'Sales Quotations & Order Booking',
    role: 'ROLE-SALES-EXEC',
    user_email: 'ALL',
    module_name: 'sales',
    actions: 'VIEW,CREATE,UPDATE',
    can_view: 'YES',
    can_create: 'YES',
    can_update: 'YES',
    can_delete: 'NO',
    can_approve: 'NO',
    status: 'ACTIVE',
    description: 'Permits booking sales orders, generating customer invoices, and managing lead accounts.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
  {
    id: 'perm-008',
    code: 'PERM-AUDITOR-INSPECT',
    name: 'Universal Read-Only Audit & Inspection',
    role: 'ROLE-AUDITOR-RO',
    user_email: 'ALL',
    module_name: 'all',
    actions: 'VIEW_ONLY',
    can_view: 'YES',
    can_create: 'NO',
    can_update: 'NO',
    can_delete: 'NO',
    can_approve: 'NO',
    status: 'ACTIVE',
    description: 'Read-only audit inspection across financial records, statutory submissions, and audit archives.',
    created_time: '2026-01-01T00:00:00.000Z',
    is_user_record: true,
  },
];

/**
 * Standard Initial Login History Audit Logs (tb_login_history)
 * Note: Strictly Read-Only View of User Authentication Events
 */
export const DEFAULT_LOGIN_HISTORY = [
  {
    id: 'log-001',
    code: 'SES-982141',
    name: 'Kavin',
    user_email: 'kavinkumarm987@zuno.in',
    role: 'Platform Super Owner',
    company_name: 'Kavin Industries Private Limited',
    action: 'PLATFORM_SUPER_ADMIN_SIGNIN',
    ip_address: '106.51.72.19 (Chennai HQ)',
    user_agent: 'Chrome 130 on Windows 11 Enterprise (64-bit)',
    status: 'SUCCESS_AUTHENTICATED',
    created_time: new Date(Date.now() - 3600000 * 2).toISOString(),
    login_time: new Date(Date.now() - 3600000 * 2).toISOString(),
    is_user_record: true,
  },
  {
    id: 'log-002',
    code: 'SES-982142',
    name: 'Administrator',
    user_email: 'admin987@zuno.in',
    role: 'Tenant Administrator',
    company_name: 'Apex Technologies Pvt Ltd',
    action: 'TENANT_ADMIN_SIGNIN',
    ip_address: '49.207.214.18 (Bengaluru Data Hub)',
    user_agent: 'Edge 130 on macOS Sequoia (Apple Silicon)',
    status: 'SUCCESS_AUTHENTICATED',
    created_time: new Date(Date.now() - 3600000 * 8).toISOString(),
    login_time: new Date(Date.now() - 3600000 * 8).toISOString(),
    is_user_record: true,
  },
  {
    id: 'log-003',
    code: 'SES-982143',
    name: 'Finance Operations Lead',
    user_email: 'finance@apextech.com',
    role: 'Finance & Accounts Head',
    company_name: 'Apex Technologies Pvt Ltd',
    action: 'SESSION_RESTORE_JWT',
    ip_address: '122.178.44.202 (Mumbai Central)',
    user_agent: 'Firefox 132 on Ubuntu Linux 24.04 LTS',
    status: 'SUCCESS_AUTHENTICATED',
    created_time: new Date(Date.now() - 3600000 * 24).toISOString(),
    login_time: new Date(Date.now() - 3600000 * 24).toISOString(),
    is_user_record: true,
  },
];
