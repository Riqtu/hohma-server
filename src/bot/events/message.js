// src/bot/events/message.js
import axios from "axios";
import logger from "#config/logger.js";
import { userState } from "../sharedState.js"; // Импорт общего состояния
import { generateImage } from "#bot/services/imageGenerator.js";

/**
 * Единый обработчик входящих текстовых сообщений.
 * Если пользователь находится в режиме ожидания (после команды /draw без описания) – берет введённый текст как описание.
 * Если сообщение содержит упоминание бота – отправляет запрос в YandexGPT.
 */
// src/bot/unifiedHandler.js
// src/bot/events/message.js (unifiedTextHandler)
export const unifiedTextHandler = (bot) => {
  bot.on("text", async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) {
      return next();
    }

    const text = ctx.message.text;

    // Если сообщение начинается с команды, передаём его дальше
    if (text.startsWith("/")) {
      return next();
    }

    // 1. Если пользователь ожидает ввода описания для команды /draw:
    if (userState.get(userId)) {
      const prompt = text.trim();
      userState.delete(userId);
      if (!prompt) {
        return ctx.reply("⚠️ Описание не должно быть пустым.");
      }
      return generateImage(ctx, prompt);
    }

    // 2. Если сообщение содержит упоминание бота – обрабатываем GPT-запрос:
    if (text.includes(ctx.botInfo.username)) {
      try {
        const command = text.replace(`@${ctx.botInfo.username}`, "").trim();
        const apiKey = process.env.GPT_API_KEY;
        const folderId = process.env.FOLDER_ID;

        if (!apiKey || !folderId) {
          logger.error("Ошибка: отсутствует API-ключ или Folder ID");
          return ctx.reply("Ошибка конфигурации: отсутствует API-ключ.");
        }

        const data = {
          modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
          completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens: 500,
          },
          messages: [
            {
              role: "system",
              text: 'Ты дружелюбная ассистентка по имени "Хохма". Отвечай на вопросы и шути.',
            },
            { role: "user", text: command },
          ],
        };

        logger.info("Отправляем запрос в YandexGPT:", JSON.stringify(data, null, 2));
        const response = await axios.post(
          "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
          data,
          {
            headers: {
              Authorization: `Api-Key ${apiKey}`,
              "x-folder-id": folderId,
            },
          }
        );

        logger.info("Ответ от YandexGPT:", response.data);
        return ctx.reply(response.data.result.alternatives[0].message.text);
      } catch (error) {
        logger.error("Ошибка запроса в YandexGPT:", error.response?.data || error);
        return ctx.reply("Произошла ошибка при обработке запроса. Попробуйте позже.");
      }
    }

    // Если ни одно условие не выполнено, передаём управление следующему обработчику
    return next();
  });
};

export default unifiedTextHandler;
