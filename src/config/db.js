import mongoose from "mongoose";

const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Успешное подключение к MongoDB");
  } catch (err) {
    console.error("Ошибка подключения к MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
