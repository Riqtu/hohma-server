import express from "express";

const router = express.Router();
const BOT_TOKEN = "7708867557:AAGFcnAscBeyXeeI_vs_cUHLHPPautBL57Y";

const checkTelegramAuth = (data) => {
  const { hash, ...rest } = data;
  const sorted = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("\n");

  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const checkHash = crypto
    .createHmac("sha256", secret)
    .update(sorted)
    .digest("hex");

  return hash === checkHash;
};

router.post("/", (req, res) => {
  const data = req.body;

  if (!checkTelegramAuth(data)) {
    return res.status(403).json({ message: "Invalid Telegram data" });
  }

  // Создайте JWT или сессию для пользователя
  const user = {
    id: data.id,
    first_name: data.first_name,
    username: data.username,
  };

  return res.json({ message: "Authorized", user });
});

export default router;
