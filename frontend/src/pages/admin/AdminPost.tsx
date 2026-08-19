import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../../services/post.api';
import type { Post } from '../../services/post.api';

const AdminPost: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 10;
    const navigate = useNavigate();

    const fetchPosts = async (page: number) => {
        setIsLoading(true);
        try {
            const data = await postApi.getAllPostsPaginated(page, LIMIT);
            setPosts(data.data);
            setTotalPages(data.totalPages);
            setTotal(data.total);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchPosts(currentPage); }, [currentPage]);

    const handleAdd = () => {
        navigate('/admin/posts/create');
    };

    const handleEdit = (id: number) => {
        navigate(`/admin/posts/edit/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
            try {
                await postApi.deletePost(id);
                alert("Đã xóa thành công!");
                fetchPosts(currentPage);
            } catch (error) {
                alert("Không thể xóa bài viết này!");
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Quản lý Bài viết</h2>
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm whitespace-nowrap">
                    <Plus size={18} /> Thêm Bài viết
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tác giả</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Đang tải...</td></tr>
                        ) : (
                            posts.map(post => (
                                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600">#{post.id}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{post.title}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{post.authorName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${post.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {post.status === 'published' ? 'Đã đăng' : 'Nháp'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(post.id)} className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors" title="Chỉnh sửa">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors" title="Xóa">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <span className="text-sm text-slate-600">
                        Tổng {total} bài viết
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Trước
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Tiếp →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPost;
