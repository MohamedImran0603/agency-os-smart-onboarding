import React from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

export interface WelcomeStepProps {
  onStart: () => void;
  isContinuing?: boolean;
  currentStep?: number;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onStart,
  isContinuing = false,
  currentStep = 1,
}) => {
  return (
    <Card className="max-w-2xl mx-auto text-center p-8 md:p-12 space-y-6">
      <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-primary border border-blue-100">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="default">Smart Onboarding</Badge>
          <Badge variant="success">7 Guided Steps</Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight">
          Welcome to Agency OS
        </h1>
        <p className="text-sm md:text-base text-textSecondary max-w-lg mx-auto leading-relaxed">
          Get your agency workspace tailored and configured in minutes. We will
          profile your agency type, recommend production-tested pipelines and task
          checklists, and provision your entire environment automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left py-4 border-y border-border">
        <div className="p-3 rounded-lg bg-background border border-border/60">
          <span className="text-xs font-bold text-primary block">01 · Profile</span>
          <p className="text-xs text-textSecondary mt-1">Specify your agency model and primary offerings.</p>
        </div>
        <div className="p-3 rounded-lg bg-background border border-border/60">
          <span className="text-xs font-bold text-primary block">02 · Templates</span>
          <p className="text-xs text-textSecondary mt-1">Choose pre-built pipelines and deliverable checklists.</p>
        </div>
        <div className="p-3 rounded-lg bg-background border border-border/60">
          <span className="text-xs font-bold text-primary block">03 · Provision</span>
          <p className="text-xs text-textSecondary mt-1">Instant, automated workspace configuration.</p>
        </div>
      </div>

      <div className="pt-2">
        <Button size="lg" onClick={onStart} className="w-full sm:w-auto px-8">
          {isContinuing && currentStep > 1 ? `Continue Setup (Step ${currentStep})` : 'Start Setup'}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>
    </Card>
  );
};
