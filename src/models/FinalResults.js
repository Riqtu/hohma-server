import mongoose from "mongoose";

const FinalResultsSchema = new mongoose.Schema({
  firstPlace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  secondPlace: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  thirdPlace: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("FinalResults", FinalResultsSchema);
