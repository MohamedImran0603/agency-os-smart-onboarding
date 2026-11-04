import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ServiceCard } from '../ServiceCard';
import { AgencyType } from '../../../lib/types/onboarding';

export interface ServicesSelectionStepProps {
  agencyType: AgencyType;
  initialServices?: string[];
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
    { label: 'SaaS Platform Development', desc: 'Multi-tenant cloud platforms and APIs' },
    { label: 'DevOps & Cloud Infrastructure', desc: 'CI/CD pipelines, containerization, and Kubernetes' },
    { label: 'QA & Test Automation', desc: 'End-to-end testing, integration tests, and performance audit' },
  ];

  const marketingServices = [
    { label: 'Search Engine Optimization (SEO)', desc: 'Technical audits, on-page optimization, and organic growth' },
    { label: 'Paid Advertising (PPC & Meta)', desc: 'Performance marketing on Google, Meta, and LinkedIn Ads' },
    { label: 'Brand Strategy & Identity', desc: 'Visual design systems, brand guidelines, and collateral' },
    { label: 'Social Media Management', desc: 'Community management, organic content, and engagement' },
    { label: 'Email & Lifecycle Marketing', desc: 'Retention funnels, drip campaigns, and lead nurture' },
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

  return (
    <Card className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary tracking-tight">
            Step 3 · Core Services
          </h2>
          <p className="text-sm text-textSecondary mt-1">
            Select the services your agency delivers to clients.
          </p>
        </div>
        <Badge variant={selectedServices.length > 0 ? 'success' : 'default'} className="self-start">
          {selectedServices.length} Selected
        </Badge>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-error rounded-lg text-sm flex items-center space-x-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Software Services */}
      {(agencyType === 'SOFTWARE_DEVELOPMENT' || agencyType === 'HYBRID') && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider">
            Engineering & Technology Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {softwareServices.map((svc) => (
              <ServiceCard
                key={svc.label}
                label={svc.label}
                description={svc.desc}
                selected={selectedServices.includes(svc.label)}
                onClick={() => toggleService(svc.label)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Marketing Services */}
      {(agencyType === 'DIGITAL_MARKETING' || agencyType === 'HYBRID') && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider">
            Marketing & Growth Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {marketingServices.map((svc) => (
              <ServiceCard
                key={svc.label}
                label={svc.label}
                description={svc.desc}
                selected={selectedServices.includes(svc.label)}
                onClick={() => toggleService(svc.label)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="secondary" type="button" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} loading={isSubmitting}>
          Continue to Recommendations
        </Button>
      </div>
    </Card>
  );
};

