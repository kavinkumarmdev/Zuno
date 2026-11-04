import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@ApiTags('Audit & Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Retrieve immutable operational audit trail for tenant' })
  async getLogs(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: number
  ) {
    return this.auditService.getAuditLogs(tenantId, limit ? Number(limit) : 50);
  }
}

