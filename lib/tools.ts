export type Tool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: "Calculator" | "Simulator" | "Analyzer";
  icon: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "salary-cap-calculator",
    title: "NBA Salary Cap Calculator",
    shortTitle: "Salary Cap",
    description:
      "Free NBA salary cap calculator. Add player contracts and instantly see your total payroll, cap space, and luxury tax position.",
    category: "Calculator",
    icon: "💰",
  },
  {
    slug: "luxury-tax-calculator",
    title: "NBA Luxury Tax Calculator",
    shortTitle: "Luxury Tax",
    description:
      "Calculate your NBA luxury tax bill with the league's progressive tax brackets. See first-timer and repeat-taxpayer rates.",
    category: "Calculator",
    icon: "🧾",
  },
  {
    slug: "fantasy-trade-analyzer",
    title: "Fantasy Basketball Trade Analyzer",
    shortTitle: "Trade Analyzer",
    description:
      "Analyze any fantasy basketball trade. Compare player values, category impact, and see which side wins the deal.",
    category: "Analyzer",
    icon: "🔄",
  },
  {
    slug: "fantasy-points-calculator",
    title: "Fantasy Basketball Points Calculator",
    shortTitle: "Points Calculator",
    description:
      "Calculate fantasy basketball points for any scoring format — standard 9-cat, points leagues, or custom weights.",
    category: "Calculator",
    icon: "🏀",
  },
  {
    slug: "advanced-stats-calculator",
    title: "Basketball Advanced Stats Calculator",
    shortTitle: "Advanced Stats",
    description:
      "Compute PER, True Shooting %, Usage Rate, and more advanced basketball stats from basic box score numbers.",
    category: "Calculator",
    icon: "📊",
  },
  {
    slug: "record-predictor",
    title: "NBA Record Predictor",
    shortTitle: "Record Predictor",
    description:
      "Predict a team's win-loss record from points scored and allowed using the Pythagorean expectation formula.",
    category: "Simulator",
    icon: "📈",
  },
  {
    slug: "playoff-bracket-simulator",
    title: "NBA Playoff Bracket Simulator",
    shortTitle: "Bracket Simulator",
    description:
      "Build and simulate an NBA playoff bracket. Pick winners round by round and see your championship matchup.",
    category: "Simulator",
    icon: "🏆",
  },
  {
    slug: "player-comparison",
    title: "NBA Player Comparison Tool",
    shortTitle: "Player Comparison",
    description:
      "Compare two NBA players side by side across every stat. See who has the edge in points, rebounds, assists, and more.",
    category: "Analyzer",
    icon: "⚔️",
  },
  {
    slug: "team-salary-trade-simulator",
    title: "NBA Salary & Trade Simulator",
    shortTitle: "Salary & Trade Simulator",
    description:
      "Explore every team's payroll, cap space and tax status, then simulate trades between two teams with real-time salary-cap and CBA rule validation.",
    category: "Simulator",
    icon: "💼",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function relatedTools(slug: string, count = 4): Tool[] {
  return TOOLS.filter((t) => t.slug !== slug).slice(0, count);
}

const DEFAULT_SITE_URL = "https://nbatools.example.com";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
export const SITE_NAME = "NBA Tools";
