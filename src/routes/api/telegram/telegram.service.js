import telegramService from "../../../services/telegramService.js"; // Импортируем сервис

export const sendTelegramMessage = async (data) => {
  const escapeMarkdownV2 = (text) => text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");

  await telegramService.sendMessage(process.env.CHAT_ID, escapeMarkdownV2(data), "MarkdownV2");

  return "Сообщение отправлено!";
};
