export type AgencyType =
  | 'SOFTWARE_DEVELOPMENT'
  | 'DIGITAL_MARKETING'
  | 'HYBRID';

export type OnboardingStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface AgencyOnboardingState {
  id: string;
  agencyId: string;
  agencyName: string;
  agencyType: AgencyType;
  status: OnboardingStatus;
  currentStep: number;
  activatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  serviceSelections: Array<{
    id: string;
    agencyId: string;
    onboardingId: string;
    serviceName: string;
    createdAt: string;
  }>;
  templateSelections: Array<{
    id: string;
    agencyId: string;
    onboardingId: string;
    templateId: string;
    createdAt: string;
    template: WorkspaceTemplate;
  }>;
  generatedConfigs?: GeneratedWorkspaceConfig[];
}

export interface WorkspaceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  agencyType: AgencyType | null;
  version: number;
  isActive: boolean;
  configurationData: {
    pipeline?: {
      name: string;
      stages: Array<{ id: string; label: string; color: string }>;
    };
    taskChecklists?: Array<{
      title: string;
      items: string[];
    }>;
    defaultRoles?: string[];
  };
}

export interface WorkspacePreviewData {
  agencyName: string;
  agencyType: AgencyType;
  selectedServices: string[];
  preview: {
    totalPipelines: number;
    totalTaskChecklists: number;
    totalProjectTemplates: number;
    pipelines: Array<{
      name: string;
      stages: Array<{ id: string; label: string; color: string }>;
      sourceTemplate: string;
    }>;
    taskChecklists: Array<{
      title: string;
      items: string[];
      sourceTemplate: string;
    }>;
    projectTemplates: Array<{
      name: string;
      category: string;
      defaultRoles: string[];
    }>;
    marketingWorkflows: Array<{
      name: string;
      details: any[];
    }>;
  };
}

export interface GeneratedWorkspaceConfig {
  id: string;
  agencyId: string;
  onboardingId: string;
  configType: string;
  name: string;
  configData: Record<string, any>;
  sourceTemplateId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivationResponse {
  message: string;
  status: OnboardingStatus;
  activatedAt: string;
  configs: GeneratedWorkspaceConfig[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  code?: string;
  details?: Record<string, any>;
}

