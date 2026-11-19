"use client";

import { useState } from "react";

const CATS = [
  { key: "pts", label: "Points", max: 40 },
  { key: "reb", label: "Rebounds", max: 20 },
  { key: "ast", label: "Assists", max: 15 },
  { key: "stl", label: "Steals", max: 4 },
  { key: "blk", label: "Blocks", max: 4 },
  { key: "tpm", label: "3-pointers", max: 8 },
  { key: "fg", label: "FG %", max: 70 },
  { key: "ft", label: "FT %", max: 100 },
];

type Stats = Record<string, string>;
const DEFAULT_A: Stats = { pts: "27", reb: "7", ast: "5", stl: "1.2", blk: "0.6", tpm: "3.5", fg: "50", ft: "85" };
const DEFAULT_B: Stats = { pts: "24", reb: "9", ast: "7", stl: "0.9", blk: "1.1", tpm: "2.5", fg: "47", ft: "78" };

type SideProps = {
  tag: string;
  name: string;
  setName: (v: string) => void;
  stats: Stats;
  setStats: (v: Stats) => void;
};

function PlayerSide({ tag, name, setName, stats, setStats }: SideProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <label className="label">Player {tag} name</label>
      <input className="input mb-4" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        {CATS.map((c) => (
          <label key={c.key}>
            <span className="label">{c.label}</span>
            <input className="input" value={stats[c.key]} onChange={(e) => setStats({ ...stats, [c.key]: e.target.value })} inputMode="decimal" />
          </label>
        ))}
      </div>
    </div>
  );
}

export default function PlayerComparison() {
  const [nameA, setNameA] = useState("Player A");
  const [nameB, setNameB] = useState("Player B");
  const [a, setA] = useState<Stats>(DEFAULT_A);
  const [b, setB] = useState<Stats>(DEFAULT_B);

  let scoreA = 0, scoreB = 0;
  const rows = CATS.map((c) => {
    const av = parseFloat(a[c.key] || "0") || 0;
    const bv = parseFloat(b[c.key] || "0") || 0;
    scoreA += av / c.max;
    scoreB += bv / c.max;
    return { ...c, av, bv, aWin: av > bv, tie: Math.abs(av - bv) < 0.001 };
  });
  const aEdge = (scoreA / (scoreA + scoreB || 1)) * 100;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <PlayerSide tag="A" name={nameA} setName={setNameA} stats={a} setStats={setA} />
        <PlayerSide tag="B" name={nameB} setName={setNameB} stats={b} setStats={setB} />
      </div>

      <div className="mt-6 rounded-xl bg-gray-50 p-5">
        <div className="mb-4 flex items-center justify-between text-sm font-bold">
          <span className="text-court">{nameA}</span>
          <span className="text-gray-500">Overall edge</span>
          <span className="text-blue-600">{nameB}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-blue-200">
          <div className="h-full bg-court transition-all" style={{ width: `${aEdge}%` }} />
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">
          {nameA} {aEdge.toFixed(0)}% · {nameB} {(100 - aEdge).toFixed(0)}%
        </div>

        <div className="mt-6 space-y-3">
          {rows.map((r) => (
            <div key={r.key} className="grid grid-cols-[1fr_70px_1fr] items-center gap-2 text-sm">
              <div>
                <div className={`text-right font-bold ${!r.tie && r.aWin ? "text-court" : "text-gray-700"}`}>{r.av}</div>
                <div className="ml-auto h-2 rounded-l-full bg-court transition-all" style={{ width: `${Math.min(100, (r.av / r.max) * 100)}%` }} />
              </div>
              <div className="text-center text-xs text-gray-500">{r.label}</div>
              <div>
                <div className={`font-bold ${!r.tie && !r.aWin ? "text-blue-600" : "text-gray-700"}`}>{r.bv}</div>
                <div className="h-2 rounded-r-full bg-blue-500 transition-all" style={{ width: `${Math.min(100, (r.bv / r.max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
