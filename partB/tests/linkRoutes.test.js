import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { openDatabase } from "../src/db/database.js";
import { LinkRepository } from "../src/repositories/linkRepository.js";
import { LinkService } from "../src/services/linkService.js";

function createTestApp() {
  const repository = new LinkRepository(openDatabase(":memory:"));
  const service = new LinkService(repository);
  return createApp({ service });
}

describe("link API", () => {
  it("creates and lists short links", async () => {
    const app = createTestApp();

    const createResponse = await request(app)
      .post("/api/links")
      .send({ url: "https://example.com/docs" })
      .expect(201);

    expect(createResponse.body.link).toMatchObject({
      originalUrl: "https://example.com/docs",
      clicks: 0
    });
    expect(createResponse.body.link.shortCode).toHaveLength(7);

    const listResponse = await request(app).get("/api/links").expect(200);
    expect(listResponse.body.links).toHaveLength(1);
    expect(listResponse.body.links[0].shortCode).toBe(createResponse.body.link.shortCode);
  });

  it("creates a short link with a custom code", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post("/api/links")
      .send({ url: "https://example.com/custom", customCode: "docs-2026" })
      .expect(201);

    expect(response.body.link).toMatchObject({
      originalUrl: "https://example.com/custom",
      shortCode: "docs-2026"
    });
  });

  it("returns 409 for duplicate custom codes", async () => {
    const app = createTestApp();

    await request(app)
      .post("/api/links")
      .send({ url: "https://example.com/one", customCode: "duplicate" })
      .expect(201);

    const response = await request(app)
      .post("/api/links")
      .send({ url: "https://example.com/two", customCode: "duplicate" })
      .expect(409);

    expect(response.body.error).toBe("Short code is already in use");
  });

  it("redirects to the original URL and increments clicks", async () => {
    const app = createTestApp();
    const createResponse = await request(app)
      .post("/api/links")
      .send({ url: "https://example.com/target" });
    const { shortCode } = createResponse.body.link;

    await request(app)
      .get(`/${shortCode}`)
      .expect(302)
      .expect("Location", "https://example.com/target");

    const listResponse = await request(app).get("/api/links");
    expect(listResponse.body.links[0].clicks).toBe(1);
  });

  it("rejects invalid URLs", async () => {
    const app = createTestApp();

    const response = await request(app).post("/api/links").send({ url: "not-a-url" }).expect(400);

    expect(response.body.error).toBe("url must be a valid absolute URL");
  });

  it("returns link stats by short code", async () => {
    const app = createTestApp();
    await request(app)
      .post("/api/links")
      .send({ url: "https://example.com/stats", customCode: "stats-api" });

    const response = await request(app).get("/api/links/stats-api").expect(200);

    expect(response.body.link).toMatchObject({
      originalUrl: "https://example.com/stats",
      shortCode: "stats-api",
      clicks: 0
    });
  });

  it("deletes a short link", async () => {
    const app = createTestApp();
    await request(app)
      .post("/api/links")
      .send({ url: "https://example.com/delete", customCode: "delete-api" });

    await request(app).delete("/api/links/delete-api").expect(204);
    await request(app).get("/delete-api").expect(404);
  });

  it("returns 410 for expired links", async () => {
    const repository = new LinkRepository(openDatabase(":memory:"));
    await repository.create({
      originalUrl: "https://example.com/old",
      shortCode: "old1234",
      expiresAt: "2020-01-01T00:00:00.000Z"
    });
    const app = createApp({ service: new LinkService(repository) });

    const response = await request(app).get("/old1234").expect(410);
    expect(response.body.error).toBe("Short URL has expired");
  });
});
