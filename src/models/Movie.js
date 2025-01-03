import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  authorImg: { type: String },
});

export default mongoose.model("Movie", movieSchema);
