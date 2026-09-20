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

// 1. Giấu thông tin Express
app.disable('x-powered-by');

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// 2. Danh sách các Domain Frontend được phép gọi API (Sửa lỗi Cross-Domain Misconfiguration)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://tuyen-sinh-education-secure-web-sof.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Cho phép request không có origin (Server-to-Server, Postman, Mobile) hoặc thuộc Whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Blocked: Access Denied'));
    }
  },
  credentials: true, // Cho phép trao đổi Cookie giữa FE và BE
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(cookieParser());

// 3. Cấu hình Helmet tối ưu bảo mật cho REST API & Google OAuth
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.googleusercontent.com"],
      frameAncestors: ["'self'"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      objectSrc: ["'none'"],
      connectSrc: ["'self'", ...allowedOrigins, "https://accounts.google.com"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép ảnh Cloudinary/Google Avatar hiển thị trên FE
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' } // Hỗ trợ Google Auth Popup
}));

app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
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
app.use('/api', uploadRouter); // Đã loại bỏ bớt 1 dòng trùng lặp userRouter

// 404 Handler
app.use((request: Request, response: Response) => {
  return response.status(404).json(errorHandler(404, 'Không tìm thấy đường dẫn yêu cầu'));
});

// Global Error Handler
app.use((err: any, request: Request, response: Response, next: NextFunction) => {
  console.error('[Unhandled Error]', err);

  const status = typeof err?.status === 'number' ? err.status : 500;
  const isKnownAppError = typeof err?.status === 'number' && typeof err?.message === 'string';
  const message = isKnownAppError ? err.message : 'Đã có lỗi xảy ra, vui lòng thử lại sau';

  return response.status(status).json(errorHandler(status, message));
});

// Process Handlers
process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err);
});

// Start Database & Server
AppDataSource.initialize()
  .then(() => {
    console.log("DataSource đã khởi tạo thành công!");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Lỗi kết nối DataSource:", err);
  });