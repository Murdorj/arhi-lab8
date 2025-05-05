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

// Хэрэглэгч бүртгүүлэх
router.post("/register", register);

// Хэрэглэгч нэвтрэх
router.post("/login", login);

// JWT-аар өөрийн мэдээлэл авах (хамгаалагдсан маршрут)
router.get("/me", authMiddleware, getMe);

router.get("/users", authMiddleware, getAllUsers);

router.put("/addCard", authMiddleware, addCard)
export default router;
