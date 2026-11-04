// ─── Smart Onboarding Service ──────────────────────────────────────────────────
// Encapsulates all business logic for the smart onboarding wizard.
// PrismaService is injected via constructor (global module — no extra imports).
// No business logic yet — Phase 2+ will populate the methods.

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SmartOnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Methods will be implemented in Phase 2 ────────────────────────────────
}
