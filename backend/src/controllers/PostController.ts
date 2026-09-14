import { Request, Response } from 'express';
import { PostService } from '../services/PostService';
import { successHandler, errorHandler } from '../utils/responseHandler';

// Whitelist các field client được phép gửi lên khi tạo/sửa bài viết
const ALLOWED_FIELDS = ['title', 'slug', 'shortDesc', 'content', 'status', 'authorName'] as const;

function pickAllowedFields(body: any): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}

export class PostController {
  static async getAllPublishedPost(request: Request, response: Response) {
    try {
      const posts = await PostService.getAllPublishedPost();
      return response.json(successHandler(200, 'Lấy danh sách bài viết thành công', posts));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy danh sách bài viết'));
    }
  }

  // GET /posts/admin — danh sách tất cả bài (dành cho admin)
  static async getAllPostPagination(request: Request, response: Response) {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    try {
      const posts = await PostService.getAllPostPagination(page, limit);
      return response.json(successHandler(200, 'Lấy danh sách bài viết thành công', posts));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy danh sách bài viết'));
    }
  }

  static async getPost(request: Request, response: Response) {
    const param = String(request.params.slugOrId);
    const isId = /^\d+$/.test(param); // toàn số → là id

    try {
        const post = isId
            ? await PostService.getPostById(Number(param))
            : await PostService.getBySlug(param);

        if (!post) return response.status(404).json(errorHandler(404, 'Bài viết không tồn tại'));
        return response.json(successHandler(200, 'Lấy bài viết thành công', post));
    } catch (error) {
        return response.status(500).json(errorHandler(500, 'Lỗi khi lấy bài viết'));
    }
}

  static async createPost(request: Request, response: Response) {
    const postData: Record<string, any> = {
      ...pickAllowedFields(request.body), // Chỉ nhận field được whitelist
      thumbnailUrl: request.file?.path,
    };

    if (!postData.title || !String(postData.title).trim()) {
      return response.status(400).json(errorHandler(400, 'Tiêu đề bài viết không được để trống'));
    }

    try {
      const newPost = await PostService.createPost(postData);
      return response.status(201).json(successHandler(201, 'Tạo bài viết thành công', newPost));
    } catch (error) {
      return response.status(500).json(errorHandler(500, 'Lỗi khi tạo bài viết'));
    }
  }

  static async updatePost(request: Request, response: Response) {
    const postId = Number(request.params.id);
    if (isNaN(postId)) {
      return response.status(400).json(errorHandler(400, 'ID bài viết không hợp lệ'));
    }

    const postData = {
      ...pickAllowedFields(request.body), // Chỉ nhận field được whitelist
      ...(request.file && { thumbnailUrl: request.file.path }),
    };

    try {
      const updatedPost = await PostService.updatePost(postId, postData);
      if (!updatedPost) {
        return response.status(404).json(errorHandler(404, 'Bài viết không tồn tại'));
      }
      return response.json(successHandler(200, 'Cập nhật bài viết thành công', updatedPost));
    } catch (error) {
      return response.status(500).json(errorHandler(500, 'Lỗi khi cập nhật bài viết'));
    }
  }

  static async deletePost(request: Request, response: Response) {
    const postId = Number(request.params.id);
    if (isNaN(postId)) {
      return response.status(400).json(errorHandler(400, 'ID bài viết không hợp lệ'));
    }
    
    try {
      await PostService.deletePost(postId);
      return response.json(successHandler(200, 'Xóa bài viết thành công'));
    } catch (error) {
      return response.status(500).json(errorHandler(500, 'Lỗi khi xóa bài viết'));
    }
  }
}