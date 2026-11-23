import type { Guide } from "./types";

export const guide: Guide = {
  slug: "nba-free-agency-bird-rights",
  title: "NBA free agency and Bird rights explained: cap holds, exceptions and restricted free agents",
  shortTitle: "Bird rights",
  description:
    "How NBA free agency actually works: Bird, Early Bird and Non-Bird rights, cap holds, restricted free agency, the July moratorium and the mid-level exceptions.",
  dek:
    "Almost every NBA free-agent signing is governed by a player's Bird rights, not by cap space. Bird rights let a team exceed the cap to re-sign its own player, and the cap hold attached to that player is what decides whether the team has room to do anything else first.",
  icon: "🕊️",
  published: "2026-11-23",
  updated: "2026-11-23",
  readingMinutes: 8,
  tools: ["salary-cap-calculator", "team-salary-trade-simulator", "luxury-tax-calculator"],
  takeaways: [
    "Full Bird rights require three seasons with the same team without clearing waivers, and allow a re-signing of up to the maximum salary for five years with 8% annual raises.",
    "Early Bird rights (two seasons) allow a starting salary of up to 175% of the prior salary or 120% of the league average, whichever is greater, for up to four years.",
    "Non-Bird rights (one season) allow only 120% of the prior salary, which is often less than the player is worth on the open market.",
    "A team's own free agent carries a cap hold until he signs elsewhere or is renounced; renouncing him clears the hold but destroys the Bird rights with it.",
    "A restricted free agent's team has the right of first refusal and can match an offer sheet, with a 48-hour window once the sheet is signed.",
  ],
  sections: [
    {
      id: "why",
      heading: "Why Bird rights exist",
      blocks: [
        {
          kind: "p",
          text: "The salary cap would be unworkable without a way for teams to keep their own players. If every re-signing had to fit under the cap, a team that drafted well would be forced to lose its best players the moment their rookie deals ended. Bird rights solve that by letting a team exceed the cap to retain its own free agents, which is why a capped-out team can still hand out a $50M contract in July.",
        },
        {
          kind: "p",
          text: "The rights are named after Larry Bird, who was the first player the league allowed a team to re-sign over the cap in 1984. The mechanism has been in every CBA since, and it is the reason \"cap space\" and \"payroll room\" are different numbers.",
        },
      ],
    },
    {
      id: "tiers",
      heading: "The three tiers of Bird rights",
      blocks: [
        {
          kind: "table",
          head: ["Tier", "Seasons required", "Maximum starting salary", "Maximum length", "Raises"],
          rows: [
            ["Full Bird", "3", "Maximum salary", "5 years", "8%"],
            ["Early Bird", "2", "175% of prior salary or 120% of league average", "4 years", "8%"],
            ["Non-Bird", "1", "120% of prior salary", "4 years", "8%"],
            ["No rights", "0", "Cap space, exception or minimum only", "4 years", "5%"],
          ],
          caption: "Raises shown are the maximum annual increase on a re-signing; offers from other teams are capped at 5%.",
        },
        {
          kind: "p",
          text: "The seasons must be consecutive and the player must not have cleared waivers in between. A player who is traded keeps his Bird clock only if he is not waived — a trade preserves the accumulation, a waiver resets it. That is why a team trading for an expiring contract in February can inherit full Bird rights in July and re-sign the player over the cap.",
        },
        {
          kind: "note",
          title: "The one-year deal trap",
          text: "A player who signs a one-year contract, or a two-year deal with a player option, gains a no-trade clause for that season. It is a small concession that gives the player leverage over where he is sent, and it is why those contract structures are rarer than they look on a cap sheet.",
        },
      ],
    },
    {
      id: "holds",
      heading: "Cap holds: the number that blocks your summer",
      blocks: [
        {
          kind: "p",
          text: "Until a free agent signs somewhere or is renounced, his team carries a cap hold — a placeholder charge that counts against cap space but not against the tax. The hold is calculated from the player's previous salary and his rights tier, so an expensive player's hold can be enormous relative to what he will actually sign for.",
        },
        {
          kind: "ul",
          items: [
            "Full Bird free agent: 190% of the prior salary if it was above the league average, 150% if at or below.",
            "Early Bird free agent: 130% of the prior salary.",
            "Non-Bird free agent: 120% of the prior salary.",
            "First-round pick: 120% of the rookie-scale amount for his draft slot, until he signs.",
            "Minimum-salary free agent: a hold equal to the two-year veteran minimum.",
          ],
        },
        {
          kind: "p",
          text: "This is the mechanism behind almost every \"they have to renounce him first\" report. A team with $18M of cap space and a $30M cap hold for its own starter has no space at all until it either re-signs him or renounces him. Renouncing clears the hold immediately but also ends the team's ability to go over the cap to re-sign him, so it is a one-way door: a team that renounces a player can only bring him back using cap space or an exception.",
        },
        {
          kind: "note",
          title: "Order of operations",
          text: "Teams routinely sign their own free agents last. Signing everyone else first, using cap space while the holds are still on the books, then re-signing the Bird free agent over the cap is legal and extremely common. The hold only needs to be cleared if the team wants to use that cap space on someone else.",
        },
      ],
    },
    {
      id: "rfa",
      heading: "Restricted free agency",
      blocks: [
        {
          kind: "p",
          text: "A restricted free agent is a player with three or fewer seasons who has received a qualifying offer from his team. The team gets the right of first refusal: it can match any offer sheet the player signs, keeping him on the same terms. Once the player signs an offer sheet, the team has 48 hours to match or let him go.",
        },
        {
          kind: "p",
          text: "The qualifying offer is a one-year contract at a fixed amount set by the CBA, scaled to the player's draft position and prior salary. If the team does not extend one by the deadline, the player becomes an unrestricted free agent — a mistake that has cost teams significant assets.",
        },
        {
          kind: "ul",
          items: [
            "Offer sheets can be structured to be hard to match: large up-front bonuses, or a salary that spikes in a year when the team projects to be deep into the tax.",
            "A matched offer sheet cannot be traded for one year without the player's consent.",
            "The Gilbert Arenas provision limits how much a team with cap space can front-load an offer to a player with one or two seasons of service, protecting teams that hold Early Bird rights.",
            "A player who plays a season on the qualifying offer becomes an unrestricted free agent the following summer.",
          ],
        },
      ],
    },
    {
      id: "exceptions",
      heading: "The exceptions a capped-out team can still use",
      blocks: [
        {
          kind: "table",
          head: ["Exception", "Available to", "Typical use"],
          rows: [
            ["Non-taxpayer mid-level", "Teams below the first apron", "The main route to a rotation player for a capped-out team"],
            ["Taxpayer mid-level", "Teams above the first apron but below the second", "One smaller signing, contracts limited to two years"],
            ["Room mid-level", "Teams with cap space that use it", "Replaces the mid-level when a team operates under the cap"],
            ["Bi-annual", "Teams below the first apron, not used in consecutive years", "One contract every other year"],
            ["Minimum", "Every team", "Veteran minimum deals, with the league paying part of the salary"],
            ["Traded-player exception", "Team that traded out more salary than it took back", "Absorbs a contract within one year of the trade"],
          ],
        },
        {
          kind: "p",
          text: "Using the non-taxpayer mid-level or the bi-annual exception hard-caps the team at the first apron for the rest of the year. That is the trade-off: the exception buys a player, and the hard cap removes the flexibility to add salary later.",
        },
      ],
    },
    {
      id: "timeline",
      heading: "The free-agency calendar",
      blocks: [
        {
          kind: "ol",
          items: [
            "Late June: teams extend qualifying offers to retain restricted free agency; option decisions are due.",
            "30 June, 6pm ET: teams may begin negotiating with free agents.",
            "1–6 July: the moratorium. Agreements are reported but cannot be signed, because the league has not yet certified the new cap figure.",
            "6 July: signings become official and the new league year's exceptions become usable.",
            "Mid-July onward: the remaining market thins out; minimum and room-exception deals dominate.",
            "February trade deadline: the last chance to convert an expiring contract into an asset rather than losing the player for nothing.",
          ],
        },
        {
          kind: "note",
          title: "Verbal agreements are not contracts",
          text: "Deals reported during the moratorium can still fall apart, and a team that has committed its cap space to three verbal agreements cannot legally sign a fourth player until those are executed. This is why the first week of July produces so many re-worked deals.",
        },
      ],
    },
    {
      id: "practical",
      heading: "What to check before believing a signing is possible",
      blocks: [
        {
          kind: "ol",
          items: [
            "Does the team have cap space, or is it using an exception? The answer determines the maximum salary and the contract length.",
            "Which cap holds are still on the books? Holds, not guaranteed salaries, are what usually eliminate space.",
            "Is the player's own team involved? If so, Bird rights may allow a contract that no other team can legally offer.",
            "Would using the exception hard-cap the team? If so, the signing may block a later trade.",
            "Is the player a restricted free agent? Then the deal is an offer sheet, and the outcome depends on a 48-hour matching decision.",
          ],
        },
        {
          kind: "p",
          text: "The salary cap calculator lets you model all of this directly: add the cap holds, apply the exception, and see the resulting payroll against the cap, the tax line and both aprons. The trade simulator uses the same numbers when a sign-and-trade is involved.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How long does a player need to be with a team to earn Bird rights?",
      a: "Three consecutive seasons without clearing waivers. A trade does not reset the clock; a waiver claim or an outright release does. Two seasons earns Early Bird rights, and one season earns Non-Bird rights.",
    },
    {
      q: "Can a team re-sign its own free agent if it is over the cap?",
      a: "Yes, if the player has Bird or Early Bird rights. The team may exceed the cap up to the maximum salary for a full Bird player, and up to 175% of the prior salary for an Early Bird player.",
    },
    {
      q: "What is a cap hold?",
      a: "A placeholder charge for a team's own free agent that counts against cap space until the player signs or is renounced. For a full Bird free agent it is 190% of the prior salary if that salary was above the league average, or 150% if at or below.",
    },
    {
      q: "How long does a team have to match a restricted free agent's offer sheet?",
      a: "48 hours from the moment the player signs the offer sheet. If the team does not match within that window, the player joins the offering team on those terms.",
    },
    {
      q: "What is the July moratorium?",
      a: "The period from 1 to 6 July during which teams may negotiate with free agents but cannot sign contracts, because the league has not yet certified the salary cap for the new year.",
    },
    {
      q: "Does renouncing a free agent clear his cap hold permanently?",
      a: "Yes. Renouncing removes the hold immediately but also ends the team's Bird rights, so the player can only be re-signed using cap space, an exception or a minimum contract.",
    },
  ],
};
