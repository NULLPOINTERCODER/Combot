import { body } from "express-validator";

export const signupValidator = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
];

export const resetPasswordValidator = [
  body("token").notEmpty().withMessage("Token is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

export const verifyEmailValidator = [body("token").notEmpty().withMessage("Token is required")];
