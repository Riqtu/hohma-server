import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../../../models/userModel";

dotenv.config();
const router = express.Router();

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Функция для проверки подписи Telegram
 */
function validateTelegramAuth(initData) {
  if (!BOT_TOKEN) {
    console.error("Ошибка: BOT_TOKEN не задан!");
    return false;
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");

  const sortedData = Array.from(params.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  console.log("🔹 Подписываемая строка:", sortedData);

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(sortedData)
    .digest("hex");

  console.log("🔹 Ожидаемый хеш:", hash);
  console.log("🔹 Вычисленный хеш:", computedHash);

  return computedHash === hash;
}

/**
 * Универсальная функция для аутентификации пользователя
 */
async function authenticateUser(userData) {
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

  const token = jwt.sign(
    { id: user._id, telegramId: user.telegramId },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
}

/**
 * 📌 1. Обработка аутентификации через TWA (POST)
 */
router.post("/", async (req, res) => {
  const { initData } = req.body;

  if (!validateTelegramAuth(initData)) {
    return res.status(403).json({ error: "Неверные данные Telegram" });
  }

  const params = new URLSearchParams(initData);
  const userString = params.get("user");

  if (!userString) {
    return res.status(400).json({ error: "user обязателен" });
  }

  let userData;
  try {
    userData = JSON.parse(userString);
  } catch (error) {
    return res.status(400).json({ error: "Ошибка парсинга user JSON" });
  }

  try {
    const { user, token } = await authenticateUser(userData);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 📌 2. Обработка аутентификации через браузер (GET)
 */
router.get("/", (req, res) => {
  if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is not defined in environment variables");
  }
  const { hash, ...data } = req.query;
  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const checkString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(checkString)
    .digest("hex");

  if (hmac !== hash) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = jwt.sign({ user: data }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const userInfo = encodeURIComponent(JSON.stringify(data));

  res.redirect(
    `${process.env.CLIENT_URL}/auth-success?token=${token}&user=${userInfo}`
  );
});

export default router;
