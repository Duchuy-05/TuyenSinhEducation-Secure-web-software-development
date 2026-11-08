"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthControllers_1 = require("../controllers/AuthControllers");
const authRouter = (0, express_1.Router)();
// Đăng ký tài khoản
authRouter.post("/register", AuthControllers_1.AuthController.register);
// Đăng nhập
authRouter.post("/login", AuthControllers_1.AuthController.login);
// Làm mới token
authRouter.get('/refresh', AuthControllers_1.AuthController.refreshToken);
// Xác thực email
authRouter.post("/verify-otp", AuthControllers_1.AuthController.verifyOtp);
// Đăng nhập bằng Google
authRouter.post("/google", AuthControllers_1.AuthController.googleLogin);
// Đăng xuất
authRouter.post("/logout", AuthControllers_1.AuthController.logout);
exports.default = authRouter;
