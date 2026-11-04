import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PermissionGuard } from '../src/common/guards/permission.guard';
import { PERMISSIONS_KEY } from '../src/common/decorators/require-permission.decorator';
import { UserType } from '@zuno/shared-types';

describe('Role & Granular Permission Authorization Test Suite', () => {
  let guard: PermissionGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionGuard, Reflector],
    }).compile();

    guard = module.get<PermissionGuard>(PermissionGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const createMockContext = (user: any, requiredPermissions: string[] | null) => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredPermissions);

    return {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  it('RULE 3: An unauthorized user cannot approve a transaction without explicit "transactions.approve" permission', () => {
    const unauthorizedUser = {
      sub: 'user-emp-101',
      tenantId: 'tenant-uuid-1',
      userType: UserType.EMPLOYEE,
      permissions: ['transactions.view', 'transactions.create'], // Missing 'transactions.approve'
    };

    const context = createMockContext(unauthorizedUser, ['transactions.approve']);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrow(
      'Access denied. Missing required permission(s): transactions.approve'
    );
  });

  it('Permits authorized user with explicit "transactions.approve" permission to proceed', () => {
    const managerUser = {
      sub: 'user-mgr-201',
      tenantId: 'tenant-uuid-1',
      userType: UserType.MANAGER,
      permissions: ['transactions.view', 'transactions.approve'],
    };

    const context = createMockContext(managerUser, ['transactions.approve']);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('Permits tenant owner full bypass across all business permissions', () => {
    const ownerUser = {
      sub: 'user-owner-001',
      tenantId: 'tenant-uuid-1',
      userType: UserType.OWNER,
      permissions: [], // Empty explicit list, but OWNER has unrestricted access
    };

    const context = createMockContext(ownerUser, ['payroll.approve', 'finance.manage']);
    expect(guard.canActivate(context)).toBe(true);
  });
});

