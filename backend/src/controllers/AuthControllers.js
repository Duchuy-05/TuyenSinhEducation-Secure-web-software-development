"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const isProduction = process.env.NODE_ENV === "production";
const crossSiteCookieOptions = {
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax"),
};
const accessTokenCookieOptions = Object.assign(Object.assign({ httpOnly: true }, crossSiteCookieOptions), { maxAge: 15 * 60 * 1000 });
const refreshTokenCookieOptions = Object.assign(Object.assign({ httpOnly: true }, crossSiteCookieOptions), { maxAge: 7 * 24 * 60 * 60 * 1000 });
class AuthController {
    // ==============================
    // 1. API REGISTER
    // ==============================
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            // Gọi service xử lý
            await AuthService_1.AuthService.registerUser(name, email, password);
            return res.status(201).json({ message: "Đăng ký tài khoản thành công!" });
        }
        catch (error) {
            // bắt lỗi từ Service: lỗi regex, lỗi email tồn tại, ....
            return res.status(400).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
        }
    }
    // ==============================
    // 2 API VERIFY OTP
    // ==============================
    static async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await AuthService_1.AuthService.verifyOtp(email, otp);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
        }
    }
    // ==============================
    // 3. API LOGIN
    // ==============================
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            // Gọi service xử lý
            const { user, accessToken, refreshToken } = await AuthService_1.AuthService.loginUser(email, password);
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
        }
        catch (error) {
            return res.status(401).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
        }
    }
    // ==============================
    // 4. API REFRESH TOKEN
    // ==============================
    static async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: "Chưa xác thực. Vui lòng đăng nhập lại!" });
            }
            // Gọi service xử lý
            const newAccessToken = await AuthService_1.AuthService.verifyAndRefreshToken(refreshToken);
            res.cookie("access_token", newAccessToken, accessTokenCookieOptions);
            return res.status(200).json({
                message: "Cấp lại Token thành công!"
            });
        }
        catch (error) {
            // khi Token sai hoặc hết hạn từ Service
            return res.status(403).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
        }
    }
    // ==============================
    // 5. API GOOGLE LOGIN
    // ==============================
    static async googleLogin(req, res) {
        try {
            const { credential } = req.body;
            if (!credential) {
                return res.status(400).json({ message: "Thiếu Google credential!" });
            }
            const { user, accessToken, refreshToken } = await AuthService_1.AuthService.loginWithGoogle(credential);
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
        }
        catch (error) {
            return res.status(401).json({ message: (error && typeof error.status === 'number' ? error.message : "Lỗi Server!") });
        }
    }
    static async logout(req, res) {
        res.clearCookie("access_token", Object.assign({ httpOnly: true }, crossSiteCookieOptions));
        res.clearCookie("refreshToken", Object.assign({ httpOnly: true }, crossSiteCookieOptions));
        return res.status(200).json({ message: "Đăng xuất thành công!" });
    }
}
exports.AuthController = AuthController;
