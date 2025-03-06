import logger from "./../../../config/logger.js";
import UserModel from "./../../../models/userModel.js";
import Movie, { MovieDTO } from "../../../models/Movie.js";
import axios from "axios";

// Создание фильма
export const createMovie = async (movieData: any): Promise<MovieDTO> => {
  const user = await UserModel.findOne({ telegramId: movieData.telegramId });
  if (!user) {
    throw new Error("Пользователь не найден");
  }

  // Заменяем поле author на _id найденного пользователя
  movieData.author = user._id;
  const movie = new Movie(movieData);
  await movie.save();

  await movie.populate("author", "username firstName lastName photoUrl");

  // Отправка уведомления в Telegram
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: `Пользователь ${user.username || user.firstName} добавил фильм - "${movieData.title}"`,
    });
    logger.info("Сообщение отправлено!");
  } catch (error) {
    logger.error("Ошибка отправки сообщения в Telegram:", (error as Error).message);
  }

  return movie;
};

// Получить все фильмы
export const getMovies = async (all: boolean = false): Promise<MovieDTO[]> => {
  return await Movie.find(all ? {} : { isDeleted: false }).populate(
    "author",
    "username firstName lastName photoUrl"
  );
};

// Получить фильм по ID
export const getMovieById = async (id: string): Promise<MovieDTO | null> => {
  return await Movie.findById(id).populate("author", "username firstName lastName photoUrl");
};

// Обновление фильма
export const updateMovie = async (id: string, movieData: any): Promise<MovieDTO | null> => {
  return await Movie.findByIdAndUpdate(id, movieData, { new: true });
};

// Мягкое удаление фильма
export const softDeleteMovie = async (id: string): Promise<MovieDTO | null> => {
  const movie = await Movie.findById(id);
  if (!movie) {
    return null;
  }

  movie.isDeleted = true;
  movie.deletedAt = new Date();
  await movie.save();

  // Отправка уведомления в Telegram
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: `Фильм "${movie.title}" выбывает.`,
    });
  } catch (error) {
    logger.error("Ошибка отправки сообщения в Telegram:", (error as Error).message);
  }

  return movie;
};

// Полное удаление фильма
export const deleteMoviePermanently = async (id: string): Promise<MovieDTO | null> => {
  const movie = await Movie.findById(id);
  if (!movie) {
    return null;
  }

  await Movie.findByIdAndDelete(id);

  // Отправка уведомления в Telegram
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: `Фильм "${movie.title}" был полностью удален из базы.`,
    });
  } catch (error) {
    logger.error("Ошибка отправки сообщения в Telegram:", (error as Error).message);
  }

  return movie;
};
