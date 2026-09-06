import { Clock3 } from "lucide-react";
import type { Locale } from "@/lib/i18n/locales";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { getWorkspaceMessages } from "@/lib/i18n/workspace-messages";

/** Static aside chrome for tool results - server-rendered (no client JS). */
export default function ToolResultsAsideHeader({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ws = getWorkspaceMessages(locale);
  return (
    <div className="mb-4 flex items-center justify-between border-b border-violet-200/40 pb-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-md">
          <Clock3 className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p id="tool-results-heading" className="text-sm font-semibold text-slate-900">
            {ws.yourResults}
          </p>
          <p className="text-xs text-slate-500">{ws.latestOutput}</p>
        </div>
      </div>
      <span className="text-xs text-slate-500">{ws.history}</span>
    </div>
  );
}
