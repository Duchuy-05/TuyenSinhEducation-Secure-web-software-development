// ===== 1. Import =====
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { validateRequiredEnv } = require("./config/env");
const { AppDataSource } = require("./models/DataSource");
const { errorHandler } = require("./utils/responseHandler");
const { inputGuard } = require("./middlewares/inputGuard.middleware");

// Routers (mỗi file router cần: module.exports = router)
const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/user.router");
const teacherRouter = require("./routers/teacher.router");
const courseRouter = require("./routers/course.router");
const syllabusRouter = require("./routers/syllabus.router");
const registrationRouter = require("./routers/registration.router");
const postRouter = require("./routers/post.router");
const classRouter = require("./routers/class.router");
const scheduleRouter = require("./routers/schedule.router");
const classEnrollmentRouter = require("./routers/classenrollment.router");
const announcementRouter = require("./routers/announcement.router");
const uploadRouter = require("./routers/upload.router");
const paymentRouter = require("./routers/payment.router");

// ===== 2. Khởi tạo =====
validateRequiredEnv(); // thiếu biến môi trường thì dừng ngay

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

// ===== 3. Middleware =====
// CORS: chỉ cho FE được phép gọi API, credentials: true để trao đổi cookie
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());

// Helmet: bảo mật header + Content Security Policy
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"], // chỉ chạy script từ domain của mình
                styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind/UI framework cần style inline
                imgSrc: ["'self'", "data:", "https://res.cloudinary.com"], // ảnh từ Cloudinary
                frameAncestors: ["'self'"], // chống Clickjacking
                objectSrc: ["'none'"], // chặn plugin cũ (Flash, Java Applet...)
                connectSrc: ["'self'", process.env.FRONTEND_URL || ""].filter(Boolean),
            },
        },
        // Cho phép ảnh Cloudinary hiển thị khi FE ở domain khác
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

// Log request: "combined" chi tiết hơn "dev", dùng cho production
app.use(morgan(isProduction ? "combined" : "dev"));

app.use(express.json({ limit: "100kb", strict: true }));
app.use(express.urlencoded({ extended: false, limit: "100kb", parameterLimit: 100 }));
app.use(inputGuard);

app.use(express.static("public"));
app.set("view engine", "ejs");

// ===== 4. Routes =====
app.use("/api/auth", authRouter);
app.use("/api", classRouter);
app.use("/api", scheduleRouter);
app.use("/api", classEnrollmentRouter);
app.use("/api", announcementRouter);
app.use("/api", postRouter);
app.use("/api", userRouter);
app.use("/api", teacherRouter);
app.use("/api", courseRouter);
app.use("/api", syllabusRouter);
app.use("/api", registrationRouter);
app.use("/api", paymentRouter);
app.use("/api", uploadRouter);

// ===== 5. Xử lý lỗi (luôn đặt sau cùng) =====
// 404: route không tồn tại
app.use((req, res) => {
    res.status(404).json(errorHandler(404, "Không tìm thấy đường dẫn yêu cầu"));
});

// Global error handler: phải đủ 4 tham số (err, req, res, next)
app.use((err, req, res, next) => {
    console.error("[Unhandled Error]", err); // log đầy đủ ở server, không gửi ra client

    const status = typeof err?.status === "number" ? err.status : 500;

    // Chỉ lộ message thật nếu là lỗi chủ động throw (có status rõ ràng)
    const isKnownError = typeof err?.status === "number" && typeof err?.message === "string";
    const message = isKnownError ? err.message : "Đã có lỗi xảy ra, vui lòng thử lại sau";

    res.status(status).json(errorHandler(status, message));
});

// Bắt lỗi cấp process để server không crash không dấu vết
process.on("unhandledRejection", (reason) => {
    console.error("[Unhandled Rejection]", reason);
});
process.on("uncaughtException", (err) => {
    console.error("[Uncaught Exception]", err);
});

// ===== 6. Khởi động server =====
// Chỉ chạy khi gọi trực tiếp `node app.js` (không chạy khi import trong test)
if (require.main === module) {
    AppDataSource.initialize()
        .then(() => console.log("DataSource đã kết nối"))
        .catch((err) => console.error("Lỗi kết nối DataSource:", err));

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = { app };