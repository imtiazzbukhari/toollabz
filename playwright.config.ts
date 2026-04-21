import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 90_000,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:3005",
    navigationTimeout: 90_000,
    actionTimeout: 45_000,
    trace: "on-first-retry",
  },
  webServer: {
    // Non-local HTTPS origin required by lib/seo in production. `next start` warns with `output: "standalone"` but is reliable for E2E; production Docker should use `npm run start:standalone`.
    command:
      "NEXT_PUBLIC_SITE_URL=https://e2e.toolabz.invalid npm run build && NEXT_PUBLIC_SITE_URL=https://e2e.toolabz.invalid npm run start -- -p 3005 -H 127.0.0.1",
    url: "http://127.0.0.1:3005",
    // Local: reuse if you already have the server. CI: always start fresh so env/build match.
    reuseExistingServer: !process.env.CI,
    timeout: 360_000,
  },
});
