# **1-Month Backend Development Roadmap**

### **Week 1 — Setup + Core Infrastructure**

**Goal:** Get the project scaffold ready, basic server running, DB connected.

**Day 1-2: Project setup**

- Create project folders (we just finalized structure)
- Initialize `package.json`
- Install dependencies:

```bash
npm init -y
npm i express mongoose dotenv cors bcrypt jsonwebtoken socket.io redis multer
npm i -D nodemon eslint prettier
```

- Setup `.env` and `.env.example`
- Setup `server.js` and `app.js` to run Express
- Setup MongoDB connection in `config/db.js`
- Setup Redis connection in `config/redis.js` (for presence/typing)
- Test basic `GET /` route

---

**Day 3-4: Middleware & Utils**

- Create global middleware:

  - `auth.middleware.js` (JWT verification skeleton)
  - `error.middleware.js` (centralized error handler)
  - `upload.middleware.js` (Multer for media uploads)
  - `rateLimit.middleware.js` (optional, later for security)

- Create basic utils:

  - `jwt.js` (sign/verify)
  - `response.js` (standard API responses)
  - `constants.js` (status codes, enums)

---

**Day 5: Socket.IO setup**

- Create `socket.js`
- Initialize Socket.IO server
- Test simple connection/disconnection event
- Create `sockets/init.js` to manage events per module

---

### **Week 2 — User Module**

**Goal:** Implement authentication, user profile, presence.

**Day 6-7: Auth**

- `auth.controller.js` / `auth.service.js`
- Routes:

  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`

- JWT generation and validation
- Password hashing (bcrypt)

**Day 8-9: User Module**

- `user.controller.js` / `user.service.js`
- Routes:

  - `GET /api/v1/user/me`
  - `PUT /api/v1/user/profile`

- Socket presence: `user:online` / `user:offline`

**Day 10: Test Users**

- Test registration, login, JWT auth
- Test online/offline events via Socket.IO

---

### **Week 3 — Chat Module**

**Goal:** Implement 1:1 and group messaging, typing indicators, delivery/read receipts

**Day 11-12: Models**

- `chat.model.js`, `message.model.js`, `group.model.js`

**Day 13-14: Chat Controllers & Services**

- `chat.controller.js` / `chat.service.js`
- Routes:

  - `POST /api/v1/chat/send`
  - `GET /api/v1/chat/:chatId`
  - `POST /api/v1/chat/group`

**Day 15: Chat Socket Events**

- `chat.socket.js` → message send/receive
- `typing.socket.js` → typing indicator
- `delivery.socket.js` → delivered/read

---

### **Week 4 — Call + Status + Media**

**Goal:** Audio/video calls, status updates, media uploads

**Day 16-17: Call Module**

- `call.model.js`
- `call.controller.js` / `call.service.js`
- Routes: `POST /api/v1/call/start` / `POST /api/v1/call/end`
- Socket events: `call:offer` / `call:answer` / `call:ice` / `call:end`

**Day 18-19: Status Module**

- `status.model.js`
- `status.controller.js` / `status.service.js`
- Routes:

  - `POST /api/v1/status` (create status)
  - `GET /api/v1/status` (get friend’s statuses)

- Socket: `status:new` / `status:view`

**Day 20: Media Module**

- `media.controller.js` / `media.service.js`
- Multer or S3 uploads
- Routes: `POST /api/v1/media/upload`

**Day 21-22: Notifications**

- `notification.model.js` / `notification.service.js`
- Push or socket notifications

---

### **Final Week — Testing + Refinements**

**Day 23-24:** Unit & integration tests (`tests/unit/` and `tests/integration/`)
**Day 25-26:** Implement workers & queues (`message.queue.js`, `media.processor.js`, `notification.worker.js`)
**Day 27-28:** Logging, error handling improvements
**Day 29-30:** End-to-end testing + cleanup + deployment prep

---

# **Starting Today**

**Step 1 (Day 1)** — **Project scaffolding and initial server setup**:

1. Create the `server/src/` folders (all we marked earlier)
2. Add `.gitkeep` in empty folders
3. Initialize `package.json`
4. Install dependencies
5. Create `server.js` + `app.js` with a simple `GET /` route
6. Connect MongoDB (`config/db.js`) and Redis (`config/redis.js`)
7. Test `npm run dev` with Nodemon → server should start
