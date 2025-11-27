// src/modules/qr/qr.routes.js
import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import {
    generateQr,
    scanQr,
    acceptQrRequest,
    getPendingQrRequest
} from "./qr.controller.js";

const router = Router();

router.post("/generate", auth, generateQr);
router.post("/scan", auth, scanQr);
router.post("/accept", auth, acceptQrRequest);
router.get("/pending", auth, getPendingQrRequest);

export default router;
