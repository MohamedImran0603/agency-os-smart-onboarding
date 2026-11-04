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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* ─── Top Bar ───────────────────────────────────────────────────────── */}
      <header className="h-16 bg-surface border-b border-border sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg text-textSecondary hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/smart-onboarding" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
              A
            </div>
            <span className="font-bold text-lg text-textPrimary tracking-tight">
              Agency OS
            </span>
          </Link>

          <span className="hidden md:inline-block text-border font-light">|</span>
          <span className="hidden md:inline-block text-sm font-medium text-textSecondary">
            Smart Onboarding Wizard
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/templates"
            className="hidden sm:inline-flex text-xs font-semibold text-primary hover:text-primaryDark px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
          >
            Template Catalog
          </Link>

          {/* Notification Icon */}
          <button
            className="p-2 text-textSecondary hover:text-textPrimary rounded-lg hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* User Avatar Placeholder */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-semibold text-textPrimary">
              NT
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-textPrimary leading-none">Neirah Tech</p>
              <p className="text-[10px] text-textSecondary leading-none mt-1">Admin Demo</p>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Shell Body: Sidebar + Main Content ────────────────────────────── */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-20 w-64 bg-surface border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-6">
            <div>
              <p className="text-[11px] font-bold text-textSecondary uppercase tracking-wider px-3 mb-2">
                Onboarding
              </p>
              <nav className="space-y-1">
                <Link
                  href="/smart-onboarding"
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-semibold rounded-lg bg-blue-50 text-primary"
                >
                  <svg className="w-4 h-4 text-primary" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Guided Wizard</span>
                </Link>

                <Link
                  href="/templates"
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-textSecondary hover:bg-slate-50 hover:text-textPrimary transition-colors"
                >
                  <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Template Library</span>
                </Link>
              </nav>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-[11px] font-bold text-textSecondary uppercase tracking-wider px-3 mb-2">
                Agency OS Modules
              </p>
              <nav className="space-y-1 text-sm text-textSecondary/60 select-none">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-not-allowed">
                  <span>💼 Pipeline CRM</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Setup Req</span>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-not-allowed">
                  <span>📁 Project Hub</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Setup Req</span>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-not-allowed">
                  <span>✅ Task Checklists</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Setup Req</span>
                </div>
              </nav>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

