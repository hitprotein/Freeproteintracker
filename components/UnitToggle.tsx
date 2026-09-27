"use client";

import { setUnits, type UnitSystem } from "@/lib/units";

const OPTIONS: { value: UnitSystem; label: string }[] = [
  { value: "imperial", label: "US (lb, oz)" },
  { value: "metric", label: "Metric (kg, g)" },
];

export default function UnitToggle({
  units,
  onChange,
  className = "",
}: {
  units: UnitSystem | null;
  // Lets a form convert its current values before the switch.
  onChange?: (next: UnitSystem) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Units"
      className={`inline-flex rounded-full border border-fpt-grey bg-fpt-white p-0.5 text-xs font-semibold ${className}`}
    >
      {OPTIONS.map((opt) => {
        const active = units === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              if (active) return;
              onChange?.(opt.value);
              setUnits(opt.value);
            }}
            className={`rounded-full px-3 py-1 transition ${
              active ? "bg-fpt-black text-fpt-white" : "text-fpt-black/60 hover:text-fpt-black"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
