// server/src/modules/auth/drivers/email.driver.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailDriver = async ({ to, subject, text }) => {
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to,
            subject,
            text,
        });

        console.log("OTP Email sent →", to);
    } catch (error) {
        console.error("Resend Email Error:", error.message);
        throw new Error("Failed to send OTP Email");
    }
};
