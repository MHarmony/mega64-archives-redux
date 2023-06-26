import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MagicLoginStrategy } from './strategies/magic-login.strategy';

/**
 * The Auth module.
 *
 * @decorator `@Module`
 */
@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret', { infer: true }),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwtExpiration', {
            infer: true,
          }),
        },
      }),
    }),
    PassportModule,
    UsersModule,
  ],
  exports: [AuthService],
  providers: [AuthService, JwtStrategy, MagicLoginStrategy],
})
export class AuthModule {}
