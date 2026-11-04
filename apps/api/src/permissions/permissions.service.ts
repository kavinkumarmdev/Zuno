import { Injectable, NotFoundException } from '@nestjs/common';
import { NeonPrismaService } from '../database/neon-prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: NeonPrismaService) {}

  async getRoleCatalog(tenantId: string) {
    const roles = await (this.prisma as any).tbRole.findMany({
      where: {
        OR: [
          { tenant_id: tenantId },
          { tenant_id: null }
        ],
        is_active: true
      }
    });

    const permissions = await (this.prisma as any).tbPermission.findMany({
      where: { is_active: true }
    });

    return { roles, permissions };
  }

  async createRole(tenantId: string, userId: string, data: { name: string; description?: string; permissionIds?: string[] }) {
    const role = await (this.prisma as any).tbRole.create({
      data: {
        tenant_id: tenantId,
        name: data.name,
        description: data.description,
        status: 'ACTIVE',
        created_by: userId
      }
    });

    if (data.permissionIds && data.permissionIds.length > 0) {
      for (const pId of data.permissionIds) {
        await (this.prisma as any).tbRolePermission.create({
          data: {
            tenant_id: tenantId,
            name: `${role.name} -> ${pId}`,
            status: 'ACTIVE',
            created_by: userId
          }
        });
      }
    }

    return role;
  }

  async getTenantUsers(tenantId: string) {
    const users = await (this.prisma as any).tbUser.findMany({
      where: { tenant_id: tenantId, is_active: true }
    });

    return users.map((u: any) => ({
      id: u.id,
      username: u.username,
      fullName: u.full_name,
      email: u.email,
      mobile: u.mobile,
      userType: u.user_type,
      userStatus: u.user_status,
      lastLoginTime: u.last_login_time,
      createdTime: u.created_time
    }));
  }
}

