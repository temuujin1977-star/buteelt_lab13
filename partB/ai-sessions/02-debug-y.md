# AI session 02 - Checkpoint 2 implementation

## Goal

Part B-ийн хоёр дахь checkpoint дээр URL shortener-ийн үндсэн backend feature-үүдийг ажилладаг болгох.

## AI-аас авсан тусламж

- Express route, service, repository гэсэн бүтэцтэй хэрэгжүүлэх санал гаргасан.
- SQLite schema болон parameterized query ашиглах repository code бичихэд тусалсан.
- URL validation, random short code, expiration handling-ийн edge case-уудыг гаргуулсан.
- Vitest + Supertest ашигласан API test-ийн хувилбарууд санал болгосон.

## Human review

- Feature scope-ийг checkpoint 2-т тохируулж хязгаарласан.
- Secret/env файл commit хийхгүй байх `.gitignore` дүрмийг шалгасан.
- API response status code-уудыг шалгасан: `201`, `400`, `404`, `410`, `302`.
- Unit test-үүдийг нэмээд `npm.cmd test` командаар ажиллуулж баталгаажуулсан.

## Result

- Богино URL үүсгэх, жагсаах, redirect хийх, click count нэмэх, хугацаа дууссан link шалгах боломжтой болсон.
- README болон OpenAPI documentation checkpoint 2-тэй тааруулж шинэчлэгдсэн.
- Нийт 14 test pass болсон.
