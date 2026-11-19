import {
  type Team, type Player, type LeagueRules, LEAGUE,
  teamSalary, apronStatus, type ApronStatus,
} from "./salary-data";

export type TradeLeg = {
  teamId: string;
  playerIds: string[];
  cash: number; // $M sent
  firstPicks: number;
  secondPicks: number;
  // Conditional / future条款 for extensibility
  conditions: string[];
};

export type TradeProposal = {
  teamA: TradeLeg;
  teamB: TradeLeg;
};

export type CheckStatus = "pass" | "fail" | "warning" | "info";
export type RuleCheck = {
  id: string;
  title: string;
  status: CheckStatus;
  team: "A" | "B" | "both";
  message: string;
};

export type RuleContext = {
  league: LeagueRules;
  teamA: Team; teamB: Team;
  outA: Player[]; outB: Player[]; // players each team sends
  inA: Player[]; inB: Player[];   // players each team receives
  salaryA: number; salaryB: number; // current team salaries BEFORE trade
  statusA: ApronStatus; statusB: ApronStatus;
  afterA: number; afterB: number; // projected salaries AFTER trade
  cashA: number; cashB: number;
  firstA: number; firstB: number;
  secondA: number; secondB: number;
};

export type TradeRule = {
  id: string;
  title: string;
  team: "A" | "B" | "both";
  evaluate: (ctx: RuleContext) => RuleCheck;
};

// ---- Salary-matching helper ---------------------------------------------
// Under the current CBA, the amount a team can take back depends on whether
// it is a taxpayer (above the first apron) and how much salary it sends out.
export function maxIncoming(outgoing: number, isApronTeam: boolean, league: LeagueRules = LEAGUE): number {
  if (isApronTeam) {
    // Apron teams can only take back 100% (plus $100k in some cases; simplified to 100%).
    return outgoing + 0.1;
  }
  if (outgoing < 7.5) return outgoing * 2 + 0.25;
  if (outgoing <= 29) return outgoing + 7.5;
  return outgoing * 1.25 + 0.25;
}

export const isApron = (s: ApronStatus) => s === "first_apron" || s === "second_apron";

