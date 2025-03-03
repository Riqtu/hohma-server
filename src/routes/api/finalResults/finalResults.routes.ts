import express from "express";
import { addFinalResultsHandler, getAllFinalResultsHandler } from "./finalResults.controller.js";

// Создаем экземпляр маршрутизатора
const router = express.Router();

// Маршруты
router.post("/", addFinalResultsHandler);
router.get("/", getAllFinalResultsHandler);

export default router;
