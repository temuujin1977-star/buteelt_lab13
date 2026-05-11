import crypto from "node:crypto";
import { LinkRepository } from "../repositories/linkRepository.js";

const CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 7;

export class LinkValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "LinkValidationError";
  }
}

export class LinkNotFoundError extends Error {
  constructor(message = "Short URL not found") {
    super(message);
    this.name = "LinkNotFoundError";
  }
}

export class LinkExpiredError extends Error {
  constructor(message = "Short URL has expired") {
    super(message);
    this.name = "LinkExpiredError";
  }
}

export function normalizeUrl(input) {
  if (typeof input !== "string" || input.trim() === "") {
    throw new LinkValidationError("url is required");
  }

  let parsed;
  try {
    parsed = new URL(input.trim());
  } catch {
    throw new LinkValidationError("url must be a valid absolute URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new LinkValidationError("url must use http or https");
  }

  return parsed.toString();
}

export function generateShortCode() {
  const bytes = crypto.randomBytes(CODE_LENGTH);

  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export function normalizeExpiration(expiresAt) {
  if (expiresAt === undefined || expiresAt === null || expiresAt === "") {
    return null;
  }

  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) {
    throw new LinkValidationError("expiresAt must be a valid date");
  }

  if (date <= new Date()) {
    throw new LinkValidationError("expiresAt must be in the future");
  }

  return date.toISOString();
}

export function mapLink(row, baseUrl = "") {
  return {
    id: row.id,
    originalUrl: row.original_url,
    shortCode: row.short_code,
    shortUrl: baseUrl ? `${baseUrl}/${row.short_code}` : `/${row.short_code}`,
    clicks: row.clicks,
    expiresAt: row.expires_at,
    createdAt: row.created_at
  };
}

export class LinkService {
  constructor(repository = new LinkRepository()) {
    this.repository = repository;
  }

  async listLinks(baseUrl) {
    const rows = await this.repository.findAll();
    return rows.map((row) => mapLink(row, baseUrl));
  }

  async createLink(payload, baseUrl) {
    const originalUrl = normalizeUrl(payload?.url);
    const expiresAt = normalizeExpiration(payload?.expiresAt);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const shortCode = generateShortCode();
      const existing = await this.repository.findByCode(shortCode);

      if (!existing) {
        const row = await this.repository.create({ originalUrl, shortCode, expiresAt });
        return mapLink(row, baseUrl);
      }
    }

    throw new Error("Could not generate a unique short code");
  }

  async getRedirectTarget(shortCode) {
    const row = await this.repository.findByCode(shortCode);

    if (!row) {
      throw new LinkNotFoundError();
    }

    if (row.expires_at && new Date(row.expires_at) <= new Date()) {
      throw new LinkExpiredError();
    }

    await this.repository.incrementClicks(shortCode);
    return row.original_url;
  }
}
