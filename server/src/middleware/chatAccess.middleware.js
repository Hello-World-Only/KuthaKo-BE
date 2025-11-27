// src/middleware/chatAccess.middleware.js

import Connection from "../database/models/Connection.js";
import Chat from "../database/models/chat.model.js";

/**
 * Middleware: user must be a participant in a chat
 */
export async function ensureChatParticipant(req, res, next) {
    try {
        const userId = req.user._id.toString();
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const isMember = chat.participants.some(
            (p) => p.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not part of this chat"
            });
        }

        // Attach chat for downstream use
        req.chat = chat;
        next();

    } catch (err) {
        console.error("ensureChatParticipant error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
