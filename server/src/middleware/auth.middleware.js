// server/src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import { userRepository } from "../database/repositories/user.repo.js";

export const authMiddleware = async (req, res, next) => {
    try {
        // 1. Extract token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Authorization token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        }

        // 3. Load user from DB
        const user = await userRepository.findById?.(decoded.id)
            || await userRepository.findByIdentifier("id", decoded.id); // fallback

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found",
            });
        }

        // 4. Attach user to request
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized: " + error.message,
        });
    }
};
