# PROJECT.md

## Сонгосон сэдэв

URL shortener — REST API болон minimal frontend бүхий жижиг систем.

## Товч тайлбар

Энэ project нь урт URL хаягийг богино кодтой холбоос болгон хадгалж, хэрэглэгчийг богино холбоосоор дамжуулан эх URL руу redirect хийх систем байна. Мөн холбоос бүрийн даралтын тоо болон хүчинтэй хугацааг бүртгэнэ.

## Зорилго

AI-assisted software construction workflow-г жижиг боловч бодит project дээр хэрэгжүүлэх. Үүнд project scope тодорхойлох, stack сонгох, architecture гаргах, feature build хийхээс өмнө AI-тай хамтран төлөвлөх алхмууд орно.

## Хэрэглэгчийн үндсэн хэрэгцээ

- Хэрэглэгч урт URL оруулаад богино холбоос үүсгэнэ.
- Хэрэглэгч богино холбоосоор орж эх URL руу redirect хийнэ.
- Систем холбоос хэдэн удаа дарагдсаныг тоолно.
- Хэрэглэгч холбоосын хүчинтэй хугацаа тохируулж болно.
- Хугацаа дууссан холбоос redirect хийхгүй.

## Scope

### In scope

- REST API ашиглан URL үүсгэх, унших, redirect хийх.
- Random short code үүсгэх.
- Click counter хадгалах.
- Expiration date шалгах.
- Minimal frontend-оор URL үүсгэх form болон result харуулах.
- Unit test бичих боломжтой бүтэцтэй байх.
- API project тул OpenAPI 3.0 spec гаргах.

### Out of scope

- User authentication.
- Payment, subscription, analytics dashboard.
- Custom domain тохиргоо.
- Public production deployment.
- Advanced spam/phishing detection.

## Үндсэн feature-үүд

1. Create short URL
2. Redirect by short code
3. Track click count
4. Expiration handling
5. Basic URL list/detail view

## Амжилтын шалгуур

- 3-аас дээш үндсэн feature ажиллана.
- API endpoint-ууд test-ээр шалгагдана.
- Build, run, test command-ууд README болон CLAUDE.md дээр тодорхой байна.
- AI session log болон ADR файлууд Part A, Part B, Part C-д хадгалагдана.
