"use client";

import { useState } from "react";

type Player = { id: number; name: string; value: string };

export default function FantasyTradeAnalyzer() {
  const [a, setA] = useState<Player[]>([
    { id: 1, name: "", value: "" },
    { id: 2, name: "", value: "" },
  ]);
  const [b, setB] = useState<Player[]>([{ id: 3, name: "", value: "" }]);

  const sumA = a.reduce((s, p) => s + (parseFloat(p.value) || 0), 0);
  const sumB = b.reduce((s, p) => s + (parseFloat(p.value) || 0), 0);
  const diff = sumA - sumB;
  const winner = Math.abs(diff) < 0.05 ? "Even deal" : diff > 0 ? "Side A wins" : "Side B wins";

  function upd(list: Player[], set: (v: Player[]) => void, id: number, field: "name" | "value", val: string) {
    set(list.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  }
  function PlayerList({ list, set, label }: { list: Player[]; set: (v: Player[]) => void; label: string }) {
    return (
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold text-ink">{label}</h3>
          <button className="btn-ghost" onClick={() => set([...list, { id: Date.now() + Math.random(), name: "", value: "" }])}>+ Add</button>
        </div>
        <div className="space-y-2">
          {list.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <input className="input flex-1" placeholder="Player name" value={p.name} onChange={(e) => upd(list, set, p.id, "name", e.target.value)} />
              <div className="relative w-20">
                <input className="input pr-6 text-right" placeholder="0" value={p.value} onChange={(e) => upd(list, set, p.id, "value", e.target.value)} inputMode="decimal" />
              </div>
              <button className="px-2 text-gray-400 hover:text-red-500" onClick={() => set(list.filter((x) => x.id !== p.id))}>✕</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-5 text-sm text-gray-600">
        Give each player a fantasy value from 0–10 (use your league rankings or a site like FantasyPros), then compare the two sides.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-4"><PlayerList list={a} set={setA} label="Side A receives" /></div>
        <div className="rounded-xl border border-gray-200 p-4"><PlayerList list={b} set={setB} label="Side B receives" /></div>
      </div>

      <div className="mt-6 rounded-xl bg-gray-50 p-5">
        <div className="grid grid-cols-3 items-center gap-3 text-center">
          <div>
            <div className="text-xs text-gray-500">Side A total</div>
            <div className="text-2xl font-extrabold text-ink">{sumA.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Verdict</div>
            <div className={`text-lg font-extrabold ${winner === "Even deal" ? "text-gray-600" : "text-court"}`}>{winner}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Side B total</div>
            <div className="text-2xl font-extrabold text-ink">{sumB.toFixed(1)}</div>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs text-gray-500"><span>A advantage</span><span>B advantage</span></div>
          <div className="h-3 overflow-hidden rounded-full bg-blue-200">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${(sumA / Math.max(0.1, sumA + sumB)) * 100}%` }}
            />
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-gray-400">
          Value is only part of a trade. Factor in your roster needs, schedule, and injuries before pulling the trigger.
        </p>
      </div>
    </div>
  );
}
