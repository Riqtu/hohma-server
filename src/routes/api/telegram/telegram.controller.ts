import { Controller, Route, Tags, Post, Body } from "tsoa";
import { sendTelegramMessage } from "./telegram.service.js";

/**
 * Интерфейс запроса для отправки сообщения в Telegram.
 * Определите необходимые поля, например:
 * - chatId: string;
 * - text: string;
 */
export interface SendTelegramMessageRequest {
  chatId: string;
  text: string;
}

@Route("telegram")
@Tags("Telegram")
export class TelegramController extends Controller {
  /**
   * Отправка сообщения в Telegram
   * @param requestBody Данные сообщения
   */
  @Post("send")
  public async sendTelegramMessageHandler(
    @Body() requestBody: SendTelegramMessageRequest
  ): Promise<{ message: string }> {
    try {
      const message = await sendTelegramMessage(requestBody);
      this.setStatus(201);
      return { message };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }
}
