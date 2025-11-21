// server/src/database/models/otp.model.js

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            index: true,
            unique: true, // Only one active OTP per identifier
        },

        otp: {
            type: String,
            required: true,
        },

        method: {
            type: String,
            enum: ["email", "phone"],
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true, // adds createdAt, updatedAt
    }
);

// No TTL here (we manually check expiry for full control)

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
