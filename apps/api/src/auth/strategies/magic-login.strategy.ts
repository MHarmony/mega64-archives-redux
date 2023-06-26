import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';

/**
 * The passport strategy for magic logins.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  /**
   * The constructor for MagicLoginStrategy.
   *
   * @param authService - The AuthService.
   * @param configService  - The ConfigService.
   */
  public constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      callbackUrl: configService.get<string>('auth.callbackUrl', {
        infer: true,
      }),
      jwtOptions: {
        expiresIn: configService.get<string>('auth.expiration', {
          infer: true,
        }),
      },
      secret: configService.get<string>('auth.secret', { infer: true }),
      sendMagicLink: async (destination: string, href: string) => {
        console.log(
          `Sending a magic link to ${destination} with the url ${href}`
        );
      },
      verify: async (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payload: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: any
      ) => callback(null, this.validate(payload)),
    });
  }

  /**
   * Validates a user.
   *
   * @param payload - The auth payload.
   *
   * @returns The validated user.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async validate(payload: any): Promise<User> {
    return this.authService.validateUser(payload.destination);
  }
}
