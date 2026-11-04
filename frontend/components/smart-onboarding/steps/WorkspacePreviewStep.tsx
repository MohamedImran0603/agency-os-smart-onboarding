import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { WorkspacePreviewData } from '../../../lib/types/onboarding';
import { generatePreview } from '../../../lib/api/onboarding';
import { FALLBACK_PREVIEW } from '../../../lib/constants/fallback-data';

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
        if (mounted) setData(FALLBACK_PREVIEW);
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
    } else if (section === 'tasks' && updated.preview.taskChecklists[idx]) {
      updated.preview.taskChecklists[idx].title = editName;
    }

    setData(updated);
    setEditingIndex(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-textPrimary tracking-tight">
              Step 5 · Workspace Structure Preview
            </h2>
            <Badge variant="success">Simulation</Badge>
          </div>
          <p className="text-sm text-textSecondary">
            Review the exact pipeline stages and task checklists that will be provisioned.
            You can customize structure names locally before confirmation.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-error rounded-lg text-sm flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-textSecondary flex flex-col items-center space-y-3">
            <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm font-medium">Synthesizing workspace schema...</p>
          </div>
        ) : !data ? (
          <div className="py-12 text-center text-textSecondary">
            <p className="text-base font-semibold">No preview generated.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pipelines Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                  <span>📊 Client & Delivery Pipelines</span>
                  <Badge variant="default">{data.preview.pipelines.length}</Badge>
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {data.preview.pipelines.map((pipe, idx) => (
                  <Card key={idx} className="bg-slate-50/50 p-4 border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      {editingIndex?.section === 'pipelines' && editingIndex.idx === idx ? (
                        <div className="flex items-center gap-2 w-full max-w-sm">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="py-1 text-xs"
                          />
                          <Button size="sm" onClick={() => handleSaveRename('pipelines', idx)}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-textPrimary">{pipe.name}</span>
                          <button
                            onClick={() => handleStartRename('pipelines', idx, pipe.name)}
                            className="text-xs text-primary hover:underline"
                          >
                            Customize
                          </button>
                        </div>
                      )}
                      <Badge variant="default" className="text-[10px]">
                        {pipe.sourceTemplate}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {pipe.stages.map((stage: any, sIdx: number) => (
                        <div
                          key={sIdx}
                          className="flex items-center text-xs px-2.5 py-1 rounded-md bg-white border border-border shadow-2xs font-medium text-textPrimary"
                        >
                          <span
                            className="w-2 h-2 rounded-full mr-1.5"
                            style={{ backgroundColor: stage.color || '#3B82F6' }}
                          />
                          {stage.label}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Task Checklists Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                  <span>📋 Quality & Delivery Checklists</span>
                  <Badge variant="default">{data.preview.taskChecklists.length}</Badge>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.preview.taskChecklists.map((chk, idx) => (
                  <Card key={idx} className="bg-slate-50/50 p-4 border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-textPrimary">{chk.title}</span>
                      <Badge variant="default" className="text-[10px]">
                        {chk.items.length} Tasks
                      </Badge>
                    </div>
                    <ul className="space-y-1.5 text-xs text-textSecondary">
                      {chk.items.slice(0, 3).map((item: string, iIdx: number) => (
                        <li key={iIdx} className="flex items-start space-x-2">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                      {chk.items.length > 3 && (
                        <li className="text-[11px] text-primary font-medium pl-4">
                          + {chk.items.length - 3} more checklist items
                        </li>
                      )}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="secondary" type="button" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={loading || !data}>
            Confirm & Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

