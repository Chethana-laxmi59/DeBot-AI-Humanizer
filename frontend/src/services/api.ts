import type { HealthResponse, ModeInfo, RewriteResponse, SamplePreset, WritingMode, LanguageOption, User, AuthResponse, SavedCloudDraft } from '../types';

export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('debot_custom_api_base');
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }

  const raw = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  if (raw) {
    return raw && !raw.startsWith('http://') && !raw.startsWith('https://') ? `https://${raw}` : raw;
  }

  // Detect Capacitor native platform or mobile webview
  const isNative = typeof window !== 'undefined' && (
    (window as any).Capacitor?.isNativePlatform?.() ||
    window.location.protocol === 'capacitor:' ||
    (window.location.hostname === 'localhost' && window.location.port === '')
  );

  if (isNative) {
    return 'https://debot-ai-humanizer.onrender.com';
  }

  return '';
}

export function setCustomApiBase(url: string): void {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      const clean = url.trim().replace(/\/+$/, '');
      const full = clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
      localStorage.setItem('debot_custom_api_base', full);
    } else {
      localStorage.removeItem('debot_custom_api_base');
    }
  }
}

const API_BASE = {
  toString: () => getApiBase(),
};

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Health check failed' }));
      throw new ApiError(res.status, err.detail || 'Health check failed');
    }
    return await res.json();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Unable to connect to DEBOT backend service. Is the server running?');
  }
}

export async function fetchModes(): Promise<ModeInfo[]> {
  try {
    const res = await fetch(`${API_BASE}/api/modes`);
    if (!res.ok) throw new ApiError(res.status, 'Failed to fetch modes');
    return await res.json();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Could not load writing modes');
  }
}

export async function fetchLanguages(): Promise<LanguageOption[]> {
  try {
    const res = await fetch(`${API_BASE}/api/languages`);
    if (!res.ok) throw new ApiError(res.status, 'Failed to fetch languages');
    return await res.json();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    return [{ code: 'en', name: 'English' }];
  }
}

export async function fetchSamples(): Promise<Record<string, SamplePreset>> {
  try {
    const res = await fetch(`${API_BASE}/api/samples`);
    if (!res.ok) throw new ApiError(res.status, 'Failed to load sample presets');
    return await res.json();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Failed to retrieve sample presets');
  }
}

export async function requestRewrite(params: {
  text: string;
  mode: WritingMode;
  language?: string;
  custom_instructions?: string;
}): Promise<RewriteResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/rewrite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: params.text,
        mode: params.mode,
        language: params.language || 'en',
        custom_instructions: params.custom_instructions || null,
      }),
    });

    const data = await res.json().catch(() => ({ detail: 'Failed to parse response' }));

    if (!res.ok) {
      throw new ApiError(res.status, data.detail || `Server error (${res.status})`);
    }

    return data as RewriteResponse;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, error.message || 'Network connection failed while reaching DEBOT API.');
  }
}

export async function synthesizeSpeech(text: string, language: string): Promise<Blob | null> {
  try {
    const res = await fetch(`${API_BASE}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        language,
      }),
    });

    if (!res.ok) {
      return null;
    }

    return await res.blob();
  } catch {
    return null;
  }
}

export async function registerUser(payload: {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({ detail: 'Registration failed' }));
  if (!res.ok) {
    throw new ApiError(res.status, data.detail || 'Registration failed');
  }
  return data as AuthResponse;
}

export async function loginUser(payload: {
  username_or_email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({ detail: 'Login failed' }));
  if (!res.ok) {
    throw new ApiError(res.status, data.detail || 'Login failed');
  }
  return data as AuthResponse;
}

export async function fetchCurrentUser(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new ApiError(res.status, 'Session expired');
  }
  return await res.json();
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' }).catch(() => {});
}

export async function saveUserDraftToCloud(
  draft: {
    original_text: string;
    rewritten_text: string;
    mode: string;
    language: string;
    change_summary?: string;
    preservation_score?: number;
  },
  token: string
): Promise<SavedCloudDraft> {
  const res = await fetch(`${API_BASE}/api/user/saved-drafts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(draft),
  });
  if (!res.ok) {
    throw new ApiError(res.status, 'Failed to save draft to database');
  }
  return await res.json();
}

export async function fetchUserSavedDrafts(token: string): Promise<SavedCloudDraft[]> {
  const res = await fetch(`${API_BASE}/api/user/saved-drafts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    return [];
  }
  return await res.json();
}

export async function deleteUserSavedDraft(draftId: number, token: string): Promise<void> {
  await fetch(`${API_BASE}/api/user/saved-drafts/${draftId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
