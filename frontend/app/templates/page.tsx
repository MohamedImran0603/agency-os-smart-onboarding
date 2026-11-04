'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { WorkspaceTemplate } from '../../lib/types/onboarding';
import { getTemplates } from '../../lib/api/onboarding';
import { FALLBACK_TEMPLATES } from '../../lib/constants/fallback-data';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<WorkspaceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

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
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/smart-onboarding"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              ← Back to Onboarding Wizard
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight mt-1">
            Template Management Catalog
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            Explore seeded pipelines, sprint checklists, and workflow configurations across agency domains.
          </p>
        </div>

        <Link href="/smart-onboarding">
          <Button size="md">
            Start Guided Onboarding →
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-wrap items-center gap-4 bg-surface">
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-textSecondary uppercase">
            Agency Type:
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-medium bg-background border border-border rounded-lg px-2.5 py-1.5 text-textPrimary focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Types</option>
            <option value="SOFTWARE_DEVELOPMENT">Software Development</option>
            <option value="DIGITAL_MARKETING">Digital Marketing</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-textSecondary uppercase">
            Category:
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium bg-background border border-border rounded-lg px-2.5 py-1.5 text-textPrimary focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs text-textSecondary font-medium">
          Showing {filtered.length} of {templates.length} Templates
        </div>
      </Card>

      {/* Table / Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm font-medium text-textSecondary">Loading templates...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 text-error rounded-xl text-center space-y-2">
          <p className="font-bold">Error loading templates</p>
          <p className="text-xs">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <Card key={t.id} className="flex flex-col justify-between p-5 space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="default" className="text-[10px] font-semibold">
                    {t.category.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant={t.isActive ? 'success' : 'error'} className="text-[10px]">
                    {t.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-textPrimary">{t.name}</h3>
                <p className="text-xs text-textSecondary leading-relaxed line-clamp-3">
                  {t.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-between text-[11px] text-textSecondary">
                <span>Version v{t.version}</span>
                <span className="font-semibold text-primary">
                  {t.agencyType?.replace(/_/g, ' ') || 'Universal Hybrid'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

