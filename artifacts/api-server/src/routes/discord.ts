import { Router, type IRouter } from "express";

const router: IRouter = Router();
let cache: { data: object; ts: number } | null = null;
const TTL = 30_000;

router.get("/bot-stats", async (_req, res) => {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) { res.status(503).json({ error: "Bot token not configured" }); return; }
  if (cache && Date.now() - cache.ts < TTL) { res.json(cache.data); return; }

  const headers = { Authorization: `Bot ${token}`, "Content-Type": "application/json", "User-Agent": "KickBot/1.0" };
  try {
    const t0 = Date.now();
    const [bRes, aRes] = await Promise.all([
      fetch("https://discord.com/api/v10/users/@me", { headers }),
      fetch("https://discord.com/api/v10/applications/@me", { headers }),
    ]);
    const latency = Date.now() - t0;
    if (!bRes.ok) { const e = await bRes.json().catch(() => ({})); res.json({ online: false, error: "Discord API error", status: bRes.status, detail: e }); return; }
    const bot = await bRes.json() as { id: string; username: string; discriminator: string; avatar: string | null };
    let guildCount: number | null = null, approximateUserCount: number | null = null;
    if (aRes.ok) { const a = await aRes.json() as { approximate_guild_count?: number; approximate_user_install_count?: number }; guildCount = a.approximate_guild_count ?? null; approximateUserCount = a.approximate_user_install_count ?? null; }
    const avatarUrl = bot.avatar ? `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.gif` : `https://cdn.discordapp.com/embed/avatars/0.png`;
    const data = { online: true, latency, username: bot.username, discriminator: bot.discriminator, avatarUrl, guildCount, approximateUserCount, checkedAt: new Date().toISOString() };
    cache = { data, ts: Date.now() };
    res.json(data);
  } catch { res.status(500).json({ online: false, error: "Failed to reach Discord API" }); }
});

export default router;
