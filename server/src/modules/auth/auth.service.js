// server/src/modules/auth/auth.service.js

import { getIdentifierFromBody } from "./utils/identifier.utils.js";
import { otpRepository } from "../../database/repositories/otp.repo.js";
import { userRepository } from "../../database/repositories/user.repo.js";
import { OTPSender } from "./otp.sender.js";
import { signToken } from "../../utils/jwt.js";

// 6-digit OTP generator
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const AuthService = {
    // REQUEST OTP LOGIC
    requestOTP: async (body) => {
        // 1. Identify user login method and identifier
        const { method, identifier } = getIdentifierFromBody(body);

        // 2. Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        // 3. Store OTP in database (upsert)
        await otpRepository.upsertOTP(identifier, otp, method, expiresAt);

        // 4. Send OTP via email or phone (driver-based)
        await OTPSender.send(method, identifier, otp);

        // 5. Return response
        return {
            message: "OTP sent successfully",
            method,
            identifier,
        };
    },

    // -------------------------
    // VERIFY OTP LOGIC
    // -------------------------
    verifyOTP: async (body) => {
        const { method, identifier } = getIdentifierFromBody(body);
        const { otp } = body;

        // Step 1: OTP exist
        if (!otp) throw new Error("OTP is required.");

        // Step 1.1: Strict Checking
        if (typeof otp !== "string") throw new Error("Invalid OTP format.");

        // Step 2: Fetch OTP
        const otpEntry = await otpRepository.findByIdentifier(identifier);

        // Step 3: Ensure OTP exists
        if (!otpEntry) throw new Error("OTP not requested or expired.");

        // Step 4: Compare OTP
        if (otpEntry.otp !== otp) throw new Error("Invalid OTP.");

        // Step 5: Check expiry
        if (otpEntry.expiresAt < new Date()) throw new Error("OTP expired.");
        // Step 5.1: Delete OTP → correct
        await otpRepository.deleteOTP(identifier);

        // Step 6: Find or create user
        const user = await userRepository.findOrCreateUser(method, identifier);

        const token = signToken(user._id);

        return {
            message: "OTP verified successfully",
            token,
            user,
        };
    }

};
