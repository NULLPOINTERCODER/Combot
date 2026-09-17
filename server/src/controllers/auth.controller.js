import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.model.js";
import EmailVerificationToken from "../models/EmailVerificationToken.model.js";
import PasswordResetToken from "../models/PasswordResetToken.model.js";
import { hashToken, generateRawToken } from "../utils/tokenHash.js";
import { sendSimulatedEmail } from "../services/email.service.js";
import {
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  accessCookieOptions,
  refreshCookieOptions,
} from "../services/token.service.js";
import { env } from "../config/env.js";

async function setAuthCookies(res, user) {
  const accessToken = signAccessToken(user);
  const { raw: refreshToken } = await issueRefreshToken(user._id);
  res.cookie("accessToken", accessToken, accessCookieOptions());
  res.cookie("refreshToken", refreshToken, refreshCookieOptions());
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password });

  const rawToken = generateRawToken();
  await EmailVerificationToken.create({
    userId: user._id,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
  });

  const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${rawToken}`;
  sendSimulatedEmail({ to: user.email, subject: "Verify your email", actionUrl: verificationUrl });

  return res.status(201).json(
    new ApiResponse(
      {
        user: user.toSafeJSON(),
        // dev-only convenience so it can be tested without an inbox (Section 6)
        ...(env.NODE_ENV !== "production" ? { devVerificationUrl: verificationUrl } : {}),
      },
      "Signup successful. Please verify your email."
    )
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.body.token || req.query.token;
  if (!token) throw new ApiError(400, "Verification token is required");

  const record = await EmailVerificationToken.findOne({ tokenHash: hashToken(token), used: false });
  if (!record || record.expiresAt < new Date()) {
    throw new ApiError(400, "Verification link is invalid or has expired");
  }

  await User.findByIdAndUpdate(record.userId, { isEmailVerified: true });
  record.used = true;
  await record.save();

  return res.status(200).json(new ApiResponse({}, "Email verified successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  await setAuthCookies(res, user);

  return res.status(200).json(new ApiResponse({ user: user.toSafeJSON() }, "Login successful"));
});

export const refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.refreshToken;
  if (!rawToken) throw new ApiError(401, "Refresh token missing");

  const rotated = await rotateRefreshToken(rawToken);
  if (!rotated) {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });
    throw new ApiError(401, "Refresh token invalid or expired, please log in again");
  }

  // Need the user to sign a fresh access token
  const RefreshToken = (await import("../models/RefreshToken.model.js")).default;
  const record = await RefreshToken.findOne({ tokenHash: hashToken(rotated.raw) });
  const user = await User.findById(record.userId);

  const accessToken = signAccessToken(user);
  res.cookie("accessToken", accessToken, accessCookieOptions());
  res.cookie("refreshToken", rotated.raw, refreshCookieOptions());

  return res.status(200).json(new ApiResponse({ user: user.toSafeJSON() }, "Token refreshed"));
});

export const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.refreshToken;
  if (rawToken) await revokeRefreshToken(rawToken);

  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/v1/auth" });

  return res.status(200).json(new ApiResponse({}, "Logged out successfully"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way to avoid account enumeration (Section 7)
  const genericResponse = new ApiResponse(
    {},
    "If an account with that email exists, a reset link has been sent."
  );

  if (!user) return res.status(200).json(genericResponse);

  const rawToken = generateRawToken();
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });

  const resetUrl = `${env.CLIENT_URL}/reset-password/${rawToken}`;
  sendSimulatedEmail({ to: user.email, subject: "Reset your password", actionUrl: resetUrl });

  return res.status(200).json(
    new ApiResponse(
      env.NODE_ENV !== "production" ? { devResetUrl: resetUrl } : {},
      "If an account with that email exists, a reset link has been sent."
    )
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const record = await PasswordResetToken.findOne({ tokenHash: hashToken(token), used: false });
  if (!record || record.expiresAt < new Date()) {
    throw new ApiError(400, "Reset link is invalid or has expired");
  }

  const user = await User.findById(record.userId);
  if (!user) throw new ApiError(400, "Reset link is invalid or has expired");

  user.password = password; // pre-save hook re-hashes
  await user.save();

  record.used = true;
  await record.save();

  // Revoke all existing sessions once password changes
  await revokeAllUserRefreshTokens(user._id);

  return res.status(200).json(new ApiResponse({}, "Password has been reset. Please log in again."));
});

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse({ user: req.user.toSafeJSON() }, "Current user"));
});
