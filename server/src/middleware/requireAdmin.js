import { ApiError } from "../utils/ApiError.js";

// Must run AFTER authenticateUser. Role is read from req.user (DB), never from the request body.
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
}
