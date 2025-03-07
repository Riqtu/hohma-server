import mongoose, { Document } from "mongoose";

/**
 * @tsoaModel
 */
export interface AffirmationDTO {
  text: string;
  createdAt: Date;
}

export interface AffirmationDocument extends AffirmationDTO, Document {}

const affirmationSchema = new mongoose.Schema<AffirmationDocument>(
  {
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Affirmation = mongoose.model<AffirmationDocument>("Affirmation", affirmationSchema);

export default Affirmation;
