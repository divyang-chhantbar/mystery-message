// helpers/sendVerificationEmail.ts
import transporter from "@/lib/smtpTransporter";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailHTML = `
      <html lang="en" dir="ltr">
        <head>
          <title>Verification Code</title>
        </head>
        <body>
          <h2>Hello ${username},</h2>
          <p>Your verification code is: <strong>${verifyCode}</strong></p>
          <p>Please use this code to verify your account.</p>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER, // Your Gmail address
      to: email,
      subject: 'Mystery Verification Code',
      html: emailHTML,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
