import express from "express";
import telegramRoutes from "./api/auth/auth.routes.js";
import moviesRouter from "./api/movie/movies.routes.js";
import affirmationRouter from "./api/affirmation/affirmation.routes.js";
import finalResultsRouter from "./api/finalResults/finalResults.routes.js";

const router = express.Router();

router.use("/auth", telegramRoutes);
router.use("/movies", moviesRouter);
router.use("/affirmations", affirmationRouter);
router.use("/final-results", finalResultsRouter);

export default router;
