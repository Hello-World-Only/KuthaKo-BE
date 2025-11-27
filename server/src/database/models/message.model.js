// src/database/models/message.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const AttachmentSchema = new Schema(
    {
        filename: { type: String },
        url: { type: String, required: true },
        mimeType: { type: String },
        size: { type: Number }, // bytes
        width: { type: Number },
        height: { type: Number },
        duration: { type: Number } // for audio/video in seconds
    },
    { _id: false }
);

const DeliverySchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        at: { type: Date, default: Date.now }
    },
    { _id: false }
);

const SeenSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        at: { type: Date, default: Date.now }
    },
    { _id: false }
);

const MessageSchema = new Schema(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

        // optional receiver (useful for ephemeral one-to-one flows)
        receiver: { type: Schema.Types.ObjectId, ref: "User", index: true },

        // core content
        type: {
            type: String,
            enum: ["text", "image", "video", "audio", "file", "system"],
            default: "text"
        },
        text: { type: String, trim: true },

        // attachments for media/files
        attachments: { type: [AttachmentSchema], default: [] },

        // reply-to (message threading)
        replyTo: { type: Schema.Types.ObjectId, ref: "Message", default: null },

        // reactions (small map: userId -> emoji)
        reactions: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
                emoji: { type: String, required: true }
            }
        ],

        // delivery & seen tracking
        delivered: { type: [DeliverySchema], default: [] },
        seen: { type: [SeenSchema], default: [] },

        // soft-delete flag (per-user deletion handled elsewhere)
        deletedFor: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    {
        timestamps: true
    }
);

// Indexes
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ "attachments.url": 1 });

// helper to check if user has seen
MessageSchema.methods.isSeenBy = function (userId) {
    return this.seen.some((s) => s.userId.equals(userId));
};

// helper to add delivered/seen
MessageSchema.methods.addDelivered = function (userId) {
    if (!this.delivered.some((d) => d.userId.equals(userId))) {
        this.delivered.push({ userId, at: new Date() });
    }
};

MessageSchema.methods.addSeen = function (userId) {
    if (!this.seen.some((s) => s.userId.equals(userId))) {
        this.seen.push({ userId, at: new Date() });
    }
};

export default mongoose.model("Message", MessageSchema);
