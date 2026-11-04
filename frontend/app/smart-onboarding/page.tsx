import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Onboarding',
  description:
    'Get your agency workspace configured in minutes with the guided Neirah Tech onboarding wizard.',
};

/**
 * Smart Onboarding root page.
 *
 * Phase 1 — Structure only. The actual wizard UI (multi-step form, agency
 * profiling, template recommendations, workspace generation) will be
 * implemented in Phase 2 / Phase 3.
 */
export default function SmartOnboardingPage(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="glass-card max-w-lg w-full p-8 text-center animate-fade-up">
        {/* Wordmark */}
        <p className="text-xs font-semibold tracking-widest uppercase text-brand-400 mb-3">
          Neirah Tech · Agency OS
        </p>

        {/* Headline */}
        <h1 className="text-3xl font-bold mb-4">
          <span className="text-gradient">Smart Onboarding</span>
        </h1>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Welcome! Your guided agency setup wizard is on its way.
          This route is the entry point for the smart-onboarding module.
          Full wizard UI will be implemented in Phase 2.
        </p>

        {/* Phase indicator badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-muted px-4 py-1.5 text-xs text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-amber animate-pulse" />
          Phase 1 — Scaffolding complete
        </span>
      </div>
    </main>
  );
}
