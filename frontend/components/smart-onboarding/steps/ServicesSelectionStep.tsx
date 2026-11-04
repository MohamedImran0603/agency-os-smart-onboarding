import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ServiceCard } from '../ServiceCard';
import { AgencyType } from '../../../lib/types/onboarding';
import {
  Wrench,
  Sparkles,
  Code2,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export interface ServicesSelectionStepProps {
  agencyType: AgencyType;
  initialServices?: string[] | undefined;
  onNext: (services: string[]) => Promise<void>;
  onBack: () => void;
}

export const ServicesSelectionStep: React.FC<ServicesSelectionStepProps> = ({
  agencyType,
  initialServices = [],
  onNext,
  onBack,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(initialServices);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const softwareServices = [
    { label: 'Web Application Development', desc: 'Custom frontend and full-stack web applications' },
    { label: 'Mobile App Engineering', desc: 'Native and cross-platform iOS & Android apps' },
    { label: 'SaaS Platform Development', desc: 'Multi-tenant cloud architectures, APIs, and billing' },
    { label: 'DevOps & Cloud Infrastructure', desc: 'CI/CD deployment pipelines, AWS, Docker, and Kubernetes' },
    { label: 'QA & Test Automation', desc: 'End-to-end testing suites, regression, and code audits' },
  ];

  const marketingServices = [
    { label: 'Search Engine Optimization (SEO)', desc: 'Technical audits, keyword clusters, and organic rankings' },
    { label: 'Paid Advertising (PPC & Meta)', desc: 'Performance ad campaigns on Google, Meta, and LinkedIn' },
    { label: 'Brand Strategy & Identity', desc: 'Design systems, vector guidelines, and brand collateral' },
    { label: 'Social Media Management', desc: 'Community growth, creative campaigns, and content calendars' },
    { label: 'Email & Lifecycle Marketing', desc: 'Customer retention funnels, drip flows, and newsletter automation' },
  ];

  const toggleService = (name: string) => {
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    );
    if (error) setError(null);
  };

  const handleNext = async () => {
    if (selectedServices.length === 0) {
      setError('Please select at least one core service offered by your agency.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onNext(selectedServices);
    } catch (err: any) {
      setError(err.message || 'Failed to save services.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSoftware = agencyType === 'SOFTWARE_DEVELOPMENT' || agencyType === 'HYBRID';
  const showMarketing = agencyType === 'DIGITAL_MARKETING' || agencyType === 'HYBRID';

  return (
    <Card className="max-w-4xl mx-auto p-6 md:p-10 space-y-7 glass-panel border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            <span>Step 3 of 7</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight">
            Select Core Agency Services
          </h2>
          <p className="text-sm text-textSecondary mt-1">
            Choose the deliverables you execute for clients. Templates will be tailored to these services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={selectedServices.length > 0 ? 'success' : 'default'} className="px-3 py-1 font-bold gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{selectedServices.length} Selected</span>
          </Badge>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50/90 border border-rose-200/80 text-error rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {showSoftware && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider">
                Software Engineering Deliverables
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {softwareServices.map((s) => (
                <ServiceCard
                  key={s.label}
                  label={s.label}
                  description={s.desc}
                  selected={selectedServices.includes(s.label)}
                  onClick={() => toggleService(s.label)}
                />
              ))}
            </div>
          </div>
        )}

        {showMarketing && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider">
                Marketing & Creative Deliverables
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {marketingServices.map((s) => (
                <ServiceCard
                  key={s.label}
                  label={s.label}
                  description={s.desc}
                  selected={selectedServices.includes(s.label)}
                  onClick={() => toggleService(s.label)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/70">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </Button>
        <Button onClick={handleNext} loading={isSubmitting} className="shadow-md shadow-blue-500/25">
          <span>Save & Choose Templates</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};
