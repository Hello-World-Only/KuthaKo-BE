// src/modules/chat/message.service.js

import messageRepository from "../../database/repositories/message.repository.js";
import chatRepository from "../../database/repositories/chat.repository.js";

class MessageService {

    /**
     * Send a message (create + update chat)
     */
    async sendMessage({ chatId, sender, receiver, type, text, attachments, replyTo }) {

        // 1. Create message
        const message = await messageRepository.createMessage({
            chatId,
            sender,
            receiver,
            type,
            text,
            attachments,
            replyTo
        });

        // 2. Update chat lastMessage + increment unread
        await chatRepository.updateLastMessage(chatId, message, sender);

        return message;
    }

    /**
     * Get messages for a chat (pagination)
     */
    async getMessages(chatId, limit = 50, before = null) {
        return messageRepository.getMessages(chatId, limit, before);
    }

    /**
     * Mark message delivered
     */
    async markDelivered(messageId, userId) {
        return messageRepository.markDelivered(messageId, userId);
    }

    /**
     * Mark message as seen
     */
    async markSeen(messageId, userId) {
        return messageRepository.markSeen(messageId, userId);
    }

    /**
     * Get a single message by ID
     * (Required for message:delivered)
     */
    async getMessageById(messageId) {
        return messageRepository.getMessageById(messageId);
    }
}

export default new MessageService();
