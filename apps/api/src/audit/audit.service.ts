import { Injectable } from '@nestjs/common';
import { NeonPrismaService } from '../database/neon-prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: NeonPrismaService) {}

  async logAction(data: {
    tenantId?: string;
    companyId?: string;
    branchId?: string;
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    oldData?: any;
    newData?: any;
    status?: string;
  }) {
    return (this.prisma as any).tbAuditLog.create({
      data: {
        tenant_id: data.tenantId,
        company_id: data.companyId,
        branch_id: data.branchId,
        user_id: data.userId,
        action: data.action,
        resource: data.resource,
        resource_id: data.resourceId,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        old_data: data.oldData,
        new_data: data.newData,
        status: data.status || 'SUCCESS'
      }
    });
  }

  async getAuditLogs(tenantId: string, limit = 50) {
    return (this.prisma as any).tbAuditLog.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_time: 'desc' },
      take: limit
    });
  }
}

