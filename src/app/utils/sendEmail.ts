import nodemailer from "nodemailer";
import config from "../../config/index.js";

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.email.address,
        pass: config.email.password,
      },
    });

    const info = await transporter.sendMail({
      from: config.email.address, // sender address
      to, // list of receivers
      subject: `${subject} - HiredNow`, // Subject line
      text: "", // plain text body
      html, // html body
    });

    if (info.accepted.length > 0) {
      return {
        success: true,
        messageId: info.messageId,
        accepted: info.accepted,
        response: info.response,
      };
    } else {
      return {
        success: false,
        message: "Email not sent!",
      };
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
