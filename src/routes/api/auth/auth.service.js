import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserModel from "../../../models/userModel.js";
import logger from "#config/logger.js";
/**
 * 🔹 Проверка подписи Telegram
 */
export function validateTelegramAuth(initData) {
  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!BOT_TOKEN) {
    logger.error("Ошибка: BOT_TOKEN не задан!");
    return false;
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");

  const sortedData = Array.from(params.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();

  const computedHash = crypto.createHmac("sha256", secretKey).update(sortedData).digest("hex");

  return computedHash === hash;
}

/**
 * 🔹 Аутентификация пользователя (поиск или создание)
 */
export async function authenticateUser(userData) {
  const { id, first_name, last_name, username, photo_url } = userData;

  if (!id) {
    throw new Error("userId обязателен");
  }

  let user = await UserModel.findOne({ telegramId: id });

  if (!user) {
    user = new UserModel({
      telegramId: id,
      firstName: first_name,
      lastName: last_name,
      username,
      photoUrl: photo_url,
    });
    await user.save();
  }
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET не задан! Проверь .env файл.");
  }

  const token = jwt.sign(
    { id: user._id, telegramId: user.telegramId, role: user.role },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return { user, token };
}
