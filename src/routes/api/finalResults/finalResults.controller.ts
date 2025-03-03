import { Request, Response } from "express";
import { addFinalResults, getAllFinalResults } from "./finalResults.service.js";

// Добавить новые результаты
export const addFinalResultsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const newAffirmation = await addFinalResults(req.body);
    res.status(201).json(newAffirmation);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Получить все результаты
export const getAllFinalResultsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const finalResults = await getAllFinalResults();
    res.json(finalResults);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
