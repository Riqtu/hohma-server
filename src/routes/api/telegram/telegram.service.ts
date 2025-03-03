import telegramService from "../../../services/telegramService.js"; // Импортируем сервис

// Типизация данных для отправки
interface TelegramMessageData {
  text: string;
}

export const sendTelegramMessage = async (data: TelegramMessageData): Promise<string> => {
  // Экранируем Markdown-специальные символы
  const escapeMarkdownV2 = (text: string): string =>
    text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");

  // Отправляем сообщение через Telegram
  await telegramService.sendMessage(
    process.env.CHAT_ID as string,
    escapeMarkdownV2(data.text),
    "MarkdownV2"
  );

  return "Сообщение отправлено!";
};
