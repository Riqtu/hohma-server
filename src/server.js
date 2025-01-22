import dotenv from "dotenv";
import https from "https";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import setupSocket from "./config/socket.js";
import setupSwagger from "./config/swagger.js";
import telegramService from "./services/telegramService.js"; // Импортируем сервис
import schedule from "node-schedule";
import axios from "axios";

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

// Создаем HTTPS сервер
const httpsServer = https.createServer(options, app);

// Создаем HTTP сервер
const httpServer = http.createServer(app);

// Настройка Swagger
setupSwagger(app);

schedule.scheduleJob("* 8 * * *", async () => {
  console.log("Запущена задача отправки аффирмации.");
  const affirmation = await axios.get(
    "http://localhost:3000/api/affirmations/random"
  );
  if (affirmation.data) {
    const escapeMarkdownV2 = (text) =>
      text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");

    const affirmationText = escapeMarkdownV2(
      affirmation?.data?.text || "Не удалось получить аффирмацию"
    );

    await telegramService.sendMessage(
      process.env.CHAT_ID,
      `
*🌟 Ежедневная ХОХМфирмация 🌟*

> ${affirmationText}


_Удачного вам дня_
      `,
      "MarkdownV2"
    );
  } else {
    console.error("Не удалось получить аффирмацию.");
  }
});

// Запуск сервера
if (process.env.MODE === "DEV") {
  // Настройка Socket.IO
  setupSocket(httpsServer);
  httpsServer.listen(port, () => {
    console.log(`Сервер запущен на https://localhost:${port}`);
    console.log(`Swagger docs available at https://localhost:${port}/api-docs`);
  });
}

if (process.env.MODE === "PRODUCTION") {
  // Настройка Socket.IO
  setupSocket(httpServer);
  httpServer.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });
}
