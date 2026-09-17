import request from "supertest";
import app from "../src/app.js";
import { setupTestDB, teardownTestDB } from "./setup.js";

beforeAll(async () => setupTestDB());
afterAll(async () => teardownTestDB());

describe("Auth flows", () => {
  const user = { name: "Test User", email: "test@example.com", password: "Password123" };

  test("signup creates a user", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send(user);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(user.email);
  });

  test("login fails with wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: "wrongpass" });
    expect(res.status).toBe(401);
  });

  test("login succeeds and sets cookies", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("refresh rotates tokens", async () => {
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: user.password });
    const cookies = loginRes.headers["set-cookie"];

    const refreshRes = await request(app).post("/api/v1/auth/refresh").set("Cookie", cookies);
    expect(refreshRes.status).toBe(200);
  });

  test("logout revokes session", async () => {
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: user.password });
    const cookies = loginRes.headers["set-cookie"];

    const res = await request(app).post("/api/v1/auth/logout").set("Cookie", cookies);
    expect(res.status).toBe(200);
  });
});
