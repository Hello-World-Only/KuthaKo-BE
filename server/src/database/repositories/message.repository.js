// src/database/repositories/message.repository.js

import Message from "../models/message.model.js";

class MessageRepository {

    /**
     * Create a new message
     */
    async createMessage(data) {
        return Message.create(data);
    }

    /**
     * List messages for a chat (with pagination)
     */
    async getMessages(chatId, limit = 50, beforeDate = null) {
        const query = { chatId };

        if (beforeDate) {
            query.createdAt = { $lt: beforeDate };
        }

        return Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("sender", "_id name avatar")
            .populate("replyTo");
    }

    /**
     * Mark delivered for a user
     */
    async markDelivered(messageId, userId) {
        return Message.updateOne(
            { _id: messageId, "delivered.userId": { $ne: userId } },
            { $push: { delivered: { userId, at: new Date() } } }
        );
    }

    /**
     * Mark seen for a user
     */
    async markSeen(messageId, userId) {
        return Message.updateOne(
            { _id: messageId, "seen.userId": { $ne: userId } },
            { $push: { seen: { userId, at: new Date() } } }
        );
    }

    /**
     * Get one message by ID
     * (Needed for delivered/seen events)
     */
    async getMessageById(id) {
        return Message.findById(id);
    }
}

export default new MessageRepository();
