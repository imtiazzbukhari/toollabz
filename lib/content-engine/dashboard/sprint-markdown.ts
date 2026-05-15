import type { ImpactComparisonSnapshot } from "./impact-comparison";
import type { LearningSnapshot } from "./learning-engine";
import type { MonetizationSprintPlan } from "./monetization-sprint";

export function buildSprintMarkdown(input: {
  sprint: MonetizationSprintPlan;
  impact: ImpactComparisonSnapshot;
  learning: LearningSnapshot;
}): string {
  const lines: string[] = [];
  lines.push("# Monetization sprint plan", "");
  lines.push(`Week of: ${input.sprint.weekOf}`, "");
  lines.push("## Top actions", "");
  for (const a of input.sprint.topActions) {
    lines.push(`### ${a.order}. ${a.targetPage}: ${a.exactFix}`);
    lines.push(`- Est. time: ${a.estimatedHours}h`);
    lines.push(`- Expected uplift: $${a.expectedRevenueImpactUsd.toFixed(2)} (${a.confidence})`);
    lines.push("- Checklist:");
    lines.push(`  - [ ] ${a.prChecklist.contentChanges[0]}`);
    lines.push(`  - [ ] ${a.prChecklist.linkingUpdates[0]}`);
    lines.push(`  - [ ] ${a.prChecklist.ctaUpdates[0]}`);
    lines.push(`  - [ ] ${a.prChecklist.adPlacement[0]}`);
    lines.push("");
  }
  lines.push("## Weekly summary", "");
  lines.push(`- Estimated hours: ${input.sprint.weeklyExecutionSummary.estimatedHours}`);
  lines.push(`- Expected revenue gain: $${input.sprint.weeklyExecutionSummary.expectedRevenueGainUsd.toFixed(2)}`);
  lines.push(`- Current model accuracy: ${input.impact.averageAccuracyScore.toFixed(1)}`);
  lines.push("");
  lines.push("## Learning insights", "");
  for (const i of input.learning.insights) {
    lines.push(`- ${i.fixType}: win rate ${i.winRate.toFixed(1)}%, avg actual $${i.avgActualLiftUsd.toFixed(2)}. ${i.recommendation}`);
  }
  lines.push("");
  return lines.join("\n");
}

