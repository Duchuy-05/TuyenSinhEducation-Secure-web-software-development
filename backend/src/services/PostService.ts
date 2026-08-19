import { AppDataSource } from '../models/DataSource';
import { Post, PostStatus } from '../models/entities/Post';
const postRepo = AppDataSource.getRepository(Post);

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
    // Tự generate slug từ title nếu không truyền slug
    if (!data.slug && data.title) {
      data.slug = PostService.generateSlug(data.title);
    }

    const post = postRepo.create(data);
    return postRepo.save(post);
  }

  static async updatePost(id: number, data: Partial<Post>) {
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
      .replace(/[\u0300-\u036f]/g, '')  // bỏ dấu tiếng Việt
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}