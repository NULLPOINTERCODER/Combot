import request from "supertest";
import app from "../src/app.js";
import { setupTestDB, teardownTestDB } from "./setup.js";
import User from "../src/models/User.model.js";
import Changelog from "../src/models/Changelog.model.js";

beforeAll(async () => setupTestDB());
afterAll(async () => teardownTestDB());

let userCookies;

beforeAll(async () => {
  const admin = await User.create({ name: "Admin", email: "admin3@test.com", password: "Admin@12345", role: "admin" });

  await Changelog.create({
    title: "Old Release",
    slug: "old-release",
    category: "New",
    status: "Published",
    publishedAt: new Date("2026-09-01"),
    createdBy: admin._id,
  });
  await Changelog.create({
    title: "New Release",
    slug: "new-release",
    category: "New",
    status: "Published",
    publishedAt: new Date("2026-09-15"),
    createdBy: admin._id,
  });

  await User.create({
    name: "Notif User",
    email: "notifuser@test.com",
    password: "User@12345",
    lastViewedChangelogDate: new Date("2026-09-10"),
  });

  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "notifuser@test.com", password: "User@12345" });
  userCookies = loginRes.headers["set-cookie"];
});

describe("Unread count + mark as read", () => {
  test("counts only releases published after lastViewedChangelogDate", async () => {
    const res = await request(app)
      .get("/api/v1/notifications/unread-count")
      .set("Cookie", userCookies);
    expect(res.status).toBe(200);
    expect(res.body.unreadCount).toBe(1); // only "New Release" (09-15) is after 09-10
  });

  test("mark-read resets unread count to 0", async () => {
    const markRes = await request(app)
      .post("/api/v1/notifications/mark-read")
      .set("Cookie", userCookies);
    expect(markRes.body.unreadCount).toBe(0);

    const res = await request(app)
      .get("/api/v1/notifications/unread-count")
      .set("Cookie", userCookies);
    expect(res.body.unreadCount).toBe(0);
  });
});
