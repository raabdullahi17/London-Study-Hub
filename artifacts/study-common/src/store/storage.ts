// =============================================================
// Safe localStorage helpers. Never throw: return a result object
// so the UI can surface the error (private mode, quota, bad JSON).
// =============================================================
import type { AppState } from "./types";

export const STORAGE_KEY = "study-common:demo:v1";

export type StorageResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function loadState(): StorageResult<AppState | null> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ok: true, value: null };
    const parsed = JSON.parse(raw) as AppState;
    if (parsed?.version !== 1) return { ok: false, error: "Saved data was from an older version and was ignored." };
    return { ok: true, value: parsed };
  } catch (e) {
    return { ok: false, error: `Could not read saved data: ${(e as Error).message}` };
  }
}

export function saveState(state: AppState): StorageResult<true> {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true, value: true };
  } catch (e) {
    return { ok: false, error: `Could not save to this browser: ${(e as Error).message}` };
  }
}

export function clearState(): StorageResult<true> {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return { ok: true, value: true };
  } catch (e) {
    return { ok: false, error: `Could not clear saved data: ${(e as Error).message}` };
  }
}
