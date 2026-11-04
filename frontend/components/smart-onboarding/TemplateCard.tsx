import React from 'react';
import { Badge } from '../ui/Badge';

export interface TemplateCardProps {
  id?: string;
  name: string;
  description: string;
  category: string;
  selected: boolean;
  onToggle: () => void;
  whyRecommended?: string;
  pipelineStagesCount?: number;
  taskCount?: number;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  SOFTWARE_PIPELINE: '💻',
  SOFTWARE_SAAS: '☁️',
  SOFTWARE_MAINTENANCE: '🛡️',
  MARKETING_PAID_MEDIA: '🎯',
  MARKETING_SEO: '🔍',
  MARKETING_BRANDING: '🎨',
  HYBRID_OPERATIONS: '🚀',
  HYBRID_COLLABORATION: '🤝',
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  name,
  description,
  category,
  selected,
  onToggle,
  whyRecommended,
  pipelineStagesCount,
  taskCount,
}) => {
  const emoji = CATEGORY_EMOJIS[category] || '📦';

  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 relative select-none flex flex-col justify-between ${
        selected
          ? 'glass-card-selected'
          : 'glass-card hover:bg-white hover:border-slate-300'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{emoji}</span>
            <Badge variant="default" className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 bg-slate-100/90 text-textSecondary border border-slate-200">
              {category.replace(/_/g, ' ')}
            </Badge>
          </div>

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

        <h3 className={`text-base font-bold leading-snug mb-1.5 ${selected ? 'text-primary' : 'text-textPrimary'}`}>
          {name}
        </h3>
        <p className="text-xs text-textSecondary leading-relaxed line-clamp-3">
          {description}
        </p>

        {whyRecommended && (
          <div className="mt-3 py-1.5 px-2.5 rounded-xl bg-blue-50/80 border border-blue-200/60 text-[11px] text-blue-800 flex items-center gap-1.5">
            <span>✨</span>
            <span className="font-medium truncate">{whyRecommended}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-textSecondary font-medium">
        <span className="flex items-center gap-1">
          <span>📊</span>
          <span>{pipelineStagesCount || 5} Stages</span>
        </span>
        <span className="flex items-center gap-1">
          <span>📋</span>
          <span>{taskCount || 10} Checklists</span>
        </span>
      </div>
    </div>
  );
};
