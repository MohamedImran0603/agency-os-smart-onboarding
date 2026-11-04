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
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-xl p-5 border transition-all duration-150 relative select-none flex flex-col justify-between ${
        selected
          ? 'bg-blue-50/50 border-primary ring-2 ring-primary/30 shadow-md'
          : 'bg-surface border-border hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <Badge variant="default" className="text-[11px] font-semibold tracking-wide">
            {category.replace(/_/g, ' ')}
          </Badge>

          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
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
        </div>

        <h3 className="text-base font-bold text-textPrimary leading-snug mb-1.5">
          {name}
        </h3>
        <p className="text-xs text-textSecondary leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex flex-col gap-2">
        {whyRecommended && (
          <div className="flex items-center text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">
            <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {whyRecommended}
          </div>
        )}

        {(pipelineStagesCount !== undefined || taskCount !== undefined) && (
          <div className="flex items-center gap-3 text-xs text-textSecondary">
            {pipelineStagesCount !== undefined && (
              <span>📊 {pipelineStagesCount} Stages</span>
            )}
            {taskCount !== undefined && (
              <span>📋 {taskCount} Checklists</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

