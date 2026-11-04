import React from 'react';

export interface ServiceCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  label,
  selected,
  onClick,
  description,
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-4 border transition-all duration-150 flex items-start space-x-3 select-none ${
        selected
          ? 'bg-blue-50/70 border-primary ring-1 ring-primary shadow-sm'
          : 'bg-surface border-border hover:border-slate-300 hover:bg-slate-50/50'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-colors ${
          selected
            ? 'bg-primary border-primary text-white'
            : 'border-slate-300 bg-white'
        }`}
      >
        {selected && (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <div className="flex-1">
        <h4 className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-textPrimary'}`}>
          {label}
        </h4>
        {description && (
          <p className="text-xs text-textSecondary mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
};
