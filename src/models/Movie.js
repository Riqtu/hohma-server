import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  authorName: { type: String },
  authorImg: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

export default mongoose.model("Movie", movieSchema);
