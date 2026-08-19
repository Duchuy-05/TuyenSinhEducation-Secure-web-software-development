import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;           // dùng cho URL: /blog/ten-bai-viet

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'short_desc', type: 'text', nullable: true })
  shortDesc: string;      // mô tả ngắn hiển thị ở trang danh sách

  @Column({ type: 'longtext' })
  content: string;        // nội dung HTML đầy đủ của bài viết

  @Column({ name: 'author_name', nullable: true })
  authorName: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}