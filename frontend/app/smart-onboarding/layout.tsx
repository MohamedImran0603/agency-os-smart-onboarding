'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SmartOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
      {/* ─── Top Bar (Glassmorphic) ────────────────────────────────────────── */}
      <header className="h-16 glass-nav sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-all">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-xl text-textSecondary hover:bg-white/80 border border-transparent hover:border-slate-200 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/smart-onboarding" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-textPrimary tracking-tight leading-none flex items-center gap-1.5">
                Agency OS <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">v2.0</span>
              </span>
              <span className="text-[10px] text-textSecondary font-medium">Smart Onboarding Suite</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/templates"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primaryDark px-3.5 py-2 rounded-xl glass-panel hover:bg-white transition-all shadow-2xs hover:shadow-sm"
          >
            <span>📋</span>
            <span>Template Catalog</span>
          </Link>

          {/* User Profile Card */}
          <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200/80">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/60 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              ✨ NT
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-textPrimary leading-none flex items-center gap-1">
                Neirah Tech <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </p>
              <p className="text-[10px] text-textSecondary leading-none mt-1">Tenant: Admin Demo</p>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Shell Body: Sidebar + Main Content ────────────────────────────── */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 md:px-8 py-6 gap-8">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-30 w-64 glass-panel border-r border-white/80 p-5 space-y-6 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-60 md:rounded-2xl md:p-4 md:shadow-xs ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <p className="text-[11px] font-bold text-textSecondary/80 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
              <span>Onboarding</span>
              <span className="text-xs">🚀</span>
            </p>
            <nav className="space-y-1">
              <Link
                href="/smart-onboarding"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 text-sm font-bold rounded-xl bg-blue-50/90 text-primary border border-blue-200/60 shadow-xs"
              >
                <span>⚡</span>
                <span>Guided Wizard</span>
              </Link>

              <Link
                href="/templates"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 text-sm font-medium rounded-xl text-textSecondary hover:bg-white/80 hover:text-textPrimary transition-all"
              >
                <span>📦</span>
                <span>Template Library</span>
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-200/60">
            <p className="text-[11px] font-bold text-textSecondary/80 uppercase tracking-wider px-3 mb-2">
              Agency OS Modules
            </p>
            <nav className="space-y-1 text-sm text-textSecondary/60 select-none">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl cursor-not-allowed hover:bg-slate-50/50">
                <span>📊</span>
                <span>Pipelines & Sprints</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl cursor-not-allowed hover:bg-slate-50/50">
                <span>📁</span>
                <span>Client Projects</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl cursor-not-allowed hover:bg-slate-50/50">
                <span>📈</span>
                <span>Campaign Hub</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl cursor-not-allowed hover:bg-slate-50/50">
                <span>⚙️</span>
                <span>Tenant Isolation</span>
              </div>
            </nav>
          </div>

          {/* Quick Help Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-100/60 text-xs text-textSecondary space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-textPrimary">
              <span>💡</span>
              <span>Need Assistance?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Section 7 Smart Onboarding auto-provisions tenant configs atomically upon activation.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}
