import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { ActivationResponse } from '../../../lib/types/onboarding';
import {
  CheckCircle2,
  GitBranch,
  Building2,
  ListChecks,
  Activity,
  Library,
  RefreshCw,
  Zap,
  ArrowRight,
} from 'lucide-react';

export interface CompletionStepProps {
  activationData: ActivationResponse | null;
  onResetDemo?: () => Promise<void> | void;
}

const CONFIG_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  PIPELINE: GitBranch,
  PROJECT: Building2,
  TASK: ListChecks,
  MARKETING_WORKFLOW: Activity,
};

export const CompletionStep: React.FC<CompletionStepProps> = ({
  activationData,
  onResetDemo,
}) => {
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const configs = activationData?.configs || [];

  const handleReset = async () => {
    if (!onResetDemo || resetting) return;
    try {
      setResetting(true);
      await onResetDemo();
    } finally {
      setResetting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto text-center p-8 md:p-12 space-y-7 glass-panel border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl">
      {/* Success Animated Glow Badge */}
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25 ring-8 ring-emerald-500/10 mx-auto">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="success" className="px-3 py-1 font-bold gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Status: Completed</span>
          </Badge>
          <Badge variant="default" className="px-3 py-1 font-bold gap-1">
            <Zap className="w-3.5 h-3.5" />
            <span>All 7 Steps Finished</span>
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-textPrimary tracking-tight">
          Your Workspace is Live!
        </h1>
        <p className="text-sm md:text-base text-textSecondary max-w-md mx-auto leading-relaxed">
          Your agency configuration has been provisioned and your team is ready to manage pipelines, deliver client sprints, and collaborate.
        </p>
      </div>

      {/* Generated Summary Card */}
      <div className="p-5 rounded-2xl glass-card border border-white/80 text-left space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <span className="text-xs font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-primary" />
            <span>Generated Workspace Configs ({configs.length})</span>
          </span>
          {activationData?.activatedAt && (
            <span className="text-[11px] text-textSecondary font-mono bg-slate-100 px-2 py-0.5 rounded-md">
              {new Date(activationData.activatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {configs.map((c) => {
            const Icon = CONFIG_ICON_MAP[c.configType] || Zap;
            return (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-white/90 border border-slate-200/80 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center space-x-2.5 truncate pr-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-textPrimary truncate">{c.name}</p>
                    <p className="text-[10px] text-textSecondary font-mono">{c.configType}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                  Ready
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/templates')}
          className="w-full sm:w-auto inline-flex items-center justify-center font-medium transition-all duration-200 px-5 py-2.5 text-sm gap-2 rounded-xl backdrop-blur-md bg-white/80 border border-slate-200/80 text-textPrimary hover:bg-white hover:border-slate-300 shadow-sm active:scale-[0.98]"
        >
          <Library className="w-4 h-4 text-primary" />
          <span>Browse Template Library</span>
        </button>

        <button
          type="button"
          onClick={() => router.push('/agency-profiles')}
          className="w-full sm:w-auto inline-flex items-center justify-center font-semibold transition-all duration-200 px-5 py-2.5 text-sm gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 active:scale-[0.98]"
        >
          <Building2 className="w-4 h-4" />
          <span>Agency Profiles</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {onResetDemo && (
          <button
            type="button"
            disabled={resetting}
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center font-medium transition-all duration-200 px-5 py-2.5 text-sm gap-2 rounded-xl backdrop-blur-md bg-white/60 border border-white/80 text-primary hover:bg-white/90 hover:border-primary/30 shadow-sm disabled:opacity-50 active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Reset Demo Session'}</span>
          </button>
        )}
      </div>
    </Card>
  );
};
