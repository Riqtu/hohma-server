import express from "express";
import telegramRoutes from "./api/auth/auth.routes.js";
import moviesRouter from "./api/movie/movies.routes.js";
import affirmationRouter from "./api/affirmation/affirmation.routes.js";
import finalResultsRouter from "./api/finalResults/finalResults.routes.js";
import telegramRouter from "./api/telegram/telegram.routes.js";

const router = express.Router();

router.use("/auth", telegramRoutes);
router.use("/movies", moviesRouter);
router.use("/affirmations", affirmationRouter);
router.use("/final-results", finalResultsRouter);
router.use("/telegram", telegramRouter);

export default router;
