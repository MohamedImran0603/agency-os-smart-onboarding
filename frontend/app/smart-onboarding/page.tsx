'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Stepper } from '../../components/ui/Stepper';
import { WelcomeStep } from '../../components/smart-onboarding/steps/WelcomeStep';
import { AgencyProfileStep } from '../../components/smart-onboarding/steps/AgencyProfileStep';
import { ServicesSelectionStep } from '../../components/smart-onboarding/steps/ServicesSelectionStep';
import { TemplateRecommendationsStep } from '../../components/smart-onboarding/steps/TemplateRecommendationsStep';
import { WorkspacePreviewStep } from '../../components/smart-onboarding/steps/WorkspacePreviewStep';
import { ReviewAndConfirmStep } from '../../components/smart-onboarding/steps/ReviewAndConfirmStep';
import { CompletionStep } from '../../components/smart-onboarding/steps/CompletionStep';
import {
  AgencyOnboardingState,
  ActivationResponse,
  AgencyType,
} from '../../lib/types/onboarding';
import {
  getOnboardingState,
  saveProfile,
  saveServices,
  saveTemplateSelections,
  resetOnboarding,
} from '../../lib/api/onboarding';

const DEFAULT_DEMO_STATE: AgencyOnboardingState = {
  id: 'demo-onboarding-session',
  agencyId: 'a0000000-0000-0000-0000-000000000001',
  agencyName: '',
  agencyType: 'SOFTWARE_DEVELOPMENT',
  status: 'IN_PROGRESS',
  currentStep: 1,
  activatedAt: null,
  createdAt: '2026-11-04T00:00:00.000Z',
  updatedAt: '2026-11-04T00:00:00.000Z',
  serviceSelections: [],
  templateSelections: [],
};

const wizardSteps = [
  { label: 'Welcome' },
  { label: 'Profile' },
  { label: 'Services' },
  { label: 'Templates' },
  { label: 'Preview' },
  { label: 'Review' },
  { label: 'Complete' },
];

