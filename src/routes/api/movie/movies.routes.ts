import express from "express";
import {
  createMovieHandler,
  getMoviesHandler,
  getMovieByIdHandler,
  updateMovieHandler,
  softDeleteMovieHandler,
  deleteMoviePermanentlyHandler,
} from "./movies.controller.js";
import validate from "../../../middleware/validateMiddleware.js";
import { createMovieSchema, updateMovieSchema, movieIdSchema } from "./movies.validation.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, validate(createMovieSchema), createMovieHandler);
router.get("/", authMiddleware, roleMiddleware(["user", "moderator", "admin"]), getMoviesHandler);
router.get("/:id", authMiddleware, validate(movieIdSchema, "params"), getMovieByIdHandler);
router.put(
  "/:id",
  authMiddleware,
  validate(movieIdSchema, "params"),
  validate(updateMovieSchema),
  updateMovieHandler
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["moderator", "admin"]),
  validate(movieIdSchema, "params"),
  softDeleteMovieHandler
);
router.delete(
  "/:id/permanent",
  authMiddleware,

  validate(movieIdSchema, "params"),
  deleteMoviePermanentlyHandler
);

export default router;
