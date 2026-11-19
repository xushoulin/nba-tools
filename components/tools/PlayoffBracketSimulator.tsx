"use client";

import { useState } from "react";

type Team = { seed: number; name: string };
const TEAMS: Team[] = [
  { seed: 1, name: "1 seed" }, { seed: 8, name: "8 seed" },
  { seed: 4, name: "4 seed" }, { seed: 5, name: "5 seed" },
  { seed: 2, name: "2 seed" }, { seed: 7, name: "7 seed" },
  { seed: 3, name: "3 seed" }, { seed: 6, name: "6 seed" },
];

function simulate(a: Team, b: Team): Team {
  // Higher seed more likely to win, but upsets happen.
  const aChance = 0.5 + (b.seed - a.seed) * 0.045;
  return Math.random() < Math.max(0.15, Math.min(0.85, aChance)) ? a : b;
}

export default function PlayoffBracketSimulator() {
  const [picks, setPicks] = useState<(number | null)[]>([null, null, null, null, null, null, null]);
  const champion = picks[6] !== null ? TEAMS[picks[6]!] : null;

  function autoSimulate() {
    const r1 = [simulate(TEAMS[0], TEAMS[1]), simulate(TEAMS[2], TEAMS[3]), simulate(TEAMS[4], TEAMS[5]), simulate(TEAMS[6], TEAMS[7])];
    const r2 = [simulate(r1[0], r1[1]), simulate(r1[2], r1[3])];
    const r3 = simulate(r2[0], r2[1]);
    const idx = (t: Team) => TEAMS.findIndex((x) => x.seed === t.seed);
    setPicks([idx(r1[0]), idx(r1[1]), idx(r1[2]), idx(r1[3]), idx(r2[0]), idx(r2[1]), idx(r3)]);
  }

  function pick(slot: number, team: Team) {
    const next = [...picks];
    next[slot] = TEAMS.findIndex((x) => x.seed === team.seed);
    // Clear downstream picks when an earlier result changes.
    if (slot < 4) { next[4] = null; next[5] = null; next[6] = null; }
    if (slot === 4 || slot === 5) next[6] = null;
    setPicks(next);
  }

  const round1 = [
    [TEAMS[0], TEAMS[1]], [TEAMS[2], TEAMS[3]], [TEAMS[4], TEAMS[5]], [TEAMS[6], TEAMS[7]],
  ];
  const round2 = [
    [picks[0], picks[1]], [picks[2], picks[3]],
  ].map((pair) => pair.map((i) => (i === null ? null : TEAMS[i])));
  const round3 = [[picks[4], picks[5]]].map((pair) => pair.map((i) => (i === null ? null : TEAMS[i])));

  function Matchup({ slot, a, b }: { slot: number; a: Team | null; b: Team | null }) {
    const selected = picks[slot];
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        {[a, b].map((team, j) =>
          team ? (
            <button
              key={j}
              onClick={() => pick(slot, team)}
              className={`mb-1 flex w-full items-center justify-between rounded px-2 py-1.5 text-sm transition ${
                selected === TEAMS.findIndex((x) => x.seed === team.seed)
                  ? "bg-court font-bold text-white"
                  : "hover:bg-orange-50"
              }`}
            >
              <span>{team.name}</span><span className="opacity-70">#{team.seed}</span>
            </button>
          ) : (
            <div key={j} className="mb-1 rounded bg-gray-50 px-2 py-1.5 text-sm text-gray-400">TBD</div>
          )
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">Click a team to advance them, or let the simulator pick with upsets built in.</p>
        <button onClick={autoSimulate} className="btn-primary whitespace-nowrap">🎲 Simulate all</button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-center text-sm font-bold uppercase tracking-wide text-gray-500">Round 1</h3>
          <div className="space-y-3">{round1.map(([a, b], i) => <Matchup key={i} slot={i} a={a} b={b} />)}</div>
        </div>
        <div>
          <h3 className="mb-3 text-center text-sm font-bold uppercase tracking-wide text-gray-500">Semifinals</h3>
          <div className="space-y-3">{round2.map(([a, b], i) => <Matchup key={i} slot={4 + i} a={a} b={b} />)}</div>
        </div>
        <div>
          <h3 className="mb-3 text-center text-sm font-bold uppercase tracking-wide text-gray-500">Final</h3>
          <div className="space-y-3">{round3.map(([a, b], i) => <Matchup key={i} slot={6} a={a} b={b} />)}</div>
          {champion && (
            <div className="mt-4 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-5 text-center text-white shadow-lg">
              <div className="text-3xl">🏆</div>
              <div className="mt-2 text-xs uppercase tracking-wide opacity-90">Your champion</div>
              <div className="text-xl font-extrabold">{champion.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
