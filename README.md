# KICK Bot — Landing Page & API Server

A sleek dark-themed landing page for **KICK Discord Bot**, with a live stats API that pulls real-time data from Discord. Works on **any host** — Replit, a VPS, `control.aeroxdevs.in`, or localhost — with zero config changes.

## How it works

| Layer | What it does |
|---|---|
| `artifacts/kick-landing` | Static landing page (Vite) served at `/` |
| `artifacts/api-server` | Express API served at `/api` |
| `/api/bot-stats` | Returns live bot status, server count, user count, latency |

The frontend uses `window.location.origin + "/api/bot-stats"` to auto-detect the host at runtime, so **no hardcoded URLs anywhere**.

## Quick start

### 1. Install

```bash
pnpm install
```

### 2. Configure environment

```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
```

Edit `.env`:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
PORT=8080
NODE_ENV=production
```

> **Get your token:** Discord Developer Portal → Your App → Bot → Reset Token  
> **Never share it** — Discord auto-revokes tokens that appear in public chats or files.

### 3. Run

```bash
# Terminal 1 — API server
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Landing page
pnpm --filter @workspace/kick-landing run dev
```

## Deploying on a custom domain (e.g. control.aeroxdevs.in)

Route `/api` → port 8080 and `/` → port 21236 behind a reverse proxy. Example **Nginx** config:

```nginx
server {
    listen 443 ssl;
    server_name control.aeroxdevs.in;

    # SSL certs here

    location /api {
        proxy_pass         http://127.0.0.1:8080;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass         http://127.0.0.1:21236;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
    }
}
```

The API automatically reflects the CORS origin, so requests from any domain are allowed.

## Bot Links

- **Invite:** https://discord.com/oauth2/authorize?client_id=1500171622982619177&permissions=8&integration_type=0&scope=bot+applications.commands
- **Support Server:** https://discord.gg/G352ZEwrF
- **GitHub:** https://github.com/timelesshubkerala-blip/KICK_BOT_WEB

## Project structure

```
artifacts/
  kick-landing/
    index.html               ← Full landing page (dark theme, 487 lines)
    public/
      config/config.js       ← Bot config (auto-detects host)
      assets/images/
        kick-logo.gif        ← Bot logo
  api-server/
    src/
      app.ts                 ← Express app (CORS: any origin)
      routes/
        discord.ts           ← GET /api/bot-stats (30s cache)
        health.ts            ← GET /api/healthz
```
