# Hotfix: ERR_SSL_PROTOCOL_ERROR → `https://toollabz.com:3000/`

**Status (2026-07-18):** FIXED in production.

## Proven root cause

1. Nginx `/etc/nginx/sites-available/toollabz` was missing `X-Forwarded-Proto`.
2. New middleware HTTPS-upgrade logic treated proxied TLS requests as plain HTTP.
3. Redirect used `request.nextUrl` which carries Node’s listen port → `Location: https://toollabz.com:3000/`.
4. Port 3000 speaks HTTP only → browser TLS handshake fails → **ERR_SSL_PROTOCOL_ERROR**.

Evidence:

```bash
# Before nginx fix:
curl -skI https://toollabz.com/   # Location: https://toollabz.com:3000/
curl -sI -H 'Host: toollabz.com' -H 'X-Forwarded-Proto: https' http://127.0.0.1:3000/  # 200 OK
curl -sI -H 'Host: toollabz.com' http://127.0.0.1:3000/  # 301 → :3000
openssl s_client -connect toollabz.com:443   # Verify return code: 0 (SSL fine)
openssl s_client -connect toollabz.com:3000  # wrong version number (HTTP on 3000)
```

## Fixes applied

### A) Nginx (immediate recovery)

Added to `location /`:

- `X-Forwarded-Proto $scheme`
- `X-Forwarded-Host $host`
- `X-Forwarded-Port $server_port`
- `X-Real-IP` / `X-Forwarded-For`
- `proxy_redirect off`

Removed mistaken duplicate `sites-enabled` bak symlink that caused `conflicting server name` warnings.

### B) Middleware (defense in depth)

`/var/www/toollabz/middleware.ts` (+ local repo):

1. Removed middleware-owned HTTP→HTTPS redirects (nginx owns scheme).
2. www→apex uses `buildPublicHttpsUrl()` with `url.port = ""`.
3. Tests: `tests/middleware-canonical.test.ts`.
4. Rebuilt standalone + `pm2 restart toollabz`.

## Single production path

Use only: **`/var/www/toollabz`** + PM2 name **`toollabz`** + nginx site **`toollabz`**.

## Verify (post-fix)

```bash
curl -skI https://toollabz.com/          # 200 OK, no Location :3000
curl -sI http://toollabz.com/            # 301 → https://toollabz.com/
curl -skI https://www.toollabz.com/      # 308/301 → https://toollabz.com (no :3000)
curl -sk https://toollabz.com/robots.txt | head
curl -sk https://toollabz.com/sitemap.xml | head -c 200
```

## Rollback

```bash
# Nginx: restore previous file content if needed
sudo cp /etc/nginx/sites-available/toollabz.bak.pre-forwarded-proto /etc/nginx/sites-available/toollabz
# (only if that backup exists and you intentionally want the broken state — not recommended)

sudo nginx -t && sudo systemctl reload nginx
cd /var/www/toollabz && git checkout -- middleware.ts && npm run build && pm2 restart toollabz
```
