import React, { useEffect, useState } from 'react';
import {
    School, Activity, GraduationCap,
    Search, ChevronDown, Calendar, Clock,
    PlayCircle, Send, User, MessageCircle
} from 'lucide-react';
import { ClassSchedule, Enrollment, classApi } from '../../services/class.api';

// --- MOCK DATA ---
const mockData = {
    statistics: {
        total: 4,
        active: 2,
        upcoming: 1,
        completed: 1
    },
    classes: [
        {
            id: 'cls1',
            className: 'K14 - ReactJS Master',
            courseName: 'ReactJS Từ Cơ Bản Đến Nâng Cao',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
            status: 'Đang học',
            progress: 65,
            schedule: 'Thứ 2 - Thứ 4 | 19:30 - 21:30',
            instructor: { name: 'Thầy Tuấn Anh', avatar: 'https://ui-avatars.com/api/?name=Tuan+Anh&background=1F2937&color=fff' }
        },
        {
            id: 'cls2',
            className: 'K08 - Backend NodeJS',
            courseName: 'Xây dựng API với Node.js & Express',
            thumbnail: 'https://images.unsplash.com/photo-1627398240411-bdc58c150ee9?auto=format&fit=crop&q=80&w=800',
            status: 'Đang học',
            progress: 30,
            schedule: 'Thứ 3 - Thứ 5 | 19:30 - 21:30',
            instructor: { name: 'Cô Thanh Xuân', avatar: 'https://ui-avatars.com/api/?name=Thanh+Xuan&background=1F2937&color=fff' }
        },
        {
            id: 'cls3',
            className: 'K20 - Tiếng Anh Giao Tiếp',
            courseName: 'Tiếng Anh Thực Chiến Đi Làm',
            thumbnail: 'https://images.unsplash.com/photo-1546410531-ea4cea477149?auto=format&fit=crop&q=80&w=800',
            status: 'Sắp khai giảng',
            progress: 0,
            schedule: 'Thứ 7 - CN | 09:00 - 11:00',
            instructor: { name: 'Mr. John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=1F2937&color=fff' }
        },
        {
            id: 'cls4',
            className: 'K05 - Cấu trúc dữ liệu',
            courseName: 'CTDL & Giải thuật cơ bản',
            thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800',
            status: 'Đã kết thúc',
            progress: 100,
            schedule: 'Thứ 2 - Thứ 4 | 18:00 - 20:00',
            instructor: { name: 'Thầy Tuấn Anh', avatar: 'https://ui-avatars.com/api/?name=Tuan+Anh&background=1F2937&color=fff' }
        }
    ],
    upcomingSessions: [
        { id: 1, className: 'K14 - ReactJS Master', topic: 'Buổi 12: Context API & Redux', time: 'Hôm nay, 19:30' },
        { id: 2, className: 'K08 - Backend NodeJS', topic: 'Buổi 05: Kết nối MongoDB', time: 'Ngày mai, 19:30' },
    ],
    chatHistory: [
        { id: 1, sender: 'instructor', name: 'Thầy Tuấn Anh', time: '10:00', message: 'Chào cả lớp, tối nay chúng ta sẽ học về Redux nhé. Các em nhớ cài đặt thư viện trước khi vào học.' },
        { id: 2, sender: 'student', name: 'Tôi', time: '10:15', message: 'Thầy ơi, mình dùng Redux Toolkit hay Redux Core ạ?' },
        { id: 3, sender: 'instructor', name: 'Thầy Tuấn Anh', time: '10:20', message: 'Chúng ta sẽ học thẳng lên Redux Toolkit luôn cho thực tế em nhé!' },
        { id: 4, sender: 'student', name: 'Tôi', time: '10:25', message: 'Dạ vâng, em cảm ơn thầy.' },
    ]
};




