import type { Guide } from "./types";

export const guide: Guide = {
  slug: "fantasy-basketball-scoring-systems",
  title: "Fantasy basketball scoring systems: 9-cat, points leagues and how to value a trade",
  shortTitle: "Fantasy scoring",
  description:
    "How fantasy basketball scoring works: 9-category leagues, head-to-head points weights, punt builds, streaming and a repeatable method for valuing trades.",
  dek:
    "The same player is worth different amounts in different formats. A centre who shoots 55% and blocks two shots a game is a first-round pick in a 9-category league and an average starter in a points league that ignores percentages. Format comes first; player evaluation comes second.",
  icon: "🏀",
  published: "2026-11-23",
  updated: "2026-11-23",
  readingMinutes: 7,
  tools: ["fantasy-points-calculator", "fantasy-trade-analyzer", "player-comparison"],
  takeaways: [
    "A 9-category league scores points, rebounds, assists, steals, blocks, threes, field goal percentage, free throw percentage and turnovers — one category win per week, so percentages are as valuable as counting stats.",
    "A points league converts every stat into a single number, which means volume always beats efficiency unless the weights are set unusually high for percentages.",
    "In 9-cat, punting a category is a deliberate strategy: you give up one category to win the other eight more often, and it changes which players are draftable.",
    "Turnovers are the most commonly misunderstood category — a high-usage star can lose you that category single-handedly.",
    "Trade value should be measured against replacement level in your format, not against points per game: a player's value is what he adds over the best available free agent at his position.",
  ],
  sections: [
    {
      id: "formats",
      heading: "The three formats you will actually play",
      blocks: [
        {
          kind: "table",
          head: ["Format", "How you win", "What matters most", "What is nearly worthless"],
          rows: [
            ["9-category, head-to-head", "Win more of nine categories each week", "Balance, percentages, low turnovers", "Nothing — every category counts equally"],
            ["Points, head-to-head", "Outscore one opponent per week", "Volume, games played, availability", "Efficiency, unless weights reward it"],
            ["Roto", "Total category standing across the season", "Consistency, durability, games played", "Short hot streaks"],
          ],
        },
        {
          kind: "p",
          text: "The structural difference is that 9-cat rewards balance and points leagues reward accumulation. In 9-cat, a player who shoots 42% from the field actively costs you a category; in a points league with no percentage penalty, that same player is a useful volume scorer. Any ranking that does not state its format is not a ranking.",
        },
      ],
    },
    {
      id: "ninecat",
      heading: "9-category: how the math works",
      blocks: [
        {
          kind: "p",
          text: "Each week you play one opponent across nine categories and the winner of each category gets a point. Percentages are computed from your team's cumulative totals, not averaged per player, which is why one player shooting 2-for-12 can sink a week.",
        },
        {
          kind: "ul",
          items: [
            "Counting categories (points, rebounds, assists, steals, blocks, threes) reward volume and games played.",
            "Percentage categories reward shot selection and role, and are dominated by low-volume efficient players.",
            "Turnovers reward low usage and punish primary ball handlers.",
            "Because percentages are team-level, a single high-volume inefficient player can outweigh three efficient ones.",
          ],
        },
        {
          kind: "note",
          title: "The percentages are the leverage",
          text: "Most leagues are decided in field goal percentage and turnovers, because those are the two categories casual managers ignore. A team that wins both every week only needs to split the other seven.",
        },
      ],
    },
    {
      id: "points",
      heading: "Points leagues: the weights decide everything",
      blocks: [
        {
          kind: "p",
          text: "A points league assigns a value to each stat and sums them. There is no standard, but a common head-to-head default is close to this:",
        },
        {
          kind: "table",
          head: ["Stat", "Typical weight", "Effect on strategy"],
          rows: [
            ["Point", "1.0", "Baseline; scoring volume is the foundation"],
            ["Rebound", "1.2", "Makes big men more valuable than in 9-cat"],
            ["Assist", "1.5", "Primary creators gain; assists are scarcer than points"],
            ["Steal", "3.0", "Deflections become a major source of points"],
            ["Block", "3.0", "Rim protectors become premium assets"],
            ["Three-pointer", "0.5", "Small bonus; volume shooters gain slightly"],
            ["Turnover", "−1.0", "Punishes high-usage ball handlers, but not enough to offset their points"],
          ],
          caption: "The fantasy points calculator on this site uses these as editable defaults — change any weight to match your league.",
        },
        {
          kind: "p",
          text: "Because every category collapses into one number, points leagues reward availability above almost everything else. A 20-point-per-game player who misses 25 games is worth less than a 15-point player who plays 78, and the gap is roughly proportional to games missed. Streaming — cycling the last roster spot through players with four-game weeks — is a larger edge in points leagues than in 9-cat.",
        },
        {
          kind: "p",
          text: "The other consequence is that efficiency almost disappears. A player shooting 38% from the field and one shooting 52% are scored identically if their raw totals match, so the correct draft strategy shifts toward high-usage players on bad teams, who accumulate volume without competition for touches.",
        },
      ],
    },
    {
      id: "punt",
      heading: "Punting in 9-cat",
      blocks: [
        {
          kind: "p",
          text: "A punt build means deliberately losing one category in order to win the others more reliably. The logic is that no roster wins all nine, so concentrating your weaknesses into one category lets you dominate the remaining eight with players who are cheap precisely because they are bad at the thing you are giving up.",
        },
        {
          kind: "ul",
          items: [
            "Punt free throw percentage: target high-usage big men and poor shooters, who are undervalued by managers chasing percentages.",
            "Punt assists: target scoring wings and bigs, and accept that your ball handlers will not carry the category.",
            "Punt turnovers: target high-usage stars and punt the category entirely, which frees you to roster the best available players.",
            "Punt blocks: a common soft punt, since blocks are concentrated in a few players and are hard to win without dedicated bigs.",
          ],
        },
        {
          kind: "p",
          text: "The mistake is a half-punt. A team that is mediocre in four categories and elite in none loses to a balanced team almost every week. Punting works when the sacrificed category is genuinely unwinnable and the gains are concentrated in categories you can win outright.",
        },
      ],
    },
    {
      id: "trade",
      heading: "Valuing a trade properly",
      blocks: [
        {
          kind: "p",
          text: "Trade evaluation in fantasy is not about which side has the better player. It is about which side gains more production over replacement in the categories that decide your matchups. A repeatable method:",
        },
        {
          kind: "ol",
          items: [
            "Convert every player to per-game production in your format, using your league's actual weights or categories.",
            "Multiply by expected games remaining, not games played so far. Availability is the largest hidden variable.",
            "Compare each player to the replacement level at his position — the best player likely available on waivers in your league.",
            "Sum the deltas by category. A trade that upgrades one category by a lot and downgrades three by a little is usually a loss in 9-cat.",
            "Check the playoff schedule. A player with four games in your finals week is worth more than one with two.",
          ],
        },
        {
          kind: "p",
          text: "In points leagues the method collapses to a single number: total points over replacement across remaining games. In 9-cat it does not, because a 3-for-1 trade can win counting categories while destroying your percentages.",
        },
        {
          kind: "note",
          title: "Two-for-one trades are not automatically wins",
          text: "Consolidating talent looks good on paper, but the two players you give up occupy two roster spots that will be filled by waiver-level production. The trade is only a win if the upgrade at the top exceeds the replacement production you lose at the bottom.",
        },
      ],
    },
    {
      id: "practical",
      heading: "Using the calculators",
      blocks: [
        {
          kind: "p",
          text: "The fantasy points calculator takes a stat line and returns the total under your league's weights, so you can compare two players in the same format without doing the arithmetic. The trade analyzer extends that to multi-player deals and shows the net difference per category. The player comparison tool is the right place to check whether a hot stretch is real: if true shooting and usage have moved together, the production is probably sustainable; if only points have moved, it is probably shot variance.",
        },
        {
          kind: "p",
          text: "One caution that applies to all three: fantasy value is a projection, not a measurement. Games played, role changes and playoff schedules move the number more than any per-game statistic does.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "What are the 9 categories in fantasy basketball?",
      a: "Points, rebounds, assists, steals, blocks, three-pointers made, field goal percentage, free throw percentage and turnovers. Some leagues replace turnovers with a different category or add offensive rebounds, but nine is the standard.",
    },
    {
      q: "Is a points league or a 9-cat league better?",
      a: "Points leagues are simpler and reward volume and availability. 9-cat leagues reward balance and roster construction, and are more sensitive to efficiency. Which is better depends on whether you want a single scoreboard or a category-by-category puzzle.",
    },
    {
      q: "What does punting mean in fantasy basketball?",
      a: "Deliberately sacrificing one category so you can win the others more reliably. Because no roster wins all nine categories, concentrating weaknesses into one lets you roster players who are cheap specifically because they are bad at it.",
    },
    {
      q: "How should I value a 2-for-1 trade?",
      a: "Compare the production of the single player you receive against the combined production of the two you send, plus the replacement-level player who fills the open roster spot. The trade only wins if the upgrade exceeds that replacement production.",
    },
    {
      q: "Why do turnovers matter so much in 9-cat?",
      a: "Because they are a category like any other and are concentrated in high-usage players. Rostering several primary ball handlers can lose you the category every week, even if they win you points and assists.",
    },
  ],
};
