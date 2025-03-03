import logger from "./../../config/logger.js";
import axios from "axios";
import TikTokScraper from "@riqtu/tiktok-scraper";
import { IgApiClient } from "instagram-private-api";
import { getEnvVar } from "./../../config/env.js";
import { Context, Telegraf } from "telegraf";

// Функция для разворачивания коротких ссылок
const expandShortUrl = async (shortUrl: string) => {
  const response = await axios.get(shortUrl, {
    maxRedirects: 0,
    validateStatus: () => true,
  });
  if (response.status >= 300 && response.status < 400 && response.headers.location) {
    return response.headers.location;
  }
  return shortUrl;
};

// Функция для очистки URL (удаляет query-параметры)
const cleanUrl = (url: string) => {
  const parsedUrl = new URL(url);
  parsedUrl.search = "";
  return parsedUrl.toString();
};

const shortcodeToId = (shortcode: string) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let id = BigInt(0);
  for (let i = 0; i < shortcode.length; i++) {
    const index = BigInt(alphabet.indexOf(shortcode[i]));
    id = id * BigInt(64) + index;
  }
  return id.toString();
};
// Простейшая функция для извлечения mediaId из URL Instagram
// Пример: https://www.instagram.com/p/ABCDEF123/  → "ABCDEF123"
// Обновленная функция для извлечения mediaId из URL Instagram (поддерживает и /p/, и /reel/)
// Функция для извлечения mediaId из URL Instagram и преобразования shortcode в media_id
const extractMediaId = (url: string) => {
  const match = url.match(/instagram\.com\/(?:p|reel)\/([^\/\?]+)/);
  if (!match) {
    return null;
  }
  const shortcode = match[1];
  logger.info(`Найден shortcode: ${shortcode}`);

  return shortcodeToId(shortcode);
};

// Функция для скачивания видео из Instagram
const downloadInstagramVideo = async (postUrl: string) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(getEnvVar("IG_USERNAME"));

  // Пытаемся войти в аккаунт
  try {
    await ig.account.login(getEnvVar("IG_USERNAME"), getEnvVar("IG_PASSWORD"));
  } catch (error: any) {
    // Если ошибка связана с challenge_required, пробуем автоматически пройти проверку
    if (
      error.response &&
      error.response.body &&
      error.response.body.message &&
      error.response.body.message.includes("challenge_required")
    ) {
      try {
        // Попытка автоматического прохождения проверки
        const challenge = await ig.challenge.auto(true);
        logger.info(`Challenge auto result: ${JSON.stringify(challenge)}`);
        // Если после auto проверки требуется ввод кода, необходимо реализовать логику получения кода от пользователя
      } catch (challengeError: any) {
        throw new Error("Не удалось пройти верификацию: " + challengeError.message);
      }
    } else {
      throw error;
    }
  }

  // Извлекаем идентификатор медиа из URL
  const mediaId = extractMediaId(postUrl);
  if (!mediaId) {
    throw new Error("Не удалось извлечь идентификатор медиа из URL Instagram");
  }

  const mediaInfo = await ig.media.info(mediaId);
  const videoUrl = (mediaInfo.items[0] as any).video_versions?.[0]?.url;
  if (!videoUrl) {
    throw new Error("Ссылка для скачивания не найдена в данных Instagram");
  }

  return videoUrl;
};

// Функция для скачивания видео из TikTok с использованием @xct007/tiktok-scraper
const downloadTikTokVideo = async (videoUrl: string) => {
  try {
    logger.info(`Получение данных о видео из TikTok: ${videoUrl}`);

    // Запрос через прокси
    const videoData = await TikTokScraper(videoUrl, {
      parse: false,
      proxy: getEnvVar("SOCKS5_PROXY"),
    });
    const awemeList = Array.isArray(videoData) ? videoData : (videoData as any).collector;
    if (!awemeList || !awemeList.length) {
      throw new Error("Ссылка для скачивания не найдена");
    }

    const videoObj = awemeList[0].video;
    let downloadLink =
      videoObj.download_addr?.url_list?.[0] ||
      videoObj.downloadAddr?.url_list?.[0] ||
      videoObj.play_addr?.url_list?.[0];

    if (!downloadLink) {
      logger.error(`Ссылки для скачивания отсутствуют. Данные видео: ${JSON.stringify(videoObj)}`);
      throw new Error("Ссылка для скачивания не найдена в данных");
    }

    logger.info(`Найден downloadLink: ${downloadLink}`);

    return downloadLink;
  } catch (error) {
    throw error;
  }
};

// Основная функция, которая определяет платформу и скачивает видео
export const downloadVideo = async (url: string, bot: Telegraf, ctx: Context | null = null) => {
  try {
    logger.info(`📥 Загружаем видео с URL: ${url}`);

    const expandedUrl = await expandShortUrl(url);
    const cleanedUrl = cleanUrl(expandedUrl);
    let messageId;
    let videoPath;
    if (cleanedUrl.includes("tiktok.com") || cleanedUrl.includes("vt.tiktok.com")) {
      if (ctx) {
        const loadingMessage = await ctx.reply("⏳ Загружаем видео TikTok...");
        messageId = loadingMessage.message_id;
      }
      videoPath = await downloadTikTokVideo(cleanedUrl);
    } else if (cleanedUrl.includes("instagram.com")) {
      if (ctx) {
        const loadingMessage = await ctx.reply("⏳ Загружаем видео Instagram...");
        messageId = loadingMessage.message_id;
      }
      videoPath = await downloadInstagramVideo(cleanedUrl);
    } else {
      if (ctx) {
        return ctx.reply("❌ Поддерживаются только ссылки на TikTok и Instagram.");
      }
      return null;
    }

    logger.info(`Ссылка: ${videoPath}`);

    if (ctx && ctx.chat) {
      messageId && (await ctx.telegram.deleteMessage(ctx.chat.id, messageId));
      return await ctx.replyWithVideo(videoPath);
    }

    return videoPath;
  } catch (error) {
    logger.error("❌ Ошибка загрузки видео:", error);
    if (ctx) {
      ctx.reply("🚨 Произошла ошибка при загрузке видео.");
    }
    return null;
  }
};

// Регистрация команды /download, которая теперь обрабатывает и TikTok, и Instagram
const downloadCommand = (bot: Telegraf) => {
  bot.command("download", async (ctx) => {
    const messageText = ctx.message.text;
    const url = messageText.split(" ")[1];

    if (!url) {
      return ctx.reply("⚠️ Использование: /download [ссылка на видео]");
    }

    await downloadVideo(url, bot, ctx);
  });
};

export default downloadCommand;
