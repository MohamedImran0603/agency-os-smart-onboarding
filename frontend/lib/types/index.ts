// ─── Shared TypeScript Types ───────────────────────────────────────────────────
// Domain types used across the smart-onboarding module.
// Populated in Phase 2 when the data model is finalised.
// Keep types here in sync with backend DTOs and Prisma models.

// ── Agency types ──────────────────────────────────────────────────────────────

/**
 * Supported agency types for the onboarding profiler.
 * Mirrors the AgencyType enum in schema.prisma (Phase 2).
 */
export type AgencyType =
  | 'CREATIVE'
  | 'DIGITAL_MARKETING'
  | 'WEB_DEVELOPMENT'
  | 'PR'
  | 'CONSULTING'
  | 'FULL_SERVICE'
  | 'OTHER';

/**
 * Onboarding wizard step identifiers.
 * Used to drive the multi-step form state machine.
 */
export type OnboardingStep =
  | 'AGENCY_PROFILE'
  | 'TEAM_SIZE'
  | 'TEMPLATE_SELECTION'
  | 'REVIEW'
  | 'COMPLETE';

// ── API response shapes (mirroring NestJS response DTOs) ─────────────────────

export interface Agency {
  id: string;
  name: string;
  type: AgencyType;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface OnboardingSession {
  id: string;
  agencyId: string;
  currentStep: OnboardingStep;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceTemplate {
  id: string;
  name: string;
  description: string;
  agencyTypes: AgencyType[];
  pipelineCount: number;
  projectStructureCount: number;
  taskChecklistCount: number;
}
