"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X, RotateCcw } from "lucide-react";
import { FOOD_DATABASE, type FoodItem } from "@/lib/food-database";
import { trackEvent } from "@/lib/analytics";
import { loadTrackerState, TRACKER_STORAGE_KEY, type TrackerEntry } from "@/lib/tracker-storage";
import CtaButton from "@/components/CtaButton";

type Meal = "Breakfast" | "Lunch" | "Dinner" | "Snacks";
const MEALS: Meal[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];

type Entry = TrackerEntry;

export default function Tracker() {
  const [target, setTarget] = useState(150);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [showAddFood, setShowAddFood] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingGrams, setServingGrams] = useState("");
  const [quickGrams, setQuickGrams] = useState("");
  const [quickLabel, setQuickLabel] = useState("");
  const [addMeal, setAddMeal] = useState<Meal>("Breakfast");

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadTrackerState();
    setTarget(loaded.target);
    setEntries(loaded.entries);
    setHydrated(true);
  }, []);

  // Persist on change (skip the initial pre-hydration render)
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify({ target, entries }));
  }, [target, entries, hydrated]);

  const total = useMemo(() => entries.reduce((sum, e) => sum + e.protein, 0), [entries]);
  const remaining = Math.max(target - total, 0);
  const percent = Math.min(Math.round((total / target) * 100), 100);

  function fireFirstStartIfNeeded() {
    if (entries.length === 0) trackEvent("tracker_started");
  }

  function addEntry(entry: Entry) {
    fireFirstStartIfNeeded();
    setEntries((prev) => [...prev, entry]);
  }

  function handleAddFood() {
    if (!selectedFood) return;
    const grams = parseFloat(servingGrams) || selectedFood.defaultServingGrams;
    const protein = Math.round((grams * selectedFood.proteinPer100) / 100);
    addEntry({
      id: crypto.randomUUID(),
      name: `${selectedFood.name} (${grams}${selectedFood.unit})`,
      protein,
      meal: addMeal,
    });
    setSelectedFood(null);
    setServingGrams("");
    setSearch("");
    setShowAddFood(false);
  }

  function handleQuickAdd() {
    const protein = parseFloat(quickGrams);
    if (!protein || protein <= 0) return;
    addEntry({
      id: crypto.randomUUID(),
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

  const filteredFoods =
    search.trim().length > 0
      ? FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
      : [];

  return (
    <div className="rounded-card border border-fpt-grey bg-fpt-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-fpt-black/50">Today&apos;s Protein</p>
          <p className="font-heading text-3xl font-extrabold">
            {total}g <span className="text-fpt-black/40">/ {target}g</span>
          </p>
        </div>
        <label className="flex flex-col items-end gap-1 text-xs text-fpt-black/50">
          Daily target
          <input
            type="number"
            value={target}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10) || 0;
              setTarget(v);
              trackEvent("protein_goal_calculated", { source: "manual", target: v });
            }}
            className="w-20 rounded-lg border border-fpt-grey px-2 py-1 text-right text-sm font-semibold text-fpt-black"
          />
        </label>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-fpt-offwhite">
        <div
          className="h-full rounded-full bg-fpt-green transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-fpt-black/60">{remaining}g remaining</p>

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
            type="text"
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
                  onClick={() => {
                    setSelectedFood(f);
                    setServingGrams(String(f.defaultServingGrams));
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-fpt-offwhite"
                >
                  {f.name}{" "}
                  <span className="text-fpt-black/40">
                    ({f.proteinPer100}g protein / 100{f.unit})
                  </span>
                </button>
              ))}
            </div>
          )}

          {selectedFood && (
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div>
                <p className="text-sm font-semibold">{selectedFood.name}</p>
                <label className="mt-1 flex items-center gap-2 text-xs text-fpt-black/60">
                  Serving ({selectedFood.unit})
                  <input
                    type="number"
                    value={servingGrams}
                    onChange={(e) => setServingGrams(e.target.value)}
                    className="w-20 rounded-lg border border-fpt-grey px-2 py-1"
                  />
                </label>
              </div>
              <select
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
                onClick={handleAddFood}
                className="rounded-full bg-fpt-black px-4 py-2 text-sm font-semibold text-fpt-white hover:bg-fpt-black/80"
              >
                Add
              </button>
            </div>
          )}
          <p className="mt-3 text-xs text-fpt-black/40">
            Figures are approximate — protein varies by brand, cut and
            preparation.
          </p>
        </div>
      )}

      {showQuickAdd && (
        <div className="mt-4 rounded-card border border-fpt-grey bg-fpt-offwhite p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs text-fpt-black/60">
              Protein (g)
              <input
                type="number"
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
              onClick={handleQuickAdd}
              className="rounded-full bg-fpt-black px-4 py-2 text-sm font-semibold text-fpt-white hover:bg-fpt-black/80"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="mt-6 space-y-4">
          {MEALS.filter((m) => entries.some((e) => e.meal === m)).map((meal) => (
            <div key={meal}>
              <p className="text-sm font-semibold text-fpt-black/70">{meal}</p>
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
                        aria-label="Remove"
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
