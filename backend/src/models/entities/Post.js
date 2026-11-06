const { EntitySchema } = require('typeorm');

const PostStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

class Post {}

const PostSchema = new EntitySchema({
  name: 'Post',
  target: Post,
  tableName: 'posts',
  columns: {
  id: {
    type: Number,
    primary: true,
    generated: 'increment'
  },
  title: {
    type: String
  },
  slug: {
    unique: true,
    type: String
  },
  thumbnailUrl: {
    name: 'thumbnail_url',
    nullable: true,
    type: String
  },
  shortDesc: {
    name: 'short_desc',
    type: 'text',
    nullable: true
  },
  content: {
    type: 'longtext'
  },
  authorName: {
    name: 'author_name',
    nullable: true,
    type: String
  },
  status: {
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT
  },
  createdAt: {
    name: 'created_at',
    createDate: true,
    type: 'datetime'
  },
  updatedAt: {
    name: 'updated_at',
    updateDate: true,
    type: 'datetime'
  }
},
  relations: {},
});

module.exports = { Post, PostSchema, PostStatus };


