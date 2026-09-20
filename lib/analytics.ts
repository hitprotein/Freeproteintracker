// Fires a GA4 custom event if analytics is loaded; no-ops safely otherwise
// (e.g. during local dev without NEXT_PUBLIC_GA_ID set, or if a user has
// an ad blocker). Event names match the brief's spec exactly so Search
// Console / GA4 reporting lines up with what was actually asked for.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "tracker_started"
  | "protein_calculator_completed"
  | "protein_goal_calculated"
  | "hitprotein_cta_clicked"
  | "app_store_clicked";

export function trackEvent(event: AnalyticsEvent, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}
