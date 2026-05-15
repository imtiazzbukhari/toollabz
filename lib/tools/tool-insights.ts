import { TOOL_INSIGHTS_A } from "./insight-registry/registry-a";
import { TOOL_INSIGHTS_B } from "./insight-registry/registry-b";
import { TOOL_INSIGHTS_C } from "./insight-registry/registry-c";
import { TOOL_INSIGHTS_D } from "./insight-registry/registry-d";
import { TOOL_INSIGHTS_E } from "./insight-registry/registry-e";
import { TOOL_INSIGHTS_F } from "./insight-registry/registry-f";
import { TOOL_INSIGHTS_G } from "./insight-registry/registry-g";
import { TOOL_INSIGHTS_H } from "./insight-registry/registry-h";
import { TOOL_INSIGHTS_I } from "./insight-registry/registry-i";
import { TOOL_INSIGHTS_J } from "./insight-registry/registry-j";
import type { ToolPageInsight } from "./tool-insights-types";

export type { ToolPageInsight } from "./tool-insights-types";

export const TOOL_INSIGHTS: Record<string, ToolPageInsight> = {
  ...TOOL_INSIGHTS_A,
  ...TOOL_INSIGHTS_B,
  ...TOOL_INSIGHTS_C,
  ...TOOL_INSIGHTS_D,
  ...TOOL_INSIGHTS_E,
  ...TOOL_INSIGHTS_F,
  ...TOOL_INSIGHTS_G,
  ...TOOL_INSIGHTS_H,
  ...TOOL_INSIGHTS_I,
  ...TOOL_INSIGHTS_J,
};

export function getToolInsight(slug: string): ToolPageInsight | null {
  return TOOL_INSIGHTS[slug] ?? null;
}
