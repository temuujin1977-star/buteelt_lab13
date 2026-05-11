import { openDatabase } from "../db/database.js";

export class LinkRepository {
  constructor(dbPromise = openDatabase()) {
    this.dbPromise = dbPromise;
  }

  async findAll() {
    const db = await this.dbPromise;
    return db.all(
      `SELECT id, original_url, short_code, clicks, expires_at, created_at
       FROM links
       ORDER BY created_at DESC, id DESC`
    );
  }

  async findByCode(shortCode) {
    const db = await this.dbPromise;
    return db.get(
      `SELECT id, original_url, short_code, clicks, expires_at, created_at
       FROM links
       WHERE short_code = ?`,
      shortCode
    );
  }

  async create({ originalUrl, shortCode, expiresAt = null }) {
    const db = await this.dbPromise;
    await db.run(
      `INSERT INTO links (original_url, short_code, expires_at)
       VALUES (?, ?, ?)`,
      originalUrl,
      shortCode,
      expiresAt
    );

    return this.findByCode(shortCode);
  }

  async incrementClicks(shortCode) {
    const db = await this.dbPromise;
    await db.run(
      `UPDATE links
       SET clicks = clicks + 1
       WHERE short_code = ?`,
      shortCode
    );

    return this.findByCode(shortCode);
  }

  async deleteByCode(shortCode) {
    const db = await this.dbPromise;
    const result = await db.run(
      `DELETE FROM links
       WHERE short_code = ?`,
      shortCode
    );

    return result.changes > 0;
  }
}
