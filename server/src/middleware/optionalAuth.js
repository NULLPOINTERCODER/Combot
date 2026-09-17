import { verifyAccessToken } from "../services/token.service.js";
import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// For public endpoints that behave slightly differently when a user IS logged in
// (e.g. showing their own reaction). Never throws - just leaves req.user undefined.
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next();

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
  } catch (err) {
    // ignore invalid/expired token on public routes
  }
  next();
});
