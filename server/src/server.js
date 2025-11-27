// ================================
// FINAL SERVER.JS (FULL WORKING)
// ================================

// Core imports
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// App + DB
import app from "./app.js";
import connectDB from "./config/db.js";

// Chat services
import chatService from "./modules/chat/chat.service.js";
import messageService from "./modules/chat/message.service.js";

// Models
import User from "./database/models/user.model.js";

// Logs / Testing
import { appConfig } from "./config/appConfig.js";
console.log("QR expiry =", appConfig.qrExpirySeconds);
import { QrToken } from "./database/models/QrToken.js";
console.log("QrToken model loaded:", !!QrToken);

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// ====================================
// SOCKET.IO SETUP
// ====================================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// userId -> socketId map
const onlineUsers = new Map();

// Auth middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

// ====================================
// SOCKET CONNECTION
// ====================================
io.on("connection", async (socket) => {
  const userId = socket.userId;

  // Track online sockets
  onlineUsers.set(userId, socket.id);
  console.log("User connected:", userId, "Socket:", socket.id);

  // =============================
  // Presence: User Online
  // =============================
  await User.findByIdAndUpdate(userId, {
    isOnline: true,
    lastSeen: new Date()
  });

  // Notify all clients (optional)
  io.emit("presence:update", {
    userId,
    isOnline: true
  });

  // ======================================
  // CHAT EVENTS
  // ======================================

  // 1️⃣ SEND MESSAGE
  socket.on("chat:send", async (data) => {
    try {
      const senderId = socket.userId;
      const { receiverId, type, text, attachments, replyTo } = data;

      // Ensure connected
      const allowed = await chatService.ensureConnected(senderId, receiverId);
      if (!allowed) {
        socket.emit("chat:error", { message: "Users are not connected" });
        return;
      }

      // Get or create chat
      const chat = await chatService.getOrCreateChat(senderId, receiverId);

      // Save message
      const message = await messageService.sendMessage({
        chatId: chat._id,
        sender: senderId,
        receiver: receiverId,
        type,
        text,
        attachments,
        replyTo
      });

      // Send to sender
      socket.emit("chat:sent", message);

      // Send to receiver
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("chat:receive", message);

        // Mark delivered instantly
        await messageService.markDelivered(message._id, receiverId);

        // Notify sender
        io.to(socket.id).emit("message:delivered", {
          messageId: message._id,
          to: receiverId
        });
      }

    } catch (err) {
      console.error("chat:send error:", err);
      socket.emit("chat:error", { message: "Send failed" });
    }
  });

  // 2️⃣ TYPING INDICATOR
  socket.on("chat:typing", ({ to, chatId, isTyping = true }) => {
    try {
      const receiverSocketId = onlineUsers.get(to);
      if (!receiverSocketId) return;

      io.to(receiverSocketId).emit("chat:typing", {
        from: socket.userId,
        chatId,
        isTyping
      });
    } catch (err) {
      console.error("chat:typing error:", err);
    }
  });

  // 3️⃣ MESSAGE DELIVERED
  socket.on("message:delivered", async ({ messageId, chatId }) => {
    try {
      const receiverId = socket.userId;

      // Mark delivered
      await messageService.markDelivered(messageId, receiverId);

      // Get message
      const message = await messageService.getMessageById(messageId);
      if (!message) return;

      const senderId = message.sender.toString();
      const senderSocketId = onlineUsers.get(senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("message:delivered", {
          messageId,
          chatId,
          to: receiverId
        });
      }

    } catch (err) {
      console.error("message:delivered error:", err);
    }
  });

  // 4️⃣ MESSAGE SEEN
  socket.on("message:seen", async ({ chatId }) => {
    try {
      const userId = socket.userId;

      await chatService.resetUnread(chatId, userId);
      const messages = await messageService.getMessages(chatId, 100);

      for (const msg of messages) {
        if (msg.sender.toString() !== userId.toString()) {
          await messageService.markSeen(msg._id, userId);

          const senderSocketId = onlineUsers.get(msg.sender.toString());
          if (senderSocketId) {
            io.to(senderSocketId).emit("message:seen", {
              messageId: msg._id,
              chatId,
              seenBy: userId
            });
          }
        }
      }

    } catch (err) {
      console.error("message:seen error:", err);
    }
  });

  // 5️⃣ LOAD HISTORY
  socket.on("chat:history", async ({ chatId, before, limit = 50 }) => {
    try {
      const userId = socket.userId;

      const isAllowed = await chatService.isUserParticipant(chatId, userId);
      if (!isAllowed) {
        return socket.emit("chat:error", { message: "Access denied" });
      }

      const messages = await messageService.getMessages(
        chatId,
        limit,
        before ? new Date(before) : null
      );

      socket.emit("chat:history", { chatId, messages });

    } catch (err) {
      console.error("chat:history error:", err);
    }
  });

  // =============================
  // Presence: User Offline
  // =============================
  socket.on("disconnect", async () => {
    onlineUsers.delete(userId);

    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: new Date()
    });

    console.log("User disconnected:", userId);

    io.emit("presence:update", {
      userId,
      isOnline: false,
      lastSeen: new Date()
    });
  });
});

// ====================================
// CONNECT DB + START SERVER
// ====================================
connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for other modules
export { io, onlineUsers };
