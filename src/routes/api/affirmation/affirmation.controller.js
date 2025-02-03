import {
  createAffirmation,
  getAllAffirmations,
  getRandomAffirmation,
  deleteAffirmation,
} from "./affirmation.service.js";

// Добавить новую аффирмацию
export const createAffirmationHandler = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const newAffirmation = await createAffirmation(text);
    res.status(201).json(newAffirmation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить все аффирмации
export const getAllAffirmationsHandler = async (req, res) => {
  try {
    const affirmations = await getAllAffirmations();
    res.json(affirmations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить случайную аффирмацию
export const getRandomAffirmationHandler = async (req, res) => {
  try {
    const randomAffirmation = await getRandomAffirmation();
    if (!randomAffirmation)
      return res.status(404).json({ error: "No affirmations found" });

    res.json(randomAffirmation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удалить аффирмацию по ID
export const deleteAffirmationHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAffirmation = await deleteAffirmation(id);
    if (!deletedAffirmation)
      return res.status(404).json({ error: "Affirmation not found" });

    res.json({ message: "Affirmation deleted", deletedAffirmation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
