import express from "express";
import crypto from "crypto";
const router = express.Router();
const BOT_TOKEN = "7708867557:AAGFcnAscBeyXeeI_vs_cUHLHPPautBL57Y";

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

router.post("/", (req, res) => {
  console.log("Request received at /auth/telegram:", req.body);
  const data = req.body;

  if (!checkTelegramAuth(data)) {
    return res.status(403).json({ message: "Invalid Telegram data" });
  }

  const user = {
    id: data.id,
    first_name: data.first_name,
    username: data.username,
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
router.post("/", (req, res) => {
  console.log(req.body);
  const data = req.body;

  if (!checkTelegramAuth(data)) {
    return res.status(403).json({ message: "Invalid Telegram data" });
  }

  const user = {
    id: data.id,
    first_name: data.first_name,
    username: data.username,
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
