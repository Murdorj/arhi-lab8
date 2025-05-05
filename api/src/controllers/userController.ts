import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/userModel";
import { IUser } from "../interfaces/User";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      firstName,
      lastName,
      registrationNumber,
      userType,
      password,
      cardNumber,
      securityNumber,
      cardExpiryDate,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const existingRegNo = await User.findOne({ registrationNumber });
    if (existingRegNo) {
      res.status(400).json({ message: "Registration number already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      firstName,
      lastName,
      registrationNumber,
      userType,
      password: hashedPassword,
      cardNumber,
      securityNumber,
      cardExpiryDate,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        userType: user.userType,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        registrationNumber: user.registrationNumber,
        userType: user.userType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Fetching user failed", error: err });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if ((req as any).userType !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err });
  }
};

export const addCard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { cardNumber, securityNumber, cardExpiryDate } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        cardNumber,
        securityNumber,
        cardExpiryDate,
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update card", error: err });
  }
};
