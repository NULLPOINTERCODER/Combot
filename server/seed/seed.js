import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import User from "../src/models/User.model.js";
import Changelog from "../src/models/Changelog.model.js";
import Reaction from "../src/models/Reaction.model.js";
import { slugify } from "../src/utils/slugify.js";

async function seed() {
  await connectDB();
  console.log("[seed] clearing existing data...");
  await Promise.all([User.deleteMany({}), Changelog.deleteMany({}), Reaction.deleteMany({})]);

  console.log("[seed] creating users...");
  const admin = await User.create({
    name: "Admin User",
    email: env.SEED_ADMIN_EMAIL,
    password: env.SEED_ADMIN_PASSWORD,
    role: "admin",
    isEmailVerified: true,
  });

  const alice = await User.create({
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "User@12345",
    role: "user",
    isEmailVerified: true,
  });

  const bob = await User.create({
    name: "Bob Smith",
    email: "bob@example.com",
    password: "User@12345",
    role: "user",
    isEmailVerified: true,
    lastViewedChangelogDate: new Date("2026-09-10"),
  });

  console.log("[seed] creating changelogs...");
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const entries = [
    { title: "Introducing Dark Mode", category: "New", days: -6, status: "Published",
      content: "# Introducing Dark Mode\n\nWe just launched a full dark mode across the app.\n\n## Improvements\n\n* Easier on the eyes at night\n* Automatically follows system theme\n\n```javascript\nconsole.log('dark mode enabled');\n```" },
    { title: "Faster Dashboard Loading", category: "Improved", days: -5, status: "Published",
      content: "# Faster Dashboard Loading\n\nDashboard now loads **60% faster** thanks to query optimizations." },
    { title: "Fixed Notification Bell Glitch", category: "Fixed", days: -4, status: "Published",
      content: "# Fixed Notification Bell Glitch\n\nThe unread badge no longer gets stuck at a stale count." },
    { title: "New Emoji Reactions", category: "New", days: -3, status: "Published",
      content: "# New Emoji Reactions\n\nReact to any release with ❤️, 🎉 or 🚀." },
    { title: "Improved Search Relevance", category: "Improved", days: -2, status: "Published",
      content: "# Improved Search Relevance\n\nSearch now ranks results by text relevance instead of recency alone." },
    { title: "Fixed Slug Collisions", category: "Fixed", days: -1, status: "Published",
      content: "# Fixed Slug Collisions\n\nDuplicate titles now generate unique slugs automatically." },
    { title: "Public JSON Feed Launched", category: "New", days: 0, status: "Published",
      content: "# Public JSON Feed\n\nSubscribe to `/api/v1/changelog/feed` to consume updates programmatically." },
    { title: "Upcoming: Team Mentions", category: "New", days: 1, status: "Draft",
      content: "# Team Mentions (WIP)\n\nMention teammates in release notes. Coming soon." },
    { title: "Upcoming: CSV Export", category: "Improved", days: 2, status: "Draft",
      content: "# CSV Export (WIP)\n\nExport changelog history as CSV." },
  ];

  const created = [];
  for (const e of entries) {
    const slug = slugify(e.title);
    const publishedAt = e.status === "Published" ? new Date(now + e.days * day) : null;
    const doc = await Changelog.create({
      title: e.title,
      slug,
      category: e.category,
      contentMarkdown: e.content,
      status: e.status,
      publishedAt,
      createdBy: admin._id,
    });
    created.push(doc);
  }

  console.log("[seed] creating reactions...");
  const published = created.filter((c) => c.status === "Published");
  await Reaction.create({ userId: alice._id, changelogId: published[0]._id, type: "heart" });
  await Reaction.create({ userId: bob._id, changelogId: published[0]._id, type: "rocket" });
  await Reaction.create({ userId: alice._id, changelogId: published[3]._id, type: "celebrate" });

  console.log("\n[seed] Done!");
  console.log(`  Admin:  ${env.SEED_ADMIN_EMAIL} / ${env.SEED_ADMIN_PASSWORD}`);
  console.log(`  User:   alice@example.com / User@12345`);
  console.log(`  User:   bob@example.com / User@12345 (has lastViewedChangelogDate set)`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
