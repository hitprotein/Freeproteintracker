import type { Metadata } from "next";
import CalculatorWidget from "./CalculatorWidget";

export const metadata: Metadata = {
  title: "Protein Calculator — Free Daily Protein Intake Calculator",
  description:
    "Calculate your daily protein target for free. Enter your weight, activity level and goal for a personalised estimate — with the methodology shown transparently.",
  alternates: { canonical: "/protein-calculator" },
};

export default function ProteinCalculatorPage() {
  return (
    <>
      <section className="bg-fpt-offwhite py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-3xl font-extrabold md:text-5xl">
            Protein Calculator
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-fpt-black/60">
            A free estimate of your daily protein target, based on your
            weight, activity level and goal. Works in pounds or kilograms.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-2xl px-6">
        <CalculatorWidget />
      </section>

      <article className="mx-auto mt-16 max-w-3xl px-6 pb-24">
        <h2 className="text-2xl font-bold">How this is calculated</h2>
        <p className="mt-3 text-fpt-black/70">
          This calculator starts from a baseline amount of protein per
          kilogram of bodyweight for your selected goal, then adjusts it
          based on your activity level, age, and (if provided) a goal
          weight. It&apos;s the same calculation used across HitProtein&apos;s tools —
          not a different formula for the free version.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-fpt-black/70">
          <li>
            <strong>Goal</strong> — building muscle and losing weight both
            raise the target above simple maintenance
          </li>
          <li>
            <strong>Activity level</strong> — more intense training raises
            the amount your body can put to use
          </li>
          <li>
            <strong>Age</strong> — the target rises gradually from around
            age 50, since muscle uses dietary protein less efficiently as we
            age
          </li>
          <li>
            <strong>Goal weight</strong>, if provided — the target is
            calculated partway toward it, not entirely off your current
            weight
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold">This is an estimate, not a prescription</h2>
        <p className="mt-3 text-fpt-black/70">
          Protein needs vary between individuals more than any single
          calculator can capture — body composition, training history and
          individual metabolism all play a role. Treat this as a
          well-reasoned starting point, generally landing in the 1.6–2.4g
          per kilogram (about 0.7–1.1g per pound) range depending on your goal, rather than a precise
          medical figure. If you have a specific medical condition, check
          with a doctor or dietitian before making a significant change to
          your protein intake.
        </p>

        <h2 className="mt-10 text-2xl font-bold">More protein tools</h2>
        <p className="mt-3 text-fpt-black/70">
          For food-specific protein content, high-protein meal ideas, and
          in-depth guides on protein and muscle gain, weight loss, and meal
          timing, see{" "}
          <a
            href="https://proteintracker.com.au"
            className="font-semibold text-fpt-black underline"
          >
            ProteinTracker.com.au
          </a>
          .
        </p>
      </article>
    </>
  );
}
