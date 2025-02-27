import dotenv from "dotenv";
// Подключение переменных окружения
dotenv.config();
import http from "http";
import app from "./app.js";
import setupSocket from "./config/socket.js";
import logger from "#config/logger.js";
import { initializeServer } from "#config/serverSetup.js";

// Порт сервера
const port = process.env.PORT || 3000;

// Инициализация сервера
initializeServer(app);

// Создаем HTTP сервер (Nginx будет управлять HTTPS)
const server = http.createServer(app);

// Подключаем WebSocket
setupSocket(server);

// Запуск сервера
server.listen(port, () => {
  logger.info(`🚀 Сервер запущен на http://localhost:${port}`);
  logger.info(`📜 Swagger доступен на http://localhost:${port}/api-docs`);
});
