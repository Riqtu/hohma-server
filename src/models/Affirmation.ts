import mongoose, { Document } from "mongoose";

export interface AffirmationDocument extends Document {
  text: string;
  createdAt: Date;
}

const affirmationSchema = new mongoose.Schema<AffirmationDocument>(
  {
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Affirmation = mongoose.model<AffirmationDocument>("Affirmation", affirmationSchema);

export default Affirmation;
