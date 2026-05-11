# Part B README

## Төслийн нэр

URL Shortener

## Товч тайлбар

Энэ хэсэгт URL shortener project-ийн хэрэгжилтийг хийсэн. Систем нь урт URL-ийг богино холбоос болгон хадгалж, богино кодоор original URL руу redirect хийх, click count нэмэх, expiration date шалгах боломжтой.

## Stack

- Node.js
- Express
- SQLite
- Vanilla HTML/CSS/JS
- Vitest
- Supertest

## Install

```bash
npm install
```

## Run

Development mode:

```bash
npm run dev
```

Production-style mode:

```bash
npm start
```

## Test

```bash
npm test
```

## Checkpoint 2 дээр нэмсэн зүйлс

- `POST /api/links` endpoint урт URL авч богино код үүсгэнэ.
- `GET /api/links` endpoint хадгалсан link-үүдийг жагсаана.
- `GET /:shortCode` endpoint original URL руу redirect хийнэ.
- Redirect хийх үед `clicks` тоолуур нэмэгдэнэ.
- `expiresAt` хугацаа дууссан link дээр `410 Gone` буцаана.
- Invalid URL дээр `400 Bad Request` буцаана.
- Unknown short code дээр `404 Not Found` буцаана.
- SQLite database schema болон repository layer нэмсэн.
- Service layer дээр URL validation, expiration validation, short code generation нэмсэн.
- Vitest + Supertest ашигласан 10-аас дээш test нэмсэн.

## API жишээ

Create short URL:

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com\"}"
```

List links:

```bash
curl http://localhost:3000/api/links
```

Redirect:

```bash
curl -I http://localhost:3000/Ab12Cd3
```

## Project structure

```text
partB/
  src/
    app.js
    server.js
    routes/
    services/
    repositories/
    db/
    public/
  tests/
  openapi.yaml
  ai-sessions/
```
