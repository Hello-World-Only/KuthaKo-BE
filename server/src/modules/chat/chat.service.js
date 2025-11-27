// src/modules/chat/chat.service.js

import chatRepository from "../../database/repositories/chat.repository.js";
import Connection from "../../database/models/Connection.js"; // FIXED
import mongoose from "mongoose";

class ChatService {

    /**
     * Ensure two users are connected (friends)
     */
    async ensureConnected(userA, userB) {
        const isConnected = await Connection.findOne({
            $or: [
                { users: [userA, userB] },
                { users: [userB, userA] }
            ]
        });

        return !!isConnected;
    }

    /**
     * Get or create a chat between 2 users
     */
    async getOrCreateChat(userA, userB) {
        return chatRepository.findOrCreateOneToOne(userA, userB);
    }

    /**
     * Get all chats of a user (sidebar)
     */
    async getChatsForUser(userId) {
        return chatRepository.getChatsForUser(userId);
    }

    /**
     * Reset unread messages
     */
    async resetUnread(chatId, userId) {
        return chatRepository.resetUnread(chatId, userId);
    }

    /**
     * Check if a user is participant in a chat
     */
    async isUserParticipant(chatId, userId) {
        const chat = await chatRepository.findById(chatId);
        if (!chat) return false;

        return chat.participants.some(
            (p) => p.toString() === userId.toString()
        );
    }
}

export default new ChatService();
