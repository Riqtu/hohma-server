import connectDB from "./db.js";
import setupSwagger from "./swagger.js";
import startScheduler from "../services/scheduler.js";
import initializeBot from "../bot/bot.js";
import logger from "./logger.js";

export const initializeServer = (app) => {
  connectDB(process.env.MONGO_URI);
  setupSwagger(app);
  startScheduler();

  const bot = initializeBot();

  bot
    .launch()
    .then(() => logger.info("🚀 Бот успешно запущен"))
    .catch((err) => logger.error("❌ Ошибка запуска бота:", err));

  // Обработка остановки
  process.once("SIGINT", () => {
    logger.info("🛑 Бот корректно завершает работу (SIGINT)");
    bot.stop("SIGINT");
  });

  process.once("SIGTERM", () => {
    logger.info("🛑 Бот корректно завершает работу (SIGTERM)");
    bot.stop("SIGTERM");
  });
};
