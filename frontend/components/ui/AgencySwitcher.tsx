'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Check,
  Plus,
  RefreshCw,
  FolderPlus,
  ArrowRight,
} from 'lucide-react';
import {
  getAllAgencies,
  getActiveAgencyId,
  setActiveAgencyId,
  createAgencyDemo,
} from '../../lib/api/onboarding';
import { AgencyItem, AgencyType } from '../../lib/types/onboarding';

export function AgencySwitcher() {
  const [agencies, setAgencies] = useState<AgencyItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyType, setNewAgencyType] = useState<AgencyType>('SOFTWARE_DEVELOPMENT');
  const [creating, setCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadAgencies = async () => {
    try {
      setLoading(true);
      const list = await getAllAgencies();
      setAgencies(list);
    } catch (err) {
      console.warn('Could not load agencies list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const current = getActiveAgencyId();
    setActiveId(current);
    loadAgencies();

    const handleAgencyChanged = (e: any) => {
      const newId = e.detail?.agencyId || getActiveAgencyId();
      setActiveId(newId);
      loadAgencies();
    };

    window.addEventListener('agency-changed', handleAgencyChanged);
    return () => window.removeEventListener('agency-changed', handleAgencyChanged);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAgency = agencies.find((a) => a.id === activeId);
  const activeOnboarding = activeAgency?.onboardings?.[0];
  const activeDisplayName =
    activeOnboarding?.agencyName || activeAgency?.name || 'Demo Agency';

  const handleSelectAgency = (id: string) => {
    setActiveAgencyId(id);
    setActiveId(id);
    setIsOpen(false);
    // Reload page or let reactive components refresh
    window.location.reload();
  };

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName.trim()) return;

    try {
      setCreating(true);
      const created = await createAgencyDemo({
        name: newAgencyName.trim(),
        agencyType: newAgencyType,
      });
      setShowCreateModal(false);
      setNewAgencyName('');
      setActiveAgencyId(created.id);
      setActiveId(created.id);
      window.location.reload();
    } catch (err) {
      alert('Failed to create agency: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Switcher Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/90 border border-slate-200/80 transition-all text-left shadow-2xs group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-xs">
          {activeDisplayName.slice(0, 2).toUpperCase()}
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-textPrimary leading-none group-hover:text-primary transition-colors">
              {activeDisplayName}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[10px] text-textSecondary leading-none mt-1 flex items-center gap-1">
            <span>
              {activeOnboarding?.status === 'COMPLETED'
                ? 'Active Workspace'
                : `Step ${activeOnboarding?.currentStep || 1} • Profile`}
            </span>
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-textSecondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* ── Dropdown Menu ── */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-modal border border-white/80 p-3 shadow-2xl z-50 animate-scale-in">
          <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-textPrimary">Switch Agency Profile</p>
              <p className="text-[10px] text-textSecondary">Select a tenant or spin up a new demo</p>
            </div>
            <button
              onClick={loadAgencies}
              disabled={loading}
              title="Refresh profiles"
              className="p-1 rounded-lg hover:bg-slate-100 text-textSecondary hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {agencies.length === 0 ? (
              <p className="text-xs text-textSecondary py-4 text-center">No agency profiles found.</p>
            ) : (
              agencies.map((agency) => {
                const ob = agency.onboardings?.[0];
                const isSelected = agency.id === activeId;
                const isCompleted = ob?.status === 'COMPLETED';

                return (
                  <button
                    key={agency.id}
                    onClick={() => handleSelectAgency(agency.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50/90 border border-blue-200/80 shadow-xs'
                        : 'hover:bg-white/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        }`}
                      >
                        {(ob?.agencyName || agency.name).slice(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-textPrimary truncate">
                          {ob?.agencyName || agency.name}
                        </p>
                        <p className="text-[10px] text-textSecondary truncate">
                          {ob?.agencyType?.replace('_', ' ') || 'SOFTWARE'} •{' '}
                          {isCompleted ? (
                            <span className="text-emerald-600 font-medium">Active</span>
                          ) : (
                            <span className="text-amber-600 font-medium">
                              Step {ob?.currentStep || 1}/7
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Create CTA */}
          <div className="mt-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowCreateModal(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create New Agency Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Modal to Create Agency Profile ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/80 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-primary flex items-center justify-center">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-textPrimary">New Agency Profile</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-textSecondary hover:text-textPrimary text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAgency} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-textPrimary mb-1">Agency Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Horizon Digital, Zenith Media"
                  value={newAgencyName}
                  onChange={(e) => setNewAgencyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-textPrimary mb-1">Agency Archetype</label>
                <select
                  value={newAgencyType}
                  onChange={(e) => setNewAgencyType(e.target.value as AgencyType)}
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
                  disabled={creating || !newAgencyName.trim()}
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
