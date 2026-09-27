"use client";

import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/tracker-storage";

// Body weight, height and food servings can be shown in metric (kg, cm,
// g, ml) or US customary (lb, ft/in, oz, fl oz). Protein is always grams —
// US nutrition labels use grams too. The calculator engine stays metric;
// conversion happens only at the input/display edges.

export type UnitSystem = "metric" | "imperial";

const UNITS_KEY = "fpt_units";
const UNITS_CHANGED_EVENT = "fpt:units-changed";

export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;
export const G_PER_OZ = 28.349523125;
export const ML_PER_FL_OZ = 29.5735295625;

// Countries that use US customary units day to day.
const IMPERIAL_REGIONS = new Set(["US", "LR", "MM"]);

let memoryUnits: UnitSystem | null = null;

function detectUnits(): UnitSystem {
  try {
    const tag = navigator.languages?.[0] ?? navigator.language;
    // Strip POSIX-style suffixes ("en-US@posix") that Intl.Locale rejects.
    const locale = new Intl.Locale(tag.split("@")[0]);
    // A bare "en" has no region; maximize() fills in the likeliest one.
    const region = locale.region ?? locale.maximize().region;
    return region && IMPERIAL_REGIONS.has(region) ? "imperial" : "metric";
  } catch {
    return "metric";
  }
}

function readUnits(): UnitSystem {
  const stored = safeGetItem(UNITS_KEY);
  if (stored === "metric" || stored === "imperial") return stored;
  return memoryUnits ?? detectUnits();
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(UNITS_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(UNITS_CHANGED_EVENT, onChange);
  };
}

export function setUnits(units: UnitSystem) {
  memoryUnits = units;
  safeSetItem(UNITS_KEY, units);
  window.dispatchEvent(new Event(UNITS_CHANGED_EVENT));
}

// `null` during prerender and hydration, before the browser's preference
// is known — callers can hide unit-specific UI until then to avoid a flash
// of the wrong units.
export function useUnits(): UnitSystem | null {
  return useSyncExternalStore<UnitSystem | null>(subscribe, readUnits, () => null);
}

export function round(value: number, step: number): number {
  return Math.round(value / step) * step;
}

// Trims float noise, e.g. 5.300000001 -> "5.3".
export function fmt(value: number, maxDecimals = 1): string {
  return String(Number(value.toFixed(maxDecimals)));
}

export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalIn = Math.round(cm / CM_PER_IN);
  return { ft: Math.floor(totalIn / 12), in: totalIn % 12 };
}

export function ftInToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * CM_PER_IN;
}

// Food servings: foods are stored per 100 g (or 100 ml for liquids). In US
// units, solids are entered in oz and liquids in fl oz.
interface ServingFood {
  unit: "g" | "ml";
  proteinPer100: number;
  defaultServingGrams: number;
}

export function servingUnitLabel(food: ServingFood, units: UnitSystem): string {
  if (units === "metric") return food.unit;
  return food.unit === "ml" ? "fl oz" : "oz";
}

// Metric grams/ml per one entered unit.
function servingFactor(food: ServingFood, units: UnitSystem): number {
  if (units === "metric") return 1;
  return food.unit === "ml" ? ML_PER_FL_OZ : G_PER_OZ;
}

export function servingToMetric(amount: number, food: ServingFood, units: UnitSystem): number {
  return amount * servingFactor(food, units);
}

export function defaultServing(food: ServingFood, units: UnitSystem): number {
  if (units === "metric") return food.defaultServingGrams;
  return Math.max(round(food.defaultServingGrams / servingFactor(food, units), 0.5), 0.5);
}

export function proteinDensityLabel(food: ServingFood, units: UnitSystem): string {
  if (units === "metric") return `${food.proteinPer100}g protein / 100${food.unit}`;
  const perUnit = (food.proteinPer100 * servingFactor(food, units)) / 100;
  return `${fmt(perUnit)}g protein / ${servingUnitLabel(food, units)}`;
}
