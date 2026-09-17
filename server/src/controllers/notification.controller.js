import Changelog from "../models/Changelog.model.js";
import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getUnreadCount } from "../services/notification.service.js";

// GET /api/v1/notifications - recent published changelogs for the drawer
export const listNotifications = asyncHandler(async (req, res) => {
  const items = await Changelog.find({ status: "Published" })
    .select("title slug category publishedAt contentMarkdown")
    .sort({ publishedAt: -1 })
    .limit(10);

  // trim markdown to a short description for the drawer
  const withExcerpt = items.map((i) => ({
    id: i._id,
    title: i.title,
    slug: i.slug,
    category: i.category,
    publishedAt: i.publishedAt,
    excerpt: (i.contentMarkdown || "").replace(/[#*`_>\-]/g, "").slice(0, 120),
  }));

  return res.status(200).json(new ApiResponse(withExcerpt, "Notifications fetched"));
});

// GET /api/v1/notifications/unread-count
export const getUnreadCountHandler = asyncHandler(async (req, res) => {
  const unreadCount = await getUnreadCount(req.user);
  return res.status(200).json(new ApiResponse({}, "Unread count", { unreadCount }));
});

// POST /api/v1/notifications/mark-read
// Backend is source of truth: sets lastViewedChangelogDate = server's current time.
export const markAsRead = asyncHandler(async (req, res) => {
  const now = new Date();
  await User.findByIdAndUpdate(req.user._id, { lastViewedChangelogDate: now });
  return res.status(200).json(new ApiResponse({}, "Marked as read", { unreadCount: 0 }));
});
