import { Request, Response } from "express";
import logger from "#config/logger.js";

export function validateAuthRequest(req: Request, res: Response): boolean {
  if (!process.env.BOT_TOKEN) {
    logger.error("Ошибка: BOT_TOKEN не задан в .env");
    res.status(500).json({ error: "Ошибка сервера" });
    return false;
  }

  if (!req.body.initData && !req.query.hash) {
    res.status(400).json({ error: "Данные для аутентификации отсутствуют" });
    return false;
  }

  return true;
}
