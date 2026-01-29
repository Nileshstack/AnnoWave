import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/verificationEmail"
import { ApiReasponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string, 
    username: string,
    verifyCode: string
): Promise<ApiReasponse> {
    try {
         const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'verify your email address',
    react: verificationEmail({ username, otp: verifyCode })
  });

        return{
            success: true,
            message: " Sent verification email successfully."
        }
        
    } catch (error) {
        console.error("Error sending verification email:", error);
        return{
            success: false,
            message: "Failed to send verification email."
        }
    }
}

