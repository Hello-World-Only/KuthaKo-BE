// ===================================== //
Login:
POST : https://kuthako.onrender.com/api/v1/auth/request-otp
{
  "email": "idipangkar5@gmail.com"
}

Verify:
POST : https://kuthako.onrender.com/api/v1/auth/verify-otp
{
  "email": "idipangkar5@gmail.com",
  "otp": "688372"
}
// ===================================== //

// ===================================== //
[==== QR System ====]

Generate-QR:
POST : https://kuthako.onrender.com/api/v1/qr/generate
Bearer : Required
// ------------------------------------- //

// ------------------------------------- //
Scan-QR:
POST : https://kuthako.onrender.com/api/v1/qr/scan
Bearer : Required

Body: Raw : JSON
{
  "qrToken": "3223e54846642a9cba5cd9bd65d54030"
}
// ------------------------------------- //

// ------------------------------------- //
Pending-Request: 
GET : https://kuthako.onrender.com/api/v1/qr/pending
Bearer : Required

Body: Raw : JSON
{
  "requestId": "69236eee78f3b7f5af37500b"
}
// ------------------------------------- //

// ------------------------------------- //
Accept-Request:
POST : https://kuthako.onrender.com/api/v1/qr/accept
Bearer : Required

Body: Raw : JSON
{
  "requestId": "69236eee78f3b7f5af37500b"
}
// ------------------------------------- //

// ------------------------------------- //
Get-Connection/Contact-List
GET : https://kuthako.onrender.com/api/v1/connections
Bearer : Required

// ------------------------------------- //

// ------------------------------------- //
Remove-Connection/Contact-List
DEL : https://kuthako.onrender.com/api/v1/connections/remove
Bearer : Required

Body: Raw : JSON
{
  "userId": "6920e367574e238013cf49d2"
}
// ------------------------------------- //
// ------------------------------------- //