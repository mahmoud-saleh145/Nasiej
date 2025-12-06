"use server";
import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.emailSender,
            pass: process.env.emailSenderPassword,
        },
    });

    const info = await transporter.sendMail({
        from: `"Nasiej" <${process.env.emailSender}>`,
        to,
        subject,
        html,
    });

    return info.accepted.length > 0;
}
