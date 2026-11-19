"use client";

import { useMemo, useState } from "react";
import {
  type Team, LEAGUE, teamSalary, apronStatus, STATUS_LABEL, STATUS_COLOR,
} from "@/lib/salary-data";
import {
  type TradeProposal, type TradeLeg, evaluateTrade, maxIncoming, isApron,
} from "@/lib/trade-rules";

function emptyLeg(teamId: string): TradeLeg {
  return { teamId, playerIds: [], cash: 0, firstPicks: 0, secondPicks: 0, conditions: [] };
}

type Props = { teams: Team[] };

export default function TradeSimulator({ teams }: Props) {
  const [teamAId, setTeamAId] = useState(teams[0]?.id ?? "");
  const [teamBId, setTeamBId] = useState(teams[1]?.id ?? "");
  const [legA, setLegA] = useState<TradeLeg>(emptyLeg(teams[0]?.id ?? ""));
  const [legB, setLegB] = useState<TradeLeg>(emptyLeg(teams[1]?.id ?? ""));

  const teamA = teams.find((t) => t.id === teamAId);
  const teamB = teams.find((t) => t.id === teamBId);

  const proposal: TradeProposal = useMemo(() => ({
    teamA: { ...legA, teamId: teamAId },
    teamB: { ...legB, teamId: teamBId },
  }), [legA, legB, teamAId, teamBId]);

  const result = useMemo(() => {
    if (!teamA || !teamB || teamA.id === teamB.id) return null;
    try { return evaluateTrade(teams, proposal, LEAGUE); } catch { return null; }
  }, [teams, proposal, teamA, teamB]);

  function switchTeam(which: "A" | "B", id: string) {
    if (which === "A") { setTeamAId(id); setLegA(emptyLeg(id)); }
    else { setTeamBId(id); setLegB(emptyLeg(id)); }
  }

  function togglePlayer(which: "A" | "B", playerId: string) {
    const set = which === "A" ? setLegA : setLegB;
    set((leg) => ({
      ...leg,
      playerIds: leg.playerIds.includes(playerId)
        ? leg.playerIds.filter((x) => x !== playerId)
        : [...leg.playerIds, playerId],
    }));
  }

  function setField(which: "A" | "B", field: keyof TradeLeg, value: number) {
    const set = which === "A" ? setLegA : setLegB;
    set((leg) => ({ ...leg, [field]: value }));
  }

  function reset() {
    setLegA(emptyLeg(teamAId));
    setLegB(emptyLeg(teamBId));
  }

  const ctx = result?.ctx;

  return (
    <div className="space-y-6">
      {/* Team selectors */}
      <div className="grid gap-4 sm:grid-cols-2">
        {(["A", "B"] as const).map((which) => {
          const selected = which === "A" ? teamAId : teamBId;
          const team = which === "A" ? teamA : teamB;
          return (
            <div key={which} className="rounded-xl border border-gray-200 p-4">
              <label className="label">Team {which}</label>
              <select
                className="input"
                value={selected}
                onChange={(e) => switchTeam(which, e.target.value)}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.city} {t.name} ({t.abbr})</option>
                ))}
              </select>
              {team && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  <span className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_COLOR[apronStatus(teamSalary(team), LEAGUE)]}`}>
                    {STATUS_LABEL[apronStatus(teamSalary(team), LEAGUE)]}
                  </span>
                  <span>${teamSalary(team).toFixed(1)}M payroll</span>
                  <span>· {team.firstPicks} 1st / {team.secondPicks} 2nd picks</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {teamA && teamB && teamA.id === teamB.id && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">Select two different teams.</div>
      )}

      {teamA && teamB && teamA.id !== teamB.id && (
        <>
          {/* Player selection + terms */}
          <div className="grid gap-5 lg:grid-cols-2">
            <TradeSide
              label="Team A sends"
              team={teamA}
              leg={legA}
              onToggle={(id) => togglePlayer("A", id)}
              onNumber={(f, v) => setField("A", f, v)}
              accent="orange"
            />
            <TradeSide
              label="Team B sends"
              team={teamB}
              leg={legB}
              onToggle={(id) => togglePlayer("B", id)}
              onNumber={(f, v) => setField("B", f, v)}
              accent="blue"
            />
          </div>

          {/* Conditions */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink">Conditional terms</h3>
              <span className="text-xs text-gray-400">Optional · for documentation</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <ConditionInput leg={legA} setLeg={setLegA} label="From A" />
              <ConditionInput leg={legB} setLeg={setLegB} label="From B" />
            </div>
          </div>

          {/* Verdict + checks */}
          {result && (
            <>
              <div className={`rounded-xl p-5 ${result.legal ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide opacity-70">Trade verdict</div>
                    <div className={`text-2xl font-extrabold ${result.legal ? "text-green-700" : "text-red-700"}`}>
                      {result.legal ? "✅ Legal trade" : "❌ Not allowed"}
                    </div>
                  </div>
                  <button onClick={reset} className="btn-ghost">Reset</button>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  {result.legal
                    ? "All hard rules pass. Softeners (if any) are noted below."
                    : `${result.checks.filter((c) => c.status === "fail").length} rule(s) failed — see reasons below.`}
                </p>
              </div>

              {/* Before/after salary comparison */}
              {ctx && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <SalaryDelta label={`Team A · ${teamA.abbr}`} before={ctx.salaryA} after={ctx.afterA} league={LEAGUE} />
                  <SalaryDelta label={`Team B · ${teamB.abbr}`} before={ctx.salaryB} after={ctx.afterB} league={LEAGUE} />
                </div>
              )}

              {/* Rule checks */}
              <div>
                <h3 className="mb-3 font-bold text-ink">Rule-by-rule check</h3>
                <div className="space-y-2">
                  {result.checks.map((c) => (
                    <div key={c.id} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3">
                      <StatusBadge status={c.status} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-ink">
                          {c.title} <span className="ml-1 text-xs font-normal text-gray-400">· Team {c.team}</span>
                        </div>
                        <div className="mt-0.5 text-sm leading-relaxed text-gray-600">{c.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matching capacity helper */}
              {ctx && (
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  <h3 className="mb-2 font-bold text-ink">Salary-matching capacity</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      {teamA.abbr}: can take back up to{" "}
                      <strong>${maxIncoming(ctx.outA.reduce((s, p) => s + p.salary, 0), isApron(ctx.statusA), LEAGUE).toFixed(1)}M</strong>{" "}
                      for the players it sends.
                    </div>
                    <div>
                      {teamB.abbr}: can take back up to{" "}
                      <strong>${maxIncoming(ctx.outB.reduce((s, p) => s + p.salary, 0), isApron(ctx.statusB), LEAGUE).toFixed(1)}M</strong>{" "}
                      for the players it sends.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      <p className="text-xs leading-relaxed text-gray-400">
        Simplified CBA model for education and entertainment. Real trades involve BYC, trade exceptions, poison-pill contracts, stepien rules, and more. Not affiliated with the NBA.
      </p>
    </div>
  );
}

function TradeSide({
  label, team, leg, onToggle, onNumber, accent,
}: {
  label: string;
  team: Team;
  leg: TradeLeg;
  onToggle: (id: string) => void;
  onNumber: (field: "cash" | "firstPicks" | "secondPicks", value: number) => void;
  accent: "orange" | "blue";
}) {
  const [query, setQuery] = useState("");
  const selectedSalary = team.players.filter((p) => leg.playerIds.includes(p.id)).reduce((s, p) => s + p.salary, 0);
  const filtered = team.players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className={`font-bold ${accent === "orange" ? "text-orange-700" : "text-blue-700"}`}>{label}</h3>
        <span className="text-xs text-gray-500">Selected: ${selectedSalary.toFixed(1)}M</span>
      </div>
      <input
        className="input mb-3"
        placeholder={`Search ${team.abbr} players...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
        {filtered.map((p) => (
          <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50">
            <input
              type="checkbox"
              className="h-4 w-4 accent-orange-500"
              checked={leg.playerIds.includes(p.id)}
              onChange={() => onToggle(p.id)}
            />
            <span className="flex-1 text-sm text-gray-800">{p.name}</span>
            <span className="text-xs text-gray-500">{p.pos}</span>
            <span className="w-16 text-right text-sm font-semibold">${p.salary.toFixed(1)}M</span>
            <span className="w-12 text-right text-xs text-gray-400">{p.years}y</span>
          </label>
        ))}
        {filtered.length === 0 && <p className="py-4 text-center text-sm text-gray-400">No players match.</p>}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
        <NumberField label={`Cash (max $${team.cashAvailable.toFixed(1)}M)`} value={leg.cash} max={LEAGUE.cashTradeLimit} step={0.5} onChange={(v) => onNumber("cash", v)} />
        <NumberField label="1st-round picks" value={leg.firstPicks} max={team.firstPicks} step={1} onChange={(v) => onNumber("firstPicks", v)} />
        <NumberField label="2nd-round picks" value={leg.secondPicks} max={team.secondPicks} step={1} onChange={(v) => onNumber("secondPicks", v)} />
      </div>
    </div>
  );
}

function NumberField({
  label, value, max, step, onChange,
}: { label: string; value: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label>
      <span className="block text-[11px] leading-tight text-gray-500">{label}</span>
      <input
        type="number" min={0} max={max} step={step} value={value}
        onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
        className="input mt-1 px-2 py-1.5 text-sm"
      />
    </label>
  );
}

function ConditionInput({ leg, setLeg, label }: { leg: TradeLeg; setLeg: (v: TradeLeg) => void; label: string }) {
  const [text, setText] = useState("");
  const add = () => {
    if (!text.trim()) return;
    setLeg({ ...leg, conditions: [...leg.conditions, text.trim()] });
    setText("");
  };
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input className="input" placeholder="e.g. Top-4 protected 2028 1st" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} />
        <button className="btn-ghost" onClick={add}>Add</button>
      </div>
      {leg.conditions.length > 0 && (
        <ul className="mt-2 space-y-1">
          {leg.conditions.map((c, i) => (
            <li key={i} className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-xs text-gray-700">
              <span>{c}</span>
              <button className="text-gray-400 hover:text-red-500" onClick={() => setLeg({ ...leg, conditions: leg.conditions.filter((_, j) => j !== i) })}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "pass" | "fail" | "warning" | "info" }) {
  const map = {
    pass: ["✓", "bg-green-100 text-green-700"],
    fail: ["✕", "bg-red-100 text-red-700"],
    warning: ["!", "bg-amber-100 text-amber-700"],
    info: ["i", "bg-blue-100 text-blue-700"],
  } as const;
  const [icon, color] = map[status];
  return <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-bold ${color}`}>{icon}</span>;
}

function SalaryDelta({ label, before, after, league }: { label: string; before: number; after: number; league: typeof LEAGUE }) {
  const diff = after - before;
  const bStatus = apronStatus(before, league);
  const aStatus = apronStatus(after, league);
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="font-bold text-ink">{label}</div>
      <div className="mt-3 flex items-end gap-3">
        <div>
          <div className="text-xs text-gray-500">Before</div>
          <div className="text-xl font-bold text-gray-700">${before.toFixed(1)}M</div>
        </div>
        <div className="pb-1 text-gray-400">→</div>
        <div>
          <div className="text-xs text-gray-500">After</div>
          <div className="text-xl font-extrabold text-ink">${after.toFixed(1)}M</div>
        </div>
        <div className={`ml-auto pb-1 text-sm font-bold ${diff > 0 ? "text-red-600" : diff < 0 ? "text-green-600" : "text-gray-400"}`}>
          {diff >= 0 ? "+" : ""}{diff.toFixed(1)}M
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_COLOR[bStatus]}`}>{STATUS_LABEL[bStatus]}</span>
        <span className="text-gray-400">→</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_COLOR[aStatus]}`}>{STATUS_LABEL[aStatus]}</span>
      </div>
    </div>
  );
}
