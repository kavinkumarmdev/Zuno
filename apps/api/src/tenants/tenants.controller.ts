import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current tenant details and owned legal companies' })
  async getCurrent(@CurrentTenant() tenantId: string) {
    return this.tenantsService.getTenantById(tenantId);
  }

  @Patch('current')
  @ApiOperation({ summary: 'Update current tenant metadata' })
  async updateCurrent(
    @CurrentTenant() tenantId: string,
    @Body() body: { tenantName?: string }
  ) {
    return this.tenantsService.updateTenant(tenantId, body);
  }
}

