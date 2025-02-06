import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      unique: true, // Уникальный Telegram ID
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    photoUrl: {
      type: String,
      required: false,
    },
    coins: {
      type: Number,
      required: false,
      default: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Добавляет поля createdAt и updatedAt
  }
);

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
