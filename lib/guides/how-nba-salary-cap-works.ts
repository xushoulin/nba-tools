import type { Guide } from "./types";

export const guide: Guide = {
  slug: "how-nba-salary-cap-works",
  title: "How the NBA salary cap actually works in 2026-27",
  shortTitle: "How the salary cap works",
  description:
    "The NBA cap is a soft ceiling with hard edges. How cap space, cap holds, Bird rights and the 2026-27 apron lines really interact, with exact figures.",
  dek:
    "The NBA salary cap is a soft ceiling, not a hard budget: in 2026-27 teams may spend up to $164.961M — or far more — but only by using the specific exceptions the CBA grants them, and crossing either apron turns that soft ceiling into a hard cap for the rest of the season.",
  icon: "💰",
  published: "2026-11-23",
  updated: "2026-11-23",
  readingMinutes: 8,
  tools: ["salary-cap-calculator", "team-salary-trade-simulator", "luxury-tax-calculator"],
  takeaways: [
    "2026-27 league figures: salary cap $164.961M, luxury tax line $200.428M, first apron $209.015M, second apron $221.686M, minimum payroll $148.465M.",
    "The cap restricts how a team can *acquire* players, not how much it may pay in total. Nearly every team finishes a season above it.",
    "Cap space is not simply cap minus salaries. Free-agent cap holds, empty roster charges, unsigned draft picks and unused exceptions all consume room.",
    "Crossing the first or second apron hard-caps a team at that line for the rest of the league year, which is why teams guard apron room more carefully than cap room.",
  ],
  sections: [
    {
      id: "short-answer",
      heading: "The short answer",
      blocks: [
        {
          kind: "p",
          text: "The NBA calls its system a soft salary cap, and that word does all the work. The cap sets the amount a team may spend on new player salaries using cap space. It does not set a maximum payroll. A team can re-sign its own free agents over the cap with Bird rights, sign others with the mid-level exception, fill the roster with minimum contracts and take on salary in trades — all while technically being 'over the cap'.",
        },
        {
          kind: "p",
          text: "What actually constrains behaviour are the two apron lines above the tax line. Once a team crosses the first apron, several roster-building tools vanish. Once it crosses the second, the restrictions become severe enough that most front offices treat that line as an absolute ceiling. In that sense the modern NBA runs on a hard cap for roughly a third of the league and a soft cap for everyone else.",
        },
      ],
    },
    {
      id: "lines",
      heading: "The five lines that matter in 2026-27",
      blocks: [
        {
          kind: "p",
          text: "These are the official 2026-27 figures, announced on 1 July 2026. Every calculation on this site uses them unless you override the inputs.",
        },
        {
          kind: "table",
          head: ["Line", "2026-27 figure", "What it controls"],
          rows: [
            ["Salary cap", "$164.961M", "How much a team may pay in new salaries using cap space alone"],
            ["Minimum payroll", "$148.465M", "Floor: teams must reach 90% of the cap by the last day of the regular season"],
            ["Luxury tax line", "$200.428M", "Payroll above this is billed at progressive per-dollar rates"],
            ["First apron", "$209.015M", "Removes sign-and-trade acquisitions, the full mid-level and the bi-annual exception"],
            ["Second apron", "$221.686M", "Bans salary aggregation in trades, cash in trades, and freezes a future first-round pick"],
          ],
        },
        {
          kind: "note",
          title: "Why the tax line and the apron are not the same thing",
          text: "The tax line is about money: cross it and you write a cheque. The aprons are about roster rules: cross them and you lose the ability to build the roster the way you want. A team can be a taxpayer without being an apron team — that is the normal state of a contender — but it cannot be an apron team without also being a taxpayer.",
        },
      ],
    },
    {
      id: "why-over-cap",
      heading: "Why almost every team is over the cap",
      blocks: [
        {
          kind: "p",
          text: "At the start of the 2026-27 season, the large majority of the league sits above $164.961M. That is not a loophole; it is the design. The CBA grants every team a set of mechanisms that let it exceed the cap, and teams use them in a deliberate order of priority.",
        },
        {
          kind: "ul",
          items: [
            "Bird rights — re-sign your own player for up to the maximum salary after he has spent three seasons with the team without changing clubs as a free agent.",
            "Early Bird rights — after two seasons, re-sign for up to 175% of the previous salary or 105% of the league average, whichever is greater.",
            "Non-Bird rights — after one season, re-sign for up to 120% of the previous salary.",
            "Mid-level exception — the non-taxpayer version for teams below the first apron, the smaller taxpayer version for teams above it, and the room version for teams with cap space.",
            "Bi-annual exception — available only to teams that did not use the mid-level and stayed below the first apron the previous season.",
            "Minimum contracts — any team may sign a player to the minimum regardless of cap position, with the league reimbursing part of the cost for veterans with three or more years of service.",
            "Rookie scale and draft picks — first-round picks have fixed salaries set by the scale, signed with an exception rather than cap space.",
            "Trades — a team over the cap can still acquire salary as long as the trade satisfies the matching rules.",
          ],
        },
        {
          kind: "p",
          text: "The order matters because most of these are mutually exclusive in practice. A team that uses cap space forfeits the full mid-level. A team that uses the full mid-level is hard-capped at the first apron. A team above the first apron has no access to the bi-annual exception at all. Building a roster is therefore a sequencing problem, not a spending problem.",
        },
      ],
    },
    {
      id: "cap-space",
      heading: "Cap space is smaller than the arithmetic suggests",
      blocks: [
        {
          kind: "p",
          text: "Fans routinely subtract salaries from the cap and conclude a team has room to sign a star. The NBA's accounting is stricter. Before a team can use cap space it must account for cap holds — placeholder charges that reserve room for players it might re-sign or must fill in.",
        },
        {
          kind: "table",
          head: ["Charge", "How it is calculated", "Can it be removed?"],
          rows: [
            ["Own free agent with Bird rights", "Roughly 150-190% of the previous salary, depending on whether that salary was above the league average", "Yes, by renouncing the rights — which forfeits the ability to re-sign over the cap"],
            ["Own free agent without Bird rights", "About 120% of the previous salary", "Yes, by renouncing"],
            ["Unsigned first-round pick", "A scale-based hold, typically 120% of the rookie-scale amount", "No — it must be signed or traded"],
            ["Empty roster spot", "A minimum-salary charge for every spot below 12 players", "No — it fills automatically as players are signed"],
            ["Dead money", "Waived or stretched salary still owed", "No"],
          ],
        },
        {
          kind: "p",
          text: "Two consequences follow. First, a team's real cap space is usually several million dollars smaller than the naive subtraction. Second, renouncing a free agent's rights is a one-way door: the room created is real, but the team can no longer re-sign that player above the cap, and it loses the ability to use him in a sign-and-trade.",
        },
      ],
    },
    {
      id: "hard-cap",
      heading: "When the soft cap becomes a hard cap",
      blocks: [
        {
          kind: "p",
          text: "A hard cap means the team may not exceed a specific line for any reason, at any point in the league year. Several routine moves trigger one, and this is the single most common reason a trade that looks fine on paper cannot be completed.",
        },
        {
          kind: "table",
          head: ["Action", "Hard cap becomes"],
          rows: [
            ["Using the non-taxpayer mid-level exception", "First apron ($209.015M)"],
            ["Using the room exception", "First apron ($209.015M)"],
            ["Using the bi-annual exception", "First apron ($209.015M)"],
            ["Acquiring a player in a sign-and-trade", "First apron ($209.015M)"],
            ["Using the taxpayer mid-level exception", "Second apron ($221.686M)"],
          ],
        },
        {
          kind: "p",
          text: "The hard cap is measured against the team's payroll at every point in the season, including the salaries it takes on in a trade. A team that is hard-capped at the first apron with only $1.2M of room cannot absorb a $3M contract even if the matching rules would otherwise allow it.",
        },
      ],
    },
    {
      id: "mistakes",
      heading: "Four mistakes that make cap discussions go wrong",
      blocks: [
        {
          kind: "ol",
          items: [
            "Treating the tax line as the cap. They differ by $35.5M in 2026-27. Being over the cap is normal; being over the tax line costs real money.",
            "Assuming expiring contracts equal cap space. They do — but only once the contract actually expires, and only net of the cap holds that replace it.",
            "Ignoring the incomplete-roster charge. A team with nine players under contract has three or more phantom minimum salaries consuming room.",
            "Forgetting that exceptions cannot be stacked with cap space. A team with $8M of room does not also get the $14M mid-level; it gets the smaller room exception instead.",
          ],
        },
      ],
    },
    {
      id: "sources",
      heading: "Where the numbers come from",
      blocks: [
        {
          kind: "p",
          text: "The four league thresholds above are the official figures published by the NBA for 2026-27. Team payrolls and individual cap hits on this site are point-in-time snapshots retrieved from HoopsHype in November 2026, and they move with every trade and waiver. Treat any specific roster total as an estimate that was accurate on the retrieval date, not as an official league record.",
        },
        {
          kind: "note",
          title: "Independent project",
          text: "NBA Tools is not affiliated with the NBA, its teams or HoopsHype. Everything here is an explanatory model of the published rules, built for fans and fantasy managers. It is not a substitute for the CBA or for a team's official cap sheet.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is the NBA salary cap hard or soft?",
      a: "It is soft at the top and hard at the edges. Teams may exceed the $164.961M cap using Bird rights, exceptions and minimum contracts, but crossing the first apron ($209.015M) or second apron ($221.686M) hard-caps them at that line for the rest of the league year.",
    },
    {
      q: "What actually counts against the cap?",
      a: "Player salaries, likely bonuses, dead money from waived players, cap holds for the team's own free agents, unsigned draft picks and an empty-roster charge for every spot below 12 players. Unused exceptions do not count.",
    },
    {
      q: "Can a team go over the cap to re-sign its own player?",
      a: "Yes. Bird rights allow a team to re-sign its own free agent for up to the maximum salary even when it is already over the cap, provided the player spent three seasons with the team without changing clubs as a free agent. Early Bird and Non-Bird rights give smaller raises after shorter tenures.",
    },
    {
      q: "What is the difference between cap space and an exception?",
      a: "Cap space is room below the cap; an exception is permission to exceed it. They cannot be combined. A team with cap space uses the room exception rather than the mid-level, and a team that uses cap space loses the full mid-level entirely.",
    },
    {
      q: "Do the 2026-27 figures change during the season?",
      a: "No. The cap, tax line and apron levels are set before the league year begins and stay fixed for that season. Team payrolls change constantly, but the thresholds they are measured against do not.",
    },
  ],
};
