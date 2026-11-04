import { IsNotEmpty, IsString, MinLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Username or registered email address', example: 'admin@acme.com' })
  @IsNotEmpty()
  @IsString()
  usernameOrEmail!: string;

  @ApiProperty({ description: 'Account password', example: 'ZunoEnterprise2026!' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ description: 'Optional explicit company scope' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Optional explicit branch scope' })
  @IsOptional()
  @IsUUID()
  branchId?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Rotating refresh token string' })
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}

