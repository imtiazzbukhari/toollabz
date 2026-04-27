import { SITE_LAST_UPDATED_ISO, formatSiteLastUpdatedForDisplay } from "@/lib/site-freshness";

/** Visible freshness line (same typography family as existing meta lines). */
export default function PageLastUpdated({
  className = "",
  variant = "content",
}: {
  className?: string;
  /** Editorial / YMYL pages: E-E-A-T style “reviewed” wording. */
  variant?: "content" | "editorial";
}) {
  return (
    <p className={`text-xs text-slate-500 ${className}`.trim()}>
      {variant === "editorial" ? (
        <>
          <span className="text-slate-400">Last reviewed by Toollabz editorial · </span>
          <time dateTime={SITE_LAST_UPDATED_ISO}>{formatSiteLastUpdatedForDisplay()}</time>
        </>
      ) : (
        <>
          <span className="text-slate-400">Last updated </span>
          <time dateTime={SITE_LAST_UPDATED_ISO}>{formatSiteLastUpdatedForDisplay()}</time>
        </>
      )}
    </p>
  );
}
