"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplates_1 = require("../utils/emailTemplates"); // import hàm tạo template email
class EmailService {
    static async sendOtpEmail(toEmail, otp) {
        const currentYear = new Date().getFullYear();
        const mailOptions = {
            from: `"Đức Huy Education" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "Mã xác nhận tài khoản Đức Huy Education",
            // Gọi hàm và truyền dữ liệu động vào HTML
            html: (0, emailTemplates_1.getOtpEmailTemplate)(otp, currentYear),
        };
        await this.transporter.sendMail(mailOptions);
    }
}
exports.EmailService = EmailService;
EmailService.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
