import express from "express";
import crypto from "crypto";
const router = express.Router();
const BOT_TOKEN = process.env.BOT_TOKEN;

const checkTelegramAuth = (data) => {
  const { hash, ...rest } = data;

  const sortedData = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("\n");

  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();

  const checkHash = crypto
    .createHmac("sha256", secret)
    .update(sortedData)
    .digest("hex");

  return hash === checkHash;
};

router.get("/", (req, res) => {
  console.log("Request received at /auth/telegram:", req.body);
  const data = req.body;

  if (!checkTelegramAuth(data)) {
    return res.status(403).json({ message: "Invalid Telegram data" });
  }

  const user = {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.username,
    photo_url: data.photo_url,
  };

  res.send(`
    <script>
      window.opener.postMessage(${JSON.stringify(user)}, '${
    req.headers.origin
  }');
      window.close();
    </script>
  `);
});

export default router;
