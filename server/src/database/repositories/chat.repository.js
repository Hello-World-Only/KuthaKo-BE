// src/database/repositories/chat.repository.js

import Chat from "../models/chat.model.js";

class ChatRepository {

    /**
     * Find or create a one-to-one chat between two users.
     */
    async findOrCreateOneToOne(userA, userB) {
        let chat = await Chat.findOneToOne(userA, userB);

        if (!chat) {
            chat = await Chat.create({
                participants: [userA, userB],
                isGroup: false,
                unread: [
                    { userId: userA, count: 0 },
                    { userId: userB, count: 0 }
                ]
            });
        }

        return chat;
    }

    /**
     * Get all chats for a user (sidebar)
     */
    async getChatsForUser(userId) {
        return Chat.find({ participants: userId })
            .populate("participants", "_id name email avatar status isOnline lastSeen")
            .sort({ updatedAt: -1 });
    }

    /**
     * Find a chat by ID
     * Needed for:
     * - chat:history
     * - validating participant
     */
    async findById(chatId) {
        return Chat.findById(chatId);
    }

    /**
     * Update lastMessage and increment unread for receivers
     */
    async updateLastMessage(chatId, message, senderId) {
        const chat = await Chat.findById(chatId);
        if (!chat) return null;

        // Update last message
        chat.lastMessage = {
            _id: message._id,
            sender: senderId,
            text: message.text || null,
            type: message.type,
            createdAt: message.createdAt
        };

        // Ensure unread array is properly initialized
        if (!chat.unread || chat.unread.length === 0) {
            chat.unread = chat.participants.map((p) => ({
                userId: p,
                count: 0
            }));
        }

        // Increment unread for everyone except sender
        chat.unread = chat.unread.map((u) => {
            if (u.userId.toString() !== senderId.toString()) {
                u.count++;
            }
            return u;
        });

        await chat.save();
        return chat;
    }

    /**
     * Reset unread counter for a specific user
     */
    async resetUnread(chatId, userId) {
        return Chat.updateOne(
            { _id: chatId, "unread.userId": userId },
            { $set: { "unread.$.count": 0 } }
        );
    }
}

export default new ChatRepository();
