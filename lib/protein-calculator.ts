// SHARED PROTEIN CALCULATOR ENGINE
//
// Identical to the engine used on proteintracker.com.au, both ported from
// the HitProtein app's server.py calculate_protein_target(). Keeping this
// file byte-for-byte the same across both sites (and the app) matters —
// if someone uses the calculator here and later on proteintracker.com.au,
// or downloads the app, they should get the same number every time.
//
// If server.py's algorithm ever changes, update this file AND the copy
// in proteintracker-web AND verify against the Python source again.

export type GoalType = "build_muscle" | "lose_weight" | "maintain" | "athletic";

export type ActivityLevel =
  | "sedentary"
  | "active"
  | "strength_training"
  | "high_performance";

const GOAL_BASE: Record<GoalType, number> = {
  build_muscle: 2.2,
  lose_weight: 2.0,
  maintain: 1.6,
  athletic: 1.8,
};

const GOAL_MAX: Record<GoalType, number> = {
  build_muscle: 2.4,
  lose_weight: 2.2,
  maintain: 1.8,
  athletic: 2.0,
};

const ACTIVITY_ADJUSTMENT: Record<ActivityLevel, number> = {
  sedentary: 0.0,
  active: 0.05,
  strength_training: 0.1,
  high_performance: 0.15,
};

const AGE_BANDS: [number, number][] = [
  [50, 0.0],
  [60, 0.05],
  [75, 0.1],
  [85, 0.15],
];
const AGE_ADJUSTMENT_MAX = 0.2;

const ABSOLUTE_MAX_GRAMS = 300;

const BMI_CAP_DEFAULT = 27.5;
const BMI_CAP_TRAINED = 30.0;
const TRAINED_ACTIVITY = new Set<ActivityLevel>(["strength_training", "high_performance"]);

function ageAdjustment(age?: number | null): number {
  if (!age) return 0.0;
  for (const [threshold, adj] of AGE_BANDS) {
    if (age < threshold) return adj;
  }
  return AGE_ADJUSTMENT_MAX;
}

function bmiCapped(
  weightKg: number,
  heightCm?: number | null,
  activityLevel?: ActivityLevel | null
): number {
  if (!heightCm || heightCm <= 0) return weightKg;
  const cap =
    activityLevel && TRAINED_ACTIVITY.has(activityLevel) ? BMI_CAP_TRAINED : BMI_CAP_DEFAULT;
  const metres = heightCm / 100.0;
  return Math.min(weightKg, cap * metres * metres);
}

function referenceWeight(currentKg: number, goalKg?: number | null): number {
  if (!goalKg || goalKg === currentKg) return currentKg;

  if (goalKg < currentKg) {
    const diff = currentKg - goalKg;
    const pct = diff / currentKg;
    let factor: number;
    if (pct <= 0.1) factor = 0.0;
    else if (pct >= 0.4) factor = 1.0;
    else factor = (pct - 0.1) / 0.3;
    return currentKg - diff * factor;
  }

  const gain = goalKg - currentKg;
  return currentKg + Math.min(gain * 0.5, currentKg * 0.1);
}

export interface ProteinCalculatorInput {
  weightKg: number;
  goalType: GoalType;
  age?: number | null;
  goalWeightKg?: number | null;
  activityLevel?: ActivityLevel | null;
  heightCm?: number | null;
}

export interface ProteinCalculatorResult {
  proteinGoal: number;
  proteinPerKg: number;
  referenceWeightKg: number;
}

export function calculateProteinTarget(
  input: ProteinCalculatorInput
): ProteinCalculatorResult {
  const goal: GoalType = GOAL_BASE[input.goalType] !== undefined ? input.goalType : "maintain";

  let coefficient =
    GOAL_BASE[goal] +
    ageAdjustment(input.age) +
    ACTIVITY_ADJUSTMENT[input.activityLevel ?? "sedentary"];
  coefficient = Math.min(coefficient, GOAL_MAX[goal]);

  let reference = referenceWeight(input.weightKg, input.goalWeightKg);
  reference = bmiCapped(reference, input.heightCm, input.activityLevel);

  const grams = Math.min(Math.round(reference * coefficient), ABSOLUTE_MAX_GRAMS);

  return {
    proteinGoal: grams,
    proteinPerKg: Math.round(coefficient * 100) / 100,
    referenceWeightKg: Math.round(reference * 10) / 10,
  };
}
