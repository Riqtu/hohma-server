import schedule from "node-schedule";
import axios from "axios";
import telegramService from "../services/telegramService.js";
import logger from "#config/logger.js";

const escapeMarkdownV2 = (text) => text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");

const startScheduler = () => {
  schedule.scheduleJob("0 5 * * *", async () => {
    logger.info("Запущена задача отправки аффирмации.");

    try {
      const affirmation = await axios.get("https://hohma-server.ru/api/affirmations/random");

      if (affirmation.data) {
        const affirmationText = escapeMarkdownV2(
          affirmation?.data?.text || "Не удалось получить аффирмацию"
        );
        const message = [
          "*🌟 Ежедневная ХОХМфирмация 🌟*",
          "",
          `> ${affirmationText}`,
          "",
          "_Удачного вам дня_",
        ].join("\n");

        await telegramService.sendMessage(process.env.CHAT_ID, message, "MarkdownV2");
      } else {
        logger.error("Не удалось получить аффирмацию.");
      }
    } catch (error) {
      logger.error("Ошибка при получении аффирмации:", error);
    }
  });
};

export default startScheduler;
