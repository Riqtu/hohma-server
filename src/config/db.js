import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    logger.info("Успешное подключение к MongoDB");
  } catch (err) {
    logger.error("Ошибка подключения к MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
