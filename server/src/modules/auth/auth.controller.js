// server/src/modules/auth/auth.controller.js
import { AuthService } from "./auth.service.js";
import { phonePrefixes } from "../../constants/phonePrefixes.js";

export const AuthController = {
    requestOTP: async (req, res) => {
        try {
            const result = await AuthService.requestOTP(req.body);

            return res.status(200).json({
                success: true,
                ...result,
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    verifyOTP: async (req, res) => {
        try {
            const result = await AuthService.verifyOTP(req.body);

            return res.status(200).json({
                success: true,
                ...result,
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },
};

// Phone: Get: Common Country Prefix 
export const getPhonePrefixes = (req, res) => {
    return res.json({
        success: true,
        prefixes: phonePrefixes
    });
};