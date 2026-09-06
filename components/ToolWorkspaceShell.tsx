import type { ToolDefinition } from "@/lib/tools/types";
import type { ToolPageInsight } from "@/lib/tools/tool-insights";
import type { Locale } from "@/lib/i18n/locales";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { getWorkspaceMessages } from "@/lib/i18n/workspace-messages";
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
  locale = DEFAULT_LOCALE,
}: {
  tool: ToolDefinition;
  insight: ToolPageInsight | null;
  locale?: Locale;
}) {
  const ws = getWorkspaceMessages(locale);
  return (
    <div className="space-y-4">
      <ToolWorkspaceClient
        tool={tool}
        locale={locale}
        asideHeader={<ToolResultsAsideHeader locale={locale} />}
        insightPanel={<ToolInsightPanel insight={insight} />}
      />
      <p className="text-center text-[11px] leading-snug text-slate-500">{ws.disclaimerFormula}</p>
      <p className="text-center text-xs text-slate-500">{ws.disclaimerEstimate}</p>
    </div>
  );
}
