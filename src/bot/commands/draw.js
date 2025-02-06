import logger from "#config/logger.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Markup } from "telegraf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Храним состояние пользователей, которые вызвали /draw без текста
const userState = new Map();
// Храним активные запросы генерации
const activeRequests = new Map();

const drawCommand = (bot) => {
  bot.command("draw", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
      return;
    }

    const prompt = ctx.message.text.replace(/\/draw(@\w+)?/, "").trim();

    if (prompt) {
      generateImage(ctx, prompt);
    } else {
      userState.set(userId, true);
      ctx.reply(
        "✏️ Напишите описание изображения, и я его нарисую!",
        Markup.inlineKeyboard([Markup.button.callback("❌ Отменить", `cancel_waiting_${userId}`)])
      );
    }
  });

  bot.on("text", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId || !userState.get(userId)) {
      return;
    }

    const prompt = ctx.message.text.trim();
    userState.delete(userId);

    if (!prompt) {
      ctx.reply("⚠️ Описание не должно быть пустым.");
      return;
    }

    generateImage(ctx, prompt);
  });

  // Команда /cancel для отмены ожидания ввода
  bot.command("cancel", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId || !userState.has(userId)) {
      ctx.reply("❌ Нет активного ожидания запроса.");
      return;
    }

    userState.delete(userId);
    ctx.reply("❌ Ожидание ввода отменено.");
  });

  // Обработка кнопки отмены ожидания ввода
  bot.action(/^cancel_waiting_(\d+)$/, async (ctx) => {
    const userId = Number(ctx.match[1]);
    if (!userState.has(userId)) {
      ctx.answerCbQuery("Нет активного ожидания.");
      return;
    }

    userState.delete(userId);
    ctx.answerCbQuery("Ожидание отменено.");
    ctx.editMessageText("❌ Ожидание ввода отменено.");
  });

  // Обработка кнопки отмены генерации
  bot.action(/^cancel_(\d+)$/, async (ctx) => {
    const userId = Number(ctx.match[1]);
    if (!activeRequests.has(userId)) {
      ctx.answerCbQuery("Нет активного запроса для отмены.");
      return;
    }

    activeRequests.delete(userId);
    ctx.answerCbQuery("Генерация отменена.");
    ctx.editMessageText("❌ Генерация изображения отменена.");
  });
};

// Функция генерации изображения
const generateImage = async (ctx, prompt) => {
  const userId = ctx.from?.id;
  if (!userId) {
    return;
  }

  const apiKey = process.env.GPT_API_KEY;
  const folderId = process.env.FOLDER_ID;

  if (!apiKey || !folderId) {
    logger.error("Ошибка: отсутствует API-ключ или Folder ID");
    ctx.reply("Ошибка конфигурации: отсутствует API-ключ.");
    return;
  }

  // Отправляем сообщение с кнопкой отмены
  const cancelMessage = await ctx.reply(
    `🎨 Генерация изображения... Пожалуйста, подождите.`,
    Markup.inlineKeyboard([Markup.button.callback("❌ Отменить", `cancel_${userId}`)])
  );

  activeRequests.set(userId, cancelMessage.message_id);

  const data = {
    modelUri: `art://${folderId}/yandex-art/latest`,
    generationOptions: { width: 1024, height: 1024 },
    messages: [{ weight: "1", text: prompt }],
  };

  let requestId;
  try {
    const response = await axios.post(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync",
      data,
      { headers: { Authorization: `Api-Key ${apiKey}`, "x-folder-id": folderId } }
    );
    requestId = response.data.id;
  } catch (error) {
    logger.error("Ошибка при отправке запроса:", error);
    ctx.reply("❌ Ошибка связи с API. Попробуйте позже.");
    return;
  }

  let imageData = null;
  const maxAttempts = 24;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;
    await new Promise((resolve) => setTimeout(resolve, 5000));

    if (!activeRequests.has(userId)) {
      return; // Генерация отменена
    }

    logger.info(`🔄 Проверка статуса генерации (попытка ${attempt}/${maxAttempts})...`);

    let statusResponse;
    try {
      statusResponse = await axios.get(
        `https://llm.api.cloud.yandex.net:443/operations/${requestId}`,
        { headers: { Authorization: `Api-Key ${apiKey}`, "x-folder-id": folderId } }
      );
    } catch (error) {
      logger.error("Ошибка при запросе статуса:", error.message);
      ctx.reply("❌ Ошибка связи с API. Попробуйте позже.");
      return;
    }

    if (statusResponse.data.done) {
      if (statusResponse.data.response?.image) {
        logger.info("Генерация завершена!");
        imageData = statusResponse.data.response.image;
        break;
      } else {
        ctx.reply("❌ Ошибка: изображение не было создано.");
        return;
      }
    }
  }

  activeRequests.delete(userId);

  if (!imageData) {
    ctx.reply("⏳ Время ожидания истекло. Попробуйте позже.");
    return;
  }

  const filePath = path.resolve(__dirname, "../generated_image.png");

  try {
    const imageBuffer = Buffer.from(imageData, "base64");
    await fs.promises.writeFile(filePath, imageBuffer);
  } catch (err) {
    logger.error(err);
    ctx.reply("❌ Ошибка сохранения изображения.");
    return;
  }

  await ctx.replyWithPhoto({ source: filePath }, { caption: `🖼 Запрос: "${prompt}"` });

  fs.promises.unlink(filePath).catch(() => {});
};

export default drawCommand;
