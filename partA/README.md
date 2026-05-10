# URL Shortener

## Төслийн зорилго

Энэ төсөл нь AI-assisted software construction workflow-г жижиг project дээр хэрэгжүүлэх зорилготой. Систем нь урт URL хаягийг богино холбоос болгон хадгалж, богино кодоор дамжуулан эх URL руу redirect хийх, даралтын тоо бүртгэх, мөн optional expiration date шалгах боломжтой байна.

## Төлөвлөсөн stack

- Runtime: Node.js
- Backend: Express
- Database: SQLite
- Frontend: Vanilla HTML/CSS/JS
- Test: Jest эсвэл Vitest
- API documentation: OpenAPI 3.0

## Төлөвлөсөн feature-үүд

1. Урт URL-аас богино холбоос үүсгэх.
2. Богино кодоор эх URL руу redirect хийх.
3. Холбоос бүрийн click count хадгалах.
4. Optional expiration date шалгах.
5. Үүсгэсэн холбоосуудын basic list/detail view харуулах.

## Build

Яг ажиллах command-уудыг Part B хэрэгжилтийн үед эцэслэнэ.

Төлөвлөсөн install command:

```bash
npm install
```

## Run

Development үед ажиллуулах command:

```bash
npm run dev
```

Production маягаар ажиллуулах command:

```bash
npm start
```

## Test

Test ажиллуулах command:

```bash
npm test
```

Unit test-д URL validation, short code generation, expiration handling, redirect behavior, click counting зэрэг edge case-уудыг шалгана.

## Төлөвлөсөн project structure

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
```

## Тайлбар

Энэ README нь Part A-ийн draft хувилбар. Одоогоор implementation эхлээгүй тул build, run, test command-ууд төлөвлөгөө хэлбэртэй байна. Part B дээр working README болгон шинэчилнэ.
