import express from "express";
import imageRoutes from "./api/create/image.js";
import textRoutes from "./api/create/text.js";
import telegramRoutes from "./api/auth/telegram.js";
import moviesRouter from "./api/movie/movies.js";
import affirmationRouter from "./api/affirmation/affirmation.js";

const router = express.Router();

router.use("/create/image", imageRoutes);
router.use("/create/text", textRoutes);
router.use("/auth/telegram", telegramRoutes);
router.use("/movies", moviesRouter);
router.use("/affirmations", affirmationRouter);

export default router;
