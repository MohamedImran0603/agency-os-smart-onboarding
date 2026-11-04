import React from 'react';

export interface StepItem {
  label: string;
  emoji?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

const STEP_EMOJIS = ['🚀', '🏢', '🛠️', '📦', '👁️', '🔒', '🎉'];

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* ── Mobile view ── */}
      <div className="md:hidden flex items-center justify-between glass-panel px-4 py-3 rounded-2xl mb-6 shadow-sm border border-white/80">
        <div className="flex items-center space-x-2">
          <span className="text-base">{STEP_EMOJIS[currentStep - 1] || '✨'}</span>
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
          const emoji = step.emoji || STEP_EMOJIS[index] || '✨';

          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center relative group">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-95'
                      : isActive
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20 scale-105'
                      : 'bg-white/80 text-textSecondary border border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{emoji}</span>
                  )}
                </div>

                <span
                  className={`text-xs mt-2 font-medium tracking-tight whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'text-primary font-bold'
                      : isCompleted
                      ? 'text-textPrimary font-semibold'
                      : 'text-textSecondary/70'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 h-1 bg-slate-100 rounded-full overflow-hidden self-center mb-5">
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
