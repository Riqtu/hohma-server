// src/bot/bot.js
import { Telegraf } from "telegraf";
import randomCommand from "./commands/random.js";
import pollCommand from "./commands/poll.js";
import openCommand from "./commands/open.js";
import drawCommand from "./commands/draw.js";
import unifiedTextHandler from "./events/message.js";

const initializeBot = () => {
  if (!process.env.BOT_TOKEN) {
    throw new Error("❌ BOT_TOKEN не задан в .env");
  }

  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.telegram.setMyCommands([
    { command: "open", description: "Открыть хохму" },
    { command: "poll", description: "Создать опрос на киновечер" },
    { command: "random", description: "Получить случайный ответ (Да или Нет)" },
    { command: "draw", description: "Нарисовать картинку по описанию" },
  ]);

  // Регистрируем единый обработчик текстовых сообщений
  unifiedTextHandler(bot);

  // Регистрируем остальные команды
  randomCommand(bot);
  pollCommand(bot);
  openCommand(bot);
  drawCommand(bot);

  return bot;
};

export default initializeBot;
