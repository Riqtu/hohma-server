import mongoose, { Document, Schema } from "mongoose";
import { UserDTO } from "./userModel.js"; // Подключите интерфейс User

// Интерфейс для фильма
/**
 * @tsoaModel
 */
export interface MovieDTO {
  title: string;
  author: UserDTO; // Теперь это объект типа IUser, а не просто ObjectId
  createdAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface MovieDocument extends MovieDTO, Document {}

const movieSchema = new Schema<MovieDocument>({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ссылка на модель User
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

export default mongoose.model<MovieDocument>("Movie", movieSchema);
