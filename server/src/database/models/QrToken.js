// src/database/models/QrToken.js

import mongoose from "mongoose";

const QrTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        meta: {
            type: Object,
            default: {},
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true, // adds createdAt, updatedAt automatically
    }
);

// TTL index — MongoDB auto-removes after expiresAt
QrTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const QrToken = mongoose.model("QrToken", QrTokenSchema);
