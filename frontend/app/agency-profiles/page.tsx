'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import {
  getAllAgencies,
  getActiveAgencyId,
  setActiveAgencyId,
  createAgencyDemo,
  deleteAgencyDemo,
} from '../../lib/api/onboarding';
import { AgencyItem, AgencyType } from '../../lib/types/onboarding';

export default function AgencyProfilesPage() {
  const router = useRouter();
  const [agencies, setAgencies] = useState<AgencyItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [agencyType, setAgencyType] = useState<AgencyType>('SOFTWARE_DEVELOPMENT');
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await getAllAgencies();
      setAgencies(list);
      setActiveId(getActiveAgencyId());
    } catch (err) {
      console.warn('Failed to fetch agencies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelect = (id: string) => {
    setActiveAgencyId(id);
    setActiveId(id);
    router.push('/smart-onboarding');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setCreating(true);
      const res = await createAgencyDemo({ name: name.trim(), agencyType });
      setName('');
      setShowCreateModal(false);
      setActiveAgencyId(res.id);
      router.push('/smart-onboarding');
    } catch (err) {
      alert('Error creating agency: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, agencyName: string) => {
    if (!confirm(`Are you sure you want to delete profile '${agencyName}'?`)) return;
    try {
      await deleteAgencyDemo(id);
      if (activeId === id) {
        setActiveAgencyId('a0000000-0000-0000-0000-000000000001');
      }
      loadData();
    } catch (err) {
      alert('Failed to delete agency: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100/80 text-primary">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-textPrimary tracking-tight">
              Agency Profiles & Demos
            </h1>
          </div>
          <p className="text-sm text-textSecondary mt-1">
            Browse all seeded demo tenants and newly created agency profiles in your Neon PostgreSQL database.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-textSecondary hover:text-textPrimary glass-panel hover:bg-white rounded-xl transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Agency Profile</span>
          </button>
        </div>
      </div>

      {/* ── Active Agency Banner ── */}
      {activeId && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 border border-blue-200/80 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Current Active Tenant
              </p>
              <p className="text-sm font-extrabold text-textPrimary">
                {agencies.find((a) => a.id === activeId)?.name || 'Demo Agency'}
              </p>
            </div>
          </div>
          <Link
            href="/smart-onboarding"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-primary hover:text-primaryDark bg-white/90 rounded-xl border border-blue-200 shadow-2xs hover:shadow-xs transition-all"
          >
            <span>Open Wizard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Grid of Agencies ── */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-textSecondary">Loading agency profiles...</p>
        </div>
      ) : agencies.length === 0 ? (
        <div className="bg-white/80 p-12 text-center rounded-2xl border border-border shadow-xs space-y-4">
          <Building2 className="w-12 h-12 text-textSecondary mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-textPrimary">No Agency Profiles Found</h3>
          <p className="text-xs text-textSecondary max-w-sm mx-auto">
            Get started by spinning up your first demo agency profile.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs"
          >
            + Create Agency Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agencies.map((agency) => {
            const ob = agency.onboardings?.[0];
            const isCurrent = agency.id === activeId;
            const isCompleted = ob?.status === 'COMPLETED';
            const configsCount = ob?.generatedConfigs?.length || 0;
            const servicesCount = ob?.serviceSelections?.length || 0;
            const templatesCount = ob?.templateSelections?.length || 0;

            return (
              <div
                key={agency.id}
                className={`relative bg-surface rounded-2xl p-6 border transition-all ${
                  isCurrent
                    ? 'border-primary ring-2 ring-primary/20 shadow-md'
                    : 'border-border hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shadow-sm shrink-0 ${
                        isCompleted
                          ? 'bg-gradient-to-tr from-emerald-500 to-teal-600'
                          : 'bg-gradient-to-tr from-indigo-500 to-purple-600'
                      }`}
                    >
                      {(ob?.agencyName || agency.name).slice(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <h3 className="text-base font-bold text-textPrimary truncate">
                        {ob?.agencyName || agency.name}
                      </h3>
                      <p className="text-xs text-textSecondary flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-primary">
                          {ob?.agencyType?.replace('_', ' ') || 'SOFTWARE DEVELOPMENT'}
                        </span>
                        <span>•</span>
                        <span className="text-[11px]">
                          Created {new Date(agency.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Step {ob?.currentStep || 1}/7</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-slate-50/80 border border-slate-100 text-center mb-5">
                  <div>
                    <p className="text-[10px] text-textSecondary font-medium">Services</p>
                    <p className="text-sm font-bold text-textPrimary">{servicesCount}</p>
                  </div>
                  <div className="border-x border-slate-200/60">
                    <p className="text-[10px] text-textSecondary font-medium">Templates</p>
                    <p className="text-sm font-bold text-textPrimary">{templatesCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-textSecondary font-medium">Configs</p>
                    <p className="text-sm font-bold text-textPrimary">{configsCount}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleDelete(agency.id, ob?.agencyName || agency.name)}
                    title="Delete agency"
                    className="p-2 text-textSecondary hover:text-error hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSelect(agency.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-primary text-white shadow-xs hover:bg-primaryDark'
                        : 'bg-white text-textPrimary border border-slate-200 hover:border-primary hover:text-primary shadow-2xs'
                    }`}
                  >
                    <span>{isCurrent ? 'Continue Onboarding' : 'Switch to this Agency'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal to Create Agency Profile ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/80 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-primary flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-textPrimary">Create Agency Profile</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-textSecondary hover:text-textPrimary text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-textPrimary mb-1">Agency Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Studio, Nexus Digital"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-textPrimary mb-1">Agency Archetype</label>
                <select
                  value={agencyType}
                  onChange={(e) => setAgencyType(e.target.value as AgencyType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="SOFTWARE_DEVELOPMENT">Software Development</option>
                  <option value="DIGITAL_MARKETING">Digital Marketing</option>
                  <option value="HYBRID">Hybrid (Software + Marketing)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-textSecondary hover:text-textPrimary rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !name.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primaryDark rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {creating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                  <span>Launch Onboarding</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
