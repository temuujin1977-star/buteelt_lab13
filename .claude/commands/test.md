# /test

Одоогийн feature-д тохирох unit test болон edge case test санал болго.

Заавал шалгах case-ууд:

- Valid URL short code үүсгэх
- Invalid URL reject хийх
- Duplicate short code үед дахин үүсгэх
- Expired link redirect хийхгүй байх
- Click count redirect бүр дээр нэмэгдэх
- Missing field үед 400 буцаах
- Unknown short code үед 404 буцаах

Test-үүдийг ойлгомжтой нэртэй, maintainable байдлаар бич.
