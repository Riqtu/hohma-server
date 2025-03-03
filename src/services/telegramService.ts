import { getEnvVar } from "#config/env.js";
import logger from "#config/logger.js";
import axios from "axios";

const sendMessage = async (
  chatId = getEnvVar("CHAT_ID"),
  text: string,
  parseMode = "MarkdownV2"
) => {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${getEnvVar("BOT_TOKEN")}/sendMessage`,
      {
        chat_id: chatId,
        text: text,
        parse_mode: parseMode,
      }
    );
    logger.info("Сообщение отправлено:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Ошибка отправки сообщения в Telegram:", error.message);
    } else {
      logger.error("Ошибка отправки сообщения в Telegram:", error);
    }
    throw new Error("Не удалось отправить сообщение в Telegram");
  }
};

export default { sendMessage };
