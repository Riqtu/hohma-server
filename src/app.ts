import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes/routes.js";
import swaggerUi from "swagger-ui-express";
import path from "path";
const { default: swaggerDocument } = await import("../tmp/swagger.json", {
  assert: { type: "json" },
});

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
