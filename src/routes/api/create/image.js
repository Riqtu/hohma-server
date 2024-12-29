import express from "express";
import { genQuery } from "../../../api/gigaChat/genQuery";
import { getImage } from "../../../api/gigaChat/getImage";
import { getToken } from "../../../api/gigaChat/token";

const router = express.Router();

router.post("/", async (req, res) => {
  const token = await getToken();
  const data = req.body;
  const imgId = await genQuery(token.access_token, "image", data);
  const img = await getImage(token.access_token, imgId);
  res.json({ image: img });
});

export default router;
