import { Injectable, NotFoundException } from '@nestjs/common';
import { NeonPrismaService } from '../database/neon-prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: NeonPrismaService) {}

  async getTenantById(tenantId: string) {
    const tenant = await (this.prisma as any).tbTenant.findUnique({
      where: { id: tenantId }
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const companies = await (this.prisma as any).tbCompany.findMany({
      where: { tenant_id: tenantId }
    });

    const owners = await (this.prisma as any).tbTenantOwner.findMany({
      where: { tenant_id: tenantId }
    });

    return {
      tenant,
      companies,
      owners
    };
  }

  async updateTenant(tenantId: string, data: { tenantName?: string }) {
    return (this.prisma as any).tbTenant.update({
      where: { id: tenantId },
      data: {
        tenant_name: data.tenantName,
        updated_time: new Date()
      }
    });
  }
}

