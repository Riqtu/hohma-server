import Movie from "../../../models/Movie.js";
import axios from "axios";

export const createMovie = async (movieData) => {
  const movie = new Movie(movieData);
  await movie.save();

  // Отправка уведомления в Telegram
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: `Пользователь ${movieData.author} добавил фильм - "${movieData.title}"`,
      }
    );
    console.log("Сообщение отправлено!");
  } catch (error) {
    console.error("Ошибка отправки сообщения в Telegram:", error.message);
  }

  return movie;
};

export const getMovies = async (all = false) => {
  return await Movie.find(all ? {} : { isDeleted: false });
};

export const getMovieById = async (id) => {
  return await Movie.findById(id);
};

export const updateMovie = async (id, movieData) => {
  return await Movie.findByIdAndUpdate(id, movieData, { new: true });
};

export const softDeleteMovie = async (id) => {
  const movie = await Movie.findById(id);
  if (!movie) return null;

  movie.isDeleted = true;
  movie.deletedAt = new Date();
  await movie.save();

  // Отправка уведомления в Telegram
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: `Фильм "${movie.title}" выбывает.`,
      }
    );
  } catch (error) {
    console.error("Ошибка отправки сообщения в Telegram:", error.message);
  }

  return movie;
};

export const deleteMoviePermanently = async (id) => {
  const movie = await Movie.findById(id);
  if (!movie) return null;

  await Movie.findByIdAndDelete(id);

  // Отправка уведомления в Telegram
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: `Фильм "${movie.title}" был полностью удален из базы.`,
      }
    );
  } catch (error) {
    console.error("Ошибка отправки сообщения в Telegram:", error.message);
  }

  return movie;
};
