# ADR-002: URL shortener-ийн business logic-ийг route/service/repository layer-д салгах шийдвэр

## Status

Accepted

## Context

Part B дээр URL shortener project-ийн үндсэн feature-үүдийг хэрэгжүүлэх үед эхэндээ бүх logic-ийг Express route дотор шууд бичих боломжтой байсан. Project жижиг учраас `POST /api/links`, `GET /api/links`, `GET /:shortCode` зэрэг endpoint-уудыг нэг файлд бичвэл хурдан харагдаж магадгүй. Гэхдээ даалгаврын шаардлагад 3-аас дээш feature, 10-аас дээш test, OpenAPI documentation, AI session log, review/test workflow зэрэг зүйлс байсан. Иймээс эхний хурдан шийдлээс илүү шалгахад амар, алдаа гарахад тусгаарлаж засах боломжтой бүтэц хэрэгтэй болсон.

Build явцад дараах feature-үүд нэмэгдсэн.

- Урт URL-ээс богино URL үүсгэх.
- Хадгалсан link-үүдийг жагсаах.
- Богино code-оор original URL руу redirect хийх.
- Redirect хийх бүрт click count нэмэх.
- Expiration date шалгах.
- Custom short code үүсгэх.
- Duplicate custom code дээр `409 Conflict` буцаах.
- Link stats харах.
- Link устгах.

Эдгээр feature бүгдийг route дотор бичвэл route file request/response, validation, database query, business rule, error mapping зэрэг олон хариуцлагатай болох байсан. Энэ нь AI-аар generated code авах үед ч эрсдэлтэй. Учир нь AI нэг endpoint нэмэхдээ өмнөх logic-ийг давхар бичих, validation-ийг мартуулах, эсвэл database query-г route дотор тарааж бичих магадлалтай.

Тиймээс Part B-ийн build явцад нэг чухал архитектурын шийдвэр гаргасан: Express route нь HTTP request/response-оо, service layer нь business logic болон validation-аа, repository layer нь SQLite query-гээ тус тус хариуцах.

## Decision

URL shortener-ийн implementation-д **route/service/repository layer separation** ашиглахаар шийдсэн.

Сонгосон бүтэц:

- `partB/src/routes/linkRoutes.js`: HTTP endpoint, status code, response body, error mapping.
- `partB/src/services/linkService.js`: URL validation, expiration validation, custom code validation, short code generation, business rule.
- `partB/src/repositories/linkRepository.js`: SQLite query, create/find/list/increment/delete operation.
- `partB/src/db/database.js`: database connection болон schema initialization.
- `partB/tests/linkService.test.js`: service helper, repository behavior, business rule test.
- `partB/tests/linkRoutes.test.js`: API endpoint behavior test.

Энэ шийдвэрийн дагуу route file database-тэй шууд харьцахгүй. Service file Express response объект мэдэхгүй. Repository file HTTP status code мэдэхгүй. Ингэснээр давхарга бүр нэг тодорхой үүрэгтэй болсон.

## Rationale

Энэ шийдвэрийг сонгосон гол шалтгаан нь test хийхэд амар байдал байсан. Жишээ нь `normalizeUrl`, `normalizeExpiration`, `normalizeCustomCode` зэрэг validation helper-үүдийг Express server асаахгүйгээр шууд unit test хийж болно. Мөн `LinkService.getRedirectTarget()` method нь expired link дээр `LinkExpiredError`, unknown code дээр `LinkNotFoundError` шидэж байгаа эсэхийг route-оос тусад нь шалгаж болно.

Repository layer тусдаа байгаа нь SQLite query-г нэг газарт төвлөрүүлсэн. Энэ нь SQL injection эрсдэлийг багасгахад тус болсон, учир нь query-үүд parameter binding ашиглаж байна. Хэрэв query олон route дотор тарсан бол нэг endpoint дээр string interpolation ашиглах алдаа гарч магадгүй байсан.

Route layer тусдаа байгаа нь HTTP response code-уудыг нэг газарт mapping хийх боломж өгсөн. Жишээ нь:

- `LinkValidationError` -> `400 Bad Request`
- `LinkConflictError` -> `409 Conflict`
- `LinkNotFoundError` -> `404 Not Found`
- `LinkExpiredError` -> `410 Gone`

Энэ mapping service layer дотор байхгүй тул business logic нь HTTP framework-ээс бага хамааралтай болсон.

