import { verifyAccessToken } from "../services/token.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.model.js";

// Reads the access token httpOnly cookie, verifies it, attaches req.user.
// Frontend never sends role info that we trust - role always comes from DB via token subject.
export const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) throw new ApiError(401, "Not authenticated");

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    throw new ApiError(401, "Access token invalid or expired");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, "User no longer exists");

  req.user = user;
  next();
});
