import express from "express";
import crypto from "crypto";
const router = express.Router();
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

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
