// server/src/modules/auth/drivers/sms.driver.js

export const smsDriver = {
    send: async (phoneNumber, otp) => {
        // Placeholder → replace with real SMS provider (Twilio, MSG91, etc.)
        console.log(`📱 [SMS] Sending OTP to ${phoneNumber} → ${otp}`);
        return true;
    }
};
