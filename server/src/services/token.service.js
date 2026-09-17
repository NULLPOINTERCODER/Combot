import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import RefreshToken from "../models/RefreshToken.model.js";
import { hashToken, generateRawToken } from "../utils/tokenHash.js";

export function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

// Creates a new raw refresh token, stores only its hash, returns the raw value
// so it can be set as an httpOnly cookie.
export async function issueRefreshToken(userId) {
  const raw = generateRawToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_MS);
  await RefreshToken.create({ userId, tokenHash: hashToken(raw), expiresAt });
  return { raw, expiresAt };
}

export async function rotateRefreshToken(rawOldToken) {
  const oldHash = hashToken(rawOldToken);
  const existing = await RefreshToken.findOne({ tokenHash: oldHash });

  if (!existing || existing.revoked || existing.expiresAt < new Date()) {
    return null; // caller treats as invalid -> force re-login
  }

  existing.revoked = true;
  await existing.save();

  return issueRefreshToken(existing.userId);
}

export async function revokeRefreshToken(rawToken) {
  const tokenHash = hashToken(rawToken);
  await RefreshToken.updateOne({ tokenHash }, { revoked: true });
}

export async function revokeAllUserRefreshTokens(userId) {
  await RefreshToken.updateMany({ userId, revoked: false }, { revoked: true });
}

export function accessCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  };
}

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: env.REFRESH_TOKEN_EXPIRES_MS,
    path: "/api/v1/auth", // only sent on auth routes (refresh/logout)
  };
}
