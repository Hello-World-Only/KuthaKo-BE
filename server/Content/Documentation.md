```
## WEEK 1 — Infrastructure + Auth Foundations

### Day 1-2 — Core Project Setup (Completed)

1. Project folder and directory structure
2. `package.json` + dependencies installed
3. `.env` + `.env.example`
4. Created `server.js` and `app.js`
5. MongoDB connection (`config/db.js`)
6. Basic routes working
7. User CRUD completed:

   * Create user
   * Get all users
   * Get single user
   * Update user
   * Delete user

---

### Day 3 — Auth System (90% Completed)

#### 1. Identifier Utils (Completed)

* `isEmail`, `isPhoneE164`, `normalizePhone`, `getIdentifierFromBody`
* Outputs `{ method, identifier }`

#### 2. OTP Model (Completed)

* Fields: identifier, method, otp, expiresAt, createdAt

#### 3. Request OTP (Completed)

* Generate 6-digit OTP
* Normalize identifier
* Upsert OTP
* Send using console driver
* Response: `{ message: "OTP sent" }`

#### 4. OTP Driver System (Completed)

* Console driver
* SMS/Email driver stubs
* Swappable architecture

#### 5. Verify OTP (Completed)

* Validate OTP
* Check expiry
* Delete OTP record
* If user exists: login
* If new user: create & login
* Return `{ token, user }`

#### 6. User Repo + User Service (Completed)

* `findByIdentifier()`
* `createFromIdentifier()`

#### 7. JWT Utils + Middleware (Completed)

* `jwt.signUser()`
* `authMiddleware` for protected routes

#### 8. Postman Testing (Completed)

---

### Day 3 → Moved to Day 4 (Pending)

9.1 Twilio/SMS/Email provider setup + env vars
9.2 OTP rate-limiting, attempt limits, cooldown
9.3 Phone prefix endpoint for frontend

---

## DAY 4 — Production-Ready Auth (Today)

### Task A — Twilio / Email Provider Setup

1. Add ENV variables:

   * TWILIO_SID
   * TWILIO_AUTH_TOKEN
   * TWILIO_PHONE
2. Implement `sms.driver.js`
3. Update `otp.sender.js` to select driver
4. Add dev-mode fallback (console.log OTP)

### Task B — OTP Security + Rate Limiting

1. Limit: max 3 OTP sends per 10 minutes per identifier
2. Add resend cooldown: 30–45 seconds
3. Limit OTP verify attempts: max 5
4. Standard error responses for abuse
5. Later move rate-limits to Redis

### Task C — Phone Prefix Endpoint

1. Create `/api/phone-prefix`
2. Serve static JSON list or use library
3. Response example:

   * `{ country: "India", dial_code: "+91" }`

---

## WEEK 2 — Profile + Connections + Presence

### Day 5 — Profile Setup

* User profile fields: name, bio, avatar, gender
* Update profile endpoint
* Avatar upload (local or S3 stub)

### Day 6 — Dynamic QR Connection System

* QR code regenerates every 30 seconds
* Store connection token in Redis with TTL
* Scan QR → connection request
* Accept connection → create link
* Endpoints:

  * `POST /qr/generate`
  * `POST /connections/request`
  * `POST /connections/accept`
  * `DELETE /connections/remove`

### Day 7 — Presence System

* Redis presence tracking
* Online/offline
* Last seen
* Socket events: `user:online`, `user:offline`

---

## WEEK 3 — Chat System

### Day 8-10 — Models

* chat.model.js
* message.model.js
* Index optimization

### Day 11-12 — Chat API

* `POST /chat/send`
* `GET /chat/:chatId`
* `GET /chat/user/:userId`

### Day 13-14 — Socket Events

* chat:send
* chat:receive
* chat:typing
* chat:delivered
* chat:read

---

## WEEK 4 — Calls + Status + Media

### Day 15-16 — Call Signaling

* WebRTC offer/answer
* ICE
* End call
* Socket events for signaling

### Day 17-18 — Status Module

* Create status
* Get friend statuses
* Status views
* Socket events: status:new, status:view

### Day 19-20 — Media Uploads

* Image
* Video
* Audio
* File attachments
* Local or S3

### Day 21-22 — Notifications

* Notification model
* In-app notifications
* Mark-as-read logic

---

## FINAL WEEK — Testing + Production

### Day 23-24 — Automated Testing

* Unit tests
* Integration tests

### Day 25-26 — Workers + Queues

* Message queue worker
* Media processor
* Notification worker

### Day 27-28 — Logging + Error Handling

* Centralized error middleware
* Winston logger

### Day 29-30 — Deployment Prep

* Docker
* PM2
* Production environment
* Cleanup
* Final end-to-end tests

```
