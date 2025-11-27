// src/modules/qr/qr.controller.js

import crypto from "crypto";
import { appConfig } from "../../config/appConfig.js";
import { QrToken } from "../../database/models/QrToken.js";
import { ConnectionRequest } from "../../database/models/ConnectionRequest.js";
import Connection from "../../database/models/Connection.js";
import User from "../../database/models/user.model.js";
import Chat from "../../database/models/chat.model.js";



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


// // ============================
// // STEP 5: ACCEPT CONNECTION REQUEST
// // ============================
// export const acceptQrRequest = async (req, res) => {
//     try {
//         const userA = req.user._id;
//         const { requestId } = req.body;

//         // 1. Find request
//         const reqDoc = await ConnectionRequest.findById(requestId);

//         if (!reqDoc) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Request not found"
//             });
//         }

//         // Only User A (the 'to') can accept
//         if (reqDoc.to.toString() !== userA.toString()) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You cannot accept this request"
//             });
//         }

//         // Must be pending
//         if (reqDoc.status !== "PENDING") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Request already processed"
//             });
//         }

//         const userB = reqDoc.from;

//         // 2. Create connection
//         const connection = await Connection.create({
//             users: [userA, userB]
//         });

//         // 3. Update request status
//         reqDoc.status = "ACCEPTED";
//         await reqDoc.save();

//         // 4. Add each other to contacts
//         await User.findByIdAndUpdate(userA, {
//             $addToSet: { contacts: userB }
//         });

//         await User.findByIdAndUpdate(userB, {
//             $addToSet: { contacts: userA }
//         });

//         return res.json({
//             success: true,
//             status: "CONNECTED",
//             connectionId: connection._id
//         });

//     } catch (err) {
//         console.error("Accept QR request error:", err);
//         res.status(500).json({
//             success: false,
//             message: "Failed to accept request"
//         });
//     }
// };

// ============================
// STEP 5: ACCEPT CONNECTION REQUEST
// ============================
export const acceptQrRequest = async (req, res) => {
    try {
        const userA = req.user._id;
        const { requestId } = req.body;

        // 1. Find request
        const reqDoc = await ConnectionRequest.findById(requestId);

        if (!reqDoc) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        // Only User A (the 'to') can accept
        if (reqDoc.to.toString() !== userA.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot accept this request"
            });
        }

        // Must be pending
        if (reqDoc.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Request already processed"
            });
        }

        const userB = reqDoc.from;

        // 2. Create connection
        const connection = await Connection.create({
            users: [userA, userB]
        });

        // 3. Update request status
        reqDoc.status = "ACCEPTED";
        await reqDoc.save();

        // 4. Add each other to contacts
        await User.findByIdAndUpdate(userA, {
            $addToSet: { contacts: userB }
        });

        await User.findByIdAndUpdate(userB, {
            $addToSet: { contacts: userA }
        });

        // ================================
        // 5. CREATE CHAT (THIS WAS MISSING)
        // ================================
        const chat = await Chat.create({
            participants: [userA, userB],
        });

        return res.json({
            success: true,
            status: "CONNECTED",
            connectionId: connection._id,
            chatId: chat._id   // 🚀 return chat ID
        });

    } catch (err) {
        console.error("Accept QR request error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to accept request"
        });
    }
};

// ============================
// STEP 6 — Get Pending Request
// ============================
export const getPendingQrRequest = async (req, res) => {
    try {
        const userA = req.user._id;

        // 1. Find active QR for User A
        const qrDoc = await QrToken.findOne({ user: userA });

        if (!qrDoc) {
            return res.json({
                success: true,
                pendingRequest: null,
                qrExpired: true,
            });
        }

        const now = new Date();

        // 2. If QR EXPIRED → delete QR + delete pending requests
        if (qrDoc.expiresAt < now) {
            await QrToken.deleteOne({ _id: qrDoc._id });
            await ConnectionRequest.deleteMany({ to: userA, status: "PENDING" });

            return res.json({
                success: true,
                pendingRequest: null,
                qrExpired: true,
            });
        }

        // 3. Get the single pending request (only one allowed)
        const pendingReq = await ConnectionRequest.findOne({
            to: userA,
            status: "PENDING",
        }).populate("from", "name email avatar");

        return res.json({
            success: true,
            pendingRequest: pendingReq
                ? {
                    _id: pendingReq._id,
                    from: pendingReq.from,
                    createdAt: pendingReq.createdAt,
                }
                : null,
            expiresAt: qrDoc.expiresAt,
            qrExpired: false,
        });

    } catch (err) {
        console.error("Get Pending Request Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to get pending request",
        });
    }
};
