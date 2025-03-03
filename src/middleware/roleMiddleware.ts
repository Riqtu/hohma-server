import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any; // Можно уточнить тип в зависимости от вашего приложения
}

const roleMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Проверка на наличие роли у пользователя
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Access denied" });
    }

    // Если роль совпадает, передаем управление дальше
    next();
  };
};

export default roleMiddleware;
