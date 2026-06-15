import { sendEmail } from "../utils/sendEmail.js";
import { WelcomeEmail, ResetPassword, ResetPasswordSuccess } from '../templates/emailtemplates.js';

export const sendWelcomeEmail = async (name, email, dashboardUrl) => {
  try {
    const html = WelcomeEmail(name, email, dashboardUrl);

    await sendEmail({
      to: email,
      subject: "Welcome to our service",
      html,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (name, email, resetUrl) => {
  try {
    const html = ResetPassword(name, email, resetUrl);

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html,
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
};
export const resetPasswordEmail = async(email) =>{ 
    try {
    const html = ResetPasswordSuccess(email);

    await sendEmail({
      to: email,
      subject: "password Reset successfull",
      html,
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
}