'use client';

import React, { useState, useEffect } from 'react';
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
} from '../../lib/api/onboarding';

export default function SmartOnboardingPage() {
  const [state, setState] = useState<AgencyOnboardingState | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activationData, setActivationData] = useState<ActivationResponse | null>(null);

  const wizardSteps = [
    { label: 'Welcome' },
    { label: 'Profile' },
    { label: 'Services' },
    { label: 'Templates' },
    { label: 'Preview' },
    { label: 'Review' },
    { label: 'Complete' },
  ];

  const fetchState = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOnboardingState();
      setState(res);

      if (res.status === 'COMPLETED') {
        setCurrentStep(7);
        setActivationData({
          message: 'Workspace active',
          status: 'COMPLETED',
          activatedAt: res.activatedAt || new Date().toISOString(),
          configs: res.generatedConfigs || [],
        });
      } else if (res.currentStep && res.currentStep >= 1 && res.currentStep <= 7) {
        setCurrentStep(res.currentStep);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to onboarding service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Step 1: Start
  const handleStart = () => {
    setCurrentStep(2);
  };

  // Step 2: Save Profile
  const handleSaveProfile = async (data: { agencyName: string; agencyType: AgencyType }) => {
    const updated = await saveProfile(data);
    setState(updated);
    setCurrentStep(3);
  };

  // Step 3: Save Services
  const handleSaveServices = async (services: string[]) => {
    const updated = await saveServices({ services });
    setState(updated);
    setCurrentStep(4);
  };

  // Step 4: Save Templates
  const handleSaveTemplates = async (templateIds: string[]) => {
    const updated = await saveTemplateSelections({ templateIds });
    setState(updated);
    setCurrentStep(5);
  };

  // Step 5: Advance from Preview
  const handlePreviewConfirmed = () => {
    setCurrentStep(6);
  };

  // Step 6: On Activated
  const handleActivated = (res: ActivationResponse) => {
    setActivationData(res);
    setCurrentStep(7);
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
        <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
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
      {/* ── Stepper Header ── */}
      <div className="bg-surface p-4 md:p-6 rounded-2xl border border-border shadow-xs">
        <Stepper steps={wizardSteps} currentStep={currentStep} />
      </div>

      {/* ── Dynamic Step View ── */}
      <div>
        {currentStep === 1 && (
          <WelcomeStep
            onStart={handleStart}
            isContinuing={Boolean(state && state.currentStep > 1 && state.status !== 'COMPLETED')}
            currentStep={state?.currentStep}
          />
        )}

        {currentStep === 2 && (
          <AgencyProfileStep
            initialName={state?.agencyName === 'New Agency' ? '' : state?.agencyName}
            initialType={state?.agencyType}
            onNext={handleSaveProfile}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <ServicesSelectionStep
            agencyType={state?.agencyType || 'SOFTWARE_DEVELOPMENT'}
            initialServices={state?.serviceSelections?.map((s) => s.serviceName) || []}
            onNext={handleSaveServices}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <TemplateRecommendationsStep
            agencyType={state?.agencyType || 'SOFTWARE_DEVELOPMENT'}
            initialSelectedIds={state?.templateSelections?.map((ts) => ts.templateId) || []}
            onNext={handleSaveTemplates}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <WorkspacePreviewStep
            onNext={handlePreviewConfirmed}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 6 && state && (
          <ReviewAndConfirmStep
            state={state}
            onActivated={handleActivated}
            onBack={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 7 && (
          <CompletionStep
            activationData={activationData}
            onResetDemo={() => setCurrentStep(1)}
          />
        )}
      </div>
    </div>
  );
}
