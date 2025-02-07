import FinalResults from "../../../models/FinalResults.js";
import telegramService from "../../../services/telegramService.js";
import UserModel from "../../../models/userModel.js"; // Импорт модели пользователя

export const addFinalResults = async (finalResultsData) => {
  const finalResults = new FinalResults(finalResultsData);
  await finalResults.save();

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

  // Обновляем coins для автора первого места (увеличиваем на 100)
  if (populatedFinalResults.firstPlace && populatedFinalResults.firstPlace.author) {
    await UserModel.findByIdAndUpdate(populatedFinalResults.firstPlace.author._id, {
      $inc: { coins: 100 },
    });
    await UserModel.findByIdAndUpdate(populatedFinalResults.secondPlace.author._id, {
      $inc: { coins: 50 },
    });
    await UserModel.findByIdAndUpdate(populatedFinalResults.thirdPlace.author._id, {
      $inc: { coins: 20 },
    });
  }

  const escapeMarkdownV2 = (text) => text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");

  await telegramService.sendMessage(
    process.env.CHAT_ID,
    `
*У нас есть победитель 🎉🎉🎉*

*${escapeMarkdownV2(populatedFinalResults.firstPlace.title)}*
🥇 Поздравляем *${escapeMarkdownV2(populatedFinalResults.firstPlace.author.firstName)}* c Победой  
Ты получаешь 100 хохмокоинов 🪙

${escapeMarkdownV2("Чуть-чуть не хватило? Не расстраивайся!")} 🤗

*${escapeMarkdownV2(populatedFinalResults.secondPlace.title)}*
🥈 Поздравляем *${escapeMarkdownV2(populatedFinalResults.secondPlace.author.firstName)}* c Вторым местом 
Ты получаешь 50 хохмокоинов 🪙

*${escapeMarkdownV2(populatedFinalResults.thirdPlace.title)}*
🥉 Поздравляем *${escapeMarkdownV2(populatedFinalResults.thirdPlace.author.firstName)}* c Третьим местом 
Ты получаешь 20 хохмокоинов 🪙
`,
    "MarkdownV2"
  );

  return finalResults;
};

export const getAllFinalResults = async () => {
  return await FinalResults.find()
    .populate("firstPlace")
    .populate("secondPlace")
    .populate("thirdPlace");
};
