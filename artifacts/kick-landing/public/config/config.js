const CONFIG = {
  botInviteUrl: "https://discord.com/oauth2/authorize?client_id=1500864536780210257&permissions=8&integration_type=0&scope=bot+applications.commands",
  supportServerUrl: "https://discord.gg/G352ZEwrF",
  botName: "KICK",
  githubUrl: "https://github.com/timelesshubkerala-blip/KICK_BOT_WEB",
  get statsApiUrl() {
    return typeof window !== "undefined" ? window.location.origin + "/api/bot-stats" : "/api/bot-stats";
  },
};
if (typeof window !== "undefined") window.CONFIG = CONFIG;
