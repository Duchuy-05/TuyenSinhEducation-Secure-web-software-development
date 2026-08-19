import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, UploadCloud, Loader2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { courseApi } from '../../services/course.api';
import type { Course } from '../../services/course.api';
import { teacherApi } from '../../services/teacher.api';
import type { Teacher } from '../../services/teacher.api';
import { uploadApi } from '../../services/upload.api';

const AdminCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 10;

    const [step, setStep] = useState<1 | 2>(1);

    const [formData, setFormData] = useState<any>({
        id: null,
        teacherId: '', category: '', title: '', shortDesc: '', target: '',
        imageUrl: '', duration: '', sessionCount: '', frequency: '',
        lessonDuration: '', classSize: '', format: 'online', price: '', status: 'published',
        syllabus: []
    });

    const fetchData = async (page: number) => {
        setIsLoading(true);
        try {
            const [courseData, teacherData] = await Promise.all([
                courseApi.getCoursesPaginated(page, LIMIT),
                teacherApi.getAllTeachers()
            ]);
            setCourses(courseData.data);
            setTotalPages(courseData.totalPages);
            setTotal(courseData.total);
            setTeachers(teacherData);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(currentPage); }, [currentPage]);

    const handleAdd = () => {
        setIsEditing(false);
        setStep(1); // Luôn bắt đầu từ bước 1
        setFormData({
            id: null, teacherId: '', category: '', title: '', shortDesc: '', target: '',
            imageUrl: '', duration: '', sessionCount: '', frequency: '',
            lessonDuration: '', classSize: '', format: 'online', price: '', status: 'published',
            syllabus: []
        });
        setIsModalOpen(true);
    };

    const handleEdit = (course: any) => {
        setIsEditing(true);
        setStep(1); // Cho phép xem lại thông tin cơ bản trước
        setFormData({
            ...course,
            teacherId: course.teacher?.id || course.teacherId || '',
            syllabus: course.syllabus || []
        });
        setIsModalOpen(true);
    };

    const handleCourseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const uploadedUrl = await uploadApi.uploadCourseImage(file);
            setFormData((prev: any) => ({ ...prev, imageUrl: uploadedUrl }));
        } catch (error) {
            alert("Tải ảnh lên thất bại!");
        } finally {
            setIsUploading(false);
        }
    };

    // --- XỬ LÝ LỘ TRÌNH (STEP 2) ---
    const handleAddSyllabus = () => {
        setFormData((prev: any) => ({
            ...prev,
            syllabus: [...prev.syllabus, { title: '', description: '', orderIndex: prev.syllabus.length + 1 }]
        }));
    };

    const handleRemoveSyllabus = (indexToRemove: number) => {
        setFormData((prev: any) => ({
            ...prev,
            syllabus: prev.syllabus.filter((_: any, idx: number) => idx !== indexToRemove)
        }));
    };

    const handleSyllabusChange = (index: number, field: string, value: string) => {
        setFormData((prev: any) => {
            const newSyllabus = [...prev.syllabus];
            newSyllabus[index] = { ...newSyllabus[index], [field]: value };
            return { ...prev, syllabus: newSyllabus };
        });
    };

    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn load lại trang, kích hoạt HTML5 Validation

        try {
            const courseInfo = {
                teacherId: formData.teacherId,
                category: formData.category,
                title: formData.title,
                shortDesc: formData.shortDesc,
                target: formData.target,
                imageUrl: formData.imageUrl,
                duration: formData.duration,
                sessionCount: formData.sessionCount ? Number(formData.sessionCount) : null,
                frequency: formData.frequency,
                lessonDuration: formData.lessonDuration,
                classSize: formData.classSize,
                format: formData.format,
                price: formData.price,
                status: formData.status
            };

            if (isEditing && formData.id) {
                await courseApi.updateCourse(formData.id, courseInfo);
                setStep(2);
            } else {
                const response = await courseApi.createCourse(courseInfo);
                const newCourseId = response.data.data?.id ?? response.data?.id

                setFormData((prev: any) => ({ ...prev, id: newCourseId }));
                setStep(2); // Thành công dữ liệu hợp lệ -> Chuyển sang Bước 2 nhập Lộ trình
            }
        } catch (error) {
            alert("Không thể lưu thông tin khóa học cơ bản. Vui lòng kiểm tra lại!");
        }
    };

    // Khi bấm "Hoàn tất & Lưu lộ trình" ở Bước 2
    const handleSaveSyllabus = async () => {
        try {
            // 1. Chuẩn bị dữ liệu gửi lên
            const payload = {
                syllabus: formData.syllabus.map((item: any, idx: number) => ({
                    title: item.title,
                    description: item.description,
                    orderIndex: idx + 1 // Tự động đánh số thứ tự từ 1
                }))
            };

            // 2. Gọi thẳng vào API cập nhật Syllabus vừa tạo
            // (formData.id lúc này đã có sẵn vì đã tạo/chọn khóa học ở Bước 1)
            if (isEditing) {
                await courseApi.updateCourseSyllabus(formData.id, payload);
            } else {
                await courseApi.createCourseSyllabus(formData.id, payload);
            }

            alert(isEditing ? "Cập nhật khóa học và lộ trình thành công!" : "Thêm khóa học và lộ trình thành công!");

            setIsModalOpen(false);
            fetchData(currentPage);
        } catch (error) {
            alert("Lỗi khi lưu lộ trình học!");
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
            try {
                await courseApi.deleteCourse(id);
                alert("Xóa thành công!");
                fetchData(currentPage);
            } catch (error) {
                alert("Không thể xóa khóa học này!");
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Quản lý Khóa học</h2>
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm whitespace-nowrap">
                    <Plus size={18} /> Thêm Khóa học
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Bảng danh sách khóa học */}
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Khóa học</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Giảng viên</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Học phí</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Đang tải...</td>
                            </tr>
                        ) : (
                            courses.map((course: any) => (
                                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600">#{course.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={course.imageUrl || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded object-cover" />
                                            <div>
                                                <div className="font-semibold text-slate-900">{course.title}</div>
                                                <div className="text-sm text-slate-500">{course.target}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{course.teacher?.fullName || course.teacher?.full_name || 'Chưa phân công'}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{course.price}</td>
                                    <td className="px-6 py-4">
                                        {course.status === 'published' ? (
                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Hiển thị</span>
                                        ) : (
                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Đang ẩn</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(course)} className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors" title="Chỉnh sửa">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(course.id)} className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors" title="Xóa">
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
                        Tổng {total} khóa học
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
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                    currentPage === page
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

            {/* POPUP MODAL MULTI-STEP WIZARD */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-900">{isEditing ? 'Cập nhật Khóa học' : 'Thêm Khóa học mới'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Thanh hiển thị tiến trình các bước nhập liệu */}
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 text-sm">
                            <span className={`font-medium ${step === 1 ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>
                                1. Thông tin cơ bản {step === 2 && '✓'}
                            </span>
                            <span className="text-slate-300">➔</span>
                            <span className={`font-medium ${step === 2 ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>
                                2. Lộ trình học (Syllabus)
                            </span>
                        </div>

                        {/* BƯỚC 1: FORM THÔNG TIN CƠ BẢN */}
                        {step === 1 && (
                            <form onSubmit={handleNextStep} className="flex flex-col flex-1 overflow-hidden">
                                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tên Khóa Học *</label>
                                        <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required value={formData.title} onChange={e => setFormData((prev: any) => ({ ...prev, title: e.target.value }))} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Danh mục (Category) *</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required placeholder="VD: Web Development" value={formData.category} onChange={e => setFormData((prev: any) => ({ ...prev, category: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Đối tượng (Target)</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="VD: Sinh viên, Người đi làm..." value={formData.target} onChange={e => setFormData((prev: any) => ({ ...prev, target: e.target.value }))} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Thời lượng</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={formData.duration} onChange={e => setFormData((prev: any) => ({ ...prev, duration: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Hình thức</label>
                                            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={formData.format} onChange={e => setFormData((prev: any) => ({ ...prev, format: e.target.value }))}>
                                                <option value="online">Online</option>
                                                <option value="offline">Offline</option>
                                                <option value="hybrid">Hybrid</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Học phí *</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required placeholder="VD: 2500000" value={formData.price} onChange={e => setFormData((prev: any) => ({ ...prev, price: e.target.value }))} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Số buổi</label>
                                            <input type="number" min="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="VD: 24" value={formData.sessionCount || ''} onChange={e => setFormData((prev: any) => ({ ...prev, sessionCount: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Tần suất</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="VD: 2 buổi/tuần" value={formData.frequency || ''} onChange={e => setFormData((prev: any) => ({ ...prev, frequency: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Thời lượng/buổi</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="VD: 2h/buổi" value={formData.lessonDuration || ''} onChange={e => setFormData((prev: any) => ({ ...prev, lessonDuration: e.target.value }))} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Sĩ số</label>
                                        <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="VD: 12-15 học viên" value={formData.classSize || ''} onChange={e => setFormData((prev: any) => ({ ...prev, classSize: e.target.value }))} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Chọn Giảng viên *</label>
                                            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required value={formData.teacherId} onChange={e => setFormData((prev: any) => ({ ...prev, teacherId: e.target.value }))}>
                                                <option value="">-- Chọn giảng viên --</option>
                                                {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.fullName || t.full_name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Trạng thái</label>
                                            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={formData.status} onChange={e => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}>
                                                <option value="published">Hiển thị (Published)</option>
                                                <option value="hidden">Đang ẩn (Hidden)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả ngắn</label>
                                        <textarea className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" rows={2} value={formData.shortDesc} onChange={e => setFormData((prev: any) => ({ ...prev, shortDesc: e.target.value }))}></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh Khóa Học</label>
                                        <div className="relative border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
                                            <input type="file" accept="image/*" className="hidden" onChange={handleCourseImageUpload} disabled={isUploading} id="image-input" />
                                            <label htmlFor="image-input" className="block w-full h-full cursor-pointer">
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                                                        <Loader2 size={32} className="animate-spin text-blue-600" />
                                                        <span className="text-sm text-slate-600">Đang tải...</span>
                                                    </div>
                                                ) : formData.imageUrl ? (
                                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-40 object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-500">
                                                        <UploadCloud size={32} />
                                                        <span className="text-sm">Click hoặc kéo thả ảnh</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                                        Hủy
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                                        Tiếp theo <ArrowRight size={16} />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* BƯỚC 2: GIAO DIỆN NHẬP LỘ TRÌNH (SYLLABUS) */}
                        {step === 2 && (
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-blue-600">Lộ trình khóa học (Syllabus)</h4>
                                            <p className="text-xs text-slate-500 mt-1">Khóa học ID: #{formData.id} đã được khởi tạo</p>
                                        </div>
                                        <button type="button" onClick={handleAddSyllabus} className="flex items-center gap-2 px-3 py-2 border border-blue-600 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm whitespace-nowrap">
                                            <Plus size={16} /> Thêm bài học
                                        </button>
                                    </div>

                                    {formData.syllabus.length === 0 ? (
                                        <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-slate-600">
                                            Chưa có lộ trình nào. Hãy bấm "Thêm bài học" để cập nhật giáo trình môn học!
                                        </div>
                                    ) : (
                                        formData.syllabus.map((item: any, index: number) => (
                                            <div key={index} className="relative bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                <button type="button" onClick={() => handleRemoveSyllabus(index)} className="absolute top-4 right-4 p-2 hover:bg-red-100 text-red-600 rounded transition-colors">
                                                    <Trash2 size={16} />
                                                </button>

                                                <div className="pr-10">
                                                    <div className="mb-3">
                                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Chương / Bài {index + 1}: Tiêu đề *</label>
                                                        <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required placeholder="VD: Khởi tạo dự án và cấu hình biến" value={item.title} onChange={e => handleSyllabusChange(index, 'title', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nội dung chi tiết chương</label>
                                                        <textarea className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" rows={2} placeholder="Mô tả nội dung..." value={item.description} onChange={e => handleSyllabusChange(index, 'description', e.target.value)}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                                        <ArrowLeft size={16} /> Sửa thông tin cơ bản
                                    </button>

                                    <button type="button" onClick={handleSaveSyllabus} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                                        <Check size={16} /> Hoàn tất & Lưu lộ trình
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
