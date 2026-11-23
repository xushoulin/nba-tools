import type { Guide } from "./types";

export const guide: Guide = {
  slug: "nba-apron-rules-explained",
  title: "NBA apron rules explained: what the first and second apron actually stop you doing",
  shortTitle: "Apron rules",
  description:
    "A complete list of first-apron and second-apron restrictions in the 2026-27 NBA season, including salary matching, the mid-level exception, aggregation, cash and the frozen first-round pick.",
  dek:
    "The apron is not a spending limit. It is a set of tools a team loses as its payroll crosses each line. Above the first apron you lose the full mid-level and the 125% trade cushion; above the second apron you lose salary aggregation, cash, every mid-level exception and the right to trade your own first-round pick seven years out.",
  icon: "🚧",
  published: "2026-11-23",
  updated: "2026-11-23",
  readingMinutes: 9,
  tools: ["team-salary-trade-simulator", "salary-cap-calculator", "luxury-tax-calculator"],
  takeaways: [
    "For 2026-27 the four lines are: salary cap $164.961M, luxury tax $200.428M, first apron $209.015M, second apron $221.686M.",
    "Above the first apron a team can only take back 100% of the salary it sends out in a trade — the usual 125% plus $100,000 cushion is gone.",
    "Above the second apron a team cannot aggregate two salaries into one matching slot, cannot send cash, and cannot use any mid-level exception at all.",
    "A second-apron team's own first-round pick seven drafts out is frozen. Staying above the line in three of five seasons moves that pick to the end of the first round.",
    "The aprons are hard caps in one direction only: a team that uses a restricted tool is hard-capped at the apron for the rest of that league year, so it cannot finish the season above the line.",
  ],
  sections: [
    {
      id: "lines",
      heading: "The four payroll lines in 2026-27",
      blocks: [
        {
          kind: "p",
          text: "The NBA has one soft cap and three thresholds above it. The cap sets what a team can spend using cap space; the tax line sets when luxury tax payments begin; the two aprons set when roster-building tools are removed. They are not the same thing, and confusing them is the most common mistake in trade discourse.",
        },
        {
          kind: "table",
          head: ["Line", "2026-27 figure", "What crosses it"],
          rows: [
            ["Salary cap", "$164.961M", "Above it, a team can only add players through exceptions and re-signings"],
            ["Luxury tax", "$200.428M", "Above it, the tax bill starts and escalates by bracket"],
            ["First apron", "$209.015M", "Loses the full mid-level, sign-and-trade acquisitions and the 125% trade cushion"],
            ["Second apron", "$221.686M", "Loses aggregation, cash, all mid-levels and the ability to trade a distant first-rounder"],
          ],
          caption: "Official 2026-27 figures, effective 1 July 2026.",
        },
        {
          kind: "note",
          title: "Why the gap matters",
          text: "The first apron sits $8.6M above the tax line and the second apron $12.7M above the first. Those gaps are deliberately narrow: a team that pays the tax casually is usually one mid-level signing away from losing its trade flexibility entirely.",
        },
      ],
    },
    {
      id: "first-apron",
      heading: "What the first apron takes away",
      blocks: [
        {
          kind: "p",
          text: "A team whose payroll is above $209.015M at the moment it makes a transaction is a first-apron team. It keeps most of its tools but loses the ones that let a capped-out roster keep improving:",
        },
        {
          kind: "ul",
          items: [
            "No non-taxpayer mid-level exception. Only the smaller taxpayer mid-level is available, and contracts signed with it are limited to two seasons.",
            "No bi-annual exception.",
            "No acquiring a player through a sign-and-trade. A team may still send a player out in a sign-and-trade, but it cannot be the team receiving the new contract.",
            "Salary matching drops to 100%. Below the apron a team may take back 125% of outgoing salary plus $100,000; above it, incoming salary must not exceed outgoing salary.",
            "No signing a player who was waived during the season if his pre-waiver salary was above the non-taxpayer mid-level amount.",
            "Traded-player exceptions created in a prior league year become unusable while the team stays above the line.",
          ],
        },
        {
          kind: "p",
          text: "The 100% matching rule is the one that decides most deadline deals. A team $4M above the first apron cannot absorb a contract $2M larger than the one it sends out, even though the same trade would be legal for a team $1M below the line. That single rule explains why contending teams so often need a third team to absorb a small salary difference.",
        },
      ],
    },
    {
      id: "second-apron",
      heading: "What the second apron takes away",
      blocks: [
        {
          kind: "p",
          text: "Above $221.686M the toolkit collapses. A second-apron team is operating under something close to a hard cap, because almost every mechanism for adding salary is gone:",
        },
        {
          kind: "table",
          head: ["Tool", "Below first apron", "First apron", "Second apron"],
          rows: [
            ["Non-taxpayer mid-level", "Yes", "No", "No"],
            ["Taxpayer mid-level", "Yes", "Yes", "No"],
            ["Bi-annual exception", "Yes", "No", "No"],
            ["Minimum contracts", "Yes", "Yes", "Yes"],
            ["Re-sign own Bird free agents", "Yes", "Yes", "Yes"],
            ["Receive a player in a sign-and-trade", "Yes", "No", "No"],
            ["Salary matching", "125% + $100K", "100%", "100%, no aggregation"],
            ["Aggregate salaries in a trade", "Yes", "Yes", "No"],
            ["Send cash in a trade", "Yes", "Yes", "No"],
            ["Trade a first-rounder 7 drafts out", "Yes", "Yes", "No — frozen"],
          ],
        },
        {
          kind: "p",
          text: "No aggregation is the constraint people underestimate. A second-apron team cannot combine two $8M contracts to match a $16M player. Every trade has to be constructed so that no single incoming salary exceeds the outgoing salary it is matched against, which effectively means one-for-one deals or deals where the team takes back less money than it sends.",
        },
        {
          kind: "note",
          title: "Sign-and-trade works in both directions",
          text: "A second-apron team cannot receive a player in a sign-and-trade, and it also cannot send its own free agent out in one to acquire a different player. It can still lose a free agent outright, which is the outcome the rule is designed to make more likely.",
        },
      ],
    },
    {
      id: "frozen-pick",
      heading: "The frozen first-round pick",
      blocks: [
        {
          kind: "p",
          text: "The draft penalty is the part with multi-year consequences. If a team finishes a regular season above the second apron, its own first-round pick seven drafts out becomes frozen: it cannot be traded, though the team still makes the selection. For a team above the line in 2026-27, the frozen asset is the 2033 first-rounder.",
        },
        {
          kind: "p",
          text: "The pick unfreezes if the team is at or below the second apron in at least three of the next four seasons. If instead it is above the second apron in three of five seasons, the frozen pick is moved to the end of the first round regardless of the team's record — the punishment is applied to the pick itself, not to the team's draft position in a single year.",
        },
        {
          kind: "ul",
          items: [
            "Frozen means untradeable, not forfeited. The team still drafts.",
            "The freeze applies to the team's own pick, not to picks acquired from other teams.",
            "Repeated second-apron seasons convert the freeze into a permanent draft-position penalty.",
            "Because the pick is stuck, a second-apron team's tradeable draft capital shrinks to swaps and acquired picks.",
          ],
        },
      ],
    },
    {
      id: "hard-cap",
      heading: "Why using a restricted tool creates a hard cap",
      blocks: [
        {
          kind: "p",
          text: "The aprons are not only thresholds a team is measured against; they are also caps a team agrees to. If a team uses the taxpayer mid-level, or acquires a player in a sign-and-trade, or uses any mechanism that is only legal below an apron, it becomes hard-capped at that apron for the remainder of the league year. It cannot finish the season above the line, no matter how the roster changes later.",
        },
        {
          kind: "p",
          text: "This is why a team that looks $3M under the first apron in July can be unable to make a trade in February: a mid-level signing in July hard-capped it, and the resulting payroll has no room left. When you read a report that a team \"cannot take back salary\", the real explanation is usually a hard cap triggered months earlier, not the current payroll number.",
        },
        {
          kind: "note",
          title: "Hard cap is a ceiling, not a target",
          text: "A hard-capped team must stay at or below the apron at all times, including after every individual transaction. There is no grace period and no end-of-season adjustment.",
        },
      ],
    },
    {
      id: "avoid",
      heading: "How teams actually get under a line",
      blocks: [
        {
          kind: "p",
          text: "There are only four levers, and every real-world payroll cleanup uses some combination of them:",
        },
        {
          kind: "ol",
          items: [
            "Trade salary out for a smaller contract or for a trade exception. The most common deadline move, and the one blocked by 100% matching for apron teams.",
            "Waive and stretch a contract. This lowers the current-season charge but adds dead money for up to five years, which usually makes the following season worse.",
            "Let a free agent walk instead of re-signing him. Effective, but it means losing the player for nothing — the outcome the second apron is designed to produce.",
            "Use the draft. Rookie-scale contracts are the cheapest legal way to add rotation minutes, which is why second-apron teams hoard second-round picks.",
          ],
        },
        {
          kind: "p",
          text: "What does not work: renouncing cap holds on a team that is already over the cap. Renouncing clears holds and therefore the ability to re-sign those players, but it does not create cap space unless the payroll was already close to the cap. A team $30M over the tax line cannot renounce its way under the first apron.",
        },
      ],
    },
    {
      id: "practical",
      heading: "Reading an apron situation in four steps",
      blocks: [
        {
          kind: "ol",
          items: [
            "Find the payroll number the team is actually measured on — team salary including all cap holds and incomplete-roster charges, not the published payroll of guaranteed deals.",
            "Compare it to the four lines above. Being $1M over the first apron and $10M over it are different problems.",
            "Check whether the team is hard-capped. A hard cap changes what is possible far more than the raw number does.",
            "Check the trade being discussed against the matching rule that applies at that tier: 125% + $100K, 100%, or 100% with no aggregation.",
          ],
        },
        {
          kind: "p",
          text: "The trade simulator on this site applies these tiers directly: it flags when a deal would push a team across an apron, when matching fails at 100%, and when aggregation is not permitted. The salary cap calculator shows the same payroll against all four lines at once, so you can see how much room a team would need to clear before a move becomes legal.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "What is the difference between the luxury tax line and the apron?",
      a: "The tax line ($200.428M in 2026-27) is where luxury tax payments begin. The aprons ($209.015M and $221.686M) are where roster-building tools are removed. A team can pay tax without being above the first apron, and the penalties at the aprons are about legality of transactions rather than money.",
    },
    {
      q: "Can a second-apron team make a trade at all?",
      a: "Yes, but only deals where it takes back no more salary than it sends out, with no aggregation of two or more contracts on either side. In practice that means one-for-one swaps, or trades that reduce payroll.",
    },
    {
      q: "What does salary aggregation mean?",
      a: "Combining two or more outgoing contracts so their total can match one larger incoming salary. A team sending $8M and $8M to acquire a $16M player is aggregating. Second-apron teams are not allowed to do it.",
    },
    {
      q: "Which first-round pick gets frozen?",
      a: "The team's own first-round pick seven drafts after the current season. A team above the second apron in 2026-27 has its 2033 first-rounder frozen: it cannot be traded, but the team still makes the pick.",
    },
    {
      q: "Do the aprons apply to the playoffs?",
      a: "Team salary is measured throughout the league year, and a hard-capped team must remain at or below the apron for the whole season including the playoffs. There is no postseason exemption from the apron rules.",
    },
    {
      q: "Is the second apron a hard cap?",
      a: "Not formally — a team can be above it. But because nearly every mechanism for adding salary is removed above the second apron, teams treat it as an operational ceiling and plan their payrolls to stay below it.",
    },
  ],
};
