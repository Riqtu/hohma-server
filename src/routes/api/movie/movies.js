import express from "express";
import Movie from "./../../../models/Movie.js";
import axios from "axios";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор фильма
 *         title:
 *           type: string
 *           description: Название фильма
 *         author:
 *           type: string
 *           description: Автор фильма
 *         authorImg:
 *           type: string
 *           description: Ссылка на изображение автора
 *       example:
 *         _id: 12345
 *         title: "Inception"
 *         author: "Christopher Nolan"
 *         authorImg: "https://example.com/nolan.jpg"
 */

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API для управления фильмами
 */

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Создать новый фильм
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Фильм создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Ошибка валидации
 */
router.post("/", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie); // Отправляем первый ответ клиенту

    try {
      await axios.post(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          chat_id: process.env.CHAT_ID,
          text: `Пользователь ${req.body.author} добавил фильм - "${req.body.title}"`, // Преобразуем объект в строку
        }
      );
      console.log("Сообщение отправлено!");
    } catch (error) {
      console.error("Ошибка отправки сообщения в Telegram:", error.message);
      // Здесь НЕ отправляем res.status() или res.send(), так как ответ уже отправлен
    }
  } catch (error) {
    res.status(400).json({ error: error.message }); // Ответ при ошибке валидации
  }
});

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Получить список всех фильмов
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Список фильмов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Ошибка сервера
 */
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Получить фильм по ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Уникальный идентификатор фильма
 *     responses:
 *       200:
 *         description: Данные фильма
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Фильм не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Обновить данные фильма
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Уникальный идентификатор фильма
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Фильм обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Фильм не найден
 *       400:
 *         description: Ошибка валидации
 */
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

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Удалить фильм
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Уникальный идентификатор фильма
 *     responses:
 *       200:
 *         description: Фильм удален
 *       404:
 *         description: Фильм не найден
 *       500:
 *         description: Ошибка сервера
 */
router.delete("/:id", async (req, res) => {
  try {
    const findMovie = await Movie.findById(req.params.id);
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json({ message: "Movie deleted" });
    try {
      await axios.post(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          chat_id: process.env.CHAT_ID,
          text: `Фильм "${findMovie.title}" выбывает =(`, // Преобразуем объект в строку
        }
      );
      console.log("Сообщение отправлено!");
    } catch (error) {
      console.error("Ошибка отправки сообщения в Telegram:", error.message);
      // Здесь НЕ отправляем res.status() или res.send(), так как ответ уже отправлен
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
