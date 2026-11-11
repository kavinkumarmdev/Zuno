import { Controller, Post, Body, Req, UseGuards, Get, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { Public } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '@zuno/shared-types';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new enterprise tenant and primary owner account' })
  @SwaggerApiResponse({ status: 201, description: 'Tenant successfully registered and logged in' })
  async register(@Body() dto: RegisterTenantDto) {
    return this.authService.registerTenant(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with username/email and password' })
  @SwaggerApiResponse({ status: 200, description: 'Successfully authenticated' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    return this.authService.login(dto, ip, userAgent);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and retrieve a fresh access token' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send 6-digit OTP verification email for password reset' })
  async forgotPassword(@Body() body: { email: string }) {
    if (!body?.email) {
      throw new BadRequestException('Corporate email address is required');
    }
    return this.authService.sendForgotPasswordOtp(body.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code and reset password' })
  async resetPassword(@Body() body: { email: string; otp: string; newPassword: string }) {
    if (!body?.email || !body?.otp || !body?.newPassword) {
      throw new BadRequestException('Email, OTP verification code, and new password are required');
    }
    return this.authService.resetPasswordWithOtp(body.email, body.otp, body.newPassword);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get profile information of currently authenticated user' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return {
      user: {
        id: user.sub,
        tenantId: user.tenantId,
        username: user.username,
        email: user.email,
        userType: user.userType,
        roles: user.roles,
        permissions: user.permissions
      },
      activeCompanyId: user.companyId,
      activeBranchId: user.branchId
    };
  }
}

