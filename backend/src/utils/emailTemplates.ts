
export const getOtpEmailTemplate = (otp: string, currentYear: number) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <div style="background: linear-gradient(135deg, #E55A44, #F27E63); padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">Đức Huy Education</h1>
            </div>

            <div style="padding: 40px 30px;">
                <h2 style="color: #333333; font-size: 22px; margin-top: 0;">Xác nhận địa chỉ Email</h2>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">Xin chào,</p>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">Cảm ơn bạn đã lựa chọn đồng hành cùng <strong>Đức Huy Education</strong>. Để hoàn tất quá trình đăng ký tài khoản, vui lòng sử dụng mã xác nhận (OTP) dưới đây:</p>

                <div style="margin: 25px 0; text-align: center;">
                    <span style="display: inline-block; background-color: #fef4f2; border: 2px dashed #E55A44; color: #E55A44; font-size: 30px; font-weight: bold; letter-spacing: 10px; padding: 15px 25px; border-radius: 8px;">
                        ${otp}
                    </span>
                </div>

                <p style="color: #555555; font-size: 15px; line-height: 1.6;">
                    <em>Mã xác nhận này có hiệu lực trong vòng <strong>5 phút</strong>.</em><br>
                    Vì lý do bảo mật, vui lòng không chia sẻ mã này cho bất kỳ ai.
                </p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                <p style="color: #E55A44; font-weight: 600; font-size: 14px; margin: 0 0 5px 0;">Hệ thống dạy và học chất lượng cao</p>
                <p style="color: #bbbbbb; font-size: 12px; margin: 0;">© ${currentYear} Đức Huy Education. All rights reserved.</p>
            </div>

        </div>
    </div>
  `;
};