"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const DataSource_1 = require("../models/DataSource");
const Post_1 = require("../models/entities/Post");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const postRepo = DataSource_1.AppDataSource.getRepository(Post_1.Post);
// Cấu hình sanitize: cho phép các tag rich-text cần thiết (khớp với style trong PostDetail.tsx)
// nhưng loại bỏ script, iframe, và mọi thuộc tính nguy hiểm (onerror, onclick, javascript:...)
const SANITIZE_OPTIONS = {
    allowedTags: [
        'h1', 'h2', 'h3', 'p', 'br', 'strong', 'em', 'u', 's',
        'ul', 'ol', 'li', 'a', 'img', 'blockquote',
        'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height'],
    },
    // Chỉ cho phép link/ảnh dùng giao thức an toàn, chặn javascript:, data: (trừ ảnh cần whitelist riêng nếu dùng base64)
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
        a: sanitize_html_1.default.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
};
class PostService {
    static async getAllPublishedPost() {
        return postRepo.find({
            where: { status: Post_1.PostStatus.PUBLISHED },
            order: { createdAt: 'DESC' },
            select: {
                id: true,
                title: true,
                slug: true,
                thumbnailUrl: true,
                shortDesc: true,
                authorName: true,
                createdAt: true,
            },
        });
    }
    static async getAllPostPagination(page = 1, limit = 10) {
        const [posts, total] = await postRepo.findAndCount({
            order: { createdAt: 'DESC' },
            select: {
                id: true,
                title: true,
                slug: true,
                thumbnailUrl: true,
                shortDesc: true,
                authorName: true,
                status: true,
                createdAt: true,
            },
            take: limit,
            skip: (page - 1) * limit,
        });
        return {
            data: posts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async getBySlug(slug) {
        return postRepo.findOne({ where: { slug } });
    }
    static async getPostById(id) {
        return postRepo.findOne({ where: { id } });
    }
    static async createPost(data) {
        if (!data.slug && data.title) {
            data.slug = PostService.generateSlug(data.title);
        }
        // ✅ Sanitize nội dung HTML trước khi lưu vào DB
        if (data.content) {
            data.content = (0, sanitize_html_1.default)(data.content, SANITIZE_OPTIONS);
        }
        const post = postRepo.create(data);
        return postRepo.save(post);
    }
    static async updatePost(id, data) {
        // ✅ Sanitize nội dung HTML trước khi cập nhật vào DB
        if (data.content) {
            data.content = (0, sanitize_html_1.default)(data.content, SANITIZE_OPTIONS);
        }
        await postRepo.update(id, data);
        return postRepo.findOne({ where: { id } });
    }
    static async deletePost(id) {
        return postRepo.delete(id);
    }
    static generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    }
}
exports.PostService = PostService;
