import axios from "axios";
import logger from "#config/logger.js";
import { downloadVideo } from "#bot/commands/download.js";

export const handleInlineQuery = (bot) => {
  bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query.trim();
    if (!query) {
      return;
    }

    const urlRegex =
      /(https?:\/\/(?:www\.)?(?:tiktok\.com|vt\.tiktok\.com|instagram\.com)\/[^\s]+)/i;
    const urlMatch = query.match(urlRegex);

    if (urlMatch) {
      const url = urlMatch[0];

      try {
        logger.info(`🚀 Обработка inline-запроса с ссылкой: ${url}`);

        // 2️⃣ Загружаем видео и получаем URL из S3
        const s3Url = await downloadVideo(url, bot);

        if (!s3Url) {
          throw new Error("Видео не загружено");
        }

        // 3️⃣ После загрузки отправляем финальный ответ (если запрос еще активен)
        return ctx.answerInlineQuery(
          [
            {
              type: "video",
              id: String(Date.now()),
              video_url: s3Url,
              mime_type: "video/mp4",
              title: "Скачанное видео",
              description: "Видео загружено через бот",
              thumb_url: "https://img.icons8.com/fluency/48/000000/video.png",
            },
          ],
          { cache_time: 1 }
        );
      } catch (error) {
        logger.error("❌ Ошибка при загрузке видео:", error);

        return ctx.answerInlineQuery(
          [
            {
              type: "article",
              id: "error",
              title: "Ошибка",
              input_message_content: {
                message_text: "🚨 Не удалось загрузить видео. Попробуйте позже.",
              },
              description: "Ошибка при скачивании видео",
            },
          ],
          { cache_time: 1 }
        );
      }
    }

    // Если это НЕ ссылка, отправляем запрос в GPT
    try {
      logger.info(`🧠 Обработка inline-запроса через GPT: ${query}`);

      const apiKey = process.env.GPT_API_KEY;
      const folderId = process.env.FOLDER_ID;

      if (!apiKey || !folderId) {
        logger.error("Ошибка: отсутствует API-ключ или Folder ID");
        return ctx.answerInlineQuery(
          [
            {
              type: "article",
              id: "gpt_error",
              title: "Ошибка",
              input_message_content: {
                message_text: "❌ Ошибка конфигурации GPT.",
              },
              description: "Отсутствует API-ключ для GPT",
            },
          ],
          { cache_time: 1 }
        );
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
          { role: "user", text: query },
        ],
      };

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

      const textResponse = response.data.result.alternatives[0].message.text;

      const escapeMarkdownV2 = (text) => {
        return text
          .replace(/_/g, "\\_")
          .replace(/\*/g, "\\*")
          .replace(/\[/g, "\\[")
          .replace(/\]/g, "\\]")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)")
          .replace(/~/g, "\\~")
          .replace(/`/g, "\\`")
          .replace(/>/g, "\\>") // <<< важно для цитаты
          .replace(/#/g, "\\#")
          .replace(/\+/g, "\\+")
          .replace(/-/g, "\\-")
          .replace(/=/g, "\\=")
          .replace(/\|/g, "\\|")
          .replace(/\{/g, "\\{")
          .replace(/\}/g, "\\}")
          .replace(/\./g, "\\.")
          .replace(/!/g, "\\!");
      };

      return ctx.answerInlineQuery(
        [
          {
            type: "article",
            id: "gpt_response",
            title: "Ответ от Хохмы 🤖",
            input_message_content: {
              message_text: `🙋*Запрос:*\n> ${escapeMarkdownV2(query)}\n🤖 *Ответ:*\n> ${escapeMarkdownV2(textResponse)}`,
              parse_mode: "MarkdownV2",
            },
            description: textResponse.slice(0, 50) + "...",
            thumb_url: "https://img.icons8.com/?size=100&id=q7wteb2_yVxu&format=png&color=000000",
          },
        ],
        { cache_time: 1 }
      );
    } catch (error) {
      logger.error("❌ Ошибка при обработке GPT-запроса:", error);

      return ctx.answerInlineQuery(
        [
          {
            type: "article",
            id: "gpt_error",
            title: "Ошибка",
            input_message_content: {
              message_text: "🚨 Ошибка при обработке запроса. Попробуйте позже.",
            },
            description: "Ошибка при вызове GPT",
          },
        ],
        { cache_time: 1 }
      );
    }
  });
};
