import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, UploadCloud, Search, Filter, MoreVertical } from 'lucide-react';
import { teacherApi } from '../../services/teacher.api';
import type { Teacher } from '../../services/teacher.api';
import { uploadApi } from '../../services/upload.api';

const AdminTeachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 10;

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Teacher>>({
        fullName: '', email: '', phone: '', specialization: '', bio: '', avatarUrl: ''
    });

    const fetchTeachers = async (page: number, search = '') => {
        setIsLoading(true);
        try {
            const data = await teacherApi.getTeachersPaginated(page, LIMIT, search);
            setTeachers(data.data ?? []);
            setTotalPages(data.totalPages ?? 1);
            setTotal(data.total ?? 0);
        } catch (error) {
            console.error("Lỗi khi tải danh sách giảng viên", error);
        } finally {
            setIsLoading(false);
        }
    };

    //cho 300ms sau khi ng dung ngung go
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchTeachers(1, searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    //khi đổi trang thì dùng searchTerm hiện tại
    useEffect(() => {
        fetchTeachers(currentPage, searchTerm);
    }, [currentPage]);

    // Mở Form Thêm Mới
    const handleAdd = () => {
        setIsEditing(false);
        setFormData({ fullName: '', email: '', phone: '', specialization: '', bio: '', avatarUrl: '' });
        setIsModalOpen(true);
    };

    // Mở Form Cập Nhật
    const handleEdit = (teacher: Teacher) => {
        setIsEditing(true);
        setFormData(teacher);
        setIsModalOpen(true);
    };

    // Lưu dữ liệu (Submit)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && formData.id) {
                await teacherApi.updateTeacher(formData.id, formData);
                alert("Cập nhật giảng viên thành công!");
            } else {
                const response = await teacherApi.createTeacher(formData);
                const result = response.data.data;
                if (result.generatedPassword) {
                    alert(`Tạo giảng viên thành công!\n\nMật khẩu đăng nhập mặc định: ${result.generatedPassword}\n\nVui lòng copy và gửi cho giảng viên để họ đăng nhập.`);
                } else {
                    alert("Tạo giảng viên thành công!");
                }
            }
            setIsModalOpen(false);
            fetchTeachers(currentPage);
        } catch (error: any) {
            console.error("Lỗi khi lưu giảng viên", error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                alert("Bạn không có quyền thực hiện thao tác này!");
            } else {
                alert(error.response?.data?.message || "Đã xảy ra lỗi khi lưu giảng viên!");
            }
        }
    };

    // Xóa dữ liệu
    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa giảng viên này không?")) {
            try {
                await teacherApi.deleteTeacher(id);
                setTeachers(prev => prev.filter(t => t.id !== id));
                fetchTeachers(currentPage);
            } catch (error: any) {
                console.error("Lỗi khi xóa giảng viên", error);
                if (error.response?.status === 403 || error.response?.status === 401) {
                    alert("Bạn không có quyền thực hiện thao tác này!");
                } else {
                    alert("Đã xảy ra lỗi khi xóa giảng viên!");
                }
            }
        }
    };

    // Hàm xử lý Upload File
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploading(true);
            const imageUrl = await uploadApi.uploadAvatar(file);
            setFormData({ ...formData, avatarUrl: imageUrl });
        } catch (error) {
            console.error("Lỗi upload:", error);
            alert("Tải ảnh lên thất bại. Vui lòng kiểm tra lại Backend!");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Giảng viên</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý danh sách, thông tin và hồ sơ của tất cả giảng viên trên hệ thống.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 font-medium text-sm whitespace-nowrap"
                    >
                        <Plus size={16} /> Thêm Giảng viên
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc chức danh..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                            <Filter size={16} /> Bộ lọc
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="px-6 py-4">Giảng viên</th>
                                <th className="px-6 py-4">Liên hệ</th>
                                <th className="px-6 py-4 text-center">Chuyên môn</th>
                                <th className="px-6 py-4">Giới thiệu</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 size={32} className="animate-spin text-indigo-500 mb-2" />
                                            <p>Đang tải dữ liệu...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Không tìm thấy giảng viên nào.
                                    </td>
                                </tr>
                            ) : (
                                teachers.map(teacher => (
                                    <tr key={teacher.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={teacher.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(teacher.fullName) + "&background=random"}
                                                        alt={teacher.fullName}
                                                        className="h-12 w-12 rounded-full object-cover border border-slate-200 shadow-sm"
                                                    />
                                                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white"></span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{teacher.fullName}</div>
                                                    <div className="text-sm text-slate-500">ID: #{teacher.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900">{teacher.email}</span>
                                                <span className="text-sm text-slate-500 mt-0.5">{teacher.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {teacher.specialization}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 line-clamp-2 max-w-xs" title={teacher.bio}>
                                                {teacher.bio}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(teacher)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(teacher.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Tổng <span className="font-medium text-slate-900">{total}</span> giảng viên
                    </div>
                    <div className="flex gap-1">
                        <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            style={{ padding: '6px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', background: currentPage === 1 ? '#f1f5f9' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                            ← Trước
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={{ padding: '6px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', background: currentPage === page ? 'var(--admin-primary)' : '#fff', color: currentPage === page ? '#fff' : 'inherit', cursor: 'pointer' }}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            style={{ padding: '6px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', background: currentPage === totalPages ? '#f1f5f9' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                            Tiếp →
                        </button>
                    </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-100">
                            <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {isEditing ? 'Cập nhật thông tin giảng viên' : 'Thêm Giảng viên mới'}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">Điền đầy đủ thông tin bên dưới để {isEditing ? 'cập nhật' : 'tạo mới'} hồ sơ giảng viên.</p>
                                </div>
                                <button
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="px-6 py-5 bg-slate-50/50 space-y-5">
                                    {/* Avatar Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Ảnh đại diện</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-white hover:bg-slate-50 transition-colors relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={handleAvatarUpload}
                                                disabled={isUploading}
                                            />
                                            <div className="space-y-1 text-center">
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center">
                                                        <Loader2 size={32} className="animate-spin text-indigo-500 mb-2" />
                                                        <span className="text-sm text-slate-500">Đang tải ảnh lên...</span>
                                                    </div>
                                                ) : formData.avatarUrl ? (
                                                    <div className="flex flex-col items-center">
                                                        <img src={formData.avatarUrl} alt="Preview" className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg mb-3" />
                                                        <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-md">Bấm vào để đổi ảnh khác</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
                                                        <div className="flex text-sm text-slate-600 justify-center">
                                                            <span className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none hover:text-indigo-500">
                                                                Tải ảnh lên
                                                            </span>
                                                            <p className="pl-1">hoặc kéo thả vào đây</p>
                                                        </div>
                                                        <p className="text-xs text-slate-500">PNG, JPG, GIF (Max 5MB)</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                placeholder="VD: Nguyễn Văn A"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="VD: nguyenvana@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="VD: 0901234567"
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Chuyên môn</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.specialization}
                                                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                                placeholder="VD: Data Science, ReactJS..."
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Tiểu sử / Giới thiệu</label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.bio}
                                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                                placeholder="Nhập giới thiệu ngắn về kỹ năng, kinh nghiệm giảng dạy..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white px-6 py-4 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 font-medium text-sm"
                                    >
                                        {isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeachers;
