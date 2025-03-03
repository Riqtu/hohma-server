import Affirmation, { AffirmationDocument } from "../../../models/Affirmation.js";
import { Types } from "mongoose"; // Импорт типов Mongoose

// Добавить новую аффирмацию
export const createAffirmation = async (text: string): Promise<AffirmationDocument> => {
  return await new Affirmation({ text }).save();
};

// Получить все аффирмации
export const getAllAffirmations = async (): Promise<AffirmationDocument[]> => {
  return await Affirmation.find();
};

// Получить случайную аффирмацию
export const getRandomAffirmation = async (): Promise<AffirmationDocument | null> => {
  const count = await Affirmation.countDocuments();
  if (count === 0) return null; // Проверяем, есть ли записи в базе

  const randomIndex = Math.floor(Math.random() * count);
  return await Affirmation.findOne().skip(randomIndex);
};

// Удалить аффирмацию
export const deleteAffirmation = async (id: string): Promise<AffirmationDocument | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Некорректный ID аффирмации");
  }
  return await Affirmation.findByIdAndDelete(id);
};
