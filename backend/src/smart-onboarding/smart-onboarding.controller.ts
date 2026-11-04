// ─── Smart Onboarding Controller ──────────────────────────────────────────────
// Route handlers are defined here. Business logic is delegated to the service.
// No business logic in this file — Phase 2+ will populate the methods.

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SmartOnboardingService } from './smart-onboarding.service';

@ApiTags('smart-onboarding')
@Controller('smart-onboarding')
export class SmartOnboardingController {
  constructor(
    private readonly smartOnboardingService: SmartOnboardingService,
  ) {}

  // ── Endpoints will be implemented in Phase 2 ──────────────────────────────
}
