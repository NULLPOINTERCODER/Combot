import Changelog from "../models/Changelog.model.js";
import Reaction from "../models/Reaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

function buildPagination(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  return { page, limit, skip: (page - 1) * limit };
}

// Attaches reaction counts + this viewer's own reaction (if logged in) to a list of changelogs
async function attachReactionData(changelogs, viewerId) {
  const ids = changelogs.map((c) => c._id);
  const reactions = await Reaction.find({ changelogId: { $in: ids } });

  const countsByChangelog = {};
  const userReactionByChangelog = {};

  for (const r of reactions) {
    countsByChangelog[r.changelogId] ||= { heart: 0, celebrate: 0, rocket: 0 };
    countsByChangelog[r.changelogId][r.type] += 1;
    if (viewerId && r.userId.toString() === viewerId.toString()) {
      userReactionByChangelog[r.changelogId] = r.type;
    }
  }

  return changelogs.map((c) => ({
    ...c.toObject(),
    reactions: countsByChangelog[c._id] || { heart: 0, celebrate: 0, rocket: 0 },
    userReaction: userReactionByChangelog[c._id] || null,
  }));
}

// GET /api/v1/changelog  (public, category filter + pagination, DB-level filtering)
export const listPublicChangelogs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const { page, limit, skip } = buildPagination(req.query);

  const filter = { status: "Published" };
  if (category && category !== "All") filter.category = category;

  const [items, total] = await Promise.all([
    Changelog.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit),
    Changelog.countDocuments(filter),
  ]);

  const withReactions = await attachReactionData(items, req.user?._id);

  return res.status(200).json(
    new ApiResponse(withReactions, "Changelogs fetched", {
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  );
});

// GET /api/v1/changelog/search?q=  (published only, title + content)
export const searchChangelogs = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const { page, limit, skip } = buildPagination(req.query);

  const filter = { status: "Published", $text: { $search: q } };

  const [items, total] = await Promise.all([
    Changelog.find(filter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit),
    Changelog.countDocuments(filter),
  ]);

  const withReactions = await attachReactionData(items, req.user?._id);

  return res.status(200).json(
    new ApiResponse(withReactions, "Search results", {
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  );
});

// GET /api/v1/changelog/feed  (public JSON feed, no auth, no reaction data needed)
export const getPublicFeed = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);

  const filter = { status: "Published" };
  const [items, total] = await Promise.all([
    Changelog.find(filter)
      .select("title slug category contentMarkdown coverImage publishedAt")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit),
    Changelog.countDocuments(filter),
  ]);

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json(
    new ApiResponse(items, "Public changelog feed", {
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  );
});

// GET /api/v1/changelog/:slug (public, single published entry)
export const getChangelogBySlug = asyncHandler(async (req, res) => {
  const changelog = await Changelog.findOne({ slug: req.params.slug, status: "Published" });
  if (!changelog) throw new ApiError(404, "Changelog not found");

  const [withReactions] = await attachReactionData([changelog], req.user?._id);
  return res.status(200).json(new ApiResponse(withReactions, "Changelog fetched"));
});
