import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendActivationMail = async (to, link) => {
  try {
    await transporter.sendMail({
      from: `"MarketPlace" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Activate your ShopCare account",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Welcome to ShopCare!</h2>
          <p>Click the link below to activate your account:</p>
          <p>
            <a href="${link}" target="_blank" style="color: #1a73e8; text-decoration: underline;">
              Click here to verify your email
            </a>
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error("Failed to send email:", error); // you had `err` here
    throw new ApiError(500, "Email could not be sent");
  }
};
