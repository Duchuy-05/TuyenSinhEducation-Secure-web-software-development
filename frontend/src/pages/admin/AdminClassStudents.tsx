import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Search, Trash2, Users } from 'lucide-react';
import { classApi, userApi } from '../../services/class.api';
import type { ClassItem, Enrollment, StudentUser } from '../../services/class.api';

const formatDate = (value?: string | null) => {
    if (!value) return 'Chưa cập nhật';
    return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
};

const getStudentName = (student?: StudentUser) => student?.fullName || 'Chưa có tên';

const AdminClassStudents: React.FC = () => {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [students, setStudents] = useState<StudentUser[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
    const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEnrollmentLoading, setIsEnrollmentLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedClass = useMemo(
        () => classes.find((item) => item.id === selectedClassId),
        [classes, selectedClassId]
    );

    const enrolledUserIds = useMemo(
        () => new Set(enrollments.map((enrollment) => enrollment.userId)),
        [enrollments]
    );

    const availableStudents = useMemo(
        () => students.filter((student) => !enrolledUserIds.has(student.id)),
        [students, enrolledUserIds]
    );

    const isClassFull = Boolean(
        selectedClass && selectedClass.maxStudents > 0 && enrollments.length >= selectedClass.maxStudents
    );

    const filteredEnrollments = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return enrollments;

        return enrollments.filter((enrollment) => {
            const student = enrollment.user;
            return (
                student?.fullName?.toLowerCase().includes(keyword) ||
                student?.email?.toLowerCase().includes(keyword) ||
                student?.phone?.toLowerCase().includes(keyword)
            );
        });
    }, [enrollments, searchTerm]);

    const fetchEnrollments = async (classId: number) => {
        setIsEnrollmentLoading(true);
        try {
            const data = await classApi.getClassEnrollments(classId);
            setEnrollments(data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách học viên trong lớp:', error);
            alert('Không thể tải danh sách học viên trong lớp.');
        } finally {
            setIsEnrollmentLoading(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [classData, studentData] = await Promise.all([
                    classApi.getAllClasses(),
                    userApi.getStudents(),
                ]);
                setClasses(classData);
                setStudents(studentData);

                if (classData.length > 0) {
                    setSelectedClassId(classData[0].id);
                    await fetchEnrollments(classData[0].id);
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu quản lý lớp:', error);
                alert('Không thể tải dữ liệu quản lý lớp.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleClassChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const classId = Number(event.target.value);
        setSelectedClassId(classId);
        setSelectedStudentId('');
        setSearchTerm('');
        await fetchEnrollments(classId);
    };

    const handleAddStudent = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedClassId || !selectedStudentId) return;

        setIsSubmitting(true);
        try {
            await classApi.addStudentToClass(selectedClassId, selectedStudentId);
            setSelectedStudentId('');
            await fetchEnrollments(selectedClassId);
            alert('Thêm học viên vào lớp thành công!');
        } catch (error: any) {
            console.error('Lỗi khi thêm học viên vào lớp:', error);
            alert(error.message || 'Không thể thêm học viên vào lớp.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveStudent = async (enrollment: Enrollment) => {
        const studentName = getStudentName(enrollment.user);
        if (!window.confirm(`Bạn có chắc chắn muốn gỡ ${studentName} khỏi lớp này không?`)) {
            return;
        }

        try {
            await classApi.removeStudentFromClass(enrollment.id);
            setEnrollments((prev) => prev.filter((item) => item.id !== enrollment.id));
            alert('Đã gỡ học viên khỏi lớp.');
        } catch (error) {
            console.error('Lỗi khi gỡ học viên khỏi lớp:', error);
            alert('Không thể gỡ học viên khỏi lớp.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý học viên trong lớp</h1>
                    <p className="mt-1 text-sm text-slate-500">Thêm hoặc gỡ học viên khỏi từng lớp học đang mở trên hệ thống.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Chọn lớp học</label>
                    <select
                        value={selectedClassId}
                        onChange={handleClassChange}
                        disabled={isLoading || classes.length === 0}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        {classes.length === 0 ? (
                            <option value="">Chưa có lớp học</option>
                        ) : (
                            classes.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.className}
                                </option>
                            ))
                        )}
                    </select>

                    {selectedClass && (
                        <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-lg bg-slate-50 p-3">
                                <div className="text-xs font-semibold uppercase text-slate-500">Khóa học</div>
                                <div className="mt-1 font-medium text-slate-900">{selectedClass.course?.title || 'Chưa cập nhật'}</div>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-3">
                                <div className="text-xs font-semibold uppercase text-slate-500">Giảng viên</div>
                                <div className="mt-1 font-medium text-slate-900">{selectedClass.teacher?.fullName || 'Chưa phân công'}</div>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-3">
                                <div className="text-xs font-semibold uppercase text-slate-500">Thời gian</div>
                                <div className="mt-1 font-medium text-slate-900">{formatDate(selectedClass.startDate)}</div>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-3">
                                <div className="text-xs font-semibold uppercase text-slate-500">Sĩ số</div>
                                <div className="mt-1 font-medium text-slate-900">
                                    {enrollments.length}/{selectedClass.maxStudents} học viên
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <form onSubmit={handleAddStudent} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                            <Plus size={18} />
                        </div>
                        <h2 className="text-base font-bold text-slate-900">Thêm học viên</h2>
                    </div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Học viên chưa có trong lớp</label>
                    <select
                        value={selectedStudentId}
                        onChange={(event) => setSelectedStudentId(Number(event.target.value))}
                        disabled={!selectedClassId || availableStudents.length === 0 || isClassFull || isSubmitting}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="">
                            {isClassFull
                                ? 'Lớp đã đủ sĩ số'
                                : availableStudents.length === 0
                                    ? 'Không còn học viên phù hợp'
                                    : '-- Chọn học viên --'}
                        </option>
                        {availableStudents.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.fullName} - {student.email}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={!selectedStudentId || isClassFull || isSubmitting}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        Thêm vào lớp
                    </button>
                </form>
            </div>

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Danh sách học viên</h2>
                            <p className="text-sm text-slate-500">{filteredEnrollments.length} học viên đang hiển thị</p>
                        </div>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Tìm theo tên, email, số điện thoại..."
                            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Học viên</th>
                                <th className="px-6 py-3">Liên hệ</th>
                                <th className="px-6 py-3">Ngày thêm</th>
                                <th className="px-6 py-3">Trạng thái</th>
                                <th className="px-6 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading || isEnrollmentLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={28} className="animate-spin text-blue-600" />
                                            Đang tải danh sách học viên...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Lớp này chưa có học viên phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredEnrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="transition hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={enrollment.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(getStudentName(enrollment.user))}&background=e0f2fe&color=0369a1`}
                                                    alt={getStudentName(enrollment.user)}
                                                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                                                />
                                                <div>
                                                    <div className="font-semibold text-slate-900">{getStudentName(enrollment.user)}</div>
                                                    <div className="text-xs text-slate-500">ID: #{enrollment.userId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="font-medium text-slate-800">{enrollment.user?.email || 'Chưa cập nhật'}</div>
                                            <div className="mt-1 text-slate-500">{enrollment.user?.phone || 'Chưa có số điện thoại'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{formatDate(enrollment.enrolledAt)}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                {enrollment.status === 'active' ? 'Đang học' : enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRemoveStudent(enrollment)}
                                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                title="Gỡ khỏi lớp"
                                            >
                                                <Trash2 size={16} />
                                                Gỡ
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminClassStudents;
