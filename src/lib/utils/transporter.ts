import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.emailSender,
        pass: process.env.emailSenderPassword,
    },
    pool: true,
    maxConnections: 1,
    maxMessages: 100,
});

let isVerified = false;

export async function getTransporter() {
    if (!isVerified) {
        await transporter.verify();
        isVerified = true;
    }
    return transporter;
}
