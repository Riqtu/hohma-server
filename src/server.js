import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import setupSocket from "./config/socket.js";

dotenv.config();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

// Подключение к базе данных
connectDB(mongoURI);

// Создаем HTTP сервер
const server = http.createServer(app);

// Настройка Socket.IO
setupSocket(server);

// Запуск сервера
server.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
