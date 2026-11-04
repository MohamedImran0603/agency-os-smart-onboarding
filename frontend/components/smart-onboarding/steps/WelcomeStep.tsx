import React from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

export interface WelcomeStepProps {
  onStart: () => void;
  isContinuing?: boolean;
  currentStep?: number | undefined;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onStart,
  isContinuing = false,
  currentStep = 1,
}) => {
  return (
    <Card className="max-w-3xl mx-auto text-center p-8 md:p-12 space-y-8 glass-panel border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl">
      {/* Hero Badge & Icon */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-blue-500/25 ring-8 ring-blue-500/10">
          🚀
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Badge variant="default" className="gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80">
            ✨ Smart Onboarding
          </Badge>
          <Badge variant="success" className="gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            ⚡ 7 Guided Steps
          </Badge>
        </div>
      </div>

      {/* Main Copy */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-textPrimary tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Agency OS</span>
        </h1>
        <p className="text-sm md:text-base text-textSecondary max-w-xl mx-auto leading-relaxed">
          Configure your agency workspace in under 3 minutes. We will profile your archetype, recommend battle-tested pipeline boards and deliverable checklists, and provision your isolated tenant workspace automatically.
        </p>
      </div>

      {/* 3 Step Highlights with Emojis & Glass finish */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left py-2">
        <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center text-sm font-bold shadow-2xs">
            🏢
          </div>
          <div>
            <span className="text-xs font-bold text-textPrimary block">01 · Archetype</span>
            <p className="text-xs text-textSecondary mt-1 leading-relaxed">
              Software dev, growth marketing, or hybrid full-service model.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center text-sm font-bold shadow-2xs">
            📦
          </div>
          <div>
            <span className="text-xs font-bold text-textPrimary block">02 · Templates</span>
            <p className="text-xs text-textSecondary mt-1 leading-relaxed">
              Matched workflows, sprint boards, and task checklists.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-sm font-bold shadow-2xs">
            ⚡
          </div>
          <div>
            <span className="text-xs font-bold text-textPrimary block">03 · Provision</span>
            <p className="text-xs text-textSecondary mt-1 leading-relaxed">
              Atomic transaction workspace generation with zero downtime.
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button
          size="lg"
          onClick={onStart}
          className="w-full sm:w-auto px-10 py-3.5 text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35"
        >
          {isContinuing && currentStep > 1 ? `Continue Setup (Step ${currentStep}) ➔` : 'Get Started Now ➔'}
        </Button>
      </div>
    </Card>
  );
};
