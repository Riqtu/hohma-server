import { Controller, Route, Tags, Post, Get, Body, Query } from "tsoa";
import crypto from "crypto";
import { validateTelegramAuth, authenticateUser } from "./auth.service.js";

/**
 * Интерфейс запроса для аутентификации через Telegram Web App
 */
export interface TelegramAuthRequest {
  initData: string;
}

/**
 * Контроллер для аутентификации
 */
@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  /**
   * Аутентификация через Telegram Web App (TWA)
   * @param requestBody Объект с initData
   * @returns Объект с данными пользователя и токеном
   */
  @Post("telegram")
  public async authenticateTelegramUser(
    @Body() requestBody: TelegramAuthRequest
  ): Promise<{ user: any; token: string }> {
    const { initData } = requestBody;

    if (!validateTelegramAuth(initData)) {
      this.setStatus(403);
      throw new Error("Неверные данные Telegram");
    }

    const params = new URLSearchParams(initData);
    const userString = params.get("user");
    if (!userString) {
      this.setStatus(400);
      throw new Error("user обязателен");
    }

    let userData;
    try {
      userData = JSON.parse(userString);
    } catch (error: any) {
      this.setStatus(400);
      throw new Error(error.message);
    }

    try {
      const { user, token } = await authenticateUser(userData);
      return { user, token };
    } catch (error: any) {
      this.setStatus(500);
      throw new Error(error.message);
    }
  }

  /**
   * Аутентификация через браузер (GET)
   * @param hash Хэш запроса
   * @param id Telegram ID пользователя
   * @param first_name Имя
   * @param last_name Фамилия
   * @param username Имя пользователя
   * @param photo_url URL фотографии
   */
  @Get("telegram")
  public async authenticateBrowserUser(
    @Query() hash: string,
    @Query() id: string,
    @Query() first_name: string,
    @Query() last_name: string,
    @Query() username: string,
    @Query() photo_url: string,
    @Query() auth_date: string
  ): Promise<void> {
    const botToken = process.env.BOT_TOKEN as string;
    // Вычисляем секрет как SHA256 от BOT_TOKEN
    const secret = crypto.createHash("sha256").update(botToken).digest();

    // Включаем auth_date в объект данных
    const data = { id, first_name, last_name, username, photo_url, auth_date };

    const checkString = (Object.keys(data) as Array<keyof typeof data>)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join("\n");

    const hmac = crypto.createHmac("sha256", secret).update(checkString).digest("hex");

    if (hmac !== hash) {
      this.setStatus(401);
      throw new Error("Unauthorized");
    }

    try {
      const { user, token } = await authenticateUser({
        id,
        first_name,
        last_name,
        username,
        photo_url,
      });
      // Вместо редиректа возвращаем заголовок Location с кодом 302
      this.setStatus(302);
      this.setHeader(
        "Location",
        `${process.env.CLIENT_URL}/auth-success?token=${token}&user=${encodeURIComponent(
          JSON.stringify(user)
        )}`
      );
      return;
    } catch (error: any) {
      this.setStatus(500);
      throw new Error(error.message);
    }
  }
}
