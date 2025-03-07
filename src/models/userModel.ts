import mongoose, { Document, Schema } from "mongoose";

/**
 * @tsoaModel
 */
export interface UserDTO {
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  coins?: number;
  role?: "user" | "admin" | "moderator";
  createdAt?: Date;
}

export interface UserDocument extends UserDTO, Document {}

const UserSchema: Schema<UserDocument> = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    photoUrl: { type: String },
    coins: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<UserDocument>("User", UserSchema);
export default UserModel;
