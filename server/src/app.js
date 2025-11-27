// server/src/app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "express-async-errors";

import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import qrRoutes from "./modules/qr/qr.routes.js";
import connectionRoutes from "./modules/connections/connections.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";

const app = express();

app.set("trust proxy", 1);

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://kuthako.app"
  ],
  credentials: true,
}));
app.options("*", cors());

// Security
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Test
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Routes
app.use("/uploads", express.static("src/uploads"));
app.use("/api/v1", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/qr", qrRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/chat", chatRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;
