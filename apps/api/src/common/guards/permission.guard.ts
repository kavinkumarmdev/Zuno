import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';
import { JwtPayload, UserType } from '@zuno/shared-types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    if (!user) {
      throw new ForbiddenException('User context missing');
    }

    // Tenant owners and super admins have unrestricted permission
    if (user.userType === UserType.OWNER || user.isPlatformAdmin) {
      return true;
    }

    const userPermissions = new Set(user.permissions || []);
    const hasPermission = requiredPermissions.every(permission => userPermissions.has(permission));

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied. Missing required permission(s): ${requiredPermissions.join(', ')}`
      );
    }

    return true;
  }
}

