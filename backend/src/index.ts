import { validateRequiredEnv } from './config/env';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { AppDataSource } from './models/DataSource';
import authRouter from './routers/auth.router';
import cookieParser from 'cookie-parser';
import userRouter from './routers/user.router';
import teacherRouter from './routers/teacher.router';
import courseRouter from './routers/course.router';
import syllabusRouter from './routers/syllabus.router';
import registrationRouter from './routers/registration.router';
import postRouter from './routers/post.router';
import morgan from 'morgan';
import classRouter from './routers/class.router';
import scheduleRouter from './routers/schedule.router';
import classEnrollmentRouter from './routers/classenrollment.router';
import announcementRouter from './routers/announcement.router';
import uploadRouter from './routers/upload.router';
import paymentRouter from './routers/payment.router';
import helmet from 'helmet';
import { errorHandler } from './utils/responseHandler';

validateRequiredEnv();

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
    origin: process.env.FRONTEND_URL, // dùng để chỉ định domain FE được phép gọi API BE
    credentials: true // Bật tính năng cho phép trao đổi Cookie giữa FE và BE
}));
app.use(cookieParser());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            // Chỉ cho phép script chạy từ chính domain của mình (chặn script chèn từ nguồn lạ)
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
app.use(morgan(isProduction ? 'combined' : 'dev')); // Ghi log request ra console, chế độ "combined" chi tiết hơn "dev" (chỉ dùng khi production)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use("/api/auth", authRouter)
app.use("/api", classRouter)
app.use("/api", scheduleRouter)
app.use("/api", classEnrollmentRouter)
app.use("/api", announcementRouter)
app.use("/api", postRouter)
app.use("/api", userRouter)
app.use("/api", teacherRouter)
app.use("/api", courseRouter)
app.use("/api", syllabusRouter)
app.use("/api", registrationRouter)
app.use("/api", paymentRouter)
app.use('/api', userRouter);
app.use('/api', uploadRouter);

// 1. Bắt các route không tồn tại (404) — tránh Express trả về trang lỗi mặc định lộ thông tin framework
app.use((request: Request, response: Response) => {
    return response.status(404).json(errorHandler(404, 'Không tìm thấy đường dẫn yêu cầu'));
});

// 2. Global Error Handler — bắt MỌI lỗi chưa được catch ở bất kỳ đâu trong app
// Phải đặt SAU cùng, sau tất cả route, và có đủ 4 tham số (err, req, res, next) để Express nhận diện đây là error handler
app.use((err: any, request: Request, response: Response, next: NextFunction) => {
    // Luôn log đầy đủ chi tiết lỗi ở phía server để debug (không gửi ra client)
    console.error('[Unhandled Error]', err);

    const status = typeof err?.status === 'number' ? err.status : 500;

    // Chỉ hiển thị message thật cho client nếu đây là lỗi được chủ động throw (có "status" rõ ràng)
    // Lỗi hệ thống không lường trước (DB, TypeORM, network...) sẽ bị che message thật để tránh lộ thông tin nội bộ
    const isKnownAppError = typeof err?.status === 'number' && typeof err?.message === 'string';
    const message = isKnownAppError ? err.message : 'Đã có lỗi xảy ra, vui lòng thử lại sau';

    return response.status(status).json(errorHandler(status, message));
});

// 3. Bắt lỗi ở tầng process — tránh server crash không dấu vết khi có lỗi async không lường trước
process.on('unhandledRejection', (reason) => {
    console.error('[Unhandled Rejection]', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[Uncaught Exception]', err);
});

try {
    AppDataSource.initialize().then(() => {
        console.log("DataSource chay. !")
    }).catch((err) => {
        console.error(err)
    })
} catch (error) { console.error("err:", error) }

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
