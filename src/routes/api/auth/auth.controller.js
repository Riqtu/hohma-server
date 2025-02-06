import { validateTelegramAuth, authenticateUser } from "./auth.service.js";
import { validateAuthRequest } from "./auth.validation.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

/**
 * 📌 1. Аутентификация через Telegram Web App (TWA)
 */
export const authenticateTelegramUser = async (req, res) => {
  const { initData } = req.body;

  if (!validateAuthRequest(req, res)) {
    return;
  }

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
    return res.status(400).json({ error: error.message });
  }

  try {
    const { user, token } = await authenticateUser(userData);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 📌 2. Аутентификация через браузер (GET)
 */
export const authenticateBrowserUser = (req, res) => {
  const { hash, ...data } = req.query;
  if (!validateAuthRequest(req, res)) {
    return;
  }

  const secret = crypto.createHash("sha256").update(process.env.BOT_TOKEN).digest();
  const checkString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const hmac = crypto.createHmac("sha256", secret).update(checkString).digest("hex");

  if (hmac !== hash) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = jwt.sign({ user: data }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const userInfo = encodeURIComponent(JSON.stringify(data));

  res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}&user=${userInfo}`);
};
