import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

// Runs after express-validator chains; converts errors into our ApiError shape (422)
export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((e) => e.msg);
    throw new ApiError(422, "Validation failed", errors);
  }
  next();
}
