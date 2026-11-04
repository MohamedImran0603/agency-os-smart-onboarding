import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { AgencyType } from '../../../lib/types/onboarding';

export interface AgencyProfileStepProps {
  initialName?: string;
  initialType?: AgencyType;
  onNext: (data: { agencyName: string; agencyType: AgencyType }) => Promise<void>;
  onBack: () => void;
}

export const AgencyProfileStep: React.FC<AgencyProfileStepProps> = ({
  initialName = '',
  initialType = 'SOFTWARE_DEVELOPMENT',
  onNext,
  onBack,
}) => {
  const [agencyName, setAgencyName] = useState(initialName);
  const [agencyType, setAgencyType] = useState<AgencyType>(initialType);
  const [nameError, setNameError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateName = (val: string) => {
    if (!val || val.trim().length < 2) {
      setNameError('Agency name must be at least 2 characters long.');
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateName(agencyName)) return;

    try {
      setIsSubmitting(true);
      setApiError(null);
      await onNext({ agencyName: agencyName.trim(), agencyType });
    } catch (err: any) {
      setApiError(err.message || 'Failed to save agency profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const agencyTypes: Array<{
    type: AgencyType;
    title: string;
    description: string;
    icon: string;
  }> = [
    {
      type: 'SOFTWARE_DEVELOPMENT',
      title: 'Software Development',
      description: 'Custom software, web & mobile applications, SaaS products, API development, and DevOps.',
      icon: '💻',
    },
    {
      type: 'DIGITAL_MARKETING',
      title: 'Digital Marketing',
      description: 'Performance marketing, SEO campaigns, paid advertising, branding, and content creation.',
      icon: '📈',
    },
    {
      type: 'HYBRID',
      title: 'Hybrid / Both',
      description: 'Full-service digital agency delivering both engineering solutions and growth marketing.',
      icon: '🚀',
    },
  ];

  return (
    <Card className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary tracking-tight">
          Step 2 · Agency Profile
        </h2>
        <p className="text-sm text-textSecondary mt-1">
          Tell us about your agency so we can recommend the most relevant workspace configurations.
        </p>
      </div>

      {apiError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-error rounded-lg text-sm flex items-center space-x-2">
          <span>⚠️</span>
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Agency Legal / Brand Name"
          placeholder="e.g. Acme Digital Labs"
          value={agencyName}
          onChange={(e) => {
            setAgencyName(e.target.value);
            if (nameError) validateName(e.target.value);
          }}
          onBlur={() => validateName(agencyName)}
          error={nameError || undefined}
          helpText="This name will appear on client portals and generated workspace reports."
          required
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-textPrimary">
            Primary Agency Archetype
          </label>
          <div className="grid grid-cols-1 gap-3">
            {agencyTypes.map((t) => {
              const isSelected = agencyType === t.type;
              return (
                <div
                  key={t.type}
                  onClick={() => setAgencyType(t.type)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all flex items-start space-x-3.5 ${
                    isSelected
                      ? 'bg-blue-50/70 border-primary ring-1 ring-primary shadow-sm'
                      : 'bg-surface border-border hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-textPrimary'}`}>
                        {t.title}
                      </h4>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="secondary" type="button" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save & Continue
          </Button>
        </div>
      </form>
    </Card>
  );
};

