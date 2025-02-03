import Affirmation from "../../../models/Affirmation.js";

// Добавить новую аффирмацию
export const createAffirmation = async (text) => {
  return await new Affirmation({ text }).save();
};

// Получить все аффирмации
export const getAllAffirmations = async () => {
  return await Affirmation.find();
};

// Получить случайную аффирмацию
export const getRandomAffirmation = async () => {
  const count = await Affirmation.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  return await Affirmation.findOne().skip(randomIndex);
};

// Удалить аффирмацию
export const deleteAffirmation = async (id) => {
  return await Affirmation.findByIdAndDelete(id);
};
