import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { WorkspacePreviewData } from '../../../lib/types/onboarding';
import { generatePreview } from '../../../lib/api/onboarding';
import { FALLBACK_PREVIEW } from '../../../lib/constants/fallback-data';
import {
  Eye,
  GitBranch,
  Users,
  Activity,
  Edit3,
  Lock,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  User,
  CheckCircle2,
} from 'lucide-react';

export interface WorkspacePreviewStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const WorkspacePreviewStep: React.FC<WorkspacePreviewStepProps> = ({
  onNext,
  onBack,
}) => {
  const [data, setData] = useState<WorkspacePreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<{ section: string; idx: number } | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    let mounted = true;
    async function fetchPreview() {
      try {
        setLoading(true);
        const res = await generatePreview();
        if (mounted) setData(res || FALLBACK_PREVIEW);
      } catch {
        if (mounted) {
          setError(null);
          setData(FALLBACK_PREVIEW);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchPreview();
    return () => {
      mounted = false;
    };
  }, []);

  const handleStartRename = (section: string, idx: number, currentName: string) => {
    setEditingIndex({ section, idx });
    setEditName(currentName);
  };

  const handleSaveRename = (section: string, idx: number) => {
    if (!data) return;
    const updated = { ...data };

    if (section === 'pipelines' && updated.preview.pipelines[idx]) {
      updated.preview.pipelines[idx].name = editName;
    } else if (section === 'projects' && updated.preview.projectTemplates[idx]) {
      updated.preview.projectTemplates[idx].name = editName;
    } else if (section === 'marketing' && updated.preview.marketingWorkflows[idx]) {
      updated.preview.marketingWorkflows[idx].name = editName;
    }

    setData(updated);
    setEditingIndex(null);
  };

  const preview = data?.preview;

  return (
    <Card className="max-w-4xl mx-auto p-6 md:p-10 space-y-7 glass-panel border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Eye className="w-4 h-4" />
            <span>Step 5 of 7</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight">
            Preview & Customize Generated Workspace
          </h2>
          <p className="text-sm text-textSecondary mt-1">
            Inspect the boards, stages, and checklists that will be provisioned in your isolated environment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="default" className="gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-textSecondary" />
            <span>Read-Only Preview</span>
          </Badge>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50/90 border border-rose-200/80 text-error rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-primary" width="32" height="32" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-xs font-semibold text-textSecondary">
            Synthesizing deterministic workspace preview...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Pipelines */}
          {preview?.pipelines && preview.pipelines.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-primary" />
                  <span>Pipeline & Stage Boards ({preview.pipelines.length})</span>
                </h3>
                <span className="text-xs text-textSecondary font-medium">Click name to rename</span>
              </div>

              <div className="space-y-3">
                {preview.pipelines.map((pipe, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl glass-card border border-white/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      {editingIndex?.section === 'pipelines' && editingIndex.idx === idx ? (
                        <div className="flex items-center gap-2 w-full max-w-sm">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-sm py-1"
                          />
                          <Button size="sm" onClick={() => handleSaveRename('pipelines', idx)}>
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => handleStartRename('pipelines', idx, pipe.name)}
                        >
                          <h4 className="text-sm font-bold text-textPrimary group-hover:text-primary transition-colors">
                            {pipe.name}
                          </h4>
                          <Edit3 className="w-3.5 h-3.5 text-textSecondary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                      <span className="text-[11px] font-semibold text-textSecondary px-2 py-0.5 rounded-full bg-slate-100">
                        {pipe.stages.length} Stages
                      </span>
                    </div>

                    {/* Stage Board Visual Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                      {pipe.stages.map((stage, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-textPrimary shrink-0 shadow-2xs"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: stage.color || '#3B82F6' }}
                          />
                          <span>{stage.label}</span>
                          {sIdx < pipe.stages.length - 1 && (
                            <span className="text-slate-300 ml-1">➔</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Projects & Roles */}
          {preview?.projectTemplates && preview.projectTemplates.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Project Architecture & Default Roles</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {preview.projectTemplates.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl glass-card border border-white/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-textPrimary truncate">{proj.name}</h4>
                      <Badge variant="default" className="text-[10px]">
                        {proj.category.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.defaultRoles.map((role, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1"
                        >
                          <User className="w-3 h-3 text-blue-500" />
                          <span>{role}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Marketing Automation Loops */}
          {preview?.marketingWorkflows && preview.marketingWorkflows.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Marketing & Growth Automations</span>
              </h3>
              <div className="space-y-2">
                {preview.marketingWorkflows.map((flow, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl glass-card border border-white/80 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-textPrimary">{flow.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Active Growth Loop</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/70">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </Button>
        <Button onClick={onNext} className="shadow-md shadow-blue-500/25">
          <span>Proceed to Final Review</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};
