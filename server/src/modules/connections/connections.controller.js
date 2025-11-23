// src/modules/connections/connections.controller.js

import User from "../../database/models/user.model.js";
import { Connection } from "../../database/models/Connection.js";

export const getConnections = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .populate("contacts", "name email avatar status isOnline lastSeen")
            .lean();

        return res.json({
            success: true,
            total: user.contacts.length,
            contacts: user.contacts,
        });

    } catch (err) {
        console.error("Get Connections Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to load contacts",
        });
    }
};


export const removeConnection = async (req, res) => {
    try {
        const userA = req.user._id;
        const { userId } = req.body; // userB

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        // 1. Delete connection doc
        const deleted = await Connection.findOneAndDelete({
            users: { $all: [userA, userId] }
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Connection not found"
            });
        }

        // 2. Remove each other from contacts
        await User.findByIdAndUpdate(userA, {
            $pull: { contacts: userId }
        });

        await User.findByIdAndUpdate(userId, {
            $pull: { contacts: userA }
        });

        return res.json({
            success: true,
            message: "Connection removed successfully"
        });

    } catch (err) {
        console.error("Remove Connection Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to remove connection"
        });
    }
};
