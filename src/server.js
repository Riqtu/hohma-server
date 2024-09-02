import path, { dirname } from "path";
import express from "express";
import https from "https";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import bodyParser from "body-parser";
import { getToken } from "./api/gigaChat/token";
import { getModels } from "./api/gigaChat/models";
import axios from "axios";
import { genQuery } from "./api/gigaChat/genQuery";
import { getImage } from "./api/gigaChat/getImage";
import dotenv from "dotenv";
import { Text2ImageAPI } from "./api/kadn";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

export const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// Используем middleware для парсинга JSON
app.use(cors());
app.options("*", cors()); // Разрешить запросы OPTIONS из любого источника
app.use(express.json());
app.use(bodyParser.json());

// Пример хранения данных в памяти (для простоты)
let items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

let token = "";
async function main() {
  try {
    if (token.expires_at) {
      setInterval(async () => {
        token = await getToken();
      }, token.expires_at);
    } else {
      token = await getToken();
    }
  } catch (error) {
    console.error("Error fetching token:", error);
  }
}

main();

app.get("/", (req, res) => {
  res.send("Timeweb Cloud + Express = ️ ❤️");
});

app.post("/api/create/image", async (req, res) => {
  const data = req.body; // Получаем данные из тела запроса
  const imgId = await genQuery(token.access_token, "image", data);
  const img = await getImage(token.access_token, imgId);
  res.json({ data: img });
});

app.get("/api/create/text", async (req, res) => {
  const text = await genQuery(token.access_token, "text", data);
  res.json({ data: text });
});

app.get("/api/items", (req, res) => {
  res.json(items);
});

// Генерация изображения
app.get("/api/generate", async (req, res) => {
  const api =
    new Text2ImageAPI() /
    api(
      "https://api-key.fusionbrain.ai/",
      "36F9058A8673CB14C4839921D7821059",
      "F85841901FEBF0BB09908690B1BCFF50"
    );
  const modelId = (await src) / api.getModels();
  const uuid =
    (await src) /
    api.generate(
      "Девушка, темно-красные волосы, серые глаза",
      modelId,
      1,
      512,
      512,
      4
    );
  const images = (await src) / api.checkGeneration(uuid);
  res.json({ data: images });
});

app.post("/api/generate", async (req, res) => {
  const data = req.body; // Получаем данные из тела запроса
  const api =
    new Text2ImageAPI() /
    api(
      "https://api-key.fusionbrain.ai/",
      "36F9058A8673CB14C4839921D7821059",
      "F85841901FEBF0BB09908690B1BCFF50"
    );
  const modelId = (await src) / api.getModels();
  const uuid =
    (await src) /
    api.generate(data.query, modelId, 1, data.width, data.height, data.style);
  const images = (await src) / api.checkGeneration(uuid);
  res.json({ data: images });
  console.log("Полученные данные:", data); // Выводим данные в консоль
});

// // Определите `options` для HTTPS
// const options = {
//   key: fs.readFileSync(path.resolve("server.key")), // Путь к вашему приватному ключу
//   cert: fs.readFileSync(path.resolve("server.cert")), // Путь к вашему сертификату
// };
// // Запускаем HTTPS сервер
// https.createServer(options, app).listen(port, () => {
//   console.log(`Secure server is running at https://localhost:${port}`);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
