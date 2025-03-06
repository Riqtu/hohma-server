import mongoose, { Document } from "mongoose";
import { MovieDTO } from "./Movie.js"; // Подключите интерфейс Movie

// Интерфейс для данных результатов
export interface FinalResultsDTO {
  firstPlace: MovieDTO; // Теперь это объект типа MovieDTO
  secondPlace?: MovieDTO; // Для второго и третьего места можно сделать необязательными
  thirdPlace?: MovieDTO;
  date: Date;
}

export interface FinalResultsDocument extends FinalResultsDTO, Document {}

const FinalResultsSchema = new mongoose.Schema<FinalResultsDocument>({
  firstPlace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  secondPlace: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  thirdPlace: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<FinalResultsDocument>("FinalResults", FinalResultsSchema);
