import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, env.UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(16).toString("hex");
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new ApiError(400, "Only jpg, jpeg, png and webp images are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

const router = Router();

router.post("/", authenticateUser, requireAdmin, upload.single("image"), uploadImage);

export default router;
