import React, { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    Bell,
    ChevronDown,
    Clock,
    Megaphone,
    Pin,
    Search,
    UserRound,
} from 'lucide-react';
import {
    Announcement,
    AnnouncementType,
    announcementApi,
} from '../../services/announcement.api';

const typeOptions: Array<{ value: 'all' | AnnouncementType; label: string }> = [
    { value: 'all', label: 'Tất cả loại' },
    { value: 'general', label: 'Thông báo chung' },
    { value: 'urgent', label: 'Quan trọng' },
    { value: 'homework', label: 'Bài tập' },
];

const StudentAnnouncementsPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedType, setSelectedType] = useState<'all' | AnnouncementType>('all');
    const [showPinnedOnly, setShowPinnedOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setIsLoading(true);
                setError('');

                const user = JSON.parse(localStorage.getItem('user') || '{}');

                if (!user.id) {
                    setError('Không tìm thấy thông tin học viên. Vui lòng đăng nhập lại.');
                    return;
                }

                const data = await announcementApi.getMyAnnouncements(user.id);
                setAnnouncements(data);
            } catch (err) {
                console.error('Lỗi khi tải thông báo:', err);
                setError('Không thể tải danh sách thông báo. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const classOptions = useMemo(() => {
        const classes = new Map<number, string>();

        announcements.forEach((announcement) => {
            if (announcement.class?.id) {
                classes.set(announcement.class.id, announcement.class.className);
            }
        });

        return Array.from(classes, ([id, className]) => ({ id, className }));
    }, [announcements]);

    const filteredAnnouncements = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        return announcements.filter((announcement) => {
            const className = announcement.class?.className || '';
            const courseTitle = announcement.class?.course?.title || '';
            const teacherName = announcement.teacher?.fullName || '';

            const matchesKeyword =
                !keyword ||
                announcement.title.toLowerCase().includes(keyword) ||
                announcement.content.toLowerCase().includes(keyword) ||
                className.toLowerCase().includes(keyword) ||
                courseTitle.toLowerCase().includes(keyword) ||
                teacherName.toLowerCase().includes(keyword);

            const matchesClass =
                selectedClass === 'all' || String(announcement.classId) === selectedClass;
            const matchesType = selectedType === 'all' || announcement.type === selectedType;
            const matchesPinned = !showPinnedOnly || announcement.isPinned;

            return matchesKeyword && matchesClass && matchesType && matchesPinned;
        });
    }, [announcements, searchTerm, selectedClass, selectedType, showPinnedOnly]);

    const formatDateTime = (date: string) =>
        new Date(date).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    const getTypeText = (type: AnnouncementType) => {
        switch (type) {
            case 'urgent':
                return 'Quan trọng';
            case 'homework':
                return 'Bài tập';
            case 'general':
            default:
                return 'Thông báo chung';
        }
    };

    const getTypeStyle = (type: AnnouncementType) => {
        switch (type) {
            case 'urgent':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'homework':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'general':
            default:
                return 'bg-orange-50 text-[#E5664B] border-orange-100';
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Đang tải thông báo lớp học...
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 bg-[#F5F7FA] min-h-screen">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">
                    Thông báo lớp học
                </h1>
                <p className="text-gray-500 mt-2 text-sm lg:text-base">
                    Theo dõi thông báo mới nhất từ các lớp học bạn đã đăng ký.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB] flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto">
                    <div className="relative">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="appearance-none w-full sm:w-60 px-4 py-2.5 pr-10 border border-[#E5E7EB] rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20"
                        >
                            <option value="all">Tất cả lớp học</option>
                            {classOptions.map((cls) => (
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
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as 'all' | AnnouncementType)}
                            className="appearance-none w-full sm:w-48 px-4 py-2.5 pr-10 border border-[#E5E7EB] rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20"
                        >
                            {typeOptions.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>

                    <label className="flex items-center gap-3 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-gray-700 bg-white cursor-pointer hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={showPinnedOnly}
                            onChange={(e) => setShowPinnedOnly(e.target.checked)}
                            className="w-4 h-4 accent-[#E5664B]"
                        />
                        Chỉ xem ghim
                    </label>
                </div>

                <div className="relative w-full xl:w-96 group">
                    <input
                        type="text"
                        placeholder="Tìm tiêu đề, nội dung, lớp, giáo viên..."
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

            {filteredAnnouncements.length > 0 ? (
                <div className="space-y-4">
                    {filteredAnnouncements.map((announcement) => (
                        <article
                            key={announcement.id}
                            className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow ${
                                announcement.isPinned
                                    ? 'border-orange-200'
                                    : 'border-[#E5E7EB]'
                            }`}
                        >
                            <div className="flex flex-col lg:flex-row gap-5">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#E5664B] flex items-center justify-center flex-shrink-0">
                                    <Megaphone size={24} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="mb-3">
                                        <p className="text-xs font-bold uppercase tracking-wide text-[#E5664B]">
                                            {announcement.class?.className || 'Lớp học'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {announcement.class?.course?.title || 'Khóa học'}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {announcement.isPinned && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold">
                                                <Pin size={13} />
                                                Đã ghim
                                            </span>
                                        )}
                                        <span
                                            className={`px-2.5 py-1 rounded-full border text-xs font-bold ${getTypeStyle(
                                                announcement.type
                                            )}`}
                                        >
                                            {getTypeText(announcement.type)}
                                        </span>
                                    </div>

                                    <h2 className="text-lg lg:text-xl font-bold text-[#1F2937] leading-snug">
                                        {announcement.title}
                                    </h2>

                                    <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-line">
                                        {announcement.content}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-5 pt-4 border-t border-gray-100 text-sm text-gray-600">
                                        <span className="flex items-center gap-2">
                                            <UserRound size={16} className="text-[#E5664B]" />
                                            {announcement.teacher?.fullName || 'Giáo viên'}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Clock size={16} className="text-[#E5664B]" />
                                            {formatDateTime(announcement.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 mb-6 bg-orange-50 rounded-full flex items-center justify-center">
                        <Bell size={42} className="text-[#E5664B]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-2">
                        Chưa có thông báo phù hợp
                    </h3>
                    <p className="text-gray-500 max-w-md">
                        Các thông báo từ lớp học bạn đã đăng ký sẽ xuất hiện tại đây.
                    </p>
                </div>
            )}
        </div>
    );
};

export default StudentAnnouncementsPage;
