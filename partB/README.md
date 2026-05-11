# Part B README

## Төслийн нэр

URL Shortener

## Товч тайлбар

Энэ хэсэгт URL shortener project-ийн хэрэгжилтийг хийсэн. Систем нь урт URL-ийг богино холбоос болгон хадгалж, богино кодоор original URL руу redirect хийх, click count нэмэх, expiration date шалгах, custom short code ашиглах, link-ийн stats харах болон link устгах боломжтой.

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

## Checkpoint 2 дээр хийсэн зүйлс

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

## Checkpoint 3 дээр нэмсэн зүйлс

- Custom short code: хэрэглэгч `customCode` өгвөл өөрийн хүссэн богино кодтой link үүсгэнэ.
- Duplicate custom code хамгаалалт: давхардсан custom code дээр `409 Conflict` буцаана.
- Stats endpoint: `GET /api/links/:shortCode` тухайн link-ийн original URL, short URL, clicks, created/expiration мэдээллийг буцаана.
- Delete endpoint: `DELETE /api/links/:shortCode` богино link-ийг устгана.
- Frontend дээр custom code оруулах талбар болон delete товч нэмсэн.
- OpenAPI spec-ийг checkpoint 3 endpoint-уудаар шинэчилсэн.
- Unit/API test-үүдийг 20+ case болгон өргөтгөсөн.

## API жишээ

Create short URL:

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com\"}"
```

Create custom short URL:

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com/docs\",\"customCode\":\"my-docs\"}"
```

List links:

```bash
curl http://localhost:3000/api/links
```

Get stats:

```bash
curl http://localhost:3000/api/links/my-docs
```

Delete link:

```bash
curl -X DELETE http://localhost:3000/api/links/my-docs
```

Redirect:

```bash
curl -I http://localhost:3000/my-docs
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
