import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api", routes);

app.use("/videos", express.static(path.resolve("public/videos")));

export default app;
