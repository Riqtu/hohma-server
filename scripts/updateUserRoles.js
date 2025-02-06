import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "#config/logger.js";
import UserModel from "#models/userModel.js";

dotenv.config();

const updateUsersWithoutRole = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const usersToUpdate = await UserModel.updateMany(
      { role: { $exists: false } }, // Ищем пользователей без роли
      { $set: { role: "user" } } // Устанавливаем роль "user"
    );

    logger.info(`Обновлено пользователей: ${usersToUpdate.modifiedCount}`);
    mongoose.connection.close();
  } catch (error) {
    logger.info("Ошибка обновления пользователей:", error);
    mongoose.connection.close();
  }
};

updateUsersWithoutRole();
