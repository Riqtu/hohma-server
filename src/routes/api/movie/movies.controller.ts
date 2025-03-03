import { Request, Response } from "express";
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  softDeleteMovie,
  deleteMoviePermanently,
} from "./movies.service.js";

// Обработчик создания фильма
export const createMovieHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await createMovie(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Обработчик получения всех фильмов
export const getMoviesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await getMovies(req.query.all === "true");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Обработчик получения фильма по ID
export const getMovieByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Обработчик обновления фильма
export const updateMovieHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await updateMovie(req.params.id, req.body);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Обработчик мягкого удаления фильма
export const softDeleteMovieHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await softDeleteMovie(req.params.id);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    res.json({ message: "Movie marked as deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Обработчик полного удаления фильма
export const deleteMoviePermanentlyHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await deleteMoviePermanently(req.params.id);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    res.json({ message: "Movie permanently deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
