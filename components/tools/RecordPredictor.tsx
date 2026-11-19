"use client";

import { useState } from "react";

export default function RecordPredictor() {
  const [pf, setPf] = useState("112.5"); // points for per game
  const [pa, setPa] = useState("108.0"); // points against per game
  const [games, setGames] = useState("82");

  const pfN = parseFloat(pf) || 0;
  const paN = parseFloat(pa) || 0;
  const g = parseInt(games) || 0;
  const EXP = 13.91;
  const pfP = Math.pow(pfN, EXP);
  const paP = Math.pow(paN, EXP);
  const winPct = pfP + paP > 0 ? pfP / (pfP + paP) : 0;
  const wins = winPct * g;
  const losses = g - wins;
  const diff = pfN - paN;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <label className="label">Points scored per game</label>
        <input className="input" value={pf} onChange={(e) => setPf(e.target.value)} inputMode="decimal" />
        <label className="label mt-4">Points allowed per game</label>
        <input className="input" value={pa} onChange={(e) => setPa(e.target.value)} inputMode="decimal" />
        <label className="label mt-4">Games in season</label>
        <input className="input" value={games} onChange={(e) => setGames(e.target.value)} inputMode="numeric" />
        <div className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
          Point differential: <strong>{diff >= 0 ? "+" : ""}{diff.toFixed(1)} PPG</strong>
        </div>
      </div>
      <div className="rounded-xl bg-gray-50 p-5">
        <h3 className="mb-4 font-bold text-ink">Projected record</h3>
        <div className="text-center">
          <div className="text-5xl font-extrabold text-ink">{wins.toFixed(0)}–{losses.toFixed(0)}</div>
          <div className="mt-1 text-sm text-gray-500">expected win-loss record</div>
        </div>
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-xs text-gray-500"><span>0 wins</span><span>{g} wins</span></div>
          <div className="h-4 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-court transition-all" style={{ width: `${winPct * 100}%` }} />
          </div>
          <div className="mt-2 text-center text-lg font-bold text-court">{(winPct * 100).toFixed(1)}% win rate</div>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-gray-400">
          Based on the Pythagorean expectation formula with exponent 13.91, the value that best fits historical NBA scoring data.
        </p>
      </div>
    </div>
  );
}
