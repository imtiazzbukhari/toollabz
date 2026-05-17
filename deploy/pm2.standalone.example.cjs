/**
 * PM2 example for Next.js `output: "standalone"`.
 *
 * Run from repo root (path to `server.js` is relative to cwd):
 *   script: ".next/standalone/server.js"
 *
 * The generated `server.js` calls `process.chdir(__dirname)` so static files resolve
 * under `.next/standalone/.next/static` as long as you deploy the full standalone tree
 * produced by `npm run build` (includes `copy-standalone-assets` + `validate-standalone-assets`).
 *
 * Usage (adjust cwd):
 *   pm2 start deploy/pm2.standalone.example.cjs
 */
module.exports = {
  apps: [
    {
      name: "toollabz",
      cwd: "/var/www/toollabz",
      script: ".next/standalone/server.js",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
