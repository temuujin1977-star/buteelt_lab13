# AI Usage Report - Checkpoint 1

## 1. Энэ report-ийн зорилго

Энэ файл нь Бие даалт 13-ийн В хэсэг буюу Reflect хэсгийн AI Usage Report юм. Энэ checkpoint дээр эхлээд A болон B хэсэг үнэхээр шаардлага хангаж байгаа эсэхийг шалгаж, дараа нь Part B-г хийх явцад AI ямар байдлаар оролцсон, ямар ажлыг AI-аас тусламж авч хийсэн, ямар хэсгийг хүн өөрөө ойлгож баталгаажуулсан талаар тэмдэглэв.

Багшийн зааварт AI ашиглах нь хориотой биш, харин AI-аар гаргуулсан зүйлээ өөрийн хийсэн мэт нуухгүй, ямар үед ашигласан, ямар эрсдэл гарч болохыг тайлбарлах ёстой гэж ойлгосон. Тиймээс энэ report-д AI-г зөвхөн "код бичүүлсэн" гэж нэг мөрөөр бичихгүй. Харин AI-г төлөвлөлт, edge case бодох, test нэмэх, documentation цэгцлэх, security/robustness шалгах туслах хэрэгсэл болгон ашигласан хэсгүүдийг тус тусад нь тэмдэглэнэ.

## 2. Part B дууссаны дараах pass/fail шалгалт

Доорх шалгалтыг Part B checkpoint 3 дууссаны дараа хийв.

### Part B шаардлагууд

- Үндсэн 3-аас дээш feature ажиллаж байгаа: **тийм**.
- Custom slash command 4-өөс дээш байгаа: **тийм**. `.claude/commands` дотор `commit.md`, `docs.md`, `review.md`, `test.md` байна.
- 10-аас дээш unit/API test байгаа: **тийм**. Нийт `24` test байна.
- 15-аас дээш commit шаардлага: **git history дээр тусдаа шалгах шаардлагатай**. Checkpoint бүрийн дараа commit/push хийх workflow баримталж байгаа тул эцсийн submission өмнө `git log --oneline`-оор дахин баталгаажуулна.
- AI session log 3-аас дээш файл: **тийм**. `partB/ai-sessions/01-feature-x.md`, `02-debug-y.md`, `03-refactor-z.md` байна.
- Conventional Commits format: **хэсэгчлэн**. Зарим commit message Монгол тайлбар хэлбэртэй байгаа. Эцсийн шалгалтад шаардлагатай бол дараагийн commit-уудыг илүү conventional хэлбэртэй бичнэ.
- AI ашиглалтыг зарласан эсэх: **тийм, үргэлжлүүлж байна**. Энэ report болон AI session log-уудад AI оролцоог тусгаж байна.

### Part B-ийн ажиллаж байгаа feature-үүд

Part B дээр URL shortener-ийн дараах feature-үүд ажиллаж байна.

- Урт URL-ийг богино URL болгох `POST /api/links`.
- Хадгалсан link-үүдийг жагсаах `GET /api/links`.
- Богино code-оор original URL руу redirect хийх `GET /:shortCode`.
- Redirect хийх бүрт `clicks` тоолуур нэмэх.
- Expired link дээр `410 Gone` буцаах.
- Invalid URL дээр `400 Bad Request` буцаах.
- Unknown short code дээр `404 Not Found` буцаах.
- Custom short code үүсгэх.
- Duplicate custom short code дээр `409 Conflict` буцаах.
- Link stats харах `GET /api/links/:shortCode`.
- Link устгах `DELETE /api/links/:shortCode`.

### Test баталгаажуулалт

Checkpoint 1-ийн үед дараах command ажиллуулж шалгасан.

```bash
npm.cmd test
```

Үр дүн:

- `partB/tests/linkService.test.js`: 16 test pass.
- `partB/tests/linkRoutes.test.js`: 8 test pass.
- Нийт: **24/24 test pass**.

Иймээс Part B-ийн үндсэн backend behavior test-ээр баталгаажсан гэж үзэв. Гэхдээ энэ нь production security бүрэн баталгаатай гэсэн үг биш. Энэ project нь лабораторийн жижиг project тул in-memory болон local SQLite орчинд шалгасан.

## 3. AI-аар хийлгэсэн болон AI-аас тусламж авсан зүйлс

### 3.1 Архитектур болон feature сонголт

Part B дээр эхлээд URL shortener-д ямар feature зайлшгүй хэрэгтэй вэ гэдгийг AI-аар хамт бодсон. Хэрэв AI ашиглахгүй байсан бол create/list/redirect зэрэг үндсэн feature-ийг өөрөө бодож болох байсан ч edge case-үүдийг бүрэн жагсаахад илүү их хугацаа орох байсан. Жишээ нь expired link үед ямар status code тохиромжтой вэ, duplicate custom code үед `400` биш `409 Conflict` буцаах нь зөв үү, redirect хийх үед click count-ийг хэзээ нэмэх вэ гэх мэт шийдвэрүүдийг AI-аас санал авч, дараа нь өөрөө шалгаж сонгосон.

