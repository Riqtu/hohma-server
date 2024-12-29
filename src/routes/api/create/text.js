import express from "express";
import { genQuery } from "../../../api/gigaChat/genQuery";
import { getImage } from "../../../api/gigaChat/getImage";
import { getToken } from "../../../api/gigaChat/token";

const router = express.Router();

router.post("/", async (req, res) => {
  const token = await getToken();
  const data = req.body;
  const text = await genQuery(token.access_token, "text", data);
  res.json({ text: text });
});

export default router;
