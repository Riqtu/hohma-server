import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import fs from "fs";
import logger from "./../config/logger.js";
import { getEnvVar } from "./../config/env.js";

// Создаем клиент S3 с нужными параметрами
const s3Client = new S3Client({
  region: getEnvVar("S3_REGION"),
  endpoint: getEnvVar("S3_ENDPOINT"),
  credentials: async () => ({
    accessKeyId: getEnvVar("S3_ACCESS_KEY"),
    secretAccessKey: getEnvVar("S3_SECRET_KEY"),
  }),
});

// Функция загрузки файла в S3
export const uploadToS3 = async (filePath: string, fileName: string) => {
  try {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: getEnvVar("S3_BUCKET_NAME"),
      Key: `videos/${fileName}`, // Путь внутри бакета
      Body: fileContent,
      ContentType: "video/mp4",
      ACL: ObjectCannedACL.public_read, // Теперь без ошибок
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    logger.info(
      `✅ Файл загружен в S3 по пути: ${getEnvVar("S3_ENDPOINT").replace(/\/$/, "")}/${getEnvVar("S3_BUCKET_NAME")}/videos/${fileName}`
    );

    // AWS SDK v3 не возвращает Location, поэтому URL можно сформировать вручную
    return `${getEnvVar("S3_ENDPOINT").replace(/\/$/, "")}/${getEnvVar("S3_BUCKET_NAME")}/videos/${fileName}`;
  } catch (error) {
    logger.error(`❌ Ошибка загрузки в S3: ${error}`);
    throw error;
  }
};

// Функция удаления файла из S3
export const deleteFromS3 = async (fileName: string) => {
  try {
    const params = {
      Bucket: getEnvVar("S3_BUCKET_NAME"),
      Key: `videos/${fileName}`,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    logger.info(`🗑️ Файл удален из S3: videos/${fileName}`);
  } catch (error) {
    logger.error(`❌ Ошибка удаления из S3: ${error}`);
  }
};
