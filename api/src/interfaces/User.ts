import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  userType: "admin" | "user";
  password: string;
  cardNumber?: string;
  securityNumber?: string;
  cardExpiryDate?: Date;
}
