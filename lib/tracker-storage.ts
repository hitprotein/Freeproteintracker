export const TRACKER_STORAGE_KEY = "fpt_tracker_v1";

export interface TrackerEntry {
  id: string;
  name: string;
  protein: number;
  meal: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
}

export interface TrackerState {
  target: number;
  entries: TrackerEntry[];
}

export function loadTrackerState(): TrackerState {
  if (typeof window === "undefined") return { target: 150, entries: [] };
  try {
    const raw = window.localStorage.getItem(TRACKER_STORAGE_KEY);
    if (!raw) return { target: 150, entries: [] };
    const parsed = JSON.parse(raw);
    return { target: parsed.target ?? 150, entries: parsed.entries ?? [] };
  } catch {
    return { target: 150, entries: [] };
  }
}

// Used by the calculator page's "use this as my target" action — updates
// just the target, keeps any entries already logged today.
export function setTrackerTarget(newTarget: number) {
  if (typeof window === "undefined") return;
  const current = loadTrackerState();
  window.localStorage.setItem(
    TRACKER_STORAGE_KEY,
    JSON.stringify({ target: newTarget, entries: current.entries })
  );
}
