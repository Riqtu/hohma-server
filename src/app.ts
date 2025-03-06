import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes/routes.js";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

// Получаем абсолютный путь к файлу swagger.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, "../tmp/swagger.json");

const swaggerContent = await fs.readFile(swaggerPath, "utf-8");
const swaggerDocument = JSON.parse(swaggerContent);

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

RegisterRoutes(apiRouter);
app.use("/api", apiRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/swagger.json", (req, res) => {
  res.sendFile(path.resolve("./tmp/swagger.json"));
});
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/videos", express.static(path.resolve("public/videos")));

export default app;
