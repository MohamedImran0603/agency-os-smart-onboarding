import React from 'react';
import {
  Globe,
  Smartphone,
  Cloud,
  Cpu,
  ShieldCheck,
  Search,
  Target,
  Palette,
  Share2,
  Mail,
  Check,
  CheckSquare,
} from 'lucide-react';

export interface ServiceCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
}

const SERVICE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'Web Application Development': Globe,
  'Mobile App Engineering': Smartphone,
  'SaaS Platform Development': Cloud,
  'DevOps & Cloud Infrastructure': Cpu,
  'QA & Test Automation': ShieldCheck,
  'Search Engine Optimization (SEO)': Search,
  'Paid Advertising (PPC & Meta)': Target,
  'Brand Strategy & Identity': Palette,
  'Social Media Management': Share2,
  'Email & Lifecycle Marketing': Mail,
  'Custom Software Development': Globe,
  'Full-Service Growth Retainer': CheckSquare,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  label,
  selected,
  onClick,
  description,
}) => {
  const IconComponent = SERVICE_ICON_MAP[label] || CheckSquare;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-start space-x-3.5 select-none ${
        selected
          ? 'glass-card-selected'
          : 'glass-card hover:bg-white hover:border-slate-300'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
          selected
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
            : 'bg-white border border-slate-200 text-primary shadow-2xs'
        }`}
      >
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-bold tracking-tight ${selected ? 'text-primary' : 'text-textPrimary'}`}>
            {label}
          </h4>
          <div
            className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
              selected
                ? 'bg-primary border-primary text-white shadow-xs'
                : 'border-slate-300 bg-white/90'
            }`}
          >
            {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>
        {description && (
          <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};
