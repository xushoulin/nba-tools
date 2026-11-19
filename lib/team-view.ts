import {
  type Team,
  type ApronStatus,
  LEAGUE,
  teamSalary,
  apronStatus,
} from "./salary-data";

export type TeamSummary = {
  /** Sum of the contracts listed on the roster page, $M. */
  listed: number;
  /** Official 2026-27 team cap hit, $M. */
  official: number;
  /** Official cap hit minus the salary cap. Negative = room below the cap. */
  capDelta: number;
  /** Official cap hit minus the luxury tax line. */
  taxDelta: number;
  status: ApronStatus;
};

export function teamSummary(team: Team): TeamSummary {
  const official = team.officialCapHit;
  return {
    listed: teamSalary(team),
    official,
    capDelta: official - LEAGUE.salaryCap,
    taxDelta: official - LEAGUE.luxuryTax,
    status: apronStatus(official),
  };
}

/** Division display order, grouped by conference. */
export const CONFERENCE_BLOCKS: { conference: "East" | "West"; divisions: string[] }[] = [
  { conference: "East", divisions: ["Atlantic", "Central", "Southeast"] },
  { conference: "West", divisions: ["Northwest", "Pacific", "Southwest"] },
];

export function byDivision(teams: Team[], division: string): Team[] {
  return teams
    .filter((t) => t.division === division)
    .sort((a, b) => b.officialCapHit - a.officialCapHit);
}

export function conferenceTeams(teams: Team[], conference: "East" | "West"): Team[] {
  return teams.filter((t) => t.conference === conference);
}

/** "1st apron" / "Under cap" style full sentence for badges. */
export function statusSentence(s: TeamSummary): string {
  if (s.status === "under_cap") {
    return `$${Math.abs(s.capDelta).toFixed(1)}M below the salary cap`;
  }
  if (s.status === "over_cap") {
    return `$${s.capDelta.toFixed(1)}M over the cap, below the tax line`;
  }
  return `$${s.taxDelta.toFixed(1)}M over the luxury tax line`;
}
