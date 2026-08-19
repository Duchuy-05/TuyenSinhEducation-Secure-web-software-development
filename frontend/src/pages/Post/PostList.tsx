import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '../../services/post.api';
import type { Post } from '../../services/post.api';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import FloatingContact from '../../components/FloatingContact';

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postApi.getAllPublishedPosts()
      .then(setPosts)
      .finally(() => setLoading(false));

  }, []);

  if (loading) {
    return <div className="text-center py-20 px-5 text-[#888] text-base">Đang tải bài viết...</div>;
  }

  return (
    <div className="min-h-[50vh] bg-[#f9f9f9]">
      <Navbar />

      <div className="min-h-[50vh] bg-[#f9f9f9]">
        <div className="bg-[#1a1a2e] text-white text-center pt-[150px] pb-[60px]">
          <h1 className="text-[2rem] sm:text-[2.5rem] font-bold mb-2.5 tracking-[-0.5px]">BÀI ĐĂNG</h1>
          <p className="text-base text-[#a0a0c0]">Kiến thức và chia sẻ từ đội ngũ giảng viên</p>
        </div>

        <div className="max-w-[1100px] mx-auto py-12 px-5">
          {posts.length === 0 ? (
            <p className="text-center text-[#aaa] py-16">Chưa có bài viết nào.</p>
          ) : (
            <div className="grid grid-cols-1 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3 gap-7">
              {posts.map((post) => (
                <Link
                  to={`/posts/${post.slug}`}
                  key={post.id}
                  className="group bg-white rounded-xl overflow-hidden no-underline text-inherit shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 ease-in-out flex flex-col hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  <div className="w-full aspect-video overflow-hidden bg-[#e8e8e8]">
                    <img
                      src={post.thumbnailUrl || 'https://placehold.co/600x340?text=No+Image'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[0.78rem] text-[#999] mb-2">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                      })}
                    </p>
                    <h2 className="text-[1.05rem] font-bold text-[#1a1a2e] mb-2.5 leading-[1.4] line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[#666] leading-[1.6] mb-4 line-clamp-3 flex-1">
                      {post.shortDesc}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-[0.8rem] text-[#555] font-medium">{post.authorName}</span>
                      <span className="text-[0.8rem] text-[#4f6ef7] font-semibold">Đọc tiếp →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <FloatingContact />
    </div>
  );
};

export default PostList;