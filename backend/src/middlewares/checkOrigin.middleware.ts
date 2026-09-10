import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../utils/responseHandler';

export const checkOrigin = (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigin = process.env.FRONTEND_URL;

    if (!allowedOrigin) {
        // Chưa cấu hình FRONTEND_URL thì không thể kiểm tra được -> chặn an toàn
        return res.status(500).json(errorHandler(500, 'Server chưa cấu hình FRONTEND_URL.'));
    }

    const origin = req.headers.origin || req.headers.referer;

    if (!origin || !origin.startsWith(allowedOrigin)) {
        return res.status(403).json(errorHandler(403, 'Yêu cầu không hợp lệ (sai nguồn gốc request).'));
    }

    next();
};
