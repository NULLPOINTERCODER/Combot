import Changelog from "../models/Changelog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateUniqueSlug } from "../utils/slugify.js";

// GET /api/v1/admin/changelogs  (admin: all statuses, table view)
export const adminListChangelogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Changelog.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Changelog.countDocuments({}),
  ]);

  const [publishedCount, draftCount] = await Promise.all([
    Changelog.countDocuments({ status: "Published" }),
    Changelog.countDocuments({ status: "Draft" }),
  ]);

  return res.status(200).json(
    new ApiResponse(items, "Admin changelog list", {
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: { total, publishedCount, draftCount },
    })
  );
});

export const adminGetChangelog = asyncHandler(async (req, res) => {
  const changelog = await Changelog.findById(req.params.id);
  if (!changelog) throw new ApiError(404, "Changelog not found");
  return res.status(200).json(new ApiResponse(changelog, "Changelog fetched"));
});

// POST /api/v1/admin/changelogs - createdBy is ALWAYS derived from req.user, never from body
export const adminCreateChangelog = asyncHandler(async (req, res) => {
  const { title, category, status, contentMarkdown, coverImage } = req.body;

  if (status === "Published" && !contentMarkdown) {
    throw new ApiError(422, "Content is required to publish a changelog");
  }

  const slug = await generateUniqueSlug(title, (candidate) =>
    Changelog.exists({ slug: candidate })
  );

  const changelog = await Changelog.create({
    title,
    slug,
    category,
    contentMarkdown: contentMarkdown || "",
    coverImage: coverImage || null,
    status: status || "Draft",
    publishedAt: status === "Published" ? new Date() : null,
    createdBy: req.user._id, // never trust body
  });

  return res.status(201).json(new ApiResponse(changelog, "Changelog created"));
});

export const adminUpdateChangelog = asyncHandler(async (req, res) => {
  const changelog = await Changelog.findById(req.params.id);
  if (!changelog) throw new ApiError(404, "Changelog not found");

  const { title, category, status, contentMarkdown, coverImage } = req.body;

  if (title && title !== changelog.title) {
    changelog.slug = await generateUniqueSlug(title, async (candidate) => {
      if (candidate === changelog.slug) return false;
      return Changelog.exists({ slug: candidate });
    });
    changelog.title = title;
  }

  if (category) changelog.category = category;
  if (typeof contentMarkdown === "string") changelog.contentMarkdown = contentMarkdown;
  if (coverImage !== undefined) changelog.coverImage = coverImage;

  if (status && status !== changelog.status) {
    if (status === "Published") {
      if (!changelog.contentMarkdown) throw new ApiError(422, "Content is required to publish");
      changelog.publishedAt = new Date();
    }
    if (status === "Draft") {
      changelog.publishedAt = null;
    }
    changelog.status = status;
  }

  await changelog.save();
  return res.status(200).json(new ApiResponse(changelog, "Changelog updated"));
});

export const adminDeleteChangelog = asyncHandler(async (req, res) => {
  const changelog = await Changelog.findByIdAndDelete(req.params.id);
  if (!changelog) throw new ApiError(404, "Changelog not found");
  return res.status(204).send();
});

export const adminPublishChangelog = asyncHandler(async (req, res) => {
  const changelog = await Changelog.findById(req.params.id);
  if (!changelog) throw new ApiError(404, "Changelog not found");
  if (!changelog.contentMarkdown) throw new ApiError(422, "Content is required to publish");

  changelog.status = "Published";
  changelog.publishedAt = new Date();
  await changelog.save();

  return res.status(200).json(new ApiResponse(changelog, "Changelog published"));
});

export const adminUnpublishChangelog = asyncHandler(async (req, res) => {
  const changelog = await Changelog.findById(req.params.id);
  if (!changelog) throw new ApiError(404, "Changelog not found");

  changelog.status = "Draft";
  changelog.publishedAt = null;
  await changelog.save();

  return res.status(200).json(new ApiResponse(changelog, "Changelog moved back to draft"));
});