AI-аас шууд авсан гол тусламж нь route/service/repository layer-ийг салгах санаа байсан. URL shortener жижиг project учраас бүх logic-ийг нэг `server.js` файлд бичиж болох байсан. Гэхдээ шалгуур дээр architecture, maintainability, test шаардлага байсан тул AI-аар layer separation-ийн хувилбаруудыг харьцуулж, Express route нь request/response-оо хариуцах, service нь business logic-оо хариуцах, repository нь SQLite query-гээ хариуцах байдлаар сонгосон.

### 3.2 Test case бодох

AI оролцоогүй бол хамгийн төвөгтэй хэсэг нь test-ийн edge case-үүдийг бүрэн санах байсан. Зөвхөн "valid URL үүсэж байна уу" гэж шалгах нь хангалтгүй. AI-аар дараах test case-үүдийг санал болгож, дараа нь project-д тохируулж test болгон нэмсэн.

- Empty URL үед validation error өгөх.
- `ftp://` зэрэг http/https биш protocol reject хийх.
- Past expiration date reject хийх.
- Expired saved link redirect хийхгүй `410` буцаах.
- Unknown short code `404` буцаах.
- Redirect хийсний дараа click count нэмэгдэх.
- Custom short code зөв format-тай үед хадгалагдах.
- Custom short code давхардвал `409` буцаах.
- Stats endpoint тухайн link-ийн мэдээллийг буцаах.
- Delete endpoint ажилласны дараа link дахин олдохгүй болох.

Эдгээрийг AI-аар "сануулах" маягаар ашигласан. Харин test pass болж байгаа эсэхийг local дээр `npm.cmd test` ажиллуулж шалгасан. Энэ хэсэгт AI-ийн гаргасан code-г сохроор итгээгүй, test runner-ийн бодит үр дүнгээр баталгаажуулсан.

### 3.3 Documentation болон OpenAPI

OpenAPI spec бичихэд AI-аас endpoint-ийн structure, response code, schema тал дээр тусламж авсан. Энэ нь гараар бичихэд жижиг алдаа их гардаг хэсэг. Жишээ нь `POST /api/links` request body-д `url`, `expiresAt`, `customCode` талбаруудыг тусгах, `409` response нэмэх, `GET /api/links/{shortCode}` болон `DELETE /api/links/{shortCode}` endpoint-уудыг тусгах хэрэгтэй байсан.

README дээр ч мөн AI-аар эхний draft гаргуулж, дараа нь Монгол хэлээр project-ийн бодит байдалтай тааруулж зассан. Үүнд install, run, test command, checkpoint 2 болон checkpoint 3 дээр нэмсэн зүйлс, curl жишээнүүд орсон.

## 4. AI оролцоогүй бол төвөгтэй байсан зүйлс

AI ашиглахгүйгээр хийх боломжгүй зүйл байгаагүй. Гэхдээ дараах зүйлсэд хугацаа их орох байсан гэж үзсэн.

1. **Edge case жагсаах**: URL validation, expiration, duplicate code, unknown code, redirect click count гэх мэт олон жижиг нөхцөлийг нэг бүрчлэн бодох.
2. **Test coverage зохион байгуулах**: Unit test болон API test-ийн ялгааг гаргаж, service helper, repository, route behavior-ийг тусад нь шалгах.
3. **OpenAPI schema бичих**: Endpoint бүрийн request/response, status code, schema-г нэг мөр алдаагүй бичих.
4. **Layered architecture хадгалах**: Шинэ feature нэмэх үед route дотор бүх logic бичихгүй, service/repository boundary-г эвдэхгүй байх.
5. **Security/robustness асуулт тавих**: Custom code дээр ямар тэмдэгт зөвшөөрөх, SQL injection-оос query parameter ашиглаж хамгаалах, internal error detail response-д задлахгүй байх зэрэг.

## 5. Хүний хийсэн шалгалт

AI-ийн гаргасан санал болгоныг шууд зөв гэж үзээгүй. Дараах байдлаар шалгасан.

- Repo-ийн одоогийн file structure-ийг уншиж, өөрчлөлтүүдийг зөв хавтас руу хийсэн.
- `git status --short` ашиглаж өөрчлөгдсөн файлуудыг шалгасан.
- `npm.cmd test` ажиллуулж бүх test pass болохыг баталгаажуулсан.
- README болон OpenAPI нь Part B-ийн бодит endpoint-той таарч байгаа эсэхийг харсан.
- Custom code validation нь path шиг аюултай тэмдэгт зөвшөөрөхгүй байгаа эсэхийг test-ээр шалгасан.

## 6. Checkpoint 1-ийн дүгнэлт

Part B-ийн үндсэн implementation test-ээр баталгаажсан бөгөөд Reflect хэсгийн эхний checkpoint дээр AI ашиглалтын бодит тэмдэглэлийг эхлүүлэв. Дараагийн checkpoint дээр hallucination/security жишээг тусад нь бичиж, AI-ийн санал буруу эсвэл дутуу байж болох нөхцөлийг тайлбарлана. Мөн ADR-002 дээр build явцад гарсан нэг чухал архитектурын шийдвэрийг тусгаж, self-evaluation дээр өөрийн сурсан зүйл, AI-гүйгээр хийж чадах эсэх, дараагийн удаа юуг өөрөөр хийх талаар хариулна.
