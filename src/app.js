import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", routes);

export default app;
