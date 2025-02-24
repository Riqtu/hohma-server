import AWS from "aws-sdk";
import fs from "fs";
import logger from "#config/logger.js";
import dotenv from "dotenv";
dotenv.config();
// Конфигурация S3 (берем данные из .env)
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT, // Например, Yandex Object Storage или MinIO
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
      ACL: "public-read", // Делаем файл доступным по URL
    };

    const uploadResult = await s3.upload(params).promise();
    logger.info(`✅ Файл загружен в S3: ${uploadResult.Location}`);

    return uploadResult.Location; // Возвращаем URL файла
  } catch (error) {
    logger.error("❌ Ошибка загрузки в S3:", error);
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

    await s3.deleteObject(params).promise();
    logger.info(`🗑️ Файл удален из S3: videos/${fileName}`);
  } catch (error) {
    logger.error("❌ Ошибка удаления из S3:", error);
  }
};
