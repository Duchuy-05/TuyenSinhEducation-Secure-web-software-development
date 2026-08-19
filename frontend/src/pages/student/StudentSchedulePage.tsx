import React, { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Search,
    UserRound,
} from 'lucide-react';
import { ClassSchedule, Enrollment, classApi } from '../../services/class.api';

type ScheduleItem = ClassSchedule & {
    className: string;
    courseTitle: string;
    teacherName: string;
};

const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'upcoming', label: 'Sắp diễn ra' },
    { value: 'ongoing', label: 'Đang học' },
    { value: 'completed', label: 'Đã hoàn thành' },
];

const getStartOfWeek = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
};

const addDays = (date: Date, days: number) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
};

const getDateKey = (date: string) => {
    const value = new Date(date);
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const StudentSchedulePage: React.FC = () => {
    const [myClasses, setMyClasses] = useState<Enrollment[]>([]);
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setIsLoading(true);
                setError('');

                const user = JSON.parse(localStorage.getItem('user') || '{}');

                if (!user.id) {
                    setError('Không tìm thấy thông tin học viên. Vui lòng đăng nhập lại.');
                    return;
                }

                const enrollments = await classApi.getMyClasses(user.id);
                setMyClasses(enrollments);

                const scheduleGroups = await Promise.all(
                    enrollments.map(async ({ class: cls }) => {
                        try {
                            const classSchedules = await classApi.getClassSchedule(cls.id);

                            return classSchedules.map((schedule) => ({
                                ...schedule,
                                className: cls.className,
                                courseTitle: cls.course.title,
                                teacherName: cls.teacher.fullName,
                            }));
                        } catch (err) {
                            console.error(`Lỗi khi tải lịch lớp ${cls.id}:`, err);
                            return [];
                        }
                    })
                );

                setSchedules(
                    scheduleGroups
                        .flat()
                        .sort(
                            (a, b) =>
                                new Date(a.startTime).getTime() -
                                new Date(b.startTime).getTime()
                        )
                );
            } catch (err) {
                console.error('Lỗi khi tải lịch học:', err);
                setError('Không thể tải lịch học. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    const formatShortDate = (date: string) =>
        new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
        });

    const formatTime = (date: string) =>
        new Date(date).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'Đang học';
            case 'upcoming':
                return 'Sắp diễn ra';
            case 'completed':
                return 'Đã hoàn thành';
            default:
                return status;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'upcoming':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const filteredSchedules = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        return schedules.filter((schedule) => {
            const matchesKeyword =
                !keyword ||
                schedule.sessionTitle.toLowerCase().includes(keyword) ||
                schedule.className.toLowerCase().includes(keyword) ||
                schedule.courseTitle.toLowerCase().includes(keyword) ||
                schedule.teacherName.toLowerCase().includes(keyword);

            const matchesClass =
                selectedClass === 'all' || String(schedule.classId) === selectedClass;
            const matchesStatus =
                selectedStatus === 'all' || schedule.status === selectedStatus;

            return matchesKeyword && matchesClass && matchesStatus;
        });
    }, [schedules, searchTerm, selectedClass, selectedStatus]);

    const weekEnd = useMemo(() => {
        const end = addDays(weekStart, 6);
        end.setHours(23, 59, 59, 999);
        return end;
    }, [weekStart]);

    const weekSchedules = useMemo(() => {
        return filteredSchedules.filter((schedule) => {
            const startTime = new Date(schedule.startTime);
            return startTime >= weekStart && startTime <= weekEnd;
        });
    }, [filteredSchedules, weekStart, weekEnd]);

    const groupedSchedules = useMemo(() => {
        return weekSchedules.reduce<Record<string, ScheduleItem[]>>((groups, schedule) => {
            const dateKey = getDateKey(schedule.startTime);

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].push(schedule);
            return groups;
        }, {});
    }, [weekSchedules]);

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Đang tải lịch học của bạn...
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 bg-[#F5F7FA] min-h-screen">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">
                    Lịch học của tôi
                </h1>
                <p className="text-gray-500 mt-2 text-sm lg:text-base">
                    Xem toàn bộ lịch học của các lớp bạn đã đăng ký.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB] flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
                    <div className="relative">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="appearance-none w-full sm:w-64 px-4 py-2.5 pr-10 border border-[#E5E7EB] rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20"
                        >
                            <option value="all">Tất cả lớp học</option>
                            {myClasses.map(({ class: cls }) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.className}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="appearance-none w-full sm:w-52 px-4 py-2.5 pr-10 border border-[#E5E7EB] rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20"
                        >
                            {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                <div className="relative w-full lg:w-96 group">
                    <input
                        type="text"
                        placeholder="Tìm buổi học, lớp, khóa học, giáo viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all"
                    />
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E5664B]"
                    />
                </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Tuần đang xem</p>
                    <h2 className="text-lg font-bold text-[#1F2937] mt-1">
                        {formatDate(weekStart.toISOString())} - {formatDate(weekEnd.toISOString())}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {weekSchedules.length} buổi học trong tuần này
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setWeekStart(addDays(weekStart, -7))}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <ChevronLeft size={16} />
                        Tuần trước
                    </button>
                    <button
                        type="button"
                        onClick={() => setWeekStart(getStartOfWeek(new Date()))}
                        className="px-4 py-2 bg-orange-50 text-[#E5664B] rounded-xl text-sm font-bold hover:bg-orange-100"
                    >
                        Tuần này
                    </button>
                    <button
                        type="button"
                        onClick={() => setWeekStart(addDays(weekStart, 7))}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Tuần sau
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {weekSchedules.length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
                        <section key={date} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[#E5664B] text-white flex flex-col items-center justify-center shadow-sm">
                                    <span className="text-xs font-medium leading-none">Ngày</span>
                                    <span className="text-sm font-bold mt-1">
                                        {formatShortDate(daySchedules[0].startTime)}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1F2937] capitalize">
                                        {formatDate(daySchedules[0].startTime)}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {daySchedules.length} buổi học
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {daySchedules.map((schedule) => (
                                    <article
                                        key={schedule.id}
                                        className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                                            <div className="lg:w-40 flex-shrink-0">
                                                <p className="text-2xl font-bold text-[#1F2937]">
                                                    {formatTime(schedule.startTime)}
                                                </p>
                                                <p className="text-sm text-gray-500 font-medium">
                                                    đến {formatTime(schedule.endTime)}
                                                </p>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full border text-xs font-bold ${getStatusStyle(
                                                            schedule.status
                                                        )}`}
                                                    >
                                                        {getStatusText(schedule.status)}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                                                        Buổi {schedule.sessionNumber}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-bold text-[#1F2937] leading-snug">
                                                    {schedule.sessionTitle}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {schedule.className} · {schedule.courseTitle}
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-2">
                                                        <UserRound
                                                            size={16}
                                                            className="text-[#E5664B]"
                                                        />
                                                        {schedule.teacherName}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <MapPin
                                                            size={16}
                                                            className="text-[#E5664B]"
                                                        />
                                                        {schedule.location || 'Chưa cập nhật'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 mb-6 bg-orange-50 rounded-full flex items-center justify-center">
                        <CalendarDays size={42} className="text-[#E5664B]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-2">
                        Tuần này chưa có lịch học phù hợp
                    </h3>
                    <p className="text-gray-500 max-w-md">
                        Hãy chuyển tuần hoặc thay đổi bộ lọc để xem các buổi học khác.
                    </p>
                </div>
            )}
        </div>
    );
};

export default StudentSchedulePage;
