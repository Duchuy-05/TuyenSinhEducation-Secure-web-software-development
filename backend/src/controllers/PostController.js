"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const PostService_1 = require("../services/PostService");
const responseHandler_1 = require("../utils/responseHandler");
// Whitelist các field client được phép gửi lên khi tạo/sửa bài viết
const ALLOWED_FIELDS = ['title', 'slug', 'shortDesc', 'content', 'status', 'authorName'];
function pickAllowedFields(body) {
    const result = {};
    for (const key of ALLOWED_FIELDS) {
        if (body[key] !== undefined)
            result[key] = body[key];
    }
    return result;
}
class PostController {
    static async getAllPublishedPost(request, response) {
        try {
            const posts = await PostService_1.PostService.getAllPublishedPost();
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách bài viết thành công', posts));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách bài viết'));
        }
    }
    // GET /posts/admin — danh sách tất cả bài (dành cho admin)
    static async getAllPostPagination(request, response) {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;
        try {
            const posts = await PostService_1.PostService.getAllPostPagination(page, limit);
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách bài viết thành công', posts));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách bài viết'));
        }
    }
    static async getPost(request, response) {
        const param = String(request.params.slugOrId);
        const isId = /^\d+$/.test(param); // toàn số → là id
        try {
            const post = isId
                ? await PostService_1.PostService.getPostById(Number(param))
                : await PostService_1.PostService.getBySlug(param);
            if (!post)
                return response.status(404).json((0, responseHandler_1.errorHandler)(404, 'Bài viết không tồn tại'));
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy bài viết thành công', post));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy bài viết'));
        }
    }
    static async createPost(request, response) {
        const postData = {
            ...pickAllowedFields(request.body), // Chỉ nhận field được whitelist
            thumbnailUrl: request.file?.path,
        };
        if (!postData.title || !String(postData.title).trim()) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Tiêu đề bài viết không được để trống'));
        }
        try {
            const newPost = await PostService_1.PostService.createPost(postData);
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Tạo bài viết thành công', newPost));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi tạo bài viết'));
        }
    }
    static async updatePost(request, response) {
        const postId = Number(request.params.id);
        if (isNaN(postId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID bài viết không hợp lệ'));
        }
        const postData = {
            ...pickAllowedFields(request.body), // Chỉ nhận field được whitelist
            ...(request.file && { thumbnailUrl: request.file.path }),
        };
        try {
            const updatedPost = await PostService_1.PostService.updatePost(postId, postData);
            if (!updatedPost) {
                return response.status(404).json((0, responseHandler_1.errorHandler)(404, 'Bài viết không tồn tại'));
            }
            return response.json((0, responseHandler_1.successHandler)(200, 'Cập nhật bài viết thành công', updatedPost));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi cập nhật bài viết'));
        }
    }
    static async deletePost(request, response) {
        const postId = Number(request.params.id);
        if (isNaN(postId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID bài viết không hợp lệ'));
        }
        try {
            await PostService_1.PostService.deletePost(postId);
            return response.json((0, responseHandler_1.successHandler)(200, 'Xóa bài viết thành công'));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi xóa bài viết'));
        }
    }
}
exports.PostController = PostController;
