import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { TemplateCard } from '../TemplateCard';
import { WorkspaceTemplate, AgencyType } from '../../../lib/types/onboarding';
import { getRecommendedTemplates } from '../../../lib/api/onboarding';
import { FALLBACK_TEMPLATES } from '../../../lib/constants/fallback-data';
import {
  Boxes,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export interface TemplateRecommendationsStepProps {
  agencyType: AgencyType;
  initialSelectedIds?: string[] | undefined;
  onNext: (templateIds: string[]) => Promise<void>;
  onBack: () => void;
}

export const TemplateRecommendationsStep: React.FC<TemplateRecommendationsStepProps> = ({
  agencyType,
  initialSelectedIds = [],
  onNext,
  onBack,
}) => {
  const [templates, setTemplates] = useState<WorkspaceTemplate[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadTemplates() {
      try {
        setLoading(true);
        const data = await getRecommendedTemplates();
        if (mounted) {
          const list = data && data.length > 0 ? data : FALLBACK_TEMPLATES.filter((t) => !t.agencyType || t.agencyType === agencyType || t.agencyType === 'HYBRID');
          setTemplates(list);
          if (initialSelectedIds.length === 0) {
            setSelectedIds(list.map((t) => t.id));
          }
        }
      } catch {
        if (mounted) {
          const filtered = FALLBACK_TEMPLATES.filter((t) => !t.agencyType || t.agencyType === agencyType || t.agencyType === 'HYBRID');
          setTemplates(filtered);
          if (initialSelectedIds.length === 0) {
            setSelectedIds(filtered.map((t) => t.id));
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTemplates();
    return () => {
      mounted = false;
    };
  }, [agencyType, initialSelectedIds]);

  const toggleTemplate = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
    if (error) setError(null);
  };

  const getMatchReason = (t: WorkspaceTemplate): string => {
    if (t.agencyType === agencyType) {
      return `Direct match for your ${agencyType.replace(/_/g, ' ')} profile`;
    }
    return 'Universal framework applicable to all agency archetypes';
  };

  const handleNext = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one workspace template to generate.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onNext(selectedIds);
    } catch (err: any) {
      setError(err.message || 'Failed to save template selections.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 md:p-10 space-y-7 glass-panel border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Boxes className="w-4 h-4" />
            <span>Step 4 of 7</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight">
            Recommended Workspace Templates
          </h2>
          <p className="text-sm text-textSecondary mt-1">
            Pre-built pipeline boards, sprint structures, and task checklists tailored to your agency profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={selectedIds.length > 0 ? 'success' : 'default'} className="px-3 py-1 font-bold gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{selectedIds.length} Selected</span>
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
        <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-primary" width="32" height="32" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-xs font-semibold text-textSecondary">
            Matching industry templates to your selected offerings...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              name={template.name}
              description={template.description}
              category={template.category}
              selected={selectedIds.includes(template.id)}
              onToggle={() => toggleTemplate(template.id)}
              whyRecommended={getMatchReason(template)}
              pipelineStagesCount={template.configurationData?.pipeline?.stages?.length || 5}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/70">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </Button>
        <Button onClick={handleNext} loading={isSubmitting} className="shadow-md shadow-blue-500/25">
          <span>Generate Workspace Preview</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};
