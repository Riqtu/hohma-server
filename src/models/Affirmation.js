import mongoose from "mongoose";

const affirmationSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Affirmation = mongoose.model("Affirmation", affirmationSchema);

export default Affirmation;
