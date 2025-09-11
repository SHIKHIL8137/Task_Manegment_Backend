import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../../../domain/interface/types/schem.interface";

interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserModel =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);

export default UserModel;
export type { IUserDocument };
