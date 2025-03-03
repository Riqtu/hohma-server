import express, { Router } from "express"; // Импортируем Router из express
import { sendTelegramMessageHandler } from "./telegram.controller.js";
import authMiddleware from "#middleware/authMiddleware.js";
import roleMiddleware from "#middleware/roleMiddleware.js";

// Создаем маршрутизатор
const router: Router = express.Router();

// Создаем маршрут с middleware для авторизации и ролей
router.post("/", authMiddleware, roleMiddleware(["admin"]), sendTelegramMessageHandler);

export default router;
