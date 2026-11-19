"use client";

import { useState } from "react";

const CAP = 154.6; // 2025-26 projected cap, $M
const TAX = 187.9;
const APRON1 = 195.2;
const APRON2 = 207.8;

type Row = { id: number; name: string; salary: string };

export default function SalaryCapCalculator() {
  const [cap, setCap] = useState(String(CAP));
  const [rows, setRows] = useState<Row[]>([
    { id: 1, name: "Player 1", salary: "35" },
    { id: 2, name: "Player 2", salary: "28" },
    { id: 3, name: "Player 3", salary: "20" },
  ]);

  const total = rows.reduce((s, r) => s + (parseFloat(r.salary) || 0), 0);
  const capNum = parseFloat(cap) || 0;
  const space = capNum - total;
  const overTax = Math.max(0, total - TAX);

  let status = "Under the cap";
  let statusColor = "text-green-600";
  if (total >= APRON2) { status = "Over 2nd apron — severe restrictions"; statusColor = "text-red-600"; }
  else if (total >= APRON1) { status = "Over 1st apron — restrictions apply"; statusColor = "text-orange-600"; }
  else if (total > TAX) { status = "Over the tax line"; statusColor = "text-amber-600"; }
  else if (total > capNum) { status = "Over the cap (using exceptions)"; statusColor = "text-amber-600"; }

  function update(id: number, field: "name" | "salary", value: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }
  const add = () => setRows((rs) => [...rs, { id: Date.now(), name: `Player ${rs.length + 1}`, salary: "" }]);
  const remove = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <label className="label">Salary cap ($M)</label>
        <input className="input" value={cap} onChange={(e) => setCap(e.target.value)} inputMode="decimal" />
        <p className="mt-1 text-xs text-gray-400">2025–26 cap ≈ $154.6M · tax ≈ $187.9M</p>

        <div className="mt-5 flex items-center justify-between">
          <h3 className="font-bold text-ink">Player contracts</h3>
          <button onClick={add} className="btn-ghost">+ Add player</button>
        </div>
        <div className="mt-3 space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-2">
              <input className="input flex-1" value={r.name} onChange={(e) => update(r.id, "name", e.target.value)} />
              <div className="relative w-28">
                <span className="absolute left-3 top-2 text-gray-400">$</span>
                <input className="input pl-6" value={r.salary} onChange={(e) => update(r.id, "salary", e.target.value)} inputMode="decimal" />
              </div>
              <button onClick={() => remove(r.id)} aria-label="Remove" className="px-2 text-gray-400 hover:text-red-500">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-5">
        <h3 className="mb-4 font-bold text-ink">Results</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="stat-box">
            <div className="text-xs text-gray-500">Total payroll</div>
            <div className="text-xl font-extrabold text-ink">${total.toFixed(1)}M</div>
          </div>
          <div className="stat-box">
            <div className="text-xs text-gray-500">{space >= 0 ? "Cap space" : "Over cap"}</div>
            <div className={`text-xl font-extrabold ${space >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${Math.abs(space).toFixed(1)}M
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Cap status</div>
          <div className={`mt-1 font-bold ${statusColor}`}>{status}</div>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Tax line ($187.9M)</span><span className="font-semibold">{overTax > 0 ? `+$${overTax.toFixed(1)}M over` : "Under"}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">1st apron ($195.2M)</span><span className="font-semibold">{total >= APRON1 ? "Exceeded" : "OK"}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">2nd apron ($207.8M)</span><span className="font-semibold">{total >= APRON2 ? "Exceeded" : "OK"}</span></div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-gray-400">Estimates for entertainment. Figures use 2025–26 projections and may differ from official NBA numbers.</p>
      </div>
    </div>
  );
}
