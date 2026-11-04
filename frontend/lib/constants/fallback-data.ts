import { WorkspaceTemplate, WorkspacePreviewData } from '../types/onboarding';

export const FALLBACK_TEMPLATES: WorkspaceTemplate[] = [
  {
    id: 't0000000-0000-0000-0000-000000000001',
    name: 'Web Application Delivery Pipeline',
    description: 'Sprint-based agile engineering workflow with automated CI/CD staging gates and code review criteria.',
    category: 'SOFTWARE_PIPELINE',
    agencyType: 'SOFTWARE_DEVELOPMENT',
    version: 1,
    isActive: true,
    configurationData: {
      pipeline: { stages: ['Backlog', 'Design Spec', 'In Development', 'Code Review', 'QA Testing', 'Production Release'] },
      defaultRoles: ['Lead Architect', 'Frontend Engineer', 'Backend Engineer'],
    },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000002',
    name: 'SaaS Platform Development Engine',
    description: 'Multi-tenant subscription architecture blueprint with automated billing milestones and security audit checklist.',
    category: 'SOFTWARE_SAAS',
    agencyType: 'SOFTWARE_DEVELOPMENT',
    version: 1,
    isActive: true,
    configurationData: {
      pipeline: { stages: ['Architecture Planning', 'Auth & Multi-Tenancy', 'Core Modules', 'Billing Integration', 'Security Review', 'GA Launch'] },
      defaultRoles: ['Tech Lead', 'Security Specialist', 'Full-Stack Developer'],
    },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000003',
    name: 'Retainer & Website Maintenance Ops',
    description: 'Continuous maintenance, security patching, uptime monitoring, and SLA incident response management.',
    category: 'SOFTWARE_MAINTENANCE',
    agencyType: 'SOFTWARE_DEVELOPMENT',
    version: 1,
    isActive: true,
    configurationData: {
      pipeline: { stages: ['Triage', 'Investigation', 'Patching', 'Staging Verification', 'Deploy & Verify'] },
      defaultRoles: ['Support Engineer', 'Site Reliability Engineer'],
    },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000004',
    name: 'Paid Advertising Performance Engine',
    description: 'Cross-channel paid acquisition operations covering Meta Ads, Google PPC, and LinkedIn B2B campaigns.',
    category: 'MARKETING_PAID_MEDIA',
    agencyType: 'DIGITAL_MARKETING',
    version: 1,
    isActive: true,
    configurationData: {
      pipeline: { stages: ['Audience Research', 'Creative Production', 'Ad Setup', 'A/B Testing', 'Scaling Phase', 'Bi-Weekly Reporting'] },
      defaultRoles: ['Media Buyer', 'Copywriter', 'Creative Strategist', 'Analytics Lead'],
    },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000005',
    name: 'Comprehensive SEO & Content Pipeline',
    description: 'Organic search strategy covering keyword cluster research, technical site audits, and editorial calendars.',
    category: 'MARKETING_SEO',
    agencyType: 'DIGITAL_MARKETING',
    version: 1,
    isActive: true,
    configurationData: {
      pipeline: { stages: ['Technical Audit', 'Keyword Strategy', 'Content Briefs', 'Drafting & Review', 'On-Page Optimization', 'Backlink Outreach'] },
      defaultRoles: ['SEO Strategist', 'Content Writer', 'Technical SEO Lead'],
    },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000006',
    name: 'Brand Identity & Design System Kit',
    description: 'End-to-end brand identity creation covering logo exploration, design tokens, asset guidelines, and collateral.',
    category: 'MARKETING_BRANDING',
    agencyType: 'DIGITAL_MARKETING',
    version: 1,
    isActive: true,
    configurationData: {
      pipeline: { stages: ['Brand Discovery', 'Moodboards', 'Logo Explorations', 'Typography & Palette', 'Design System Kit', 'Brand Guide Handover'] },
      defaultRoles: ['Creative Director', 'Brand Designer', 'Art Director'],
    },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000007',
    name: 'Full-Service Growth Retainer Framework',
    description: 'Balanced hybrid workflow combining dedicated development sprints with recurring monthly marketing retainers.',
    category: 'HYBRID_OPERATIONS',
    agencyType: 'HYBRID',
    version: 1,
    isActive: true,
    configurationData: {
      pipeline: { stages: ['Client Discovery', 'Quarterly Roadmap', 'Sprint Execution', 'Deliverable Review', 'Monthly Business Review'] },
      defaultRoles: ['Account Director', 'Technical Lead', 'Growth Strategist'],
    },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000008',
    name: 'Cross-Functional Client Portal Framework',
    description: 'Shared client collaboration portal blueprint providing transparency into roadmaps, deliverables, and approvals.',
    category: 'HYBRID_COLLABORATION',
    agencyType: null,
    version: 1,
    isActive: true,
    configurationData: {
      pipeline: { stages: ['Portal Setup', 'Asset Library', 'Weekly Updates', 'Approval Gateways', 'Quarterly Review'] },
      defaultRoles: ['Engagement Lead', 'Client Success Manager', 'Delivery Director'],
    },
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
  },
];

export const FALLBACK_PREVIEW: WorkspacePreviewData = {
  agencyName: 'Neirah Tech Agency',
  agencyType: 'HYBRID',
  selectedServices: ['Web Development', 'Paid Advertising', 'Full-Service Retainer'],
  preview: {
    pipelines: [
      {
        name: 'Web Application Delivery Pipeline',
        stages: ['Backlog', 'Design Spec', 'In Development', 'Code Review', 'QA Testing', 'Production Release'],
      },
      {
        name: 'Paid Media Campaign Pipeline',
        stages: ['Audience Research', 'Creative Production', 'Ad Setup', 'A/B Testing', 'Scaling Phase', 'Bi-Weekly Reporting'],
      },
      {
        name: 'Full-Service Retainer Framework',
        stages: ['Client Discovery', 'Quarterly Roadmap', 'Sprint Execution', 'Deliverable Review', 'Monthly Business Review'],
      },
    ],
    projectTemplates: [
      {
        name: 'Web Application Architecture',
        category: 'SOFTWARE_PIPELINE',
        defaultRoles: ['Lead Architect', 'Frontend Engineer', 'Backend Engineer'],
      },
      {
        name: 'Paid Advertising Engine',
        category: 'MARKETING_PAID_MEDIA',
        defaultRoles: ['Media Buyer', 'Copywriter', 'Creative Strategist', 'Analytics Lead'],
      },
    ],
    marketingWorkflows: [
      {
        name: 'Paid Advertising Performance Loop',
        details: ['Audience Research', 'Creative Production', 'Ad Setup', 'A/B Testing', 'Scaling Phase'],
      },
    ],
  },
  summary: {
    totalPipelines: 3,
    totalProjects: 2,
    totalMarketingWorkflows: 1,
  },
};
