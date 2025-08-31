const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
console.log("Email User:",process.env.EMAIL_USER);
console.log("Email Password:",process.env.EMAIL_PASS);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`
  };
try{
await transporter.sendMail(mailOptions);
console.log("Email sent successfully");
}catch(err)
{
  console.log(err);
}
  
};

module.exports = sendOTP;