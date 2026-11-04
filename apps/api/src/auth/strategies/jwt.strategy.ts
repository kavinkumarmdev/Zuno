import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@zuno/shared-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'dev_zuno_secret_super_key_32_chars_long_for_hs256!',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload || !payload.sub || !payload.tenantId) {
      throw new UnauthorizedException('Malformed token payload');
    }
    return payload;
  }
}

