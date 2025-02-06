import FinalResults from "../../../models/FinalResults.js";
import telegramService from "../../../services/telegramService.js"; // Импортируем сервис

export const addFinalResults = async (finalResultsData) => {
  const finalResults = new FinalResults(finalResultsData);
  await finalResults.save();
  const populatedFinalResults = await FinalResults.findById(finalResults._id)
    .populate("firstPlace")
    .populate("secondPlace")
    .populate("thirdPlace")
    .lean();
  const escapeMarkdownV2 = (text) => text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");

  await telegramService.sendMessage(
    process.env.CHAT_ID,
    `
*У нас есть победитель 🎉🎉🎉*

*${escapeMarkdownV2(populatedFinalResults.firstPlace.title)}*
Поздравляем *${escapeMarkdownV2(populatedFinalResults.firstPlace.authorName)}* c Победой 🥇 
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
