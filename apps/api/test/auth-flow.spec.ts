import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { NeonPrismaService } from '../src/database/neon-prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('Authentication & Security Hardening Test Suite', () => {
  let service: AuthService;

  const mockNeonPrisma = {
    tbUser: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    tbUserCredential: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    tbLoginHistory: {
      create: jest.fn(),
    },
    tbUserSession: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    tbTenant: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    tbCompany: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    tbCompanyBranch: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    tbTenantOwner: {
      create: jest.fn(),
    },
    tbUserCompanyAccess: {
      create: jest.fn(),
    },
    tbUserBranchAccess: {
      create: jest.fn(),
    },
    tbRole: {
      create: jest.fn(),
    },
    tbUserRole: {
      create: jest.fn(),
    },
    tbSubscription: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_signed_jwt_token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'BCRYPT_SALT_ROUNDS') return '10';
      if (key === 'JWT_SECRET') return 'test_jwt_secret_key_1234567890';
      if (key === 'JWT_REFRESH_SECRET') return 'test_jwt_refresh_secret_key_1234567890';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: NeonPrismaService, useValue: mockNeonPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Locks account after 5 consecutive failed login attempts', async () => {
    const passwordHash = await bcrypt.hash('CorrectPassword123!', 10);

    mockNeonPrisma.tbUser.findFirst.mockResolvedValue({
      id: 'user-uuid-1',
      tenant_id: 'tenant-uuid-1',
      username: 'johndoe',
      user_status: 'ACTIVE',
    });

    mockNeonPrisma.tbUserCredential.findFirst.mockResolvedValue({
      id: 'cred-uuid-1',
      user_id: 'user-uuid-1',
      password_hash: passwordHash,
      failed_attempts: 4, // 5th attempt will fail
    });

    await expect(
      service.login({ usernameOrEmail: 'johndoe', password: 'WrongPassword' })
    ).rejects.toThrow(UnauthorizedException);

    // Verify credential updated to 5 failed attempts and locked_until set
    expect(mockNeonPrisma.tbUserCredential.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'cred-uuid-1' },
        data: expect.objectContaining({
          failed_attempts: 5,
        }),
      })
    );

    // Verify user account status updated to LOCKED
    expect(mockNeonPrisma.tbUser.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-uuid-1' },
        data: { user_status: 'LOCKED' },
      })
    );
  });

  it('Rejects authentication if account status is already LOCKED', async () => {
    mockNeonPrisma.tbUser.findFirst.mockResolvedValue({
      id: 'user-uuid-1',
      tenant_id: 'tenant-uuid-1',
      username: 'lockeduser',
      user_status: 'LOCKED',
    });

    await expect(
      service.login({ usernameOrEmail: 'lockeduser', password: 'AnyPassword' })
    ).rejects.toThrow('Account is LOCKED. Please contact system administrator.');
  });
});

