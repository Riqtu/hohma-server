import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import logger from "#config/logger.js";

// Создаем клиент S3 с нужными параметрами
const s3Client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

// Функция загрузки файла в S3
export const uploadToS3 = async (filePath, fileName) => {
  try {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `videos/${fileName}`, // Путь внутри бакета
      Body: fileContent,
      ContentType: "video/mp4",
      ACL: "public-read", // если необходимо оставить публичный доступ
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    logger.info(
      `✅ Файл загружен в S3 по пути: ${process.env.S3_ENDPOINT.replace(/\/$/, "")}/${process.env.S3_BUCKET_NAME}/videos/${fileName}`
    );

    // AWS SDK v3 не возвращает Location, поэтому URL можно сформировать вручную
    return `${process.env.S3_ENDPOINT.replace(/\/$/, "")}/${process.env.S3_BUCKET_NAME}/videos/${fileName}`;
  } catch (error) {
    logger.error(`❌ Ошибка загрузки в S3: ${error}`);
    throw error;
  }
};

// Функция удаления файла из S3
export const deleteFromS3 = async (fileName) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `videos/${fileName}`,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    logger.info(`🗑️ Файл удален из S3: videos/${fileName}`);
  } catch (error) {
    logger.error(`❌ Ошибка удаления из S3: ${error}`);
  }
};
