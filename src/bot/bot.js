import { Telegraf } from "telegraf";
import randomCommand from "./commands/random.js";
import pollCommand from "./commands/poll.js";
import openCommand from "./commands/open.js";
import drawCommand from "./commands/draw.js";
import registerMessageHandler from "./events/message.js";

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

  // Передаём `bot` в команды, чтобы они могли зарегистрироваться
  randomCommand(bot);
  pollCommand(bot);
  openCommand(bot);
  drawCommand(bot);

  registerMessageHandler(bot);

  return bot;
};

// Экспортируем функцию инициализации бота, но НЕ запускаем `bot.launch()` здесь!
export default initializeBot;
