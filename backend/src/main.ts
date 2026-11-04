// ─── Bootstrap entry point ────────────────────────────────────────────────────
// Server configuration, global pipes, filters, interceptors, and security startup checks.

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter, TransformInterceptor } from './common';

async function bootstrap(): Promise<void> {
  // ── Startup Environment Safety Check ───────────────────────────────────────
  // Throws if critical secrets are missing in production or development
  const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(
      `FATAL: Missing mandatory environment variables: ${missingEnv.join(', ')}`,
    );
  }

  const app = await NestFactory.create(AppModule);

  // ── Global Prefix ──────────────────────────────────────────────────────────
  // Routes: /api/onboarding, /api/templates
  app.setGlobalPrefix('api');

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-agency-id'],
  });

  // ── Global Filters & Interceptors ──────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ── Global Validation Pipe ─────────────────────────────────────────────────
  // Rejects any undeclared property and auto-transforms to DTO instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Swagger (OpenAPI) ──────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Agency OS — Smart Onboarding API')
    .setDescription(
      'REST API powering the smart onboarding wizard for Neirah Tech Agency OS.',
    )
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-agency-id', in: 'header' }, 'agency-context')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ── Listen ─────────────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀  Backend running on http://localhost:${port}/api`);
}

bootstrap();
