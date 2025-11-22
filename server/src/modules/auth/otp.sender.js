// server/src/modules/auth/otp.sender.js

export const OTPSender = {
    send: async (method, identifier, otp) => {
        const message = `Your Kuthako verification code is ${otp}. It will expire in 5 minutes.`;

        if (method === "phone") {
            return smsDriver({ to: identifier, message });
        }

        if (method === "email") {
            return emailDriver({
                to: identifier,
                subject: "Your Kuthako Verification Code",
                text: message,
            });
        }

        throw new Error("Invalid OTP delivery method");
    }
};
