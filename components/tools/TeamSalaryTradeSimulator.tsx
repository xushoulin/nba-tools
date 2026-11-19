"use client";

import { useState } from "react";
import Link from "next/link";
import { INITIAL_TEAMS, type Team } from "@/lib/salary-data";
import SalaryBoard from "@/components/salary/SalaryBoard";
import TradeSimulator from "@/components/salary/TradeSimulator";

export default function TeamSalaryTradeSimulator() {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [tab, setTab] = useState<"board" | "trade">("board");

  function updatePlayer(teamId: string, playerId: string, field: "salary" | "years", value: number) {
    setTeams((prev) => prev.map((t) =>
      t.id !== teamId ? t : {
        ...t,
        players: t.players.map((p) =>
          p.id !== playerId ? p : {
            ...p,
            [field]: value,
            totalValue: field === "salary" ? value * p.years : p.salary * value,
          }
        ),
      }
    ));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab("board")}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition ${
            tab === "board" ? "border-court text-court" : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          💵 Team payrolls
        </button>
        <button
          onClick={() => setTab("trade")}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition ${
            tab === "trade" ? "border-court text-court" : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          🔄 Trade simulator
        </button>
      </div>

      {tab === "board" ? (
        <SalaryBoard teams={teams} onUpdatePlayer={updatePlayer} onResetData={() => setTeams(INITIAL_TEAMS)} />
      ) : (
        <TradeSimulator teams={teams} />
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm">
        <span className="text-orange-900">
          Prefer a cleaner read-only view with team logos and player headshots?
        </span>
        <Link href="/teams" className="font-semibold text-court hover:underline">
          Browse all 30 team rosters →
        </Link>
      </div>

      <details className="mt-8 rounded-xl border border-gray-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold text-ink">For developers: extending the rule engine</summary>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
          <p>Trades are validated by a registry of pure rule functions in <code className="rounded bg-gray-100 px-1">lib/trade-rules.ts</code>. Each rule receives a context with both teams, outgoing/incoming players, salaries, apron status, cash, and picks, then returns a pass / fail / warning / info check with a human-readable reason.</p>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">{`import { registerRule } from "@/lib/trade-rules";

registerRule({
  id: "my-league-rule",
  title: "My house rule",
  team: "both",
  evaluate: (ctx) => ({
    id: "my-league-rule",
    title: "My house rule",
    team: "both",
    status: ctx.afterA > 200 ? "fail" : "pass",
    message: "Team A must stay under $200M",
  }),
});`}</pre>
          <p>Call <code className="rounded bg-gray-100 px-1">evaluateTrade(teams, proposal, league)</code> to run all registered rules. Built-in rules cover roster size, salary matching, cash limits, no-trade clauses, apron hard caps, and draft-pick inventory. Reset with <code className="rounded bg-gray-100 px-1">resetRules()</code>.</p>
        </div>
      </details>
    </div>
  );
}
