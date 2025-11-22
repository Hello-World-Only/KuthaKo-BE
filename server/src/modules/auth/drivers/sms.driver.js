// server/src/modules/auth/drivers/sms.driver.js

import twilio from "twilio";

export const smsDriver = async ({ to, message }) => {
    const {
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_SERVICE_SID,
    } = process.env;

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    try {
        await client.messages.create({
            messagingServiceSid: TWILIO_SERVICE_SID,
            to,
            body: message,
        });

        console.log("OTP SMS sent →", to);
    } catch (error) {
        console.error("Twilio SMS Error:", error.message);
        throw new Error("Failed to send OTP SMS");
    }
};
