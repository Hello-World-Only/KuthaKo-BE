// server/src/server.js

import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";

// NOTE:
// Redis import will be added later when (we) convert redis.js to ESM
// import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // adjust in production
    methods: ["GET", "POST"],
  },
});

// Example Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Connect to DB and Redis
connectDB();
// connectRedis();

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
