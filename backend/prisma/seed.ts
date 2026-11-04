import { PrismaClient, AgencyType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Agency OS Smart Onboarding...');

  // ─── 1. Seed Stub Agencies ──────────────────────────────────────────────────
  const stubAgencies = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Apex Digital Labs',
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      name: 'Vanguard Growth Partners',
    },
  ];

  console.log('Inserting stub agencies...');
  for (const agency of stubAgencies) {
    await prisma.agency.upsert({
      where: { id: agency.id },
      update: { name: agency.name },
      create: agency,
    });
  }
  console.log(`✅ Seeded ${stubAgencies.length} stub agencies.`);

  // ─── 2. Seed Workspace Templates ───────────────────────────────────────────
  const templates: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    agencyType: AgencyType | null;
    version: number;
    isActive: boolean;
    configurationData: Record<string, unknown>;
  }> = [
    // ── Software Development Templates (3) ──────────────────────────────────
    {
      id: 't0000000-0000-0000-0000-000000000001',
      name: 'Web Application Development',
      description: 'Full-lifecycle web engineering workspace with agile sprints, code review gates, and CI/CD checklists.',
      category: 'SOFTWARE_ENGINEERING',
      agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
      version: 1,
      isActive: true,
      configurationData: {
        pipeline: {
          name: 'Web Application Lifecycle',
          stages: [
            { id: 'discovery', label: 'Architecture & Discovery', color: '#6366F1' },
            { id: 'sprint_planning', label: 'Sprint Backlog', color: '#8B5CF6' },
            { id: 'development', label: 'In Development', color: '#3B82F6' },
            { id: 'code_review', label: 'Code Review & QA', color: '#EC4899' },
            { id: 'staging_uat', label: 'Staging & UAT', color: '#F59E0B' },
            { id: 'production', label: 'Deployed to Production', color: '#10B981' },
          ],
        },
        taskChecklists: [
          {
            title: 'Project Initiation',
            items: [
              'Initialize monorepo with strict TypeScript and ESLint',
              'Set up staging and production CI/CD workflows',
              'Configure database migration strategy and seed test fixtures',
              'Implement authentication middleware and role-based access control',
            ],
          },
          {
            title: 'Pre-Deployment Gate',
            items: [
              'Ensure automated test coverage exceeds 80%',
              'Conduct OWASP top 10 security audit',
              'Run Lighthouse performance and accessibility benchmarks',
              'Verify zero TypeScript compiler and lint errors',
            ],
          },
        ],
        defaultRoles: ['Technical Lead', 'Senior Frontend Engineer', 'Backend Engineer', 'QA Automation Engineer'],
      },
    },
    {
      id: 't0000000-0000-0000-0000-000000000002',
      name: 'SaaS Product Development',
      description: 'Designed for building multi-tenant SaaS platforms with recurring billing, tenant isolation, and telemetry.',
      category: 'PRODUCT_DEVELOPMENT',
      agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
      version: 1,
      isActive: true,
      configurationData: {
        pipeline: {
          name: 'SaaS Delivery Pipeline',
          stages: [
            { id: 'market_validation', label: 'Market & Problem Validation', color: '#4F46E5' },
            { id: 'mvp_scoping', label: 'MVP Scope & Schema Design', color: '#7C3AED' },
            { id: 'core_engine', label: 'Core Product Engine', color: '#2563EB' },
            { id: 'billing_auth', label: 'Auth & Billing Integrations', color: '#DB2777' },
            { id: 'beta_cohort', label: 'Closed Beta Cohort', color: '#D97706' },
            { id: 'general_availability', label: 'General Availability', color: '#059669' },
          ],
        },
        taskChecklists: [
          {
            title: 'Multi-Tenant Architecture',
            items: [
              'Configure schema-level or row-level tenant partitioning',
              'Implement Stripe subscription plans and customer portal',
              'Set up transactional email delivery (Postmark/Resend)',
              'Build in-app onboarding telemetry and analytics funnel',
            ],
          },
        ],
        defaultRoles: ['Product Manager', 'System Architect', 'Full-Stack Engineer', 'DevOps Specialist'],
      },
    },
    {
      id: 't0000000-0000-0000-0000-000000000003',
      name: 'Website Maintenance & Retainer',
      description: 'Systematic SLA-driven workspace for ongoing maintenance, security updates, and performance tuning.',
      category: 'MAINTENANCE_SUPPORT',
      agencyType: AgencyType.SOFTWARE_DEVELOPMENT,
      version: 1,
      isActive: true,
      configurationData: {
        pipeline: {
          name: 'Maintenance Ticket Pipeline',
          stages: [
            { id: 'triage', label: 'Ticket Triage & SLA Evaluation', color: '#EF4444' },
            { id: 'reproduction', label: 'Impact Analysis & Repro', color: '#F97316' },
            { id: 'patching', label: 'Patch Implementation', color: '#3B82F6' },
            { id: 'regression_test', label: 'Automated Regression QA', color: '#8B5CF6' },
            { id: 'client_signoff', label: 'Client Preview & Signoff', color: '#10B981' },
          ],
        },
        taskChecklists: [
          {
            title: 'Monthly Maintenance Routine',
            items: [
              'Perform weekly automated backup verification and recovery dry-run',
              'Audit and update npm/cargo dependencies for vulnerability patches',
              'Check Core Web Vitals and optimize cumulative layout shift (CLS)',
              'Generate monthly uptime and performance SLA summary for client',
            ],
          },
        ],
        defaultRoles: ['Account Manager', 'Support Engineer', 'QA Tester'],
      },
    },

    // ── Digital Marketing Templates (3) ─────────────────────────────────────
    {
      id: 't0000000-0000-0000-0000-000000000004',
      name: 'SEO & Organic Growth Campaign',
      description: 'End-to-end technical SEO, content strategy, link building pipeline, and ranking telemetry.',
      category: 'ORGANIC_MARKETING',
      agencyType: AgencyType.DIGITAL_MARKETING,
      version: 1,
      isActive: true,
      configurationData: {
        pipeline: {
          name: 'SEO Campaign Workflow',
          stages: [
            { id: 'technical_audit', label: 'Deep Technical Audit', color: '#6366F1' },
            { id: 'keyword_mapping', label: 'Keyword Mapping & Intent', color: '#8B5CF6' },
            { id: 'onpage_tuning', label: 'On-Page Optimization', color: '#3B82F6' },
            { id: 'content_engine', label: 'Content Production', color: '#EC4899' },
            { id: 'link_outreach', label: 'Authority Link Building', color: '#F59E0B' },
            { id: 'reporting', label: 'Rankings & Conversion Review', color: '#10B981' },
          ],
        },
        taskChecklists: [
          {
            title: 'SEO Setup & Execution',
            items: [
              'Verify Google Search Console and GA4 conversion tracking',
              'Fix 4xx errors, redirect loops, and missing canonical tags',
              'Implement Schema.org JSON-LD structured data',
              'Generate top 30 target keyword content briefs with TF-IDF analysis',
            ],
          },
        ],
        defaultRoles: ['SEO Strategist', 'Content Writer', 'Link Building Specialist', 'Data Analyst'],
      },
    },
    {
      id: 't0000000-0000-0000-0000-000000000005',
      name: 'Paid Advertising & ROAS Scaling',
      description: 'Paid media acquisition across Google Ads, Meta Ads, and LinkedIn with continuous creative iteration.',
      category: 'PAID_ACQUISITION',
      agencyType: AgencyType.DIGITAL_MARKETING,
      version: 1,
      isActive: true,
      configurationData: {
        pipeline: {
          name: 'Performance Ad Pipeline',
          stages: [
            { id: 'audience_research', label: 'Audience & Offer Architecture', color: '#4F46E5' },
            { id: 'creative_production', label: 'Creative & Copy Batching', color: '#7C3AED' },
            { id: 'tracking_qa', label: 'Tracking & Pixel Verification', color: '#2563EB' },
            { id: 'campaign_launch', label: 'Live Campaign Launch', color: '#DB2777' },
            { id: 'ab_optimization', label: 'A/B Testing & Bid Tuning', color: '#D97706' },
            { id: 'budget_scaling', label: 'Target ROAS Budget Scaling', color: '#059669' },
          ],
        },
        taskChecklists: [
          {
            title: 'Ad Compliance & Setup',
            items: [
              'Deploy Meta Conversions API (CAPI) and Google Enhanced Conversions',
              'Design 5 distinct creative hooks across image and video formats',
              'Set negative keyword lists and exclude unqualified placements',
              'Define daily spend thresholds and automated stop-loss rules',
            ],
          },
        ],
        defaultRoles: ['Media Buyer', 'Copywriter', 'Motion Designer', 'Conversion Specialist'],
      },
    },
    {
      id: 't0000000-0000-0000-0000-000000000006',
      name: 'Brand Identity & Visual System',
      description: 'Comprehensive branding sprint from brand narrative and typography to digital design systems.',
      category: 'CREATIVE_BRANDING',
      agencyType: AgencyType.DIGITAL_MARKETING,
      version: 1,
      isActive: true,
      configurationData: {
        pipeline: {
          name: 'Brand Development Pipeline',
          stages: [
            { id: 'discovery_workshop', label: 'Stakeholder Workshop & Moodboard', color: '#6366F1' },
            { id: 'brand_narrative', label: 'Brand Archetype & Voice', color: '#8B5CF6' },
            { id: 'visual_identity', label: 'Logo & Typography Concepts', color: '#EC4899' },
            { id: 'guidelines_build', label: 'Brand Guidelines Compilation', color: '#F59E0B' },
            { id: 'asset_handoff', label: 'Master Vector & Asset Export', color: '#10B981' },
          ],
        },
        taskChecklists: [
          {
            title: 'Brand Deliverables Checklist',
            items: [
              'Deliver primary, secondary, and mark lockups in SVG and vector format',
              'Complete WCAG AA accessibility color contrast validation',
              'Package typography licenses and digital font hierarchies',
              'Publish comprehensive digital Brand Book (Figma + PDF)',
            ],
          },
        ],
        defaultRoles: ['Creative Director', 'Brand Strategist', 'Graphic Designer', 'UI Designer'],
      },
    },

    // ── Hybrid Templates (2) ────────────────────────────────────────────────
    {
      id: 't0000000-0000-0000-0000-000000000007',
      name: 'Growth Engineering & CRO Funnel',
      description: 'Blends engineering and data marketing: high-converting landing pages, event tracking, and split tests.',
      category: 'GROWTH_ENGINEERING',
      agencyType: AgencyType.HYBRID,
      version: 1,
      isActive: true,
      configurationData: {
        pipeline: {
          name: 'Growth Experiment Sprint',
          stages: [
            { id: 'funnel_audit', label: 'Funnel Drop-off Diagnostic', color: '#4F46E5' },
            { id: 'hypothesis_ice', label: 'ICE Prioritization Matrix', color: '#7C3AED' },
            { id: 'build_landing_page', label: 'Page & Micro-Funnel Build', color: '#2563EB' },
            { id: 'instrument_tracking', label: 'Event Telemetry & Heatmaps', color: '#DB2777' },
            { id: 'run_experiment', label: 'Live Traffic Experiment', color: '#D97706' },
            { id: 'statistical_review', label: 'Winner Promotion & Scaling', color: '#059669' },
          ],
        },
        taskChecklists: [
          {
            title: 'Funnel Optimization Runbook',
            items: [
              'Instrument granular submit, scroll-depth, and click analytics',
              'Build responsive Next.js landing page with sub-second LCP',
              'Run 50/50 server-side traffic split test',
              'Document winning variance impact on customer acquisition cost (CAC)',
            ],
          },
        ],
        defaultRoles: ['Growth Engineer', 'CRO Specialist', 'Full-Stack Developer', 'Data Analyst'],
      },
    },
    {
      id: 't0000000-0000-0000-0000-000000000008',
      name: 'Full-Stack Agency Client Delivery',
      description: 'Universal operating workflow for client onboarding, cross-functional sprints, and milestone reviews.',
      category: 'OPERATIONAL_EXCELLENCE',
      agencyType: AgencyType.HYBRID,
      version: 1,
      isActive: true,
      configurationData: {
        pipeline: {
          name: 'Client Engagement Pipeline',
          stages: [
            { id: 'onboarding_kickoff', label: 'Contract Sign-off & Kickoff', color: '#6366F1' },
            { id: 'sprint_zero', label: 'Sprint Zero & Workspace Provisioning', color: '#8B5CF6' },
            { id: 'active_sprints', label: 'Bi-Weekly Execution Sprints', color: '#3B82F6' },
            { id: 'milestone_demo', label: 'Client Milestone Showcase', color: '#EC4899' },
            { id: 'handoff_retrospective', label: 'Final Delivery & Retention Review', color: '#10B981' },
          ],
        },
        taskChecklists: [
          {
            title: 'Client Engagement Checklist',
            items: [
              'Provision shared Slack connect channel and Notion document portal',
              'Formulate project RACI matrix and weekly meeting cadence',
              'Conduct bi-weekly sprint reviews with recorded video walkthroughs',
              'Send quarterly Net Promoter Score (NPS) feedback survey',
            ],
          },
        ],
        defaultRoles: ['Engagement Lead', 'Client Success Manager', 'Delivery Director'],
      },
    },
  ];

  console.log(`Inserting ${templates.length} workspace templates...`);
  for (const template of templates) {
    await prisma.workspaceTemplate.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        description: template.description,
        category: template.category,
        agencyType: template.agencyType,
        version: template.version,
        isActive: template.isActive,
        configurationData: template.configurationData as Prisma.InputJsonValue,
      },
      create: {
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        agencyType: template.agencyType,
        version: template.version,
        isActive: template.isActive,
        configurationData: template.configurationData as Prisma.InputJsonValue,
      },
    });
  }
  console.log(`✅ Seeded ${templates.length} workspace templates successfully.`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

