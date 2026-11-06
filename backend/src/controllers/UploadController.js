"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const responseHandler_1 = require("../utils/responseHandler");
class UploadController {
    static async uploadAvatar(request, response) {
        if (!request.file) {
            return response.json((0, responseHandler_1.errorHandler)(400, 'Vui lòng chọn ảnh'));
        }
        return response.json((0, responseHandler_1.successHandler)(200, 'Tải ảnh thành công', { url: request.file.path }));
    }
    static async uploadCourseImage(request, response) {
        if (!request.file) {
            return response.json((0, responseHandler_1.errorHandler)(400, 'Vui lòng chọn ảnh'));
        }
        return response.json((0, responseHandler_1.successHandler)(200, 'Tải ảnh thành công', { url: request.file.path }));
    }
}
exports.UploadController = UploadController;
