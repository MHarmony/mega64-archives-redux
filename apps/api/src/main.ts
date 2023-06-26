import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SentryService } from '@ntegral/nestjs-sentry';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

/**
 * Bootstraps the application.
 */
async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.NODE_ENV === 'production',
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    })
  );
  app.useLogger(SentryService.SentryServiceInstance());
  app.use(helmet());
  app.use(compression());

  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        bearerFormat: 'JWT',
        description: 'Enter a valid JWT token',
        in: 'header',
        name: 'jwt',
        scheme: 'bearer',
        type: 'http',
      },
      'jwt'
    )
    .setContact('MHarmony', 'https://mharmony.io', 'contact@mharmony.io')
    .setTitle('Mega64 Archives Redux API')
    .setDescription('Mega64 Archives Redux API documentation.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get<number>('port', { infer: true }));
}

bootstrap();
