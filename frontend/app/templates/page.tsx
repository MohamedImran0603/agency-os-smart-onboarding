'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { WorkspaceTemplate } from '../../lib/types/onboarding';
import { getTemplates } from '../../lib/api/onboarding';
import { FALLBACK_TEMPLATES } from '../../lib/constants/fallback-data';
import {
  BookOpen,
  ArrowLeft,
  Building2,
  Tag,
  Sparkles,
  Code2,
  Cloud,
  Shield,
  Target,
  Search,
  Palette,
  Layers,
  Users,
  Boxes,
  ArrowRight,
  X,
  Zap,
} from 'lucide-react';

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  SOFTWARE_PIPELINE: Code2,
  SOFTWARE_SAAS: Cloud,
  SOFTWARE_MAINTENANCE: Shield,
  MARKETING_PAID_MEDIA: Target,
  MARKETING_SEO: Search,
  MARKETING_BRANDING: Palette,
  HYBRID_OPERATIONS: Layers,
  HYBRID_COLLABORATION: Users,
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<WorkspaceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkspaceTemplate | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getTemplates();
        setTemplates(data && data.length > 0 ? data : FALLBACK_TEMPLATES);
      } catch {
        setError(null);
        setTemplates(FALLBACK_TEMPLATES);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  const filtered = templates.filter((t) => {
    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'NULL' && t.agencyType === null) ||
      t.agencyType === typeFilter;

    const matchesCategory =
      categoryFilter === 'ALL' || t.category === categoryFilter;

    return matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 max-w-7xl mx-auto space-y-7 font-sans">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/smart-onboarding"
              className="text-xs font-bold text-primary hover:text-primaryDark flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Guided Onboarding</span>
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-textPrimary tracking-tight mt-1 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span>Template Management Catalog</span>
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            Explore seeded pipelines, sprint checklists, and workflow configurations across agency domains.
          </p>
        </div>

        <Link href="/smart-onboarding">
          <Button size="md" className="shadow-md shadow-blue-500/25">
            <Zap className="w-4 h-4 mr-1.5" />
            <span>Start Guided Onboarding</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* ─── Glass Filter Bar ────────────────────────────────────────────────── */}
      <div className="glass-panel p-4 md:p-5 rounded-2xl flex flex-wrap items-center gap-4 border border-white/80 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <label className="text-xs font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>Agency Type:</span>
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-semibold bg-white/90 border border-slate-200 rounded-xl px-3 py-2 text-textPrimary focus:ring-2 focus:ring-primary focus:outline-none shadow-2xs"
          >
            <option value="ALL">All Types (Software, Marketing, Hybrid)</option>
            <option value="SOFTWARE_DEVELOPMENT">Software Development</option>
            <option value="DIGITAL_MARKETING">Digital Marketing</option>
            <option value="HYBRID">Hybrid Operations</option>
          </select>
        </div>

        <div className="flex items-center space-x-2.5">
          <label className="text-xs font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span>Category:</span>
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold bg-white/90 border border-slate-200 rounded-xl px-3 py-2 text-textPrimary focus:ring-2 focus:ring-primary focus:outline-none shadow-2xs"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="default" className="text-xs font-bold px-3 py-1 bg-slate-100 text-textSecondary gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Showing {filtered.length} of {templates.length} Templates</span>
          </Badge>
        </div>
      </div>

      {/* ─── Template Grid ──────────────────────────────────────────────────── */}
      {loading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-primary" width="32" height="32" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm font-semibold text-textSecondary">Loading workspace templates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => {
            const CategoryIcon = CATEGORY_ICON_MAP[t.category] || Boxes;
            return (
              <Card
                key={t.id}
                variant="interactive"
                onClick={() => setSelectedTemplate(t)}
                className="flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <CategoryIcon className="w-4 h-4 text-primary" />
                      <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                        {t.category.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <Badge variant={t.isActive ? 'success' : 'error'} className="text-[10px] font-bold">
                      {t.isActive ? 'Active' : 'Draft'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors leading-snug">
                    {t.name}
                  </h3>
                  <p className="text-xs text-textSecondary mt-2 leading-relaxed line-clamp-3">
                    {t.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-textSecondary font-medium">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-textSecondary" />
                    <span>{t.agencyType?.replace(/_/g, ' ') || 'Universal'}</span>
                  </span>
                  <span className="font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── Detail / JSON Inspector Modal ──────────────────────────────────── */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="glass-panel border border-white/90 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl shadow-2xs">
                  {React.createElement(CATEGORY_ICON_MAP[selectedTemplate.category] || Boxes, { className: 'w-5 h-5 text-primary' })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-textPrimary leading-none">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-xs text-textSecondary mt-1">
                    {selectedTemplate.category.replace(/_/g, ' ')} · v{selectedTemplate.version}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-textSecondary hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs scrollbar-thin">
              <p className="text-textSecondary leading-relaxed">
                {selectedTemplate.description}
              </p>

              <div>
                <span className="text-[11px] font-bold text-textSecondary uppercase tracking-wider block mb-2">
                  Configuration JSON Payload
                </span>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto shadow-inner">
                  {JSON.stringify(selectedTemplate.configurationData, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-200/80">
              <Button size="sm" variant="secondary" onClick={() => setSelectedTemplate(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