function SmartOnboardingContent() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const initialStepFromUrl = stepParam ? parseInt(stepParam, 10) : null;

  const [state, setState] = useState<AgencyOnboardingState | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(
    initialStepFromUrl && initialStepFromUrl >= 1 && initialStepFromUrl <= 7
      ? initialStepFromUrl
      : 1
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activationData, setActivationData] = useState<ActivationResponse | null>(null);

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `?step=${stepNumber}`);
    }
  };

  // Sync state if step URL param changes
  useEffect(() => {
    if (stepParam) {
      const parsed = parseInt(stepParam, 10);
      if (parsed >= 1 && parsed <= 7) {
        setCurrentStep(parsed);
      }
    }
  }, [stepParam]);

  const fetchState = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOnboardingState();
      setState(res);

      if (res.status === 'COMPLETED') {
        setActivationData({
          message: 'Workspace active',
          status: 'COMPLETED',
          activatedAt: res.activatedAt || new Date().toISOString(),
          configs: res.generatedConfigs || [],
        });
        // If no explicit step requested in URL, default to Welcome (Step 1) so user can see options
        if (!stepParam) {
          goToStep(1);
        }
      } else if (!stepParam) {
        // If in progress and no step param in URL, resume at appropriate step
        if (res.templateSelections && res.templateSelections.length > 0) {
          goToStep(5);
        } else if (res.serviceSelections && res.serviceSelections.length > 0) {
          goToStep(4);
        } else if (res.agencyName && res.agencyName !== 'New Agency' && res.agencyName.trim() !== '') {
          goToStep(3);
        } else {
          goToStep(res.currentStep === 2 ? 2 : 1);
        }
      }
    } catch {
      setState(DEFAULT_DEMO_STATE);
      if (!stepParam) goToStep(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();

    const handleTenantSwitched = () => {
      fetchState();
    };

    const handleGoToWelcome = () => {
      goToStep(1);
    };

    window.addEventListener('agency-switched', handleTenantSwitched);
    window.addEventListener('go-to-welcome', handleGoToWelcome);
    return () => {
      window.removeEventListener('agency-switched', handleTenantSwitched);
      window.removeEventListener('go-to-welcome', handleGoToWelcome);
    };
  }, []);

  // Step 1: Start
  const handleStart = () => {
    goToStep(2);
  };

  // Step 2: Save Profile -> Advance to Step 3
  const handleSaveProfile = async (data: { agencyName: string; agencyType: AgencyType }) => {
    try {
      const updated = await saveProfile(data);
      setState(updated);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('agency-profile-updated', {
            detail: { agencyId: updated.agencyId, agencyName: data.agencyName },
          }),
        );
      }
    } catch (err) {
      console.warn('Failed to save profile to backend, continuing locally:', err);
      setState((prev) => {
        const base = prev || DEFAULT_DEMO_STATE;
        return {
          ...base,
          agencyName: data.agencyName,
          agencyType: data.agencyType,
          currentStep: 3,
        };
      });
    }
    goToStep(3);
  };

  // Step 3: Save Services -> Advance to Step 4
  const handleSaveServices = async (services: string[]) => {
    try {
      const updated = await saveServices({ services });
      setState(updated);
    } catch {
      setState((prev) => {
        const base = prev || DEFAULT_DEMO_STATE;
        return {
          ...base,
          serviceSelections: services.map((s, idx) => ({
            id: `demo-s-${idx}`,
            agencyId: base.agencyId,
            onboardingId: base.id,
            serviceName: s,
            createdAt: new Date().toISOString(),
          })),
          currentStep: 4,
        };
      });
    }
    goToStep(4);
  };

  // Step 4: Save Templates -> Advance to Step 5
  const handleSaveTemplates = async (templateIds: string[]) => {
    try {
      const updated = await saveTemplateSelections({ templateIds });
      setState(updated);
    } catch {
      setState((prev) => {
        const base = prev || DEFAULT_DEMO_STATE;
        return {
          ...base,
          currentStep: 5,
        };
      });
    }
    goToStep(5);
  };

  // Step 5: Advance from Preview -> Step 6
  const handlePreviewConfirmed = () => {
    goToStep(6);
  };

  // Step 6: On Activated -> Step 7
  const handleActivated = (res: ActivationResponse) => {
    setActivationData(res);
    goToStep(7);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('agency-profile-updated', { detail: { agencyId: state?.agencyId } })
      );
    }
  };

  // Reset Demo Session (Resets backend state in Neon DB and returns to Step 1)
  const handleResetDemo = async () => {
    try {
      const fresh = await resetOnboarding();
      setState(fresh);
      setActivationData(null);
      goToStep(1);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('agency-profile-updated', {
            detail: { agencyId: fresh.agencyId },
          }),
        );
      }
    } catch (err) {
      console.warn('Failed to reset on backend, resetting locally:', err);
      setState(DEFAULT_DEMO_STATE);
      setActivationData(null);
      goToStep(1);
    }
  };

  // Only show full loading spinner on initial mount before state exists
  if (loading && !state) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
        <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" width="40" height="40">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-base font-semibold text-textPrimary">
          Loading your agency onboarding session...
        </p>
        <p className="text-xs text-textSecondary">
          Connecting to backend at {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}
        </p>
      </div>
    );
  }

  if (error && !state) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-error rounded-full flex items-center justify-center mx-auto border border-rose-200">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-textPrimary">Failed to Load Onboarding</h2>
        <p className="text-sm text-textSecondary">{error}</p>
        <button
          onClick={fetchState}
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primaryDark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ── Stepper Header with Interactive Jumping ── */}
      <div className="bg-surface p-4 md:p-6 rounded-2xl border border-border shadow-xs">
        <Stepper
          steps={wizardSteps}
          currentStep={currentStep}
          onStepClick={(step) => goToStep(step)}
        />
      </div>

      {/* ── Dynamic Step View ── */}
      <div>
        {currentStep === 1 && (
          <WelcomeStep
            onStart={handleStart}
            isContinuing={Boolean(state && state.currentStep > 1 && state.status !== 'COMPLETED')}
            currentStep={state?.currentStep}
            isCompleted={state?.status === 'COMPLETED'}
            agencyName={state?.agencyName}
            onViewComplete={() => goToStep(7)}
          />
        )}

        {currentStep === 2 && (
          <AgencyProfileStep
            initialName={state?.agencyName === 'New Agency' ? '' : (state?.agencyName ?? '')}
            initialType={state?.agencyType ?? 'SOFTWARE_DEVELOPMENT'}
            onNext={handleSaveProfile}
            onBack={() => goToStep(1)}
          />
        )}

        {currentStep === 3 && (
          <ServicesSelectionStep
            agencyType={state?.agencyType || 'SOFTWARE_DEVELOPMENT'}
            initialServices={state?.serviceSelections?.map((s) => s.serviceName) || []}
            onNext={handleSaveServices}
            onBack={() => goToStep(2)}
          />
        )}

        {currentStep === 4 && (
          <TemplateRecommendationsStep
            agencyType={state?.agencyType || 'SOFTWARE_DEVELOPMENT'}
            initialSelectedIds={state?.templateSelections?.map((ts) => ts.templateId) || []}
            onNext={handleSaveTemplates}
            onBack={() => goToStep(3)}
          />
        )}

        {currentStep === 5 && (
          <WorkspacePreviewStep
            onNext={handlePreviewConfirmed}
            onBack={() => goToStep(4)}
          />
        )}

        {currentStep === 6 && state && (
          <ReviewAndConfirmStep
            state={state}
            onActivated={handleActivated}
            onBack={() => goToStep(5)}
          />
        )}

        {currentStep === 7 && (
          <CompletionStep
            activationData={activationData}
            onResetDemo={handleResetDemo}
          />
        )}
      </div>
    </div>
  );
}

export default function SmartOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" width="40" height="40">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-base font-semibold text-textPrimary">Loading Onboarding Wizard...</p>
        </div>
      }
    >
      <SmartOnboardingContent />
    </Suspense>
  );
}
