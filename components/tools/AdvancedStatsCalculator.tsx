"use client";

import { useState } from "react";

type Field = { key: string; label: string; default: string };
const FIELDS: Field[] = [
  { key: "min", label: "Minutes played", default: "36" },
  { key: "pts", label: "Points", default: "24" },
  { key: "fgm", label: "Field goals made", default: "9" },
  { key: "fga", label: "Field goals attempted", default: "19" },
  { key: "tpm", label: "3-pointers made", default: "3" },
  { key: "ftm", label: "Free throws made", default: "3" },
  { key: "fta", label: "Free throws attempted", default: "4" },
  { key: "reb", label: "Rebounds", default: "7" },
  { key: "ast", label: "Assists", default: "5" },
  { key: "stl", label: "Steals", default: "1" },
  { key: "blk", label: "Blocks", default: "0.5" },
  { key: "tov", label: "Turnovers", default: "2.5" },
];

const EXPLANATIONS: Record<string, string> = {
  PER: "Player Efficiency Rating — per-minute production, league average = 15.",
  "TS%": "True Shooting % — scoring efficiency including 3s and free throws.",
  "eFG%": "Effective FG % — FG% that gives extra credit for three-pointers.",
  "AST/TO": "Assist-to-turnover ratio — playmaking safety.",
  "PPS": "Points per shot attempt — scoring efficiency per field goal try.",
};

export default function AdvancedStatsCalculator() {
  const [v, setV] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, f.default]))
  );
  const n = (k: string) => parseFloat(v[k] || "0") || 0;

  const fgm = n("fgm"), fga = n("fga"), tpm = n("tpm"), ftm = n("ftm"), fta = n("fta");
  const pts = n("pts"), min = n("min") || 1;
  const reb = n("reb"), ast = n("ast"), stl = n("stl"), blk = n("blk"), tov = n("tov");

  const efg = fga > 0 ? ((fgm + 0.5 * tpm) / fga) * 100 : 0;
  const ts = (fga + 0.44 * fta) > 0 ? (pts / (2 * (fga + 0.44 * fta))) * 100 : 0;
  const astTo = tov > 0 ? ast / tov : ast;
  const pps = fga > 0 ? pts / (fga + 0.44 * fta) : 0;
  // Simplified per-minute PER-like index (not the full Hollinger formula).
  const per = min > 0
    ? ((pts + reb + ast + stl + blk - (fga - fgm) - (fta - ftm) - tov) / min) * 13.5
    : 0;

  const results = [
    { k: "PER", val: per.toFixed(1) },
    { k: "TS%", val: `${ts.toFixed(1)}%` },
    { k: "eFG%", val: `${efg.toFixed(1)}%` },
    { k: "AST/TO", val: astTo.toFixed(2) },
    { k: "PPS", val: pps.toFixed(2) },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-3 font-bold text-ink">Box score inputs</h3>
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map((f) => (
            <label key={f.key}>
              <span className="label">{f.label}</span>
              <input className="input" value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} inputMode="decimal" />
            </label>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-gray-50 p-5">
        <h3 className="mb-4 font-bold text-ink">Advanced metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          {results.map((r) => (
            <div key={r.k} className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="text-xs text-gray-500">{r.k}</div>
              <div className="text-2xl font-extrabold text-ink">{r.val}</div>
              <div className="mt-1 text-[11px] leading-snug text-gray-400">{EXPLANATIONS[r.k]}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-gray-400">
          PER here is a simplified per-minute efficiency index, not the official Hollinger formula. TS% and eFG% use standard published formulas.
        </p>
      </div>
    </div>
  );
}
