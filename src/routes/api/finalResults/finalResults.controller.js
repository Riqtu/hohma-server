import { addFinalResults, getAllFinalResults } from "./finalResults.service.js";

// Добавить новую аффирмацию
export const addFinalResultsHandler = async (req, res) => {
  try {
    const newAffirmation = await addFinalResults(req.body);
    res.status(201).json(newAffirmation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить все аффирмации
export const getAllFinalResultsHandler = async (req, res) => {
  try {
    const finalResults = await getAllFinalResults();
    res.json(finalResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
