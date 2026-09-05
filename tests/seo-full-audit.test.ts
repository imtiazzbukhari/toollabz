import { describe, expect, it } from "vitest";
import { runSeoFullAudit } from "../scripts/seo-full-audit";
import { validateIndexability } from "../scripts/validate-indexability";

describe("SEO full audit suite", () => {
  it("passes the combined technical SEO checks", async () => {
    const { failed, rows } = await runSeoFullAudit();
    const failures = rows.filter((r) => !r.pass).map((r) => `${r.name}: ${r.detail}`);
    expect(failures, failures.join("\n")).toEqual([]);
    expect(failed).toBe(0);
  });

  it("keeps private routes out of the index", async () => {
    const rows = await validateIndexability();
    expect(rows.filter((r) => !r.pass)).toEqual([]);
  });
});
