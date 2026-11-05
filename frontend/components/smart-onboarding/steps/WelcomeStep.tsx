import React from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Building2,
  Boxes,
  Cpu,
  ArrowRight,
} from 'lucide-react';

export interface WelcomeStepProps {
  onStart: () => void;
  isContinuing?: boolean;
  currentStep?: number | undefined;
  isCompleted?: boolean | undefined;
  agencyName?: string | undefined;
  onViewComplete?: (() => void) | undefined;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onStart,
  isContinuing = false,
  currentStep = 1,
  isCompleted = false,
  agencyName = '',
  onViewComplete,
}) => {
  return (
    <Card className="max-w-3xl mx-auto text-center p-8 md:p-12 space-y-8 glass-panel border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl">
      {/* Hero Badge & Icon */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/25 ring-8 ring-blue-500/10">
          <Sparkles className="w-9 h-9 fill-white/20 text-white" />
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Badge variant="default" className="gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80">
            <Zap className="w-3.5 h-3.5" />
            <span>Smart Onboarding</span>
          </Badge>
          <Badge variant="success" className="gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Workspace Live' : '7 Guided Steps'}</span>
          </Badge>
        </div>
      </div>

      {/* Main Copy */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-textPrimary tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Agency OS</span>
        </h1>
        {isCompleted ? (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 max-w-lg mx-auto text-center space-y-1">
            <p className="text-sm font-bold text-emerald-800 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Workspace provisioned for {agencyName || 'your agency'}!</span>
            </p>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Your tenant environment is active. You can review your provisioned configs or start a new onboarding flow below.
            </p>
          </div>
        ) : (
          <p className="text-sm md:text-base text-textSecondary max-w-xl mx-auto leading-relaxed">
            Configure your agency workspace in under 3 minutes. We will profile your archetype, recommend battle-tested pipeline boards and deliverable checklists, and provision your isolated tenant workspace automatically.
          </p>
        )}
      </div>

      {/* 3 Step Highlights with Standard Vector Icons & Glass finish */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left py-2">
        <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-100/90 text-blue-700 flex items-center justify-center shadow-2xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-textPrimary block">01 · Archetype</span>
            <p className="text-xs text-textSecondary mt-1 leading-relaxed">
              Software dev, growth marketing, or hybrid full-service model.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-100/90 text-indigo-700 flex items-center justify-center shadow-2xs">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-textPrimary block">02 · Templates</span>
            <p className="text-xs text-textSecondary mt-1 leading-relaxed">
              Matched workflows, sprint boards, and task checklists.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shadow-2xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-textPrimary block">03 · Provision</span>
            <p className="text-xs text-textSecondary mt-1 leading-relaxed">
              Atomic transaction workspace generation with zero downtime.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {isCompleted && onViewComplete ? (
          <>
            <Button
              size="lg"
              onClick={onViewComplete}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35"
            >
              <span>View Completed Workspace (Step 7)</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold"
            >
              <span>Edit Profile & Services (Step 2)</span>
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-3.5 text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35"
          >
            <span>{isContinuing && currentStep > 1 ? `Continue Setup (Step ${currentStep})` : 'Start Guided Onboarding'}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}
      </div>
    </Card>
  );
};
