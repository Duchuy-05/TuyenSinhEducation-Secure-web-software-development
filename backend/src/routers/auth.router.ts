import { Router }   from "express";
import { AuthController } from "../controllers/AuthControllers";

const authRouter = Router();

// Đăng ký tài khoản
authRouter.post("/register", AuthController.register);
// Đăng nhập
authRouter.post("/login", AuthController.login);
// Làm mới token
authRouter.get('/refresh', AuthController.refreshToken);
// Xác thực email
authRouter.post("/verify-otp", AuthController.verifyOtp);
// Đăng nhập bằng Google
authRouter.post("/google", AuthController.googleLogin);
// Đăng xuất
authRouter.post("/logout", AuthController.logout);

export default authRouter;
