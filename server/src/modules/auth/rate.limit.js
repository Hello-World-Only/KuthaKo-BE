// src/modules/auth/rate-limit.js

// In-memory OTP rate limits
const otpRateLimits = new Map(); // { identifier: { lastRequest, hourlyCount, dailyCount, verifyFails } }

// Helper to reset counters
const resetIfNeeded = (record) => {
    const now = Date.now();

    // Reset hourly count every hour
    if (!record.hourStart || now - record.hourStart > 60 * 60 * 1000) {
        record.hourStart = now;
        record.hourlyCount = 0;
    }

    // Reset daily count every 24 hours
    if (!record.dayStart || now - record.dayStart > 24 * 60 * 60 * 1000) {
        record.dayStart = now;
        record.dailyCount = 0;
    }
};

export const rateLimiter = {
    // ============================
    // REQUEST OTP LIMITS
    // ============================
    checkRequestLimit(identifier) {
        const now = Date.now();
        let record = otpRateLimits.get(identifier);

        if (!record) {
            record = {
                lastRequest: 0,
                hourlyCount: 0,
                dailyCount: 0,
                hourStart: now,
                dayStart: now,
                verifyFails: 0,
            };
            otpRateLimits.set(identifier, record);
        }

        resetIfNeeded(record);

        // 1. Cooldown: 30 seconds
        if (now - record.lastRequest < 30 * 1000) {
            const wait = Math.ceil((30 * 1000 - (now - record.lastRequest)) / 1000);
            throw new Error(`Please wait ${wait} seconds before requesting another OTP.`);
        }

        // 2. Hourly limit: 5 OTPs per hour
        if (record.hourlyCount >= 5) {
            throw new Error("Too many OTP requests. Try again in 1 hour.");
        }

        // 3. Daily limit: 15 OTPs per day
        if (record.dailyCount >= 15) {
            throw new Error("Daily OTP limit reached. Try again tomorrow.");
        }

        // Passed limit checks — update usage
        record.lastRequest = now;
        record.hourlyCount++;
        record.dailyCount++;

        otpRateLimits.set(identifier, record);
    },

    // ============================
    // VERIFY OTP LIMITS
    // ============================
    checkVerifyLimit(identifier) {
        let record = otpRateLimits.get(identifier);

        if (!record) {
            record = { verifyFails: 0 };
            otpRateLimits.set(identifier, record);
        }

        if (record.verifyFails >= 5) {
            throw new Error("Too many failed attempts. Try again in 10 minutes.");
        }
    },

    addVerifyFail(identifier) {
        const record = otpRateLimits.get(identifier) || { verifyFails: 0 };
        record.verifyFails += 1;
        otpRateLimits.set(identifier, record);
    },

    resetVerifyFails(identifier) {
        const record = otpRateLimits.get(identifier);
        if (record) {
            record.verifyFails = 0;
            otpRateLimits.set(identifier, record);
        }
    }
};
