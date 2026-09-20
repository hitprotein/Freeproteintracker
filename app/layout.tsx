import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const heading = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freeproteintracker.com"),
  title: {
    default: "Free Protein Tracker — Track Your Protein Intake Free",
    template: "%s | FreeProteinTracker.com",
  },
  description:
    "Track your protein intake for free. Set a daily protein target, add foods, and see how much protein you have left — no account required.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon-180x180.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: "Free Protein Tracker — Track Your Protein Intake Free",
    description:
      "Track your protein intake for free. Set a daily protein target, add foods, and see how much protein you have left — no account required.",
    url: "https://freeproteintracker.com",
    siteName: "FreeProteinTracker.com",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Protein Tracker — Track Your Protein Intake Free",
    description:
      "Track your protein intake for free. Set a daily protein target, add foods, and see how much protein you have left — no account required.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${heading.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "FreeProteinTracker.com",
                url: "https://freeproteintracker.com",
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "FreeProteinTracker.com",
                url: "https://freeproteintracker.com",
                logo: "https://freeproteintracker.com/header-logo.png",
                sameAs: ["https://hitprotein.com.au", "https://proteintracker.com.au"],
              },
            ]),
          }}
        />
        <GoogleAnalytics />

        <header className="border-b border-fpt-grey bg-fpt-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" aria-label="FreeProteinTracker.com home">
              <Image
                src="/header-logo.png"
                alt="FreeProteinTracker.com"
                width={1140}
                height={200}
                priority
                className="h-10 w-auto md:h-12"
              />
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/protein-calculator"
                className="hidden text-sm font-semibold text-fpt-black/70 hover:text-fpt-black sm:block"
              >
                Protein Calculator
              </Link>
              <CtaButton href="https://hitprotein.com.au/download">
                Try HitProtein
              </CtaButton>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t border-fpt-grey bg-fpt-offwhite py-12">
          <div className="mx-auto max-w-6xl px-6">
            <Image
              src="/by-hitprotein-credit.png"
              alt="by HitProtein"
              width={497}
              height={107}
              className="h-6 w-auto"
            />
            <p className="mt-4 max-w-xl text-sm text-fpt-black/60">
              Protein figures are approximate estimates — actual values vary
              by brand, cut and preparation. This site does not provide
              medical advice; the calculator gives an estimate, not a
              medical prescription.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <Link href="/protein-calculator" className="text-fpt-black/70 hover:text-fpt-black">
                Protein Calculator
              </Link>
              <a
                href="https://proteintracker.com.au"
                className="text-fpt-black/70 hover:text-fpt-black"
              >
                Protein Foods & Guides →
              </a>
              <a
                href="https://hitprotein.com.au"
                className="text-fpt-black/70 hover:text-fpt-black"
              >
                HitProtein App →
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
