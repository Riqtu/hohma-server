// src/bot/commands/draw.js
import { Markup } from "telegraf";
import { userState } from "../sharedState.js";
import { generateImage } from "../services/imageGenerator.js";

const drawCommand = (bot) => {
  bot.command("draw", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
      return;
    }

    const prompt = ctx.message.text.replace(/\/draw(@\w+)?/, "").trim();

    if (prompt) {
      // Если описание указано сразу, запускаем генерацию
      return generateImage(ctx, prompt);
    } else {
      // Переводим пользователя в режим ожидания описания
      userState.set(userId, true);
      ctx.reply(
        "✏️ Напишите описание изображения, и я его нарисую!",
        Markup.inlineKeyboard([Markup.button.callback("❌ Отменить", `cancel_waiting_${userId}`)])
      );
    }
  });

  // Команда для отмены ожидания ввода
  bot.command("cancel", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId || !userState.has(userId)) {
      return ctx.reply("❌ Нет активного ожидания запроса.");
    }
    userState.delete(userId);
    ctx.reply("❌ Ожидание ввода отменено.");
  });

  // Обработка нажатия кнопки "Отменить" при ожидании описания
  bot.action(/^cancel_waiting_(\d+)$/, async (ctx) => {
    const userId = Number(ctx.match[1]);
    if (!userState.has(userId)) {
      return ctx.answerCbQuery("Нет активного ожидания.");
    }
    userState.delete(userId);
    ctx.answerCbQuery("Ожидание отменено.");
    ctx.editMessageText("❌ Ожидание ввода отменено.");
  });

  // (При необходимости можно добавить обработку кнопки отмены генерации)
};

export default drawCommand;
