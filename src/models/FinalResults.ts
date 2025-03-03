import mongoose, { Document } from "mongoose";
import { IMovie } from "./Movie.js"; // Подключите интерфейс Movie

// Интерфейс для данных результатов
export interface IFinalResults extends Document {
  firstPlace: IMovie; // Теперь это объект типа IMovie
  secondPlace?: IMovie; // Для второго и третьего места можно сделать необязательными
  thirdPlace?: IMovie;
  date: Date;
}

const FinalResultsSchema = new mongoose.Schema<IFinalResults>({
  firstPlace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  secondPlace: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  thirdPlace: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IFinalResults>("FinalResults", FinalResultsSchema);
