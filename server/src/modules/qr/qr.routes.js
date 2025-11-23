// src/modules/qr/qr.routes.js

import express from "express";
import { scanQr } from "./qr.controller.js";
import { generateQr } from "./qr.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { acceptQrRequest } from "./qr.controller.js";
import { getPendingQrRequest } from "./qr.controller.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateQr);
router.post("/scan", authMiddleware, scanQr);
router.post("/accept", authMiddleware, acceptQrRequest);
router.get("/pending", authMiddleware, getPendingQrRequest);

export default router;

