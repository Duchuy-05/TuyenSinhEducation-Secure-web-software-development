import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { AppDataSource } from "../models/DataSource";
import { User, UserRole } from "../models/entities/User";
import { EmailService } from "./EmailService";

export class AuthService {
  private static userRepository = AppDataSource.getRepository(User);

  // Logic Đăng ký
  static async registerUser(name: string, email: string, password: string) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      throw { status: 400, message: "Mật khẩu phải tối thiểu 6 ký tự, gồm chữ hoa và ký tự đặc biệt!" };
    }

    const existingUser = await this.userRepository.findOneBy({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      if (existingUser.isVerified) {
        throw { status: 400, message: "Email này đã được đăng ký!" };
      } else {
        existingUser.fullName = name;
        existingUser.passwordHash = hashedPassword;
        existingUser.otp = otp;
        existingUser.otpExpiresAt = otpExpiresAt;

        await this.userRepository.save(existingUser);
        await EmailService.sendOtpEmail(email, otp);

        return { message: "Vui lòng kiểm tra email để nhận mã xác thực mới!" };
      }
    }

    const newUser = new User();
    newUser.fullName = name;
    newUser.email = email;
    newUser.passwordHash = hashedPassword;
    newUser.role = UserRole.STUDENT;
    newUser.isVerified = false;
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
      throw { status: 404, message: "Người dùng không tồn tại!" };
    }
    if (user.isVerified) {
      throw { status: 400, message: "Tài khoản đã được xác thực!" };
    }
    if (user.otp !== otp) {
      throw { status: 400, message: "Mã xác nhận không chính xác!" };
    }
    if (user.otpExpiresAt < new Date()) {
      throw { status: 400, message: "Mã xác nhận đã hết hạn. Vui lòng đăng ký lại để nhận mã mới!" };
    }

    user.isVerified = true;
    user.otp = "";
    user.otpExpiresAt = new Date();

    await this.userRepository.save(user);

    return { message: "Xác thực tài khoản thành công!" };
  }

  // Logic đăng nhập
  static async loginUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw { status: 401, message: "Email hoặc mật khẩu không đúng!" };
    }
    if (!user.isVerified) {
      throw { status: 403, message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email hoặc đăng ký lại để nhận mã!" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw { status: 401, message: "Email hoặc mật khẩu không đúng!" };
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
      const decoded: any = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET!);

      const user = await this.userRepository.findOneBy({ id: decoded.id });
      if (!user) {
        throw { status: 403, message: "Tài khoản không tồn tại!" };
      }

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role, fullName: user.fullName },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
      );

      return newAccessToken;
    } catch (error) {
      throw { status: 403, message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!" };
    }
  }

  // ==============================
  // LOGIC ĐĂNG NHẬP VỚI GOOGLE
  // ==============================
  static async loginWithGoogle(accessTokenFromClient: string) {
    let payload: any;
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessTokenFromClient}`,
        },
      });
      payload = response.data;
    } catch (error) {
      throw { status: 401, message: "Token Google không hợp lệ hoặc đã hết hạn!" };
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      throw { status: 400, message: "Không thể lấy email từ tài khoản Google!" };
    }

    let user = await this.userRepository.findOneBy({ googleId });

    if (!user) {
      user = await this.userRepository.findOneBy({ email });

      if (user) {
        user.googleId = googleId!;
        if (picture && !user.avatarUrl) user.avatarUrl = picture;
        user.isVerified = true;
        await this.userRepository.save(user);
      } else {
        const newUser = new User();
        newUser.fullName = name || "Người dùng Google";
        newUser.email = email;
        newUser.googleId = googleId!;
        newUser.avatarUrl = picture || "";
        newUser.role = UserRole.STUDENT;
        newUser.isVerified = true;
        newUser.otp = "";
        newUser.otpExpiresAt = new Date();

        user = await this.userRepository.save(newUser);
      }
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
}