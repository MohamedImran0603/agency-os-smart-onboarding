// ─── Smart Onboarding Module ───────────────────────────────────────────────────
// Registers the controller and service for the smart-onboarding feature.
// PrismaService is available via the global PrismaModule — no need to import it.

import { Module } from '@nestjs/common';
import { SmartOnboardingController } from './smart-onboarding.controller';
import { SmartOnboardingService } from './smart-onboarding.service';

@Module({
  controllers: [SmartOnboardingController],
  providers: [SmartOnboardingService],
})
export class SmartOnboardingModule {}
