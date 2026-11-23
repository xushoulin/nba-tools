import type { Guide } from "./types";

export const guide: Guide = {
  slug: "nba-advanced-stats-explained",
  title: "NBA advanced stats explained: TS%, usage, PER, BPM and what each one is bad at",
  shortTitle: "Advanced stats",
  description:
    "A practical guide to NBA advanced statistics: true shooting, effective field goal percentage, usage rate, offensive rating, PER, BPM, VORP and win shares, with the formulas and the failure modes.",
  dek:
    "Advanced stats are not more accurate versions of points and rebounds — they answer different questions. True shooting measures efficiency, usage measures volume, offensive rating measures team-level production, and PER, BPM and win shares each try to compress everything into one number. Knowing which question each one answers is the whole skill.",
  icon: "📐",
  published: "2026-11-23",
  updated: "2026-11-23",
  readingMinutes: 9,
  tools: ["advanced-stats-calculator", "player-comparison", "fantasy-points-calculator"],
  takeaways: [
    "True shooting percentage is points divided by twice the shooting possessions used: PTS / (2 × (FGA + 0.44 × FTA)). League average is roughly 58%.",
    "Effective field goal percentage weights a made three as 1.5 field goals: (FGM + 0.5 × 3PM) / FGA.",
    "Usage rate measures how often a player ends a possession while on the floor, not how efficient he is; a high usage rate with a low true shooting percentage is a bad combination.",
    "PER is normalised so the league average is 15, is not adjusted for pace or role, and systematically undervalues defensive specialists.",
    "BPM estimates points per 100 possessions above league average from the box score; VORP converts that into wins over a replacement-level player.",
  ],
  sections: [
    {
      id: "why",
      heading: "What advanced stats are for",
      blocks: [
        {
          kind: "p",
          text: "Box-score totals conflate three different things: how much a player did, how well he did it, and how much it helped. A player averaging 22 points on 25 shots and a player averaging 22 points on 15 shots have identical scoring totals and completely different value. Advanced stats exist to separate volume from efficiency from impact.",
        },
        {
          kind: "p",
          text: "They are still derived from the same play-by-play and box score, with the exception of tracking-based metrics. None of them watch the game. Every one of them can be gamed by role, scheme and sample size, which is why no single number should decide an argument.",
        },
      ],
    },
    {
      id: "shooting",
      heading: "Shooting efficiency: TS% and eFG%",
      blocks: [
        {
          kind: "p",
          text: "Effective field goal percentage adjusts for the fact that a three-pointer is worth 50% more than a two:",
        },
        {
          kind: "note",
          title: "eFG%",
          text: "(FGM + 0.5 × 3PM) / FGA. A player who makes 5 of 10 from the field with two threes has an eFG% of 60%, not 50%.",
        },
        {
          kind: "p",
          text: "True shooting percentage goes further and includes free throws, converting everything into points per shooting possession:",
        },
        {
          kind: "note",
          title: "TS%",
          text: "PTS / (2 × (FGA + 0.44 × FTA)). The 0.44 factor accounts for the fact that not every free throw ends a possession — and-one attempts and technical free throws do not.",
        },
        {
          kind: "table",
          head: ["TS%", "What it means in practice"],
          rows: [
            ["Below 52%", "Inefficient for any role; a high-volume player at this level is hurting the offence"],
            ["53–56%", "Below average; acceptable only for a low-usage big or a defensive specialist"],
            ["57–59%", "League average, roughly where the median rotation player sits"],
            ["60–64%", "Strong; the range most efficient high-usage scorers occupy"],
            ["Above 65%", "Elite, usually a rim-running big or a low-volume spacer"],
          ],
          caption: "Approximate bands for recent seasons; the league average moves by a point or so each year.",
        },
        {
          kind: "p",
          text: "The failure mode is context. A centre who only takes dunks will post a 70% TS% and is not a better scorer than a guard at 58% who creates his own shot against a set defence. TS% measures efficiency conditional on role, not ability independent of role.",
        },
      ],
    },
    {
      id: "usage",
      heading: "Usage rate: volume, not quality",
      blocks: [
        {
          kind: "p",
          text: "Usage rate estimates the share of team possessions a player ends while on the floor, through a field goal attempt, a free throw attempt or a turnover. It says nothing about whether those possessions were productive.",
        },
        {
          kind: "note",
          title: "USG%",
          text: "100 × (FGA + 0.44 × FTA + TOV) / (team possessions while the player is on the floor, adjusted for the other four players).",
        },
        {
          kind: "p",
          text: "Usage and efficiency have to be read together. A 30% usage rate at 55% TS% is a below-average offence being run through one player; 30% at 62% is an MVP-calibre engine. The same 30% number appears in both cases, which is why any argument that cites usage alone is incomplete.",
        },
        {
          kind: "p",
          text: "Usage also has a structural ceiling. A player's usage cannot exceed roughly 40% over a full season without the offence collapsing, because there are only so many possessions and defences adjust. Very high usage rates in short samples are usually a sign of a bad team, not a great player.",
        },
      ],
    },
    {
      id: "ratings",
      heading: "Offensive and defensive rating",
      blocks: [
        {
          kind: "p",
          text: "Rating metrics express production per 100 possessions, which removes pace from the comparison. A team playing at 105 possessions per game and a team at 95 are directly comparable once everything is per-100.",
        },
        {
          kind: "ul",
          items: [
            "Offensive rating (ORtg): points scored per 100 possessions. League average sits around 115 in recent seasons.",
            "Defensive rating (DRtg): points allowed per 100 possessions. Lower is better.",
            "Net rating: ORtg minus DRtg. The single most predictive team-level statistic over a season.",
            "Individual ORtg: points produced per 100 possessions used, which is a different calculation from team ORtg and is not comparable to it.",
          ],
        },
        {
          kind: "p",
          text: "The most common misuse is treating individual ORtg as if it were team ORtg. An individual ORtg of 120 does not mean the player's team scores 120 points per 100 possessions with him on the floor; that is on/off net rating, a different measure entirely.",
        },
        {
          kind: "note",
          title: "On/off splits are noisy",
          text: "On/off numbers for a single season are heavily influenced by who else is on the floor. A backup centre who plays exclusively against backups will post a better on/off than a starter who plays against starters. Multi-year samples are far more stable.",
        },
      ],
    },
    {
      id: "allinone",
      heading: "The all-in-one metrics",
      blocks: [
        {
          kind: "table",
          head: ["Metric", "Scale", "What it is", "Main weakness"],
          rows: [
            ["PER", "League average 15", "Weighted box-score production per minute, normalised", "No pace or role adjustment; ignores defence beyond steals and blocks"],
            ["BPM", "Points per 100 above average", "Regression of box score onto plus-minus", "Position priors baked in; punishes unconventional roles"],
            ["VORP", "Wins", "BPM converted to wins over a replacement-level player", "Inherits every BPM assumption"],
            ["Win shares", "Wins", "Offensive and defensive production allocated from team totals", "Defensive half is largely team-derived, not individual"],
            ["RAPM", "Points per 100", "Adjusted plus-minus from lineup data", "Needs large samples; unstable in single seasons"],
            ["PIE", "Share of total events", "Player's share of all box-score events in the game", "Descriptive only, not a value estimate"],
          ],
        },
        {
          kind: "p",
          text: "PER is the oldest and the most criticised. It was designed as a quick summary of box-score production and it does that job, but it cannot see a defender who contests without recording a stat, and it rewards volume shooting in a way that true shooting percentage does not. A high-usage inefficient scorer can post a respectable PER.",
        },
        {
          kind: "p",
          text: "BPM is better calibrated because it was fitted against plus-minus data, but the fit encodes the roles that existed in its training seasons. A modern switchable wing or a short-roll passer will often grade poorly relative to his actual impact.",
        },
        {
          kind: "note",
          title: "Use them as a screen, not a verdict",
          text: "The right workflow is: use an all-in-one metric to notice a player, then check TS%, usage and on/off context to understand why the number looks the way it does. A single metric that disagrees with everything else is usually wrong about the player, not ahead of the consensus.",
        },
      ],
    },
    {
      id: "calculate",
      heading: "Computing them yourself",
      blocks: [
        {
          kind: "p",
          text: "Every metric above except RAPM can be derived from a standard box score. The inputs you need are: field goals made and attempted, three-pointers made, free throws made and attempted, points, rebounds, assists, steals, blocks, turnovers, minutes played and team totals for the same categories.",
        },
        {
          kind: "ol",
          items: [
            "Compute possessions: FGA + 0.44 × FTA − offensive rebounds + turnovers, at team level.",
            "Compute TS% and eFG% from the shooting lines.",
            "Compute usage from the possession-ending events.",
            "Compute individual ORtg by dividing points produced by possessions used and multiplying by 100.",
            "Only then compute an all-in-one metric, and treat it as a summary rather than a ranking.",
          ],
        },
        {
          kind: "p",
          text: "The advanced stats calculator on this site takes a box score and returns these figures directly, including possessions, pace, TS%, eFG%, usage and the four factors. The player comparison tool puts two players side by side on the same scale, which is where the efficiency-versus-volume distinction becomes obvious.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "What is a good true shooting percentage in the NBA?",
      a: "League average is roughly 58%. Below 53% is inefficient for any role, 60–64% is strong, and above 65% is elite and usually belongs to a rim-running big man or a low-volume spacer.",
    },
    {
      q: "What is the difference between TS% and eFG%?",
      a: "eFG% adjusts only for the extra value of a three-pointer. TS% also includes free throws, so it measures points per shooting possession rather than points per field goal attempt. TS% is the better single measure of scoring efficiency.",
    },
    {
      q: "What does a usage rate of 30% mean?",
      a: "The player ends roughly 30% of his team's possessions while on the floor, through a field goal attempt, free throw attempt or turnover. It measures volume, not quality — the efficiency of those possessions is measured by true shooting percentage.",
    },
    {
      q: "Is PER a good stat?",
      a: "It is a reasonable summary of box-score production and a poor measure of overall value. It has no pace adjustment, and its defensive component is limited to steals and blocks, so it systematically undervalues defenders and overvalues volume scorers.",
    },
    {
      q: "What is the difference between BPM and VORP?",
      a: "BPM is a rate: points per 100 possessions above league average. VORP converts that rate into a win total by comparing the player to a replacement-level player over the same minutes.",
    },
    {
      q: "Why do on/off numbers disagree with the eye test?",
      a: "Because they depend heavily on who else is on the floor. A player whose minutes come against backups will look better than an equivalent player facing starters. Single-season on/off splits are noisy; multi-year samples are far more reliable.",
    },
  ],
};
