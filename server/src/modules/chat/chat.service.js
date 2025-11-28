// src/modules/chat/chat.service.js

import chatRepository from "../../database/repositories/chat.repository.js";
import Connection from "../../database/models/Connection.js";

class ChatService {
  async ensureConnected(userA, userB) {
    const isConnected = await Connection.findOne({
      users: { $all: [userA, userB] },
    });

    return !!isConnected;
  }

  async getOrCreateChat(userA, userB) {
    return chatRepository.findOrCreateOneToOne(userA, userB);
  }

  async getChatsForUser(userId) {
    return chatRepository.getChatsForUser(userId);
  }

  async resetUnread(chatId, userId) {
    return chatRepository.resetUnread(chatId, userId);
  }

  async getChatById(id) {
    return chatRepository.findById(id);
  }
}

export default new ChatService();
