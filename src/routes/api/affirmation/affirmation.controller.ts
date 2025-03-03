import { Request, Response } from "express";
import {
  createAffirmation,
  getAllAffirmations,
  getRandomAffirmation,
  deleteAffirmation,
} from "./affirmation.service.js";

// Интерфейс для тела запроса при создании аффирмации
interface CreateAffirmationRequest extends Request {
  body: {
    text: string;
  };
}

// Добавить новую аффирмацию
export const createAffirmationHandler = async (
  req: CreateAffirmationRequest,
  res: Response
): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return; // Возврат после отправки ответа, чтобы избежать дальнейшего выполнения
    }

    const newAffirmation = await createAffirmation(text);
    res.status(201).json(newAffirmation);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// Получить все аффирмации
export const getAllAffirmationsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const affirmations = await getAllAffirmations();
    res.json(affirmations);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// Получить случайную аффирмацию
export const getRandomAffirmationHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const randomAffirmation = await getRandomAffirmation();
    if (!randomAffirmation) {
      res.status(404).json({ error: "No affirmations found" });
      return; // Возврат после отправки ответа
    }

    res.json(randomAffirmation);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// Удалить аффирмацию по ID
export const deleteAffirmationHandler = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedAffirmation = await deleteAffirmation(id);
    if (!deletedAffirmation) {
      res.status(404).json({ error: "Affirmation not found" });
      return; // Возврат после отправки ответа
    }

    res.json({ message: "Affirmation deleted", deletedAffirmation });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
};
