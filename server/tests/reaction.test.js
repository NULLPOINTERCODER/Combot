import request from "supertest";
import app from "../src/app.js";
import { setupTestDB, teardownTestDB } from "./setup.js";
import User from "../src/models/User.model.js";
import Changelog from "../src/models/Changelog.model.js";

beforeAll(async () => setupTestDB());
afterAll(async () => teardownTestDB());

let userCookies;
let changelogId;

beforeAll(async () => {
  const admin = await User.create({
    name: "Admin",
    email: "admin2@test.com",
    password: "Admin@12345",
    role: "admin",
  });
  const changelog = await Changelog.create({
    title: "Reactable Release",
    slug: "reactable-release",
    category: "New",
    contentMarkdown: "content",
    status: "Published",
    publishedAt: new Date(),
    createdBy: admin._id,
  });
  changelogId = changelog._id.toString();

  await User.create({ name: "User", email: "user2@test.com", password: "User@12345" });
  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "user2@test.com", password: "User@12345" });
  userCookies = loginRes.headers["set-cookie"];
});

describe("Reaction uniqueness", () => {
  test("user can react", async () => {
    const res = await request(app)
      .post(`/api/v1/changelog/${changelogId}/reactions`)
      .set("Cookie", userCookies)
      .send({ type: "heart" });
    expect(res.status).toBe(200);
    expect(res.body.data.heart).toBe(1);
    expect(res.body.data.userReaction).toBe("heart");
  });

  test("reacting again changes the reaction instead of duplicating", async () => {
    const res = await request(app)
      .post(`/api/v1/changelog/${changelogId}/reactions`)
      .set("Cookie", userCookies)
      .send({ type: "rocket" });
    expect(res.status).toBe(200);
    expect(res.body.data.heart).toBe(0);
    expect(res.body.data.rocket).toBe(1);
  });
});
