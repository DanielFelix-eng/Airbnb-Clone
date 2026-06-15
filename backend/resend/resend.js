
 
  

   import { sendEmail } from "../utils/sendEmail.js";
import { EmailVerification } from '../templates/emailtemplates.js';

const verificationUrl = "http://localhost:3000/verifyEmail";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const html = EmailVerification(
      `${verificationUrl}?token=${verificationToken}`,
      verificationToken
    );

    await sendEmail({
      to: email, 
      subject: "Verify your Email Address",
      html,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error; 
  }
};