import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const isProduction = process.env.NODE_ENV === "production";

const crossSiteCookieOptions = {
  httpOnly: true,
  secure: isProduction, // Bắt buộc true ở môi trường Production (HTTPS)
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  path: "/", // 💡 THÊM PATH: Áp dụng Cookie cho toàn bộ Domain
};

const accessTokenCookieOptions = {
  ...crossSiteCookieOptions,
  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOptions = {
  ...crossSiteCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export class AuthController {

  // ==============================
  // 1. API REGISTER
  // ==============================
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      await AuthService.registerUser(name, email, password);

      return res.status(201).json({ message: "Đăng ký tài khoản thành công!" });
    } catch (error: any) {
      return res.status(400).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
    }
  }

  // ==============================
  // 2. API VERIFY OTP
  // ==============================
  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyOtp(email, otp);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
    }
  }

  // ==============================
  // 3. API LOGIN
  // ==============================
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await AuthService.loginUser(email, password);

      res.cookie("access_token", accessToken, accessTokenCookieOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      return res.status(200).json({
        message: "Đăng nhập thành công!",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error: any) {
      return res.status(401).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
    }
  }

  // ==============================
  // 4. API REFRESH TOKEN
  // ==============================
  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: "Chưa xác thực. Vui lòng đăng nhập lại!" });
      }

      const newAccessToken = await AuthService.verifyAndRefreshToken(refreshToken);
      res.cookie("access_token", newAccessToken, accessTokenCookieOptions);

      return res.status(200).json({ 
        message: "Cấp lại Token thành công!"
      });
    } catch (error: any) {
      return res.status(403).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
    }
  }

  // ==============================
  // 5. API GOOGLE LOGIN
  // ==============================
  static async googleLogin(req: Request, res: Response) {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({ message: "Thiếu Google credential!" });
      }

      const { user, accessToken, refreshToken } = await AuthService.loginWithGoogle(credential);

      res.cookie("access_token", accessToken, accessTokenCookieOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      return res.status(200).json({
        message: "Đăng nhập với Google thành công!",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (error: any) {
      return res.status(401).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
    }
  }

  // ==============================
  // 6. API LOGOUT
  // ==============================
  static async logout(req: Request, res: Response) {
    // 💡 SỬ DỤNG ĐÚNG OPTION KHI CLEAR COOKIE
    res.clearCookie("access_token", crossSiteCookieOptions);
    res.clearCookie("refreshToken", crossSiteCookieOptions);

    return res.status(200).json({ message: "Đăng xuất thành công!" });
  }
}