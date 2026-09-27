"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X, RotateCcw } from "lucide-react";
import { FOOD_DATABASE, type FoodItem } from "@/lib/food-database";
import { trackEvent } from "@/lib/analytics";
import {
  DEFAULT_TARGET,
  MEALS,
  defaultMealForTime,
  entriesTotal,
  loadTrackerState,
  newId,
  saveTrackerState,
  todayKey,
  type DaySummary,
  type Meal,
  type TrackerEntry,
} from "@/lib/tracker-storage";
import CtaButton from "@/components/CtaButton";
import UnitToggle from "@/components/UnitToggle";
import {
  defaultServing,
  fmt,
  formatFoodAmount,
  proteinDensityLabel,
  servingToMetric,
  servingUnitLabel,
  useUnits,
  type UnitSystem,
} from "@/lib/units";

type Entry = TrackerEntry;

export default function Tracker() {
  const [date, setDate] = useState(todayKey);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [targetDraft, setTargetDraft] = useState(String(DEFAULT_TARGET));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [history, setHistory] = useState<DaySummary[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const dateRef = useRef(date);
  useEffect(() => {
    dateRef.current = date;
  }, [date]);

  const [showAddFood, setShowAddFood] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const units: UnitSystem = useUnits() ?? "metric";
  // `mode` is an index into the food's household servings ("1 large egg")
  // or "weight". In weight mode the typed value remembers which units it was
  // typed in; after a unit switch it falls back to the default in the new
  // units. In household mode the value is a count, so units don't matter.
  const [serving, setServing] = useState<{
    mode: number | "weight";
    value: string;
    units: UnitSystem;
  }>({ mode: "weight", value: "", units: "metric" });
  const [quickGrams, setQuickGrams] = useState("");
  const [quickLabel, setQuickLabel] = useState("");
  const [addMeal, setAddMeal] = useState<Meal>("Breakfast");

  // Load from localStorage on mount, and again whenever the tab regains
  // focus — a tab left open overnight should roll over to a fresh day.
  useEffect(() => {
    function load() {
      const loaded = loadTrackerState();
      setDate(loaded.date);
      setTarget(loaded.target);
      setTargetDraft(String(loaded.target));
      setEntries(loaded.entries);
      setHistory(loaded.history);
      setAddMeal(defaultMealForTime());
      setHydrated(true);
    }
    load();

    function onVisible() {
      if (document.visibilityState === "visible" && todayKey() !== dateRef.current) load();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // Persist on change (skip the initial pre-hydration render)
  useEffect(() => {
    if (!hydrated) return;
    saveTrackerState({ date, target, entries, history });
  }, [date, target, entries, history, hydrated]);

  const total = useMemo(() => entriesTotal(entries), [entries]);
  const remaining = Math.max(target - total, 0);
  const percent = target > 0 ? Math.min(Math.round((total / target) * 100), 100) : 0;

  function fireFirstStartIfNeeded() {
    if (entries.length === 0) trackEvent("tracker_started");
  }

  function addEntry(entry: Entry) {
    fireFirstStartIfNeeded();
    setEntries((prev) => [...prev, entry]);
  }

  function commitTarget() {
    const v = parseInt(targetDraft, 10);
    if (!v || v <= 0) {
      setTargetDraft(String(target));
      return;
    }
    if (v !== target) {
      setTarget(v);
      trackEvent("protein_goal_calculated", { source: "manual", target: v });
    }
  }

  function initialServing(food: FoodItem) {
    return food.servings?.length
      ? { mode: 0, value: "1", units }
      : { mode: "weight" as const, value: String(defaultServing(food, units)), units };
  }

  const household =
    selectedFood && typeof serving.mode === "number"
      ? (selectedFood.servings?.[serving.mode] ?? null)
      : null;
  const servingInput =
    selectedFood && !household && serving.units !== units
      ? String(defaultServing(selectedFood, units))
      : serving.value;
  const parsedServing = parseFloat(servingInput);
  const servingAmount = selectedFood
    ? parsedServing > 0
      ? parsedServing
      : household
        ? 1
        : defaultServing(selectedFood, units)
    : 0;
  const servingMetric = !selectedFood
    ? 0
    : household
      ? servingAmount * household.amount
      : servingToMetric(servingAmount, selectedFood, units);
  const selectedProtein = selectedFood
    ? Math.round((servingMetric * selectedFood.proteinPer100) / 100)
    : 0;

  function handleAddFood(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFood) return;
    const protein = selectedProtein;
    const unitLabel = servingUnitLabel(selectedFood, units);
    const amountText = household
      ? servingAmount === 1
        ? household.label
        : `${fmt(servingAmount)} × ${household.label.replace(/^1 /, "")}`
      : `${fmt(servingAmount)}${units === "metric" ? "" : " "}${unitLabel}`;
    addEntry({
      id: newId(),
      name: `${selectedFood.name} (${amountText})`,
      protein,
      meal: addMeal,
    });
    setSelectedFood(null);
    setServing({ mode: "weight", value: "", units });
    setSearch("");
    setShowAddFood(false);
  }

  function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    const protein = parseFloat(quickGrams);
    if (!protein || protein <= 0) return;
    addEntry({
      id: newId(),
      name: quickLabel.trim() || "Quick add",
      protein: Math.round(protein),
      meal: addMeal,
    });
    setQuickGrams("");
    setQuickLabel("");
    setShowQuickAdd(false);
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function resetDay() {
    if (entries.length > 0 && !window.confirm("Clear all of today's entries?")) return;
    setEntries([]);
  }

  // Match every word in any order, so "breast chicken" still finds results;
  // aliases cover other regional names ("prawns", "mince", "yoghurt").
  const filteredFoods = useMemo(() => {
    const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return FOOD_DATABASE.filter((f) => {
      const haystack = `${f.name} ${f.category} ${f.aliases?.join(" ") ?? ""}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    }).slice(0, 8);
  }, [search]);

  // Last 7 days including today, oldest first, for the week strip.
  const week = useMemo(() => {
    const byDate = new Map(history.map((h) => [h.date, h]));
    const days: { date: string; label: string; total: number; target: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      const label = d.toLocaleDateString("en-US", { weekday: "narrow" });
      if (i === 0) days.push({ date: key, label, total, target });
      else {
        const h = byDate.get(key);
        days.push({ date: key, label, total: h?.total ?? 0, target: h?.target ?? target });
      }
    }
    return days;
  }, [history, total, target]);

  return (
    <div className="rounded-card border border-fpt-grey bg-fpt-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-fpt-black/50">Today&apos;s Protein</p>
          <p
            className={`whitespace-nowrap font-heading text-2xl font-extrabold transition-opacity sm:text-3xl ${hydrated ? "" : "opacity-0"}`}
          >
            {total}g <span className="text-fpt-black/40">/ {target}g</span>
          </p>
        </div>
        <label className="flex shrink-0 flex-col items-end gap-1 whitespace-nowrap text-xs text-fpt-black/50">
          Daily target (g)
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={targetDraft}
            onChange={(e) => {
              setTargetDraft(e.target.value);
              const v = parseInt(e.target.value, 10);
              if (v > 0) setTarget(v);
            }}
            onBlur={commitTarget}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="w-20 rounded-lg border border-fpt-grey px-2 py-1 text-right text-sm font-semibold text-fpt-black"
          />
        </label>
      </div>

      <div
        role="progressbar"
        aria-label="Protein progress towards daily target"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-4 h-3 w-full overflow-hidden rounded-full bg-fpt-offwhite"
      >
        <div
          className="h-full rounded-full bg-fpt-green transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-fpt-black/60" aria-live="polite">
        {remaining}g remaining
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => {
            setShowAddFood((v) => !v);
            setShowQuickAdd(false);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-fpt-black px-4 py-2 text-sm font-semibold hover:bg-fpt-offwhite"
        >
          <Plus className="h-4 w-4" /> Add Food
        </button>
        <button
          onClick={() => {
            setShowQuickAdd((v) => !v);
            setShowAddFood(false);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-fpt-black px-4 py-2 text-sm font-semibold hover:bg-fpt-offwhite"
        >
          <Plus className="h-4 w-4" /> Quick Add Protein
        </button>
        {entries.length > 0 && (
          <button
            onClick={resetDay}
            className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-fpt-black/50 hover:text-fpt-black"
          >
            <RotateCcw className="h-4 w-4" /> Reset day
          </button>
        )}
      </div>

      {showAddFood && (
        <div className="mt-4 rounded-card border border-fpt-grey bg-fpt-offwhite p-4">
          <input
            type="search"
            aria-label="Search foods"
            autoFocus
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedFood(null);
            }}
            placeholder="Search foods (e.g. chicken breast)"
            className="w-full rounded-lg border border-fpt-grey px-3 py-2 text-sm"
          />
          {filteredFoods.length > 0 && !selectedFood && (
            <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-fpt-grey bg-fpt-white">
              {filteredFoods.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setSelectedFood(f);
                    setServing(initialServing(f));
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-fpt-offwhite"
                >
                  {f.name}{" "}
                  <span className="text-fpt-black/40">
                    ({proteinDensityLabel(f, units)})
                  </span>
                </button>
              ))}
            </div>
          )}

          {selectedFood && (
            <form onSubmit={handleAddFood} className="mt-3 flex flex-wrap items-end gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{selectedFood.name}</p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    aria-label={
                      household ? "Number of servings" : `Amount (${servingUnitLabel(selectedFood, units)})`
                    }
                    value={servingInput}
                    onChange={(e) => setServing({ ...serving, value: e.target.value, units })}
                    className="w-16 rounded-lg border border-fpt-grey px-2 py-1.5"
                  />
                  {selectedFood.servings?.length ? (
                    <select
                      aria-label="Serving size"
                      value={String(household ? serving.mode : "weight")}
                      onChange={(e) => {
                        const v = e.target.value;
                        setServing(
                          v === "weight"
                            ? { mode: "weight", value: String(defaultServing(selectedFood, units)), units }
                            : { mode: Number(v), value: "1", units }
                        );
                      }}
                      className="min-w-0 max-w-[14rem] rounded-lg border border-fpt-grey px-2 py-1.5"
                    >
                      {selectedFood.servings.map((sv, i) => (
                        <option key={sv.label} value={i}>
                          {sv.label} ({formatFoodAmount(sv.amount, selectedFood, units)})
                        </option>
                      ))}
                      <option value="weight">{servingUnitLabel(selectedFood, units)}</option>
                    </select>
                  ) : (
                    <span className="text-fpt-black/60">{servingUnitLabel(selectedFood, units)}</span>
                  )}
                </div>
              </div>
              <select
                aria-label="Meal"
                value={addMeal}
                onChange={(e) => setAddMeal(e.target.value as Meal)}
                className="rounded-lg border border-fpt-grey px-2 py-2 text-sm"
              >
                {MEALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-full bg-fpt-black px-4 py-2 text-sm font-semibold text-fpt-white hover:bg-fpt-black/80"
              >
                Add {selectedProtein}g
              </button>
            </form>
          )}
          {search.trim().length > 0 && filteredFoods.length === 0 && !selectedFood && (
            <p className="mt-2 text-sm text-fpt-black/60">
              No match — try{" "}
              <button
                type="button"
                onClick={() => {
                  setShowAddFood(false);
                  setShowQuickAdd(true);
                  setQuickLabel(search.trim());
                }}
                className="font-semibold underline"
              >
                Quick Add
              </button>{" "}
              with the protein from the label.
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-fpt-black/40">
              Figures are approximate — protein varies by brand, cut and
              preparation.
            </p>
            <UnitToggle units={units} />
          </div>
        </div>
      )}

      {showQuickAdd && (
        <div className="mt-4 rounded-card border border-fpt-grey bg-fpt-offwhite p-4">
          <form onSubmit={handleQuickAdd} className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs text-fpt-black/60">
              Protein (g)
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                autoFocus
                value={quickGrams}
                onChange={(e) => setQuickGrams(e.target.value)}
                className="w-24 rounded-lg border border-fpt-grey px-2 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-fpt-black/60">
              Label (optional)
              <input
                type="text"
                value={quickLabel}
                onChange={(e) => setQuickLabel(e.target.value)}
                placeholder="e.g. Protein shake"
                className="w-40 rounded-lg border border-fpt-grey px-2 py-2 text-sm"
              />
            </label>
            <select
              aria-label="Meal"
              value={addMeal}
              onChange={(e) => setAddMeal(e.target.value as Meal)}
              className="rounded-lg border border-fpt-grey px-2 py-2 text-sm"
            >
              {MEALS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-fpt-black px-4 py-2 text-sm font-semibold text-fpt-white hover:bg-fpt-black/80"
            >
              Add
            </button>
          </form>
        </div>
      )}

      {entries.length > 0 && (
        <div className="mt-6 space-y-4">
          {MEALS.filter((m) => entries.some((e) => e.meal === m)).map((meal) => (
            <div key={meal}>
              <p className="text-sm font-semibold text-fpt-black/70">
                {meal}{" "}
                <span className="font-normal text-fpt-black/40">
                  · {entriesTotal(entries.filter((e) => e.meal === meal))}g
                </span>
              </p>
              <ul className="mt-1 space-y-1">
                {entries
                  .filter((e) => e.meal === meal)
                  .map((e) => (
                    <li
                      key={e.id}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-fpt-offwhite"
                    >
                      <span>
                        {e.name} — <strong>{e.protein}g</strong>
                      </span>
                      <button
                        onClick={() => removeEntry(e.id)}
                        aria-label={`Remove ${e.name}`}
                        className="text-fpt-black/30 hover:text-fpt-black"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 border-t border-fpt-grey pt-4">
          <p className="text-sm font-semibold text-fpt-black/70">Last 7 days</p>
          <div className="mt-2 flex h-20 items-end gap-2" aria-hidden="true">
            {week.map((d) => {
              const pct = d.target > 0 ? Math.min(d.total / d.target, 1) : 0;
              const hit = d.target > 0 && d.total >= d.target;
              return (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-14 w-full items-end overflow-hidden rounded-md bg-fpt-offwhite">
                    <div
                      className={`w-full rounded-md ${hit ? "bg-fpt-green" : "bg-fpt-black/20"}`}
                      style={{ height: `${Math.round(pct * 100)}%` }}
                      title={`${d.date}: ${d.total}g / ${d.target}g`}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-fpt-black/50">{d.label}</span>
                </div>
              );
            })}
          </div>
          <p className="sr-only">
            {week.map((d) => `${d.date}: ${d.total}g of ${d.target}g`).join(", ")}
          </p>
        </div>
      )}

      {total >= target && target > 0 && (
        <div className="mt-6 rounded-card bg-fpt-black p-6 text-center text-fpt-white">
          <p className="font-heading font-bold">Target hit for today 🎯</p>
          <p className="mt-1 text-sm text-fpt-white/70">
            Want this tracked automatically tomorrow, with AI meal scanning?
          </p>
          <div className="mt-4 flex justify-center">
            <CtaButton href="https://hitprotein.com.au/download">
              Try HitProtein
            </CtaButton>
          </div>
        </div>
      )}
    </div>
  );
}
