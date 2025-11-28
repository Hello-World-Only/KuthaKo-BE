// src/modules/chat/chat.controller.js

import chatService from "./chat.service.js";
import messageService from "./message.service.js";

class ChatController {
  async getChatList(req, res) {
    try {
      const userId = req.user._id;
      const chats = await chatService.getChatsForUser(userId);
      return res.json({ success: true, chats });
    } catch (err) {
      console.error("getChatList error:", err);
      return res.status(500).json({ success: false });
    }
  }

  async getMessages(req, res) {
    try {
      const { chatId } = req.params;

      const messages = await messageService.getMessages(chatId, 50);

      const chat = await chatService.getChatById(chatId);

      return res.json({ success: true, messages, chat });
    } catch (err) {
      console.error("getMessages error:", err);
      return res.status(500).json({ success: false });
    }
  }

  async sendMessage(req, res) {
    try {
      const senderId = req.user._id;
      const { receiverId, chatId, text, type } = req.body;

      const allowed = await chatService.ensureConnected(senderId, receiverId);
      if (!allowed)
        return res
          .status(403)
          .json({ success: false, message: "Users not connected" });

      let chat = chatId
        ? await chatService.getChatById(chatId)
        : await chatService.getOrCreateChat(senderId, receiverId);

      const msg = await messageService.sendMessage({
        chatId: chat._id,
        sender: senderId,
        receiver: receiverId,
        type,
        text,
      });

      return res.json({ success: true, message: msg });
    } catch (err) {
      console.error("sendMessage error:", err);
      return res.status(500).json({ success: false });
    }
  }

  async markSeen(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user._id;

      await chatService.resetUnread(chatId, userId);

      return res.json({ success: true });
    } catch (err) {
      console.error("markSeen error:", err);
      return res.status(500).json({ success: false });
    }
  }

  async startChat(req, res) {
    try {
      const senderId = req.user._id;
      const { receiverId } = req.body;

      const allowed = await chatService.ensureConnected(senderId, receiverId);
      if (!allowed)
        return res
          .status(403)
          .json({ success: false, message: "Users not connected" });

      const chat = await chatService.getOrCreateChat(senderId, receiverId);

      return res.json({ success: true, chatId: chat._id });
    } catch (err) {
      console.error("startChat error:", err);
      return res.status(500).json({ success: false });
    }
  }
}

export default new ChatController();
