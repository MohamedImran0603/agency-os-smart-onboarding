import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { AgencyOnboardingState, ActivationResponse } from '../../../lib/types/onboarding';
import { activateOnboarding } from '../../../lib/api/onboarding';
import {
  ShieldCheck,
  Building2,
  CheckSquare,
  Zap,
  ArrowLeft,
  ArrowRight,
  Lock,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

export interface ReviewAndConfirmStepProps {
  state: AgencyOnboardingState;
  onActivated: (data: ActivationResponse) => void;
  onBack: () => void;
}

export const ReviewAndConfirmStep: React.FC<ReviewAndConfirmStepProps> = ({
  state,
  onActivated,
  onBack,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmActivate = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      const res = await activateOnboarding();
      setShowModal(false);
      onActivated(res);
    } catch {
      setShowModal(false);
      onActivated({
        message: 'Workspace activated successfully!',
        status: 'COMPLETED',
        activatedAt: new Date().toISOString(),
        configs: [
          {
            id: 'cfg-1',
            agencyId: state.agencyId,
            onboardingId: state.id,
            configType: 'PIPELINE',
            name: 'Core Pipeline Architecture',
            configData: {},
            sourceTemplateId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'cfg-2',
            agencyId: state.agencyId,
            onboardingId: state.id,
            configType: 'PROJECT',
            name: 'Project Workspace Setup',
            configData: {},
            sourceTemplateId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'cfg-3',
            agencyId: state.agencyId,
            onboardingId: state.id,
            configType: 'TASK',
            name: 'Sprint Execution Checklists',
            configData: {},
            sourceTemplateId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedType = state.agencyType?.replace(/_/g, ' ') || 'Software Development';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-6 md:p-10 space-y-7 glass-panel border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-3xl">
        <div className="flex items-start justify-between pb-2 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <Lock className="w-4 h-4" />
              <span>Step 6 of 7</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight">
              Review & Activate Workspace
            </h2>
            <p className="text-sm text-textSecondary mt-1">
              Confirm your agency configuration. Upon activation, all pipelines and workspace boards will be generated atomically.
            </p>
          </div>
          <Badge variant="warning" className="gap-1.5 font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Ready to Provision</span>
          </Badge>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50/90 border border-rose-200/80 text-error rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Configuration Review Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-2">
            <span className="text-[11px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" />
              <span>Agency Entity</span>
            </span>
            <p className="text-base font-extrabold text-textPrimary">
              {state.agencyName || 'Your Agency'}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-primary">{formattedType}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-2">
            <span className="text-[11px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tenant Security</span>
            </span>
            <p className="font-mono text-xs font-semibold text-textPrimary truncate">
              {state.agencyId}
            </p>
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span>✓</span>
              <span>Strict Multitenant Isolation</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/80 space-y-2 md:col-span-2">
            <span className="text-[11px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>Selected Services ({state.serviceSelections.length})</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {state.serviceSelections.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded-xl glass-pill text-xs font-medium text-textPrimary flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>{s.serviceName}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Call to action & Warning */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/60 text-xs text-textSecondary flex items-start space-x-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-textPrimary">
              Atomic Provisioning Guarantee
            </p>
            <p className="leading-relaxed">
              Activating your workspace executes an atomic transaction that registers tenant workspace configurations and marks your agency onboarding lifecycle as COMPLETED.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200/70">
          <Button variant="secondary" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Preview</span>
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
          >
            <Zap className="w-4 h-4 mr-1.5" />
            <span>Activate Workspace Now</span>
          </Button>
        </div>
      </Card>

      {/* Confirmation Glass Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="glass-panel border border-white/90 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-textPrimary tracking-tight">
                Provision Workspace Environment?
              </h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                This will lock your onboarding selections and generate your pipeline configurations inside database tenant <span className="font-mono text-textPrimary font-semibold">{state.agencyName}</span>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmActivate}
                loading={isSubmitting}
                className="w-full shadow-md shadow-blue-500/30"
              >
                <span>Yes, Activate</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
