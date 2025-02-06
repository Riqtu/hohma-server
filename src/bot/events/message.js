import { message } from "telegraf/filters";
import axios from "axios";
import logger from "#config/logger.js";

const registerMessageHandler = (bot) => {
  bot.on(message("text"), async (ctx) => {
    try {
      const msg = ctx.message.text;

      if (msg.includes(ctx.botInfo.username)) {
        const command = msg.replace(`@${ctx.botInfo.username}`, "").trim();

        const apiKey = process.env.GPT_API_KEY;
        const folderId = process.env.FOLDER_ID;

        if (!apiKey || !folderId) {
          logger.error("Ошибка: отсутствует API-ключ или Folder ID");
          ctx.reply("Ошибка конфигурации: отсутствует API-ключ.");
          return;
        }

        const data = {
          modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
          completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens: 500, // Уменьшили maxTokens
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
        ctx.reply(response.data.result.alternatives[0].message.text);
      }
    } catch (error) {
      logger.error("Ошибка запроса в YandexGPT:", error.response?.data || error);
      ctx.reply("Произошла ошибка при обработке запроса. Попробуйте позже.");
    }
  });
};

export default registerMessageHandler;
