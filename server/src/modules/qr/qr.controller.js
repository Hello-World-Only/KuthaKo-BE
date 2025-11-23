// src/modules/qr/qr.controller.js

import crypto from "crypto";
import { appConfig } from "../../config/appConfig.js";
import { QrToken } from "../../database/models/QrToken.js";
import { ConnectionRequest } from "../../database/models/ConnectionRequest.js";

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


// 
export const scanQr = async (req, res) => {
    try {
        const scannerUserId = req.user._id; // User B
        const { qrToken } = req.body;

        // 1. Find QR token
        const tokenDoc = await QrToken.findOne({ token: qrToken });

        if (!tokenDoc) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired QR token",
            });
        }

        // 2. Extract owner (User A)
        const qrOwnerId = tokenDoc.user.toString();

        // Prevent scanning own QR
        if (qrOwnerId === scannerUserId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot scan your own QR",
            });
        }

        // 3. Create connection request
        const request = await ConnectionRequest.create({
            from: scannerUserId,
            to: qrOwnerId,
        });

        // 4. Optionally delete token (single-use)
        await QrToken.deleteOne({ _id: tokenDoc._id });

        return res.json({
            success: true,
            status: "REQUEST_SENT",
            requestId: request._id,
        });
    } catch (err) {
        console.error("QR Scan Error:", err);
        res.status(500).json({
            success: false,
            message: "QR scan failed",
        });
    }
};
