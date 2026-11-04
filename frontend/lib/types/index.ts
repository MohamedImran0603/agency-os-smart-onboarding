// ─── Shared TypeScript Types ───────────────────────────────────────────────────
// Domain types used across the smart-onboarding module.
// Strictly synchronized with Prisma models and backend DTOs.

// ── Agency Enums ─────────────────────────────────────────────────────────────

/**
 * Supported agency types from Section 6 of the Common Standard.
 * Mirrors the AgencyType enum in schema.prisma.
 */
export type AgencyType =
  | 'SOFTWARE_DEVELOPMENT'
  | 'DIGITAL_MARKETING'
  | 'HYBRID';

/**
 * Onboarding lifecycle status.
 * Mirrors the OnboardingStatus enum in schema.prisma.
 */
export type OnboardingStatus =
  | 'IN_PROGRESS'
  | 'COMPLETED';

// ── Canonical Entities ────────────────────────────────────────────────────────

export interface Agency {
  id: string;
  name: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface AgencyOnboarding {
  id: string;
  agencyId: string;
  agencyName: string;
  agencyType: AgencyType;
  status: OnboardingStatus;
  currentStep: number;
  activatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyServiceSelection {
  id: string;
  agencyId: string;
  onboardingId: string;
  serviceName: string;
  createdAt: string;
}

export interface WorkspaceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  agencyType: AgencyType | null;
  configurationData: Record<string, unknown>;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyTemplateSelection {
  id: string;
  agencyId: string;
  onboardingId: string;
  templateId: string;
  createdAt: string;
}

export interface GeneratedWorkspaceConfig {
  id: string;
  agencyId: string;
  onboardingId: string;
  configType: string; // e.g. "PIPELINE" | "PROJECT" | "TASK" | "MARKETING_WORKFLOW"
  name: string;
  configData: Record<string, unknown>;
  sourceTemplateId: string | null;
  createdAt: string;
  updatedAt: string;
}