// ---- Built-in rules ------------------------------------------------------
export const BUILTIN_RULES: TradeRule[] = [
  {
    id: "select-players",
    title: "Players selected",
    team: "both",
    evaluate: (c) => {
      if (c.outA.length === 0 && c.outB.length === 0)
        return { id: "select-players", title: "Players selected", team: "both", status: "fail", message: "Select at least one player from each team." };
      if (c.outA.length === 0 || c.outB.length === 0)
        return { id: "select-players", title: "Players selected", team: "both", status: "fail", message: "Both teams must send at least one player (unless using a trade exception)." };
      return { id: "select-players", title: "Players selected", team: "both", status: "pass", message: `${c.outA.length} player(s) from A, ${c.outB.length} from B.` };
    },
  },
  {
    id: "roster-size-a",
    title: "Roster size",
    team: "A",
    evaluate: (c) => {
      const n = c.teamA.players.length - c.outA.length + c.inA.length;
      if (n > c.league.maxRoster)
        return { id: "roster-size-a", title: "Roster size", team: "A", status: "fail", message: `${c.teamA.abbr} would have ${n} players — exceeds the ${c.league.maxRoster}-player limit by ${n - c.league.maxRoster}.` };
      if (n < c.league.minRoster)
        return { id: "roster-size-a", title: "Roster size", team: "A", status: "warning", message: `${c.teamA.abbr} would drop to ${n} players — below the ${c.league.minRoster}-player active minimum.` };
      return { id: "roster-size-a", title: "Roster size", team: "A", status: "pass", message: `${c.teamA.abbr}: ${c.teamA.players.length} → ${n} players.` };
    },
  },
  {
    id: "roster-size-b",
    title: "Roster size",
    team: "B",
    evaluate: (c) => {
      const n = c.teamB.players.length - c.outB.length + c.inB.length;
      if (n > c.league.maxRoster)
        return { id: "roster-size-b", title: "Roster size", team: "B", status: "fail", message: `${c.teamB.abbr} would have ${n} players — exceeds the ${c.league.maxRoster}-player limit by ${n - c.league.maxRoster}.` };
      if (n < c.league.minRoster)
        return { id: "roster-size-b", title: "Roster size", team: "B", status: "warning", message: `${c.teamB.abbr} would drop to ${n} players — below the ${c.league.minRoster}-player active minimum.` };
      return { id: "roster-size-b", title: "Roster size", team: "B", status: "pass", message: `${c.teamB.abbr}: ${c.teamB.players.length} → ${n} players.` };
    },
  },
  {
    id: "salary-match-a",
    title: "Salary matching",
    team: "A",
    evaluate: (c) => {
      const out = c.outA.reduce((s, p) => s + p.salary, 0);
      const incoming = c.inA.reduce((s, p) => s + p.salary, 0);
      const max = maxIncoming(out, isApron(c.statusA), c.league);
      if (incoming > max + 0.001)
        return { id: "salary-match-a", title: "Salary matching", team: "A", status: "fail", message: `${c.teamA.abbr} sends $${out.toFixed(1)}M but takes back $${incoming.toFixed(1)}M; limit is $${max.toFixed(1)}M (${isApron(c.statusA) ? "apron team: 100%" : "standard matching"}). Over by $${(incoming - max).toFixed(1)}M.` };
      return { id: "salary-match-a", title: "Salary matching", team: "A", status: "pass", message: `$${incoming.toFixed(1)}M in ≤ $${max.toFixed(1)}M allowed.` };
    },
  },
  {
    id: "salary-match-b",
    title: "Salary matching",
    team: "B",
    evaluate: (c) => {
      const out = c.outB.reduce((s, p) => s + p.salary, 0);
      const incoming = c.inB.reduce((s, p) => s + p.salary, 0);
      const max = maxIncoming(out, isApron(c.statusB), c.league);
      if (incoming > max + 0.001)
        return { id: "salary-match-b", title: "Salary matching", team: "B", status: "fail", message: `${c.teamB.abbr} sends $${out.toFixed(1)}M but takes back $${incoming.toFixed(1)}M; limit is $${max.toFixed(1)}M (${isApron(c.statusB) ? "apron team: 100%" : "standard matching"}). Over by $${(incoming - max).toFixed(1)}M.` };
      return { id: "salary-match-b", title: "Salary matching", team: "B", status: "pass", message: `$${incoming.toFixed(1)}M in ≤ $${max.toFixed(1)}M allowed.` };
    },
  },
  {
    id: "cash-limit-a",
    title: "Cash considerations",
    team: "A",
    evaluate: (c) => {
      if (c.cashA > c.league.cashTradeLimit)
        return { id: "cash-limit-a", title: "Cash considerations", team: "A", status: "fail", message: `${c.teamA.abbr} sends $${c.cashA.toFixed(1)}M cash — exceeds the $${c.league.cashTradeLimit.toFixed(1)}M annual cash-trade limit.` };
      if (c.cashA > c.teamA.cashAvailable)
        return { id: "cash-limit-a", title: "Cash considerations", team: "A", status: "fail", message: `${c.teamA.abbr} only has $${c.teamA.cashAvailable.toFixed(1)}M available cash.` };
      if (c.cashA > 0 && c.statusA === "second_apron")
        return { id: "cash-limit-a", title: "Cash considerations", team: "A", status: "fail", message: `Second-apron teams cannot send cash in trades.` };
      return { id: "cash-limit-a", title: "Cash considerations", team: "A", status: c.cashA > 0 ? "info" : "pass", message: c.cashA > 0 ? `$${c.cashA.toFixed(1)}M cash sent.` : "No cash sent." };
    },
  },
  {
    id: "cash-limit-b",
    title: "Cash considerations",
    team: "B",
    evaluate: (c) => {
      if (c.cashB > c.league.cashTradeLimit)
        return { id: "cash-limit-b", title: "Cash considerations", team: "B", status: "fail", message: `${c.teamB.abbr} sends $${c.cashB.toFixed(1)}M cash — exceeds the $${c.league.cashTradeLimit.toFixed(1)}M annual limit.` };
      if (c.cashB > c.teamB.cashAvailable)
        return { id: "cash-limit-b", title: "Cash considerations", team: "B", status: "fail", message: `${c.teamB.abbr} only has $${c.teamB.cashAvailable.toFixed(1)}M available cash.` };
      if (c.cashB > 0 && c.statusB === "second_apron")
        return { id: "cash-limit-b", title: "Cash considerations", team: "B", status: "fail", message: `Second-apron teams cannot send cash in trades.` };
      return { id: "cash-limit-b", title: "Cash considerations", team: "B", status: c.cashB > 0 ? "info" : "pass", message: c.cashB > 0 ? `$${c.cashB.toFixed(1)}M cash sent.` : "No cash sent." };
    },
  },
  {
    id: "no-trade-a",
    title: "No-trade clauses",
    team: "A",
    evaluate: (c) => {
      const ntc = c.outA.filter((p) => p.noTradeClause);
      if (ntc.length) return { id: "no-trade-a", title: "No-trade clauses", team: "A", status: "warning", message: `${ntc.map((p) => p.name).join(", ")} has a no-trade clause — approval required.` };
      return { id: "no-trade-a", title: "No-trade clauses", team: "A", status: "pass", message: "No no-trade clauses." };
    },
  },
  {
    id: "no-trade-b",
    title: "No-trade clauses",
    team: "B",
    evaluate: (c) => {
      const ntc = c.outB.filter((p) => p.noTradeClause);
      if (ntc.length) return { id: "no-trade-b", title: "No-trade clauses", team: "B", status: "warning", message: `${ntc.map((p) => p.name).join(", ")} has a no-trade clause — approval required.` };
      return { id: "no-trade-b", title: "No-trade clauses", team: "B", status: "pass", message: "No no-trade clauses." };
    },
  },
  {
    id: "apron-a",
    title: "Apron / hard cap",
    team: "A",
    evaluate: (c) => {
      const max = c.statusA === "second_apron" ? c.league.secondApron : c.statusA === "first_apron" ? c.league.firstApron : null;
      if (max && c.afterA > max + 0.001)
        return { id: "apron-a", title: "Apron / hard cap", team: "A", status: "fail", message: `${c.teamA.abbr} would finish at $${c.afterA.toFixed(1)}M — above its $${max.toFixed(1)}M hard cap.` };
      if (c.outA.length > 1 && c.statusA === "second_apron")
        return { id: "apron-a", title: "Apron / hard cap", team: "A", status: "warning", message: `Second-apron teams cannot aggregate multiple salaries to acquire a player.` };
      return { id: "apron-a", title: "Apron / hard cap", team: "A", status: "pass", message: `Projected $${c.afterA.toFixed(1)}M within limits.` };
    },
  },
  {
    id: "apron-b",
    title: "Apron / hard cap",
    team: "B",
    evaluate: (c) => {
      const max = c.statusB === "second_apron" ? c.league.secondApron : c.statusB === "first_apron" ? c.league.firstApron : null;
      if (max && c.afterB > max + 0.001)
        return { id: "apron-b", title: "Apron / hard cap", team: "B", status: "fail", message: `${c.teamB.abbr} would finish at $${c.afterB.toFixed(1)}M — above its $${max.toFixed(1)}M hard cap.` };
      if (c.outB.length > 1 && c.statusB === "second_apron")
        return { id: "apron-b", title: "Apron / hard cap", team: "B", status: "warning", message: `Second-apron teams cannot aggregate multiple salaries to acquire a player.` };
      return { id: "apron-b", title: "Apron / hard cap", team: "B", status: "pass", message: `Projected $${c.afterB.toFixed(1)}M within limits.` };
    },
  },
  {
    id: "picks-a",
    title: "Draft picks",
    team: "A",
    evaluate: (c) => {
      if (c.firstA > c.teamA.firstPicks)
        return { id: "picks-a", title: "Draft picks", team: "A", status: "fail", message: `${c.teamA.abbr} only owns ${c.teamA.firstPicks} tradable first-round pick(s).` };
      if (c.secondA > c.teamA.secondPicks)
        return { id: "picks-a", title: "Draft picks", team: "A", status: "fail", message: `${c.teamA.abbr} only owns ${c.teamA.secondPicks} tradable second-round pick(s).` };
      return { id: "picks-a", title: "Draft picks", team: "A", status: c.firstA + c.secondA > 0 ? "info" : "pass", message: c.firstA + c.secondA > 0 ? `${c.firstA} first + ${c.secondA} second sent.` : "No picks sent." };
    },
  },
  {
    id: "picks-b",
    title: "Draft picks",
    team: "B",
    evaluate: (c) => {
      if (c.firstB > c.teamB.firstPicks)
        return { id: "picks-b", title: "Draft picks", team: "B", status: "fail", message: `${c.teamB.abbr} only owns ${c.teamB.firstPicks} tradable first-round pick(s).` };
      if (c.secondB > c.teamB.secondPicks)
        return { id: "picks-b", title: "Draft picks", team: "B", status: "fail", message: `${c.teamB.abbr} only owns ${c.teamB.secondPicks} tradable second-round pick(s).` };
      return { id: "picks-b", title: "Draft picks", team: "B", status: c.firstB + c.secondB > 0 ? "info" : "pass", message: c.firstB + c.secondB > 0 ? `${c.firstB} first + ${c.secondB} second sent.` : "No picks sent." };
    },
  },
];

