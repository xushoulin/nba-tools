type Faq = { q: string; a: string };
type Step = { title: string; body: string };

export const TOOL_CONTENT: Record<string, { steps: Step[]; faqs: Faq[] }> = {
  "salary-cap-calculator": {
    steps: [
      { title: "Enter contracts", body: "Add each player's annual salary. You can add or remove rows as needed." },
      { title: "Set the cap", body: "The 2025–26 cap is preset. Adjust it any time to model future seasons." },
      { title: "Read the results", body: "See total payroll, remaining cap space, and your luxury tax position instantly." },
    ],
    faqs: [
      { q: "What is the NBA salary cap?", a: "The salary cap is the limit on how much a team can spend on player salaries in a season. For 2025–26 the cap is approximately $154.6 million, and the luxury tax threshold is about $187.9 million." },
      { q: "Can a team go over the cap?", a: "Yes. Teams can exceed the cap using exceptions such as the Bird exception, mid-level exception, and by re-signing their own players. Going over the first apron ($195.2M) and second apron ($207.8M) triggers increasingly strict roster restrictions." },
      { q: "Is this calculator official?", a: "No. NBA Tools is independent and not affiliated with the NBA. Figures are for estimation and entertainment purposes." },
      { q: "Does my data leave my browser?", a: "No. All calculations happen locally in your browser. Nothing is stored or transmitted." },
    ],
  },
  "luxury-tax-calculator": {
    steps: [
      { title: "Enter team salary", body: "Input your team's total payroll for the season." },
      { title: "Set the tax line", body: "The 2025–26 luxury tax threshold is preset at roughly $187.9 million." },
      { title: "Pick taxpayer status", body: "Repeat taxpayers pay higher rates. Choose your status to see the correct bill." },
    ],
    faqs: [
      { q: "How is NBA luxury tax calculated?", a: "Luxury tax uses progressive brackets. For each $5 million a team is over the tax line, the per-dollar rate increases — starting at $1.50 per dollar and climbing to $3.75 or more for large overages. Repeat taxpayers pay a $0.50 surcharge per bracket." },
      { q: "What is the first and second apron?", a: "The aprons are thresholds above the tax line that trigger roster-building restrictions. The first apron limits certain transactions; the second apron imposes much harsher limits including frozen draft picks." },
      { q: "Who receives luxury tax money?", a: "Tax revenue is distributed among teams that stay below the tax line, and a portion goes to the league." },
    ],
  },
  "fantasy-trade-analyzer": {
    steps: [
      { title: "Add players per side", body: "List the players each team is sending, with an approximate fantasy value (0–10) for each." },
      { title: "Compare totals", body: "See combined value, per-category strength, and which side wins on paper." },
      { title: "Adjust and re-run", body: "Tweak values based on your league's scoring to pressure-test the deal." },
    ],
    faqs: [
      { q: "How is trade value determined?", a: "You assign each player a 0–10 value based on your own ranking or a site Like FantasyPros. The analyzer sums each side and compares, factoring in the number of players." },
      { q: "Does this work for all fantasy formats?", a: "Yes. It is format-agnostic — you supply the values, so it works for 9-cat, points leagues, or keeper formats." },
      { q: "Should I trust the winner label?", a: "It is a starting point, not gospel. Consider roster needs, schedule, and injuries before accepting any trade." },
    ],
  },
  "fantasy-points-calculator": {
    steps: [
      { title: "Choose a scoring format", body: "Pick standard 9-category, points league, or enter your own custom weights." },
      { title: "Enter a box score", body: "Fill in the player's stats — points, rebounds, assists, steals, blocks, turnovers, threes, and shooting percentages." },
      { title: "Get the fantasy score", body: "See the projected fantasy points for that line, updated as you type." },
    ],
    faqs: [
      { q: "What is a points league?", a: "A fantasy format where each statistical category is worth a set number of points. For example 1 point per actual point, 1.2 per rebound, and so on." },
      { q: "What is 9-category fantasy basketball?", a: "A format where teams compete each week in nine categories: points, rebounds, assists, steals, blocks, three-pointers, field goal %, free throw %, and turnovers." },
      { q: "Can I use custom scoring?", a: "Yes. Switch to custom mode and set your own weight for every category to match your league's rules." },
    ],
  },
  "advanced-stats-calculator": {
    steps: [
      { title: "Enter basic box score stats", body: "Fill in field goals, free throws, points, assists, turnovers, minutes, and rebounds." },
      { title: "Add team context", body: "Team pace and possessions improve the accuracy of rate stats like usage." },
      { title: "Read advanced metrics", body: "Get PER, True Shooting %, Effective FG %, Usage Rate, and more, explained in plain English." },
    ],
    faqs: [
      { q: "What is PER?", a: "Player Efficiency Rating is a per-minute measure of a player's statistical production, normalized so the league average is 15. It rewards efficient scoring, rebounding, playmaking, and defense." },
      { q: "What is True Shooting percentage?", a: "TS% measures shooting efficiency accounting for three-pointers and free throws. It is calculated as points divided by twice the true shooting attempts." },
      { q: "How accurate is this calculator?", a: "It uses the standard published formulas. Results match Basketball-Reference style metrics closely for single-game or season totals." },
    ],
  },
  "record-predictor": {
    steps: [
      { title: "Enter points for and against", body: "Input the team's total points scored and allowed over the sample." },
      { title: "See expected win percentage", body: "The Pythagorean formula converts scoring margin into an expected winning percentage." },
      { title: "Project the record", body: "Multiply by the number of games to get a projected win-loss record." },
    ],
    faqs: [
      { q: "What is Pythagorean expectation?", a: "A formula by Bill James that estimates a team's expected winning percentage from points scored and points allowed. For basketball the exponent is typically around 13.9." },
      { q: "Why does it matter?", a: "A team's point differential is often a better predictor of future performance than its actual record, which can be skewed by close games." },
      { q: "Can I model a full season?", a: "Yes. Enter full-season totals for a complete projection, or partial-season totals to see the current pace." },
    ],
  },
  "playoff-bracket-simulator": {
    steps: [
      { title: "Set the bracket", body: "Choose an 8- or 16-team field and see the matchups." },
      { title: "Pick or simulate", body: "Manually choose each series winner, or let the simulator pick based on seed strength plus randomness." },
      { title: "See your champion", body: "Advance through the rounds to reveal your predicted NBA champion." },
    ],
    faqs: [
      { q: "How does the simulator pick winners?", a: "By default it weights the higher seed as more likely to win, but adds randomness so upsets happen — just like real playoffs." },
      { q: "Can I run my own picks?", a: "Yes. Click any team to advance them. You can mix manual picks with simulated rounds." },
      { q: "Is this a real playoff bracket?", a: "It is a generic simulator. It does not use live NBA playoff data and is not affiliated with the NBA." },
    ],
  },
  "player-comparison": {
    steps: [
      { title: "Pick two players", body: "Enter names for the two players you want to compare." },
      { title: "Fill in their stats", body: "Enter per-game numbers — points, rebounds, assists, steals, blocks, threes, and shooting percentages." },
      { title: "See the edge", body: "Compare category by category with visual bars and an overall score." },
    ],
    faqs: [
      { q: "Where do I find the stats?", a: "Any box score source works — Basketball-Reference, ESPN, or NBA.com. Enter per-game averages for a fair comparison." },
      { q: "How is the overall edge calculated?", a: "Each category is normalized and averaged into a single score so you can see which player has the stronger all-around line." },
      { q: "Does it account for minutes?", a: "You can compare raw per-game numbers or enter per-36 figures yourself for a minutes-adjusted comparison." },
    ],
  },
};
