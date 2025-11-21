// server/src/database/models/otp.model.js

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            index: true,
            // DO NOT use unique: true (causes TTL conflicts)
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
        timestamps: true,
    }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
