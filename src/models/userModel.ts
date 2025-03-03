import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  coins?: number;
  role?: "user" | "admin" | "moderator";
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      unique: true, // Уникальный Telegram ID
      required: true,
      index: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    photoUrl: { type: String },
    coins: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Добавляет поля createdAt и updatedAt
  }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
