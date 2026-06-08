import { GameState } from "./types";

const AUTOSAVE_KEY = "jalan_hidup_autosave_v1";

export function autoSave(state: GameState) {
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ savedAt: Date.now(), state }));
}

export function loadAutoSave(): GameState | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw).state;
  } catch { return null; }
}

export function clearAutoSave() {
  localStorage.removeItem(AUTOSAVE_KEY);
}
