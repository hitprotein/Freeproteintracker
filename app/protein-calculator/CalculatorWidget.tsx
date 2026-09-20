"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  calculateProteinTarget,
  type ActivityLevel,
  type GoalType,
  type ProteinCalculatorResult,
} from "@/lib/protein-calculator";
import { setTrackerTarget } from "@/lib/tracker-storage";
import { trackEvent } from "@/lib/analytics";
import CtaButton from "@/components/CtaButton";

const GOAL_OPTIONS: { value: GoalType; label: string }[] = [
  { value: "maintain", label: "Maintain weight" },
  { value: "lose_weight", label: "Lose weight" },
  { value: "build_muscle", label: "Build muscle" },
  { value: "athletic", label: "General fitness / athletic performance" },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary (little to no exercise)" },
  { value: "active", label: "Active (light exercise a few times a week)" },
  { value: "strength_training", label: "Strength training (regular resistance training)" },
  { value: "high_performance", label: "High performance (intense training / athlete)" },
];

export default function CalculatorWidget() {
  const router = useRouter();
  const [age, setAge] = useState("30");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("80");
  const [goalWeightKg, setGoalWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("active");
  const [goalType, setGoalType] = useState<GoalType>("maintain");
  const [result, setResult] = useState<ProteinCalculatorResult | null>(null);
  const [applied, setApplied] = useState(false);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const weight = parseFloat(weightKg);
    if (!weight || weight <= 0) return;

    const calcResult = calculateProteinTarget({
      weightKg: weight,
      goalType,
      age: age ? parseInt(age, 10) : null,
      goalWeightKg: goalWeightKg ? parseFloat(goalWeightKg) : null,
      activityLevel,
      heightCm: heightCm ? parseFloat(heightCm) : null,
    });
    setResult(calcResult);
    setApplied(false);
    trackEvent("protein_calculator_completed", { goalType, result: calcResult.proteinGoal });
    trackEvent("protein_goal_calculated", { source: "calculator", target: calcResult.proteinGoal });
  }

  function handleUseAsTarget() {
    if (!result) return;
    setTrackerTarget(result.proteinGoal);
    setApplied(true);
    router.push("/#tracker");
  }

  return (
    <div className="rounded-card border border-fpt-grey bg-fpt-white p-6 shadow-sm md:p-8">
      <form onSubmit={handleCalculate} className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Age
          <input
            type="number"
            min={13}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="rounded-lg border border-fpt-grey px-3 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Height (cm)
          <input
            type="number"
            min={100}
            max={250}
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="rounded-lg border border-fpt-grey px-3 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Current weight (kg)
          <input
            type="number"
            min={25}
            max={350}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="rounded-lg border border-fpt-grey px-3 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Goal weight (kg) — optional
          <input
            type="number"
            min={25}
            max={350}
            value={goalWeightKg}
            onChange={(e) => setGoalWeightKg(e.target.value)}
            placeholder="Leave blank if not applicable"
            className="rounded-lg border border-fpt-grey px-3 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold sm:col-span-2">
          Activity level
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            className="rounded-lg border border-fpt-grey px-3 py-2 font-normal"
          >
            {ACTIVITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold sm:col-span-2">
          Goal
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value as GoalType)}
            className="rounded-lg border border-fpt-grey px-3 py-2 font-normal"
          >
            {GOAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="rounded-full bg-fpt-black px-6 py-3 font-heading font-bold text-fpt-white transition hover:bg-fpt-black/85 sm:col-span-2"
        >
          Calculate My Protein Target
        </button>
      </form>

      {result && (
        <div className="mt-8 rounded-card bg-fpt-offwhite p-8 text-center">
          <p className="text-sm uppercase tracking-wide text-fpt-black/50">
            Suggested daily protein target
          </p>
          <p className="mt-2 font-heading text-5xl font-extrabold text-fpt-black">
            {result.proteinGoal}g<span className="text-2xl text-fpt-black/50">/day</span>
          </p>
          <p className="mt-2 text-sm text-fpt-black/50">
            ≈ {result.proteinPerKg}g per kg of reference bodyweight (
            {result.referenceWeightKg}kg)
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs text-fpt-black/40">
            This is an estimate, not a medical prescription — see the
            methodology below for how it&apos;s calculated.
          </p>

          <button
            onClick={handleUseAsTarget}
            className="mt-6 rounded-full border-2 border-fpt-black px-6 py-3 font-heading font-bold text-fpt-black transition hover:bg-fpt-black hover:text-fpt-white"
          >
            {applied ? "Applied ✓" : "Use This As My Tracker Target"}
          </button>

          <div className="mt-8 border-t border-fpt-grey pt-6 text-left">
            <p className="font-heading font-bold">
              Want to automatically track this target?
            </p>
            <p className="mt-1 text-sm text-fpt-black/60">
              HitProtein can set your personalised protein target and help
              you track it every day.
            </p>
            <div className="mt-4">
              <CtaButton href="https://hitprotein.com.au/download">
                Download HitProtein
              </CtaButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
