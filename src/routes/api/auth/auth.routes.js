import express from "express";
import { authenticateTelegramUser, authenticateBrowserUser } from "./auth.controller.js";

const router = express.Router();

router.post("/telegram", authenticateTelegramUser);
router.get("/telegram", authenticateBrowserUser);

export default router;
