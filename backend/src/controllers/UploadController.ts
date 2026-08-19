import { Request, Response } from 'express';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class UploadController {
    static async uploadAvatar(request: Request, response: Response) {
        if (!request.file) {
            return response.json(errorHandler(400, 'Vui lòng chọn ảnh'));
        }
        return response.json(successHandler(200, 'Tải ảnh thành công', { url: request.file.path }));
    }

    static async uploadCourseImage(request: Request, response: Response) {
        if (!request.file) {
            return response.json(errorHandler(400, 'Vui lòng chọn ảnh'));
        }
        return response.json(successHandler(200, 'Tải ảnh thành công', { url: request.file.path }));
    }
}