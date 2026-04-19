import { AssessmentState } from "./types";

const KEY = "infraai_assessment_bundle_v2";

export function loadState(): AssessmentState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state: AssessmentState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState() {
  localStorage.removeItem(KEY);
}
