// src/modules/qr/qr.routes.js

import express from "express";
import { generateQr } from "./qr.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/generate", authMiddleware, generateQr);

export default router;

