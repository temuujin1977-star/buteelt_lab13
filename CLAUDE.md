# CLAUDE.md

## Project context

Энэ repository нь F.CSM311 хичээлийн Бие даалт 13 буюу AI-Assisted Software Construction ажлын repository. Сонгосон сэдэв нь REST API, minimal frontend, random short code, click counter, expiration handling бүхий URL shortener project.

## Төлөвлөсөн stack

- Node.js
- Express
- SQLite
- Vanilla HTML/CSS/JS
- Jest эсвэл Vitest
- OpenAPI 3.0

## Build commands

Эдгээр command нь Part B хэрэгжилтийн үед ашиглахаар төлөвлөсөн. Implementation эхлэх үед шаардлагатай бол шинэчилнэ.

```bash
npm install
npm run dev
npm test
```

## Repository conventions

- Part A хэсэгт зөвхөн planning document бичнэ.
- Implementation code-ыг `partB/src/` дотор байрлуулна.
- Test файлуудыг `partB/tests/` дотор байрлуулна.
- AI session summary-г `partA/ai-sessions/` болон `partB/ai-sessions/` дотор хадгална.
- Conventional Commits format ашиглана:
  - `docs:` documentation өөрчлөлт
  - `feat:` шинэ feature
  - `fix:` bug fix
  - `test:` test нэмэх эсвэл засах
  - `refactor:` дотоод бүтэц сайжруулах
  - `chore:` setup болон maintenance

## Part B coding conventions

- Route handler-уудыг аль болох нимгэн байлгана.
- Business logic-ийг service module-д байрлуулна.
- Database query-г repository module-д тусгаарлана.
- User input-ийг database access хийхээс өмнө validate хийнэ.
- SQL query бичихдээ parameterized query ашиглана.
- API response-д зөв HTTP status code буцаана.
- Test бичихдээ зөвхөн happy path биш edge case-уудыг шалгана.

## No-go zones

- Secret, API key, token, password, `.env` файл commit хийхгүй.
- License нь тодорхойгүй code хуулж ашиглахгүй.
- Test fail болсон байхад ignore хийхгүй.
- API error response дээр internal stack trace харуулахгүй.
- AI-generated code-ыг review хийхгүйгээр шууд авахгүй.
- Нэг том code-dump commit хийхгүй.

## AI workflow notes

- AI-г planning, draft generation, test idea, review, refactoring suggestion-д ашиглана.
- AI-ийн output бүрийг human review хийсний дараа л project-д оруулна.
- Чухал AI session-уудыг markdown файлаар товч хадгална.
- Hallucination болон security example-уудыг Part C-ийн AI Usage Report-д ашиглахаар тэмдэглэнэ.
