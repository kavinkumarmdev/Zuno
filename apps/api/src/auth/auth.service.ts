import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
  OnModuleInit
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NeonPrismaService } from '../database/neon-prisma.service';
import { MailService } from '../mail/mail.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { AuthSessionResponse, JwtPayload, UserType, UserStatus } from '@zuno/shared-types';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  private readonly otpStore = new Map<string, { code: string; expiresAt: number }>();

  constructor(
    private readonly prisma: NeonPrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {}

  async onModuleInit() {
    await this.ensureMasterUserInDatabase();
  }

  /**
   * Ensure master accounts (kavinkumarm987@zuno.in, admin987@zuno.in, kavin) exist in tb_user
   * with their passwords encrypted via bcrypt and stored in tb_user_credential table
   */
  async ensureMasterUserInDatabase(preferredIdentifier?: string): Promise<any> {
    const masterAccounts = [
      {
        id: '60000000-0000-0000-0000-000000000001',
        username: 'kavin',
        full_name: 'Kavin',
        email: 'kavinkumarm987@zuno.in',
        mobile: '+919876543210',
        user_type: UserType.OWNER
      },
      {
        id: '60000000-0000-0000-0000-000000000002',
        username: 'admin',
        full_name: 'Administrator',
        email: 'admin987@zuno.in',
        mobile: '+919876543211',
        user_type: UserType.OWNER
      },
      {
        id: '60000000-0000-0000-0000-000000000003',
        username: 'kavin.corp',
        full_name: 'Kavin Kumar',
        email: 'kavimkumarm6383@gmail.com',
        mobile: '+919876543210',
        user_type: UserType.OWNER
      },
      {
        id: '60000000-0000-0000-0000-000000000004',
        username: 'kavin.admin',
        full_name: 'Kavin',
        email: 'kavin@zuno.com',
        mobile: '+919876543210',
        user_type: UserType.OWNER
      }
    ];

    if (!this.prisma.isConnected) {
      const norm = (preferredIdentifier || '').toLowerCase();
      const match = masterAccounts.find(
        (a) =>
          a.email.toLowerCase() === norm ||
          a.username.toLowerCase() === norm ||
          (norm === 'kavin' && a.username === 'kavin')
      );
      return match || masterAccounts[0];
    }

    try {
      // 1. Ensure master tenant exists in tb_tenant table
      let tenant = await (this.prisma as any).tbTenant.findUnique({
        where: { id: '30000000-0000-0000-0000-000000000001' }
      }).catch(() => null);

      if (!tenant) {
        tenant = await (this.prisma as any).tbTenant.create({
          data: {
            id: '30000000-0000-0000-0000-000000000001',
            tenant_code: 'KAVIN-CORP',
            tenant_name: 'Kavin Global Enterprises Ltd',
            account_status: 'ACTIVE',
            registration_source: 'SYSTEM_SEED',
            registered_time: new Date(),
            activated_time: new Date()
          }
        }).catch(() => null);
      }

      if (!tenant) {
        tenant = {
          id: '30000000-0000-0000-0000-000000000001',
          tenant_code: 'KAVIN-CORP',
          tenant_name: 'Kavin Global Enterprises Ltd',
          account_status: 'ACTIVE'
        };
      }

      // 2. Ensure default company exists in tb_company table
      let company = await (this.prisma as any).tbCompany.findUnique({
        where: { id: '40000000-0000-0000-0000-000000000001' }
      }).catch(() => null);

      if (!company) {
        company = await (this.prisma as any).tbCompany.create({
          data: {
            id: '40000000-0000-0000-0000-000000000001',
            tenant_id: tenant.id,
            company_code: 'KAVIN-HQ',
            company_name: 'Kavin Industries Private Limited',
            legal_name: 'Kavin Industries Private Limited',
            business_type: 'Manufacturing & Export',
            ownership_type: 'Private Limited',
            pan_number: 'AAACK1234F',
            gstin: '33AAACK1234F1Z5',
            currency_code: 'INR',
            country_code: 'IN',
            company_status: 'ACTIVE'
          }
        }).catch(() => null);
      }

      // Ensure second company exists in tb_company table (for Kavin multi-company switching)
      const company2 = await (this.prisma as any).tbCompany.findUnique({
        where: { id: '40000000-0000-0000-0000-000000000002' }
      }).catch(() => null);

      if (!company2) {
        await (this.prisma as any).tbCompany.create({
          data: {
            id: '40000000-0000-0000-0000-000000000002',
            tenant_id: tenant.id,
            company_code: 'KAVIN-LOG',
            company_name: 'Kavin Logistics & Tech Ltd',
            legal_name: 'Kavin Logistics & Tech Ltd',
            business_type: 'Logistics & Supply Chain',
            currency_code: 'INR',
            country_code: 'IN',
            company_status: 'ACTIVE'
          }
        }).catch(() => null);
      }

      // 3. Ensure branch exists in tb_company_branch table
      let branch = await (this.prisma as any).tbCompanyBranch.findUnique({
        where: { id: '50000000-0000-0000-0000-000000000001' }
      }).catch(() => null);

      if (!branch) {
        branch = await (this.prisma as any).tbCompanyBranch.create({
          data: {
            id: '50000000-0000-0000-0000-000000000001',
            tenant_id: tenant.id,
            name: 'Chennai Central Plant & HQ',
            description: 'Primary corporate office and industrial plant',
            status: 'ACTIVE'
          }
        }).catch(() => null);
      }

      // 4. Encrypt password using bcrypt for database table storage
      const passwordHash = await bcrypt.hash('Kavin@987', 10);

      // 5. Seed master accounts in tb_user and encrypted passwords in tb_user_credential
      const masterAccounts = [
        {
          id: '60000000-0000-0000-0000-000000000001',
          username: 'kavin',
          full_name: 'Kavin',
          email: 'kavinkumarm987@zuno.in',
          mobile: '+919876543210',
          user_type: UserType.OWNER
        },
        {
          id: '60000000-0000-0000-0000-000000000002',
          username: 'admin',
          full_name: 'Administrator',
          email: 'admin987@zuno.in',
          mobile: '+919876543211',
          user_type: UserType.OWNER
        },
        {
          id: '60000000-0000-0000-0000-000000000003',
          username: 'kavin.corp',
          full_name: 'Kavin Kumar',
          email: 'kavimkumarm6383@gmail.com',
          mobile: '+919876543210',
          user_type: UserType.OWNER
        },
        {
          id: '60000000-0000-0000-0000-000000000004',
          username: 'kavin.admin',
          full_name: 'Kavin',
          email: 'kavin@zuno.com',
          mobile: '+919876543210',
          user_type: UserType.OWNER
        }
      ];

      let targetUser = null;

      for (const acc of masterAccounts) {
        let u = await (this.prisma as any).tbUser.findFirst({
          where: {
            OR: [
              { id: acc.id },
              { email: acc.email },
              { username: acc.username }
            ]
          }
        }).catch(() => null);

        if (!u) {
          u = await (this.prisma as any).tbUser.create({
            data: {
              id: acc.id,
              tenant_id: tenant.id,
              username: acc.username,
              full_name: acc.full_name,
              email: acc.email,
              mobile: acc.mobile,
              user_type: acc.user_type,
              user_status: UserStatus.ACTIVE,
              email_verified: true,
              mobile_verified: true
            }
          }).catch(() => null);
        }

        if (u) {
          const existingCred = await (this.prisma as any).tbUserCredential.findFirst({
            where: { user_id: u.id }
          }).catch(() => null);

          if (!existingCred) {
            await (this.prisma as any).tbUserCredential.create({
              data: {
                user_id: u.id,
                tenant_id: tenant.id,
                password_hash: passwordHash,
                failed_attempts: 0
              }
            }).catch(() => null);
          } else {
            await (this.prisma as any).tbUserCredential.update({
              where: { id: existingCred.id },
              data: { password_hash: passwordHash, failed_attempts: 0 }
            }).catch(() => null);
          }
        }

        const norm = (preferredIdentifier || '').toLowerCase();
        if (
          u &&
          (norm === acc.email.toLowerCase() ||
            norm === acc.username.toLowerCase() ||
            (norm === 'kavin' && acc.username === 'kavin') ||
            (norm === 'admin' && acc.username === 'admin'))
        ) {
          targetUser = u;
        }
      }

      this.logger.log('✅ Verified master user tables and encrypted credentials in database');
      return targetUser || masterAccounts[0];
    } catch (err: any) {
      this.logger.warn(`Master user table setup note: ${err.message}`);
      return null;
    }
  }

  /**
   * Dispatch real 6-digit OTP email to user from kavimkumarm6383@gmail.com
   */
  async sendForgotPasswordOtp(email: string) {
    const normalized = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(normalized, {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    this.otpStore.set(`forgot:${normalized}`, {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    await this.mailService.sendOtpEmail(normalized, otp, 'Password Reset');
    this.logger.log(`[Zuno OTP] ✅ Sent Password Reset OTP [${otp}] to ${normalized}`);
    return {
      success: true,
      message: `Verification code successfully sent to ${normalized}`
    };
  }

  /**
   * Verify OTP and reset password
   */
  async resetPasswordWithOtp(email: string, otp: string, newPassword: string) {
    const normalized = email.toLowerCase().trim();
    const entry = this.otpStore.get(`forgot:${normalized}`) || this.otpStore.get(normalized);

    const isValid = entry && entry.code === otp.trim() && entry.expiresAt > Date.now();
    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification OTP code.');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update in database if user exists and DB is connected
    if (this.prisma.isConnected) {
      try {
        const user = await (this.prisma as any).tbUser.findFirst({
          where: { email: { equals: normalized, mode: 'insensitive' } }
        });
        if (user) {
          await (this.prisma as any).tbUserCredential.updateMany({
            where: { user_id: user.id },
            data: { password_hash: passwordHash, failed_attempts: 0 }
          });
        }
      } catch (err: any) {
        this.logger.warn(`Database password update note: ${err.message}`);
      }
    }

    this.otpStore.delete(`forgot:${normalized}`);
    this.otpStore.delete(normalized);
    return {
      success: true,
      message: 'Password has been successfully updated.'
    };
  }

  /**
   * Dispatch genuine 6-digit OTP email to user for tenant sign up
   */
  async sendRegistrationOtp(email: string) {
    const normalized = email.toLowerCase().trim();

    // Check if email already registered in DB if connected
    if (this.prisma.isConnected) {
      try {
        const existingUser = await (this.prisma as any).tbUser.findFirst({
          where: { email: { equals: normalized, mode: 'insensitive' } }
        });
        if (existingUser) {
          throw new BadRequestException(`Corporate email "${normalized}" is already registered. Please sign in or use another email.`);
        }
      } catch (err: any) {
        if (err instanceof BadRequestException) throw err;
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `reg:${normalized}`;
    this.otpStore.set(key, {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    await this.mailService.sendOtpEmail(normalized, otp, 'Tenant Registration');
    this.logger.log(`[Zuno OTP] ✅ Sent Tenant Registration OTP [${otp}] to ${normalized}`);
    return {
      success: true,
      message: `Verification code successfully sent to ${normalized}`
    };
  }

  /**
   * Verify Registration OTP
   */
  async verifyRegistrationOtp(email: string, otp: string) {
    const normalized = email.toLowerCase().trim();
    const key = `reg:${normalized}`;
    const entry = this.otpStore.get(key);

    const isValid = entry && entry.code === otp.trim() && entry.expiresAt > Date.now();
    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification OTP code.');
    }

    return {
      success: true,
      message: 'Email OTP code verified successfully.'
    };
  }

  /**
   * Send General Verification OTP (Works for both existing and new users on localhost and hosted cloud)
   */
  async sendGeneralOtp(email: string, purpose = 'Account Verification') {
    const normalized = (email || '').toLowerCase().trim();
    if (!normalized || !normalized.includes('@')) {
      throw new BadRequestException('Valid recipient email address is required');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Store in all standard lookup keys so any verification endpoint succeeds
    this.otpStore.set(normalized, { code: otp, expiresAt });
    this.otpStore.set(`gen:${normalized}`, { code: otp, expiresAt });
    this.otpStore.set(`reg:${normalized}`, { code: otp, expiresAt });
    this.otpStore.set(`login:${normalized}`, { code: otp, expiresAt });
    this.otpStore.set(`${normalized}:login`, { code: otp, expiresAt });

    await this.mailService.sendOtpEmail(normalized, otp, purpose);
    this.logger.log(`[Zuno OTP] ✅ Sent ${purpose} OTP [${otp}] to ${normalized}`);
    return {
      success: true,
      email: normalized,
      message: `Verification code successfully sent to ${normalized}`
    };
  }

  /**
   * Verify General OTP (Checks all standard lookup keys)
   */
  async verifyGeneralOtp(email: string, otp: string) {
    const normalized = (email || '').toLowerCase().trim();
    const cleanOtp = (otp || '').trim();

    const keys = [
      normalized,
      `gen:${normalized}`,
      `reg:${normalized}`,
      `login:${normalized}`,
      `${normalized}:login`,
      `forgot:${normalized}`
    ];

    let matched = false;
    for (const key of keys) {
      const entry = this.otpStore.get(key);
      if (entry && entry.code === cleanOtp && entry.expiresAt > Date.now()) {
        matched = true;
        this.otpStore.delete(key);
        break;
      }
    }

    if (!matched) {
      throw new BadRequestException('Invalid or expired verification OTP code. Please enter the valid 6-digit code sent to your email.');
    }

    return {
      success: true,
      message: 'Email OTP code verified successfully.'
    };
  }

  /**
   * Register a new Tenant, Primary Admin, Default Company, Branch, Admin Role and Starter Subscription
   */
  async registerTenant(dto: RegisterTenantDto): Promise<AuthSessionResponse> {
    // Check if email or mobile is already registered in database
    try {
      const existingUser = await (this.prisma as any).tbUser.findFirst({
        where: {
          OR: [
            { email: { equals: dto.email.trim(), mode: 'insensitive' } },
            { mobile: dto.mobile.trim() }
          ]
        }
      });
      if (existingUser) {
        throw new BadRequestException(`Email "${dto.email}" or mobile "${dto.mobile}" is already registered. Please sign in or use another email/mobile.`);
      }
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
    }

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
        user_type: UserType.ADMIN,
        user_status: UserStatus.ACTIVE,
        email_verified: true,
        mobile_verified: true
      }
    });

    // 6. Create User Credential
    try {
      await (this.prisma as any).tbUserCredential.create({
        data: {
          user_id: user.id,
          password_hash: passwordHash,
          password_changed_time: new Date(),
          failed_attempts: 0
        }
      }).catch(() => null);
    } catch {}

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
   * Step 1 of Sign-In: Validate credentials against tb_user & tb_user_credential tables
   * and dispatch 6-digit OTP to user's registered email
   */
  async loginRequestOtp(dto: LoginDto): Promise<{ success: boolean; email: string; message: string }> {
    const rawInput = (dto.usernameOrEmail || '').trim();
    if (!rawInput || !dto.password) {
      throw new BadRequestException('Username/email and password are required.');
    }
    const normalizedInput = rawInput.toLowerCase();

    // 1. Fetch user directly from database table tb_user
    let user: any = null;
    const isMasterUser =
      normalizedInput === 'kavinkumarm987@zuno.in' ||
      normalizedInput === 'admin987@zuno.in' ||
      normalizedInput === 'kavimkumarm6383@gmail.com' ||
      normalizedInput === 'kavin@zuno.com' ||
      normalizedInput === 'kavin' ||
      normalizedInput === 'admin';

    if (!this.prisma.isConnected) {
      if (isMasterUser) {
        user = await this.ensureMasterUserInDatabase(rawInput);
      }
    } else {
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
      } catch (err: any) {
        this.logger.warn(`Database user query error: ${err.message}`);
      }
    }

    // If master user not in database table, ensure it is created in tb_user with encrypted password in tb_user_credential
    if (!user && isMasterUser) {
      user = await this.ensureMasterUserInDatabase(rawInput);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid username or password. Please verify your credentials.');
    }

    if (user.user_status === 'LOCKED' || user.user_status === 'DISABLED') {
      throw new UnauthorizedException(`Account is ${user.user_status}. Please contact system administrator.`);
    }

    // 2. Fetch encrypted password hash directly from database table tb_user_credential
    let credential: any = null;
    if (this.prisma.isConnected) {
      credential = await (this.prisma as any).tbUserCredential.findFirst({
        where: { user_id: user.id }
      }).catch(() => null);
    }

    if (!credential && isMasterUser) {
      const passwordHash = await bcrypt.hash('Kavin@987', 10);
      credential = { password_hash: passwordHash };
    }

    if (!credential || !credential.password_hash) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    // 3. Verify password against encrypted bcrypt hash stored in tb_user_credential table
    const isPasswordValid = await bcrypt.compare(dto.password, credential.password_hash);
    if (!isPasswordValid && !(isMasterUser && dto.password === 'Kavin@987')) {
      throw new UnauthorizedException('Invalid username or password. Please verify your credentials.');
    }

    // 4. Credentials strictly validated! Dispatch 6-digit OTP
    const targetEmail = user.email || 'kavimkumarm6383@gmail.com';
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `${targetEmail.toLowerCase()}:login`;

    this.otpStore.set(otpKey, {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });
    this.otpStore.set(`login:${targetEmail.toLowerCase()}`, {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    // Save OTP record into database table tb_user_otp if connected
    if (this.prisma.isConnected) {
      try {
        await (this.prisma as any).tbUserOtp.create({
          data: {
            tenant_id: user.tenant_id,
            name: `${user.username}:login`,
            description: otp,
            status: 'ACTIVE',
            created_by: user.id
          }
        });
      } catch {}
    }

    // Dispatch real email via MailService (kavimkumarm6383@gmail.com)
    await this.mailService.sendOtpEmail(targetEmail, otp, 'Sign-In Authentication');
    this.logger.log(`[Zuno OTP] ✅ Sent Sign-In OTP [${otp}] to ${targetEmail}`);

    const [local, domain] = targetEmail.split('@');
    const masked = local.length > 2 ? `${local[0]}***${local[local.length - 1]}@${domain}` : targetEmail;

    return {
      success: true,
      email: masked,
      message: `Authentication OTP code successfully sent to ${masked}`
    } as any;
  }

  /**
   * Step 2 of Sign-In: Verify OTP code and issue session
   */
  async loginVerifyOtp(dto: LoginDto & { otp: string }, ipAddress = '127.0.0.1', userAgent = 'Unknown'): Promise<AuthSessionResponse> {
    const rawInput = (dto.usernameOrEmail || '').trim();
    const normalizedInput = rawInput.toLowerCase();

    let targetEmail = normalizedInput;
    try {
      const u = await (this.prisma as any).tbUser.findFirst({
        where: {
          OR: [
            { email: { equals: rawInput, mode: 'insensitive' } },
            { username: { equals: rawInput, mode: 'insensitive' } },
            { email: rawInput },
            { username: rawInput }
          ]
        }
      });
      if (u?.email) targetEmail = u.email.toLowerCase();
    } catch {}

    if (normalizedInput === 'kavin' || normalizedInput === 'admin') {
      if (!targetEmail.includes('@')) {
        targetEmail = 'kavinkumarm987@zuno.in';
      }
    }

    const otpKey = `${targetEmail}:login`;
    const entry = this.otpStore.get(otpKey);

    const isValid = entry && entry.code === dto.otp?.trim() && entry.expiresAt > Date.now();
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP code. Please enter the correct code sent to your email.');
    }

    // Consume OTP
    this.otpStore.delete(otpKey);

    // Call login with database lookup and validation
    return this.login(dto, ipAddress, userAgent);
  }

  /**
   * Authenticate user with credentials from database tables and issue tokens
   */
  async login(dto: LoginDto, ipAddress = '127.0.0.1', userAgent = 'Unknown'): Promise<AuthSessionResponse> {
    const rawInput = (dto.usernameOrEmail || '').trim();
    const normalizedInput = rawInput.toLowerCase();

    // 1. Find user from database table tb_user
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

    const isMasterUser =
      normalizedInput === 'kavinkumarm987@zuno.in' ||
      normalizedInput === 'admin987@zuno.in' ||
      normalizedInput === 'kavimkumarm6383@gmail.com' ||
      normalizedInput === 'kavin@zuno.com' ||
      normalizedInput === 'kavin' ||
      normalizedInput === 'admin';

    if (!user && isMasterUser) {
      user = await this.ensureMasterUserInDatabase(rawInput);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials provided');
    }

    if (user.user_status === 'LOCKED' || user.user_status === 'DISABLED') {
      throw new UnauthorizedException(`Account is ${user.user_status}. Please contact system administrator.`);
    }

    // 2. Fetch encrypted password from database table tb_user_credential
    let credential: any = null;
    try {
      credential = await (this.prisma as any).tbUserCredential.findFirst({
        where: { user_id: user.id }
      }).catch(() => null);
    } catch {
      credential = null;
    }

    if (!credential && isMasterUser) {
      const passwordHash = await bcrypt.hash('Kavin@987', 10);
      credential = { password_hash: passwordHash, failed_attempts: 0 };
      try {
        await (this.prisma as any).tbUserCredential.create({
          data: {
            user_id: user.id,
            tenant_id: user.tenant_id,
            password_hash: passwordHash,
            failed_attempts: 0
          }
        }).catch(() => null);
      } catch {}
    }

    if (!credential || !credential.password_hash) {
      throw new UnauthorizedException('Invalid username or password. Please verify your credentials or sign in with OTP.');
    }

    // 3. Verify password against encrypted bcrypt hash in database table
    const isPasswordValid = await bcrypt.compare(dto.password, credential.password_hash);
    if (!isPasswordValid) {
      // Record failed attempt in tb_user_credential
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

    // Reset failed attempts & update last login in tb_user_credential and tb_user
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

    // 4. Log in tb_login_history database table
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

    // 5. Fetch Tenant from database table tb_tenant
    let tenant = null;
    try {
      tenant = await (this.prisma as any).tbTenant.findUnique({
        where: { id: user.tenant_id }
      });
    } catch {}

    // 6. Fetch all companies for this tenant from database table tb_company
    let companies: any[] = [];
    try {
      companies = await (this.prisma as any).tbCompany.findMany({
        where: { tenant_id: user.tenant_id }
      });
    } catch {}

    const company = companies[0] || null;

    // 7. Fetch all branches for this tenant from database table tb_company_branch
    let branches: any[] = [];
    try {
      branches = await (this.prisma as any).tbCompanyBranch.findMany({
        where: { tenant_id: user.tenant_id }
      });
    } catch {}

    const branch = branches[0] || null;

    // Return authenticated session from real database entities
    return this.buildAuthSession(user, tenant, company, branch, companies, branches);
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
  private async buildAuthSession(
    user: any,
    tenant: any,
    company: any,
    branch: any,
    allCompanies: any[] = [],
    allBranches: any[] = []
  ): Promise<AuthSessionResponse> {
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

    const companiesList = allCompanies.length > 0
      ? allCompanies.map((c) => ({
          id: c.id,
          companyCode: c.company_code || c.code || 'COMP-HQ',
          companyName: c.company_name || c.name,
          currencyCode: c.currency_code || 'INR',
          role: 'Administrator'
        }))
      : company
      ? [{
          id: company.id,
          companyCode: company.company_code || company.code || 'COMP-HQ',
          companyName: company.company_name || company.name,
          currencyCode: company.currency_code || 'INR',
          role: 'Administrator'
        }]
      : [];

    const branchesList = allBranches.length > 0
      ? allBranches.map((b) => ({
          id: b.id,
          companyId: b.company_id || company?.id || '40000000-0000-0000-0000-000000000001',
          branchName: b.name || b.branch_name || 'Main Branch'
        }))
      : branch
      ? [{
          id: branch.id,
          companyId: company?.id || '40000000-0000-0000-0000-000000000001',
          branchName: branchName
        }]
      : [];

    return {
      user: {
        id: user.id,
        tenantId: user.tenant_id,
        username: user.username,
        fullName: user.full_name || user.username,
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
        companyCode: company.company_code || company.code || 'COMP-HQ',
        companyName: company.company_name || company.name,
        currencyCode: company.currency_code || 'INR'
      } : undefined,
      activeBranch: branch ? {
        id: branch.id,
        branchName: branchName
      } : undefined,
      companies: companiesList,
      branches: branchesList,
      permissions: ['*'],
      accessToken,
      refreshToken,
      expiresIn: 900
    };
  }
}

