import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NeonPrismaService } from '../database/neon-prisma.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { AuthSessionResponse, JwtPayload, UserType, UserStatus } from '@zuno/shared-types';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: NeonPrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Register a new Tenant, Primary Owner, Default Company, Branch, Admin Role and Starter Subscription
   */
  async registerTenant(dto: RegisterTenantDto): Promise<AuthSessionResponse> {
    const saltRounds = parseInt(this.configService.get('BCRYPT_SALT_ROUNDS') || '10', 10);
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const tenantCode = 'T-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const companyCode = 'C-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // 1. Create Tenant
    const tenant = await (this.prisma as any).tbTenant.create({
      data: {
        tenant_code: tenantCode,
        tenant_name: dto.tenantName,
        account_status: 'ACTIVE',
        registration_source: 'WEB',
        registered_time: new Date(),
        activated_time: new Date()
      }
    });

    // 2. Create Tenant Owner Contact
    await (this.prisma as any).tbTenantOwner.create({
      data: {
        tenant_id: tenant.id,
        owner_name: dto.ownerName,
        email: dto.email,
        mobile: dto.mobile,
        designation: 'Managing Director / Owner',
        is_primary: true,
        is_verified: true
      }
    });

    // 3. Create Primary Company
    const company = await (this.prisma as any).tbCompany.create({
      data: {
        tenant_id: tenant.id,
        company_code: companyCode,
        company_name: dto.companyName,
        legal_name: dto.companyName,
        business_type: 'Manufacturing & Distribution',
        currency_code: dto.currencyCode || 'INR',
        country_code: dto.countryCode || 'IN',
        company_status: 'ACTIVE'
      }
    });

    // 4. Create Main Branch
    const branch = await (this.prisma as any).tbCompanyBranch.create({
      data: {
        tenant_id: tenant.id,
        name: 'Main Branch / Headquarters',
        status: 'ACTIVE'
      }
    });

    // 5. Create User Identity
    const user = await (this.prisma as any).tbUser.create({
      data: {
        tenant_id: tenant.id,
        username: dto.email.split('@')[0],
        full_name: dto.ownerName,
        email: dto.email,
        mobile: dto.mobile,
        user_type: UserType.OWNER,
        user_status: UserStatus.ACTIVE,
        email_verified: true,
        mobile_verified: true
      }
    });

    // 6. Create User Credential
    await (this.prisma as any).tbUserCredential.create({
      data: {
        user_id: user.id,
        password_hash: passwordHash,
        password_changed_time: new Date(),
        failed_attempts: 0
      }
    });

    // 7. Grant Company and Branch Access
    await (this.prisma as any).tbUserCompanyAccess.create({
      data: {
        tenant_id: tenant.id,
        name: `${user.username} -> ${company.company_name}`,
        status: 'ACTIVE'
      }
    });

    await (this.prisma as any).tbUserBranchAccess.create({
      data: {
        tenant_id: tenant.id,
        name: `${user.username} -> ${branch.name}`,
        status: 'ACTIVE'
      }
    });

    // 8. Create Default Admin Role
    const adminRole = await (this.prisma as any).tbRole.create({
      data: {
        tenant_id: tenant.id,
        name: 'Administrator',
        description: 'Complete unrestricted administrative access across all modules',
        status: 'ACTIVE'
      }
    });

    await (this.prisma as any).tbUserRole.create({
      data: {
        tenant_id: tenant.id,
        name: `${user.username} as Administrator`,
        status: 'ACTIVE'
      }
    });

    // 9. Assign 30-Day Free Trial Subscription
    const subscriptionNumber = 'SUB-' + Date.now();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await (this.prisma as any).tbSubscription.create({
      data: {
        tenant_id: tenant.id,
        company_id: company.id,
        subscription_number: subscriptionNumber,
        billing_cycle: 'MONTHLY',
        currency_code: dto.currencyCode || 'INR',
        start_date: new Date(),
        end_date: trialEndDate,
        trial_end_date: trialEndDate,
        subscription_status: 'TRIAL',
        auto_renew: true
      }
    });

    // Return authenticated session
    return this.buildAuthSession(user, tenant, company, branch);
  }

  /**
   * Authenticate user with credentials and issue tokens
   */
  async login(dto: LoginDto, ipAddress = '127.0.0.1', userAgent = 'Unknown'): Promise<AuthSessionResponse> {
    const rawInput = (dto.usernameOrEmail || '').trim();
    const normalizedInput = rawInput.toLowerCase();

    // Check for default master user "Kavin" / "Kavin@987"
    const isMasterUser =
      (normalizedInput === 'kavin' ||
        normalizedInput === 'kavin@zuno.com' ||
        normalizedInput === 'admin') &&
      dto.password === 'Kavin@987';

    // 1. Find user by email or username
    let user: any = null;
    try {
      user = await (this.prisma as any).tbUser.findFirst({
        where: {
          OR: [
            { email: { equals: rawInput, mode: 'insensitive' } },
            { username: { equals: rawInput, mode: 'insensitive' } },
            { email: rawInput },
            { username: rawInput }
          ]
        }
      });
    } catch (err) {
      this.logger.warn(`Database user lookup fallback: ${err}`);
    }

    if (!user) {
      if (isMasterUser) {
        const dummyUser = {
          id: '60000000-0000-0000-0000-000000000001',
          tenant_id: '30000000-0000-0000-0000-000000000001',
          username: 'Kavin',
          full_name: 'Kavin',
          email: 'kavin@zuno.com',
          user_type: UserType.OWNER,
          user_status: UserStatus.ACTIVE,
        };
        const dummyTenant = {
          id: '30000000-0000-0000-0000-000000000001',
          tenant_code: 'KAVIN-CORP',
          tenant_name: 'Kavin Global Enterprises Ltd',
          account_status: 'ACTIVE',
        };
        const dummyCompany = {
          id: '40000000-0000-0000-0000-000000000001',
          company_code: 'KAVIN-HQ',
          company_name: 'Kavin Industries Private Limited',
          currency_code: 'INR',
        };
        const dummyBranch = {
          id: '50000000-0000-0000-0000-000000000001',
          name: 'Chennai Central Plant & HQ',
          branch_name: 'Chennai Central Plant & HQ',
        };
        return this.buildAuthSession(dummyUser, dummyTenant, dummyCompany, dummyBranch);
      }
      throw new UnauthorizedException('Invalid credentials provided');
    }

    if (user.user_status === 'LOCKED' || user.user_status === 'DISABLED') {
      throw new UnauthorizedException(`Account is ${user.user_status}. Please contact system administrator.`);
    }

    // If master user matches master password, allow immediate login with master credentials!
    if (isMasterUser) {
      let tenant = null;
      let company = null;
      let branch = null;
      try {
        tenant = await (this.prisma as any).tbTenant.findUnique({ where: { id: user.tenant_id } });
        company = await (this.prisma as any).tbCompany.findFirst({ where: { tenant_id: user.tenant_id } });
        branch = await (this.prisma as any).tbCompanyBranch.findFirst({ where: { tenant_id: user.tenant_id } });
      } catch {}
      return this.buildAuthSession(
        user,
        tenant || { id: user.tenant_id, tenant_code: 'KAVIN-CORP', tenant_name: 'Kavin Global Enterprises Ltd', account_status: 'ACTIVE' },
        company || { id: '40000000-0000-0000-0000-000000000001', company_code: 'KAVIN-HQ', company_name: 'Kavin Industries Private Limited', currency_code: 'INR' },
        branch || { id: '50000000-0000-0000-0000-000000000001', name: 'Chennai Central Plant & HQ', branch_name: 'Chennai Central Plant & HQ' }
      );
    }

    // 2. Fetch credential
    const credential = await (this.prisma as any).tbUserCredential.findFirst({
      where: { user_id: user.id }
    });

    if (!credential) {
      throw new UnauthorizedException('Account credential record missing');
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, credential.password_hash);
    if (!isPasswordValid) {
      // Record failed attempt
      const failed = (credential.failed_attempts || 0) + 1;
      const shouldLock = failed >= 5;
      try {
        await (this.prisma as any).tbUserCredential.update({
          where: { id: credential.id },
          data: {
            failed_attempts: failed,
            locked_until: shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null
          }
        });
        if (shouldLock) {
          await (this.prisma as any).tbUser.update({
            where: { id: user.id },
            data: { user_status: 'LOCKED' }
          });
        }
      } catch {}
      throw new UnauthorizedException('Invalid credentials provided');
    }

    // Reset failed attempts & update last login
    try {
      await (this.prisma as any).tbUserCredential.update({
        where: { id: credential.id },
        data: { failed_attempts: 0 }
      });
      await (this.prisma as any).tbUser.update({
        where: { id: user.id },
        data: { last_login_time: new Date() }
      });
    } catch {}

    // 4. Log in tb_login_history
    try {
      await (this.prisma as any).tbLoginHistory.create({
        data: {
          tenant_id: user.tenant_id,
          parent_id: user.id,
          action_type: 'LOGIN_SUCCESS',
          action_by: user.id,
          action_time: new Date(),
          details: { ipAddress, userAgent }
        }
      });
    } catch {}

    // 5. Fetch Tenant
    let tenant = null;
    try {
      tenant = await (this.prisma as any).tbTenant.findUnique({
        where: { id: user.tenant_id }
      });
    } catch {}

    // 6. Fetch Active Company & Branch
    let company = null;
    let branch = null;
    try {
      company = await (this.prisma as any).tbCompany.findFirst({
        where: { tenant_id: user.tenant_id }
      });
      branch = await (this.prisma as any).tbCompanyBranch.findFirst({
        where: { tenant_id: user.tenant_id }
      });
    } catch {}

    return this.buildAuthSession(user, tenant, company, branch);
  }

  /**
   * Rotate refresh token and issue new access token
   */
  async refreshToken(dto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    try {
      const refreshSecret = this.configService.get('JWT_REFRESH_SECRET') || 'dev_zuno_refresh_secret_key_32_chars_long!';
      const decoded = this.jwtService.verify(dto.refreshToken, { secret: refreshSecret });

      // Verify session exists in DB
      const session = await (this.prisma as any).tbUserSession.findFirst({
        where: {
          tenant_id: decoded.tenantId,
          status: 'ACTIVE'
        }
      });

      if (!session) {
        throw new UnauthorizedException('Session expired or revoked');
      }

      // Generate new token pair
      const newPayload: JwtPayload = {
        sub: decoded.sub,
        tenantId: decoded.tenantId,
        companyId: decoded.companyId,
        branchId: decoded.branchId,
        email: decoded.email,
        username: decoded.username,
        userType: decoded.userType,
        roles: decoded.roles || [],
        permissions: decoded.permissions || []
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('JWT_SECRET') || 'dev_zuno_secret_super_key_32_chars_long_for_hs256!',
        expiresIn: '15m'
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: refreshSecret,
        expiresIn: '7d'
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 900 // 15m
      };
    } catch (err: any) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Build complete AuthSession response with tokens and scopes
   */
  private async buildAuthSession(user: any, tenant: any, company: any, branch: any): Promise<AuthSessionResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      tenantId: user.tenant_id,
      companyId: company?.id,
      branchId: branch?.id,
      email: user.email,
      username: user.username,
      userType: user.user_type,
      roles: ['ADMINISTRATOR'],
      permissions: ['*'] // Super/Owner full access
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET') || 'dev_zuno_secret_super_key_32_chars_long_for_hs256!',
      expiresIn: '15m'
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET') || 'dev_zuno_refresh_secret_key_32_chars_long!',
      expiresIn: '7d'
    });

    // Store session safely in DB
    try {
      await (this.prisma as any).tbUserSession.create({
        data: {
          tenant_id: user.tenant_id,
          name: `Web Session ${user.username}`,
          status: 'ACTIVE'
        }
      });
    } catch (e) {
      this.logger.warn(`Failed to persist session to DB: ${e}`);
    }

    const branchName = branch?.branch_name || branch?.name || 'Main Branch / Headquarters';

    return {
      user: {
        id: user.id,
        tenantId: user.tenant_id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        userType: user.user_type,
        userStatus: user.user_status
      },
      tenant: {
        id: tenant?.id || user.tenant_id,
        tenantCode: tenant?.tenant_code || 'T-DEFAULT',
        tenantName: tenant?.tenant_name || 'Enterprise Tenant',
        accountStatus: tenant?.account_status || 'ACTIVE'
      },
      activeCompany: company ? {
        id: company.id,
        companyCode: company.company_code,
        companyName: company.company_name,
        currencyCode: company.currency_code || 'INR'
      } : undefined,
      activeBranch: branch ? {
        id: branch.id,
        branchName: branchName
      } : undefined,
      companies: company ? [{
        id: company.id,
        companyCode: company.company_code,
        companyName: company.company_name,
        currencyCode: company.currency_code || 'INR',
        role: 'Administrator'
      }] : [],
      branches: branch ? [{
        id: branch.id,
        companyId: company?.id,
        branchName: branchName
      }] : [],
      permissions: ['*'],
      accessToken,
      refreshToken,
      expiresIn: 900
    };
  }
}

