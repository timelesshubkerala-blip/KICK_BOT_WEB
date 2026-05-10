const CONFIG = {
  botInviteUrl: "https://discord.com/oauth2/authorize?client_id=1500171622982619177&permissions=8&integration_type=0&scope=bot+applications.commands",
  supportServerUrl: "https://discord.gg/G352ZEwrF",
  botName: "KICK",
  botDescription: "Your Discord Companion - Anti-Nuke, AI Chat, Music, Leveling and 100+ commands for your Discord server.",
  githubUrl: "https://github.com/timelesshubkerala-blip/KICK_BOT_WEB",

  // Auto-detects the current host at runtime — works on Replit, aeroxdevs.in, localhost, or any other domain.
  // Override this only if your API is on a completely separate domain.
  get statsApiUrl() {
    if (typeof window === "undefined") return "/api/bot-stats";
    return window.location.origin + "/api/bot-stats";
  },
};

if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
