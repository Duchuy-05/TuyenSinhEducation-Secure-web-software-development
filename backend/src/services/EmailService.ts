import nodemailer from "nodemailer";
import { getOtpEmailTemplate } from "../utils/emailTemplates"; // import hàm tạo template email

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  static async sendOtpEmail(toEmail: string, otp: string) {
    const currentYear = new Date().getFullYear();

    const mailOptions = {
      from: `"Đức Huy Education" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Mã xác nhận tài khoản Đức Huy Education",
      // Gọi hàm và truyền dữ liệu động vào HTML
      html: getOtpEmailTemplate(otp, currentYear),
    };

    await this.transporter.sendMail(mailOptions);
  }
}