// ---- Extensible registry -------------------------------------------------
let registry: TradeRule[] = [...BUILTIN_RULES];

export function registerRule(rule: TradeRule): void {
  if (registry.some((r) => r.id === rule.id)) {
    console.warn(`Trade rule "${rule.id}" already registered; replacing.`);
    registry = registry.map((r) => (r.id === rule.id ? rule : r));
  } else {
    registry = [...registry, rule];
  }
}

export function resetRules(): void {
  registry = [...BUILTIN_RULES];
}

export function allRules(): TradeRule[] {
  return [...registry];
}

export function evaluateTrade(
  teams: Team[],
  proposal: TradeProposal,
  league: LeagueRules = LEAGUE,
): { checks: RuleCheck[]; legal: boolean; ctx: RuleContext } {
  const teamA = teams.find((t) => t.id === proposal.teamA.teamId)!;
  const teamB = teams.find((t) => t.id === proposal.teamB.teamId)!;
  if (!teamA || !teamB) throw new Error("Both teams must be selected.");

  const byId = (t: Team, ids: string[]) => t.players.filter((p) => ids.includes(p.id));
  const outA = byId(teamA, proposal.teamA.playerIds);
  const outB = byId(teamB, proposal.teamB.playerIds);
  const salaryA = teamSalary(teamA);
  const salaryB = teamSalary(teamB);
  const outSalaryA = outA.reduce((s, p) => s + p.salary, 0);
  const outSalaryB = outB.reduce((s, p) => s + p.salary, 0);

  const ctx: RuleContext = {
    league,
    teamA, teamB,
    outA, outB,
    inA: outB, inB: outA,
    salaryA, salaryB,
    statusA: apronStatus(salaryA, league),
    statusB: apronStatus(salaryB, league),
    afterA: salaryA - outSalaryA + outSalaryB,
    afterB: salaryB - outSalaryB + outSalaryA,
    cashA: proposal.teamA.cash,
    cashB: proposal.teamB.cash,
    firstA: proposal.teamA.firstPicks,
    firstB: proposal.teamB.firstPicks,
    secondA: proposal.teamA.secondPicks,
    secondB: proposal.teamB.secondPicks,
  };

  const checks = registry.map((rule) => rule.evaluate(ctx));
  const legal = checks.every((c) => c.status !== "fail");
  return { checks, legal, ctx };
}
