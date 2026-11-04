import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '@zuno/shared-types';

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Tenant context could not be resolved from authenticated token');
    }
    return user.tenantId;
  }
);

