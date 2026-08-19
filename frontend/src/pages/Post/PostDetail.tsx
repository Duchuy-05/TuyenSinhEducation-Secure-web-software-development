import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postApi } from '../../services/post.api';
import type { Post } from '../../services/post.api';

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    postApi.getPostBySlug(slug)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-20 px-5 text-[#888]">Đang tải bài viết...</div>
    );
  }

  if (notFound || !post) {
    console.log(post);
    return (
      <div className="text-center py-20 px-5 text-[#888]">
        <h2 className="mb-4 text-[#333] text-xl font-bold">Không tìm thấy bài viết</h2>
        <Link to="/posts" className="text-[#4f6ef7] no-underline font-medium hover:underline">
          ← Quay lại Post
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] pt-10 pb-20 px-5">
      <div className="max-w-[780px] mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[0.82rem] text-[#999] mb-7 flex-wrap">
          <Link to="/" className="text-[#4f6ef7] no-underline hover:underline">Trang chủ</Link>
          <span>/</span>
          <Link to="/posts" className="text-[#4f6ef7] no-underline hover:underline">Post</Link>
          <span>/</span>
          <span className="text-[#555] whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
            {post.title}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-[1.5rem] sm:text-[2rem] font-extrabold text-[#1a1a2e] leading-[1.3] mb-3.5">
            {post.title}
          </h1>
          <div className="flex items-center gap-2.5 text-sm text-[#888]">
            <span>✍ {post.authorName}</span>
            <span className="text-[#ccc]">·</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Thumbnail */}
        {post.thumbnailUrl && (
          <div className="w-full rounded-xl overflow-hidden mb-9 aspect-video bg-[#e8e8e8]">
            <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content — styles for the injected HTML use arbitrary child selectors
            since dangerouslySetInnerHTML content can't carry its own className */}
        <article
          className="
            text-base leading-[1.85] text-[#333] bg-white rounded-xl
            py-6 px-5 sm:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.05)]
            [&_h1]:text-[1.6rem] [&_h2]:text-[1.35rem] [&_h3]:text-[1.15rem]
            [&_h1]:text-[#1a1a2e] [&_h2]:text-[#1a1a2e] [&_h3]:text-[#1a1a2e]
            [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold
            [&_h1]:mt-8 [&_h2]:mt-8 [&_h3]:mt-8
            [&_h1]:mb-2.5 [&_h2]:mb-2.5 [&_h3]:mb-2.5
            [&_h1]:leading-[1.3] [&_h2]:leading-[1.3] [&_h3]:leading-[1.3]
            [&_p]:mb-5
            [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:mb-5 [&_ol]:mb-5
            [&_li]:mb-1.5
            [&_a]:text-[#4f6ef7] [&_a]:underline
            [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#4f6ef7] [&_blockquote]:px-5 [&_blockquote]:py-3
            [&_blockquote]:my-6 [&_blockquote]:bg-[#f0f3ff] [&_blockquote]:rounded-r-lg
            [&_blockquote]:text-[#555] [&_blockquote]:italic
            [&_code]:bg-[#f0f0f0] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.875em] [&_code]:font-mono
            [&_pre]:bg-[#1a1a2e] [&_pre]:text-[#e0e0e0] [&_pre]:p-5 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
            [&_pre]:text-[0.875rem] [&_pre]:leading-[1.6] [&_pre]:my-5
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-5 [&_table]:text-[0.9rem]
            [&_th]:border [&_th]:border-[#e0e0e0] [&_th]:px-3.5 [&_th]:py-2.5 [&_th]:text-left
            [&_td]:border [&_td]:border-[#e0e0e0] [&_td]:px-3.5 [&_td]:py-2.5 [&_td]:text-left
            [&_th]:bg-[#f5f5f5] [&_th]:font-semibold [&_th]:text-[#1a1a2e]
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Back */}
        <div className="mt-10">
          <Link to="/posts" className="text-[#4f6ef7] no-underline text-sm font-medium hover:underline">
            ← Quay lại danh sách bài viết
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PostDetail;