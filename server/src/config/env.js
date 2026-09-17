import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/changelog_app",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "dev_access_secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  REFRESH_TOKEN_EXPIRES_MS: Number(process.env.REFRESH_TOKEN_EXPIRES_MS || 7 * 24 * 60 * 60 * 1000),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  SERVER_URL: process.env.SERVER_URL || "http://localhost:5000",
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL || "admin@example.com",
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD || "Admin@12345",
};
