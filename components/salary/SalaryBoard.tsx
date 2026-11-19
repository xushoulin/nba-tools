"use client";

import { useMemo, useState } from "react";
import {
  type Team, type Player, LEAGUE, DATA_META, teamSalary, apronStatus, STATUS_LABEL, STATUS_COLOR,
} from "@/lib/salary-data";

type Props = {
  teams: Team[];
  onUpdatePlayer: (teamId: string, playerId: string, field: "salary" | "years", value: number) => void;
  onResetData: () => void;
};

export default function SalaryBoard({ teams, onUpdatePlayer, onResetData }: Props) {
  const [query, setQuery] = useState("");
  const [conference, setConference] = useState<"all" | "East" | "West">("all");
  const [sort, setSort] = useState<"salary" | "space" | "name">("salary");
  const [expanded, setExpanded] = useState<string | null>(null);

  const view = useMemo(() => {
    let list = teams.filter((t) => conference === "all" || t.conference === conference);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) =>
        `${t.city} ${t.name} ${t.abbr}`.toLowerCase().includes(q) ||
        t.players.some((p) => p.name.toLowerCase().includes(q)),
      );
    }
    const space = (t: Team) => LEAGUE.salaryCap - teamSalary(t);
    const sorted = [...list].sort((a, b) => {
      if (sort === "salary") return teamSalary(b) - teamSalary(a);
      if (sort === "space") return space(b) - space(a);
      return a.abbr.localeCompare(b.abbr);
    });
    return sorted;
  }, [teams, query, conference, sort]);

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input
          className="input"
          placeholder="Search team or player..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="input sm:w-36" value={conference} onChange={(e) => setConference(e.target.value as typeof conference)}>
          <option value="all">All teams</option>
          <option value="East">Eastern</option>
          <option value="West">Western</option>
        </select>
        <select className="input sm:w-40" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="salary">Sort: payroll</option>
          <option value="space">Sort: cap space</option>
          <option value="name">Sort: name</option>
        </select>
        <button className="btn-ghost" onClick={onResetData}>Reset data</button>
      </div>

      {/* League context */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Metric label="Salary cap" value={`$${LEAGUE.salaryCap.toFixed(1)}M`} />
        <Metric label="Luxury tax" value={`$${LEAGUE.luxuryTax.toFixed(1)}M`} tone="amber" />
        <Metric label="1st apron" value={`$${LEAGUE.firstApron.toFixed(1)}M`} tone="orange" />
        <Metric label="2nd apron" value={`$${LEAGUE.secondApron.toFixed(1)}M`} tone="red" />
        <Metric label="Season" value={LEAGUE.season} />
      </div>

      <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600">
        <strong className="text-ink">Data source:</strong> player salaries are real {DATA_META.season} cap figures from{" "}
        {DATA_META.source}, pulled {DATA_META.retrieved}. League thresholds are the official {DATA_META.season} NBA numbers.
        Only the top contracts per team are listed, so the roster total you see runs slightly below the published team cap hit
        (shown on each card). Everything is editable — changing a salary re-runs the apron status instantly.
      </p>

      {/* Team cards */}
      <div className="grid gap-3 md:grid-cols-2">
        {view.map((team) => {
          const salary = teamSalary(team);
          const space = LEAGUE.salaryCap - salary;
          const status = apronStatus(salary, LEAGUE);
          const isOpen = expanded === team.id;
          return (
            <div key={team.id} className="card overflow-hidden">
              <button
                className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50"
                onClick={() => setExpanded(isOpen ? null : team.id)}
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-ink text-xs font-bold text-white">
                  {team.abbr.slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-ink">{team.city} {team.name}</span>
                  <span className="text-xs text-gray-500">
                    {team.conference} · {team.players.length} listed · official ${team.officialCapHit.toFixed(1)}M
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-lg font-extrabold text-ink">${salary.toFixed(1)}M</span>
                  <span className={`text-xs ${space >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {space >= 0 ? `${space.toFixed(1)}M space` : `${Math.abs(space).toFixed(1)}M over`}
                  </span>
                </span>
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${STATUS_COLOR[status]}`}>
                  {STATUS_LABEL[status]}
                </span>
                <span className="text-gray-400">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 px-4 py-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500">
                        <th className="pb-2">Player</th>
                        <th className="pb-2">Pos</th>
                        <th className="pb-2 text-right">Salary</th>
                        <th className="pb-2 text-right">Years</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.players.map((p) => (
                        <PlayerRow key={p.id} player={p} teamId={team.id} onUpdate={onUpdatePlayer} />
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <span>Cash on hand: ${team.cashAvailable.toFixed(1)}M · {team.firstPicks} 1st / {team.secondPicks} 2nd</span>
                    <span className="font-semibold text-gray-700">Total: ${salary.toFixed(1)}M</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {view.length === 0 && <p className="col-span-full py-10 text-center text-gray-400">No teams match your search.</p>}
      </div>
    </div>
  );
}

function PlayerRow({
  player, teamId, onUpdate,
}: {
  player: Player;
  teamId: string;
  onUpdate: (teamId: string, playerId: string, field: "salary" | "years", value: number) => void;
}) {
  return (
    <tr className="border-t border-gray-50">
      <td className="py-1.5 font-medium text-gray-800">
        {player.name}
        {player.noTradeClause && <span className="ml-1 text-[10px] text-amber-600">NTC</span>}
      </td>
      <td className="text-xs text-gray-500">{player.pos}</td>
      <td className="py-1.5 text-right">
        <input
          type="number" step={0.1} min={0} value={player.salary}
          onChange={(e) => onUpdate(teamId, player.id, "salary", Math.max(0, parseFloat(e.target.value) || 0))}
          className="w-20 rounded border border-gray-200 px-1.5 py-0.5 text-right text-sm"
          aria-label={`${player.name} salary`}
        />
      </td>
      <td className="py-1.5 text-right">
        <input
          type="number" step={1} min={1} value={player.years}
          onChange={(e) => onUpdate(teamId, player.id, "years", Math.max(1, parseInt(e.target.value) || 1))}
          className="w-12 rounded border border-gray-200 px-1 py-0.5 text-right text-sm"
          aria-label={`${player.name} years`}
        />
      </td>
      <td className="py-1.5 text-right font-semibold text-gray-700">${player.totalValue.toFixed(1)}M</td>
    </tr>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "amber" | "orange" | "red" }) {
  const color = tone === "red" ? "text-red-600" : tone === "orange" ? "text-orange-600" : tone === "amber" ? "text-amber-600" : "text-ink";
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`mt-0.5 text-lg font-extrabold ${color}`}>{value}</div>
    </div>
  );
}
