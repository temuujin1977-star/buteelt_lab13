import { describe, expect, it } from "vitest";
import { LinkRepository } from "../src/repositories/linkRepository.js";
import {
  LinkConflictError,
  LinkExpiredError,
  LinkNotFoundError,
  LinkService,
  LinkValidationError,
  generateShortCode,
  normalizeCustomCode,
  normalizeExpiration,
  normalizeUrl
} from "../src/services/linkService.js";
import { openDatabase } from "../src/db/database.js";

describe("link service helpers", () => {
  it("normalizes valid http URLs", () => {
    expect(normalizeUrl(" https://example.com/path ")).toBe("https://example.com/path");
  });

  it("normalizes valid https URLs with query strings", () => {
    expect(normalizeUrl("https://example.com/search?q=test")).toBe("https://example.com/search?q=test");
  });

  it("rejects non-http URLs", () => {
    expect(() => normalizeUrl("ftp://example.com/file")).toThrow(LinkValidationError);
  });

  it("rejects empty URLs", () => {
    expect(() => normalizeUrl("   ")).toThrow(LinkValidationError);
  });

  it("generates seven character short codes", () => {
    expect(generateShortCode()).toHaveLength(7);
  });

  it("rejects past expiration dates", () => {
    expect(() => normalizeExpiration("2020-01-01T00:00:00.000Z")).toThrow(LinkValidationError);
  });

  it("accepts empty expiration as no expiration", () => {
    expect(normalizeExpiration("")).toBeNull();
  });

  it("accepts safe custom short codes", () => {
    expect(normalizeCustomCode(" my-code_123 ")).toBe("my-code_123");
  });

  it("rejects unsafe custom short codes", () => {
    expect(() => normalizeCustomCode("../admin")).toThrow(LinkValidationError);
  });
});

describe("link repository", () => {
  it("creates and lists links with click counts", async () => {
    const repository = new LinkRepository(openDatabase(":memory:"));
    await repository.create({
      originalUrl: "https://example.com",
      shortCode: "abc1234"
    });
    await repository.incrementClicks("abc1234");

    const links = await repository.findAll();

    expect(links).toHaveLength(1);
    expect(links[0]).toMatchObject({
      original_url: "https://example.com",
      short_code: "abc1234",
      clicks: 1
    });
  });

  it("deletes links by short code", async () => {
    const repository = new LinkRepository(openDatabase(":memory:"));
    await repository.create({
      originalUrl: "https://example.com/delete",
      shortCode: "delete1"
    });

    await expect(repository.deleteByCode("delete1")).resolves.toBe(true);
    await expect(repository.findByCode("delete1")).resolves.toBeUndefined();
  });
});

describe("link service", () => {
  it("throws not found error for unknown short codes", async () => {
    const service = new LinkService(new LinkRepository(openDatabase(":memory:")));

    await expect(service.getRedirectTarget("missing")).rejects.toThrow(LinkNotFoundError);
  });

  it("throws expired error for expired short codes", async () => {
    const repository = new LinkRepository(openDatabase(":memory:"));
    await repository.create({
      originalUrl: "https://example.com/expired",
      shortCode: "expired",
      expiresAt: "2020-01-01T00:00:00.000Z"
    });
    const service = new LinkService(repository);

    await expect(service.getRedirectTarget("expired")).rejects.toThrow(LinkExpiredError);
  });

  it("creates links with a custom short code", async () => {
    const service = new LinkService(new LinkRepository(openDatabase(":memory:")));

    const link = await service.createLink({
      url: "https://example.com/custom",
      customCode: "custom-1"
    });

    expect(link).toMatchObject({
      originalUrl: "https://example.com/custom",
      shortCode: "custom-1"
    });
  });

  it("rejects duplicate custom short codes", async () => {
    const service = new LinkService(new LinkRepository(openDatabase(":memory:")));
    await service.createLink({
      url: "https://example.com/first",
      customCode: "same-code"
    });

    await expect(
      service.createLink({
        url: "https://example.com/second",
        customCode: "same-code"
      })
    ).rejects.toThrow(LinkConflictError);
  });

  it("returns stats for an existing short code", async () => {
    const service = new LinkService(new LinkRepository(openDatabase(":memory:")));
    await service.createLink({
      url: "https://example.com/stats",
      customCode: "stats-1"
    });

    const link = await service.getLinkStats("stats-1", "http://localhost:3000");

    expect(link).toMatchObject({
      shortCode: "stats-1",
      shortUrl: "http://localhost:3000/stats-1"
    });
  });
});
