import logger from "#config/logger.js";
import UserModel from "#models/userModel.js";
import Movie from "../../../models/Movie.js";
import axios from "axios";

export const createMovie = async (movieData) => {
  // Предполагаем, что в movieData передается telegramId пользователя, создающего фильм
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
    logger.error("Ошибка отправки сообщения в Telegram:", error.message);
  }

  return movie;
};

export const getMovies = async (all = false) => {
  return await Movie.find(all ? {} : { isDeleted: false }).populate(
    "author",
    "username firstName lastName photoUrl"
  );
};

export const getMovieById = async (id) => {
  return await Movie.findById(id).populate("author", "username firstName lastName photoUrl");
};

export const updateMovie = async (id, movieData) => {
  return await Movie.findByIdAndUpdate(id, movieData, { new: true });
};

export const softDeleteMovie = async (id) => {
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
    logger.error("Ошибка отправки сообщения в Telegram:", error.message);
  }

  return movie;
};

export const deleteMoviePermanently = async (id) => {
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
    logger.error("Ошибка отправки сообщения в Telegram:", error.message);
  }

  return movie;
};
