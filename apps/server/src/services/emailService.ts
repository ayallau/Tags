import nodemailer, { type Transporter, type SendMailOptions } from "nodemailer";
import config from "../config.js";

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Create transporter (in development - using Ethereal Email Test Account)
const createTransporter = async (): Promise<Transporter> => {
  if (process.env.NODE_ENV === "development") {
    // בפיתוח - יצירת test account דינמי ב-Ethereal Email
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    // בייצור - הגדרות אמיתיות
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
};

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string | null
): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();

    const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`;

    const mailOptions: SendMailOptions = {
      from: '"Your App" <noreply@yourapp.com>',
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${name || "User"},</p>
        <p>You have requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p><small>This is an automated message, please do not reply.</small></p>
      `,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL: %s", previewUrl);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return { success: true, messageId: String(info.messageId || "") };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Email sending failed:", error);
    return { success: false, error: errorMessage };
  }
}

export async function sendPasswordResetConfirmationEmail(
  email: string,
  name: string | null
): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();

    const mailOptions: SendMailOptions = {
      from: '"Your App" <noreply@yourapp.com>',
      to: email,
      subject: "Password Reset Successful",
      html: `
        <h2>Password Reset Successful</h2>
        <p>Hello ${name || "User"},</p>
        <p>Your password has been successfully reset.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
        <hr>
        <p><small>This is an automated message, please do not reply.</small></p>
      `,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL: %s", previewUrl);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return { success: true, messageId: String(info.messageId || "") };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Email sending failed:", error);
    return { success: false, error: errorMessage };
  }
}
