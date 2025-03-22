import express from "express";
import {
    register,
  login,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/profile/:id', authenticate, getUserProfile);
router.put('/profile/:id', authenticate, updateUserProfile);

export default router;
