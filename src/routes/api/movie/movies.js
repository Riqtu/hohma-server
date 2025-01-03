import express from "express";
import Movie from "./../../../models/Movie.js";

const router = express.Router();

// Создать фильм
router.post("/", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Получить все фильмы
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить фильм по ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить фильм
router.put("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Удалить фильм
router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
