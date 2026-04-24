import type { BehaviorAggregates } from "../growth/behavior-types";

export type PersonalizationRow = {
  path: string;
  dominantSegment: "scanner" | "researcher" | "ready_to_act";
  recommendations: string[];
};

export function buildContentPersonalizationHints(behavior: BehaviorAggregates | null, max = 16): PersonalizationRow[] {
  const out: PersonalizationRow[] = [];
  for (const row of Object.values(behavior?.byPath ?? {})) {
    if (row.sampleCount < 6) continue;
    const seg = row.segmentCounts;
    const dominantSegment =
      seg.ready_to_act >= seg.researcher && seg.ready_to_act >= seg.scanner
        ? "ready_to_act"
        : seg.researcher >= seg.scanner
          ? "researcher"
          : "scanner";
    const recommendations =
      dominantSegment === "ready_to_act"
        ? ["Show calculator CTA in top section", "Add quick result preview before long explanation"]
        : dominantSegment === "researcher"
          ? ["Expand comparison and FAQ blocks", "Add deeper methodology note and assumptions table"]
          : ["Shorten intro and add bullet summary", "Place jump-links and one lightweight tool prompt early"];
    out.push({ path: row.path, dominantSegment, recommendations });
  }
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out.slice(0, max);
}

