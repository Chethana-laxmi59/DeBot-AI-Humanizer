import type { HealthResponse, ModeInfo, RewriteResponse, SamplePreset, WritingMode, LanguageOption } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

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
