// server/src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import { userRepository } from "../database/repositories/user.repo.js";

export default async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Authorization token missing",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        }

        const user =
            (await userRepository.findById?.(decoded.id)) ||
            (await userRepository.findByIdentifier("id", decoded.id));

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found",
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized: " + error.message,
        });
    }
}
