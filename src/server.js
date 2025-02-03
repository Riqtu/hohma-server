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
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

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

schedule.scheduleJob("0 5 * * *", async () => {
  console.log("Запущена задача отправки аффирмации.");
  const affirmation = await axios.get(
    "https://hohma-server.ru/api/affirmations/random"
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

const bot = new Telegraf(process.env.BOT_TOKEN);

// Регистрация команд для отображения в подсказках
bot.telegram.setMyCommands([
  {
    command: "random",
    description: "Получить случайный ответ (Да или Нет)",
  },
]);
// Обработчик команды /random
bot.command("random", (ctx) => {
  const answer = Math.random() > 0.5 ? "Да" : "Нет";
  ctx.reply(answer);
});

bot.on(message("text"), async (ctx) => {
  try {
    const msg = ctx.message.text;

    if (msg.includes(ctx.botInfo.username)) {
      const command = msg.replace(`@${ctx.botInfo.username}`, "").trim();
      if (command === "/random") {
        ctx.reply(Math.random() > 0.5 ? "Да" : "Нет");
        return;
      }

      const apiKey = process.env.GPT_API_KEY;
      const folderId = process.env.FOLDER_ID;

      if (!apiKey || !folderId) {
        console.error("Ошибка: отсутствует API-ключ или Folder ID");
        ctx.reply("Ошибка конфигурации: отсутствует API-ключ.");
        return;
      }

      const data = {
        modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
        completionOptions: {
          stream: false,
          temperature: 0.6,
          maxTokens: 500, // Уменьшили maxTokens
        },
        messages: [
          {
            role: "system",
            text: 'Ты дружелюбная ассистентка по имени "Хохма". Отвечай на вопросы и шути.',
          },
          { role: "user", text: command },
        ],
      };

      console.log(
        "Отправляем запрос в YandexGPT:",
        JSON.stringify(data, null, 2)
      );

      const response = await axios.post(
        "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
        data,
        {
          headers: {
            Authorization: `Api-Key ${apiKey}`,
            "x-folder-id": folderId,
          },
        }
      );

      console.log("Ответ от YandexGPT:", response.data);
      ctx.reply(response.data.result.alternatives[0].message.text);
    }
  } catch (error) {
    console.error("Ошибка запроса в YandexGPT:", error.response?.data || error);
    ctx.reply("Произошла ошибка при обработке запроса. Попробуйте позже.");
  }
});

// Запуск бота
bot
  .launch()
  .then(() => console.log("Бот запущен"))
  .catch((err) => console.error("Ошибка запуска бота:", err));

// Обработка остановки
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

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
