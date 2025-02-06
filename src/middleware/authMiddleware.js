import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет токена, авторизация запрещена" });
  }

  const token = authHeader.split(" ")[1]; // Извлекаем сам токен

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Токен недействителен" });
  }
};

export default authMiddleware;
