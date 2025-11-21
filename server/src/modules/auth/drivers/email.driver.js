// server/src/modules/auth/drivers/email.driver.js

export const emailDriver = {
    send: async (email, otp) => {
        // Placeholder → replace with Nodemailer or any provider
        console.log(`📨 [EMAIL] Sending OTP to ${email} → ${otp}`);
        return true;
    }
};
