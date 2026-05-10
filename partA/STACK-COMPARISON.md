# STACK-COMPARISON.md

## Зорилго

URL shortener project-д тохирох stack сонгохын тулд 3 хувилбарыг харьцуулсан. Харьцуулалт хийхдээ дараах шалгуурыг авч үзэв.

- REST API хурдан хөгжүүлэх боломж
- Minimal frontend хийхэд энгийн байх
- Unit test бичихэд тохиромжтой байх
- OpenAPI 3.0 spec гаргах боломж
- Project жижиг scope-той нийцэх
- Суралцахад хэт их төвөг нэмэхгүй байх

## Хувилбар 1: Node.js + Express + SQLite + Vanilla HTML/CSS/JS

### Давуу тал

- Express нь REST API хийхэд энгийн, жижиг project-д тохиромжтой.
- SQLite нь local development-д database server шаардахгүй.
- Vanilla frontend нь minimal UI хийхэд хангалттай.
- Jest эсвэл Vitest ашиглан unit test бичих боломжтой.
- Swagger/OpenAPI package ашиглан `openapi.yaml` үүсгэж болно.
- URL shortener-ийн CRUD, redirect, click counter зэрэг feature-д хангалттай.

### Сул тал

- Project томрох үед folder structure-ийг сайн барихгүй бол эмх замбараагүй болох эрсдэлтэй.
- TypeScript ашиглахгүй бол runtime алдаа гарах магадлал нэмэгдэнэ.
- Validation, error handling, security middleware-ийг өөрөө зөв тохируулах хэрэгтэй.

## Хувилбар 2: Python + FastAPI + SQLite + Jinja2

### Давуу тал

- FastAPI нь OpenAPI spec-ийг автоматаар үүсгэдэг.
- Request/response validation сайн.
- Python syntax уншихад ойлгомжтой.
- SQLite-тэй жижиг API project хийхэд тохиромжтой.
- Pytest ашиглан unit test бичихэд эвтэйхэн.

### Сул тал

- Frontend тал нь Jinja2 template эсвэл тусдаа static JS-ээр хийгдэх тул minimal frontend-ийн workflow бага зэрэг холилдож болно.
- Python virtual environment, dependency setup-ийг зөв барих шаардлагатай.
- Би JavaScript/Node ecosystem дээр илүү хурдан ажиллах боломжтой гэж үзсэн.

## Хувилбар 3: React + Vite + Node.js/Express + SQLite

### Давуу тал

- Frontend UI-г component хэлбэрээр цэвэр зохион байгуулж болно.
- Vite хурдан dev server-тэй.
- React ашиглавал result view, list/detail view зэрэг UI хэсгүүдийг өргөтгөхөд сайн.
- Backend-ийг Express-ээр REST API болгон салгаж болно.

### Сул тал

- Энэ бие даалтын scope-д frontend framework нэмэх нь илүү төвөгтэй.
- Backend болон frontend тусдаа setup, script, test config шаардана.
- A хэсэг болон B хэсгийн хугацаанд project-ийн гол зорилгоос илүү tooling дээр цаг алдах эрсдэлтэй.
- Minimal frontend шаардлагад React заавал хэрэггүй.

## Харьцуулалтын хүснэгт

| Шалгуур | Node + Express + SQLite | FastAPI + SQLite | React + Express + SQLite |
|---|---|---|---|
| REST API хийхэд энгийн | Сайн | Маш сайн | Сайн |
| Minimal frontend | Маш энгийн | Дунд | Илүү их setup |
| OpenAPI гаргах | Боломжтой | Автомат | Боломжтой |
| Unit test | Сайн | Сайн | Сайн боловч setup их |
| Scope-д тохирох | Маш сайн | Сайн | Хэт томдох магадлалтай |
| Суралцах ачаалал | Дунд | Дунд | Өндөр |

## Сонгосон stack

**Node.js + Express + SQLite + Vanilla HTML/CSS/JS**

## Сонгосон шалтгаан

URL shortener project нь жижиг REST API, database CRUD, redirect logic, click counter, expiration validation гэсэн гол хэсгүүдтэй. Ийм scope-д Express + SQLite хангалттай бөгөөд project-ийг хэт том framework-ээр хүндрүүлэхгүй.

Minimal frontend шаардлагатай тул Vanilla HTML/CSS/JS ашиглавал React зэрэг нэмэлт framework оруулахгүйгээр URL үүсгэх form, result display, list/detail view хийх боломжтой. Энэ нь B хэсэг дээр feature implement, unit test, OpenAPI, AI session log зэрэг үндсэн шаардлагад илүү төвлөрөх боломж өгнө.

## AI-тай ярилцсан төлөвлөлтийн товч

AI-аас URL shortener-д тохирох stack-ийн хэд хэдэн хувилбар санал болгохыг хүссэн. Node/Express, FastAPI, React+Express гэсэн 3 хувилбарыг scope, testing, OpenAPI, setup complexity талаас харьцуулж үзсэн. Эцэст нь project жижиг тул энгийн backend-first stack сонгох нь зөв гэж дүгнэв.
