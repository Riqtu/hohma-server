import { sendTelegramMessage } from "./telegram.service.js";

export const sendTelegramMessageHandler = async (req, res) => {
  try {
    const message = await sendTelegramMessage(req.body.text);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
