import type { Guide } from "./types";

export const guide: Guide = {
  slug: "nba-trade-rules-explained",
  title: "Why NBA trades fail: matching, exceptions and the apron in plain English",
  shortTitle: "NBA trade rules",
  description:
    "The five checks every NBA trade must pass: salary matching, apron restrictions, trade exceptions, base-year compensation and contract clauses. With the 2026-27 rules.",
  dek:
    "An NBA trade is legal only if it passes five separate checks: salary matching, apron restrictions, available exceptions, contract-level clauses and roster limits. Most trades that fans build in a simulator fail on the first two, and the reason is almost always that salary matching is stricter above the first apron than below it.",
  icon: "🔁",
  published: "2026-11-23",
  updated: "2026-11-23",
  readingMinutes: 9,
  tools: ["team-salary-trade-simulator", "salary-cap-calculator", "luxury-tax-calculator"],
  takeaways: [
    "Below the first apron a team may take back up to 125% of outgoing salary plus $100,000. At or above the first apron it may take back 100% at most.",
    "Teams above the second apron cannot aggregate two salaries to match one, cannot send cash, and have a future first-round pick frozen.",
    "Trade exceptions expire one year after creation and cannot be combined with player salary or with another exception.",
    "A team under the cap does not need to match at all — it absorbs salary into cap space, which is why cap space is worth more than an equivalent exception.",
  ],
  sections: [
    {
      id: "five-checks",
      heading: "The five checks, in order",
      blocks: [
        {
          kind: "p",
          text: "Every trade is validated in the same sequence. If a deal fails, it fails at the first check it cannot clear, which is why the error message matters more than the deal itself.",
        },
        {
          kind: "ol",
          items: [
            "Salary matching — does each side send out enough salary to legally absorb what it takes back?",
            "Apron position — is either team hard-capped, and does the trade push it across a line?",
            "Exceptions — is a trade exception, mid-level or minimum being used, and is it still valid?",
            "Contract clauses — base-year compensation, poison-pill extensions, no-trade clauses, trade kickers.",
            "Roster mechanics — does each team stay within 14-15 players and the two-way limits?",
          ],
        },
      ],
    },
    {
      id: "matching",
      heading: "Check 1: salary matching",
      blocks: [
        {
          kind: "p",
          text: "Salary matching is the rule that stops a capped-out team from trading a minimum-salary player for a maximum-salary star. The allowed ratio depends on where the acquiring team sits relative to the first apron.",
        },
        {
          kind: "table",
          head: ["Acquiring team's position", "May take back", "Notes"],
          rows: [
            ["Below the cap", "Any amount up to its cap space", "No matching required; the salary is absorbed into room"],
            ["Over the cap, below the first apron", "125% of outgoing salary + $100,000", "The standard matching band used in most trades"],
            ["At or above the first apron", "100% of outgoing salary", "No 25% cushion, no $100,000 allowance"],
            ["At or above the second apron", "100% of outgoing salary", "Also cannot aggregate salaries or send cash"],
          ],
        },
        {
          kind: "p",
          text: "The 125% band is generous enough that mid-sized deals are easy to construct. Losing it above the first apron is what makes apron teams so constrained: a $10M contract can only bring back $10M, so any deal for a bigger salary requires sending out a matching big salary rather than two mid-sized ones — and above the second apron, combining those mid-sized salaries to reach the number is itself prohibited.",
        },
        {
          kind: "note",
          title: "Matching is measured on outgoing, not incoming",
          text: "The test applies separately to each team. A trade can be legal for one side and illegal for the other, which is why a deal sometimes has to be restructured with a third team or a small salary filler.",
        },
      ],
    },
    {
      id: "exceptions",
      heading: "Check 3: trade exceptions",
      blocks: [
        {
          kind: "p",
          text: "When a team sends out more salary than it takes back, the difference becomes a trade exception — a credit it can use within one year to absorb salary without matching. Exceptions are the reason a capped-out contender can add a contract in July without sending anything back.",
        },
        {
          kind: "ul",
          items: [
            "A trade exception expires one year after the date it was created. Unused, it disappears.",
            "It cannot be combined with player salary in the same trade. It is either the whole mechanism or it is not used.",
            "It cannot be combined with another trade exception.",
            "It can be used to acquire a player, or to absorb a contract in a three-team structure, but it cannot be used to sign a free agent.",
            "Teams above the first apron cannot use a trade exception created in a prior league year — only ones generated during the current season.",
          ],
        },
        {
          kind: "p",
          text: "The final point is a subtle one and a frequent source of failed trades: an apron team holding an exception from last summer may find it frozen. This is also why front offices track exception expiry dates as carefully as they track contract years.",
        },
      ],
    },
    {
      id: "byc",
      heading: "Contract-level traps: base-year, poison pill, kickers",
      blocks: [
        {
          kind: "p",
          text: "Even a trade that matches on paper can fail because the CBA values a contract differently depending on when it was signed. These rules exist to stop teams from re-signing a player purely to trade him at an inflated number.",
        },
        {
          kind: "table",
          head: ["Rule", "What it does", "When it applies"],
          rows: [
            ["Base-year compensation", "Counts the outgoing salary at 50% of the new salary for matching purposes", "A player who re-signed with a raise above 20% and is traded within six months"],
            ["Poison-pill extension", "Outgoing value is the current salary; incoming value for the new team is the average of the extension", "A first-round pick signing a rookie-scale extension"],
            ["Trade kicker", "A bonus paid to the player on trade, capped at 15% of remaining salary; counts against matching", "Contracts that include the clause"],
            ["No-trade clause", "The player must consent before any trade", "Players with eight seasons of service and four with the same team, signed as a free agent or via extension"],
          ],
        },
        {
          kind: "p",
          text: "Base-year compensation is the one that surprises people most. A player who signs a $30M extension in July and is traded in December counts as $15M outgoing, so the team cannot use his full salary to match a $30M contract coming back. This single rule has killed more deadline deals than any apron restriction.",
        },
      ],
    },
    {
      id: "apron",
      heading: "Check 2: the apron restrictions in detail",
      blocks: [
        {
          kind: "p",
          text: "For 2026-27 the first apron is $209.015M and the second is $221.686M. Crossing either line mid-season is allowed only if the team can still legally complete the transaction under the resulting hard cap. The practical restrictions are different at each line.",
        },
        {
          kind: "table",
          head: ["Restriction", "First apron", "Second apron"],
          rows: [
            ["Take back more than 100% of salary", "Blocked", "Blocked"],
            ["Acquire a player via sign-and-trade", "Blocked", "Blocked"],
            ["Use the full (non-taxpayer) mid-level", "Blocked", "Blocked"],
            ["Use the bi-annual exception", "Blocked", "Blocked"],
            ["Aggregate two salaries to match one", "Allowed", "Blocked"],
            ["Send cash in a trade", "Allowed", "Blocked"],
            ["Trade a first-round pick seven years out", "Allowed", "Frozen"],
            ["Sign a waived player above the taxpayer mid-level", "Allowed", "Blocked"],
          ],
        },
        {
          kind: "p",
          text: "The aggregation ban is the one that changes how a roster is built. Above the second apron, a team cannot package two $12M contracts to acquire a $24M player. It must send one contract of at least $24M. Since most rosters have only two or three such contracts, and those are usually the players the team wants to keep, the second apron effectively freezes a roster in place.",
        },
      ],
    },
    {
      id: "deadline",
      heading: "Timing and roster mechanics",
      blocks: [
        {
          kind: "ul",
          items: [
            "The trade deadline falls in mid-February. After it, teams may only sign free agents and waive players.",
            "Rosters must be between 14 and 15 players during the season, plus up to two two-way contracts that do not count against the 15.",
            "A trade cannot leave a team below 14 players, which is why many deals include a minimum-salary body purely to balance the count.",
            "Salaries are prorated by days on the roster for tax purposes, so a trade in December charges both teams a share of the annual salary.",
          ],
        },
      ],
    },
    {
      id: "simulate",
      heading: "Test a trade before you argue about it",
      blocks: [
        {
          kind: "p",
          text: "The salary and trade simulator on this site loads all 30 real 2026-27 payrolls and applies the matching, apron and exception rules described above. It reports which specific check failed rather than a single 'invalid trade' message, which is usually the fastest way to learn the rules — try to build the deal you have in mind, then read the reason it breaks.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "What is the NBA salary matching rule in 2026-27?",
      a: "A team over the cap but below the first apron may take back up to 125% of the salary it sends out plus $100,000. At or above the first apron the limit drops to 100%, with no allowance. A team below the cap may absorb salary into its cap space without matching anything.",
    },
    {
      q: "Why can't a team above the second apron combine salaries in a trade?",
      a: "The 2023 collective bargaining agreement bans salary aggregation for second-apron teams. The intent is to stop high-spending teams from packaging several mid-sized contracts to acquire a star, so a team above $221.686M must send one contract large enough on its own.",
    },
    {
      q: "How long does a trade exception last?",
      a: "One year from the date the trade that created it was completed. It cannot be extended, cannot be combined with another exception, and cannot be combined with player salary in the same transaction.",
    },
    {
      q: "What is base-year compensation?",
      a: "A rule that values a recently re-signed player at 50% of his new salary when he is traded within six months of signing a raise above 20%. It prevents teams from inflating a contract purely to use it as matching salary, and it is a common reason an otherwise legal-looking trade is rejected.",
    },
    {
      q: "Can a player refuse a trade?",
      a: "Only with a no-trade clause, which requires at least eight seasons of NBA service, four with the same team, and a contract signed as a free agent or via extension. Most trades require no player consent, subject to any trade kicker in the contract.",
    },
  ],
};
