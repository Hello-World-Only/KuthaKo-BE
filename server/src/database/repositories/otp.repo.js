// server/src/database/repositories/otp.repo.js

import OTP from "../models/otp.model.js";

export const otpRepository = {
    // Find existing OTP by identifier
    findByIdentifier: async (identifier) => {
        return await OTP.findOne({ identifier });
    },

    // Create or update OTP (upsert)
    upsertOTP: async (identifier, otp, method, expiresAt) => {
        return await OTP.findOneAndUpdate(
            { identifier },
            { otp, method, expiresAt },
            { new: true, upsert: true }
        );
    },

    // Delete used/expired OTP
    deleteOTP: async (identifier) => {
        return await OTP.deleteOne({ identifier });
    },
};
