import {
  AgencyOnboardingState,
  WorkspaceTemplate,
  WorkspacePreviewData,
  ActivationResponse,
  ApiResponse,
  AgencyType,
} from '../types/onboarding';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const DEMO_AGENCY_ID =
  process.env.NEXT_PUBLIC_DEMO_AGENCY_ID || 'a0000000-0000-0000-0000-000000000001';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-agency-id': DEMO_AGENCY_ID,
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });
  const payload: ApiResponse<T> = await res.json();

  if (!res.ok || payload.success === false) {
    const errorMsg = payload.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return payload.data;
}

export async function getOnboardingState(): Promise<AgencyOnboardingState> {
  return request<AgencyOnboardingState>('/onboarding');
}

export async function saveProfile(data: {
  agencyName: string;
  agencyType: AgencyType;
}): Promise<AgencyOnboardingState> {
  return request<AgencyOnboardingState>('/onboarding/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function saveServices(data: {
  services: string[];
}): Promise<AgencyOnboardingState> {
  return request<AgencyOnboardingState>('/onboarding/services', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getRecommendedTemplates(): Promise<WorkspaceTemplate[]> {
  return request<WorkspaceTemplate[]>('/onboarding/templates');
}

export async function saveTemplateSelections(data: {
  templateIds: string[];
}): Promise<AgencyOnboardingState> {
  return request<AgencyOnboardingState>('/onboarding/templates', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function generatePreview(): Promise<WorkspacePreviewData> {
  return request<WorkspacePreviewData>('/onboarding/preview', {
    method: 'POST',
  });
}

export async function activateOnboarding(): Promise<ActivationResponse> {
  return request<ActivationResponse>('/onboarding/activate', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function getTemplates(): Promise<WorkspaceTemplate[]> {
  return request<WorkspaceTemplate[]>('/templates');
}

