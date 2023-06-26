import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';

/**
 * The passport strategy for JWT.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * The constructor for JwtStrategy.
   *
   * @param authService - The AuthService.
   * @param configService - The ConfigService.
   */
  public constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.jwtSecret', { infer: true }),
    });
  }

  /**
   * Validates a user.
   *
   * @param payload - The auth payload.
   *
   * @returns The validated user.
   */
  public async validate(payload: {
    sub: number;
    email: string;
  }): Promise<User> {
    return this.authService.validateUser(payload.email);
  }
}
