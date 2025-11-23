// src/modules/qr/qr.controller.js

import crypto from "crypto";
import { QrToken } from "../../database/models/QrToken.js";
import { appConfig } from "../../config/appConfig.js";

export const generateQr = async (req, res) => {
    try {
        const userId = req.user._id;

        const token = crypto.randomBytes(16).toString("hex");
        const expiresAt = new Date(Date.now() + appConfig.qrExpirySeconds * 1000);

        await QrToken.create({
            token,
            user: userId,
            expiresAt,
        });

        res.json({
            success: true,
            qrToken: token,
            expiresIn: appConfig.qrExpirySeconds,
            expiresAt,
        });
    } catch (err) {
        console.error("QR Generate Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to generate QR token",
        });
    }
};
