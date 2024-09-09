import { resend } from "@/lib/resend";
import VerificationEmail from "../../emailTemplate/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

// we have to send the verification email
export async function sendVerificationEmail(
    email :string,
    username : string,
    verifyCode : string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Verification Code',
            react: VerificationEmail({username,otp: verifyCode}),
          });
        return {success:true , message:"Verification Email send successfully"}

    } catch (emailError) {
        console.error("Error sending verification email",emailError);
        return {success:false , message:"Failed to send verification email"}
    }
}
