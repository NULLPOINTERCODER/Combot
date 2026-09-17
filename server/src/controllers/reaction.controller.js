import Reaction from "../models/Reaction.model.js";
import Changelog from "../models/Changelog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

async function getCounts(changelogId) {
  const rows = await Reaction.aggregate([
    { $match: { changelogId } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);
  const counts = { heart: 0, celebrate: 0, rocket: 0 };
  rows.forEach((r) => (counts[r._id] = r.count));
  return counts;
}

// POST /api/v1/changelog/:id/reactions  { type }
// One reaction per user per changelog (see Reaction.model.js decision note); upsert-style.
export const setReaction = asyncHandler(async (req, res) => {
  const { id: changelogId } = req.params;
  const { type } = req.body;

  const changelog = await Changelog.findOne({ _id: changelogId, status: "Published" });
  if (!changelog) throw new ApiError(404, "Changelog not found");

  await Reaction.findOneAndUpdate(
    { userId: req.user._id, changelogId },
    { type },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const counts = await getCounts(changelog._id);

  return res.status(200).json(
    new ApiResponse({ ...counts, userReaction: type }, "Reaction saved")
  );
});

// DELETE /api/v1/changelog/:id/reactions/:type
export const removeReaction = asyncHandler(async (req, res) => {
  const { id: changelogId, type } = req.params;

  await Reaction.findOneAndDelete({ userId: req.user._id, changelogId, type });

  const counts = await getCounts(changelogId);

  return res.status(200).json(
    new ApiResponse({ ...counts, userReaction: null }, "Reaction removed")
  );
});
