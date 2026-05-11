# ADR-001: URL shortener project-д ашиглах stack сонголт

## Status

Accepted

## Context

Бие даалт 13-ын Part A хэсэгт жижиг project сонгож, код бичихээс өмнө архитектур, stack, directory structure, README draft, CLAUDE.md болон ADR гаргах шаардлагатай. Сонгосон project нь URL shortener бөгөөд дараах үндсэн feature-үүдтэй байна.

- Урт URL-аас богино холбоос үүсгэх
- Богино кодоор original URL руу redirect хийх
- Click count бүртгэх
- Optional expiration date шалгах
- Minimal frontend-оор form болон result харуулах

Project нь жижиг scope-той боловч REST API, database, validation, test, OpenAPI documentation шаардлагатай. Иймээс stack сонгохдоо implementation-ийг хэт хүндрүүлэхгүй, test бичихэд эвтэйхэн, API endpoint-уудыг цэвэр зохион байгуулах боломжтой байхыг гол шалгуур болгосон.

Харьцуулсан stack-ууд:

1. Node.js + Express + SQLite + Vanilla HTML/CSS/JS
2. Python + FastAPI + SQLite + Jinja2
3. React + Vite + Node.js/Express + SQLite

## Decision

Энэ project-д **Node.js + Express + SQLite + Vanilla HTML/CSS/JS** stack ашиглахаар шийдсэн.

## Rationale

Express нь REST API хийхэд энгийн бөгөөд URL shortener-ийн endpoint-уудыг хурдан, ойлгомжтой зохион байгуулах боломжтой. SQLite нь local development-д database server шаардахгүй тул энэ бие даалтын жижиг project-д тохиромжтой. Minimal frontend шаардлагатай учраас Vanilla HTML/CSS/JS хангалттай бөгөөд React зэрэг нэмэлт framework ашигласнаас tooling complexity бага байна.

FastAPI нь OpenAPI-г автоматаар үүсгэдэг давуу талтай боловч frontend болон Python environment setup дээр нэмэлт шийдвэрүүд гарна. React + Express хувилбар нь UI тал дээр хүчтэй боловч энэ project-ийн scope-д хэт томдож, Part B дээр feature implementation болон test-ээс илүү setup-д цаг алдах эрсдэлтэй.

Иймээс backend-first, энгийн, test хийх боломжтой stack сонгосон.

## Consequences

### Давуу үр дагавар

- REST API endpoint-уудыг хурдан хөгжүүлнэ.
- SQLite ашигласнаар local setup энгийн байна.
- Minimal frontend-г frameworkгүйгээр хийх боломжтой.
- Jest эсвэл Vitest ашиглан unit test бичих боломжтой.
- OpenAPI 3.0 spec-ийг гараар эсвэл package ашиглан гаргаж болно.

### Сул тал / Эрсдэл

- TypeScript ашиглахгүй бол зарим алдаа runtime үед илэрч магадгүй.
- Validation, error handling, security middleware-ийг өөрөө анхаарч тохируулах шаардлагатай.
- Project томорвол Express structure-ийг сахихгүй бол эмх замбараагүй болох эрсдэлтэй.

## Follow-up

Part B эхлэх үед дараах зүйлсийг баталгаажуулна.

- `partB/src/` дотор route, service, repository layer-ийг тусгаарлах
- SQLite schema-г тодорхойлох
- URL validation болон expiration logic-д test бичих
- API endpoint-уудыг `partB/openapi.yaml` дээр баримтжуулах
