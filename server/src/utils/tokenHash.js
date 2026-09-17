import crypto from "crypto";

// We never store raw tokens (refresh / verification / reset) in MongoDB.
// Only a SHA-256 hash is stored; the raw value only ever exists in the
// httpOnly cookie / one-time URL sent to the "user".
export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function generateRawToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}
