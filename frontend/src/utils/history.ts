import type { RevisionItem } from '../types';

const STORAGE_KEY = 'debot_revision_history_v1';
const MAX_HISTORY_ITEMS = 20;

export function loadRevisions(): RevisionItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load revision history from localStorage:', err);
    return [];
  }
}

export function saveRevision(item: Omit<RevisionItem, 'id' | 'timestamp'>): RevisionItem[] {
  try {
    const existing = loadRevisions();
    const newItem: RevisionItem = {
      ...item,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };

    const updated = [newItem, ...existing].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save revision to localStorage:', err);
    return [];
  }
}

export function deleteRevision(id: string): RevisionItem[] {
  try {
    const existing = loadRevisions();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete revision:', err);
    return [];
  }
}

export function clearAllRevisions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear revisions:', err);
  }
}
