import FinalResults, { FinalResultsDTO } from "../../../models/FinalResults.js";
import telegramService from "../../../services/telegramService.js";
import UserModel, { UserDocument } from "../../../models/userModel.js"; // Импорт модели пользователя

// Добавление новых результатов
export const addFinalResults = async (finalResultsData: {
  firstPlace: string;
  secondPlace?: string;
  thirdPlace?: string;
}): Promise<FinalResultsDTO> => {
  const finalResults = new FinalResults(finalResultsData);
  await finalResults.save();

  // Заполняем данные для победителей
  const populatedFinalResults = await FinalResults.findById(finalResults._id)
    .populate({
      path: "firstPlace",
      populate: { path: "author" }, // Популяция автора внутри фильма
    })
    .populate({
      path: "secondPlace",
      populate: { path: "author" },
    })
    .populate({
      path: "thirdPlace",
      populate: { path: "author" },
    });

  // Проверяем, что populatedFinalResults не null
  if (!populatedFinalResults) {
    throw new Error("Final results not found");
  }

  // Обновляем баллы для победителей
  if (populatedFinalResults.firstPlace?.author) {
    const author = populatedFinalResults.firstPlace.author as UserDocument;
    await UserModel.findByIdAndUpdate(author._id, {
      $inc: { coins: 100 },
    });
  }

  if (populatedFinalResults.secondPlace?.author) {
    const author = populatedFinalResults.secondPlace.author as UserDocument;
    await UserModel.findByIdAndUpdate(author._id, {
      $inc: { coins: 50 },
    });
  }

  if (populatedFinalResults.thirdPlace?.author) {
    const author = populatedFinalResults.thirdPlace.author as UserDocument;
    await UserModel.findByIdAndUpdate(author._id, {
      $inc: { coins: 20 },
    });
  }

  const escapeMarkdownV2 = (text: string) => text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");

  // Отправка сообщения через Telegram
  await telegramService.sendMessage(
    process.env.CHAT_ID as string,
    `
*У нас есть победитель 🎉🎉🎉*

*${escapeMarkdownV2(populatedFinalResults.firstPlace.title)}*
🥇 Поздравляем *${escapeMarkdownV2(populatedFinalResults.firstPlace.author.firstName || "Пользователь")}* c Победой  
Ты получаешь 100 хохмокоинов 🪙

${escapeMarkdownV2("Чуть-чуть не хватило? Не расстраивайся!")} 🤗

*${escapeMarkdownV2(populatedFinalResults.secondPlace?.title || "Тиммейт 2")}*
🥈 Поздравляем *${escapeMarkdownV2(populatedFinalResults.secondPlace?.author?.firstName || "Пользователь")}* c Вторым местом 
Ты получаешь 50 хохмокоинов 🪙

*${escapeMarkdownV2(populatedFinalResults.thirdPlace?.title || "Тиммейт 3")}*
🥉 Поздравляем *${escapeMarkdownV2(populatedFinalResults.thirdPlace?.author?.firstName || "Пользователь")}* c Третьим местом 
Ты получаешь 20 хохмокоинов 🪙
`,
    "MarkdownV2"
  );

  return finalResults;
};

// Получение всех результатов
export const getAllFinalResults = async (): Promise<FinalResultsDTO[]> => {
  return await FinalResults.find()
    .populate("firstPlace") // Заполняем firstPlace
    .populate("secondPlace") // Заполняем secondPlace
    .populate("thirdPlace") // Заполняем thirdPlace
    .populate("firstPlace.author") // Подставляем данные из модели User для author
    .populate("secondPlace.author") // Подставляем данные из модели User для author
    .populate("thirdPlace.author"); // Подставляем данные из модели User для author
};
