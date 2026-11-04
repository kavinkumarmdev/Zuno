import { IsNotEmpty, IsString, IsEmail, MinLength, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterTenantDto {
  @ApiProperty({ description: 'Organization / Tenant customer name', example: 'Acme Global Manufacturing' })
  @IsNotEmpty()
  @IsString()
  tenantName!: string;

  @ApiProperty({ description: 'Full name of tenant primary owner', example: 'Rajesh Kumar' })
  @IsNotEmpty()
  @IsString()
  ownerName!: string;

  @ApiProperty({ description: 'Primary owner email address', example: 'rajesh@acmeglobal.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Primary contact mobile number', example: '+919876543210' })
  @IsNotEmpty()
  @IsString()
  mobile!: string;

  @ApiProperty({ description: 'Secure password', example: 'AcmeAdmin2026!#' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: 'Name of the first registered company', example: 'Acme Industries Pvt Ltd' })
  @IsNotEmpty()
  @IsString()
  companyName!: string;

  @ApiPropertyOptional({ description: 'ISO Currency Code', example: 'INR', default: 'INR' })
  @IsOptional()
  @Length(3, 3)
  currencyCode?: string;

  @ApiPropertyOptional({ description: 'ISO Country Code', example: 'IN', default: 'IN' })
  @IsOptional()
  @Length(2, 2)
  countryCode?: string;
}

