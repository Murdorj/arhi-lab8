import express from "express";
import {
  register,
  login,
  getMe,
  getAllUsers,
  addCard,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, getMe);

router.get("/users", authMiddleware, getAllUsers);

router.put("/addCard", authMiddleware, addCard)
export default router;
