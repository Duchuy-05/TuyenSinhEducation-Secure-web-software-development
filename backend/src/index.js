"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const env_1 = require("./config/env");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const DataSource_1 = require("./models/DataSource");
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const teacher_router_1 = __importDefault(require("./routers/teacher.router"));
const course_router_1 = __importDefault(require("./routers/course.router"));
const syllabus_router_1 = __importDefault(require("./routers/syllabus.router"));
const registration_router_1 = __importDefault(require("./routers/registration.router"));
const post_router_1 = __importDefault(require("./routers/post.router"));
const morgan_1 = __importDefault(require("morgan"));
const class_router_1 = __importDefault(require("./routers/class.router"));
const schedule_router_1 = __importDefault(require("./routers/schedule.router"));
const classenrollment_router_1 = __importDefault(require("./routers/classenrollment.router"));
const announcement_router_1 = __importDefault(require("./routers/announcement.router"));
const upload_router_1 = __importDefault(require("./routers/upload.router"));
const payment_router_1 = __importDefault(require("./routers/payment.router"));
const helmet_1 = __importDefault(require("helmet"));
const responseHandler_1 = require("./utils/responseHandler");
const inputGuard_middleware_1 = require("./middlewares/inputGuard.middleware");
(0, env_1.validateRequiredEnv)();
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL,
].filter((origin) => Boolean(origin));
app.use((0, cors_1.default)({
    origin: allowedOrigins, // dùng để chỉ định domain FE được phép gọi API BE
    credentials: true // Bật tính năng cho phép trao đổi Cookie giữa FE và BE
}));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            // Chỉ cho phép script chạy từ chính domain của mình (chặn script chèn từ nguồn lạ)b  OK
            scriptSrc: ["'self'"],
            // Cho phép style nội tuyến (nhiều UI framework như Tailwind cần 'unsafe-inline' cho style)
            styleSrc: ["'self'", "'unsafe-inline'"],
            // Ảnh: cho phép từ chính domain, base64 (data:), và Cloudinary (nơi lưu ảnh thật)
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
            // Chặn nhúng iframe từ domain khác (chống Clickjacking) — kết hợp cùng X-Frame-Options mặc định của helmet
            frameAncestors: ["'self'"],
            // Chặn plugin object/embed lỗi thời (Flash, Java Applet...)
            objectSrc: ["'none'"],
            // API mà frontend được phép gọi (chính BE + domain FE)
            connectSrc: ["'self'", process.env.FRONTEND_URL || ''].filter(Boolean),
        },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép ảnh Cloudinary hiển thị đúng khi FE ở domain khác
}));
app.use((0, morgan_1.default)(isProduction ? 'combined' : 'dev')); // Ghi log request ra console, chế độ "combined" chi tiết hơn "dev" (chỉ dùng khi production)
app.use(express_1.default.json({ limit: '100kb', strict: true }));
app.use(express_1.default.urlencoded({ extended: false, limit: '100kb', parameterLimit: 100 }));
app.use(inputGuard_middleware_1.inputGuard);
app.use(express_1.default.static('public'));
app.set('view engine', 'ejs');
app.use("/api/auth", auth_router_1.default);
app.use("/api", class_router_1.default);
app.use("/api", schedule_router_1.default);
app.use("/api", classenrollment_router_1.default);
app.use("/api", announcement_router_1.default);
app.use("/api", post_router_1.default);
app.use("/api", user_router_1.default);
app.use("/api", teacher_router_1.default);
app.use("/api", course_router_1.default);
app.use("/api", syllabus_router_1.default);
app.use("/api", registration_router_1.default);
app.use("/api", payment_router_1.default);
app.use('/api', user_router_1.default);
app.use('/api', upload_router_1.default);
// 1. Bắt các route không tồn tại (404) — tránh Express trả về trang lỗi mặc định lộ thông tin framework
app.use((request, response) => {
    return response.status(404).json((0, responseHandler_1.errorHandler)(404, 'Không tìm thấy đường dẫn yêu cầu'));
});
// 2. Global Error Handler — bắt MỌI lỗi chưa được catch ở bất kỳ đâu trong app
// Phải đặt SAU cùng, sau tất cả route, và có đủ 4 tham số (err, req, res, next) để Express nhận diện đây là error handler
app.use((err, request, response, next) => {
    // Luôn log đầy đủ chi tiết lỗi ở phía server để debug (không gửi ra client)
    console.error('[Unhandled Error]', err);
    const status = typeof err?.status === 'number' ? err.status : 500;
    // Chỉ hiển thị message thật cho client nếu đây là lỗi được chủ động throw (có "status" rõ ràng)
    // Lỗi hệ thống không lường trước (DB, TypeORM, network...) sẽ bị che message thật để tránh lộ thông tin nội bộ
    const isKnownAppError = typeof err?.status === 'number' && typeof err?.message === 'string';
    const message = isKnownAppError ? err.message : 'Đã có lỗi xảy ra, vui lòng thử lại sau';
    return response.status(status).json((0, responseHandler_1.errorHandler)(status, message));
});
// 3. Bắt lỗi ở tầng process — tránh server crash không dấu vết khi có lỗi async không lường trước
process.on('unhandledRejection', (reason) => {
    console.error('[Unhandled Rejection]', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[Uncaught Exception]', err);
});
if (require.main === module) {
    try {
        DataSource_1.AppDataSource.initialize().then(() => {
            console.log("DataSource chay. !");
        }).catch((err) => {
            console.error(err);
        });
    }
    catch (error) {
        console.error("err:", error);
    }
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
