import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core/constants';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { number, object, string } from 'joi';
import { AuthModule } from '../auth/auth.module';
import { CommentsModule } from '../comments/comments.module';
import configuration from '../config/configuration';
import { FavoritesModule } from '../favorites/favorites.module';
import { MediasModule } from '../medias/medias.module';
import { RepliesModule } from '../replies/replies.module';
import { ReportsModule } from '../reports/reports.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';

/**
 * The main app module.
 *
 * @decorator `@Module`
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['.env.development', '.env.testing', '.env'],
      isGlobal: true,
      load: [configuration],
      validationOptions: {
        abortEarly: true,
      },
      validationSchema: object({
        AUTH_CALLBACK_URL: string().default(
          'http://localhost:3000/auth/login/callback',
        ),
        CACHE_MAX_ITEMS: number().default(50),
        CACHE_TTL_MS: number().default(60000),
        DATABASE_HOST: string().default('localhost'),
        DATABASE_NAME: string().default('mega64_archives_redux'),
        DATABASE_PASSWORD: string().required(),
        DATABASE_PORT: number().default(3306),
        DATABASE_USER: string().required(),
        JWT_EXPIRATION: string().default('1h'),
        JWT_SECRET: string().required(),
        MAGIC_LINK_EXPIRATION: string().default('5m'),
        MAGIC_LINK_SECRET: string().required(),
        NODE_ENV: string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: number().default(3000),
        SENTRY_DSN: string().required(),
        THROTTLE_LIMIT: number().default(20),
        THROTTLE_TTL: number().default(60),
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        max: configService.get<number>('cache.max', { infer: true }),
        ttl: configService.get<number>('cache.ttl', { infer: true }),
      }),
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        debug: process.env.NODE_ENV === 'development',
        dsn: configService.get<string>('sentry.dsn', { infer: true }),
        environment: process.env.NODE_ENV,
        logLevels: [process.env.NODE_ENV === 'production' ? 'error' : 'debug'],
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        limit: configService.get<number>('throttle.limit', { infer: true }),
        ttl: configService.get<number>('throttle.ttl', { infer: true }),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoLoadEntities: true,
        database: configService.get<string>('database.name', { infer: true }),
        host: configService.get<string>('database.host', { infer: true }),
        password: configService.get<string>('database.password', {
          infer: true,
        }),
        port: configService.get<number>('database.port', { infer: true }),
        synchronize: process.env.NODE_ENV === 'development',
        type: 'postgres',
        username: configService.get<string>('database.user', {
          infer: true,
        }),
        useUTC: true,
      }),
    }),
    AuthModule,
    UsersModule,
    TagsModule,
    CommentsModule,
    RepliesModule,
    ReportsModule,
    MediasModule,
    FavoritesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
