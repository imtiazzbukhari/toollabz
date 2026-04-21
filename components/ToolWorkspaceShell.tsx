import type { ToolDefinition } from "@/lib/tools/types";
import type { ToolPageInsight } from "@/lib/tools/tool-insights";
import ToolInsightPanel from "@/components/ToolInsightPanel";
import ToolResultsAsideHeader from "@/components/tool-workspace/ToolResultsAsideHeader";
import ToolWorkspaceClient from "@/components/tool-workspace/ToolWorkspaceClient";

/**
 * Server shell for the tool workspace: static disclaimer + server-rendered insight,
 * with a minimal client island for forms, results, and history.
 */
export default function ToolWorkspaceShell({
  tool,
  insight,
}: {
  tool: ToolDefinition;
  insight: ToolPageInsight | null;
}) {
  return (
    <div className="space-y-4">
      <ToolWorkspaceClient
        tool={tool}
        asideHeader={<ToolResultsAsideHeader />}
        insightPanel={<ToolInsightPanel insight={insight} />}
      />
      <p className="text-center text-xs text-slate-500">
        * This is an estimate. Actual amounts may vary slightly based on input assumptions.
      </p>
    </div>
  );
}
