import Joi from "joi";

export const affirmationSchema = Joi.object({
  text: Joi.string().min(3).max(500).required().messages({
    "string.empty": "Текст не может быть пустым",
    "string.min": "Текст должен содержать минимум 3 символа",
    "string.max": "Текст должен содержать максимум 500 символов",
    "any.required": "Текст обязателен",
  }),
});
