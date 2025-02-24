import logger from "#config/logger.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import TikTokScraper from "@riqtu/tiktok-scraper";
import { IgApiClient } from "instagram-private-api";
import { SocksProxyAgent } from "socks-proxy-agent";
import { uploadToS3 } from "#services/s3.js";

// Функция для разворачивания коротких ссылок
const expandShortUrl = async (shortUrl) => {
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
const cleanUrl = (url) => {
  const parsedUrl = new URL(url);
  parsedUrl.search = "";
  return parsedUrl.toString();
};

const shortcodeToId = (shortcode) => {
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
const extractMediaId = (url) => {
  const match = url.match(/instagram\.com\/(?:p|reel)\/([^\/\?]+)/);
  if (!match) {
    return null;
  }
  const shortcode = match[1];
  logger.info(`Найден shortcode: ${shortcode}`);

  return shortcodeToId(shortcode);
};

// Функция для скачивания видео из Instagram
const downloadInstagramVideo = async (postUrl) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);

  // Пытаемся войти в аккаунт
  try {
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  } catch (error) {
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
      } catch (challengeError) {
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
  const videoUrl = mediaInfo.items[0]?.video_versions?.[0]?.url;
  if (!videoUrl) {
    throw new Error("Ссылка для скачивания не найдена в данных Instagram");
  }

  // Скачиваем видео по прямой ссылке
  const response = await axios.get(videoUrl, { responseType: "stream" });
  const tempDir = path.resolve(process.cwd(), "downloads");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  const videoPath = path.join(tempDir, `instagram_${Date.now()}.mp4`);
  const writer = fs.createWriteStream(videoPath);
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  return videoPath;
};

// Функция для скачивания видео из TikTok с использованием @xct007/tiktok-scraper
const downloadTikTokVideo = async (videoUrl) => {
  try {
    logger.info(`Получение данных о видео из TikTok: ${videoUrl}`);

    // Настраиваем SOCKS5-прокси
    const agent = new SocksProxyAgent(process.env.SOCKS5_PROXY);
    // Запрос через прокси
    const videoData = await TikTokScraper(videoUrl, {
      parse: false,
      proxy: process.env.SOCKS5_PROXY,
    });
    const awemeList = Array.isArray(videoData) ? videoData : videoData.collector;
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

    // Проксируем сам запрос на скачивание видео
    const response = await axios.get(downloadLink, {
      responseType: "stream",
      httpAgent: agent,
      httpsAgent: agent,
    });

    const tempDir = path.resolve(process.cwd(), "downloads");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const videoPath = path.join(tempDir, `tiktok_${Date.now()}.mp4`);
    const writer = fs.createWriteStream(videoPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    return videoPath;
  } catch (error) {
    throw error;
  }
};

// Основная функция, которая определяет платформу и скачивает видео
export const downloadVideo = async (url, bot, ctx = null) => {
  try {
    logger.info(`📥 Загружаем видео с URL: ${url}`);

    const expandedUrl = await expandShortUrl(url);
    const cleanedUrl = cleanUrl(expandedUrl);

    let videoPath;
    if (cleanedUrl.includes("tiktok.com") || cleanedUrl.includes("vt.tiktok.com")) {
      videoPath = await downloadTikTokVideo(cleanedUrl);
    } else if (cleanedUrl.includes("instagram.com")) {
      videoPath = await downloadInstagramVideo(cleanedUrl);
    } else {
      if (ctx) {
        return ctx.reply("❌ Поддерживаются только ссылки на TikTok и Instagram.");
      }
      return null;
    }

    // Генерируем уникальное имя файла
    const fileName = `video_${Date.now()}.mp4`;

    // Загружаем видео в S3
    const s3Url = await uploadToS3(videoPath, fileName);

    // Удаляем локальный файл после загрузки
    fs.unlinkSync(videoPath);

    if (ctx) {
      return await ctx.replyWithVideo(s3Url);
    }

    return s3Url;
  } catch (error) {
    logger.error("❌ Ошибка загрузки видео:", error);
    if (ctx) {
      ctx.reply("🚨 Произошла ошибка при загрузке видео.");
    }
    return null;
  }
};

// Регистрация команды /download, которая теперь обрабатывает и TikTok, и Instagram
const downloadCommand = (bot) => {
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
