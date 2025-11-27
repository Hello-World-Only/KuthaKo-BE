// src/database/models/chat.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const UnreadCountSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        count: { type: Number, default: 0 }
    },
    { _id: false }
);

const ChatSchema = new Schema(
    {
        // participants: usually [userAId, userBId] for one-to-one chat
        participants: [
            { type: Schema.Types.ObjectId, ref: "User", required: true }
        ],

        // lastMessage is a denormalized quick reference to the latest message
        lastMessage: {
            _id: { type: Schema.Types.ObjectId, ref: "Message" },
            sender: { type: Schema.Types.ObjectId, ref: "User" },
            text: { type: String },
            type: { type: String }, // "text"|"image"|"video" etc.
            createdAt: { type: Date }
        },

        // unread counts per participant (useful for list view)
        unread: {
            type: [UnreadCountSchema],
            default: []
        },

        // for future: group support
        isGroup: { type: Boolean, default: false },
        groupMeta: {
            name: { type: String },
            avatar: { type: String },
            admins: [{ type: Schema.Types.ObjectId, ref: "User" }]
        },

        // allow soft-delete or archiving if you want
        archivedFor: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    {
        timestamps: true
    }
);

// Indexes
ChatSchema.index({ participants: 1 });
ChatSchema.index({ updatedAt: -1 });
ChatSchema.index({ "lastMessage.createdAt": -1 });

// Helper: find chat by exact two participants (order-insensitive)
ChatSchema.statics.findOneToOne = function (userA, userB) {
    return this.findOne({
        isGroup: false,
        participants: { $all: [userA, userB], $size: 2 }
    });
};

export default mongoose.model("Chat", ChatSchema);
