import path, { dirname } from "path";
import express from "express";
import https from "https";
import { Text2ImageAPI } from "./api/kadn.mjs";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import bodyParser from "body-parser";
import { getToken } from "./api/gigaChat/token.mjs";
import { getModels } from "./api/gigaChat/models.mjs";
import axios from "axios";
import { genQuery } from "./api/gigaChat/genQuery.mjs";
import { getImage } from "./api/gigaChat/getImage.mjs";
const app = express();
const port = 3000;

export const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// Используем middleware для парсинга JSON
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Пример хранения данных в памяти (для простоты)
let items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

let token = "";
if (token.expires_at) {
  setInterval(async () => {
    token = await getToken();
  }, token.expires_at);
} else {
  token = await getToken();
}

app.get("/test", async (req, res) => {
  const imgId = await genQuery(token.access_token);
  const img = await getImage(token.access_token, imgId);
  res.json({ data: img });
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
  const api = new Text2ImageAPI(
    "https://api-key.fusionbrain.ai/",
    "36F9058A8673CB14C4839921D7821059",
    "F85841901FEBF0BB09908690B1BCFF50"
  );
  const modelId = await api.getModels();
  const uuid = await api.generate(
    "Девушка, темно-красные волосы, серые глаза",
    modelId,
    1,
    512,
    512,
    4
  );
  const images = await api.checkGeneration(uuid);
  res.json({ data: images });
});

app.post("/api/generate", async (req, res) => {
  const data = req.body; // Получаем данные из тела запроса
  const api = new Text2ImageAPI(
    "https://api-key.fusionbrain.ai/",
    "36F9058A8673CB14C4839921D7821059",
    "F85841901FEBF0BB09908690B1BCFF50"
  );
  const modelId = await api.getModels();
  const uuid = await api.generate(
    data.query,
    modelId,
    1,
    data.width,
    data.height,
    data.style
  );
  const images = await api.checkGeneration(uuid);
  res.json({ data: images });
  console.log("Полученные данные:", data); // Выводим данные в консоль
});
// Получение пути к текущему файлу и каталогу
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// // Чтение файла с ключом
// const keyPath = path.join(__dirname, 'server.key');
// const key = fs.readFileSync(keyPath);
// Настройка HTTPS
const options = {
  key: fs.readFileSync(path.join(__dirname, "server.key")),
  cert: fs.readFileSync(path.join(__dirname, "server.cert")),
};

// Запускаем HTTPS сервер
https.createServer(options, app).listen(port, () => {
  console.log(`Secure server is running at https://localhost:${port}`);
});
