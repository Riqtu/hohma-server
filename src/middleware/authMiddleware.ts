import { getEnvVar } from "./../config/env.js";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: string | JwtPayload; // Типизация поля user
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Нет токена, авторизация запрещена" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Извлекаем сам токен

  try {
    const decoded = jwt.verify(token, getEnvVar("JWT_SECRET") as string);
    req.user = decoded; // Добавляем `user` в объект запроса
    next();
  } catch {
    res.status(401).json({ message: "Токен недействителен" });
  }
};

export default authMiddleware;
