// server/src/app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "express-async-errors"; // catches async errors

// ======================================== //
// Import routes (will convert routes to ESM later)
import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

// ======================================== //
// QR
import qrRoutes from "./modules/qr/qr.routes.js";



const app = express();

// Required when running behind Render proxy
app.set("trust proxy", 1);

// ======================================== //
// Middleware
app.use(cors({
  origin: "*",
  allowedHeaders: ["Authorization", "Content-Type"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================== //
// Rate limiter (basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// ======================================== //
// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// ======================================== //
// [==== API Routes ====] //
// Cloudinary: routes
app.use("/uploads", express.static("src/uploads"));

// All user routes are under /api/v1
app.use("/api/v1", userRoutes);

// Auth routes
app.use("/api/v1/auth", authRoutes);

// QR Routes
app.use("/qr", qrRoutes);

// ======================================== //
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;
