import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/User";

const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    userType: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    password: { type: String, required: true },
    cardNumber: { type: String },
    securityNumber: { type: String },
    cardExpiryDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
