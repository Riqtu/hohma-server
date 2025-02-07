import Joi from "joi";

// Валидация создания фильма
export const createMovieSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Название фильма не может быть пустым",
    "any.required": "Название фильма обязательно",
  }),
  telegramId: Joi.string().required().messages({
    "string.empty": "Пользователь не может быть пустым",
    "any.required": "Пользователь обязателен",
  }),
});

// Валидация обновления фильма
export const updateMovieSchema = Joi.object({
  title: Joi.string().optional().messages({
    "string.empty": "Название фильма не может быть пустым",
  }),
  author: Joi.string().optional().messages({
    "string.empty": "Имя автора не может быть пустым",
  }),
  authorName: Joi.string().optional().messages({
    "string.empty": "Имя автора не может быть пустым",
  }),
  authorImg: Joi.string().optional().uri().messages({
    "string.uri": "URL изображения автора должен быть корректным",
  }),
}).min(1); // Требуем хотя бы одно поле для обновления

// Валидация ID фильма в параметрах запроса
export const movieIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "string.length": "ID фильма должен состоять из 24 символов",
    "string.hex": "ID фильма должен содержать только шестнадцатеричные символы",
    "any.required": "ID фильма обязателен",
  }),
});
