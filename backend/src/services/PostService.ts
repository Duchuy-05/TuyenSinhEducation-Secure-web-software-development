import { AppDataSource } from '../models/DataSource';
import { Post, PostStatus } from '../models/entities/Post';
import sanitizeHtml from 'sanitize-html';

const postRepo = AppDataSource.getRepository(Post);

// Cấu hình sanitize: cho phép các tag rich-text cần thiết (khớp với style trong PostDetail.tsx)
// nhưng loại bỏ script, iframe, và mọi thuộc tính nguy hiểm (onerror, onclick, javascript:...)
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
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
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
};

export class PostService {
  static async getAllPublishedPost() {
    return postRepo.find({
      where: { status: PostStatus.PUBLISHED },
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

  static async getAllPostPagination(page: number = 1, limit: number = 10) {
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

  static async getBySlug(slug: string) {
    return postRepo.findOne({ where: { slug } });
  }

  static async getPostById(id: number) {
    return postRepo.findOne({ where: { id } });
  }

  static async createPost(data: Partial<Post>) {
    if (!data.slug && data.title) {
      data.slug = PostService.generateSlug(data.title);
    }

    // ✅ Sanitize nội dung HTML trước khi lưu vào DB
    if (data.content) {
      data.content = sanitizeHtml(data.content, SANITIZE_OPTIONS);
    }

    const post = postRepo.create(data);
    return postRepo.save(post);
  }

  static async updatePost(id: number, data: Partial<Post>) {
    // ✅ Sanitize nội dung HTML trước khi cập nhật vào DB
    if (data.content) {
      data.content = sanitizeHtml(data.content, SANITIZE_OPTIONS);
    }

    await postRepo.update(id, data);
    return postRepo.findOne({ where: { id } });
  }

  static async deletePost(id: number) {
    return postRepo.delete(id);
  }

  private static generateSlug(title: string): string {
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