const StudentClasses: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState(mockData.chatHistory);
    const [myClasses, setMyClasses] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [classSchedules, setClassSchedules] = useState<
        Record<number, ClassSchedule[]>
    >({});

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setIsLoading(true);

                setIsLoading(true);

                const user = JSON.parse(localStorage.getItem("user") || "{}");

                if (!user.id) {
                    console.error("User ID not found");
                    return;
                }

                const data = await classApi.getMyClasses(user.id);
                setMyClasses(data);
            } catch (err) {
                console.error("Lỗi khi tải lớp học:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        if (myClasses.length === 0) return;

        const fetchSchedules = async () => {
            const scheduleMap: Record<number, ClassSchedule[]> = {};

            await Promise.all(
                myClasses.map(async ({ class: cls }) => {
                    try {
                        const schedules = await classApi.getClassSchedule(cls.id); 
                        scheduleMap[cls.id] = schedules;
                    } catch (err) {
                        console.error(`Lỗi khi tải lịch lớp ${cls.id}:`, err);
                        scheduleMap[cls.id] = [];
                    }
                })
            );

            setClassSchedules(scheduleMap);
        };

        fetchSchedules();
    }, [myClasses]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
        });

    const formatTime = (date: string) =>
        new Date(date).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });

    const getProgress = (status: string) => {
        switch (status) {
            case "completed":
                return 100;
            case "ongoing":
                return 50;
            case "upcoming":
            default:
                return 0;
        }
    };

    const statistics = {
        total: myClasses.length,
        active: myClasses.filter(c => c.class.status === "ongoing").length,
        upcoming: myClasses.filter(c => c.class.status === "upcoming").length,
        completed: myClasses.filter(c => c.class.status === "completed").length,
    };

    const statCards = [
        {
            title: "Tổng lớp học",
            value: statistics.total,
            icon: <School size={24} />,
            bg: "bg-gray-100",
            color: "text-gray-700",
        },
        {
            title: "Đang hoạt động",
            value: statistics.active,
            icon: <Activity size={24} />,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            title: "Sắp khai giảng",
            value: statistics.upcoming,
            icon: <Clock size={24} />,
            bg: "bg-amber-50",
            color: "text-amber-600",
        },
        {
            title: "Hoàn thành",
            value: statistics.completed,
            icon: <GraduationCap size={24} />,
            bg: "bg-emerald-50",
            color: "text-emerald-600",
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ongoing":
                return "bg-blue-100 text-blue-700";

            case "upcoming":
                return "bg-amber-100 text-amber-700";

            case "completed":
                return "bg-emerald-100 text-emerald-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "ongoing":
                return "Đang học";
            case "upcoming":
                return "Sắp khai giảng";
            case "completed":
                return "Đã kết thúc";
            default:
                return status;
        }
    };

    const filteredClasses = myClasses.filter((item) => {
        const keyword = searchTerm.toLowerCase();

        return (
            item.class.className.toLowerCase().includes(keyword) ||
            item.class.course.title.toLowerCase().includes(keyword)
        );
    });

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'student',
            name: 'Tôi',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: chatInput
        };

        setMessages([...messages, newMessage]);
        setChatInput('');
    };

    if (isLoading) return <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>Đang tải danh sách lớp học...</div>;

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 bg-[#F5F7FA] min-h-screen">

            {/* Header Section */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">Lớp học của tôi</h1>
                <p className="text-gray-500 mt-2 text-sm lg:text-base">Theo dõi lịch học, tham gia lớp trực tuyến và trao đổi cùng giảng viên.</p>
            </div>

            {/* Statistics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[#1F2937] leading-tight">{stat.value}</h3>
                            <p className="text-sm text-gray-500 font-medium mt-1">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Trạng thái: Tất cả <ChevronDown size={16} />
                    </button>
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Sắp xếp: Mới nhất <ChevronDown size={16} />
                    </button>
                </div>

                <div className="relative w-full md:w-80 group">
                    <input
                        type="text"
                        placeholder="Tìm theo tên lớp hoặc khóa học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#E5664B]" />
                </div>
            </div>

            {/* Class Grid */}
            {filteredClasses.length > 0 ? (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map(({ class: cls }) => {
                        const schedules = classSchedules[cls.id] || [];

                        const nextSession =
                            schedules.find((s) => s.status === "ongoing") ??
                            schedules.find((s) => s.status === "upcoming");

                        return (
                            <div
                                key={cls.id}
                                className="bg-white rounded-[16px] shadow-sm hover:shadow-xl border border-[#E5E7EB] overflow-hidden hover:-translate-y-1.5 transition-all duration-300 group flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={cls.course.imageUrl}
                                        alt={cls.className}
                                        className="w-full h-full object-cover"
                                    />

                                    <span
                                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold backdrop-blur-md bg-white/95 ${getStatusBadge(cls.status).split(" ")[1]
                                            }`}
                                    >
                                        {getStatusText(cls.status)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-[#1F2937] text-lg mb-1 leading-snug group-hover:text-[#E5664B] transition-colors">
                                        {cls.className}
                                    </h3>

                                    <p className="text-sm text-gray-500 mb-4 line-clamp-1">
                                        {cls.course.title}
                                    </p>

                                    <div className="flex items-center gap-2 mb-4">
                                        <img
                                            src={cls.teacher.avatarUrl}
                                            alt={cls.teacher.fullName}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-sm text-gray-700 font-medium">
                                            {cls.teacher.fullName}
                                        </span>
                                    </div>

                                    {/* Schedule */}
                                    <div className="flex items-start gap-3 mb-5 text-sm bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                                        <Calendar
                                            size={18}
                                            className="text-[#E5664B] mt-0.5 flex-shrink-0"
                                        />

                                        <div className="flex-1">
                                            {nextSession ? (
                                                <>
                                                    <p className="font-semibold text-gray-800">
                                                        {nextSession.sessionTitle}
                                                    </p>

                                                    <p className="text-gray-500 mt-1">
                                                        {formatDate(nextSession.startTime)}
                                                    </p>

                                                    <p className="font-bold text-[#E5664B]">
                                                        {formatTime(nextSession.startTime)} -{" "}
                                                        {formatTime(nextSession.endTime)}
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {nextSession.location}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-gray-500">
                                                    Chưa có lịch học
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-auto mb-6">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-xs font-medium text-gray-500">
                                                Tiến độ của bạn
                                            </span>

                                            <span className="text-xs font-bold text-[#E5664B]">
                                                {getProgress(cls.status)}%
                                            </span>
                                        </div>

                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-[#E5664B] h-1.5 rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${getProgress(cls.status)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex gap-2 border-t border-gray-100 pt-5">
                                        <button className="flex-1 bg-[#E5664B] hover:bg-[#d6553a] text-white font-medium py-2.5 px-3 rounded-xl text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2">
                                            <PlayCircle size={18} />
                                            Vào lớp
                                        </button>

                                        <button className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center">
                                            Tài liệu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                        <School size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-2">Không tìm thấy lớp học</h3>
                    <p className="text-gray-500 mb-6">Hãy thử tìm kiếm với một từ khóa khác.</p>
                </div>
            )}

            

        </div>
    );
};

export default StudentClasses;
