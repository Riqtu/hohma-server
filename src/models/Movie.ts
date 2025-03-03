import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./userModel.js"; // Подключите интерфейс User

// Интерфейс для фильма
export interface IMovie extends Document {
  title: string;
  author: IUser; // Теперь это объект типа IUser, а не просто ObjectId
  createdAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

const movieSchema = new Schema<IMovie>({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ссылка на модель User
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

export default mongoose.model<IMovie>("Movie", movieSchema);
