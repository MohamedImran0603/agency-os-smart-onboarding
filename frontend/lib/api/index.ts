// ─── API Client ────────────────────────────────────────────────────────────────
// Typed HTTP client for communicating with the NestJS backend.
// All fetch calls go through this wrapper for consistent error handling,
// auth headers, and base URL management.

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Attach JWT from localStorage when running in browser context.
  // Phase 3 will replace this with an httpOnly cookie approach.
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      (defaultHeaders as Record<string, string>)['Authorization'] =
        `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as Partial<ApiError>;
    const error: ApiError = {
      message: errorBody.message ?? 'An unexpected error occurred.',
      statusCode: response.status,
      error: errorBody.error,
    };
    throw error;
  }

  return response.json() as Promise<T>;
}

// ── HTTP method helpers ───────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(endpoint: string, init?: RequestInit) =>
    apiFetch<T>(endpoint, { method: 'GET', ...init }),

  post: <T>(endpoint: string, body: unknown, init?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    }),

  patch: <T>(endpoint: string, body: unknown, init?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...init,
    }),

  put: <T>(endpoint: string, body: unknown, init?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...init,
    }),

  delete: <T>(endpoint: string, init?: RequestInit) =>
    apiFetch<T>(endpoint, { method: 'DELETE', ...init }),
};
