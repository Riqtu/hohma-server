import express from "express";
import { sendTelegramMessageHandler } from "./telegram.controller.js";
import authMiddleware from "#middleware/authMiddleware.js";
import roleMiddleware from "#middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(["admin"]), sendTelegramMessageHandler);

export default router;
