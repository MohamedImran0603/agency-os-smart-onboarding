// ─── Root Application Module ───────────────────────────────────────────────────
// Registers all feature modules. Keep this file as a thin orchestrator only.

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SmartOnboardingModule } from './smart-onboarding/smart-onboarding.module';

@Module({
  imports: [
    // Infrastructure
    PrismaModule,

    // Feature modules
    SmartOnboardingModule,
  ],
})
export class AppModule {}
