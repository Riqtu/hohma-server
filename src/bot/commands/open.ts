import { getEnvVar } from "#config/env.js";
import { Telegraf } from "telegraf";

const openCommand = (bot: Telegraf) => {
  bot.command("open", (ctx) => {
    const webAppUrl = getEnvVar("WEB_APP_URL");

    ctx.reply("👋 Добро пожаловать в Хохму!", {
      reply_markup: {
        inline_keyboard: [[{ text: "🚀 Открыть Хохму", url: webAppUrl }]],
      },
    });
  });
};

export default openCommand;
