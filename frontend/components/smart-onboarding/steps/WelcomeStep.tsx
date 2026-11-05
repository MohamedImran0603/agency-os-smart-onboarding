import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { AgencyType } from '../../../lib/types/onboarding';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Building2,
  Boxes,
  Cpu,
  ArrowRight,
  Plus,
  X,
  Code2,
  TrendingUp,
  Layers,
  Check,
  RotateCcw,
} from 'lucide-react';

export interface WelcomeStepProps {
  onStart: () => void;
  isContinuing?: boolean;
  currentStep?: number | undefined;
  isCompleted?: boolean | undefined;
  agencyName?: string | undefined;
  onViewComplete?: (() => void) | undefined;
  onCreateNewAgency?: ((name: string, type: AgencyType) => Promise<void>) | undefined;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onStart,
  isContinuing = false,
  currentStep = 1,
  isCompleted = false,
  agencyName = '',
  onViewComplete,
  onCreateNewAgency,
}) => {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<AgencyType>('SOFTWARE_DEVELOPMENT');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim().length < 2) {
      setError('Agency name must be at least 2 characters long.');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      if (onCreateNewAgency) {
        await onCreateNewAgency(newName.trim(), newType);
      }
      setShowCreateModal(false);
      setNewName('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create workspace.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
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
            <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 max-w-xl mx-auto text-center space-y-2 shadow-xs">
              <p className="text-base font-bold text-emerald-900 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Workspace provisioned for {agencyName || 'your agency'}!</span>
              </p>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Your tenant environment is active with live pipeline boards and task checklists. You can launch a brand new agency workspace, review this live setup, or switch between demo profiles below.
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
        <div className="space-y-4 pt-2">
          {isCompleted ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* 1. PRIMARY: Create New Agency Workspace */}
                <Button
                  size="lg"
                  onClick={() => setShowCreateModal(true)}
                  className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create New Agency Workspace</span>
                </Button>

                {/* 2. SECONDARY: View Completed Workspace */}
                {onViewComplete && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={onViewComplete}
                    className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>View Live Workspace (Step 7)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}

                {/* 3. TERTIARY: Switch Agency Profiles */}
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push('/agency-profiles')}
                  className="w-full sm:w-auto px-5 py-3.5 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>Switch Agency Profile</span>
                </Button>
              </div>

              {/* Subtle link to re-edit currently completed agency */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onStart}
                  className="text-xs text-textSecondary hover:text-primary transition-colors underline font-medium"
                >
                  Want to modify {agencyName || 'this agency'}&apos;s profile & services? Edit Profile & Services (Step 2)
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={onStart}
                className="w-full sm:w-auto px-9 py-3.5 text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 flex items-center justify-center gap-2"
              >
                <span>{isContinuing && currentStep > 1 ? `Continue Setup (Step ${currentStep})` : 'Start Guided Onboarding'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>+ Create New Agency</span>
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* ── Modal: Create New Agency Workspace ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 md:p-8 space-y-6 animate-scale-up relative">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setError(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-textSecondary hover:bg-slate-100 hover:text-textPrimary transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100/90 text-primary flex items-center justify-center shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-textPrimary tracking-tight">
                Create New Agency Workspace
              </h2>
              <p className="text-xs text-textSecondary leading-relaxed">
                Initialize a dedicated multi-tenant agency workspace. Your existing completed workspaces will remain safely preserved in the database.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary">
                  Agency Name *
                </label>
                <Input
                  placeholder="e.g. Acme Digital Labs, Horizon Creative"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (error) setError(null);
                  }}
                  autoFocus
                  required
                  minLength={2}
                  className="py-2.5 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary">
                  Select Operating Archetype
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    {
                      type: 'SOFTWARE_DEVELOPMENT' as AgencyType,
                      title: 'Software Development',
                      desc: 'Agile sprint boards, code reviews, and CI/CD task checklists.',
                      icon: Code2,
                    },
                    {
                      type: 'DIGITAL_MARKETING' as AgencyType,
                      title: 'Digital Marketing',
                      desc: 'Growth campaigns, creative assets, and lead acquisition pipelines.',
                      icon: TrendingUp,
                    },
                    {
                      type: 'HYBRID' as AgencyType,
                      title: 'Hybrid Full-Service',
                      desc: 'Combined technical engineering and performance marketing sprints.',
                      icon: Layers,
                    },
                  ].map((arch) => {
                    const isSelected = newType === arch.type;
                    const Icon = arch.icon;
                    return (
                      <button
                        type="button"
                        key={arch.type}
                        onClick={() => setNewType(arch.type)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-blue-50/90 border-primary text-textPrimary ring-2 ring-primary/20 shadow-xs'
                            : 'bg-surface border-border text-textSecondary hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-slate-100 text-textSecondary'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-textPrimary block">
                              {arch.title}
                            </span>
                            <span className="text-[11px] text-textSecondary block leading-snug">
                              {arch.desc}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="md"
                  disabled={isCreating || !newName.trim()}
                  className="shadow-md shadow-blue-500/20"
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      Provisioning...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span>Launch Workspace (Step 2)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
