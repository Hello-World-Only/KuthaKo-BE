// server/src/modules/auth/auth.service.js

import { getIdentifierFromBody } from "./utils/identifier.utils.js";
import { otpRepository } from "../../database/repositories/otp.repo.js";
import { userRepository } from "../../database/repositories/user.repo.js";
import { OTPSender } from "./otp.sender.js";
import { signToken } from "../../utils/jwt.js";
import { rateLimiter } from "./rate.limit.js";

// 6-digit OTP generator
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const AuthService = {

    // REQUEST OTP
    requestOTP: async (body) => {
        const { method, identifier } = getIdentifierFromBody(body);

        // ✅ Rate Limit → MUST GO HERE
        rateLimiter.checkRequestLimit(identifier);

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await otpRepository.upsertOTP(identifier, otp, method, expiresAt);
        await OTPSender.send(method, identifier, otp);

        return {
            message: "OTP sent successfully",
            method,
            identifier,
        };
    },

    // VERIFY OTP
    verifyOTP: async (body) => {
        const { method, identifier } = getIdentifierFromBody(body);
        const { otp } = body;

        if (!otp) throw new Error("OTP is required.");
        if (typeof otp !== "string") throw new Error("Invalid OTP format.");

        // 🔥 Prevent brute-force attacks
        rateLimiter.checkVerifyLimit(identifier);

        const otpEntry = await otpRepository.findByIdentifier(identifier);

        if (!otpEntry) throw new Error("OTP not requested or expired.");

        if (otpEntry.otp !== otp) {
            rateLimiter.addVerifyFail(identifier);
            throw new Error("Invalid OTP.");
        }

        if (otpEntry.expiresAt < new Date()) throw new Error("OTP expired.");

        await otpRepository.deleteOTP(identifier);

        // 🔥 Reset failed attempts on success
        rateLimiter.resetVerifyFails(identifier);

        const user = await userRepository.findOrCreateUser(method, identifier);
        const token = signToken(user._id);

        return {
            message: "OTP verified successfully",
            token,
            user,
        };
    },
};
