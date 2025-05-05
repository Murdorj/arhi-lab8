import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        userType: string;
      };
  
      (req as any).userId = decoded.userId;
      (req as any).userType = decoded.userType;
  
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }
  };
  