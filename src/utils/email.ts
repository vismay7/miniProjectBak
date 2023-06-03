import nodemailer from "nodemailer";

export async function otpVerificationMail(email: string, otp: number) {
  const mail = {
    from: process.env.SMTP_USER,
    to: email,
    subject: `Coursera, here's your OTP to verify your email address with tyeb`,
    text: `please enter following OTP : ${otp}`,
  };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  transporter.sendMail(mail, (err) => {
    if (err) {
      return new Error("Mail is not Found");
    } else {
      return true;
    }
  });
  console.log(`email send to : ${email} and ${otp}`);
}
