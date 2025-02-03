import express from "express";
import {
  addFinalResultsHandler,
  getAllFinalResultsHandler,
} from "./finalResults.controller.js";

const router = express.Router();

router.post("/", addFinalResultsHandler);
router.get("/", getAllFinalResultsHandler);

export default router;
