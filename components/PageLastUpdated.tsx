import { SITE_LAST_UPDATED_ISO, formatSiteLastUpdatedForDisplay } from "@/lib/site-freshness";

/** Visible freshness line (same typography family as existing meta lines). */
export default function PageLastUpdated({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-slate-500 ${className}`.trim()}>
      <span className="text-slate-400">Last updated </span>
      <time dateTime={SITE_LAST_UPDATED_ISO}>{formatSiteLastUpdatedForDisplay()}</time>
    </p>
  );
}
