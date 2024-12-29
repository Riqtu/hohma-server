import express from "express";
import crypto from "crypto";
const router = express.Router();
const BOT_TOKEN = process.env.BOT_TOKEN;

app.get("/", (req, res) => {
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

  // Пользователь прошел авторизацию
  res.json({ success: true, user: data });
});

export default router;
