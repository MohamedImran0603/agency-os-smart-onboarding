import { WorkspaceTemplate, WorkspacePreviewData } from '../types/onboarding';

const makeStages = (labels: string[]) =>
  labels.map((label, i) => ({
    id: `stage-${i + 1}`,
    label,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'][i % 6] || '#3B82F6',
  }));

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
      pipeline: {
        name: 'Web Application Pipeline',
        stages: makeStages(['Backlog', 'Design Spec', 'In Development', 'Code Review', 'QA Testing', 'Production Release']),
      },
      defaultRoles: ['Lead Architect', 'Frontend Engineer', 'Backend Engineer'],
    },
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
      pipeline: {
        name: 'SaaS Engine Pipeline',
        stages: makeStages(['Architecture Planning', 'Auth & Multi-Tenancy', 'Core Modules', 'Billing Integration', 'Security Review', 'GA Launch']),
      },
      defaultRoles: ['Tech Lead', 'Security Specialist', 'Full-Stack Developer'],
    },
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
      pipeline: {
        name: 'Maintenance Pipeline',
        stages: makeStages(['Triage', 'Investigation', 'Patching', 'Staging Verification', 'Deploy & Verify']),
      },
      defaultRoles: ['Support Engineer', 'Site Reliability Engineer'],
    },
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
      pipeline: {
        name: 'Paid Ads Pipeline',
        stages: makeStages(['Audience Research', 'Creative Production', 'Ad Setup', 'A/B Testing', 'Scaling Phase', 'Bi-Weekly Reporting']),
      },
      defaultRoles: ['Media Buyer', 'Copywriter', 'Creative Strategist', 'Analytics Lead'],
    },
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
      pipeline: {
        name: 'SEO Pipeline',
        stages: makeStages(['Technical Audit', 'Keyword Strategy', 'Content Briefs', 'Drafting & Review', 'On-Page Optimization', 'Backlink Outreach']),
      },
      defaultRoles: ['SEO Strategist', 'Content Writer', 'Technical SEO Lead'],
    },
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
      pipeline: {
        name: 'Branding Pipeline',
        stages: makeStages(['Brand Discovery', 'Moodboards', 'Logo Explorations', 'Typography & Palette', 'Design System Kit', 'Brand Guide Handover']),
      },
      defaultRoles: ['Creative Director', 'Brand Designer', 'Art Director'],
    },
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
      pipeline: {
        name: 'Growth Retainer Pipeline',
        stages: makeStages(['Client Discovery', 'Quarterly Roadmap', 'Sprint Execution', 'Deliverable Review', 'Monthly Business Review']),
      },
      defaultRoles: ['Account Director', 'Technical Lead', 'Growth Strategist'],
    },
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
      pipeline: {
        name: 'Client Portal Pipeline',
        stages: makeStages(['Portal Setup', 'Asset Library', 'Weekly Updates', 'Approval Gateways', 'Quarterly Review']),
      },
      defaultRoles: ['Engagement Lead', 'Client Success Manager', 'Delivery Director'],
    },
  },
];

export const FALLBACK_PREVIEW: WorkspacePreviewData = {
  agencyName: 'Neirah Tech Agency',
  agencyType: 'HYBRID',
  selectedServices: ['Web Development', 'Paid Advertising', 'Full-Service Retainer'],
  preview: {
    totalPipelines: 3,
    totalTaskChecklists: 0,
    totalProjectTemplates: 2,
    pipelines: [
      {
        name: 'Web Application Delivery Pipeline',
        stages: makeStages(['Backlog', 'Design Spec', 'In Development', 'Code Review', 'QA Testing', 'Production Release']),
        sourceTemplate: 'Web Application Delivery Pipeline',
      },
      {
        name: 'Paid Media Campaign Pipeline',
        stages: makeStages(['Audience Research', 'Creative Production', 'Ad Setup', 'A/B Testing', 'Scaling Phase', 'Bi-Weekly Reporting']),
        sourceTemplate: 'Paid Advertising Performance Engine',
      },
      {
        name: 'Full-Service Retainer Framework',
        stages: makeStages(['Client Discovery', 'Quarterly Roadmap', 'Sprint Execution', 'Deliverable Review', 'Monthly Business Review']),
        sourceTemplate: 'Full-Service Growth Retainer Framework',
      },
    ],
    taskChecklists: [],
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
};
