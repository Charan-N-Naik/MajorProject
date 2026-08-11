const nodemailer = require("nodemailer");

module.exports.sendOTP = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("=========================================");
    console.log(`[DEV MODE] OTP generated for ${email}: ${otp}`);
    console.log("=========================================");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,     // Your Gmail
      pass: process.env.EMAIL_PASS      // Your Gmail App Password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Wanderlust - Login OTP Verification",
    text: `Your OTP for logging into Wanderlust is: ${otp}. It is valid for 5 minutes.`
  };
  await transporter.sendMail(mailOptions);
};
