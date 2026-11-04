import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { TemplateCard } from '../TemplateCard';
import { WorkspaceTemplate, AgencyType } from '../../../lib/types/onboarding';
import { getRecommendedTemplates } from '../../../lib/api/onboarding';

export interface TemplateRecommendationsStepProps {
  agencyType: AgencyType;
  initialSelectedIds?: string[];
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
          setTemplates(data);
          // If no initial selections, pre-select all recommended templates
          if (initialSelectedIds.length === 0) {
            setSelectedIds(data.map((t) => t.id));
          }
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load templates.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTemplates();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleTemplate = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
    if (error) setError(null);
  };

  const getMatchReason = (t: WorkspaceTemplate): string => {
    if (t.agencyType === agencyType) {
      const typeLabel =
        agencyType === 'SOFTWARE_DEVELOPMENT'
          ? 'Software Development'
          : agencyType === 'DIGITAL_MARKETING'
          ? 'Digital Marketing'
          : 'Hybrid';
      return `Matched: ${typeLabel} archetype`;
    }
    return 'Universal hybrid workspace template';
  };

  const handleNext = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one workspace template to continue.');
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
    <Card className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary tracking-tight">
            Step 4 · Recommended Templates
          </h2>
          <p className="text-sm text-textSecondary mt-1">
            Production-tested delivery pipelines and task checklists tailored for your agency.
          </p>
        </div>
        <Badge variant={selectedIds.length > 0 ? 'success' : 'default'} className="self-start">
          {selectedIds.length} Selected
        </Badge>
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
          <p className="text-sm font-medium">Matching workspace templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="py-12 text-center text-textSecondary">
          <p className="text-base font-semibold">No templates found.</p>
          <p className="text-xs mt-1">Please ensure database seed has been executed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => {
            const isSelected = selectedIds.includes(template.id);
            const stagesCount = template.configurationData?.pipeline?.stages?.length;
            const taskCount = template.configurationData?.taskChecklists?.length;

            return (
              <TemplateCard
                key={template.id}
                id={template.id}
                name={template.name}
                description={template.description}
                category={template.category}
                selected={isSelected}
                onToggle={() => toggleTemplate(template.id)}
                whyRecommended={getMatchReason(template)}
                pipelineStagesCount={stagesCount}
                taskCount={taskCount}
              />
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="secondary" type="button" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} loading={isSubmitting} disabled={loading || templates.length === 0}>
          Preview Workspace Generation
        </Button>
      </div>
    </Card>
  );
};

