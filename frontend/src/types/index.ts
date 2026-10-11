export type WritingMode =
  | 'standard'
  | 'academic'
  | 'casual'
  | 'professional'
  | 'creative'
  | 'simple';

export interface ModeInfo {
  id: WritingMode;
  label: string;
  tagline: string;
  description: string;
  tone_characteristics: string[];
  sample_preview: string;
}

export interface VerificationResult {
  exact_entities_detected: number;
  exact_entities_preserved: number;
  preservation_score_pct: number;
  missing_entities: string[];
  preserved_entities: string[];
  potential_meaning_changes: string[];
  unsupported_additions: string[];
  review_warnings: string[];
  confidence_statement: string;
}

export interface RewriteResponse {
  original_text: string;
  rewritten_text: string;
  mode: WritingMode;
  language: string;
  change_summary: string;
  word_count_original: number;
  word_count_rewritten: number;
  char_count_original: number;
  char_count_rewritten: number;
  reading_time_seconds_original: number;
  reading_time_seconds_rewritten: number;
  preserved_details: string[];
  verification: VerificationResult;
  is_sample: boolean;
  model_used: string;
}

export interface SamplePreset {
  id: string;
  title: string;
  mode: WritingMode;
  original_text: string;
  rewritten_text: string;
  change_summary: string;
  preserved_details: string[];
  potential_meaning_changes: string[];
  unsupported_additions: string[];
  review_warnings: string[];
}

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  model: string;
  has_api_key: boolean;
  allowed_modes: string[];
  has_elevenlabs_key?: boolean;
  database_type?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SavedCloudDraft {
  id: number;
  user_id: number;
  original_text: string;
  rewritten_text: string;
  mode: WritingMode;
  language: string;
  change_summary?: string | null;
  preservation_score?: number | null;
  created_at: string;
}

export interface LanguageOption {
  code: string;
  name: string;
}

export interface RevisionItem {
  id: string;
  timestamp: number;
  mode: WritingMode;
  original_text: string;
  rewritten_text: string;
  change_summary: string;
  preservation_score: number;
  is_sample: boolean;
}
