import { Request, Response, NextFunction } from "express";
import { Schema, ValidationError } from "joi"; // Подключаем Joi для типизации схемы

interface ValidationErrorItem {
  message: string;
  field?: string; // Поле может отсутствовать, если ошибка не связана с конкретным полем
}

const validate = (schema: Schema, property: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errors: ValidationErrorItem[] = error.details.map((detail) => ({
        message: detail.message,
        field: detail.path[0] as string | undefined, // Явное приведение типа
      }));

      res.status(400).json({ errors });
      return;
    }

    next();
  };
};

export default validate;
