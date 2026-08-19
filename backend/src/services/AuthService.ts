import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
// import { OAuth2Client } from "google-auth-library";
import { AppDataSource } from "../models/DataSource";
import { User, UserRole } from "../models/entities/User";
import { EmailService } from "./EmailService";

// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  private static userRepository = AppDataSource.getRepository(User);

  // Logic Đăng ký
  static async registerUser(name: string, email: string, password: string) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error("Mật khẩu phải tối thiểu 6 ký tự, gồm chữ hoa và ký tự đặc biệt!");
    }

    const existingUser = await this.userRepository.findOneBy({ email });
    
    // Tạo OTP và thời hạn 5 phút
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      // Trường hợp 1: Đã tồn tại và đã xác thực
      if (existingUser.isVerified) {
        throw new Error("Email này đã được đăng ký!");
      } 
      // Trường hợp 2: Đã tồn tại nhưng chưa xác thực 
      else {
        existingUser.fullName = name;
        existingUser.passwordHash = hashedPassword;
        existingUser.otp = otp;
        existingUser.otpExpiresAt = otpExpiresAt;

        await this.userRepository.save(existingUser);
        await EmailService.sendOtpEmail(email, otp);
        
        return { message: "Vui lòng kiểm tra email để nhận mã xác thực mới!" };
      }
    }

    // Trường hợp 3: Email hoàn toàn mới -> Tạo User mới
    const newUser = new User();
    newUser.fullName = name;
    newUser.email = email;
    newUser.passwordHash = hashedPassword;
    newUser.role = UserRole.STUDENT;
    newUser.isVerified = false; // Đánh dấu là chưa xác thực
    newUser.otp = otp;
    newUser.otpExpiresAt = otpExpiresAt;

    await this.userRepository.save(newUser);
    await EmailService.sendOtpEmail(email, otp);

    return { message: "Vui lòng kiểm tra email để nhận mã xác thực!" };
  }
  // ==============================
  // LOGIC XÁC THỰC OTP
  // ==============================
  static async verifyOtp(email: string, otp: string) {
    const user = await this.userRepository.findOneBy({ email });
    
    if (!user) {
        throw new Error("Người dùng không tồn tại!");
    }
    if (user.isVerified) {
        throw new Error("Tài khoản đã được xác thực!");
    }
    if (user.otp !== otp) {
        throw new Error("Mã xác nhận không chính xác!");
    }
    if (user.otpExpiresAt < new Date()) {
        throw new Error("Mã xác nhận đã hết hạn. Vui lòng đăng ký lại để nhận mã mới!");
    }

    // Nếu mã đúng và còn hạn -> Cập nhật trạng thái tài khoản
    user.isVerified = true;
    user.otp = ""; // Xóa mã OTP để bảo mật
    user.otpExpiresAt = new Date(); // Cập nhật thời gian hết hạn thành thời điểm hiện tại

    await this.userRepository.save(user);
    
    return { message: "Xác thực tài khoản thành công!" };
  }

  // Logic đăng nhập
  static async loginUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng!");
    }
    if (!user.isVerified) {
      throw new Error("Tài khoản chưa được xác thực. Vui lòng kiểm tra email hoặc đăng ký lại để nhận mã!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Email hoặc mật khẩu không đúng!");
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role, fullName: user.fullName },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    return { user, accessToken, refreshToken };
  }

  // Logic refresh token
  static async verifyAndRefreshToken(oldRefreshToken: string) {
    try {
      // Xác thực token đồng bộ
      const decoded: any = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET!);
      
      const user = await this.userRepository.findOneBy({ id: decoded.id });
      if (!user) {
        throw new Error("Tài khoản không tồn tại!");
      }

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role, fullName: user.fullName },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
      );

      return newAccessToken;
    } catch (error) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
    }
  }
  // ==============================
  // LOGIC ĐĂNG NHẬP VỚI GOOGLE
  // ==============================
  static async loginWithGoogle(accessTokenFromClient: string) {
    // 1. Dùng access_token để lấy thông tin user từ Google
    let payload: any;
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessTokenFromClient}`,
        },
      });
      payload = response.data;
    } catch (error) {
      throw new Error("Token Google không hợp lệ hoặc đã hết hạn!");
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      throw new Error("Không thể lấy email từ tài khoản Google!");
    }

    // 2. Tìm user theo googleId trước (đã từng đăng nhập Google)
    let user = await this.userRepository.findOneBy({ googleId });

    if (!user) {
      // 3. Tìm theo email (Phương án A: liên kết tài khoản cũ)
      user = await this.userRepository.findOneBy({ email });

      if (user) {
        // Email tồn tại → Liên kết Google ID vào tài khoản cũ
        user.googleId = googleId!;
        if (picture && !user.avatarUrl) user.avatarUrl = picture;
        user.isVerified = true; // Đảm bảo tài khoản được xác thực
        await this.userRepository.save(user);
      } else {
        // 4. Email hoàn toàn mới → Tạo tài khoản mới từ Google
        const newUser = new User();
        newUser.fullName = name || "Người dùng Google";
        newUser.email = email;
        newUser.googleId = googleId!;
        newUser.avatarUrl = picture || "";
        newUser.role = UserRole.STUDENT;
        newUser.isVerified = true; // Google đã xác thực email rồi
        newUser.otp = "";
        newUser.otpExpiresAt = new Date();

        user = await this.userRepository.save(newUser);
      }
    }

    // 5. Tạo JWT nội bộ như flow đăng nhập thường
    const accessToken = jwt.sign(
      { id: user.id, role: user.role, fullName: user.fullName },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    return { user, accessToken, refreshToken };
  }
}
