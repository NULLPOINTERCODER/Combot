import { Router } from "express";
import {
  signup,
  verifyEmail,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from "../validators/auth.validators.js";

const router = Router();

router.post("/signup", authRateLimiter, signupValidator, validateRequest, signup);
router.post("/verify-email", verifyEmailValidator, validateRequest, verifyEmail);
router.get("/verify-email", verifyEmail);
router.post("/login", authRateLimiter, loginValidator, validateRequest, login);
router.post("/refresh", refresh);
router.post("/logout", authenticateUser, logout);
router.post("/forgot-password", authRateLimiter, forgotPasswordValidator, validateRequest, forgotPassword);
router.post("/reset-password", authRateLimiter, resetPasswordValidator, validateRequest, resetPassword);
router.get("/me", authenticateUser, getMe);

export default router;
