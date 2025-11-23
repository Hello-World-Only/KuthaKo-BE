// server/src/modules/auth/drivers/sms.driver.js

import twilio from "twilio";

export const smsDriver = async ({ to }) => {
    const {
        TWILIO_VERIFY_SID,
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
    } = process.env;

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    try {
        // Twilio Verify → this sends OTP automatically
        await client.verify.v2.services(TWILIO_VERIFY_SID)
            .verifications
            .create({
                to,
                channel: "sms",
            });

        console.log("OTP SMS sent →", to);
    } catch (error) {
        console.error("Twilio Verify Error:", error.message);
        throw new Error("Failed to send OTP SMS");
    }
};
