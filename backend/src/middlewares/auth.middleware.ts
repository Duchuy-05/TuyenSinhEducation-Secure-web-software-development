import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/responseHandler'; 
import { UserRole } from '../models/entities/User';

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json(errorHandler(401, 'Không tìm thấy Token. Vui lòng đăng nhập!'));
    }

    try {
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        if (!secretKey) {
            return res.status(500).json(errorHandler(500, 'Server chưa cấu hình ACCESS_TOKEN_SECRET.'));
        }
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(errorHandler(401, 'TOKEN_EXPIRED'));
        }
        return res.status(403).json(errorHandler(403, 'Token không hợp lệ hoặc đã hết hạn!'));
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === UserRole.ADMIN) {
        next();
    } else {
        return res.status(403).json(errorHandler(403, 'Không có quyền truy cập. Yêu cầu quyền Admin.'));
    }
};

export const requireRoles = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user && roles.includes(req.user.role)) {
            return next();
        }

        return res.status(403).json(errorHandler(403, 'Không có quyền truy cập.'));
    };
};
