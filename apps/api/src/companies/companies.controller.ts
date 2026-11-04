import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '@zuno/shared-types';

@ApiTags('Companies & Branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'List all companies registered under the tenant' })
  async getCompanies(@CurrentTenant() tenantId: string) {
    return this.companiesService.getCompanies(tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new legal entity / company under current tenant' })
  async createCompany(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: any
  ) {
    return this.companiesService.createCompany(tenantId, user.sub, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific company with addresses, branches and fiscal years' })
  async getCompanyById(
    @CurrentTenant() tenantId: string,
    @Param('id') companyId: string
  ) {
    return this.companiesService.getCompanyById(tenantId, companyId);
  }

  @Get('branches/list')
  @ApiOperation({ summary: 'List all operational branches across the enterprise' })
  async getBranches(@CurrentTenant() tenantId: string) {
    return this.companiesService.getBranches(tenantId);
  }

  @Post('branches')
  @ApiOperation({ summary: 'Register a new branch / location / warehouse' })
  async createBranch(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: any
  ) {
    return this.companiesService.createBranch(tenantId, user.sub, body);
  }
}

