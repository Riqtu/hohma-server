import dotenv from "dotenv";
import https from "https";
import app from "./app.js";
import connectDB from "./config/db.js";
import setupSocket from "./config/socket.js";
import setupSwagger from "./config/swagger.js";

dotenv.config();
// Получение ключей из переменных окружения
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const certificate = process.env.CERTIFICATE.replace(/\\n/g, "\n");

// Настройка HTTPS
const options = {
  key: privateKey,
  cert: certificate,
};

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

// Подключение к базе данных
connectDB(mongoURI);

// Создаем HTTP сервер
const server = https.createServer(options, app);

// Настройка Socket.IO
setupSocket(server);

// Настройка Swagger
setupSwagger(app);

// Запуск сервера
server.listen(port, () => {
  console.log(`Сервер запущен на https://localhost:${port}`);
  console.log(`Swagger docs available at https://localhost:${port}/api-docs`);
});
