import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { errorHandler } from '../utils/responseHandler';

export function handleUploadError(err: any, request: Request, response: Response, next: NextFunction) {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return response.status(400).json(errorHandler(400, 'File vượt quá dung lượng cho phép (tối đa 2MB)'));
        }
        return response.status(400).json(errorHandler(400, `Lỗi upload file: ${err.message}`));
    }
    if (err) {
        // Lỗi từ fileFilter (ví dụ: không phải file ảnh)
        return response.status(400).json(errorHandler(400, err.message || 'Lỗi khi tải file lên'));
    }
    next();
}