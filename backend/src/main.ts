// ─── Bootstrap entry point ────────────────────────────────────────────────────
// No business logic here — pure server configuration.
// Business logic lives inside feature modules (e.g. smart-onboarding).

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ── Global prefix ──────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // ── Global validation pipe ─────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,          // auto-transform payloads to DTO class instances
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
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ── Listen ─────────────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀  Backend running on http://localhost:${port}/api/v1`);
  console.log(`📚  Swagger docs at   http://localhost:${port}/api/docs`);
}

void bootstrap();
