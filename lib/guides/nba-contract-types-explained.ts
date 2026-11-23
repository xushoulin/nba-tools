import type { Guide } from "./types";

export const guide: Guide = {
  slug: "nba-contract-types-explained",
  title: "NBA contract types explained: rookie scale, minimums, two-way and dead money",
  shortTitle: "Contract types",
  description:
    "Every NBA contract type in one place: rookie scale, veteran minimum, two-way and 10-day deals, Exhibit 10, buyouts, stretch provisions and dead money.",
  dek:
    "There are eight contract mechanisms that decide how an NBA roster is actually built: the rookie scale, the veteran minimum, the mid-level, two-way contracts, 10-day contracts, Exhibit 10 deals, buyouts and the stretch provision. Each carries different cap treatment, different eligibility rules and a different number of years a team can control the player.",
  icon: "📄",
  published: "2026-11-23",
  updated: "2026-11-23",
  readingMinutes: 8,
  tools: ["salary-cap-calculator", "team-salary-trade-simulator", "honours-comparison"],
  takeaways: [
    "Two-way contracts do not count against the 15-man roster, are limited to two per team, and allow a maximum of 50 NBA games in a season.",
    "A 10-day contract can be signed only when a team has an open roster spot, and a player may sign at most two per season with the same team.",
    "Waived salary becomes dead money and still counts against the cap and the tax; the stretch provision spreads it over twice the remaining years plus one.",
    "Maximum salaries are set as a percentage of the cap by service time: 25% up to six seasons, 30% at seven to nine, 35% at ten or more.",
  ],
  sections: [
    {
      id: "map",
      heading: "The whole system on one table",
      blocks: [
        {
          kind: "table",
          head: ["Mechanism", "Typical length", "Counts on the 15-man roster", "Paid from"],
          rows: [
            ["Rookie scale (first round)", "2 years + 2 team options", "Yes", "Rookie scale exception"],
            ["Veteran minimum", "1-2 years", "Yes", "Minimum exception"],
            ["Mid-level exception", "1-4 years", "Yes", "Non-taxpayer, taxpayer or room MLE"],
            ["Two-way", "1-2 years", "No", "Two-way slot"],
            ["10-day", "10 days or 3 games", "Yes", "Minimum exception, prorated"],
            ["Exhibit 10", "Training camp", "No, until converted", "Camp invite"],
            ["Rest-of-season", "Through the season", "Yes", "Minimum or exception"],
            ["Stretched waiver", "Up to 5 years", "No", "Dead money"],
          ],
        },
      ],
    },
    {
      id: "rookie",
      heading: "Rookie scale contracts",
      blocks: [
        {
          kind: "p",
          text: "First-round picks sign a fixed two-year deal with two team options attached, with the amount determined by draft position. The scale is the same for every team, so a first-round pick's salary is predictable before the draft takes place. The team options after years two and three give the drafting team up to four seasons of control at below-market cost, which is the single largest source of surplus value on a contending roster.",
        },
        {
          kind: "p",
          text: "Second-round picks have no scale; teams negotiate freely, often starting with a minimum or two-way contract. That is why second-round picks are frequently signed to two-way deals while the team retains their rights.",
        },
        {
          kind: "note",
          title: "The extension deadline matters",
          text: "A first-round pick becomes eligible for a rookie-scale extension before his fourth season. If no extension is signed by the deadline, he plays the fourth year and becomes a restricted free agent — a much more expensive outcome for the team.",
        },
      ],
    },
    {
      id: "minimum",
      heading: "The veteran minimum",
      blocks: [
        {
          kind: "p",
          text: "Any team may sign any player to a minimum contract regardless of cap position, which makes it the universal roster-filling tool. The amount scales with years of service rather than with talent, and for players with three or more seasons in the league the NBA reimburses the team for the portion above the two-year veteran minimum. That reimbursement is why a capped-out contender can carry six veterans on minimum deals without the cap charge matching what those players would earn on the open market.",
        },
        {
          kind: "ul",
          items: [
            "Minimum contracts can be for one or two seasons, and only one of those seasons may include an option.",
            "A minimum contract is usually non-guaranteed until 10 January, when it becomes fully guaranteed for the rest of the season — the reason so many players are waived in early January.",
            "Minimum salary counts fully against the cap and the tax, even though the league reimburses part of the cash cost.",
          ],
        },
      ],
    },
    {
      id: "two-way",
      heading: "Two-way contracts",
      blocks: [
        {
          kind: "p",
          text: "Each team may carry two two-way players in addition to its 15 standard contracts. A two-way player earns roughly half the rookie minimum, spends most of the season in the G League, and can be active for a maximum of 50 NBA games. Two-way time does not count as a season of service for free-agency purposes, which keeps the player under team control longer than a standard minimum deal would.",
        },
        {
          kind: "table",
          head: ["Rule", "Detail"],
          rows: [
            ["Slots per team", "Two, in addition to the 15-man roster"],
            ["Salary", "50% of the rookie minimum, prorated for days in the NBA"],
            ["NBA games allowed", "50 per season"],
            ["Playoff eligibility", "Must be converted to a standard contract to be playoff-eligible"],
            ["Service time", "Does not accrue as a full season toward free agency"],
          ],
        },
        {
          kind: "p",
          text: "The playoff rule is the one that shapes February decisions. A two-way player who has been useful all year cannot appear in the playoffs until the contract is converted, which costs the team a roster spot and a minimum salary — so teams often convert one of the two two-way deals right before the deadline.",
        },
      ],
    },
    {
      id: "ten-day",
      heading: "10-day contracts",
      blocks: [
        {
          kind: "p",
          text: "A 10-day contract is exactly what it sounds like: ten days or three games, whichever comes first, paid on a prorated minimum. It is the cheapest way to cover an injury without committing cap room, and it is subject to two hard constraints: the team must have an open roster spot, and a player may sign at most two 10-day contracts with the same team in a season. After the second, the team must either sign him for the rest of the season or let him go.",
        },
      ],
    },
    {
      id: "exhibit-10",
      heading: "Exhibit 10 and camp invites",
      blocks: [
        {
          kind: "p",
          text: "An Exhibit 10 is an attachment to a training-camp contract that converts into a bonus if the player is waived and then spends a set number of days with the team's G League affiliate. It is not a roster mechanism in the salary-cap sense — it costs nothing against the cap until the player is actually signed to an NBA deal — but it is how teams secure G League rights to fringe prospects before the season starts.",
        },
      ],
    },
    {
      id: "buyout",
      heading: "Buyouts, set-off and dead money",
      blocks: [
        {
          kind: "p",
          text: "When a team waives a player it still owes the guaranteed portion of his contract. That amount becomes dead money: it stays on the cap sheet and the tax bill but no longer occupies a roster spot. Most buyouts negotiate the guaranteed money down, and the CBA's set-off rule lets the team reduce its obligation by a portion of whatever the player earns from his next contract.",
        },
        {
          kind: "p",
          text: "A stretched waiver spreads the remaining guaranteed money over twice the remaining years plus one. Waiving a player with $20M and two years left produces a $4M annual charge for five years instead of $10M for two. It buys immediate flexibility at the cost of a longer, smaller obligation — which is useful when a team needs to get under an apron or a bracket boundary right now.",
        },
        {
          kind: "table",
          head: ["Remaining", "Normal charge", "Stretched charge"],
          rows: [
            ["$20M over 2 years", "$10M per year for 2 years", "$4M per year for 5 years"],
            ["$9M over 1 year", "$9M for 1 year", "$3M per year for 3 years"],
          ],
        },
        {
          kind: "note",
          title: "Stretching is not free",
          text: "The total owed does not change — only its timing. A stretched contract occupies cap room for years after the player has left, which is why teams stretch sparingly and usually only to clear a specific threshold in the current season.",
        },
      ],
    },
    {
      id: "options",
      heading: "Options, guarantees and the maximum tiers",
      blocks: [
        {
          kind: "ul",
          items: [
            "A player option lets the player choose to stay for the final year; a team option lets the team choose. Both are priced into how front offices value a contract.",
            "Non-guaranteed salary can be waived without cost until its guarantee date; the guarantee date is the leverage point in most minimum and second-round deals.",
            "Maximum salaries are a percentage of the cap by service time: 25% for up to six seasons, 30% for seven to nine, 35% for ten or more.",
            "The designated veteran extension allows a 35% maximum for a player who meets award criteria — MVP, Defensive Player of the Year or All-NBA — while still under contract, which is the mechanism behind most supermax deals.",
            "The over-38 rule limits how many years a contract can run past a player's 38th birthday, closing a loophole that once allowed deferred payments.",
          ],
        },
      ],
    },
    {
      id: "practical",
      heading: "What this means when you read a cap sheet",
      blocks: [
        {
          kind: "p",
          text: "A team's cap sheet is a mix of all of the above. The practical skill is separating money that can be moved from money that cannot: a rookie-scale contract is cheap and tradeable, a stretched contract is immovable for years, a two-way deal costs nothing against the cap until converted, and a veteran minimum is almost always replaceable. When a trade looks impossible, the obstacle is usually one immovable line rather than the total.",
        },
        {
          kind: "p",
          text: "The salary cap calculator on this site lets you build a payroll line by line and see the effect on cap space, the tax line and both aprons. The trade simulator applies the same figures when you move contracts between teams.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How many two-way players can an NBA team have?",
      a: "Two, in addition to the 15 standard contracts. A two-way player earns 50% of the rookie minimum, may appear in at most 50 NBA games per season, and must be converted to a standard contract to be eligible for the playoffs.",
    },
    {
      q: "How many 10-day contracts can a player sign?",
      a: "A player may sign at most two 10-day contracts with the same team in a season. The team must have an open roster spot to sign one, and after the second the team must either sign the player for the rest of the season or release him.",
    },
    {
      q: "What is dead money in the NBA?",
      a: "Guaranteed salary still owed to a player who has been waived. It continues to count against the cap and the luxury tax even though the player is no longer on the roster, and it cannot be traded or renounced.",
    },
    {
      q: "How does the stretch provision work?",
      a: "It spreads the remaining guaranteed salary over twice the remaining years plus one. A player waived with $20M and two years left becomes a $4M charge for five years. The total owed is unchanged; only the timing moves, and the cap is occupied for longer.",
    },
    {
      q: "What is a maximum contract in 2026-27?",
      a: "A percentage of the salary cap set by service time: 25% for players with up to six seasons, 30% for seven to nine, and 35% for ten or more. A designated veteran extension can reach 35% earlier for players who meet the award criteria.",
    },
  ],
};
