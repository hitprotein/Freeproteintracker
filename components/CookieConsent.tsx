"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { safeGetItem, safeSetItem } from "@/lib/tracker-storage";

const CONSENT_KEY = "fpt_cookie_consent";
// Dispatched by the footer's "Cookie settings" link to re-open the banner.
export const OPEN_COOKIE_SETTINGS_EVENT = "fpt:open-cookie-settings";
type Consent = "accepted" | "declined" | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = safeGetItem(CONSENT_KEY);
    const valid = stored === "accepted" || stored === "declined" ? stored : null;
    setConsent(valid);
    setOpen(valid === null);
    setHydrated(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  function decide(choice: "accepted" | "declined") {
    safeSetItem(CONSENT_KEY, choice);
    // Withdrawing consent after GA has already loaded: GA's documented
    // opt-out flag stops any further hits for the rest of this page view.
    if (gaId) {
      (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = choice === "declined";
    }
    setConsent(choice);
    setOpen(false);
  }

  return (
    <>
      {/* GA4 only loads once the visitor has actively accepted. */}
      {gaId && consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {hydrated && open && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-fpt-grey bg-fpt-white px-6 py-5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-fpt-black/70">
              We use cookies to understand site traffic via Google
              Analytics. Accept to help us improve the site, or decline to
              browse without analytics tracking.
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => decide("declined")}
                className="rounded-full border border-fpt-black/30 px-5 py-2 text-sm font-semibold text-fpt-black hover:bg-fpt-offwhite"
              >
                Decline
              </button>
              <button
                onClick={() => decide("accepted")}
                className="rounded-full bg-fpt-green px-5 py-2 text-sm font-bold text-fpt-black hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
