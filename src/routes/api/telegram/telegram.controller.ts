import { Request, Response } from "express"; // Импортируем типы для запросов и ответов
import { sendTelegramMessage } from "./telegram.service.js";

// Обработчик для отправки сообщения в Telegram
export const sendTelegramMessageHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await sendTelegramMessage(req.body); // Получаем данные из тела запроса
    res.status(201).json({ message }); // Отправляем успешный ответ
  } catch (error) {
    res.status(500).json({ error: (error as Error).message }); // Обработка ошибок
  }
};
