import CtaButton from "@/components/CtaButton";
import Tracker from "@/components/Tracker";

export default function HomePage() {
  return (
    <>
      <section className="bg-fpt-offwhite py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-heading text-sm font-extrabold uppercase tracking-widest text-fpt-black/50">
            Free Protein Tracker
          </p>
          <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">
            Track your protein intake for free.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-fpt-black/60">
            Set a daily protein target, add foods, and see how much protein
            you&apos;ve consumed and how much you have left. No account
            needed.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#tracker"
              className="rounded-full bg-fpt-black px-8 py-4 font-heading text-base font-extrabold uppercase tracking-wide text-fpt-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Start Tracking Free
            </a>
            <a
              href="/protein-calculator"
              className="text-sm font-semibold text-fpt-black/70 hover:text-fpt-black"
            >
              Calculate My Protein Target →
            </a>
          </div>
        </div>
      </section>

      <section id="tracker" className="mx-auto -mt-8 max-w-2xl px-6 pb-24">
        <Tracker />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-heading text-lg font-bold">No account needed</p>
            <p className="mt-1 text-sm text-fpt-black/60">
              Your data stays in your browser — nothing to sign up for.
            </p>
          </div>
          <div>
            <p className="font-heading text-lg font-bold">Real food data</p>
            <p className="mt-1 text-sm text-fpt-black/60">
              A curated list of common high-protein foods, ready to search.
            </p>
          </div>
          <div>
            <p className="font-heading text-lg font-bold">Genuinely free</p>
            <p className="mt-1 text-sm text-fpt-black/60">
              Use it as much as you like — no paywall, no trial.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-card bg-fpt-black p-8 text-center text-fpt-white sm:p-10">
          <p className="font-heading text-xl font-bold">
            Like the free tracker?
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-fpt-white/70">
            HitProtein makes tracking easier — scan meals with AI, set your
            target automatically, and get protein-focused meal ideas from
            Protein Coach.
          </p>
          <div className="mt-6 flex justify-center">
            <CtaButton href="https://hitprotein.com.au/download" size="lg">
              Download HitProtein
            </CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
