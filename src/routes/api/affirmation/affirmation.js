import express from "express";
import Affirmation from "../../../models/Affirmation";

const router = express.Router();

// Добавить новую аффирмацию
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const newAffirmation = new Affirmation({ text });
    await newAffirmation.save();
    res.status(201).json(newAffirmation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить все аффирмации
router.get("/", async (req, res) => {
  try {
    const affirmations = await Affirmation.find();
    res.json(affirmations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить аффирмацию по ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAffirmation = await Affirmation.findByIdAndDelete(id);
    if (!deletedAffirmation) {
      return res.status(404).json({ error: "Affirmation not found" });
    }
    res.json({ message: "Affirmation deleted", deletedAffirmation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить случайную аффирмацию
router.get("/random", async (req, res) => {
  try {
    const count = await Affirmation.countDocuments(); // Считаем количество записей
    const randomIndex = Math.floor(Math.random() * count); // Генерируем случайный индекс
    const randomAffirmation = await Affirmation.findOne().skip(randomIndex); // Получаем случайную аффирмацию
    if (!randomAffirmation) {
      return res.status(404).json({ error: "No affirmations found" });
    }
    res.json(randomAffirmation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Affirmation:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор аффирмации
 *         text:
 *           type: string
 *           description: Текст аффирмации
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата и время создания аффирмации
 *       example:
 *         _id: "63df7ebf1f0b6e5402c4b291"
 *         text: "Сегодня я достигну всего, к чему стремлюсь!"
 *         createdAt: "2023-02-04T14:12:15.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Affirmations
 *   description: API для управления аффирмациями
 */

/**
 * @swagger
 * /api/affirmations:
 *   post:
 *     summary: Добавить новую аффирмацию
 *     tags: [Affirmations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Affirmation'
 *     responses:
 *       201:
 *         description: Аффирмация добавлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Affirmation'
 *       400:
 *         description: Ошибка валидации (текст обязателен)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /api/affirmations:
 *   get:
 *     summary: Получить список всех аффирмаций
 *     tags: [Affirmations]
 *     responses:
 *       200:
 *         description: Список аффирмаций
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Affirmation'
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /api/affirmations/random:
 *   get:
 *     summary: Получить случайную аффирмацию
 *     tags: [Affirmations]
 *     responses:
 *       200:
 *         description: Случайная аффирмация
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Affirmation'
 *       404:
 *         description: Аффирмации не найдены
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /api/affirmations/{id}:
 *   delete:
 *     summary: Удалить аффирмацию
 *     tags: [Affirmations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Уникальный идентификатор аффирмации
 *     responses:
 *       200:
 *         description: Аффирмация удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об удалении
 *                 deletedAffirmation:
 *                   $ref: '#/components/schemas/Affirmation'
 *       404:
 *         description: Аффирмация не найдена
 *       500:
 *         description: Ошибка сервера
 */
