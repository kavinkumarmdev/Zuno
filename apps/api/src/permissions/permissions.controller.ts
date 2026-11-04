import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '@zuno/shared-types';

@ApiTags('Permissions & Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('roles')
  @ApiOperation({ summary: 'List all tenant roles and available permission catalog' })
  async getRoles(@CurrentTenant() tenantId: string) {
    return this.permissionsService.getRoleCatalog(tenantId);
  }

  @Post('roles')
  @ApiOperation({ summary: 'Create a custom role with assigned permissions' })
  async createRole(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: { name: string; description?: string; permissionIds?: string[] }
  ) {
    return this.permissionsService.createRole(tenantId, user.sub, body);
  }

  @Get('users')
  @ApiOperation({ summary: 'List all user accounts in current tenant' })
  async getUsers(@CurrentTenant() tenantId: string) {
    return this.permissionsService.getTenantUsers(tenantId);
  }
}

