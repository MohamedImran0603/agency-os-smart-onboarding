import React from 'react';

export interface ServiceCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
  icon?: string;
}

const SERVICE_EMOJIS: Record<string, string> = {
  'Web Application Development': '💻',
  'Mobile App Engineering': '📱',
  'SaaS Platform Development': '☁️',
  'DevOps & Cloud Infrastructure': '⚙️',
  'QA & Test Automation': '🧪',
  'Search Engine Optimization (SEO)': '🔍',
  'Paid Advertising (PPC & Meta)': '🎯',
  'Brand Strategy & Identity': '🎨',
  'Social Media Management': '📣',
  'Email & Lifecycle Marketing': '📧',
  'Custom Software Development': '💻',
  'Full-Service Growth Retainer': '🚀',
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  label,
  selected,
  onClick,
  description,
  icon,
}) => {
  const emoji = icon || SERVICE_EMOJIS[label] || '⚡';

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
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition-all ${
          selected
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
            : 'bg-white border border-slate-200 text-textPrimary shadow-2xs'
        }`}
      >
        <span>{emoji}</span>
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
                : 'border-slate-300 bg-white/80'
            }`}
          >
            {selected && (
              <svg className="w-3.5 h-3.5" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        {description && (
          <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};
