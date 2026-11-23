import type { Guide } from "./types";

export const guide: Guide = {
  slug: "nba-luxury-tax-explained",
  title: "NBA luxury tax explained: brackets, repeaters and what a bill looks like",
  shortTitle: "Luxury tax explained",
  description:
    "How the NBA luxury tax is calculated step by step: the 2026-27 tax line, the progressive bracket rates, the repeat-offender surcharge and a worked example.",
  dek:
    "The NBA luxury tax is a progressive per-dollar bill on payroll above $200.428M in 2026-27. It starts at $1.50 per dollar for a first-time taxpayer and rises through $5M brackets, with teams that paid tax in three of the previous four seasons paying $2.50 from the first dollar.",
  icon: "🧾",
  published: "2026-11-23",
  updated: "2026-11-23",
  readingMinutes: 7,
  tools: ["luxury-tax-calculator", "salary-cap-calculator", "team-salary-trade-simulator"],
  takeaways: [
    "2026-27 tax line: $200.428M. Anything above that is taxed, with no grace period.",
    "Rates climb in $5M brackets: $1.50, $1.75, $2.50, $3.25, then +$0.50 per additional $5M for first-time taxpayers.",
    "Repeat taxpayers — over the tax line in three of the previous four seasons — start at $2.50 and climb faster.",
    "The bill is assessed on the final day of the regular season, using tax payroll, which excludes cap holds but includes likely bonuses and dead money.",
    "A team $18M over the line owes about $38.5M as a first-time taxpayer, or about $56.5M as a repeater.",
  ],
  sections: [
    {
      id: "mechanics",
      heading: "The mechanism in one paragraph",
      blocks: [
        {
          kind: "p",
          text: "At the end of the regular season the league calculates each team's tax payroll, subtracts the tax line, and bills the remainder using progressive brackets. The first $5M over costs $1.50 per dollar, the next $5M costs $1.75 per dollar, and so on. Above $20M over, every additional $5M adds $0.50 to the rate. The money is not a fine for breaking a rule — the tax line is a permitted ceiling and paying the tax is a legitimate strategy — it is a redistribution mechanism, with roughly half of the proceeds split among the teams that stayed under the line.",
        },
      ],
    },
    {
      id: "brackets",
      heading: "The bracket table",
      blocks: [
        {
          kind: "table",
          head: ["Amount over the tax line", "First-time taxpayer rate", "Repeat taxpayer rate"],
          rows: [
            ["$0 - $5M", "$1.50", "$2.50"],
            ["$5M - $10M", "$1.75", "$2.75"],
            ["$10M - $15M", "$2.50", "$3.50"],
            ["$15M - $20M", "$3.25", "$4.25"],
            ["Each additional $5M", "+$0.50 per bracket", "+$0.50 per bracket"],
          ],
          caption:
            "Rates are per dollar of payroll in that bracket. A team $12M over pays the first bracket rate on the first $5M, the second on the next $5M, and so on.",
        },
        {
          kind: "p",
          text: "Two details are easy to miss. The rates are marginal, not flat — being $12M over does not mean paying $2.50 on all $12M. And the bracket boundaries are fixed at $5M regardless of how far the cap rises, which is why an increasing cap slowly moves a given payroll into cheaper brackets.",
        },
      ],
    },
    {
      id: "worked-example",
      heading: "A worked example: $18M over the line",
      blocks: [
        {
          kind: "p",
          text: "Take a team with a $218.428M tax payroll against a $200.428M line — $18M over. As a first-time taxpayer the bill breaks down like this:",
        },
        {
          kind: "table",
          head: ["Bracket", "Amount taxed", "Rate", "Cost"],
          rows: [
            ["$0 - $5M", "$5.0M", "$1.50", "$7.50M"],
            ["$5M - $10M", "$5.0M", "$1.75", "$8.75M"],
            ["$10M - $15M", "$5.0M", "$2.50", "$12.50M"],
            ["$15M - $18M", "$3.0M", "$3.25", "$9.75M"],
            ["Total", "$18.0M", "effective $2.14", "$38.50M"],
          ],
        },
        {
          kind: "p",
          text: "The same payroll as a repeat taxpayer costs $56.50M — $8M more in tax on identical spending. That difference, not the tax itself, is what drives the roster decisions you see every February: a repeater facing a $56M bill has a strong incentive to shed one mid-sized contract before the last day of the season.",
        },
        {
          kind: "note",
          title: "Effective rate, not headline rate",
          text: "The table above shows an effective rate of $2.14 per dollar on $18M of overage, even though the top bracket rate is $3.25. When people say a team is 'paying $3.25 on the dollar', they mean the marginal rate on the next dollar, not the average.",
        },
      ],
    },
    {
      id: "repeater",
      heading: "Who counts as a repeat taxpayer",
      blocks: [
        {
          kind: "p",
          text: "A team is a repeat taxpayer if it finished above the tax line in at least three of the four preceding seasons. The status is assessed season by season, so a team can drop out of repeater status by spending one year below the line — which is exactly why some front offices accept a single 'gap year' rather than pay repeater rates indefinitely.",
        },
        {
          kind: "ul",
          items: [
            "The four-season window counts the current season plus the three before it in practice: three taxpaying years in four triggers the surcharge.",
            "Repeater status is not permanently attached to a franchise. It resets once the team has spent enough seasons below the line.",
            "The surcharge applies to every bracket, not just the first one, which is why the gap between the two columns widens as the overage grows.",
          ],
        },
      ],
    },
    {
      id: "tax-payroll",
      heading: "What counts in tax payroll (and what does not)",
      blocks: [
        {
          kind: "p",
          text: "Tax payroll is close to, but not identical to, cap payroll. The differences matter at the margins and are a frequent source of confusion when a fan's hand calculation does not match a reported bill.",
        },
        {
          kind: "table",
          head: ["Item", "Counts toward tax payroll?"],
          rows: [
            ["Guaranteed player salary", "Yes"],
            ["Likely bonuses", "Yes"],
            ["Unlikely bonuses", "No, unless actually earned"],
            ["Dead money from waived players", "Yes"],
            ["Stretched salary", "Yes, at the reduced annual amount"],
            ["Cap holds for the team's own free agents", "No"],
            ["Unused exceptions", "No"],
          ],
        },
        {
          kind: "p",
          text: "Because cap holds do not count, a team's tax position can look dramatically better than its cap position in July, before free agents are re-signed. It also means renouncing a free agent does nothing for the tax bill — the salary only matters once it is actually paid.",
        },
      ],
    },
    {
      id: "timing",
      heading: "Timing: the tax is measured on one specific day",
      blocks: [
        {
          kind: "p",
          text: "The bill is based on payroll on the final day of the regular season, not on the payroll at any other point in the year. Salaries are prorated by days spent on the roster, so a player traded in December counts against both teams proportionally. This creates the annual ritual of teams waiving or trading salary in the days before the season ends to drop under a bracket boundary — a move worth millions for a few days of paperwork.",
        },
        {
          kind: "p",
          text: "It also means mid-season trades shift tax obligations between teams in ways that are not obvious from the headline salaries. A team acquiring an expiring contract in February is buying cap flexibility for the following summer and a prorated tax charge for the current one.",
        },
      ],
    },
    {
      id: "apron-difference",
      heading: "The tax is money; the aprons are rules",
      blocks: [
        {
          kind: "p",
          text: "The most consequential confusion in NBA payroll discussion is treating the tax line and the aprons as one system. They are two systems that happen to be stacked. The tax line costs money and nothing else. The first apron removes the full mid-level, the bi-annual exception and sign-and-trade acquisitions. The second apron goes further: no aggregating salaries in trades, no sending cash in trades, and a future first-round pick frozen.",
        },
        {
          kind: "p",
          text: "A team can therefore be a taxpayer with a $30M bill and full roster flexibility, or a non-taxpayer that is nonetheless hard-capped and unable to make the trade it wants. When you evaluate a deal, check the apron position first and the tax bill second.",
        },
      ],
    },
    {
      id: "check-your-own",
      heading: "Check a specific team",
      blocks: [
        {
          kind: "p",
          text: "The luxury tax calculator on this site applies the same bracket table shown above to any payroll you enter, and lets you switch between first-time and repeat taxpayer status. If you want to see how a trade changes the bill, the salary and trade simulator shows the before-and-after tax position for both teams using real 2026-27 payrolls.",
        },
        {
          kind: "note",
          title: "Estimates, not invoices",
          text: "Bills shown here are modelled from published rules and point-in-time payroll data. The league's actual calculation includes bonus treatment, proration and timing effects that a fan tool cannot fully reproduce.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How is the NBA luxury tax calculated?",
      a: "Take the team's tax payroll on the final day of the regular season, subtract the $200.428M tax line for 2026-27, then apply progressive $5M brackets: $1.50 per dollar for the first $5M over, $1.75 for the next $5M, $2.50 for the next, $3.25 for the next, and +$0.50 per additional bracket.",
    },
    {
      q: "What makes a team a repeat taxpayer?",
      a: "Finishing above the tax line in at least three of the previous four seasons. Repeaters pay $2.50 per dollar from the first bracket instead of $1.50, and the surcharge applies to every bracket, so the gap widens the further a team goes over.",
    },
    {
      q: "Where does the luxury tax money go?",
      a: "Roughly half is distributed to teams that finished below the tax line, and the remainder goes to league purposes. It is a redistribution mechanism rather than a penalty paid to the league as a fine.",
    },
    {
      q: "Can a team avoid the tax by trading a contract late in the season?",
      a: "Sometimes. The bill is assessed on the final day of the regular season with salaries prorated by days on the roster, so moving salary before that date reduces the charge. Teams do exactly this to drop below a bracket boundary, which is why late-season waivers are often about arithmetic rather than basketball.",
    },
    {
      q: "Do cap holds count toward the luxury tax?",
      a: "No. Tax payroll excludes cap holds and unused exceptions, but includes guaranteed salary, likely bonuses, dead money and stretched salary. That is why a team's July cap sheet and its eventual tax bill can look very different.",
    },
  ],
};