AI ашигласан талаас энэ шийдвэр илүү чухал байсан. AI-аар feature нэмүүлэхэд "энэ endpoint дээр ийм logic нэм" гэж хэлэхээс илүү "service дээр business logic нэм, route дээр status mapping нэм, repository дээр query нэм" гэж хувааж хянах нь илүү найдвартай. AI-ийн гаргасан code буруу байвал аль layer дээр алдаа гарсныг test-ээр илүү хурдан олж болно.

## Considered Options

### Option 1: Бүх logic-ийг Express route дотор бичих

Энэ хувилбар хамгийн хурдан эхлэх боломжтой. Жижиг demo project дээр ажиллаж магадгүй. Гэхдээ validation, database query, redirect logic, error response нэг файлд холилдох тул test бичихэд төвөгтэй. Мөн Part B checkpoint-ууд ахих тусам custom code, stats, delete зэрэг feature нэмэгдэхэд route file хэт томрох байсан.

### Option 2: Зөвхөн route болон repository layer ашиглах

Энэ хувилбарт route нь business logic-оо өөрөө хариуцаж, repository нь зөвхөн database query хийх байсан. Энэ нь эхний хувилбараас дээр боловч validation болон business rule route дотор үлдэнэ. Жишээ нь expiration шалгах logic API route-той хэт холбогдож, service-level unit test хийхэд хүндрэлтэй болно.

### Option 3: Route/service/repository layer ашиглах

Энэ хувилбарыг сонгосон. Project жижиг боловч даалгаврын test, review, OpenAPI, AI usage reflection шаардлагад хамгийн тохиромжтой байсан. Давхарга нэмэгдсэнээр файл олон болсон ч code унших, test бичих, AI output шалгах ажил илүү цэгцтэй болсон.

## Consequences

### Давуу тал

- Business logic route-оос тусдаа болсон.
- Validation helper-үүдийг unit test хийхэд амар болсон.
- API endpoint behavior-ийг Supertest ашиглаж тусад нь шалгах боломжтой болсон.
- SQLite query нэг repository layer-д төвлөрсөн.
- Error-to-status mapping ойлгомжтой болсон.
- AI-аар нэмүүлсэн code-г layer бүрээр review хийх боломжтой болсон.
- OpenAPI documentation endpoint structure-тэй илүү амар таарсан.

### Сул тал / Эрсдэл

- Жижиг project-д файл олон болсон мэт харагдана.
- Нэг feature нэмэхэд route, service, repository, test зэрэг хэд хэдэн файл өөрчлөгдөх боломжтой.
- Layer boundary-г цаашид баримтлахгүй бол бүтэц эвдэрч магадгүй.
- TypeScript ашиглаагүй тул object shape алдааг runtime/test дээр л барина.

## AI ашигласан байдал

Энэ ADR-ийн шийдвэрийг гаргахдаа AI-аас layer separation-ийн давуу/сул талыг асууж, URL shortener-ийн scope-д аль нь тохиромжтойг харьцуулж бодсон. AI route/service/repository бүтэц санал болгосон ч тэр саналыг шууд хуулж хэрэглээгүй. Repo-ийн шаардлага, test хийх хэрэгцээ, checkpoint-оор бага багаар build хийх workflow-той харьцуулж сонгосон.

AI-ийн тусламж хамгийн их хэрэг болсон хэсэг нь "жижиг project учраас хэт architecture хийх үү, эсвэл route дотор бичвэл дараа нь test хэцүү болох уу" гэсэн trade-off-ийг бодох байсан. Эцэст нь энэ project лабораторийн ажил боловч AI-assisted construction-ийн зорилго нь зөвхөн ажилладаг code биш, харин plan-build-reflect workflow харуулах учраас давхарга салгах нь зөв гэж шийдсэн.

## Verification

Энэ шийдвэр зөв ажиллаж байгааг дараах байдлаар шалгасан.

- `npm.cmd test` ажиллуулахад бүх test pass болсон.
- `linkService.test.js` service/helper behavior-ийг route-оос тусад нь шалгаж байна.
- `linkRoutes.test.js` endpoint behavior болон HTTP status code-уудыг шалгаж байна.
- `openapi.yaml` route layer-ийн endpoint-уудтай таарч байна.
- `AI-USAGE-REPORT.md` дээр AI-аар туслуулсан болон хүн өөрөө баталгаажуулсан хэсгийг тусгасан.

## Follow-up

Цаашид project-ийг томруулах бол дараах зүйлсийг анхаарна.

- TypeScript ашиглаж payload болон database row type-уудыг илүү тодорхой болгох.
- Rate limiting, logging, request size limit зэрэг production middleware нэмэх.
- Repository layer-д migration system нэмэх.
- Error response format-ийг нэг стандарт schema болгох.
- Frontend test эсвэл E2E smoke test нэмэх.
