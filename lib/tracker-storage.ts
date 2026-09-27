export const TRACKER_STORAGE_KEY = "fpt_tracker_v1";

export const DEFAULT_TARGET = 150;
const HISTORY_DAYS = 30;

export type Meal = "Breakfast" | "Lunch" | "Dinner" | "Snacks";
export const MEALS: Meal[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export interface TrackerEntry {
  id: string;
  name: string;
  protein: number;
  meal: Meal;
}

export interface DaySummary {
  date: string; // YYYY-MM-DD, local time
  total: number;
  target: number;
}

export interface TrackerState {
  date: string;
  target: number;
  entries: TrackerEntry[];
  history: DaySummary[]; // most recent first, excludes `date`
}

// localStorage can throw (blocked storage, some private modes, quota) — the
// tracker should keep working in memory rather than crash the page.
export function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function todayKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function emptyState(): TrackerState {
  return { date: todayKey(), target: DEFAULT_TARGET, entries: [], history: [] };
}

function isEntry(e: unknown): e is TrackerEntry {
  if (!e || typeof e !== "object") return false;
  const x = e as Record<string, unknown>;
  return (
    typeof x.id === "string" &&
    typeof x.name === "string" &&
    typeof x.protein === "number" &&
    Number.isFinite(x.protein) &&
    MEALS.includes(x.meal as Meal)
  );
}

function isSummary(s: unknown): s is DaySummary {
  if (!s || typeof s !== "object") return false;
  const x = s as Record<string, unknown>;
  return typeof x.date === "string" && typeof x.total === "number" && typeof x.target === "number";
}

export function entriesTotal(entries: TrackerEntry[]): number {
  return entries.reduce((sum, e) => sum + e.protein, 0);
}

// Reads saved state and rolls it over to today if the stored day has ended:
// yesterday's entries are summarised into history and today starts empty
// (target is kept). Pre-history saves (no `date`) are treated as today so
// existing users don't lose what they've logged.
export function loadTrackerState(): TrackerState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = safeGetItem(TRACKER_STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    const today = todayKey();
    const target =
      typeof parsed.target === "number" && parsed.target > 0 ? parsed.target : DEFAULT_TARGET;
    const entries: TrackerEntry[] = Array.isArray(parsed.entries)
      ? parsed.entries.filter(isEntry)
      : [];
    let history: DaySummary[] = Array.isArray(parsed.history)
      ? parsed.history.filter(isSummary)
      : [];
    const date = typeof parsed.date === "string" ? parsed.date : today;

    if (date === today) return { date, target, entries, history };

    if (entries.length > 0) {
      history = [{ date, total: entriesTotal(entries), target }, ...history];
    }
    return {
      date: today,
      target,
      entries: [],
      history: history.slice(0, HISTORY_DAYS),
    };
  } catch {
    return emptyState();
  }
}

export function saveTrackerState(state: TrackerState) {
  if (typeof window === "undefined") return;
  safeSetItem(TRACKER_STORAGE_KEY, JSON.stringify(state));
}

// Used by the calculator page's "use this as my target" action — updates
// just the target, keeps any entries already logged today.
export function setTrackerTarget(newTarget: number) {
  if (typeof window === "undefined") return;
  saveTrackerState({ ...loadTrackerState(), target: newTarget });
}

// crypto.randomUUID is missing on older Safari and on non-HTTPS origins
// (e.g. testing on a phone over the LAN).
export function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function defaultMealForTime(now = new Date()): Meal {
  const h = now.getHours();
  if (h < 11) return "Breakfast";
  if (h < 15) return "Lunch";
  if (h >= 17 && h < 21) return "Dinner";
  return "Snacks";
}
