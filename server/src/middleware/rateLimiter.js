import rateLimit from "express-rate-limit";

// Section 23: rate limiting for auth endpoints specifically (brute force protection)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later.", errors: [] },
});
