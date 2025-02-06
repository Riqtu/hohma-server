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

const router = express.Router();

router.post("/", validate(createMovieSchema), createMovieHandler);
router.get("/", getMoviesHandler);
router.get("/:id", validate(movieIdSchema, "params"), getMovieByIdHandler);
router.put(
  "/:id",
  validate(movieIdSchema, "params"),
  validate(updateMovieSchema),
  updateMovieHandler
);
router.delete("/:id", validate(movieIdSchema, "params"), softDeleteMovieHandler);
router.delete("/:id/permanent", validate(movieIdSchema, "params"), deleteMoviePermanentlyHandler);

export default router;
