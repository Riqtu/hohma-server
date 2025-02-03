import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  softDeleteMovie,
  deleteMoviePermanently,
} from "./movies.service.js";

export const createMovieHandler = async (req, res) => {
  try {
    const movie = await createMovie(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMoviesHandler = async (req, res) => {
  try {
    const movies = await getMovies(req.query.all === "true");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovieByIdHandler = async (req, res) => {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMovieHandler = async (req, res) => {
  try {
    const movie = await updateMovie(req.params.id, req.body);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const softDeleteMovieHandler = async (req, res) => {
  try {
    const movie = await softDeleteMovie(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json({ message: "Movie marked as deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMoviePermanentlyHandler = async (req, res) => {
  try {
    const movie = await deleteMoviePermanently(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json({ message: "Movie permanently deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
