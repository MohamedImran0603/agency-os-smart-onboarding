import React from 'react';

export interface StepItem {
  label: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile view */}
      <div className="md:hidden flex items-center justify-between bg-surface border border-border px-4 py-3 rounded-xl mb-6">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-sm font-medium text-textPrimary">
          {steps[currentStep - 1]?.label || 'Setup'}
        </span>
        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center relative group">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isActive
                      ? 'bg-primary text-white shadow-md ring-4 ring-primary/20'
                      : 'bg-slate-100 text-textSecondary border border-border'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`text-xs mt-2 text-center font-medium max-w-[80px] leading-tight ${
                    isActive
                      ? 'text-primary font-semibold'
                      : isCompleted
                      ? 'text-textPrimary'
                      : 'text-textSecondary/70'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-6 transition-colors duration-300 ${
                    stepNumber < currentStep ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
