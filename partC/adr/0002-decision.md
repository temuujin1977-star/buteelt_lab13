# ADR-002: Route, service, repository гэж салгаж бичих шийдвэр

## Status

Accepted

## Context

Part B дээр URL shortener-ийн backend хийх үед бүх кодыг нэг route file дотор бичиж болох байсан. Project жижиг болохоор эхэндээ тэгж бичвэл хурдан юм шиг санагдсан. Гэхдээ дараа нь feature нэмэгдэх тусам код замбараагүй болох магадлалтай байсан.

Манай project дээр дараах зүйлс орсон.

- URL богиносгох.
- Link жагсаах.
- Short code-оор redirect хийх.
- Click count нэмэх.
- Expired link шалгах.
- Custom short code үүсгэх.
- Давхардсан custom code шалгах.
- Link stats харах.
- Link устгах.

Эдгээрийг бүгдийг нь route дотор бичвэл route file хэт олон үүрэгтэй болно. Нэг газар request авах, validation хийх, database query бичих, error response буцаах гээд бүгд холилдоно. Тэгвэл test бичихэд ч төвөгтэй болно.

## Decision

Тиймээс би кодыг 3 үндсэн layer болгон салгасан.

- `routes`: HTTP endpoint, request/response, status code хариуцна.
- `services`: validation болон business logic хариуцна.
- `repositories`: SQLite database query хариуцна.

Жишээ нь:

- `partB/src/routes/linkRoutes.js`
- `partB/src/services/linkService.js`
- `partB/src/repositories/linkRepository.js`

Route нь database query шууд бичихгүй. Service нь Express-ийн `res` object ашиглахгүй. Repository нь HTTP status code мэдэхгүй. Ингэснээр файл бүрийн үүрэг илүү тодорхой болсон.

## Яагаад ийм шийдвэр гаргасан бэ?

Нэгдүгээрт, test бичихэд амар болсон. Жишээ нь URL validation зөв ажиллаж байна уу гэдгийг server асаахгүйгээр service test дээр шалгаж болно. Мөн redirect хийхэд click count нэмэгдэж байна уу, expired link дээр error гарч байна уу гэдгийг тусад нь шалгаж болно.

Хоёрдугаарт, database query нэг газар төвлөрсөн. Ингэснээр SQL query-үүд route дотор энд тэнд тарж бичигдэхгүй. Энэ нь алдаа багасгана. Мөн SQL injection-оос хамгаалах тал дээр parameter ашиглаж байгаа эсэхийг харахад амар.

Гуравдугаарт, error status code ойлгомжтой болсон. Service дээр error шиднэ. Route дээр тэр error-ийг `400`, `404`, `409`, `410` гэх мэт response болгон хувиргана. Ингэснээр business logic болон HTTP response хоорондоо хэт холилдохгүй.

## AI ашигласан байдал

Энэ шийдвэрийг гаргах үед AI-аас зөвлөгөө авсан. AI route/service/repository гэж салгах нь test бичихэд амар гэж санал болгосон. Би тэр саналыг шууд хуулж аваагүй, харин project-ийн шаардлагатай харьцуулж үзсэн.

Даалгавар дээр test, OpenAPI, AI session log, review хийх шаардлага байсан. Тиймээс бүх code-г нэг файлд бичихээс илүү layer болгон салгах нь зөв гэж үзсэн. AI энэ trade-off-ийг бодоход тус болсон. Гэхдээ эцсийн шийдвэрийг би project-ийн хэмжээнд тохируулж сонгосон.

## Өөр хувилбарууд

### Бүх code-г нэг route file дотор бичих

Энэ нь эхэндээ хурдан. Гэхдээ feature нэмэгдэх тусам route file томорно. Validation, database query, error handling бүгд холилдоно. Test бичихэд ч хэцүү болно.

### Route болон repository хоёр layer ашиглах

Энэ хувилбар арай дээр. Database query тусдаа болно. Гэхдээ validation болон business logic route дотор үлдэнэ. Тэгвэл route file бас л хэт их зүйл хариуцна.

### Route, service, repository гурван layer ашиглах

Энэ хувилбарыг сонгосон. Project жижиг ч test болон checkpoint-оор хөгжүүлэхэд илүү тохиромжтой байсан.

## Давуу тал

- Код уншихад илүү ойлгомжтой болсон.
- Test бичихэд амар болсон.
- Database query нэг газар төвлөрсөн.
- Error response-ууд нэг газраас гарч байна.
- Шинэ feature нэмэхэд хаана бичих нь тодорхой болсон.
- AI-аар туслуулсан code-г шалгахад амар болсон.

## Сул тал

- Жижиг project-д файл арай олон харагдана.
- Нэг feature нэмэхэд 2-3 файл өөрчлөх хэрэг гарна.
- Layer-ийн зарчмаа барихгүй бол дараа нь дахиад замбараагүй болж болно.

## Verification

Энэ шийдвэр зөв ажиллаж байгаа эсэхийг test-ээр шалгасан.

```bash
npm.cmd test
```

Үр дүн нь 24/24 pass болсон. Service test дээр validation, repository, business logic шалгагдсан. Route test дээр API endpoint болон status code шалгагдсан.

## Дүгнэлт

Энэ project жижиг ч route/service/repository гэж салгасан нь зөв болсон гэж бодож байна. Хэрэв бүх logic route дотор байсан бол дараа нь custom code, stats, delete feature нэмэхэд илүү будилах байсан. Энэ шийдвэр project-ийг арай цэгцтэй, test хийхэд амар болгосон.
