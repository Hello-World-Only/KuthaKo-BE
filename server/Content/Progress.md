-- # ===================================
[ === Day 1 ==== ]
0: SETUP
-- 1: Database Setup .env: MongoDB URI [Done]
-- 2: Basics Routes SETUP-Test [Done]
-- 3: User Model: [Done] || src/modules/user/user.controller.js

1: USER
-- 1: Create used [Done] || src/modules/user/user.controller.js
-- 2: Get all User [Done]

[ === Day 2 ==== ]
-- 3: Get Single User or By User ID [Done]
-- 4: Update User's Data [Done]
-- 5: Delete User [Done]

[ Day 1 + Day 2 = CRUD : USER] [Done]
-- # =================================== #

-- # =================================== #
[ === Day 3 ==== ]
// src/modules/auth/utils/identifier.utils.js
-- #1: Identifier parser & validators
-- 1.1: identifier.utils.js
-- 1.2: Functions: isEmail, isPhoneE164, normalizePhone, getIdentifierFromBody
-- 1.3: Input expected (Option B): { phonePrefix, phone } or { email }
-- 1.4: Output: { method: "email"|"phone", identifier: "example@mail.com" | "+919876543210" }
-- 1.5: Error messages for invalid input


// server/src/database/models/otp.model.js
-- #2: OTP Mongoose model
-- 2.1: otp.model.js schema: identifier, otp, method, expiresAt, createdAt
-- 2.2: Indexes (expireAt TTL optional)


// server/src/modules/auth/auth.service.js
// server/src/modules/auth/auth.controller.js
-- #3: Request OTP controller + route (POST /auth/request-otp)
-- 3.1: Uses identifier utils
-- 3.2: Generates 6-digit OTP, stores (upsert) with expiry (5m)
-- 3.3: Sends via driver (default: console)
-- 3.4: Response: { message: "OTP sent" }
-- 3.5: Rate-limits / basic abuse protection notes (optional)


// server/src/modules/auth/drivers/sms.driver.js
// server/src/modules/auth/drivers/email.driver.js
// server/src/modules/auth/otp.sender.js
// server/src/modules/auth/auth.service.js
-- #4: Pluggable OTP sender (driver)
-- 4.1: otpSender.js with two implementations: console and twilio/nodemailer stubs
-- 4.2: Clear interface so frontend swapping is easy


// server/src/database/repositories/user.repo.js
// server/src/utils/jwt.js
// server/src/modules/auth/auth.service.js
-- #5: Verify OTP controller + route (POST /auth/verify-otp)
-- 5.1: Validate OTP, expiry, delete record
-- 5.2: If user exists → sign token & return
-- 5.3: If not → create user (post-verify) → sign token & return
-- 5.4: Response: { token, user }


// server/src/database/repositories/user.repo.js
// server/src/modules/auth/auth.service.js
-- #6: User model & minimal user service
-- 6.1: user.model.js with email, phone, timestamps
-- 6.2: user.service.js helpers: findByIdentifier, createFromIdentifier


// server/src/middleware/auth.middleware.js
-- #7: JWT utils & middleware
-- 7.1: jwt.signUser(user), authMiddleware to protect routes



-- #8: Testing + Postman examples
-- 8.1: Example requests for both phone & email flows
-- 8.2: Quick manual tests to verify flows



-- #9: Extras / production notes (can be done later)
-- 9.1: Twilio/SMS/email provider setup, env vars
-- 9.2: Rate-limiting, OTP attempt limits, resend cooldown
-- 9.3: PhonePrefix list endpoint for frontend country picker
-- # =================================== #
