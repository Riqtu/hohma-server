import logger from "#config/logger.js";
import axios from "axios";

const sendMessage = async (chatId = process.env.CHAT_ID, text, parseMode = "MarkdownV2") => {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: text,
        parse_mode: parseMode,
      }
    );
    logger.info("Сообщение отправлено:", response.data);
    return response.data;
  } catch (error) {
    logger.error("Ошибка отправки сообщения в Telegram:", error.response?.data || error.message);
    throw new Error("Не удалось отправить сообщение в Telegram");
  }
};

export default { sendMessage };
