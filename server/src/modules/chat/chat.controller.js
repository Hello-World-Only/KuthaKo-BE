// src/modules/chat/chat.controller.js

import chatService from "./chat.service.js";
import messageService from "./message.service.js";

class ChatController {

    /**
     * GET /chat/list
     */
    async getChatList(req, res) {
        try {
            const userId = req.user._id;
            const chats = await chatService.getChatsForUser(userId);
            return res.json({ success: true, chats });
        } catch (err) {
            console.error("getChatList error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    /**
     * GET /chat/:chatId/messages
     */
    async getMessages(req, res) {
        try {
            const { chatId } = req.params;
            const limit = parseInt(req.query.limit || 50);
            const before = req.query.before ? new Date(req.query.before) : null;

            const messages = await messageService.getMessages(chatId, limit, before);

            return res.json({ success: true, messages });
        } catch (err) {
            console.error("getMessages error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    /**
     * POST /chat/send
     */
    async sendMessage(req, res) {
        try {
            const senderId = req.user._id;
            const { receiverId, type, text, attachments, replyTo } = req.body;

            // 1. Ensure users are connected
            const allowed = await chatService.ensureConnected(senderId, receiverId);
            if (!allowed) {
                return res.status(403).json({
                    success: false,
                    message: "Users are not connected"
                });
            }

            // 2. Get or create chat
            const chat = await chatService.getOrCreateChat(senderId, receiverId);

            // 3. Create message
            const msg = await messageService.sendMessage({
                chatId: chat._id,
                sender: senderId,
                receiver: receiverId,
                type,
                text,
                attachments,
                replyTo
            });

            return res.json({ success: true, message: msg });

        } catch (err) {
            console.error("sendMessage error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    /**
     * POST /chat/:chatId/seen
     * Mark all messages as seen (REST fallback)
     */
    async markSeen(req, res) {
        try {
            const { chatId } = req.params;
            const userId = req.user._id;

            // Reset unread count
            await chatService.resetUnread(chatId, userId);

            // Mark only messages not sent by the same user
            const messages = await messageService.getMessages(chatId, 100);
            for (const m of messages) {
                if (m.sender.toString() !== userId.toString()) {
                    await messageService.markSeen(m._id, userId);
                }
            }

            return res.json({ success: true });

        } catch (err) {
            console.error("markSeen error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
}

export default new ChatController();
