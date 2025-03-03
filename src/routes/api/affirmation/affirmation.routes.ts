import express from "express";
import {
  createAffirmationHandler,
  getAllAffirmationsHandler,
  getRandomAffirmationHandler,
  deleteAffirmationHandler,
} from "./affirmation.controller.js";
import validate from "../../../middleware/validateMiddleware.js";
import { affirmationSchema } from "./affirmation.validation.js";
const router = express.Router();

router.post("/", validate(affirmationSchema), createAffirmationHandler);
router.get("/", getAllAffirmationsHandler);
router.get("/random", getRandomAffirmationHandler);
router.delete("/:id", deleteAffirmationHandler);

export default router;
