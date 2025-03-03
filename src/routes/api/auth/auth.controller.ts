import { Request, Response } from "express";
import { validateTelegramAuth, authenticateUser } from "./auth.service.js";
import { validateAuthRequest } from "./auth.validation.js";
import crypto from "crypto";
/**
 * 📌 1. Аутентификация через Telegram Web App (TWA)
 */
export const authenticateTelegramUser = async (req: Request, res: Response): Promise<void> => {
  const { initData } = req.body;

  if (!validateAuthRequest(req, res)) {
    return;
  }

  if (!validateTelegramAuth(initData)) {
    res.status(403).json({ error: "Неверные данные Telegram" });
    return;
  }

  const params = new URLSearchParams(initData);
  const userString = params.get("user");

  if (!userString) {
    res.status(400).json({ error: "user обязателен" });
    return;
  }

  let userData;
  try {
    userData = JSON.parse(userString);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    return;
  }

  try {
    const { user, token } = await authenticateUser(userData);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * 📌 2. Аутентификация через браузер (GET)
 */
export const authenticateBrowserUser = async (req: Request, res: Response): Promise<void> => {
  const { hash, ...data } = req.query;

  if (!validateAuthRequest(req, res)) {
    return;
  }

  const secret = crypto
    .createHash("sha256")
    .update(process.env.BOT_TOKEN as string)
    .digest();
  const checkString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const hmac = crypto.createHmac("sha256", secret).update(checkString).digest("hex");

  if (hmac !== hash) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { user, token } = await authenticateUser({
      id: data.id as string, // Telegram ID
      first_name: data.first_name as string,
      last_name: data.last_name as string,
      username: data.username as string,
      photo_url: data.photo_url as string,
    });

    const userInfo = encodeURIComponent(JSON.stringify(user));
    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}&user=${userInfo}`);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
