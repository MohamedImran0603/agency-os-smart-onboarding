import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { AgencyType } from '../../../lib/types/onboarding';
import {
  Building2,
  Code2,
  TrendingUp,
  Layers,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export interface AgencyProfileStepProps {
  initialName?: string | undefined;
  initialType?: AgencyType | undefined;
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
    IconComponent: React.ComponentType<{ className?: string }>;
    tag: string;
  }> = [
    {
      type: 'SOFTWARE_DEVELOPMENT',
      title: 'Software Development',
      description: 'Web & mobile applications, SaaS architectures, cloud APIs, and sprint engineering.',
      IconComponent: Code2,
      tag: 'Agile & DevOps',
    },
    {
      type: 'DIGITAL_MARKETING',
      title: 'Digital Marketing',
      description: 'Performance advertising, SEO engines, creative branding, and campaign analytics.',
      IconComponent: TrendingUp,
      tag: 'Growth & Creative',
    },
    {
      type: 'HYBRID',
      title: 'Hybrid / Full-Service',
      description: 'Unified delivery blending full-stack software development with growth retainers.',
      IconComponent: Layers,
      tag: 'End-to-End',
    },
  ];

  return (
    <Card className="max-w-2xl mx-auto p-6 md:p-10 space-y-7 glass-panel border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-3xl">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" />
          <span>Step 2 of 7</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight">
          Define Your Agency Profile
        </h2>
        <p className="text-sm text-textSecondary mt-1">
          Provide your agency identity and select your primary operating archetype.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="p-3.5 bg-rose-50/90 border border-rose-200/80 text-error rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Agency Name Input */}
        <div>
          <Input
            label="Agency Name"
            placeholder="e.g. Apex Digital Labs, Zenith Media"
            value={agencyName}
            onChange={(e) => {
              setAgencyName(e.target.value);
              if (nameError) validateName(e.target.value);
            }}
            error={nameError || undefined}
            helpText="This name will appear on all client invoices, workspace boards, and portal branding."
          />
        </div>

        {/* Agency Type Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-textSecondary uppercase tracking-wider">
            Select Agency Model
          </label>
          <div className="grid grid-cols-1 gap-3">
            {agencyTypes.map((item) => {
              const isSelected = agencyType === item.type;
              const Icon = item.IconComponent;
              return (
                <div
                  key={item.type}
                  onClick={() => setAgencyType(item.type)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 flex items-start space-x-3.5 border ${
                    isSelected
                      ? 'glass-card-selected'
                      : 'glass-card hover:bg-white'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                        : 'bg-white border border-slate-200 text-primary shadow-2xs'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold tracking-tight ${
                          isSelected ? 'text-primary' : 'text-textPrimary'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-blue-200/80 text-blue-800'
                            : 'bg-slate-100 text-textSecondary'
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/70">
          <Button type="button" variant="secondary" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Button>
          <Button type="submit" loading={isSubmitting} className="shadow-md shadow-blue-500/25">
            <span>Save & Continue</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </form>
    </Card>
  );
};
