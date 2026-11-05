import React from 'react';
import {
  Sparkles,
  Building2,
  Wrench,
  Boxes,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Check,
} from 'lucide-react';

export interface StepItem {
  label: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
  onStepClick?: (step: number) => void;
}

const STEP_ICONS = [
  Sparkles,
  Building2,
  Wrench,
  Boxes,
  Eye,
  ShieldCheck,
  CheckCircle2,
];

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = '',
  onStepClick,
}) => {
  const CurrentIcon = STEP_ICONS[currentStep - 1] || Sparkles;

  return (
    <div className={`w-full ${className}`}>
      {/* ── Mobile view ── */}
      <div className="md:hidden flex items-center justify-between glass-panel px-4 py-3 rounded-2xl mb-6 shadow-sm border border-white/80">
        <div className="flex items-center space-x-2">
          <CurrentIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <span className="text-sm font-semibold text-textPrimary truncate max-w-[140px]">
          {steps[currentStep - 1]?.label || 'Setup'}
        </span>
        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Desktop view ── */}
      <div className="hidden md:flex items-center justify-between w-full glass-panel px-6 py-4 rounded-2xl shadow-xs border border-white/80 mb-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const StepIcon = STEP_ICONS[index] || Sparkles;

          return (
            <React.Fragment key={step.label}>
              <button
                type="button"
                onClick={() => onStepClick?.(stepNumber)}
                disabled={!onStepClick}
                className="flex flex-col items-center relative group focus:outline-hidden disabled:cursor-default"
                title={`Jump to Step ${stepNumber}: ${step.label}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-95 group-hover:scale-105'
                      : isActive
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20 scale-105'
                      : 'bg-white/90 text-textSecondary border border-slate-200 shadow-2xs hover:border-slate-300 group-hover:scale-105'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>

                <span
                  className={`text-xs mt-2 font-medium tracking-tight whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'text-primary font-bold'
                      : isCompleted
                      ? 'text-textPrimary font-semibold group-hover:text-primary'
                      : 'text-textSecondary/70 group-hover:text-textPrimary'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 h-1 bg-slate-200/70 rounded-full overflow-hidden self-center mb-5">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      stepNumber < currentStep
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 w-full'
                        : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
