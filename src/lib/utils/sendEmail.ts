import { getTransporter } from "./transporter";


export async function sendEmail(to: string, subject: string, html: string) {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
        from: `"Nasiej" <${process.env.emailSender}>`,
        to,
        subject,
        html,
    });
    return {
        success: info.accepted.length > 0,
        messageId: info.messageId,
    };
}
