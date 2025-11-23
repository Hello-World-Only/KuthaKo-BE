import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ]
    },
    { timestamps: true }
);

export const Connection = mongoose.model("Connection", ConnectionSchema);
