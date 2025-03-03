import logger from "./../../config/logger.js";
import { Context, Telegraf } from "telegraf";

const getNextFriday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (вс) - 6 (сб)

  if (dayOfWeek === 5) {
    return "Сегодня"; // Если уже пятница
  }

  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
  const nextFriday = new Date();
  nextFriday.setDate(today.getDate() + daysUntilFriday);

  // Форматируем дату: 09.02.2024
  return nextFriday.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const createPoll = async (
  ctx: Context,
  question: string,
  options: string[],
  isAnonymous = false
) => {
  const pollMessage = await ctx.telegram.sendPoll(ctx.chat!.id, question, options, {
    is_anonymous: isAnonymous,
  });
  return pollMessage;
};

const pollCommand = (bot: Telegraf) => {
  bot.command("poll", async (ctx) => {
    try {
      const nextFridayDate = getNextFriday();

      const moviePoll = await createPoll(ctx, `🎬 Киновечер! (${nextFridayDate})`, [
        "👍🏻 Буду",
        "👎🏻 Не буду",
        "🤔 Надо подумать",
      ]);

      const webAppUrl = process.env.WEB_APP_URL;
      await ctx.telegram.sendMessage(ctx.chat.id, "Открыть Хохму:", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Перейти в Хохму",
                url: webAppUrl + "?startapp=movieWheel",
              },
            ],
          ],
        },
      });

      await createPoll(ctx, `⏳ Во сколько ждать?`, ["19:00", "20:00", "21:00", "22:00"]);

      await createPoll(ctx, `🍔 Что кушаем? `, [
        "🍔 Бургеры",
        "🍣 Роллы",
        "🍕 Пицца",
        "🥡 Вок",
        "🥟 Грузинское",
        "🤫 Что-то другое",
      ]);

      // Закрепляем опрос
      await ctx.telegram.pinChatMessage(ctx.chat.id, moviePoll.message_id);
    } catch (error) {
      logger.error("Ошибка при создании опроса:", error);
      ctx.reply("Не удалось создать опрос. Попробуйте позже.");
    }
  });
};

export default pollCommand;
