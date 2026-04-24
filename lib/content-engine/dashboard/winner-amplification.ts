import type { PerformanceAggregates } from "../performance/types";
import { clusterIdForPath } from "./cluster-utils";

export type WinnerAmplificationRow = {
  sourcePath: string;
  clusterId: string | null;
  ideas: string[];
};

export function buildWinnerAmplificationIdeas(performance: PerformanceAggregates | null, max = 8): WinnerAmplificationRow[] {
  const pages = performance?.pages ?? [];
  const top = [...pages]
    .filter((p) => p.clicks >= 25 || p.impressions >= 2500)
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, max);
  return top.map((p) => {
    const seed = p.path.replace(/^\/(blog|tools)\//, "").replace(/-/g, " ");
    const clusterId = clusterIdForPath(p.path);
    return {
      sourcePath: p.path,
      clusterId,
      ideas: [
        `${seed}: deeper guide with worked example`,
        `${seed}: comparison vs alternatives`,
        `${seed}: mistakes checklist and decision framework`,
      ],
    };
  });
}

