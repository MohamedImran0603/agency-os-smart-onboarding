import React from 'react';
import Link from 'next/link';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ActivationResponse } from '../../../lib/types/onboarding';

export interface CompletionStepProps {
  activationData: ActivationResponse | null;
  onResetDemo?: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  activationData,
  onResetDemo,
}) => {
  const configs = activationData?.configs || [];

  return (
    <Card className="max-w-2xl mx-auto text-center p-8 md:p-12 space-y-6">
      <div className="w-16 h-16 bg-emerald-50 text-success rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-md">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="success">Lifecycle: Completed</Badge>
          <Badge variant="default">All 7 Steps Finished</Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight">
          Your workspace is ready!
        </h1>
        <p className="text-sm text-textSecondary max-w-md mx-auto leading-relaxed">
          Your agency configuration has been provisioned and your team is ready
          to manage pipelines, deliver projects, and collaborate.
        </p>
      </div>

      {/* Generated Summary Card */}
      <div className="p-4 rounded-xl bg-slate-50 border border-border text-left space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">
            Generated Workspace Configurations ({configs.length})
          </span>
          {activationData?.activatedAt && (
            <span className="text-[11px] text-textSecondary font-mono">
              Activated: {new Date(activationData.activatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {configs.map((c) => (
            <div
              key={c.id}
              className="p-2.5 rounded-lg bg-white border border-border flex items-center justify-between shadow-2xs"
            >
              <div className="truncate pr-2">
                <p className="font-semibold text-textPrimary truncate">{c.name}</p>
                <p className="text-[10px] text-textSecondary uppercase">{c.configType}</p>
              </div>
              <span className="text-success font-bold text-xs">✓ Ready</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/templates" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">
            View Template Catalog
          </Button>
        </Link>

        <Button
          size="lg"
          onClick={() => {
            alert('Redirecting to Agency OS Main Workspace Dashboard...');
          }}
          className="w-full sm:w-auto px-8 bg-primary hover:bg-primaryDark text-white font-semibold"
        >
          Go to Dashboard →
        </Button>
      </div>

      {onResetDemo && (
        <div className="pt-2">
          <button
            onClick={onResetDemo}
            className="text-xs text-textSecondary/80 hover:text-textPrimary hover:underline"
          >
            ↺ Re-run Demo Wizard from Step 1
          </button>
        </div>
      )}
    </Card>
  );
};
