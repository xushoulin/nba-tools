"use client";

import { useState } from "react";

const TAX_LINE = 187.9; // 2025-26

// Progressive tax brackets: [over-amount start, over-amount end, rate per $1M over]
// First-time taxpayer rates; repeat taxpayer adds the surcharge.
const BRACKETS = [
  { upTo: 5, rate: 1.5, repeat: 2.0 },
  { upTo: 10, rate: 1.75, repeat: 2.25 },
  { upTo: 15, rate: 2.5, repeat: 3.0 },
  { upTo: 20, rate: 3.25, repeat: 3.75 },
  { upTo: Infinity, rate: 3.75, repeat: 4.25 },
];

function computeTax(over: number, repeat: boolean) {
  let tax = 0;
  let lower = 0;
  for (const b of BRACKETS) {
    if (over <= lower) break;
    const upper = Math.min(over, b.upTo);
    const width = upper - lower;
    tax += width * (repeat ? b.repeat : b.rate);
    lower = b.upTo;
  }
  return tax;
}

export default function LuxuryTaxCalculator() {
  const [salary, setSalary] = useState("195");
  const [taxLine, setTaxLine] = useState(String(TAX_LINE));
  const [repeat, setRepeat] = useState(false);

  const salaryNum = parseFloat(salary) || 0;
  const lineNum = parseFloat(taxLine) || 0;
  const over = Math.max(0, salaryNum - lineNum);
  const tax = computeTax(over, repeat);
  const effectiveRate = over > 0 ? (tax / over) * 100 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <label className="label">Team total salary ($M)</label>
        <input className="input" value={salary} onChange={(e) => setSalary(e.target.value)} inputMode="decimal" />
        <label className="label mt-4">Luxury tax line ($M)</label>
        <input className="input" value={taxLine} onChange={(e) => setTaxLine(e.target.value)} inputMode="decimal" />
        <p className="mt-1 text-xs text-gray-400">2025–26 tax line ≈ $187.9M</p>

        <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3">
          <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} className="h-4 w-4 accent-orange-500" />
          <span className="text-sm text-gray-700">Repeat taxpayer (paid tax in 3 of past 4 seasons)</span>
        </label>
      </div>

      <div className="rounded-xl bg-gray-50 p-5">
        <h3 className="mb-4 font-bold text-ink">Tax bill</h3>
        {over === 0 ? (
          <div className="rounded-lg bg-green-50 p-5 text-center">
            <div className="text-3xl">✅</div>
            <div className="mt-2 font-bold text-green-700">Under the tax line</div>
            <p className="mt-1 text-sm text-green-600">No luxury tax owed.</p>
          </div>
        ) : (
          <>
            <div className="stat-box">
              <div className="text-xs text-gray-500">Estimated luxury tax</div>
              <div className="text-3xl font-extrabold text-red-600">${tax.toFixed(2)}M</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="text-xs text-gray-500">Amount over line</div>
                <div className="font-bold text-ink">${over.toFixed(1)}M</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="text-xs text-gray-500">Effective rate</div>
                <div className="font-bold text-ink">{effectiveRate.toFixed(0)}%</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 text-xs font-semibold text-gray-600">Bracket breakdown</div>
              <div className="space-y-1 text-xs text-gray-600">
                {BRACKETS.map((b, i) => {
                  const lower = i === 0 ? 0 : BRACKETS[i - 1].upTo;
                  const applied = Math.max(0, Math.min(over, b.upTo) - lower);
                  if (applied <= 0) return null;
                  const cost = applied * (repeat ? b.repeat : b.rate);
                  return (
                    <div key={i} className="flex justify-between">
                      <span>${lower}–{b.upTo === Infinity ? "∞" : b.upTo}M over @ ${(repeat ? b.repeat : b.rate).toFixed(2)}</span>
                      <span className="font-semibold">${cost.toFixed(2)}M</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        <p className="mt-4 text-xs leading-relaxed text-gray-400">Simplified estimate using standard progressive brackets. Actual NBA tax includes additional adjustments.</p>
      </div>
    </div>
  );
}
