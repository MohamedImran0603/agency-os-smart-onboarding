import {
  AgencyOnboardingState,
  WorkspaceTemplate,
  WorkspacePreviewData,
  ActivationResponse,
  ApiResponse,
  AgencyType,
  AgencyItem,
} from '../types/onboarding';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
export const DEFAULT_AGENCY_ID =
  process.env.NEXT_PUBLIC_DEMO_AGENCY_ID || 'a0000000-0000-0000-0000-000000000001';

export function getActiveAgencyId(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('agency_os_active_agency_id');
    if (saved && saved.trim() !== '') {
      return saved.trim();
    }
  }
  return DEFAULT_AGENCY_ID;
}

export function setActiveAgencyId(agencyId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('agency_os_active_agency_id', agencyId);
    window.dispatchEvent(new CustomEvent('agency-changed', { detail: { agencyId } }));
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const agencyId = getActiveAgencyId();
  const headers = {
    'Content-Type': 'application/json',
    'x-agency-id': agencyId,
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

export async function resetOnboarding(): Promise<AgencyOnboardingState> {
  return request<AgencyOnboardingState>('/onboarding/reset', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function getTemplates(): Promise<WorkspaceTemplate[]> {
  return request<WorkspaceTemplate[]>('/templates');
}

export async function getAllAgencies(): Promise<AgencyItem[]> {
  return request<AgencyItem[]>('/agencies');
}

export async function createAgencyDemo(data: {
  name: string;
  agencyType?: AgencyType;
}): Promise<AgencyItem> {
  return request<AgencyItem>('/agencies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteAgencyDemo(id: string): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(`/agencies/${id}`, {
    method: 'DELETE',
  });
}


