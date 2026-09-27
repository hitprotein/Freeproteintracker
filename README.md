# FreeProteinTracker.com

Free, no-account, browser-based protein tracker + one protein calculator.
Static Next.js site (localStorage for the tracker, no backend/database).

## Key decisions (read before adding pages)

- **Deliberately NOT a content site.** proteintracker.com.au already covers
  food pages, meal guides, calculator variants and protein guides. Building
  the same content here would target the same search queries from the same
  business — a real SEO risk (Google's scaled-content / site reputation
  policies target exactly this pattern), and could hurt both sites' rankings,
  not just this one. When in doubt, link to proteintracker.com.au instead of
  rebuilding the content here.
- **White/light-first theme, on purpose.** hitprotein.com.au and
  proteintracker.com.au are both black-dominant. This site uses white/light
  backgrounds with black+green as accents — same brand palette, genuinely
  different visual weight, so it doesn't read as a reskin.
- **US-first audience (.com).** Copy is US English (`en-US`), and units
  default to US (lb, ft/in, oz) for US browsers, metric elsewhere, with a
  toggle (`lib/units.ts`). The calculator engine stays metric — convert at
  the edges, never inside `lib/protein-calculator.ts`. Food names are US
  English; other regional names go in `aliases` so search still finds them.
- **The tracker is the product**, not a page describing a future product.
  It's embedded directly on the homepage and fully functional with no
  account.
- Calculator engine (`lib/protein-calculator.ts`) is copied byte-for-byte
  from proteintracker-web's copy, both ported from the app's
  `calculate_protein_target()`. If the algorithm changes, update all three
  copies (this site, proteintracker-web, server.py) together.

## Setup

Requires Node 22 (pinned via `engines` in package.json; Next.js 16 needs 20.9+).

1. `npm install`
2. `npm run dev` → http://localhost:3000
3. `npm run lint` / `npm run build` before pushing

## Deploying

1. Push to a **new** GitHub repo (`freeproteintracker-web`).
2. Vercel → New Project → import the repo.
3. Vercel → Settings → Domains → add `freeproteintracker.com` (+ `www`).
4. GoDaddy → DNS → update A record (`@`) and CNAME (`www`) to Vercel's
   values. Don't change nameservers.
5. GA4 + Search Console — same pattern as proteintracker-web:
   - Create a **new** GA4 property (don't reuse ProteinTracker's), set
     `NEXT_PUBLIC_GA_ID` in Vercel.
   - Add a **new** Search Console property, verify (HTML tag or the
     GoDaddy one-click integration), set
     `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` if using the tag method.
   - Submit `sitemap.xml` once verified.

## Conversion events

Fired via `lib/analytics.ts` → `trackEvent()`. Matches the brief's spec:
`tracker_started`, `protein_calculator_completed`, `protein_goal_calculated`,
`hitprotein_cta_clicked`, `app_store_clicked`. The last two fire
automatically from `CtaButton` based on the destination URL — no manual
wiring needed when adding a new HitProtein link.

## Adding pages later

Per the brief's own section 25: don't build more pages speculatively.
Once Search Console has real data (impressions, queries, CTR), expand
based on what's actually being searched for — and update `app/sitemap.ts`
the same day any new page ships.
