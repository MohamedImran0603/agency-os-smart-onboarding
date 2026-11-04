// ─── Application E2E Test Scaffold ────────────────────────────────────────────
// Integration tests will be fleshed out in Phase 4 (Testing phase).
// This file bootstraps the NestJS test application for API-level tests.

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Smart Onboarding API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── Smoke test ──────────────────────────────────────────────────────────────
  it('GET /api/v1 → should return 404 (no root route registered)', () => {
    return request(app.getHttpServer()).get('/api/v1').expect(404);
  });

  // ── Feature tests will be added in Phase 4 ─────────────────────────────────
});
