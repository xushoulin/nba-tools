"use client";

import { useState } from "react";

type Weights = Record<string, number>;
const POINTS: Weights = { PTS: 1, REB: 1.2, AST: 1.5, STL: 3, BLK: 3, TO: -1, "3PM": 0.5 };
const KEYS = Object.keys(POINTS);

export default function FantasyPointsCalculator() {
  const [mode, setMode] = useState<"points" | "nine-cat" | "custom">("points");
  const [stats, setStats] = useState<Record<string, string>>({
    PTS: "24", REB: "7", AST: "5", STL: "1", BLK: "0.5", TO: "2.5", "3PM": "3",
  });
  const [custom, setCustom] = useState<Weights>({ ...POINTS });

  const num = (k: string) => parseFloat(stats[k] || "0") || 0;
  const w = mode === "custom" ? custom : POINTS;
  const total = mode === "nine-cat"
    ? null
    : KEYS.reduce((s, k) => s + num(k) * w[k], 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["points", "nine-cat", "custom"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              mode === m ? "bg-court text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {m === "points" ? "Points league" : m === "nine-cat" ? "9-category" : "Custom weights"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-bold text-ink">Player stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {KEYS.map((k) => (
              <label key={k}>
                <span className="label">{k}</span>
                <input className="input" value={stats[k]} onChange={(e) => setStats({ ...stats, [k]: e.target.value })} inputMode="decimal" />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5">
          {mode === "nine-cat" ? (
            <>
              <h3 className="font-bold text-ink">Category line</h3>
              <p className="mt-2 text-sm text-gray-600">In 9-cat leagues there is no single point total — you compete in each category weekly.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {KEYS.map((k) => (
                  <div key={k} className="flex justify-between rounded-lg bg-white px-3 py-2 text-sm">
                    <span className="text-gray-600">{k}</span><span className="font-bold">{num(k)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="font-bold text-ink">Fantasy points</h3>
              <div className="stat-box mt-3">
                <div className="text-3xl font-extrabold text-court">{total!.toFixed(1)}</div>
                <div className="text-xs text-gray-500">total fantasy points</div>
              </div>
              <div className="mt-4 space-y-1 text-xs">
                {KEYS.map((k) => (
                  <div key={k} className="flex justify-between text-gray-600">
                    <span>{k}: {num(k)} × {w[k]}</span>
                    <span className="font-semibold">{(num(k) * w[k]).toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {mode === "custom" && (
        <div className="mt-6 rounded-xl border border-gray-200 p-5">
          <h3 className="mb-3 font-bold text-ink">Custom scoring weights</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {KEYS.map((k) => (
              <label key={k}>
                <span className="label">Points per {k}</span>
                <input className="input" value={custom[k]} onChange={(e) => setCustom({ ...custom, [k]: parseFloat(e.target.value) || 0 })} inputMode="decimal" />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
