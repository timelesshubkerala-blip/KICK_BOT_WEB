import { Router, type IRouter } from "express";

const router: IRouter = Router();

let cache: { data: object; timestamp: number } | null = null;
const CACHE_TTL = 30_000;

router.get("/bot-stats", async (_req, res) => {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    res.status(503).json({ error: "Bot token not configured" });
    return;
  }

  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    res.json(cache.data);
    return;
  }

  const headers = {
    Authorization: `Bot ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "KickBot/1.0",
  };

  try {
    const start = Date.now();
    const [botRes, appRes] = await Promise.all([
      fetch("https://discord.com/api/v10/users/@me", { headers }),
      fetch("https://discord.com/api/v10/applications/@me", { headers }),
    ]);
    const latency = Date.now() - start;

    if (!botRes.ok) {
      const errBody = await botRes.json().catch(() => ({}));
      res.json({ online: false, error: "Discord API error", status: botRes.status, detail: errBody });
      return;
    }

    const bot = await botRes.json() as {
      id: string;
      username: string;
      discriminator: string;
      avatar: string | null;
      bot: boolean;
    };

    let guildCount: number | null = null;
    let approximateUserCount: number | null = null;

    if (appRes.ok) {
      const app = await appRes.json() as {
        approximate_guild_count?: number;
        approximate_user_install_count?: number;
      };
      guildCount = app.approximate_guild_count ?? null;
      approximateUserCount = app.approximate_user_install_count ?? null;
    }

    const avatarUrl = bot.avatar
      ? `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.gif`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    const data = {
      online: true,
      latency,
      username: bot.username,
      discriminator: bot.discriminator,
      avatarUrl,
      guildCount,
      approximateUserCount,
      checkedAt: new Date().toISOString(),
    };

    cache = { data, timestamp: Date.now() };
    res.json(data);
  } catch (err) {
    res.status(500).json({ online: false, error: "Failed to reach Discord API" });
  }
});

export default router;
