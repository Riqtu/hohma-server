import express from "express";
import imageRoutes from "./api/create/image.js";
import textRoutes from "./api/create/text.js";
import telegramRoutes from "./api/auth/telegram.js";

const router = express.Router();

router.use("/create/image", imageRoutes);
router.use("/create/text", textRoutes);
router.use("/auth/telegram", telegramRoutes);

export default router;
