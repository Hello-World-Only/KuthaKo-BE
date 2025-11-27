// src/modules/chat/chat.routes.js

import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import chatController from "./chat.controller.js";
import { ensureChatParticipant } from "../../middleware/chatAccess.middleware.js";

const router = Router();

// Require JWT auth for all routes
router.use(auth);

// Get user chat list
router.get("/list", chatController.getChatList);

// Get messages of a chat (must be participant)
router.get("/:chatId/messages", ensureChatParticipant, chatController.getMessages);

// Mark chat messages as seen
router.post("/:chatId/seen", ensureChatParticipant, chatController.markSeen);

// Send a message (controller checks connection)
router.post("/send", chatController.sendMessage);

export default router;
