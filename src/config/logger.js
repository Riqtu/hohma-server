import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import path from "path";

// Создание директории для логов
const logDir = path.join(process.cwd(), "logs");
// eslint-disable-next-line no-console
fs.promises.mkdir(logDir, { recursive: true }).catch(console.error);

const env = process.env.NODE_ENV || "development";
const logLevel = process.env.LOG_LEVEL || (env === "production" ? "info" : "debug");

// Универсальный формат логирования с выводом стектрейса, если он есть
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ timestamp, level, message, stack, ...meta }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message} ${stack ? `\nStack: ${stack}` : ""} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`
  )
);

const logger = winston.createLogger({
  level: logLevel,
  defaultMeta: { service: "hohma-server" },
  format: logFormat,
  transports: [
    // Консольный транспорт с разным форматом для продакшена и разработки
    new winston.transports.Console({
      format:
        env === "production"
          ? winston.format.json()
          : winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize(),
              winston.format.printf(
                ({ timestamp, level, message, stack, ...meta }) =>
                  `[${timestamp}] ${level}: ${message} ${stack ? `\nStack: ${stack}` : ""} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`
              )
            ),
    }),
    // Файл с логами уровня info
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info",
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    }),
    // Файл с логами уровня error
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    }),
    // Транспорт с ротацией логов
    new DailyRotateFile({
      dirname: logDir,
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m", // ограничение по размеру файла
      maxFiles: "14d", // хранить файлы логов 14 дней
      level: logLevel,
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    }),
  ],
  // Обработка исключений
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
      format: winston.format.simple(),
    }),
  ],
});

// В dev-режиме добавляем отдельный файл для debug-логирования
if (env !== "production") {
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, "debug.log"),
      level: "debug",
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    })
  );
}

// Обработка необработанных ошибок и отклоненных промисов с завершением процесса
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", {
    reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Обработка сигналов завершения процесса
process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down...");
  process.exit(0);
});

logger.info(`Logger initialized in ${env} mode`);

export default logger;
