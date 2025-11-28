// src/database/repositories/chat.repository.js

import Chat from "../models/Chat.js";

class ChatRepository {
  async findOrCreateOneToOne(userA, userB) {
    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [userA, userB] },
    });

    if (!chat) {
      chat = await Chat.create({
        isGroup: false,
        participants: [userA, userB],
      });
    }

    return chat;
  }

  async getChatsForUser(userId) {
    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return chats.map((chat) => {
      const participantsArr = Array.isArray(chat.participants)
        ? chat.participants
        : [];

      const otherUser = participantsArr.find(
        (u) => u && u._id && u._id.toString() !== userId.toString()
      );

      return {
        chatId: chat._id.toString(),
        otherUser: otherUser || null,
        lastMessage: chat.lastMessage || null,
      };
    });
  }

  async findById(id) {
    return Chat.findById(id).populate("participants", "name avatar");
  }

  async resetUnread(chatId, userId) {
    return Chat.updateOne(
      { _id: chatId },
      { $set: { [`unread.${userId}`]: 0 } }
    );
  }
}

export default new ChatRepository();
