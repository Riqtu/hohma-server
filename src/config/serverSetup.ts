import connectDB from "./db.js";
import { Express } from "express";
import startScheduler from "../services/scheduler.js";
import initializeBot from "../bot/bot.js";
import logger from "./logger.js";
import { getEnvVar } from "./env.js";
import { Telegraf } from "telegraf";

let botInstance: Telegraf | null = null;

const startBot = async () => {
  try {
    if (botInstance) {
      await botInstance.stop();
      logger.info("🔄 Перезапуск бота...");
    }

    botInstance = initializeBot();

    await botInstance.launch();
    logger.info("🚀 Бот успешно запущен");
  } catch (err) {
    logger.error("❌ Ошибка запуска бота:", err);
    setTimeout(startBot, 5000); // Повторный запуск через 5 секунд
  }
};

export const initializeServer = (app: Express) => {
  connectDB(getEnvVar("MONGO_URI"));
  startScheduler();

  startBot(); // Запускаем бота

  // Обработка остановки
  process.once("SIGINT", async () => {
    logger.info("🛑 Бот корректно завершает работу (SIGINT)");
    if (botInstance) await botInstance.stop("SIGINT");
  });

  process.once("SIGTERM", async () => {
    logger.info("🛑 Бот корректно завершает работу (SIGTERM)");
    if (botInstance) await botInstance.stop("SIGTERM");
  });
};
