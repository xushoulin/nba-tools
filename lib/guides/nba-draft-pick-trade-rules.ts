import type { Guide } from "./types";

export const guide: Guide = {
  slug: "nba-draft-pick-trade-rules",
  title: "NBA draft pick trade rules: Stepien rule, protections, swaps and frozen picks",
  shortTitle: "Pick trades",
  description:
    "How NBA teams trade draft picks: the Stepien rule, the seven-year window, top-four protections, pick swaps, conveyance and the second-apron freeze.",
  dek:
    "Draft picks are the most liquid asset in the NBA, but they are not freely tradeable. A team cannot trade first-round picks in consecutive future years, cannot trade a pick more than seven drafts out, and above the second apron cannot trade its own distant first-rounder at all.",
  icon: "🎯",
  published: "2026-11-23",
  updated: "2026-11-23",
  readingMinutes: 7,
  tools: ["team-salary-trade-simulator", "honours-comparison", "record-predictor"],
  takeaways: [
    "The Stepien rule forbids trading first-round picks in consecutive future drafts, measured from the trade date forward.",
    "A team may trade picks up to seven drafts ahead — for the 2026-27 season that means picks through the 2033 draft.",
    "Protected picks convey only if the protection does not trigger; otherwise they roll to the next year or convert to second-rounders.",
    "A pick swap gives the other team the right to exchange its own pick for yours, without transferring either pick outright.",
    "Second-apron teams have their own first-round pick seven drafts out frozen: it cannot be traded until the team drops below the line.",
  ],
  sections: [
    {
      id: "stepien",
      heading: "The Stepien rule",
      blocks: [
        {
          kind: "p",
          text: "Named after former Cleveland owner Ted Stepien, who traded away first-round picks so aggressively that the league intervened, the rule says a team cannot be without first-round picks in two consecutive future drafts. It is evaluated forward from the moment of the trade, not historically: a team that already owes its 2029 first-rounder cannot trade its 2028 or 2030 first-rounder, because either would leave consecutive years empty.",
        },
        {
          kind: "p",
          text: "The consequence is that a team can trade at most every other first-round pick. If it wants to move three firsts in one deal, it must either acquire a pick from another team to fill the gap, or structure the deal so the picks are 2028, 2030 and 2032 with the odd years retained.",
        },
        {
          kind: "note",
          title: "The rule applies at the moment of the trade",
          text: "A team can trade its 2028 first-rounder, then later trade its 2030 first-rounder, then later its 2032 first-rounder. Each trade is legal when made. What is forbidden is a single transaction that leaves two consecutive drafts without a first-round pick.",
        },
      ],
    },
    {
      id: "window",
      heading: "The seven-year window",
      blocks: [
        {
          kind: "p",
          text: "A team can only trade picks for the next seven drafts. During the 2026-27 league year, that means picks through 2033 are tradeable and 2034 is not. The window rolls forward each July, which is why front offices talk about \"the pick seven years out\" as a distinct asset class.",
        },
        {
          kind: "table",
          head: ["Asset", "Tradeable in 2026-27", "Notes"],
          rows: [
            ["Own first-round pick, 2027-2033", "Yes, subject to the Stepien rule", "The core currency of star trades"],
            ["Own first-round pick, 2034", "No", "Outside the seven-year window"],
            ["Own second-round pick, 2027-2033", "Yes", "No Stepien restriction"],
            ["Pick swap rights", "Yes", "Counts as an encumbrance on the pick"],
            ["Frozen first-round pick", "No", "Second-apron penalty only"],
          ],
        },
      ],
    },
    {
      id: "protections",
      heading: "Protections and conveyance",
      blocks: [
        {
          kind: "p",
          text: "A protected pick only changes hands if it falls outside the protected range. A \"top-four protected 2029 first\" stays with the original team if it lands in the top four of the lottery, and the obligation rolls to the next year — usually becoming a second-round pick after one or two failed conveyances.",
        },
        {
          kind: "ul",
          items: [
            "Top-1 protection: conveys unless the pick wins the lottery. The most valuable form of protection for the receiving team.",
            "Top-4 protection: protects the four lottery-winning slots, the most common structure in star trades.",
            "Top-10 or lottery protection: heavily favours the team giving up the pick.",
            "Rollover: if the protection triggers, the obligation moves to a later year with the same or reduced protection.",
            "Conversion: after the rollover year, the obligation becomes two second-round picks.",
          ],
        },
        {
          kind: "p",
          text: "Protection mechanics matter more than the headline in most trades. A \"first-round pick\" that is top-14 protected for three years and then converts to two seconds is worth far less than an unprotected first, and front offices price them accordingly. When a deal is reported as three first-round picks, at least one is usually protected.",
        },
        {
          kind: "note",
          title: "Protections are negotiated, not standard",
          text: "There is no default protection. Every range, rollover year and conversion is individually negotiated, which is why two trades that both read \"a protected first\" can differ by a factor of three in value.",
        },
      ],
    },
    {
      id: "swaps",
      heading: "Pick swaps",
      blocks: [
        {
          kind: "p",
          text: "A swap does not transfer a pick. It gives the acquiring team the right to exchange its own pick for the other team's in a given draft, taking whichever is better. The original team keeps a pick either way, which is why swaps are used to add value to a trade without stripping a roster of draft capital.",
        },
        {
          kind: "p",
          text: "Swaps are cheap to include and expensive to receive. A team with swap rights in three future drafts has a meaningful claim on another team's upside without ever holding the pick outright, and the encumbrance stays on the original team's books: it can still trade the pick, but the receiving team of that trade inherits the swap obligation.",
        },
        {
          kind: "ul",
          items: [
            "A swap counts as an encumbrance for the Stepien rule when it could leave the team without a first-round pick.",
            "Swaps are often layered: a team can hold swap rights in 2029 and 2031 while owing a protected first in 2030.",
            "The right is usually exercisable only once, at the time of the draft.",
          ],
        },
      ],
    },
    {
      id: "frozen",
      heading: "The second-apron freeze",
      blocks: [
        {
          kind: "p",
          text: "Above the second apron, a team's own first-round pick seven drafts out is frozen and cannot be traded. For a team above the line in 2026-27, that is the 2033 first-rounder. The pick is still made by the team; it simply cannot be used in a trade until the team is at or below the second apron for enough seasons to unfreeze it.",
        },
        {
          kind: "p",
          text: "The practical effect is that the most expensive rosters have the least tradeable draft capital at exactly the moment they need it. A second-apron team trying to acquire a star can offer swaps and acquired picks, but not its own distant first-rounder — which is why those deals so often involve a third team.",
        },
      ],
    },
    {
      id: "value",
      heading: "How picks are actually valued",
      blocks: [
        {
          kind: "p",
          text: "A first-round pick is not a fixed asset. Its value is a function of four variables, and all four are tradeable:",
        },
        {
          kind: "ol",
          items: [
            "Projected draft slot. An unprotected pick from a team expected to be bad is worth multiples of the same pick from a contender.",
            "Distance in time. A 2033 pick is discounted for uncertainty, and also for the risk that the rules change before it conveys.",
            "Protection structure. Top-4 protection removes most of the upside of a bad season; no protection transfers all of it.",
            "Encumbrances. A pick that is already swapped or owed conditionally has less value than a clean one.",
          ],
        },
        {
          kind: "p",
          text: "The same logic explains the market for second-round picks. They carry no Stepien restriction, they are cheap to acquire, and since the 2023 CBA introduced a dedicated second-round exception, they can be signed to contracts longer than two years without using cap space. Teams that expect to be above the second apron hoard them deliberately.",
        },
      ],
    },
    {
      id: "practical",
      heading: "Checking whether a pick trade is legal",
      blocks: [
        {
          kind: "ol",
          items: [
            "List every first-round pick the team still controls, by year, and mark which are already traded, swapped or protected.",
            "Apply the Stepien rule from the trade date: no two consecutive empty years.",
            "Confirm the pick is inside the seven-year window.",
            "Check the apron status. A second-apron team cannot move the pick seven drafts out.",
            "Price the protection. An unprotected first and a top-10 protected first are different assets, not the same one with a footnote.",
          ],
        },
        {
          kind: "p",
          text: "The trade simulator on this site tracks incoming and outgoing picks alongside salary, so a deal that breaks the Stepien rule or the apron freeze is flagged before you commit to it. If you want to see how much a pick is likely to be worth, the record predictor gives you a projected finish — which is the input that decides where a protected pick actually lands.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "What is the Stepien rule?",
      a: "A rule preventing a team from trading first-round picks in consecutive future drafts. A team that has traded its 2029 first-rounder cannot also trade its 2028 or 2030 first-rounder, because that would leave two consecutive drafts without a first-round pick.",
    },
    {
      q: "How far into the future can NBA teams trade draft picks?",
      a: "Seven drafts ahead. During the 2026-27 league year, picks through the 2033 draft are tradeable and the 2034 pick is not. The window advances each July.",
    },
    {
      q: "What does top-four protected mean?",
      a: "If the pick lands in the top four of the draft, the original team keeps it and the obligation rolls to a later year, often eventually converting to second-round picks. If the pick falls outside the top four, it transfers as agreed.",
    },
    {
      q: "What is a pick swap?",
      a: "A right to exchange two picks in a given draft, taking the better of the two. Neither team loses a pick outright, which is why swaps are used to add value to trades without stripping a roster.",
    },
    {
      q: "Do second-round picks have the same restrictions?",
      a: "No. The Stepien rule and the seven-year window apply to first-round picks. Second-round picks can be traded more freely and are not subject to the apron freeze.",
    },
    {
      q: "Why do second-apron teams hoard second-round picks?",
      a: "Because they cannot use mid-level exceptions and their own distant first-rounder is frozen. Second-round picks are cheap to acquire and can be signed using the dedicated second-round exception, making them the main route to adding young, inexpensive roster depth.",
    },
  ],
};
