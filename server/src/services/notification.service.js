import Changelog from "../models/Changelog.model.js";

// Section 18 UNREAD ALGORITHM.
// Decision (documented in README): a brand-new user (lastViewedChangelogDate = null)
// is treated as having viewed nothing -> ALL currently published releases count as unread.
// This is simpler to reason about than "initialize at signup" and matches how
// Headway/Beamer-style widgets behave for first-time visitors.
export async function getUnreadCount(user) {
  const filter = { status: "Published" };
  if (user.lastViewedChangelogDate) {
    filter.publishedAt = { $gt: user.lastViewedChangelogDate };
  }
  return Changelog.countDocuments(filter);
}
