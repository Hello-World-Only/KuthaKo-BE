// src/modules/chat/chat.routes.js

import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import chatController from "./chat.controller.js";
import { ensureChatParticipant } from "../../middleware/chatAccess.middleware.js";

const router = Router();

// Secure all routes
router.use(auth);

// Start or fetch chat
router.post("/start", chatController.startChat);

// Chat list
router.get("/list", chatController.getChatList);

// Load messages
router.get(
  "/:chatId/messages",
  ensureChatParticipant,
  chatController.getMessages
);

// Mark seen
router.post("/:chatId/seen", ensureChatParticipant, chatController.markSeen);

// Send message
router.post("/send", chatController.sendMessage);

export default router;
