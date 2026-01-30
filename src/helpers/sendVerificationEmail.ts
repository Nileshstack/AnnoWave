import nodemailer from "nodemailer";
import { ApiReasponse } from "@/types/ApiResponse";
import verificationEmail from "../../emails/verificationEmail"

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiReasponse> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AnonWave" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: verificationEmail(username, verifyCode),
    });

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("NODEMAILER ERROR 👉", error);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}
