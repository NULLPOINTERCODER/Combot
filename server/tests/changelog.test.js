import request from "supertest";
import app from "../src/app.js";
import { setupTestDB, teardownTestDB } from "./setup.js";
import User from "../src/models/User.model.js";

beforeAll(async () => setupTestDB());
afterAll(async () => teardownTestDB());

let adminCookies;

async function loginAsAdmin() {
  await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: "Admin@12345",
    role: "admin",
    isEmailVerified: true,
  });
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "admin@test.com", password: "Admin@12345" });
  return res.headers["set-cookie"];
}

beforeAll(async () => {
  adminCookies = await loginAsAdmin();
});

describe("Changelog CRUD + visibility", () => {
  let changelogId;

  test("admin can create a draft", async () => {
    const res = await request(app)
      .post("/api/v1/admin/changelogs")
      .set("Cookie", adminCookies)
      .send({ title: "Test Release", category: "New", status: "Draft", contentMarkdown: "hello" });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("Draft");
    changelogId = res.body.data._id;
  });

  test("draft is not visible on public timeline", async () => {
    const res = await request(app).get("/api/v1/changelog");
    const titles = res.body.data.map((c) => c.title);
    expect(titles).not.toContain("Test Release");
  });

  test("admin can publish the changelog", async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/changelogs/${changelogId}/publish`)
      .set("Cookie", adminCookies);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("Published");
  });

  test("published changelog is visible publicly", async () => {
    const res = await request(app).get("/api/v1/changelog");
    const titles = res.body.data.map((c) => c.title);
    expect(titles).toContain("Test Release");
  });

  test("category filter works at DB level", async () => {
    const res = await request(app).get("/api/v1/changelog?category=New");
    res.body.data.forEach((c) => expect(c.category).toBe("New"));
  });

  test("non-admin cannot create changelog", async () => {
    const res = await request(app)
      .post("/api/v1/admin/changelogs")
      .send({ title: "Hack Attempt", category: "New" });
    expect(res.status).toBe(401);
  });
});
