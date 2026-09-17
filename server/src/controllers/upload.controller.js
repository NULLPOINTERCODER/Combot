import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// POST /api/v1/uploads - multer has already validated type/size and saved the file (see routes)
// Returns a relative path; MongoDB stores only this string, never binary data.
// Abstracted so swapping to Cloudinary/S3 later only touches this controller + upload.routes.js.
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");

  const relativePath = `/uploads/${req.file.filename}`;

  return res.status(201).json(new ApiResponse({ url: relativePath }, "Image uploaded"));
});
