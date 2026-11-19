import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolShell from "@/components/ToolShell";
import { TOOLS, getTool } from "@/lib/tools";
import { TOOL_CONTENT } from "@/lib/tool-content";
import SalaryCapCalculator from "@/components/tools/SalaryCapCalculator";
import LuxuryTaxCalculator from "@/components/tools/LuxuryTaxCalculator";
import FantasyTradeAnalyzer from "@/components/tools/FantasyTradeAnalyzer";
import FantasyPointsCalculator from "@/components/tools/FantasyPointsCalculator";
import AdvancedStatsCalculator from "@/components/tools/AdvancedStatsCalculator";
import RecordPredictor from "@/components/tools/RecordPredictor";
import PlayoffBracketSimulator from "@/components/tools/PlayoffBracketSimulator";
import PlayerComparison from "@/components/tools/PlayerComparison";

const COMPONENTS: Record<string, React.ComponentType> = {
  "salary-cap-calculator": SalaryCapCalculator,
  "luxury-tax-calculator": LuxuryTaxCalculator,
  "fantasy-trade-analyzer": FantasyTradeAnalyzer,
  "fantasy-points-calculator": FantasyPointsCalculator,
  "advanced-stats-calculator": AdvancedStatsCalculator,
  "record-predictor": RecordPredictor,
  "playoff-bracket-simulator": PlayoffBracketSimulator,
  "player-comparison": PlayerComparison,
};

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    openGraph: { title: tool.title, description: tool.description },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  const content = TOOL_CONTENT[slug];
  const ToolComponent = COMPONENTS[slug];
  if (!tool || !content || !ToolComponent) notFound();

  return (
    <ToolShell
      title={tool.title}
      description={tool.description}
      icon={tool.icon}
      slug={tool.slug}
      steps={content.steps}
      faqs={content.faqs}
    >
      <ToolComponent />
    </ToolShell>
  );
}
