// server/src/modules/auth/otp.sender.js

import { smsDriver } from "./drivers/sms.driver.js";
import { emailDriver } from "./drivers/email.driver.js";

export const OTPSender = {
    send: async (method, identifier, otp) => {
        if (method === "phone") {
            return smsDriver.send(identifier, otp);
        }

        if (method === "email") {
            return emailDriver.send(identifier, otp);
        }

        throw new Error("Invalid OTP delivery method.");
    },
};
