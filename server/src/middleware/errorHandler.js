import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Centralized error handling (Section 22): validation, Mongo, JWT, duplicate key, etc.
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 422;
    errors = Object.values(err.errors).map((e) => e.message);
    message = "Validation failed";
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0];
    message = `${field || "Field"} already exists`;
  }

  // Invalid ObjectId cast
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  if (env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
}
